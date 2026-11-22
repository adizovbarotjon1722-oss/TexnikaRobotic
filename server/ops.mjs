// 3-bosqich: xato kodlari, mijozlar va uskunalar (QR pasport), profilaktika, tijorat taklifi va dalolatnoma.
// server.mjs dagi yordamchilar ctx orqali beriladi (javob, matnlar, ariza yaratish).
import { createRequire } from 'module';
import { db, now, J, getSetting, setSetting, errSlug } from './db.mjs';
import { randCode, randToken, clean, rateLimit } from './security.mjs';
import { sendText, sendTo, tgEnabled } from './telegram.mjs';
import { LANGS } from '../src/i18n.mjs';
import { fmt } from '../src/i18n.mjs';
import { esc } from '../src/template.mjs';
import { renderErrorsList, renderErrorItem, renderEquipment, renderDoc, docTotals } from '../src/template2.mjs';

const qrcode = createRequire(import.meta.url)('qrcode-generator');
const today = () => new Date().toISOString().slice(0, 10);
const addDays = (d, n) => new Date(Date.parse(d) + n * 864e5).toISOString().slice(0, 10);
const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s || ''));
const tri = (o, n) => Object.fromEntries(LANGS.map((l) => [l, clean(o?.[l], n)]));
const triList = (o, n, max) => Object.fromEntries(LANGS.map((l) => [l, (Array.isArray(o?.[l]) ? o[l] : String(o?.[l] || '').split('\n')).map((x) => clean(x, n)).filter(Boolean).slice(0, max)]));
export const EQ_RE = /^EQ-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
const DOC_STATUSES = ['draft', 'sent', 'accepted', 'paid'];
const DOC_KINDS = { quote: 'TK', invoice: 'HS', act: 'DA', report: 'SH' };
const EV_KINDS = ['repair', 'maintenance', 'request', 'note', 'install'];

/* ---------- Xato kodlari ---------- */
const rowErr = (r) => ({ ...r, data: J(r.data, {}) });
let errCache = null;
export const listErrors = () => (errCache ??= db.prepare('SELECT * FROM error_codes WHERE published = 1 ORDER BY brand, code').all().map(rowErr));
// Ko'p ko'rilganlar oldinda; teng bo'lsa brendlar aralash chiqadi (har brenddan navbat bilan)
export function topErrors(n = 10) {
  const rank = new Map(); const seen = {};
  for (const x of listErrors()) { seen[x.brand] = (seen[x.brand] || 0) + 1; rank.set(x.id, seen[x.brand]); }
  return [...listErrors()].sort((a, b) => b.views - a.views || rank.get(a.id) - rank.get(b.id) || a.brand.localeCompare(b.brand)).slice(0, n);
}
export function searchErrors(q, lang, n = 20) {
  const s = String(q || '').toLowerCase().trim();
  return listErrors().filter((x) => !s || `${x.code} ${x.brand} ${x.controller} ${x.data.title?.[lang] || ''}`.toLowerCase().includes(s)).slice(0, n)
    .map((x) => ({ slug: x.slug, brand: x.brand, code: x.code, severity: x.severity, title: x.data.title?.[lang] || '', causes: x.data.causes?.[lang] || [], checks: x.data.checks?.[lang] || [], note: x.data.note?.[lang] || '' }));
}

/* ---------- Uskunalar ---------- */
export function equipmentByCode(code, { publicOnly = true } = {}) {
  const eq = db.prepare('SELECT e.*, c.company FROM equipment e LEFT JOIN customers c ON c.id = e.customer_id WHERE e.code = ?').get(code);
  if (!eq) return null;
  eq.maintenance = db.prepare('SELECT * FROM maintenance WHERE equipment_id = ? ORDER BY next_due').all(eq.id);
  eq.events = db.prepare(`SELECT at, kind, text FROM equipment_events WHERE equipment_id = ? ${publicOnly ? 'AND public = 1' : ''} ORDER BY at DESC, id DESC LIMIT 30`).all(eq.id);
  return eq;
}
export const eqLabel = (e) => [e.brand, e.model, e.serial ? `S/N ${e.serial}` : '', e.location].filter(Boolean).join(' · ');

