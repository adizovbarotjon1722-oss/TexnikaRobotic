// Telegram: mijoz boti (ariza, rasm, AI tashxis, holat) va Telegram Mini App API (mijoz va admin).
import crypto from 'crypto';
import { db, now, J } from './db.mjs';
import { rateLimit, randToken, sha256, clean, sniffImage, decodeImage } from './security.mjs';
import { api, sendTo, sendText, tgChat, botToken, downloadFile, parseCommand } from './telegram.mjs';
import { diagnose, aiEnabled } from './ai.mjs';
import { stats } from './analytics.mjs';
import { LANGS, fmt } from '../src/i18n.mjs';
import { esc } from '../src/template.mjs';
import { equipmentByCode, eqLabel, searchErrors, EQ_RE } from './ops.mjs';

const CODE_RE = /^TX-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
const pickLang = (c) => (String(c || '').startsWith('ru') ? 'ru' : String(c || '').startsWith('en') ? 'en' : 'uz');
const today = () => new Date().toISOString().slice(0, 10);
const addDays = (d, n) => new Date(Date.parse(d) + n * 864e5).toISOString().slice(0, 10);

// Telegram WebApp initData imzosini tekshirish (core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app)
export function verifyInitData(initData, token = botToken(), maxAgeSec = 86400) {
  if (!token || typeof initData !== 'string' || initData.length > 4096) return null;
  const p = new URLSearchParams(initData);
  const hash = p.get('hash');
  if (!hash || !/^[a-f0-9]{64}$/.test(hash)) return null;
  p.delete('hash');
  const dcs = [...p.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)).map(([k, v]) => `${k}=${v}`).join('\n');
  const secret = crypto.createHmac('sha256', 'WebAppData').update(token).digest();
  const calc = crypto.createHmac('sha256', secret).update(dcs).digest();
  if (!crypto.timingSafeEqual(calc, Buffer.from(hash, 'hex'))) return null;
  const auth = parseInt(p.get('auth_date'), 10) || 0;
  if (Math.abs(Date.now() / 1000 - auth) > maxAgeSec) return null;
  const user = J(p.get('user'), null);
  return user && user.id ? user : null;
}

