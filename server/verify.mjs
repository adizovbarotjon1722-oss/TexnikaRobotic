// Tasdiqlash kodlari: telefon raqamiga SMS (Eskiz.uz) yoki emailga xat (Brevo) orqali 6 xonali kod.
// Sozlash (hosting o'zgaruvchilari):
//   ESKIZ_EMAIL, ESKIZ_PASSWORD   Eskiz.uz kabinetidagi login va parol
//   ESKIZ_FROM                    jo'natuvchi nomi (standart: 4546)
//   BREVO_API_KEY, MAIL_FROM      Brevo API kaliti va tasdiqlangan jo'natuvchi email
// Kanal sozlanmagan bo'lsa, ro'yxatdan o'tish kodsiz ishlaydi, foydalanuvchi esa "tasdiqlanmagan" bo'lib qoladi.
import crypto from 'crypto';
import { db, now, getSetting, setSetting } from './db.mjs';
import { rateLimit, randToken } from './security.mjs';

const ESKIZ = process.env.ESKIZ_API_BASE || 'https://notify.eskiz.uz';
const MAILAPI = process.env.MAIL_API_BASE || 'https://api.brevo.com';
const CODE_MIN = 10;
const RESEND_SEC = 60;
const MAX_TRIES = 5;

db.exec(`CREATE TABLE IF NOT EXISTS verify_codes (login TEXT NOT NULL, purpose TEXT NOT NULL, code_hash TEXT NOT NULL, expires TEXT NOT NULL,
  tries INTEGER NOT NULL DEFAULT 0, sent_at TEXT NOT NULL, PRIMARY KEY (login, purpose));
CREATE TABLE IF NOT EXISTS verify_log (id INTEGER PRIMARY KEY, at TEXT NOT NULL, channel TEXT NOT NULL, login TEXT NOT NULL, purpose TEXT NOT NULL, ok INTEGER NOT NULL, ip TEXT, error TEXT);`);

let secret = getSetting('verify_secret');
if (!secret) { secret = randToken(32); setSetting('verify_secret', secret); }
const hmac = (login, purpose, code) => crypto.createHmac('sha256', secret).update(`${login}|${purpose}|${code}`).digest('hex');

export const smsReady = () => Boolean(process.env.ESKIZ_EMAIL && process.env.ESKIZ_PASSWORD);
export const mailReady = () => Boolean(process.env.BREVO_API_KEY && process.env.MAIL_FROM);
export const channelFor = (login) => (String(login).includes('@') ? (mailReady() ? 'email' : null) : (smsReady() ? 'sms' : null));

/* ---- Eskiz: token 30 kun yashaydi, 401 bo'lsa yangilanadi ---- */
let eskizToken = '';
async function eskizLogin() {
  const fd = new FormData();
  fd.append('email', process.env.ESKIZ_EMAIL); fd.append('password', process.env.ESKIZ_PASSWORD);
  const r = await fetch(`${ESKIZ}/api/auth/login`, { method: 'POST', body: fd, signal: AbortSignal.timeout(15000) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j?.data?.token) throw new Error(`eskiz login ${r.status}`);
  eskizToken = j.data.token;
}
async function sendSms(phone, text) {
  if (!eskizToken) await eskizLogin();
  const go = () => {
    const fd = new FormData();
    fd.append('mobile_phone', phone.replace(/\D/g, '')); fd.append('message', text); fd.append('from', process.env.ESKIZ_FROM || '4546');
    return fetch(`${ESKIZ}/api/message/sms/send`, { method: 'POST', headers: { Authorization: `Bearer ${eskizToken}` }, body: fd, signal: AbortSignal.timeout(15000) });
  };
  let r = await go();
  if (r.status === 401) { await eskizLogin(); r = await go(); }
  if (!r.ok) throw new Error(`eskiz send ${r.status} ${(await r.text().catch(() => '')).slice(0, 160)}`);
}
async function sendMail(to, subject, text) {
  const r = await fetch(`${MAILAPI}/v3/smtp/email`, {
    method: 'POST', headers: { 'api-key': process.env.BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ sender: { email: process.env.MAIL_FROM, name: process.env.MAIL_FROM_NAME || 'Texnika Servis' }, to: [{ email: to }], subject, textContent: text }),
    signal: AbortSignal.timeout(15000)
  });
  if (!r.ok) throw new Error(`brevo ${r.status} ${(await r.text().catch(() => '')).slice(0, 160)}`);
}

