// Xavfsizlik yordamchilari: sarlavhalar, tezlik cheklovi, parol, sessiya, rasm tekshiruvi.
import crypto from 'crypto';
import { db, now, getSetting, setSetting } from './db.mjs';

export const CSP = [
  "default-src 'none'", "script-src 'self'", "style-src 'self'", "font-src 'self'", "img-src 'self' data: blob:", "media-src 'self' blob:",
  "connect-src 'self'", "manifest-src 'self'", "frame-src https://www.youtube-nocookie.com https://player.vimeo.com", "base-uri 'none'", "form-action 'self'", "frame-ancestors 'none'",
  "object-src 'none'", "upgrade-insecure-requests", "require-trusted-types-for 'script'", 'trusted-types lesson'
].join('; ');

export const SEC_HEADERS = {
  'Content-Security-Policy': CSP,
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'X-Permitted-Cross-Domain-Policies': 'none'
};

export const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');
export const randToken = (n = 32) => crypto.randomBytes(n).toString('base64url');

// Chalkash belgilarsiz (0/O, 1/I/L yo'q) kod: TX-7F3K-9QWD
const ALPH = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
export function randCode(prefix = 'TX', groups = 2, len = 4) {
  const parts = [];
  for (let g = 0; g < groups; g++) {
    let s = '';
    for (let i = 0; i < len; i++) s += ALPH[crypto.randomInt(ALPH.length)];
    parts.push(s);
  }
  return `${prefix}-${parts.join('-')}`;
}

/* Tezlik cheklovi (xotirada): key bo'yicha oynada n ta so'rov */
const buckets = new Map();
export function rateLimit(key, max, windowMs) {
  const t = Date.now();
  let b = buckets.get(key);
  if (!b || t > b.reset) { b = { n: 0, reset: t + windowMs }; buckets.set(key, b); }
  b.n++;
  return b.n <= max;
}
setInterval(() => { const t = Date.now(); for (const [k, b] of buckets) if (t > b.reset) buckets.delete(k); }, 60_000).unref();

/* Parol (scrypt) */
export function hashPassword(pw) {
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(pw, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$${salt.toString('hex')}$${key.toString('hex')}`;
}
export function verifyPassword(pw, stored) {
  const [alg, saltHex, keyHex] = String(stored || '').split('$');
  if (alg !== 'scrypt' || !saltHex || !keyHex) return false;
  const key = crypto.scryptSync(String(pw), Buffer.from(saltHex, 'hex'), 64, { N: 16384, r: 8, p: 1 });
  const exp = Buffer.from(keyHex, 'hex');
  return exp.length === key.length && crypto.timingSafeEqual(exp, key);
}

// ADMIN_PASSWORD o'zgartirilsa (masalan, hostingdagi o'zgaruvchilarda), keyingi ishga tushishda yangi parol kuchga kiradi.
// Admin paneldan o'zgartirilgan parol esa ADMIN_PASSWORD yana o'zgarmaguncha saqlanib qoladi.
export function ensureAdminPassword() {
  const env = String(process.env.ADMIN_PASSWORD || '').trim();
  const fp = env ? crypto.createHash('sha256').update(env).digest('hex') : '';
  if (getSetting('admin_hash') && (!env || getSetting('admin_env_fp') === fp)) return null;
  const pw = env || randToken(12);
  if (pw.length < 10) throw new Error('ADMIN_PASSWORD kamida 10 belgidan iborat bo‘lishi kerak');
  setSetting('admin_hash', hashPassword(pw));
  if (env) { setSetting('admin_env_fp', fp); db.prepare('DELETE FROM sessions').run(); }
  return env ? null : pw;
}

/* Admin sessiyasi */
const SESSION_HOURS = 12;
export function createSession() {
  const token = randToken(32);
  const csrf = randToken(24);
  const exp = new Date(Date.now() + SESSION_HOURS * 3600e3).toISOString();
  db.prepare('INSERT INTO sessions(token_hash, csrf, created_at, expires) VALUES (?, ?, ?, ?)').run(sha256(token), csrf, now(), exp);
  db.prepare('DELETE FROM sessions WHERE expires < ?').run(now());
  return { token, csrf, maxAge: SESSION_HOURS * 3600 };
}
export function getSession(token) {
  if (!token) return null;
  const s = db.prepare('SELECT * FROM sessions WHERE token_hash = ?').get(sha256(token));
  if (!s || s.expires < now()) return null;
  return s;
}
export function destroySession(token) { if (token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(sha256(token)); }
export function destroyAllSessions() { db.prepare('DELETE FROM sessions').run(); }

export function parseCookies(header) {
  const out = {};
  for (const part of String(header || '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

/* Rasm tekshiruvi: faqat haqiqiy JPEG/PNG/WEBP (fayl boshidagi baytlar bo'yicha) */
export function sniffImage(buf) {
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { mime: 'image/jpeg', ext: 'jpg' };
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { mime: 'image/png', ext: 'png' };
  if (buf.length > 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return { mime: 'image/webp', ext: 'webp' };
  return null;
}

// "data:image/jpeg;base64,...." yoki toza base64 -> tekshirilgan rasm
export function decodeImage(s, maxBytes = 8 * 1024 * 1024) {
  if (typeof s !== 'string' || s.length > maxBytes * 1.4) return null;
  const b64 = s.includes(',') ? s.slice(s.indexOf(',') + 1) : s;
  if (!/^[A-Za-z0-9+/=\s]+$/.test(b64)) return null;
  const data = Buffer.from(b64, 'base64');
  if (!data.length || data.length > maxBytes) return null;
  const kind = sniffImage(data);
  return kind ? { ...kind, data } : null;
}

// Matnni tozalash: boshqaruv belgilari va yo'nalishni o'zgartiruvchi belgilar olib tashlanadi
export function clean(v, max) {
  return String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F‪-‮⁦-⁩]/g, '').trim().slice(0, max);
}