export function createTgApp(ctx) {
  const { json, readJson, cfg, T, createRequest, addUpdate, miniAppButton, STATUSES } = ctx;
  const adminIds = () => new Set([tgChat(), ...String(process.env.TELEGRAM_ADMIN_IDS || '').split(/[\s,]+/), ...String(ctx.setting('admin_tg_ids') || '').split(/[\s,]+/)].filter((x) => /^-?\d+$/.test(x)));
  const isAdmin = (id) => adminIds().has(String(id));

  function upsertUser(u, extra = {}) {
    const id = String(u.id);
    const lang = pickLang(u.language_code);
    const ex = db.prepare('SELECT * FROM tg_users WHERE tg_id = ?').get(id);
    if (!ex) db.prepare('INSERT INTO tg_users(tg_id, first_name, username, lang, created_at, last_seen) VALUES (?,?,?,?,?,?)').run(id, clean(u.first_name, 60), clean(u.username, 40), lang, now(), now());
    else db.prepare('UPDATE tg_users SET first_name = ?, username = ?, last_seen = ?, blocked = 0 WHERE tg_id = ?').run(clean(u.first_name, 60), clean(u.username, 40), now(), id);
    for (const [k, v] of Object.entries(extra)) db.prepare(`UPDATE tg_users SET ${k} = ? WHERE tg_id = ?`).run(v, id);
    return db.prepare('SELECT * FROM tg_users WHERE tg_id = ?').get(id);
  }
  const setState = (id, st) => db.prepare('UPDATE tg_users SET state = ? WHERE tg_id = ?').run(st ? JSON.stringify(st) : null, String(id));
  const customersOf = (id) => db.prepare('SELECT c.id, c.company FROM customer_users cu JOIN customers c ON c.id = cu.customer_id WHERE cu.tg_id = ?').all(String(id));

  function linkCustomer(tgId, code) {
    const c = db.prepare('SELECT * FROM customers WHERE link_code = ?').get(String(code || '').toUpperCase());
    if (!c) return null;
    db.prepare('INSERT OR IGNORE INTO customer_users(customer_id, tg_id, created_at) VALUES (?, ?, ?)').run(c.id, String(tgId), now());
    sendText(`🔗 Telegram foydalanuvchi «${esc(c.company)}» korxonasiga ulandi.`).catch(() => {});
    return c;
  }

  // AI tashxis (yoqilgan bo'lsa) va ariza yaratish: bot va Mini App uchun umumiy
  async function makeRequest({ lang, name, phone, company = '', equipment = '', message, images = [], eq = null, tgId, source }) {
    let ai = null;
    if (aiEnabled() && rateLimit('ai:global', 300, 3600e3)) {
      try { ai = await diagnose({ lang, equipment: eq ? eqLabel(eq) : equipment, message, images }); } catch (e) { console.error('AI xato (tg):', e.message); }
    }
    const out = createRequest({ lang, name, phone, company, service: '', equipment, message, ai }, images, { source, equipment: eq, tgId: String(tgId) });
    return { ...out, ai };
  }
  function aiText(t, ai) {
    if (!ai) return '';
    const lines = [`\n<b>${t.tgx.aiTitle}</b>`, esc(ai.diagnosis), `${t.tgx.priority}: <b>${esc(t.ai.p[ai.priority] || ai.priority)}</b>`];
    if (ai.next_steps?.length) lines.push(`\n<i>${t.tgx.steps}:</i>`, ...ai.next_steps.slice(0, 4).map((s, i) => `${i + 1}. ${esc(s)}`));
    if (ai.safety) lines.push(`\n<b>${esc(ai.safety)}</b>`);
    return lines.join('\n');
  }
  function statusText(t, code) {
    const r = db.prepare('SELECT id, code, status, equipment, updated_at FROM requests WHERE code = ?').get(code);
    if (!r) return t.tgx.notFound;
    const ups = db.prepare('SELECT created_at, status, note FROM request_updates WHERE request_id = ? AND public = 1 ORDER BY id DESC LIMIT 5').all(r.id);
    return [`<b>${esc(r.code)}</b> · ${esc(t.track.s[r.status] || r.status)}`, r.equipment ? esc(r.equipment) : '', r.status === 'done' && ctx.warranty?.info(code)?.until ? fmt(t.tg5.wLine, { date: ctx.warranty.info(code).until }) : '', '', ...ups.map((u) => `${u.created_at.slice(0, 10)} · ${esc(t.track.s[u.status] || u.status)}${u.note ? `: ${esc(u.note)}` : ''}`)].filter((x, i) => x || i === 3).join('\n');
  }

  /* ---------- Mijoz boti ---------- */
  const albums = new Map(); // media_group_id -> { msgs, timer }
  async function customerMessage(msg) {
    const from = msg.from; if (!from || from.is_bot || msg.chat?.type !== 'private') return;
    const id = String(from.id);
    let u = upsertUser(from);
    if (u.blocked) return;
    const t = T(LANGS.includes(u.lang) ? u.lang : 'uz');
    const say = (text, extra = {}) => sendTo(id, text, extra).catch((e) => { if (/blocked|deactivated/.test(e.message)) db.prepare('UPDATE tg_users SET blocked = 1 WHERE tg_id = ?').run(id); });
    if (!rateLimit(`tgu:${id}`, 25, 600e3)) return say(t.tgx.tooFast);
    const st = J(u.state, {}) || {};
    const text = clean(msg.text || msg.caption || '', 2000);

    // Telefon raqami (faqat o'zinikini qabul qilamiz)
    if (msg.contact) {
      if (String(msg.contact.user_id) !== id) return;
      u = upsertUser(from, { phone: clean(msg.contact.phone_number, 20) });
      await say(t.tgx.thanksContact, { reply_markup: { remove_keyboard: true } });
      if (st.draft) { setState(id, { ...st, draft: null }); return submit(u, t, st, st.draft.text, st.draft.photos || [], say); }
      return;
    }
    if (text.startsWith('/')) {
      const [cmd, arg = ''] = text.split(/\s+/, 2);
      const c = cmd.replace(/@\w+$/, '').toLowerCase();
      if (c === '/start') {
        if (/^eq_EQ-[A-Z0-9]{4}-[A-Z0-9]{4}$/i.test(arg)) {
          const eq = equipmentByCode(arg.slice(3).toUpperCase());
          if (eq) { setState(id, { eq: eq.code }); return say(fmt(t.tgx.eqHello, { eq: esc(eqLabel(eq)) })); }
        }
        if (/^link_CL-[A-Z0-9]{4}-[A-Z0-9]{4}$/i.test(arg)) {
          const c2 = linkCustomer(id, arg.slice(5));
          if (c2) return say(fmt(t.tgx.linked, { company: esc(c2.company) }), miniAppButton(t.tgx.open, '#eq'));
        }
        setState(id, null);
        return say(fmt(t.tgx.hello, { name: esc(from.first_name || ''), brand: esc(cfg().brand) }), miniAppButton(t.tgx.open, ''));
      }
      if (c === '/holat' || c === '/status') {
        const code = arg.toUpperCase();
        if (!CODE_RE.test(code)) return say(t.tg4.help);
        const fl = J(u.follows, []);
        if (!fl.includes(code) && db.prepare('SELECT 1 FROM requests WHERE code = ?').get(code)) db.prepare('UPDATE tg_users SET follows = ? WHERE tg_id = ?').run(JSON.stringify([...fl, code].slice(-20)), id);
        return say(statusText(t, code), miniAppButton(t.tgx.open, `#r/${code}`));
      }
      if (c === '/ilova' || c === '/app') return say(t.tgx.open, miniAppButton(t.tgx.open, ''));
      if (c === '/xato' || c === '/error' || c === '/kod') {
        const q = clean(text.slice(cmd.length), 40);
        if (!q) return say(t.tg4.errAsk);
        const hits = searchErrors(q, LANGS.includes(u.lang) ? u.lang : 'uz', 3);
        if (!hits.length) return say(t.tg4.errNone);
        const base = cfg().domain + (u.lang && u.lang !== 'uz' ? `/${u.lang}` : '');
        return say(hits.map((x) => `<b>${esc(x.brand)} ${esc(x.code)}</b> · ${esc(x.title)}\n${x.causes.slice(0, 3).map((k) => `• ${esc(k)}`).join('\n')}\n<a href="${esc(`${base}/errors/${x.slug}/`)}">${esc(t.tg4.errMore)}</a>`).join('\n\n'), { disable_web_page_preview: true });
      }
      if (c === '/kafolat' || c === '/warranty' || c === '/garantiya') {
        const code = arg.toUpperCase();
        if (!CODE_RE.test(code)) return say(t.tg5.wAsk);
        const w = ctx.warranty.info(code);
        if (!w) return say(t.tg5.wNone);
        const msgKey = { active: 'wActive', expired: 'wExpired', not_done: 'wNotDone' }[w.status];
        return say(fmt(t.tg5[msgKey], { code: esc(code), date: w.until || '', n: w.days ?? '' }), miniAppButton(t.tgx.open, `#r/${code}`));
      }
      if (c === '/kurslar' || c === '/courses') {
        const a = ctx.academy.tgStatus(id, LANGS.includes(u.lang) ? u.lang : 'uz');
        if (!a.joined) return say(t.tg4.acNone, miniAppButton(t.tg4.app.academy, '#academy'));
        return say(a.courses.filter((x) => x.done || x.passed).map((x) => `${esc(fmt(t.tg4.acLine, { title: x.title, pct: x.pct }))}`).join('\n') || esc(t.tg4.acNone), miniAppButton(t.tg4.app.academy, '#academy'));
      }
      if ((c === '/otkazish' || c === '/skip') && st.review) { setState(id, null); ctx.reviews.notifyAdmin(st.review); return say(t.tg4.rateThanks); }
      return say(t.tg4.help, miniAppButton(t.tgx.open, ''));
    }

    if (st.review && text) {
      ctx.reviews.setText(st.review, text);
      setState(id, null);
      ctx.reviews.notifyAdmin(st.review);
      return say(t.tg4.rateThanks);
    }
    const photos = msg.photo?.length ? [msg.photo[msg.photo.length - 1].file_id] : (msg.document && /^image\//.test(msg.document.mime_type || '') ? [msg.document.file_id] : []);
    // Albom: bir nechta rasm alohida xabarlarda keladi, 2 soniya yig'amiz
    if (msg.media_group_id) {
      const key = `${id}:${msg.media_group_id}`;
      const a = albums.get(key) || { photos: [], text: '' };
      a.photos.push(...photos); if (text) a.text = text;
      clearTimeout(a.timer);
      a.timer = setTimeout(() => { albums.delete(key); handleDraft(u, t, st, a.text, a.photos.slice(0, 4), say).catch((e) => console.error('Bot:', e.message)); }, 2000);
      albums.set(key, a);
      return;
    }
    return handleDraft(u, t, st, text, photos, say);
  }
  async function handleDraft(u, t, st, text, photos, say) {
    if (text.length < 10) {
      if (photos.length) { setState(u.tg_id, { ...st, draft: { text: '', photos } }); }
      return say(t.tgx.askMore);
    }
    const allPhotos = [...(st.draft?.photos || []), ...photos].slice(0, 4);
    if (!u.phone) {
      setState(u.tg_id, { ...st, draft: { text, photos: allPhotos } });
      return say(t.tgx.askContact, { reply_markup: { keyboard: [[{ text: t.tgx.shareContact, request_contact: true }]], resize_keyboard: true, one_time_keyboard: true } });
    }
    setState(u.tg_id, { ...st, draft: null });
    return submit(u, t, st, text, allPhotos, say);
  }
  async function submit(u, t, st, text, photoIds, say) {
    if (!rateLimit(`tgreq:${u.tg_id}`, 5, 3600e3)) return say(t.tgx.tooFast);
    const images = [];
    for (const fid of photoIds.slice(0, 4)) {
      const buf = await downloadFile(fid).catch(() => null);
      const kind = buf && sniffImage(buf);
      if (kind) images.push({ ...kind, data: buf });
    }
    const eq = st.eq ? equipmentByCode(st.eq) : null;
    const lang = LANGS.includes(u.lang) ? u.lang : 'uz';
    await api('sendChatAction', { chat_id: u.tg_id, action: 'typing' }).catch(() => {});
    const out = await makeRequest({ lang, name: [u.first_name, u.username ? `@${u.username}` : ''].filter(Boolean).join(' ') || 'Telegram', phone: u.phone, message: text, images, eq, tgId: u.tg_id, source: eq ? 'telegram_qr' : 'telegram' });
    return say(fmt(t.tgx.created, { code: out.code }) + aiText(t, out.ai) + `\n\n${fmt(t.tg4.contact, { phone: esc(cfg().phone) })}`, miniAppButton(t.tgx.open, `#r/${out.code}`));
  }

  /* ---------- Admin chatdagi buyruqlar ---------- */
  async function adminMessage(msg) {
    const text = String(msg.text || '');
    const cmd = parseCommand(text);
    const isPrivate = msg.chat?.type === 'private';
    const appBtn = isPrivate ? miniAppButton('📱 Boshqaruv ilovasi', '#admin') : {};
    if (cmd?.cmd === 'help' || /^\/(ilova|app)/i.test(text)) return sendText('Buyruqlar:\n/oxirgi — oxirgi 5 ta ariza\n/holat TX-XXXX-XXXX holat izoh\n/profilaktika — 7 kun ichidagi ishlar\n/ilova — boshqaruv ilovasi\nHolatlar: ' + STATUSES.join(', '), appBtn);
    if (cmd?.cmd === 'last') {
      const rows = db.prepare('SELECT code, name, status, priority FROM requests ORDER BY id DESC LIMIT 5').all();
      return sendText(rows.map((r) => `<code>${r.code}</code> ${esc(r.name)} · ${r.status} · ${r.priority}`).join('\n') || 'Arizalar yo‘q', appBtn);
    }
    if (cmd?.cmd === 'status') {
      const r = db.prepare('SELECT id FROM requests WHERE code = ?').get(cmd.code);
      if (!r || !STATUSES.includes(cmd.status)) return sendText('Topilmadi yoki holat noto‘g‘ri. Holatlar: ' + STATUSES.join(', '));
      addUpdate(r.id, { status: cmd.status, note: clean(cmd.note, 1000), public: true });
      return sendText(`✅ ${cmd.code}: ${cmd.status}`);
    }
    if (/^\/profilaktika/i.test(text)) {
      const due = ctx.ops.dueList(7);
      return sendText(due.length ? due.map((m) => `${m.next_due < today() ? '🔴' : '🟡'} ${m.next_due} · <b>${esc(m.title)}</b> · ${esc(eqLabel(m))}${m.company ? ` · ${esc(m.company)}` : ''}`).join('\n') : 'Yaqin 7 kunda profilaktika yo‘q', appBtn);
    }
  }

  /* ---------- Inline tugmalar ---------- */
  async function callback(cq) {
    const from = cq.from; const data = String(cq.data || '');
    const answer = (text = '') => api('answerCallbackQuery', { callback_query_id: cq.id, text }).catch(() => {});
    const dropKb = () => cq.message && api('editMessageReplyMarkup', { chat_id: cq.message.chat.id, message_id: cq.message.message_id, reply_markup: { inline_keyboard: [] } }).catch(() => {});
    let m;
    if ((m = data.match(/^st:(\d+):(\w+)$/))) {
      if (!isAdmin(from.id) || !STATUSES.includes(m[2])) return answer('⛔');
      const r = db.prepare('SELECT code FROM requests WHERE id = ?').get(+m[1]);
      if (!r || !addUpdate(+m[1], { status: m[2], public: true })) return answer('?');
      return answer(`✅ ${r.code}: ${T('uz').track.s[m[2]] || m[2]}`);
    }
    if ((m = data.match(/^rvp:(\d+)$/))) {
      if (!isAdmin(from.id)) return answer('⛔');
      ctx.reviews.publish(+m[1], true); dropKb();
      return answer('✅ E’lon qilindi');
    }
    if ((m = data.match(/^rv:(\d+):([1-5])$/))) {
      const u = db.prepare('SELECT * FROM tg_users WHERE tg_id = ?').get(String(from.id));
      const t = T(LANGS.includes(u?.lang) ? u.lang : 'uz');
      const r = db.prepare('SELECT id, code, status, company, tg_id, lang FROM requests WHERE id = ?').get(+m[1]);
      if (!r || r.tg_id !== String(from.id)) return answer('⛔');
      dropKb();
      const rid = ctx.reviews.add({ request: r, rating: +m[2], name: u?.first_name || '', tgId: String(from.id), lang: u?.lang || r.lang, notify: false });
      if (!rid) return answer(t.tg4.rateDone);
      setState(from.id, { review: rid });
      await answer('⭐'.repeat(+m[2]));
      return sendTo(String(from.id), t.tg4.rateComment).catch(() => {});
    }
    return answer();
  }

  // Ariza "bajarildi" bo'lganda mijozdan baho so'rash (ariza Telegram orqali kelgan bo'lsa, bir marta)
  async function askReview(id) {
    const r = db.prepare('SELECT id, code, tg_id, lang, review_asked FROM requests WHERE id = ?').get(id);
    if (!r?.tg_id || r.review_asked || !ctx.reviews.canRate({ ...r, status: 'done' })) return false;
    const u = db.prepare('SELECT lang, blocked FROM tg_users WHERE tg_id = ?').get(r.tg_id);
    if (u?.blocked) return false;
    const t = T(LANGS.includes(u?.lang) ? u.lang : r.lang || 'uz');
    db.prepare('UPDATE requests SET review_asked = 1 WHERE id = ?').run(id);
    return sendTo(r.tg_id, fmt(t.tg4.rateAsk, { code: esc(r.code) }), { reply_markup: { inline_keyboard: [[1, 2, 3, 4, 5].map((n) => ({ text: `${n} ⭐`, callback_data: `rv:${r.id}:${n}` }))] } }).catch(() => false);
  }

  async function webhook(req, res, secret) {
    const exp = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (!exp || secret !== exp || req.headers['x-telegram-bot-api-secret-token'] !== exp) return ctx.send(res, 404, '');
    const u = await readJson(req, 256 * 1024).catch(() => ({}));
    json(res, 200, {}); // Telegram'ga darhol javob, ishlov fonda
    if (u.callback_query) { Promise.resolve(callback(u.callback_query)).catch((e) => console.error('Bot tugma:', e.message)); return; }
    const msg = u.message;
    if (!msg) return;
    // Saytdagi akkauntni Telegramga ulash: /start acc_<kalit> (muhandisning o'z chatidan ham ishlaydi)
    const acc = String(msg.text || '').match(/^\/start(?:@\w+)?\s+acc_([A-Za-z0-9_-]{20,40})$/);
    if (acc && msg.from?.id) {
      const user = ctx.accounts.linkTelegram(acc[1], String(msg.from.id));
      const t = ctx.T(LANGS.includes(user?.lang) ? user.lang : 'uz');
      sendTo(String(msg.chat.id), user ? fmt(t.acc.tgLinked, { name: esc(user.name) }) : esc(t.acc.tgLinkExpired)).catch(() => {});
      return;
    }
    const run = String(msg.chat?.id) === String(tgChat()) ? adminMessage(msg) : customerMessage(msg);
    Promise.resolve(run).catch((e) => console.error('Bot xato:', e.message));
  }

  /* ---------- Mini App API ---------- */
  function appUser(req) {
    const m = String(req.headers.authorization || '').match(/^Bearer ([A-Za-z0-9_-]{30,})$/);
    if (!m) return null;
    const s = db.prepare('SELECT * FROM tg_sessions WHERE token_hash = ?').get(sha256(m[1]));
    if (!s || s.expires < now()) return null;
    return db.prepare('SELECT * FROM tg_users WHERE tg_id = ?').get(s.tg_id) || null;
  }
  // Foydalanuvchi ko'ra oladigan arizalar: o'zi yuborgan, kuzatayotgan yoki korxonasi uskunasiga tegishli
  function visibleRequests(u, limit = 50) {
    const follows = J(u.follows, []).filter((c) => CODE_RE.test(c));
    const cids = customersOf(u.tg_id).map((c) => c.id);
    const cond = ['r.tg_id = ?']; const args = [u.tg_id];
    if (follows.length) { cond.push(`r.code IN (${follows.map(() => '?').join(',')})`); args.push(...follows); }
    if (cids.length) { cond.push(`e.customer_id IN (${cids.map(() => '?').join(',')})`); args.push(...cids); }
    return db.prepare(`SELECT r.code, r.created_at, r.updated_at, r.status, r.priority, r.equipment, r.service, substr(r.message, 1, 140) message FROM requests r LEFT JOIN equipment e ON e.id = r.equipment_id WHERE ${cond.join(' OR ')} ORDER BY CASE WHEN r.status IN ('done','cancelled') THEN 1 ELSE 0 END, r.id DESC LIMIT ${limit}`).all(...args);
  }
  const canSee = (u, code) => visibleRequests(u, 500).some((r) => r.code === code);
  function myEquipment(u) {
    const cids = customersOf(u.tg_id).map((c) => c.id);
    if (!cids.length) return [];
    return db.prepare(`SELECT e.id, e.code, e.brand, e.model, e.serial, e.kind, e.location, c.company, (SELECT MIN(next_due) FROM maintenance m WHERE m.equipment_id = e.id) next_due, (SELECT title FROM maintenance m WHERE m.equipment_id = e.id ORDER BY next_due LIMIT 1) next_title FROM equipment e JOIN customers c ON c.id = e.customer_id WHERE e.customer_id IN (${cids.map(() => '?').join(',')}) ORDER BY next_due IS NULL, next_due, e.brand`).all(...cids);
  }
  function myDocs(u) {
    const cids = customersOf(u.tg_id).map((c) => c.id);
    const args = [u.tg_id, ...cids];
    return db.prepare(`SELECT d.kind, d.number, d.token, d.status, d.created_at, d.data FROM documents d LEFT JOIN requests r ON r.id = d.request_id WHERE d.status != 'draft' AND (r.tg_id = ? ${cids.length ? `OR d.customer_id IN (${cids.map(() => '?').join(',')})` : ''}) ORDER BY d.id DESC LIMIT 50`).all(...args)
      .map((d) => { const data = J(d.data, {}); const total = (data.items || []).reduce((a, i) => a + (Number(i.qty) || 0) * (Number(i.price) || 0), 0) * (1 + (Number(data.vat) || 0) / 100); return { kind: d.kind, number: d.number, status: d.status, created_at: d.created_at, total: Math.round(total), currency: data.currency || 'UZS', url: `/doc/${d.token}/` }; });
  }

  async function app(req, res, ip, p) {
    const method = req.method;
    let m;
    if (p === '/auth' && method === 'POST') {
      if (!rateLimit(`tgauth:${ip}`, 30, 600e3)) return json(res, 429, { error: 'rate' });
      const b = await readJson(req, 16 * 1024);
      const tu = verifyInitData(String(b.initData || ''));
      if (!tu) return json(res, 401, { error: 'init_data' });
      const u = upsertUser(tu);
      if (u.blocked) return json(res, 403, { error: 'blocked' });
      const token = randToken(32);
      db.prepare('DELETE FROM tg_sessions WHERE expires < ?').run(now());
      db.prepare('INSERT INTO tg_sessions(token_hash, tg_id, expires) VALUES (?, ?, ?)').run(sha256(token), u.tg_id, new Date(Date.now() + 7 * 864e5).toISOString());
      return json(res, 200, { token, user: { name: u.first_name, lang: u.lang, phone: Boolean(u.phone) }, admin: isAdmin(u.tg_id), ai: aiEnabled() });
    }
    const u = appUser(req);
    if (!u) return json(res, 401, { error: 'auth' });
    if (method === 'POST' && !rateLimit(`tgapp:${u.tg_id}`, 60, 600e3)) return json(res, 429, { error: 'rate' });
    const lang = LANGS.includes(u.lang) ? u.lang : 'uz';
    const q = new URL(req.url, 'http://x').searchParams;

    if (p === '/home' && method === 'GET') {
      const reqs = visibleRequests(u, 20);
      const eqs = myEquipment(u);
      return json(res, 200, { name: u.first_name, phone: u.phone || '', companies: customersOf(u.tg_id).map((c) => c.company), open: reqs.filter((r) => !['done', 'cancelled'].includes(r.status)).slice(0, 5), due: eqs.filter((e) => e.next_due && e.next_due <= addDays(today(), 30)).slice(0, 5), counts: { requests: reqs.length, equipment: eqs.length } });
    }
    if (p === '/lang' && method === 'POST') { const b = await readJson(req); if (LANGS.includes(b.lang)) db.prepare('UPDATE tg_users SET lang = ? WHERE tg_id = ?').run(b.lang, u.tg_id); return json(res, 200, { ok: true }); }
    if (p === '/requests' && method === 'GET') return json(res, 200, visibleRequests(u));
    if ((m = p.match(/^\/requests\/(TX-[A-Z0-9]{4}-[A-Z0-9]{4})$/)) && method === 'GET') {
      if (!canSee(u, m[1])) return json(res, 404, { error: 'not_found' });
      const r = db.prepare('SELECT id, code, created_at, updated_at, status, priority, equipment, service, message, ai, tg_id FROM requests WHERE code = ?').get(m[1]);
      const ai = r.tg_id === u.tg_id ? J(r.ai) : null;
      const w = r.status === 'done' ? ctx.warranty.info(r.code) : null;
      return json(res, 200, { canRate: r.tg_id === u.tg_id && ctx.reviews.canRate(r), warranty: w ? { status: w.status, until: w.until, days: w.days } : null, code: r.code, created_at: r.created_at, status: r.status, priority: r.priority, equipment: r.equipment, message: r.tg_id === u.tg_id ? r.message : '', ai: ai ? { diagnosis: ai.diagnosis, next_steps: ai.next_steps, safety: ai.safety } : null, updates: db.prepare('SELECT created_at, status, note FROM request_updates WHERE request_id = ? AND public = 1 ORDER BY id DESC').all(r.id) });
    }
    if (p === '/requests' && method === 'POST') {
      if (!rateLimit(`tgreq:${u.tg_id}`, 5, 3600e3)) return json(res, 429, { error: 'rate' });
      const b = await readJson(req, 14 * 1024 * 1024);
      const message = clean(b.message, 2000);
      const phone = clean(b.phone, 20) || u.phone || '';
      const digits = phone.replace(/\D/g, '');
      if (message.length < 10 || digits.length < 9 || digits.length > 15) return json(res, 400, { error: 'validation' });
      if (phone !== u.phone) db.prepare('UPDATE tg_users SET phone = ? WHERE tg_id = ?').run(phone, u.tg_id);
      const images = (Array.isArray(b.images) ? b.images : []).slice(0, 4).map((s) => decodeImage(s)).filter(Boolean);
      let eq = null;
      if (EQ_RE.test(String(b.equipment_code || ''))) { eq = myEquipment(u).some((e) => e.code === b.equipment_code) ? equipmentByCode(b.equipment_code) : null; }
      const out = await makeRequest({ lang, name: [u.first_name, u.username ? `@${u.username}` : ''].filter(Boolean).join(' ') || 'Telegram', phone, company: customersOf(u.tg_id)[0]?.company || '', equipment: clean(b.equipment, 120), message, images, eq, tgId: u.tg_id, source: 'tg_app' });
      return json(res, 201, { code: out.code, contact: { phone: cfg().phone, whatsapp: cfg().whatsapp, telegram: cfg().telegram }, ai: out.ai ? { diagnosis: out.ai.diagnosis, priority: out.ai.priority, next_steps: out.ai.next_steps, safety: out.ai.safety } : null });
    }
    if (p === '/follow' && method === 'POST') {
      if (!rateLimit(`tgfollow:${u.tg_id}`, 20, 3600e3)) return json(res, 429, { error: 'rate' });
      const b = await readJson(req);
      const code = String(b.code || '').toUpperCase().trim();
      const fl = J(u.follows, []);
      if (b.remove) { db.prepare('UPDATE tg_users SET follows = ? WHERE tg_id = ?').run(JSON.stringify(fl.filter((c) => c !== code)), u.tg_id); return json(res, 200, { ok: true }); }
      if (!CODE_RE.test(code) || !db.prepare('SELECT 1 FROM requests WHERE code = ?').get(code)) return json(res, 404, { error: 'not_found' });
      if (!fl.includes(code)) db.prepare('UPDATE tg_users SET follows = ? WHERE tg_id = ?').run(JSON.stringify([...fl, code].slice(-20)), u.tg_id);
      return json(res, 200, { ok: true, code });
    }
    if (p === '/link' && method === 'POST') {
      if (!rateLimit(`tglink:${u.tg_id}`, 8, 3600e3)) return json(res, 429, { error: 'rate' });
      const b = await readJson(req);
      const c = /^CL-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(String(b.code || '').toUpperCase().trim()) ? linkCustomer(u.tg_id, String(b.code).toUpperCase().trim()) : null;
      return c ? json(res, 200, { ok: true, company: c.company }) : json(res, 404, { error: 'bad_code' });
    }
    if (p === '/equipment' && method === 'GET') return json(res, 200, myEquipment(u));
    if ((m = p.match(/^\/equipment\/(EQ-[A-Z0-9]{4}-[A-Z0-9]{4})$/)) && method === 'GET') {
      if (!myEquipment(u).some((e) => e.code === m[1])) return json(res, 404, { error: 'not_found' });
      const eq = equipmentByCode(m[1]);
      return json(res, 200, { code: eq.code, brand: eq.brand, model: eq.model, serial: eq.serial, kind: eq.kind, location: eq.location, year: eq.year, company: eq.company, maintenance: eq.maintenance.map((x) => ({ title: x.title, next_due: x.next_due, last_done: x.last_done, interval_days: x.interval_days })), events: eq.events, url: `/e/${eq.code}/` });
    }
    if (p === '/docs' && method === 'GET') return json(res, 200, myDocs(u));
    if (p === '/contact' && method === 'GET') {
      // Raqam faqat ariza yuborgan foydalanuvchiga ochiladi (saytdagidek)
      const has = db.prepare('SELECT 1 FROM requests WHERE tg_id = ? LIMIT 1').get(u.tg_id) || customersOf(u.tg_id).length;
      return json(res, 200, has ? { phone: cfg().phone, whatsapp: cfg().whatsapp, telegram: cfg().telegram } : { telegram: cfg().telegram });
    }
    if (p === '/academy' && method === 'GET') return json(res, 200, ctx.academy.tgStatus(u.tg_id, lang));
    if (p === '/academy/join' && method === 'POST') {
      if (!rateLimit(`tgac:${u.tg_id}`, 10, 900e3)) return json(res, 429, { error: 'rate' });
      const r = ctx.academy.tgJoin(u.tg_id, await readJson(req));
      return r.error ? json(res, r.error === 'name' ? 400 : 403, r) : json(res, 200, r);
    }
    if ((m = p.match(/^\/requests\/(TX-[A-Z0-9]{4}-[A-Z0-9]{4})\/review$/)) && method === 'POST') {
      const r = db.prepare('SELECT id, code, status, company, tg_id, lang FROM requests WHERE code = ?').get(m[1]);
      if (!r || r.tg_id !== u.tg_id) return json(res, 404, { error: 'not_found' });
      const b = await readJson(req);
      const id = ctx.reviews.add({ request: r, rating: b.rating, text: b.text, name: u.first_name || '', tgId: u.tg_id, lang });
      return id ? json(res, 201, { ok: true }) : json(res, 409, { error: 'done' });
    }
    if (p === '/errors' && method === 'GET') return json(res, 200, searchErrors(clean(q.get('q'), 60), lang, 20));

    /* ---- Admin (muhandis) ---- */
    if (p.startsWith('/admin/')) {
      if (!isAdmin(u.tg_id)) return json(res, 403, { error: 'forbidden' });
      const a = p.slice(6);
      if (a === '/summary' && method === 'GET') {
        const s = stats(7);
        return json(res, 200, { today: s.totals.today, visitors: s.totals.visitors, requests: s.totals.requests, open: s.totals.open, critical: s.totals.critical, due: ctx.ops.dueList(7).length, daily: s.daily.map((d) => ({ day: d.day, v: d.visitors, r: d.requests })) });
      }
      if (a === '/requests' && method === 'GET') {
        const where = []; const args = [];
        if (q.get('open') === '1') where.push("status NOT IN ('done','cancelled')");
        if (q.get('q')) { where.push('(code LIKE ? OR name LIKE ? OR phone LIKE ? OR equipment LIKE ? OR company LIKE ?)'); const s = `%${clean(q.get('q'), 60)}%`; args.push(s, s, s, s, s); }
        return json(res, 200, db.prepare(`SELECT id, code, created_at, name, company, equipment, status, priority, source FROM requests ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY CASE WHEN status IN ('done','cancelled') THEN 1 ELSE 0 END, CASE priority WHEN 'critical' THEN 0 WHEN 'high' THEN 1 WHEN 'normal' THEN 2 ELSE 3 END, id DESC LIMIT 100`).all(...args));
      }
      if ((m = a.match(/^\/requests\/(\d+)$/))) {
        const id = +m[1];
        if (method === 'GET') {
          const r = db.prepare('SELECT id, code, created_at, name, phone, company, service, equipment, message, status, priority, ai, source, images FROM requests WHERE id = ?').get(id);
          if (!r) return json(res, 404, { error: 'not_found' });
          return json(res, 200, { ...r, ai: J(r.ai), images: J(r.images, []).length, updates: db.prepare('SELECT created_at, status, note, public FROM request_updates WHERE request_id = ? ORDER BY id DESC').all(id) });
        }
        if (method === 'POST') {
          const b = await readJson(req);
          return addUpdate(id, { status: b.status, priority: b.priority, note: clean(b.note, 1000), public: b.public !== false }) ? json(res, 200, { ok: true }) : json(res, 404, { error: 'not_found' });
        }
      }
      if (a === '/maintenance' && method === 'GET') return json(res, 200, ctx.ops.dueList(30).map((x) => ({ id: x.id, title: x.title, next_due: x.next_due, eq: eqLabel(x), eq_code: x.eq_code, company: x.company, phone: x.phone })));
      if ((m = a.match(/^\/maintenance\/(\d+)\/done$/)) && method === 'POST') return ctx.ops.markDone(+m[1]) ? json(res, 200, { ok: true }) : json(res, 404, { error: 'not_found' });
    }
    return json(res, 404, { error: 'not_found' });
  }

  return { webhook, app, verifyInitData, isAdmin, askReview };
}
