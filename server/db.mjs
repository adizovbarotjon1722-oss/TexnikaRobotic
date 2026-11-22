// SQLite ma'lumotlar bazasi (Node 22 ichidagi node:sqlite, tashqi kutubxonasiz).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { DatabaseSync } from 'node:sqlite';
import { courses as seedCourses, portfolio as seedPortfolio } from './seed-data.mjs';
import { errorCodes as seedErrors } from './errorcodes-data.mjs';
import { courses2, checks, extraQuiz } from './courses2-data.mjs';

export const DATA_DIR = process.env.DATA_DIR || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../data');
fs.mkdirSync(path.join(DATA_DIR, 'uploads/req'), { recursive: true });
fs.mkdirSync(path.join(DATA_DIR, 'media'), { recursive: true });

export const db = new DatabaseSync(path.join(DATA_DIR, 'texnika.db'));
db.exec(`
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS text_overrides (lang TEXT NOT NULL, key TEXT NOT NULL, value TEXT NOT NULL, PRIMARY KEY (lang, key));
CREATE TABLE IF NOT EXISTS requests (
  id INTEGER PRIMARY KEY, code TEXT UNIQUE NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  lang TEXT, name TEXT, phone TEXT, company TEXT, service TEXT, equipment TEXT, message TEXT,
  images TEXT NOT NULL DEFAULT '[]', status TEXT NOT NULL DEFAULT 'new', priority TEXT NOT NULL DEFAULT 'normal',
  ai TEXT, source TEXT, tg_ok INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS request_updates (
  id INTEGER PRIMARY KEY, request_id INTEGER NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL, status TEXT, note TEXT, public INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS portfolio (
  id INTEGER PRIMARY KEY, slug TEXT UNIQUE NOT NULL, brand TEXT, model TEXT, year INTEGER, images TEXT NOT NULL DEFAULT '[]', cover TEXT,
  data TEXT NOT NULL, published INTEGER NOT NULL DEFAULT 1, sample INTEGER NOT NULL DEFAULT 0, sort INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY, slug TEXT UNIQUE NOT NULL, level TEXT, equipment TEXT, hours INTEGER, data TEXT NOT NULL,
  published INTEGER NOT NULL DEFAULT 1, sort INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS lessons (id INTEGER PRIMARY KEY, course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE, sort INTEGER NOT NULL, data TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS quiz (id INTEGER PRIMARY KEY, course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE, sort INTEGER NOT NULL, data TEXT NOT NULL, answer INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS access_codes (code TEXT PRIMARY KEY, company TEXT NOT NULL, seats INTEGER NOT NULL DEFAULT 20, expires TEXT, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS learners (id INTEGER PRIMARY KEY, token_hash TEXT UNIQUE NOT NULL, name TEXT NOT NULL, code TEXT NOT NULL, company TEXT, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS progress (learner_id INTEGER NOT NULL REFERENCES learners(id) ON DELETE CASCADE, lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE, done_at TEXT NOT NULL, PRIMARY KEY (learner_id, lesson_id));
CREATE TABLE IF NOT EXISTS quiz_results (id INTEGER PRIMARY KEY, learner_id INTEGER NOT NULL REFERENCES learners(id) ON DELETE CASCADE, course_id INTEGER NOT NULL, score INTEGER NOT NULL, passed INTEGER NOT NULL, cert_id TEXT UNIQUE, at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY, ts TEXT NOT NULL, day TEXT NOT NULL, type TEXT NOT NULL, path TEXT, lang TEXT, ref TEXT, device TEXT, visitor TEXT, meta TEXT);
CREATE INDEX IF NOT EXISTS ev_day ON events(day, type);
CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, csrf TEXT NOT NULL, created_at TEXT NOT NULL, expires TEXT NOT NULL);
`);