// Kun bo'yicha umumiy cheklov: kimdir SMS hisobini bo'shatib yubormasligi uchun
function dailyCapOk(channel) {
  const cap = parseInt(getSetting(`verify_cap_${channel}`, '') || (channel === 'sms' ? '300' : '1000'), 10);
  const n = db.prepare('SELECT COUNT(*) n FROM verify_log WHERE channel = ? AND ok = 1 AND at > ?').get(channel, new Date(Date.now() - 864e5).toISOString()).n;
  return n < cap;
}

/* Kod yuborish. Natija: { ok, channel } | { error } */
export async function sendCode({ login, purpose, ip, brand, t }) {
  const channel = channelFor(login);
  if (!channel) return { ok: true, channel: null };
  const prev = db.prepare('SELECT * FROM verify_codes WHERE login = ? AND purpose = ?').get(login, purpose);
  if (prev && Date.now() - Date.parse(prev.sent_at) < RESEND_SEC * 1000) return { error: 'wait', wait: RESEND_SEC - Math.floor((Date.now() - Date.parse(prev.sent_at)) / 1000) };
  if (!rateLimit(`vc:ip:${ip}`, 6, 3600e3) || !rateLimit(`vc:l:${login}`, 5, 6 * 3600e3)) return { error: 'rate' };
  if (!dailyCapOk(channel)) return { error: 'cap' };
  const code = String(crypto.randomInt(100000, 1000000));
  const text = t.smsText.replace('{brand}', brand).replace('{code}', code);
  try {
    if (channel === 'sms') await sendSms(login, text);
    else await sendMail(login, t.mailSubject.replace('{brand}', brand), `${text}\n\n${t.mailNote}`);
  } catch (e) {
    db.prepare('INSERT INTO verify_log(at, channel, login, purpose, ok, ip, error) VALUES (?, ?, ?, ?, 0, ?, ?)').run(now(), channel, login, purpose, ip, String(e.message).slice(0, 200));
    console.error('verify:', e.message);
    return { error: 'send' };
  }
  db.prepare(`INSERT INTO verify_codes(login, purpose, code_hash, expires, tries, sent_at) VALUES (?, ?, ?, ?, 0, ?)
    ON CONFLICT(login, purpose) DO UPDATE SET code_hash = excluded.code_hash, expires = excluded.expires, tries = 0, sent_at = excluded.sent_at`)
    .run(login, purpose, hmac(login, purpose, code), new Date(Date.now() + CODE_MIN * 60e3).toISOString(), now());
  db.prepare('INSERT INTO verify_log(at, channel, login, purpose, ok, ip) VALUES (?, ?, ?, ?, 1, ?)').run(now(), channel, login, purpose, ip);
  return { ok: true, channel };
}

/* Kodni tekshirish (bir martalik). true | false */
export function checkCode(login, purpose, code) {
  const r = db.prepare('SELECT * FROM verify_codes WHERE login = ? AND purpose = ?').get(login, purpose);
  if (!r || r.expires < now() || r.tries >= MAX_TRIES) return false;
  code = String(code || '').replace(/\D/g, '');
  const a = Buffer.from(hmac(login, purpose, code)), b = Buffer.from(r.code_hash);
  if (code.length !== 6 || a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    db.prepare('UPDATE verify_codes SET tries = tries + 1 WHERE login = ? AND purpose = ?').run(login, purpose);
    return false;
  }
  db.prepare('DELETE FROM verify_codes WHERE login = ? AND purpose = ?').run(login, purpose);
  return true;
}

export function verifyStats() {
  const day = new Date(Date.now() - 864e5).toISOString();
  return {
    sms: smsReady(), email: mailReady(),
    sent24: db.prepare('SELECT channel, SUM(ok) ok, SUM(1 - ok) failed FROM verify_log WHERE at > ? GROUP BY channel').all(day),
    lastErrors: db.prepare('SELECT at, channel, error FROM verify_log WHERE ok = 0 ORDER BY id DESC LIMIT 5').all()
  };
}
setInterval(() => { db.prepare('DELETE FROM verify_codes WHERE expires < ?').run(now()); db.prepare('DELETE FROM verify_log WHERE at < ?').run(new Date(Date.now() - 90 * 864e5).toISOString()); }, 3600e3).unref();
