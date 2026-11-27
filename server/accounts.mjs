// Foydalanuvchi akkauntlari: ro'yxatdan o'tish, kirish (telefon yoki email + parol), shaxsiy kabinet,
// parolni Telegram orqali tiklash, admin uchun foydalanuvchilar ro'yxati va faollik jurnali.
import crypto from 'crypto';
import { db, now, J } from './db.mjs';
import { rateLimit, randToken, sha256, hashPassword, verifyPassword, parseCookies, clean } from './security.mjs';
import { sendText, sendTo, tgEnabled } from './telegram.mjs';
import { LANGS } from '../src/i18n.mjs';
import { sendCode, checkCode, channelFor } from './verify.mjs';
import { esc } from '../src/template.mjs';

const SESSION_DAYS = 30;
const RESET_MIN = 15;
const MIN_PW = 8;
const SEEN_MS = 2 * 60e3;

// Oddiy, tez topiladigan parollar rad etiladi
const COMMON = new Set(['12345678', '123456789', '1234567890', '87654321', '11111111', '00000000', '12341234', 'password', 'password1', 'qwerty123', 'qwertyui', 'qwertyuiop', '1q2w3e4r', '1qaz2wsx', 'abc12345', 'iloveyou', 'parol123', 'admin123', 'texnika1', 'uzbekistan', 'toshkent', 'tashkent', 'samarqand']);
export function weakPassword(pw, login = '') {
  pw = String(pw || '');
  if (pw.length < MIN_PW || pw.length > 200) return true;
  const low = pw.toLowerCase();
  if (COMMON.has(low) || /^(.)\1+$/.test(pw)) return true;
  const ld = String(login).replace(/\D/g, '');
  if (ld && ld.length >= 7 && low.replace(/\D/g, '').length >= 7 && ld.endsWith(low.replace(/\D/g, '').slice(-9))) return true;
  if (String(login).includes('@') && low.includes(String(login).split('@')[0].toLowerCase()) && String(login).split('@')[0].length >= 4) return true;
  return false;
}
// Qurilma nomi: brauzer va OT (to'liq User-Agent saqlanmaydi)
export function deviceName(ua) {
  ua = String(ua || '');
  const os = /Android/i.test(ua) ? 'Android' : /iPhone|iPad|iOS/i.test(ua) ? 'iOS' : /Windows/i.test(ua) ? 'Windows' : /Mac OS X|Macintosh/i.test(ua) ? 'macOS' : /Linux/i.test(ua) ? 'Linux' : '';
  const br = /Edg\//.test(ua) ? 'Edge' : /OPR\/|Opera/.test(ua) ? 'Opera' : /YaBrowser/.test(ua) ? 'Yandex' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : /Telegram/i.test(ua) ? 'Telegram' : '';
  return [br, os].filter(Boolean).join(' · ') || 'Brauzer';
}
const maskIp = (ip) => String(ip || '').replace(/(\d+)\.(\d+)\.\d+\.\d+$/, '$1.$2.x.x').replace(/^([0-9a-f]+:[0-9a-f]+):.*$/i, '$1:…');

// Telefon (+998...) yoki email. Noto'g'ri bo'lsa null.
export function normLogin(v) {
  v = clean(v, 120).toLowerCase().replace(/\s+/g, '');
  if (v.includes('@')) return /^[^@]{1,64}@[a-z0-9.-]+\.[a-z]{2,}$/.test(v) ? v : null;
  let d = v.replace(/\D/g, '');
  if (d.length === 9) d = '998' + d;
  return d.length >= 11 && d.length <= 15 ? '+' + d : null;
}