/* ---------- Hujjatlar ---------- */
function docRow(r) {
  if (!r) return null;
  const d = { ...r, data: J(r.data, {}) };
  d.request_code = r.request_id ? db.prepare('SELECT code FROM requests WHERE id = ?').get(r.request_id)?.code || '' : '';
  return d;
}
const docByToken = (tok) => docRow(db.prepare('SELECT * FROM documents WHERE token = ?').get(tok));
function nextDocNumber(kind) {
  const y = new Date().getFullYear();
  const key = `docseq_${kind}_${y}`;
  const n = (parseInt(getSetting(key, '0'), 10) || 0) + 1;
  setSetting(key, n);
  return `${DOC_KINDS[kind] || 'DK'}-${y}-${String(n).padStart(4, '0')}`;
}
function cleanDocData(b) {
  const items = (Array.isArray(b.items) ? b.items : []).slice(0, 60).map((i) => ({ name: clean(i.name, 300), qty: Math.max(0, Number(i.qty) || 0), unit: clean(i.unit, 20), price: Math.max(0, Number(i.price) || 0) })).filter((i) => i.name);
  return {
    customer: clean(b.customer, 200), items,
    currency: ['UZS', 'USD', 'EUR', 'RUB'].includes(b.currency) ? b.currency : 'UZS',
    vat: Math.min(Math.max(Number(b.vat) || 0, 0), 30),
    valid_days: Math.min(Math.max(parseInt(b.valid_days, 10) || 0, 0), 365),
    due_days: Math.min(Math.max(parseInt(b.due_days, 10) || 0, 0), 365),
    discount: Math.min(Math.max(Number(b.discount) || 0, 0), 100),
    date: /^\d{4}-\d{2}-\d{2}$/.test(String(b.date || '')) ? String(b.date) : '',
    contract: clean(b.contract, 120),
    ref: clean(b.ref, 40),
    equipment: clean(b.equipment, 200),
    engineer: clean(b.engineer, 120),
    report: Object.fromEntries(['symptom', 'cause', 'work', 'recommend'].map((k) => [k, clean(b.report?.[k], 4000)]).concat([['next_date', /^\d{4}-\d{2}-\d{2}$/.test(String(b.report?.next_date || '')) ? String(b.report.next_date) : '']])),
    notes: clean(b.notes, 3000)
  };
}
// Hujjat mijozga ochiladigan Telegram chatlari: korxonaga ulangan foydalanuvchilar va arizani bot orqali yuborgan odam
function docRecipients(doc) {
  const ids = new Set();
  if (doc.customer_id) for (const r of db.prepare('SELECT tg_id FROM customer_users WHERE customer_id = ?').all(doc.customer_id)) ids.add(r.tg_id);
  if (doc.request_id) { const r = db.prepare('SELECT tg_id FROM requests WHERE id = ?').get(doc.request_id); if (r?.tg_id) ids.add(r.tg_id); }
  return [...ids];
}

/* ---------- QR yorliqlar ---------- */
export function qrSvg(text) {
  const q = qrcode(0, 'M');
  q.addData(text);
  q.make();
  return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
}