// 3-bosqich: xato kodlari, mijozlar, uskunalar (QR pasport), profilaktika, hujjatlar, Telegram foydalanuvchilari
db.exec(`
CREATE TABLE IF NOT EXISTS error_codes (id INTEGER PRIMARY KEY, slug TEXT UNIQUE NOT NULL, brand TEXT NOT NULL, code TEXT NOT NULL, controller TEXT, severity TEXT NOT NULL DEFAULT 'normal', data TEXT NOT NULL, published INTEGER NOT NULL DEFAULT 1, views INTEGER NOT NULL DEFAULT 0, updated_at TEXT);
CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY, company TEXT NOT NULL, contact TEXT, phone TEXT, address TEXT, notes TEXT, link_code TEXT UNIQUE NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS customer_users (customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE, tg_id TEXT NOT NULL, created_at TEXT NOT NULL, PRIMARY KEY (customer_id, tg_id));
CREATE TABLE IF NOT EXISTS equipment (id INTEGER PRIMARY KEY, code TEXT UNIQUE NOT NULL, customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL, brand TEXT, model TEXT, serial TEXT, kind TEXT, location TEXT, year INTEGER, notes TEXT, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS equipment_events (id INTEGER PRIMARY KEY, equipment_id INTEGER NOT NULL REFERENCES equipment(id) ON DELETE CASCADE, at TEXT NOT NULL, kind TEXT NOT NULL, text TEXT, request_id INTEGER, public INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS maintenance (id INTEGER PRIMARY KEY, equipment_id INTEGER NOT NULL REFERENCES equipment(id) ON DELETE CASCADE, title TEXT NOT NULL, interval_days INTEGER NOT NULL, last_done TEXT, next_due TEXT NOT NULL, notify_customer INTEGER NOT NULL DEFAULT 1, notified_for TEXT);
CREATE TABLE IF NOT EXISTS documents (id INTEGER PRIMARY KEY, kind TEXT NOT NULL, number TEXT NOT NULL, token TEXT UNIQUE NOT NULL, request_id INTEGER REFERENCES requests(id) ON DELETE SET NULL, customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL, lang TEXT NOT NULL DEFAULT 'uz', data TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'draft', created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS tg_users (tg_id TEXT PRIMARY KEY, first_name TEXT, username TEXT, lang TEXT, phone TEXT, state TEXT, follows TEXT NOT NULL DEFAULT '[]', blocked INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, last_seen TEXT);
CREATE TABLE IF NOT EXISTS tg_sessions (token_hash TEXT PRIMARY KEY, tg_id TEXT NOT NULL, expires TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS mt_due ON maintenance(next_due);
`);
for (const [col, def] of [['equipment_id', 'INTEGER'], ['tg_id', 'TEXT']]) {
  if (!db.prepare('PRAGMA table_info(requests)').all().some((c) => c.name === col)) db.exec(`ALTER TABLE requests ADD COLUMN ${col} ${def}`);
}