export function createAccounts(ctx) {
  const { json, readJson, send, isSecure, clientIp } = ctx;
  const COOKIE = (req) => (isSecure(req) ? '__Host-tx_user' : 'tx_user');
  const cookieTail = (req) => `; Path=/; SameSite=Lax${isSecure(req) ? '; Secure' : ''}`;

  function event(uid, kind, ref = '') {
    db.prepare('INSERT INTO user_events(user_id, at, kind, ref) VALUES (?, ?, ?, ?)').run(uid, now(), kind, String(ref).slice(0, 200));
  }

  /* ---- Sessiya ---- */
  function userFrom(req) {
    const tok = parseCookies(req.headers.cookie)[COOKIE(req)];
    if (!tok || !/^[A-Za-z0-9_-]{30,}$/.test(tok)) return null;
    const s = db.prepare('SELECT * FROM user_sessions WHERE token_hash = ?').get(sha256(tok));
    if (!s || s.expires < now()) return null;
    const u = db.prepare('SELECT * FROM users WHERE id = ?').get(s.user_id);
    if (!u || u.blocked) return null;
    if (!s.last_seen || Date.now() - Date.parse(s.last_seen) > SEEN_MS) {
      db.prepare('UPDATE user_sessions SET last_seen = ? WHERE token_hash = ?').run(now(), s.token_hash);
      db.prepare('UPDATE users SET last_seen = ? WHERE id = ?').run(now(), u.id);
    }
    u._sess = s.token_hash;
    return u;
  }
  function startSession(req, res, u, extra = {}) {
    const token = randToken(32);
    const exp = new Date(Date.now() + SESSION_DAYS * 864e5).toISOString();
    const ua = deviceName(req.headers['user-agent']), ip = clientIp(req);
    // Yangi qurilmadan kirilsa, Telegram ulangan foydalanuvchiga xabar boradi
    const known = db.prepare('SELECT 1 FROM user_sessions WHERE user_id = ? AND ua = ? AND ip = ? LIMIT 1').get(u.id, ua, ip) || db.prepare("SELECT 1 FROM user_events WHERE user_id = ? AND kind = 'login' AND ref = ? LIMIT 1").get(u.id, `${ua} ${maskIp(ip)}`);
    if (!known && u.tg_id && extra.notify !== false) {
      const t = ctx.T(LANGS.includes(u.lang) ? u.lang : 'uz');
      sendTo(u.tg_id, `🔐 ${esc(t.acc2.newLogin)}\n${esc(ua)} · ${esc(maskIp(ip))}\n${esc(t.acc2.newLoginNote)}`).catch(() => {});
    }
    delete extra.notify;
    db.prepare('INSERT INTO user_sessions(token_hash, user_id, created_at, expires, ua, ip, last_seen) VALUES (?, ?, ?, ?, ?, ?, ?)').run(sha256(token), u.id, now(), exp, ua, ip, now());
    db.prepare('DELETE FROM user_sessions WHERE expires < ?').run(now());
    db.prepare('UPDATE users SET last_login = ?, login_count = login_count + 1, last_ip = ? WHERE id = ?').run(now(), clientIp(req), u.id);
    const age = SESSION_DAYS * 86400;
    // tx_in: sahifa skripti foydalanuvchi kirganini bilishi uchun (maxfiy emas)
    return json(res, 200, { ok: true, ...extra }, { 'Set-Cookie': [`${COOKIE(req)}=${token}; HttpOnly; Max-Age=${age}${cookieTail(req)}`, `tx_in=1; Max-Age=${age}${cookieTail(req)}`] });
  }
  function endSession(req, res) {
    const tok = parseCookies(req.headers.cookie)[COOKIE(req)];
    if (tok) db.prepare('DELETE FROM user_sessions WHERE token_hash = ?').run(sha256(tok));
    return json(res, 200, { ok: true }, { 'Set-Cookie': [`${COOKIE(req)}=; HttpOnly; Max-Age=0${cookieTail(req)}`, `tx_in=; Max-Age=0${cookieTail(req)}`] });
  }
  const pub = (u) => ({ name: u.name, login: u.login, company: u.company || '', tg: Boolean(u.tg_id), verified: Boolean(u.verified), lang: u.lang || '', created_at: u.created_at });
  const T = (lang) => ctx.T(LANGS.includes(lang) ? lang : 'uz');

  /* ---- Tasdiqlash kodi (SMS yoki email) ---- */
  async function code(req, res, ip, u) {
    if (!rateLimit('vc:global', 300, 3600e3)) return json(res, 429, { error: 'rate' });
    const b = await readJson(req);
    if (b.website) return json(res, 200, { ok: true, channel: null });
    const purpose = ['register', 'reset', 'verify'].includes(b.purpose) ? b.purpose : '';
    const lg = purpose === 'verify' ? (u && u.login) : normLogin(b.login);
    if (!purpose || !lg) return json(res, purpose === 'verify' ? 401 : 400, { error: purpose === 'verify' ? 'auth' : 'login' });
    const lang = LANGS.includes(b.lang) ? b.lang : 'uz';
    if (purpose === 'register' && db.prepare('SELECT 1 FROM users WHERE login = ?').get(lg)) return json(res, 409, { error: 'exists' });
    if (purpose === 'reset') {
      // Akkaunt bor-yo'qligi oshkor qilinmaydi: javob doim bir xil
      const x = db.prepare('SELECT * FROM users WHERE login = ?').get(lg);
      if (!x || x.blocked || !channelFor(lg)) return json(res, 200, { ok: true, channel: channelFor(lg) });
      const r = await sendCode({ login: lg, purpose, ip, brand: ctx.cfg().brand, t: T(x.lang || lang).acc2 });
      if (r.ok) event(x.id, 'reset_code');
      return r.error === 'wait' ? json(res, 429, r) : json(res, 200, { ok: true, channel: channelFor(lg) });
    }
    const r = await sendCode({ login: lg, purpose, ip, brand: ctx.cfg().brand, t: T(lang).acc2 });
    if (r.error) return json(res, r.error === 'send' || r.error === 'cap' ? 503 : 429, r);
    return json(res, 200, r);
  }

  /* ---- Ro'yxatdan o'tish va kirish ---- */
  async function register(req, res, ip) {
    if (!rateLimit(`reg:${ip}`, 10, 3600e3) || !rateLimit('reg:global', 200, 3600e3)) return json(res, 429, { error: 'rate' });
    const b = await readJson(req);
    if (b.website) return json(res, 200, { ok: true });
    const name = clean(b.name, 80); const company = clean(b.company, 100); const login = normLogin(b.login);
    const pw = String(b.password || '');
    if (name.length < 2) return json(res, 400, { error: 'name' });
    if (!login) return json(res, 400, { error: 'login' });
    if (weakPassword(pw, login)) return json(res, 400, { error: 'weak' });
    if (db.prepare('SELECT 1 FROM users WHERE login = ?').get(login)) return json(res, 409, { error: 'exists' });
    // SMS/email sozlangan bo'lsa, kod majburiy
    const needCode = Boolean(channelFor(login));
    if (needCode && !b.code) return json(res, 400, { error: 'need_code', channel: channelFor(login) });
    if (needCode && !checkCode(login, 'register', b.code)) return json(res, 400, { error: 'bad_code' });
    const lang = LANGS.includes(b.lang) ? b.lang : 'uz';
    const r = db.prepare('INSERT INTO users(login, name, company, pw_hash, lang, created_at, verified) VALUES (?, ?, ?, ?, ?, ?, ?)').run(login, name, company, hashPassword(pw), lang, now(), needCode ? 1 : 0);
    const u = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(r.lastInsertRowid));
    event(u.id, 'register');
    sendText(`👤 Yangi foydalanuvchi: <b>${esc(name)}</b>\n${esc(login)}${company ? `\n${esc(company)}` : ''}${needCode ? '\n✅ tasdiqlangan' : ''}`).catch(() => {});
    return startSession(req, res, u);
  }
  async function login(req, res, ip) {
    const b = await readJson(req);
    const lg = normLogin(b.login);
    if (!rateLimit(`ulogin:${ip}`, 10, 900e3) || (lg && !rateLimit(`ulogin:${lg}`, 8, 900e3))) return json(res, 429, { error: 'rate' });
    const u = lg && db.prepare('SELECT * FROM users WHERE login = ?').get(lg);
    if (!u || !verifyPassword(String(b.password || ''), u.pw_hash)) {
      if (u) event(u.id, 'login_fail', maskIp(ip));
      await new Promise((r) => setTimeout(r, 400)); return json(res, 401, { error: 'bad_login' });
    }
    if (u.blocked) return json(res, 403, { error: 'blocked' });
    event(u.id, 'login', `${deviceName(req.headers['user-agent'])} ${maskIp(ip)}`);
    return startSession(req, res, u);
  }

  /* ---- Parolni tiklash: 6 xonali kod Telegram orqali; Telegram ulanmagan bo'lsa muhandisga xabar ---- */
  async function forgot(req, res, ip) {
    if (!rateLimit(`forgot:${ip}`, 5, 3600e3)) return json(res, 429, { error: 'rate' });
    const b = await readJson(req);
    const lg = normLogin(b.login);
    const u = lg && db.prepare('SELECT * FROM users WHERE login = ?').get(lg);
    if (u && !u.blocked && channelFor(u.login)) {
      const r = await sendCode({ login: u.login, purpose: 'reset', ip, brand: ctx.cfg().brand, t: T(u.lang).acc2 });
      if (r.ok) event(u.id, 'reset_code');
      return json(res, 200, { ok: true, channel: channelFor(u.login) });
    }
    if (u && !u.blocked && rateLimit(`forgot:u${u.id}`, 3, 3600e3)) {
      if (u.tg_id && tgEnabled()) {
        const code = String(crypto.randomInt(100000, 1000000));
        db.prepare('INSERT INTO user_resets(user_id, code_hash, expires, tries) VALUES (?, ?, ?, 0) ON CONFLICT(user_id) DO UPDATE SET code_hash = excluded.code_hash, expires = excluded.expires, tries = 0')
          .run(u.id, sha256(`${u.id}:${code}`), new Date(Date.now() + RESET_MIN * 60e3).toISOString());
        const t = ctx.T(LANGS.includes(u.lang) ? u.lang : 'uz');
        await sendTo(u.tg_id, `${esc(t.acc.tgCode)}: <b>${code}</b>\n${esc(t.acc.tgCodeNote)}`).catch(() => {});
        event(u.id, 'reset_code');
      } else {
        sendText(`🔑 Parolni tiklash so‘raldi: <b>${esc(u.name)}</b> (${esc(u.login)}). Telegram ulanmagan, admin paneldan yangi parol bering: Foydalanuvchilar bo‘limi.`).catch(() => {});
        event(u.id, 'reset_admin');
      }
    }
    return json(res, 200, { ok: true, channel: lg ? channelFor(lg) : null });
  }
  async function reset(req, res, ip) {
    if (!rateLimit(`reset:${ip}`, 10, 900e3)) return json(res, 429, { error: 'rate' });
    const b = await readJson(req);
    const lg = normLogin(b.login);
    const u = lg && db.prepare('SELECT * FROM users WHERE login = ?').get(lg);
    if (!u) return json(res, 400, { error: 'bad_code' });
    const pw = String(b.password || '');
    if (weakPassword(pw, u.login)) return json(res, 400, { error: 'weak' });
    const code = String(b.code || '').replace(/\D/g, '');
    let viaChannel = false;
    if (channelFor(u.login)) viaChannel = checkCode(u.login, 'reset', code);
    if (!viaChannel) {
      const r = db.prepare('SELECT * FROM user_resets WHERE user_id = ?').get(u.id);
      if (!r || r.expires < now() || r.tries >= 5) return json(res, 400, { error: 'bad_code' });
      if (sha256(`${u.id}:${code}`) !== r.code_hash) { db.prepare('UPDATE user_resets SET tries = tries + 1 WHERE user_id = ?').run(u.id); return json(res, 400, { error: 'bad_code' }); }
    }
    db.prepare('UPDATE users SET pw_hash = ?, verified = CASE WHEN ? THEN 1 ELSE verified END WHERE id = ?').run(hashPassword(pw), viaChannel ? 1 : 0, u.id);
    db.prepare('DELETE FROM user_resets WHERE user_id = ?').run(u.id);
    db.prepare('DELETE FROM user_sessions WHERE user_id = ?').run(u.id);
    event(u.id, 'reset_done');
    if (u.blocked) return json(res, 403, { error: 'blocked' });
    return startSession(req, res, u);
  }

  /* ---- Kabinet ---- */
  async function profile(req, res, u) {
    const b = await readJson(req);
    const name = clean(b.name, 80); if (name.length < 2) return json(res, 400, { error: 'name' });
    db.prepare('UPDATE users SET name = ?, company = ?, lang = COALESCE(?, lang) WHERE id = ?').run(name, clean(b.company, 100), LANGS.includes(b.lang) ? b.lang : null, u.id);
    db.prepare('UPDATE learners SET name = ? WHERE user_id = ?').run(name, u.id);
    return json(res, 200, { ok: true });
  }
  async function password(req, res, u) {
    if (!rateLimit(`upw:${u.id}`, 10, 3600e3)) return json(res, 429, { error: 'rate' });
    const b = await readJson(req);
    if (!verifyPassword(String(b.current || ''), u.pw_hash)) return json(res, 401, { error: 'bad_password' });
    const pw = String(b.next || '');
    if (weakPassword(pw, u.login)) return json(res, 400, { error: 'weak' });
    db.prepare('UPDATE users SET pw_hash = ? WHERE id = ?').run(hashPassword(pw), u.id);
    // Boshqa qurilmalardagi sessiyalar yopiladi, joriysi qoladi
    const tok = parseCookies(req.headers.cookie)[COOKIE(req)];
    db.prepare('DELETE FROM user_sessions WHERE user_id = ? AND token_hash != ?').run(u.id, sha256(tok || ''));
    event(u.id, 'password');
    return json(res, 200, { ok: true });
  }
  function tgLinkUrl(u) {
    const bot = ctx.botUsername();
    if (!bot || !tgEnabled()) return null;
    const token = randToken(18);
    db.prepare('DELETE FROM user_tg_links WHERE user_id = ? OR expires < ?').run(u.id, now());
    db.prepare('INSERT INTO user_tg_links(token_hash, user_id, expires) VALUES (?, ?, ?)').run(sha256(token), u.id, new Date(Date.now() + 30 * 60e3).toISOString());
    return `https://t.me/${bot}?start=acc_${token}`;
  }
  // Bot /start acc_<token> qabul qilganda chaqiriladi
  function linkTelegram(token, tgId) {
    const l = db.prepare('SELECT * FROM user_tg_links WHERE token_hash = ?').get(sha256(token));
    if (!l || l.expires < now()) return null;
    db.prepare('DELETE FROM user_tg_links WHERE token_hash = ?').run(l.token_hash);
    db.prepare('UPDATE users SET tg_id = NULL WHERE tg_id = ? AND id != ?').run(String(tgId), l.user_id);
    db.prepare('UPDATE users SET tg_id = ? WHERE id = ?').run(String(tgId), l.user_id);
    // Telegram orqali o'qigan bo'lsa, natijalari akkauntga biriktiriladi
    if (!db.prepare('SELECT 1 FROM learners WHERE user_id = ?').get(l.user_id)) db.prepare('UPDATE learners SET user_id = ? WHERE tg_id = ? AND user_id IS NULL').run(l.user_id, String(tgId));
    event(l.user_id, 'tg_link');
    return db.prepare('SELECT * FROM users WHERE id = ?').get(l.user_id);
  }
  function myRequests(uid, limit = 50) {
    return db.prepare(`SELECT code, created_at, updated_at, status, equipment, service FROM requests WHERE user_id = ? ORDER BY CASE WHEN status IN ('done','cancelled') THEN 1 ELSE 0 END, id DESC LIMIT ${limit}`).all(uid);
  }

  /* ---- Qurilmalar (sessiyalar) ---- */
  function sessions(u) {
    return db.prepare('SELECT token_hash, created_at, last_seen, ua, ip FROM user_sessions WHERE user_id = ? AND expires > ? ORDER BY COALESCE(last_seen, created_at) DESC LIMIT 20').all(u.id, now())
      .map((s) => ({ id: s.token_hash.slice(0, 16), created_at: s.created_at, last_seen: s.last_seen || s.created_at, device: s.ua || 'Brauzer', ip: maskIp(s.ip), current: s.token_hash === u._sess }));
  }
  async function revoke(req, res, u) {
    const b = await readJson(req);
    if (b.id === 'others') db.prepare('DELETE FROM user_sessions WHERE user_id = ? AND token_hash != ?').run(u.id, u._sess || '');
    else if (/^[0-9a-f]{16}$/.test(String(b.id || ''))) db.prepare("DELETE FROM user_sessions WHERE user_id = ? AND substr(token_hash, 1, 16) = ? AND token_hash != ?").run(u.id, b.id, u._sess || '');
    else return json(res, 400, { error: 'bad' });
    event(u.id, 'sessions_revoke');
    return json(res, 200, { ok: true, sessions: sessions(u) });
  }
  async function confirmLogin(req, res, u) {
    const b = await readJson(req);
    if (!rateLimit(`vfy:${u.id}`, 10, 3600e3)) return json(res, 429, { error: 'rate' });
    if (!checkCode(u.login, 'verify', b.code)) return json(res, 400, { error: 'bad_code' });
    db.prepare('UPDATE users SET verified = 1 WHERE id = ?').run(u.id);
    event(u.id, 'verified');
    return json(res, 200, { ok: true });
  }

  async function api(req, res, ip, p, method) {
    if (p === '/api/account/register' && method === 'POST') return register(req, res, ip);
    if (p === '/api/account/login' && method === 'POST') return login(req, res, ip);
    if (p === '/api/account/logout' && method === 'POST') return endSession(req, res);
    if (p === '/api/account/forgot' && method === 'POST') return forgot(req, res, ip);
    if (p === '/api/account/reset' && method === 'POST') return reset(req, res, ip);
    if (p === '/api/account/code' && method === 'POST') return code(req, res, ip, userFrom(req));
    const u = userFrom(req);
    if (!u) return json(res, 401, { error: 'auth' });
    if (p === '/api/account/me' && method === 'GET') return json(res, 200, pub(u));
    if (p === '/api/account/profile' && method === 'POST') return profile(req, res, u);
    if (p === '/api/account/password' && method === 'POST') return password(req, res, u);
    if (p === '/api/account/tg-link' && method === 'POST') { const url = tgLinkUrl(u); return url ? json(res, 200, { url }) : json(res, 503, { error: 'tg_off' }); }
    if (p === '/api/account/tg-unlink' && method === 'POST') { db.prepare('UPDATE users SET tg_id = NULL WHERE id = ?').run(u.id); return json(res, 200, { ok: true }); }
    if (p === '/api/account/requests' && method === 'GET') return json(res, 200, myRequests(u.id));
    if (p === '/api/account/sessions' && method === 'GET') return json(res, 200, sessions(u));
    if (p === '/api/account/sessions' && method === 'POST') return revoke(req, res, u);
    if (p === '/api/account/verify' && method === 'POST') return confirmLogin(req, res, u);
    return json(res, 404, { error: 'not_found' });
  }

  /* ---- Admin: foydalanuvchilar ---- */
  const LIST_SQL = `SELECT u.id, u.login, u.name, u.company, u.created_at, u.last_login, u.login_count, u.blocked, u.tg_id IS NOT NULL tg, u.verified, u.last_seen,
    (SELECT COUNT(*) FROM user_sessions s WHERE s.user_id = u.id AND s.expires > strftime('%Y-%m-%dT%H:%M:%fZ','now')) sessions,
    (SELECT COUNT(*) FROM user_events e WHERE e.user_id = u.id AND e.kind = 'login_fail' AND e.at > strftime('%Y-%m-%dT%H:%M:%fZ','now','-1 day')) fails,
    (SELECT COUNT(*) FROM requests r WHERE r.user_id = u.id) requests,
    (SELECT COUNT(*) FROM progress p JOIN learners l ON l.id = p.learner_id WHERE l.user_id = u.id) lessons,
    (SELECT COUNT(*) FROM quiz_results q JOIN learners l ON l.id = q.learner_id WHERE l.user_id = u.id AND q.passed = 1) certs,
    (SELECT MAX(at) FROM user_events e WHERE e.user_id = u.id) last_active
    FROM users u`;
  async function admin(req, res, p, method, q) {
    let m;
    if (p === '/users' && method === 'GET') {
      const s = clean(q.get('q'), 60);
      const rows = s ? db.prepare(`${LIST_SQL} WHERE u.name LIKE ? OR u.login LIKE ? OR u.company LIKE ? ORDER BY u.id DESC LIMIT 500`).all(`%${s}%`, `%${s}%`, `%${s}%`) : db.prepare(`${LIST_SQL} ORDER BY u.id DESC LIMIT 500`).all();
      const wk = new Date(Date.now() - 7 * 864e5).toISOString();
      const total = db.prepare('SELECT COUNT(*) n, SUM(created_at > ?) week, SUM(last_seen > ? OR last_login > ?) active, SUM(last_seen > ?) online, SUM(verified) verified FROM users').get(wk, wk, wk, new Date(Date.now() - 5 * 60e3).toISOString());
      return json(res, 200, { rows, total: { all: total.n || 0, week: total.week || 0, active: total.active || 0, online: total.online || 0, verified: total.verified || 0 } }), true;
    }
    if (p === '/users-activity' && method === 'GET') {
      const rows = db.prepare('SELECT e.at, e.kind, e.ref, u.id uid, u.name, u.login FROM user_events e JOIN users u ON u.id = e.user_id ORDER BY e.id DESC LIMIT 150').all();
      return json(res, 200, rows), true;
    }
    if (p === '/users.csv' && method === 'GET') {
      const rows = db.prepare(`${LIST_SQL} ORDER BY u.id DESC`).all();
      const cell = (v) => { let s = String(v ?? ''); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
      const head = 'name,login,company,registered,last_login,logins,requests,lessons,certificates,telegram,blocked';
      const csv = '﻿' + [head, ...rows.map((r) => [r.name, r.login, r.company, r.created_at, r.last_login, r.login_count, r.requests, r.lessons, r.certs, r.tg ? 'yes' : '', r.blocked ? 'yes' : ''].map(cell).join(','))].join('\r\n');
      send(res, 200, csv, 'text/csv; charset=utf-8', { 'Content-Disposition': 'attachment; filename="foydalanuvchilar.csv"', 'Cache-Control': 'no-store' });
      return true;
    }
    if ((m = p.match(/^\/users\/(\d+)$/))) {
      const id = +m[1];
      const u = db.prepare(`${LIST_SQL} WHERE u.id = ?`).get(id);
      if (!u) return json(res, 404, { error: 'not_found' }), true;
      if (method === 'GET') {
        const L = db.prepare('SELECT * FROM learners WHERE user_id = ? ORDER BY id LIMIT 1').get(id);
        const courses = L ? ctx.academy.summary(L, 'uz').courses.filter((c) => c.done || c.passed || c.expired) : [];
        const events = db.prepare('SELECT at, kind, ref FROM user_events WHERE user_id = ? ORDER BY id DESC LIMIT 100').all(id);
        const sess = db.prepare('SELECT created_at, last_seen, ua, ip FROM user_sessions WHERE user_id = ? AND expires > ? ORDER BY COALESCE(last_seen, created_at) DESC').all(id, now());
        return json(res, 200, { ...u, requestsList: db.prepare('SELECT id, code, created_at, status, equipment, service FROM requests WHERE user_id = ? ORDER BY id DESC LIMIT 100').all(id), learner: L ? { code: L.code, company: L.company } : null, courses, events, sessionsList: sess }), true;
      }
      if (method === 'POST') {
        const b = await readJson(req);
        if ('blocked' in b) {
          db.prepare('UPDATE users SET blocked = ? WHERE id = ?').run(b.blocked ? 1 : 0, id);
          if (b.blocked) db.prepare('DELETE FROM user_sessions WHERE user_id = ?').run(id);
        }
        if (b.logout) { db.prepare('DELETE FROM user_sessions WHERE user_id = ?').run(id); event(id, 'sessions_admin'); }
        if ('verified' in b) db.prepare('UPDATE users SET verified = ? WHERE id = ?').run(b.verified ? 1 : 0, id);
        if ('name' in b || 'company' in b) db.prepare('UPDATE users SET name = COALESCE(?, name), company = COALESCE(?, company) WHERE id = ?').run(clean(b.name, 80) || null, 'company' in b ? clean(b.company, 100) : null, id);
        return json(res, 200, { ok: true }), true;
      }
      if (method === 'DELETE') {
        db.prepare('UPDATE learners SET user_id = NULL WHERE user_id = ?').run(id);
        db.prepare('UPDATE requests SET user_id = NULL WHERE user_id = ?').run(id);
        db.prepare('DELETE FROM users WHERE id = ?').run(id);
        return json(res, 200, { ok: true }), true;
      }
    }
    if ((m = p.match(/^\/users\/(\d+)\/password$/)) && method === 'POST') {
      // Vaqtinchalik parol: admin foydalanuvchiga aytadi, u kabinetda o'zgartiradi
      const pw = randToken(9).replace(/[-_]/g, 'x');
      const r = db.prepare('UPDATE users SET pw_hash = ? WHERE id = ?').run(hashPassword(pw), +m[1]);
      if (!r.changes) return json(res, 404, { error: 'not_found' }), true;
      db.prepare('DELETE FROM user_sessions WHERE user_id = ?').run(+m[1]);
      event(+m[1], 'password_admin');
      return json(res, 200, { password: pw }), true;
    }
    return false;
  }

  return { api, admin, userFrom, linkTelegram, myRequests, event, pub, sessions };
}