export function createOps(ctx) {
  const { json, readJson, html, send, cfg, T, VER } = ctx;

  /* ---- Ommaviy sahifalar (routePage dan chaqiriladi). true qaytarsa javob berildi ---- */
  function page(req, res, lang, p, t, c) {
    let m;
    if (p === '/errors/') {
      const q = new URL(req.url, 'http://x').searchParams;
      html(res, renderErrorsList(lang, t, c, listErrors(), { q: clean(q.get('q'), 60), brand: clean(q.get('brand'), 30) }, VER));
      return true;
    }
    if ((m = p.match(/^\/errors\/([a-z0-9-]{1,90})\/$/))) {
      const x = listErrors().find((e) => e.slug === m[1]);
      if (!x) return false;
      db.prepare('UPDATE error_codes SET views = views + 1 WHERE id = ?').run(x.id); x.views++;
      const related = listErrors().filter((e) => e.brand === x.brand && e.id !== x.id).slice(0, 8);
      html(res, renderErrorItem(lang, t, c, x, related, VER));
      return true;
    }
    if ((m = p.match(/^\/e\/(EQ-[A-Z0-9]{4}-[A-Z0-9]{4})\/$/i))) {
      const eq = equipmentByCode(m[1].toUpperCase());
      html(res, renderEquipment(lang, t, c, eq, VER), eq ? 200 : 404);
      return true;
    }
    if ((m = p.match(/^\/doc\/([A-Za-z0-9_-]{20,40})\/$/))) {
      const doc = docByToken(m[1]);
      const ok = doc && doc.status !== 'draft';
      html(res, renderDoc(T(ok ? doc.lang : lang), { ...c, docSign: getSetting('doc_sign', ''), docStamp: getSetting('doc_stamp', '') }, ok ? doc : null, VER), ok ? 200 : 404);
      return true;
    }
    return false;
  }
  const sitemapPaths = () => ['errors/', ...listErrors().map((x) => `errors/${x.slug}/`)];

  // Mijoz taklifni qabul qiladi
  function apiDocAccept(req, res, ip, token) {
    if (!rateLimit(`doc:${ip}`, 10, 600e3)) return json(res, 429, { error: 'rate' });
    const doc = docByToken(token);
    if (!doc || doc.kind !== 'quote' || doc.status === 'draft') return json(res, 404, { error: 'not_found' });
    if (doc.status !== 'accepted') {
      db.prepare("UPDATE documents SET status = 'accepted', updated_at = ? WHERE id = ?").run(now(), doc.id);
      sendText(`✅ Tijorat taklifi <b>${esc(doc.number)}</b> qabul qilindi${doc.data.customer ? ` (${esc(doc.data.customer)})` : ''}. Jami: ${esc(docTotals(doc.data).total.toLocaleString('ru-RU'))} ${esc(doc.data.currency || 'UZS')}`).catch(() => {});
    }
    return json(res, 200, { ok: true });
  }

  /* ---- Profilaktika ---- */
  function markDone(id, note = '') {
    const m = db.prepare('SELECT * FROM maintenance WHERE id = ?').get(id);
    if (!m) return false;
    const d = today();
    db.prepare('UPDATE maintenance SET last_done = ?, next_due = ?, notified_for = NULL WHERE id = ?').run(d, addDays(d, m.interval_days), id);
    db.prepare('INSERT INTO equipment_events(equipment_id, at, kind, text, public) VALUES (?, ?, ?, ?, 1)').run(m.equipment_id, now(), 'maintenance', [m.title, note].filter(Boolean).join(': ').slice(0, 500));
    return true;
  }
  function dueList(days = 30) {
    return db.prepare(`SELECT m.*, e.code eq_code, e.brand, e.model, e.serial, e.location, c.company, c.phone FROM maintenance m JOIN equipment e ON e.id = m.equipment_id LEFT JOIN customers c ON c.id = e.customer_id WHERE m.next_due <= ? ORDER BY m.next_due`).all(addDays(today(), days));
  }
  // Har soatda: kuniga bir marta muhandisga ro'yxat (Toshkent vaqti 08:00 dan keyin), mijozlarga 3 kun oldin eslatma
  async function maintenanceTick() {
    const tash = new Date(Date.now() + 5 * 3600e3);
    const day = tash.toISOString().slice(0, 10);
    if (tash.getUTCHours() >= 8 && getSetting('mt_digest_day') !== day) {
      setSetting('mt_digest_day', day);
      const due = dueList(7);
      if (due.length && tgEnabled()) {
        const lines = due.slice(0, 30).map((m) => `${m.next_due < day ? '🔴' : '🟡'} ${esc(m.next_due)} · <b>${esc(m.title)}</b>\n   ${esc(eqLabel(m))}${m.company ? ` · ${esc(m.company)}` : ''}${m.phone ? ` · ${esc(m.phone)}` : ''}`);
        await sendText(`🔧 <b>Profilaktika: ${due.length} ta</b> (7 kun ichida)\n\n${lines.join('\n')}`).catch((e) => console.error('Profilaktika xabari:', e.message));
      }
    }
    const soon = db.prepare('SELECT m.*, e.customer_id, e.brand, e.model, e.serial, e.location FROM maintenance m JOIN equipment e ON e.id = m.equipment_id WHERE m.notify_customer = 1 AND m.next_due <= ? AND (m.notified_for IS NULL OR m.notified_for != m.next_due)').all(addDays(day, 3));
    for (const m of soon) {
      db.prepare('UPDATE maintenance SET notified_for = ? WHERE id = ?').run(m.next_due, m.id);
      if (!m.customer_id) continue;
      for (const u of db.prepare('SELECT cu.tg_id, t.lang FROM customer_users cu LEFT JOIN tg_users t ON t.tg_id = cu.tg_id WHERE cu.customer_id = ? AND COALESCE(t.blocked, 0) = 0').all(m.customer_id)) {
        const tt = T(LANGS.includes(u.lang) ? u.lang : 'uz');
        await sendTo(u.tg_id, fmt(tt.tgx.reminder, { eq: esc(eqLabel(m)), task: esc(m.title), date: esc(m.next_due) }), ctx.miniAppButton(tt.tgx.open, '#eq')).catch(() => {});
      }
    }
  }
  function startScheduler() {
    const run = () => maintenanceTick().catch((e) => console.error('Rejalashtiruvchi:', e.message));
    setTimeout(run, 15e3).unref();
    setInterval(run, 3600e3).unref();
  }

  async function sendDoc(doc) {
    const ids = docRecipients(doc);
    const link = `${cfg().domain}/doc/${doc.token}/`;
    let n = 0;
    for (const id of ids) {
      const u = db.prepare('SELECT lang FROM tg_users WHERE tg_id = ?').get(id);
      const tt = T(LANGS.includes(u?.lang) ? u.lang : doc.lang);
      const btn = link.startsWith('https://') ? { reply_markup: { inline_keyboard: [[{ text: tt.doc.print, url: link }]] } } : {};
      const ok = await sendTo(id, `${fmt(tt.tgx.docSent, { title: esc(tt.doc[doc.kind] || tt.doc.quote), no: esc(doc.number) })}\n${esc(link)}`, btn).catch(() => false);
      if (ok) n++;
    }
    return n;
  }

  /* ---- Admin API (adminApi dan chaqiriladi). Marshrut topilmasa javob yozilmaydi ---- */
  async function admin(req, res, p, method, q) {
    let m;
    /* Xato kodlari */
    if (p === '/errors' && method === 'GET') return json(res, 200, db.prepare('SELECT * FROM error_codes ORDER BY brand, code').all().map(rowErr));
    if ((m = p.match(/^\/errors(?:\/(\d+))?$/)) && method === 'POST') {
      const b = await readJson(req, 256 * 1024);
      const brand = clean(b.brand, 30); const code = clean(b.code, 60);
      if (!brand || !code) return json(res, 400, { error: 'code' });
      const data = JSON.stringify({ title: tri(b.title, 160), causes: triList(b.causes, 300, 8), checks: triList(b.checks, 400, 10), note: tri(b.note, 600) });
      const vals = [errSlug(brand, code), brand, code, clean(b.controller, 60), ['critical', 'high', 'normal'].includes(b.severity) ? b.severity : 'normal', data, b.published === false ? 0 : 1, now()];
      try {
        if (m[1]) db.prepare('UPDATE error_codes SET slug=?, brand=?, code=?, controller=?, severity=?, data=?, published=?, updated_at=? WHERE id = ?').run(...vals, +m[1]);
        else db.prepare('INSERT INTO error_codes(slug, brand, code, controller, severity, data, published, updated_at) VALUES (?,?,?,?,?,?,?,?)').run(...vals);
      } catch { return json(res, 409, { error: 'exists' }); }
      errCache = null;
      return json(res, 200, { ok: true });
    }
    if ((m = p.match(/^\/errors\/(\d+)$/)) && method === 'DELETE') { db.prepare('DELETE FROM error_codes WHERE id = ?').run(+m[1]); errCache = null; return json(res, 200, { ok: true }); }

    /* Mijozlar */
    if (p === '/customers' && method === 'GET') {
      return json(res, 200, db.prepare('SELECT c.*, (SELECT COUNT(*) FROM equipment e WHERE e.customer_id = c.id) eq_count, (SELECT COUNT(*) FROM customer_users u WHERE u.customer_id = c.id) tg_count FROM customers c ORDER BY company').all()
        .map((c) => ({ ...c, tg_link: ctx.botUsername() ? `https://t.me/${ctx.botUsername()}?start=link_${c.link_code}` : '' })));
    }
    if ((m = p.match(/^\/customers(?:\/(\d+))?$/)) && method === 'POST') {
      const b = await readJson(req);
      const v = [clean(b.company, 120), clean(b.contact, 80), clean(b.phone, 20), clean(b.address, 200), clean(b.notes, 1000)];
      if (!v[0]) return json(res, 400, { error: 'company' });
      if (m[1]) db.prepare('UPDATE customers SET company=?, contact=?, phone=?, address=?, notes=? WHERE id = ?').run(...v, +m[1]);
      else db.prepare('INSERT INTO customers(company, contact, phone, address, notes, link_code, created_at) VALUES (?,?,?,?,?,?,?)').run(...v, randCode('CL', 2, 4), now());
      return json(res, 200, { ok: true });
    }
    if ((m = p.match(/^\/customers\/(\d+)$/)) && method === 'DELETE') { db.prepare('DELETE FROM customers WHERE id = ?').run(+m[1]); return json(res, 200, { ok: true }); }

    /* Uskunalar */
    if (p === '/equipment' && method === 'GET') {
      return json(res, 200, db.prepare(`SELECT e.*, c.company, (SELECT MIN(next_due) FROM maintenance m WHERE m.equipment_id = e.id) next_due,
        (SELECT COUNT(*) FROM requests r WHERE r.equipment_id = e.id) req_count FROM equipment e LEFT JOIN customers c ON c.id = e.customer_id ORDER BY c.company, e.brand, e.model`).all());
    }
    if ((m = p.match(/^\/equipment\/(\d+)$/)) && method === 'GET') {
      const e = db.prepare('SELECT code FROM equipment WHERE id = ?').get(+m[1]);
      if (!e) return json(res, 404, { error: 'not_found' });
      const eq = equipmentByCode(e.code, { publicOnly: false });
      eq.events = db.prepare('SELECT * FROM equipment_events WHERE equipment_id = ? ORDER BY at DESC, id DESC LIMIT 200').all(eq.id);
      eq.requests = db.prepare('SELECT id, code, created_at, status, priority FROM requests WHERE equipment_id = ? ORDER BY id DESC LIMIT 50').all(eq.id);
      return json(res, 200, eq);
    }
    if ((m = p.match(/^\/equipment(?:\/(\d+))?$/)) && method === 'POST') {
      const b = await readJson(req);
      const cid = parseInt(b.customer_id, 10) || null;
      if (cid && !db.prepare('SELECT 1 FROM customers WHERE id = ?').get(cid)) return json(res, 400, { error: 'customer' });
      const v = [cid, clean(b.brand, 40), clean(b.model, 80), clean(b.serial, 60), clean(b.kind, 60), clean(b.location, 120), parseInt(b.year, 10) || null, clean(b.notes, 1000)];
      if (!v[1] && !v[2]) return json(res, 400, { error: 'model' });
      let id = m[1] ? +m[1] : null;
      if (id) db.prepare('UPDATE equipment SET customer_id=?, brand=?, model=?, serial=?, kind=?, location=?, year=?, notes=? WHERE id = ?').run(...v, id);
      else {
        let code; for (let i = 0; i < 5; i++) { code = randCode('EQ', 2, 4); if (!db.prepare('SELECT 1 FROM equipment WHERE code = ?').get(code)) break; }
        id = Number(db.prepare('INSERT INTO equipment(customer_id, brand, model, serial, kind, location, year, notes, code, created_at) VALUES (?,?,?,?,?,?,?,?,?,?)').run(...v, code, now()).lastInsertRowid);
        db.prepare('INSERT INTO equipment_events(equipment_id, at, kind, text, public) VALUES (?, ?, ?, ?, 1)').run(id, now(), 'install', '');
      }
      return json(res, 200, { ok: true, id });
    }
    if ((m = p.match(/^\/equipment\/(\d+)$/)) && method === 'DELETE') { db.prepare('DELETE FROM equipment WHERE id = ?').run(+m[1]); return json(res, 200, { ok: true }); }
    if ((m = p.match(/^\/equipment\/(\d+)\/events$/)) && method === 'POST') {
      const b = await readJson(req);
      if (!db.prepare('SELECT 1 FROM equipment WHERE id = ?').get(+m[1])) return json(res, 404, { error: 'not_found' });
      const at = isDate(b.at) ? `${b.at}T12:00:00.000Z` : now();
      db.prepare('INSERT INTO equipment_events(equipment_id, at, kind, text, public) VALUES (?, ?, ?, ?, ?)').run(+m[1], at, EV_KINDS.includes(b.kind) ? b.kind : 'note', clean(b.text, 1000), b.public === false ? 0 : 1);
      return json(res, 200, { ok: true });
    }
    if ((m = p.match(/^\/events\/(\d+)$/)) && method === 'DELETE') { db.prepare('DELETE FROM equipment_events WHERE id = ?').run(+m[1]); return json(res, 200, { ok: true }); }

    /* Profilaktika */
    if (p === '/maintenance' && method === 'GET') return json(res, 200, dueList(parseInt(q.get('days'), 10) || 3650));
    if ((m = p.match(/^\/maintenance(?:\/(\d+))?$/)) && method === 'POST') {
      const b = await readJson(req);
      const interval = Math.min(Math.max(parseInt(b.interval_days, 10) || 90, 1), 3650);
      const title = clean(b.title, 160); if (!title) return json(res, 400, { error: 'title' });
      const next = isDate(b.next_due) ? b.next_due : addDays(isDate(b.last_done) ? b.last_done : today(), interval);
      if (m[1]) db.prepare('UPDATE maintenance SET title=?, interval_days=?, next_due=?, notify_customer=?, notified_for = NULL WHERE id = ?').run(title, interval, next, b.notify_customer === false ? 0 : 1, +m[1]);
      else {
        if (!db.prepare('SELECT 1 FROM equipment WHERE id = ?').get(parseInt(b.equipment_id, 10) || 0)) return json(res, 400, { error: 'equipment' });
        db.prepare('INSERT INTO maintenance(equipment_id, title, interval_days, last_done, next_due, notify_customer) VALUES (?,?,?,?,?,?)').run(+b.equipment_id, title, interval, isDate(b.last_done) ? b.last_done : null, next, b.notify_customer === false ? 0 : 1);
      }
      return json(res, 200, { ok: true });
    }
    if ((m = p.match(/^\/maintenance\/(\d+)\/done$/)) && method === 'POST') { const b = await readJson(req).catch(() => ({})); return markDone(+m[1], clean(b.note, 300)) ? json(res, 200, { ok: true }) : json(res, 404, { error: 'not_found' }); }
    if ((m = p.match(/^\/maintenance\/(\d+)$/)) && method === 'DELETE') { db.prepare('DELETE FROM maintenance WHERE id = ?').run(+m[1]); return json(res, 200, { ok: true }); }

    /* Hujjatlar */
    if (p === '/docs' && method === 'GET') {
      const rows = db.prepare('SELECT d.*, r.code request_code, c.company FROM documents d LEFT JOIN requests r ON r.id = d.request_id LEFT JOIN customers c ON c.id = d.customer_id ORDER BY d.id DESC LIMIT 300').all();
      return json(res, 200, rows.map((r) => { const data = J(r.data, {}); return { ...r, data, total: docTotals(data).total, url: `${cfg().domain}/doc/${r.token}/` }; }));
    }
    if ((m = p.match(/^\/docs\/(\d+)$/)) && method === 'GET') {
      const d = docRow(db.prepare('SELECT * FROM documents WHERE id = ?').get(+m[1]));
      return d ? json(res, 200, { ...d, url: `${cfg().domain}/doc/${d.token}/`, recipients: docRecipients(d).length }) : json(res, 404, { error: 'not_found' });
    }
    if ((m = p.match(/^\/docs(?:\/(\d+))?$/)) && method === 'POST') {
      const b = await readJson(req, 256 * 1024);
      const kind = DOC_KINDS[b.kind] ? b.kind : 'quote';
      const lang = LANGS.includes(b.lang) ? b.lang : 'uz';
      const reqId = parseInt(b.request_id, 10) || null;
      const r = reqId ? db.prepare('SELECT id, company, name, equipment_id FROM requests WHERE id = ?').get(reqId) : null;
      let cid = parseInt(b.customer_id, 10) || null;
      if (!cid && r?.equipment_id) cid = db.prepare('SELECT customer_id FROM equipment WHERE id = ?').get(r.equipment_id)?.customer_id || null;
      if (cid && !db.prepare('SELECT 1 FROM customers WHERE id = ?').get(cid)) cid = null;
      const data = cleanDocData(b);
      if (!data.customer) data.customer = cid ? db.prepare('SELECT company FROM customers WHERE id = ?').get(cid).company : (r ? r.company || r.name : '');
      const status = DOC_STATUSES.includes(b.status) ? b.status : 'draft';
      if (m[1]) {
        db.prepare('UPDATE documents SET kind=?, lang=?, request_id=?, customer_id=?, data=?, status=?, updated_at=? WHERE id = ?').run(kind, lang, r?.id || null, cid, JSON.stringify(data), status, now(), +m[1]);
        return json(res, 200, { ok: true, id: +m[1] });
      }
      const id = Number(db.prepare('INSERT INTO documents(kind, number, token, request_id, customer_id, lang, data, status, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)')
        .run(kind, nextDocNumber(kind), randToken(18), r?.id || null, cid, lang, JSON.stringify(data), status, now(), now()).lastInsertRowid);
      return json(res, 201, { ok: true, id });
    }
    if ((m = p.match(/^\/docs\/(\d+)\/send$/)) && method === 'POST') {
      const d = docRow(db.prepare('SELECT * FROM documents WHERE id = ?').get(+m[1]));
      if (!d) return json(res, 404, { error: 'not_found' });
      if (d.status === 'draft') { db.prepare("UPDATE documents SET status = 'sent', updated_at = ? WHERE id = ?").run(now(), d.id); d.status = 'sent'; }
      const n = await sendDoc(d);
      if ((d.kind === 'act' || d.kind === 'report') && d.request_id) ctx.addUpdate(d.request_id, { note: `${T(d.lang).doc[d.kind]} ${d.number}`, public: true });
      return json(res, 200, { ok: true, sent: n });
    }
    if ((m = p.match(/^\/docs\/(\d+)\/copy$/)) && method === 'POST') {
      const b = await readJson(req);
      const src = docRow(db.prepare('SELECT * FROM documents WHERE id = ?').get(+m[1]));
      if (!src) return json(res, 404, { error: 'not_found' });
      const kind = DOC_KINDS[b.kind] ? b.kind : src.kind;
      const data = { ...src.data, date: '', ...(kind !== src.kind ? { ref: `${src.number}` } : {}) };
      const id = Number(db.prepare('INSERT INTO documents(kind, number, token, request_id, customer_id, lang, data, status, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)')
        .run(kind, nextDocNumber(kind), randToken(18), src.request_id, src.customer_id, src.lang, JSON.stringify(data), 'draft', now(), now()).lastInsertRowid);
      return json(res, 201, { ok: true, id });
    }
    if ((m = p.match(/^\/docs\/(\d+)$/)) && method === 'DELETE') { db.prepare('DELETE FROM documents WHERE id = ?').run(+m[1]); return json(res, 200, { ok: true }); }
    return undefined;
  }

  // Chop etiladigan QR yorliqlar sahifasi (admin)
  function qrPage(res, ids) {
    const c = cfg();
    const list = ids.length ? db.prepare(`SELECT e.*, c.company FROM equipment e LEFT JOIN customers c ON c.id = e.customer_id WHERE e.id IN (${ids.map(() => '?').join(',')})`).all(...ids) : [];
    const labels = list.map((e) => `<figure class="qr-label"><div class="qr-img">${qrSvg(`${c.domain}/e/${e.code}/`)}</div><figcaption><b>${esc([e.brand, e.model].filter(Boolean).join(' '))}</b>${e.serial ? `<span>S/N ${esc(e.serial)}</span>` : ''}${e.company ? `<span>${esc(e.company)}</span>` : ''}<code>${esc(e.code)}</code><small>${esc(c.brand)} · ${esc(c.phone)}</small><small>Nosozlik? QR ni skanerlang · Неисправность? Сканируйте QR</small></figcaption></figure>`).join('');
    send(res, 200, `<!doctype html><html lang="uz"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>QR yorliqlar</title><link rel="stylesheet" href="/assets/css/admin.css?v=${VER}"><script src="/assets/js/print.js?v=${VER}" defer></script></head><body class="qr-print"><p class="qr-tools"><button type="button" data-print>Chop etish / PDF</button> ${list.length} ta yorliq. A4 ga 8 tadan joylashadi.</p><main class="qr-grid">${labels || '<p>Uskuna tanlanmagan.</p>'}</main></body></html>`, 'text/html; charset=utf-8', { 'Cache-Control': 'no-store' });
  }

  return { page, sitemapPaths, apiDocAccept, admin, qrPage, startScheduler, markDone, dueList, maintenanceTick };
}