// 4-bosqich: akademiya (urinishlar, muddatli sertifikat, rahbar havolasi, Telegram orqali o'qish)
db.exec(`
CREATE TABLE IF NOT EXISTS quiz_attempts (id INTEGER PRIMARY KEY, token TEXT UNIQUE NOT NULL, learner_id INTEGER NOT NULL REFERENCES learners(id) ON DELETE CASCADE, course_id INTEGER NOT NULL, items TEXT NOT NULL, started_at TEXT NOT NULL, finished_at TEXT);
CREATE TABLE IF NOT EXISTS learner_tokens (token_hash TEXT PRIMARY KEY, learner_id INTEGER NOT NULL REFERENCES learners(id) ON DELETE CASCADE, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS reviews (id INTEGER PRIMARY KEY, request_id INTEGER REFERENCES requests(id) ON DELETE SET NULL, tg_id TEXT, name TEXT, company TEXT, rating INTEGER NOT NULL, text TEXT, lang TEXT, published INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL);
`);
const addCol = (table, col, def) => { if (!db.prepare(`PRAGMA table_info(${table})`).all().some((c) => c.name === col)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${def}`); };
addCol('access_codes', 'manager_token', 'TEXT');
addCol('learners', 'tg_id', 'TEXT');
addCol('learners', 'last_seen', 'TEXT');
addCol('learners', 'reminded_at', 'TEXT');
addCol('quiz_results', 'valid_until', 'TEXT');
addCol('requests', 'review_asked', 'INTEGER NOT NULL DEFAULT 0');
// 12-bosqich: foydalanuvchi akkauntlari (login/parol), parolni tiklash, video qo'llanmalar
db.exec(`
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, login TEXT UNIQUE NOT NULL, name TEXT NOT NULL, company TEXT, pw_hash TEXT NOT NULL, tg_id TEXT, lang TEXT,
  blocked INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, last_login TEXT, login_count INTEGER NOT NULL DEFAULT 0, last_ip TEXT);
CREATE TABLE IF NOT EXISTS user_sessions (token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, created_at TEXT NOT NULL, expires TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS user_resets (user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, code_hash TEXT NOT NULL, expires TEXT NOT NULL, tries INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS user_tg_links (token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS user_events (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, at TEXT NOT NULL, kind TEXT NOT NULL, ref TEXT);
CREATE INDEX IF NOT EXISTS ue_user ON user_events(user_id, id);
CREATE TABLE IF NOT EXISTS videos (id INTEGER PRIMARY KEY, src TEXT NOT NULL, data TEXT NOT NULL, access TEXT NOT NULL DEFAULT 'users', published INTEGER NOT NULL DEFAULT 1, sort INTEGER NOT NULL DEFAULT 0, views INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS video_files (name TEXT PRIMARY KEY, original TEXT, size INTEGER NOT NULL DEFAULT 0, complete INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL);
`);
fs.mkdirSync(path.join(DATA_DIR, 'media/video'), { recursive: true });
addCol('learners', 'user_id', 'INTEGER');
addCol('requests', 'user_id', 'INTEGER');
for (const r of db.prepare('SELECT code FROM access_codes WHERE manager_token IS NULL').all()) {
  db.prepare('UPDATE access_codes SET manager_token = ? WHERE code = ?').run(crypto.randomBytes(18).toString('base64url'), r.code);
}

export const now = () => new Date().toISOString();
export const J = (s, d = null) => { try { return JSON.parse(s); } catch { return d; } };

export function getSetting(key, def = null) {
  const r = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
  return r ? r.value : def;
}
export function setSetting(key, value) {
  db.prepare('INSERT INTO settings(key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').run(key, String(value));
}

// Birinchi ishga tushishda namunaviy ma'lumotlarni qo'yish
export function seed() {
  if (getSetting('seeded') === '1') return;
  const insC = db.prepare('INSERT INTO courses(slug, level, equipment, hours, data, sort) VALUES (?, ?, ?, ?, ?, ?)');
  const insL = db.prepare('INSERT INTO lessons(course_id, sort, data) VALUES (?, ?, ?)');
  const insQ = db.prepare('INSERT INTO quiz(course_id, sort, data, answer) VALUES (?, ?, ?, ?)');
  for (const c of seedCourses) {
    const r = insC.run(c.slug, c.level, c.equipment, c.hours, JSON.stringify({ title: c.title, summary: c.summary, audience: c.audience }), c.sort);
    c.lessons.forEach((l, i) => insL.run(r.lastInsertRowid, i + 1, JSON.stringify({ title: l.title, body: l.body })));
    c.quiz.forEach((q, i) => insQ.run(r.lastInsertRowid, i + 1, JSON.stringify({ q: q.q, options: q.options }), q.answer));
  }
  const insP = db.prepare('INSERT INTO portfolio(slug, brand, model, year, cover, data, sample, sort, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  for (const p of seedPortfolio) {
    insP.run(p.slug, p.brand, p.model, p.year, p.cover, JSON.stringify({ industry: p.industry, title: p.title, problem: p.problem, solution: p.solution, result: p.result }), p.sample, p.sort, now());
  }
  db.prepare('INSERT OR IGNORE INTO access_codes(code, company, seats, created_at, manager_token) VALUES (?, ?, ?, ?, ?)').run('DEMO-2026', 'Demo', 50, now(), crypto.randomBytes(18).toString('base64url'));
  setSetting('seeded', '1');
}

// Xato kodlari alohida belgi bilan qo'yiladi (eski bazalarga ham qo'shiladi)
export const errSlug = (brand, code) => `${brand}-${code}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export function seedErrorCodes() {
  if (getSetting('seeded_errors') === '1') return;
  const ins = db.prepare('INSERT OR IGNORE INTO error_codes(slug, brand, code, controller, severity, data, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
  for (const e of seedErrors) ins.run(errSlug(e.brand, e.code), e.brand, e.code, e.controller || '', e.severity || 'normal', JSON.stringify({ title: e.title, causes: e.causes, checks: e.checks, note: e.note }), now());
  setSetting('seeded_errors', '1');
}

// Akademiya 2: yangi kurslar, dars tekshiruv savollari, kengaytirilgan test banki, kurslar ketma-ketligi
export function seedCourses2() {
  if (getSetting('seeded_courses2') === '1') return;
  db.exec('BEGIN');
  try {
    const insC = db.prepare('INSERT OR IGNORE INTO courses(slug, level, equipment, hours, data, sort) VALUES (?, ?, ?, ?, ?, ?)');
    const insL = db.prepare('INSERT INTO lessons(course_id, sort, data) VALUES (?, ?, ?)');
    const insQ = db.prepare('INSERT INTO quiz(course_id, sort, data, answer) VALUES (?, ?, ?, ?)');
    const qData = (q) => JSON.stringify({ q: q.q, options: q.options });
    for (const c of courses2) {
      const r = insC.run(c.slug, c.level, c.equipment, c.hours, JSON.stringify({ title: c.title, summary: c.summary, audience: c.audience, requires: c.requires || '', quiz_size: c.quiz_size || 8, time_limit: c.time_limit || 15, pass: c.pass || 80 }), c.sort ?? 50);
      if (!r.changes) continue;
      c.lessons.forEach((l, i) => insL.run(r.lastInsertRowid, i + 1, JSON.stringify({ title: l.title, body: l.body, check: l.check || null })));
      c.quiz.forEach((q, i) => insQ.run(r.lastInsertRowid, i + 1, qData(q), q.answer));
    }
    for (const [slug, list] of Object.entries(checks)) {
      const c = db.prepare('SELECT id FROM courses WHERE slug = ?').get(slug); if (!c) continue;
      const ls = db.prepare('SELECT id, data FROM lessons WHERE course_id = ? ORDER BY sort, id').all(c.id);
      ls.forEach((l, i) => { const d = J(l.data, {}); if (list[i] && !d.check) { d.check = list[i]; db.prepare('UPDATE lessons SET data = ? WHERE id = ?').run(JSON.stringify(d), l.id); } });
    }
    for (const [slug, list] of Object.entries(extraQuiz)) {
      const c = db.prepare('SELECT id FROM courses WHERE slug = ?').get(slug); if (!c) continue;
      const n = db.prepare('SELECT COUNT(*) n FROM quiz WHERE course_id = ?').get(c.id).n;
      list.forEach((q, i) => insQ.run(c.id, n + i + 1, qData(q), q.answer));
    }
    for (const r of db.prepare('SELECT id, slug, data FROM courses').all()) {
      const d = J(r.data, {});
      d.quiz_size ??= 8; d.time_limit ??= 15; d.pass ??= 80;
      if (!d.requires) d.requires = /abb|kuka|fanuc/.test(r.slug) && r.slug !== 'industrial-safety-loto' && db.prepare("SELECT 1 FROM courses WHERE slug = 'industrial-safety-loto'").get() ? 'industrial-safety-loto' : '';
      db.prepare('UPDATE courses SET data = ? WHERE id = ?').run(JSON.stringify(d), r.id);
    }
    db.exec('COMMIT');
  } catch (e) { db.exec('ROLLBACK'); throw e; }
  setSetting('seeded_courses2', '1');
}
