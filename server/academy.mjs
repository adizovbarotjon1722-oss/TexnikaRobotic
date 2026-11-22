// Akademiya: dars tekshiruv savollari, vaqtli test (tasodifiy savollar va javoblar tartibi, kunlik urinishlar),
// kurslar ketma-ketligi, muddatli sertifikat, rahbar uchun jamoa sahifasi, Telegram orqali o'qish va eslatmalar.
import crypto from 'crypto';
import { db, now, J } from './db.mjs';
import { rateLimit, randToken, randCode, sha256, clean } from './security.mjs';
import { sendText, sendTo } from './telegram.mjs';
import { md } from './md.mjs';
import { qrSvg } from './ops.mjs';
import { LANGS, fmt } from '../src/i18n.mjs';
import { esc, url as pageUrl, renderCert } from '../src/template.mjs';
import { renderTeam } from '../src/template3.mjs';

const ATTEMPTS_PER_DAY = 3;
const VALID_YEARS = 2;
const GRACE_SEC = 45;
const today = () => now().slice(0, 10);
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = crypto.randomInt(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const tr = (o, lang) => o?.[lang] || o?.uz || '';

export const courseMeta = (c) => ({ requires: c.data.requires || '', size: parseInt(c.data.quiz_size, 10) || 8, minutes: parseInt(c.data.time_limit, 10) || 15, pass: parseInt(c.data.pass, 10) || 80 });

export function createAcademy(ctx) {
  const { json, readJson, html, send, cfg, T, VER, courseBySlug, listCourses, lessonsOf, quizOf, miniAppButton } = ctx;

  /* ---- O'quvchi ---- */
  function learnerByToken(tok) {
    if (!/^[A-Za-z0-9_-]{20,}$/.test(tok || '')) return null;
    const h = sha256(tok);
    const L = db.prepare('SELECT * FROM learners WHERE token_hash = ?').get(h)
      || db.prepare('SELECT l.* FROM learner_tokens t JOIN learners l ON l.id = t.learner_id WHERE t.token_hash = ?').get(h);
    if (L) {
      db.prepare('UPDATE learners SET last_seen = ? WHERE id = ?').run(now(), L.id);
    }
    return L || null;
  }
  const learnerFrom = (req) => learnerByToken((String(req.headers.authorization || '').match(/^Bearer (\S+)$/) || [])[1]);
  function issueToken(learnerId) {
    const token = randToken(32);
    db.prepare('INSERT INTO learner_tokens(token_hash, learner_id, created_at) VALUES (?, ?, ?)').run(sha256(token), learnerId, now());
    db.prepare('DELETE FROM learner_tokens WHERE learner_id = ? AND token_hash NOT IN (SELECT token_hash FROM learner_tokens WHERE learner_id = ? ORDER BY created_at DESC LIMIT 5)').run(learnerId, learnerId);
    return token;
  }
  function checkCode(code) {
    const ac = db.prepare('SELECT * FROM access_codes WHERE code = ?').get(code);
    if (!ac || (ac.expires && ac.expires < today())) return null;
    if (db.prepare('SELECT COUNT(*) n FROM learners WHERE code = ?').get(code).n >= ac.seats) return null;
    return ac;
  }
  function createLearner(name, ac, tgId = null, userId = null) {
    const token = randToken(32);
    db.prepare('INSERT INTO learners(token_hash, name, code, company, created_at, tg_id, last_seen, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(sha256(token), name, ac.code, ac.company, now(), tgId, now(), userId);
    return token;
  }
  // Saytda o'qish akkaunt bilan bog'liq: natijalar har qanday qurilmada ko'rinadi
  const learnerOfUser = (u) => (u ? db.prepare('SELECT * FROM learners WHERE user_id = ? ORDER BY id LIMIT 1').get(u.id) || (u.tg_id ? db.prepare('SELECT * FROM learners WHERE tg_id = ? AND user_id IS NULL ORDER BY id LIMIT 1').get(u.tg_id) : null) : null);

  /* ---- Holat ---- */
  function certOf(lid, cid) {
    const r = db.prepare('SELECT score, cert_id, valid_until, at FROM quiz_results WHERE learner_id = ? AND course_id = ? AND passed = 1 ORDER BY at DESC LIMIT 1').get(lid, cid);
    if (!r) return null;
    return { score: r.score, cert_id: r.cert_id, valid_until: r.valid_until, expired: Boolean(r.valid_until && r.valid_until < today()) };
  }
  const passedValid = (lid, cid) => { const x = certOf(lid, cid); return Boolean(x && !x.expired); };
  function lockOf(L, c, lang) {
    const { requires } = courseMeta(c);
    if (!requires || requires === c.slug) return null;
    const rc = courseBySlug(requires);
    if (!rc || passedValid(L.id, rc.id)) return null;
    return { slug: rc.slug, title: tr(rc.data.title, lang) };
  }
  const attemptsLeft = (L, c) => Math.max(0, ATTEMPTS_PER_DAY - db.prepare('SELECT COUNT(*) n FROM quiz_attempts WHERE learner_id = ? AND course_id = ? AND started_at > ?').get(L.id, c.id, new Date(Date.now() - 864e5).toISOString()).n);
  function progressOf(lid, c) {
    const total = db.prepare('SELECT COUNT(*) n FROM lessons WHERE course_id = ?').get(c.id).n;
    const done = db.prepare('SELECT COUNT(*) n FROM progress p JOIN lessons l ON l.id = p.lesson_id WHERE p.learner_id = ? AND l.course_id = ?').get(lid, c.id).n;
    const cert = certOf(lid, c.id);
    return { total, done, cert, pct: Math.round(((done + (cert && !cert.expired ? 1 : 0)) / (total + 1)) * 100) };
  }
  function summary(L, lang) {
    return {
      name: L.name, company: L.company,
      courses: listCourses().map((c) => {
        const pr = progressOf(L.id, c); const lock = lockOf(L, c, lang);
        return { slug: c.slug, title: tr(c.data.title, lang), equipment: c.equipment, pct: pr.pct, done: pr.done, total: pr.total, passed: Boolean(pr.cert && !pr.cert.expired), cert_id: pr.cert?.cert_id || null, valid_until: pr.cert?.valid_until || null, expired: Boolean(pr.cert?.expired), locked: lock };
      })
    };
  }
  const langOf = (req) => { const l = new URL(req.url, 'http://x').searchParams.get('lang'); return LANGS.includes(l) ? l : 'uz'; };

  /* ---- API ---- */
  async function apiJoin(req, res, ip) {
    if (!rateLimit(`join:${ip}`, 10, 900e3)) return json(res, 429, { error: 'rate' });
    const u = ctx.accounts.userFrom(req);
    if (!u) return json(res, 401, { error: 'login' });
    const b = await readJson(req);
    const L = learnerOfUser(u);
    if (L) { if (!L.user_id) db.prepare('UPDATE learners SET user_id = ? WHERE id = ?').run(u.id, L.id); return json(res, 200, { token: issueToken(L.id), name: L.name }); }
    const ac = checkCode(clean(b.code, 24).toUpperCase());
    if (!ac) return json(res, 403, { error: 'bad_code' });
    ctx.accounts.event(u.id, 'academy_join', ac.code);
    return json(res, 201, { token: createLearner(u.name, ac, null, u.id), name: u.name });
  }
  // Kirgan foydalanuvchi uchun o'qish kaliti (kod bir marta kiritiladi)
  function apiSession(req, res) {
    const u = ctx.accounts.userFrom(req);
    if (!u) return json(res, 401, { error: 'login' });
    const L = learnerOfUser(u);
    if (!L) return json(res, 200, { need_code: true, name: u.name });
    if (!L.user_id) db.prepare('UPDATE learners SET user_id = ? WHERE id = ?').run(u.id, L.id);
    return json(res, 200, { token: issueToken(L.id), name: L.name });
  }
  function apiCourse(req, res, slug) {
    const L = learnerFrom(req); if (!L) return json(res, 401, { error: 'auth' });
    const c = courseBySlug(slug); if (!c) return json(res, 404, { error: 'not_found' });
    const lang = langOf(req);
    const lock = lockOf(L, c, lang);
    if (lock) return json(res, 403, { error: 'locked', requires: lock, name: L.name });
    const meta = courseMeta(c);
    const lessons = lessonsOf(c.id).map((l) => ({ id: l.id, title: tr(l.title, lang), html: md(tr(l.body, lang)), video: ctx.media.view(l.video), check: l.check?.q ? { q: tr(l.check.q, lang), options: l.check.options?.[lang] || l.check.options?.uz || [] } : null }));
    const done = db.prepare('SELECT lesson_id FROM progress WHERE learner_id = ?').all(L.id).map((r) => r.lesson_id).filter((id) => lessons.some((l) => l.id === id));
    const pool = db.prepare('SELECT COUNT(*) n FROM quiz WHERE course_id = ?').get(c.id).n;
    return json(res, 200, { name: L.name, lessons, done, best: certOf(L.id, c.id), quiz: { size: Math.min(meta.size, pool), minutes: meta.minutes, pass: meta.pass, left: attemptsLeft(L, c) } });
  }
  async function apiDone(req, res, slug) {
    const L = learnerFrom(req); if (!L) return json(res, 401, { error: 'auth' });
    const c = courseBySlug(slug); if (!c) return json(res, 404, { error: 'not_found' });
    if (lockOf(L, c, 'uz')) return json(res, 403, { error: 'locked' });
    if (!rateLimit(`done:${L.id}`, 120, 3600e3)) return json(res, 429, { error: 'rate' });
    const b = await readJson(req);
    const l = lessonsOf(c.id).find((x) => x.id === (parseInt(b.lesson, 10) || 0));
    if (!l) return json(res, 400, { error: 'lesson' });
    if (l.check?.q && parseInt(b.answer, 10) !== l.check.answer) return json(res, 400, { error: 'wrong' });
    const ins = db.prepare('INSERT OR IGNORE INTO progress(learner_id, lesson_id, done_at) VALUES (?, ?, ?)').run(L.id, l.id, now());
    if (ins.changes && L.user_id) ctx.accounts.event(L.user_id, 'lesson', `${c.slug}#${l.id}`);
    return json(res, 200, { ok: true });
  }
  function attemptView(a, lang, meta) {
    const byId = new Map(quizOf(a.course_id).map((q) => [q.id, q]));
    const deadline = new Date(Date.parse(a.started_at) + meta.minutes * 60e3).toISOString();
    const questions = J(a.items, []).map((it, k) => { const q = byId.get(it.id); const opts = q?.options?.[lang] || q?.options?.uz || []; return { n: k + 1, q: tr(q?.q, lang), options: it.perm.map((i) => opts[i] ?? '') }; });
    return { attempt: a.token, deadline, seconds: Math.max(0, Math.round((Date.parse(deadline) - Date.now()) / 1000)), minutes: meta.minutes, pass: meta.pass, questions };
  }
  async function apiQuizStart(req, res, slug) {
    const L = learnerFrom(req); if (!L) return json(res, 401, { error: 'auth' });
    const c = courseBySlug(slug); if (!c) return json(res, 404, { error: 'not_found' });
    const lang = langOf(req); const meta = courseMeta(c);
    if (lockOf(L, c, lang)) return json(res, 403, { error: 'locked' });
    const lessons = lessonsOf(c.id);
    const done = new Set(db.prepare('SELECT lesson_id FROM progress WHERE learner_id = ?').all(L.id).map((r) => r.lesson_id));
    if (lessons.some((l) => !done.has(l.id))) return json(res, 400, { error: 'lessons' });
    // Tugallanmagan va vaqti tugamagan urinish bo'lsa, o'sha qaytariladi (sahifa yangilansa ham savollar o'zgarmaydi)
    const open = db.prepare('SELECT * FROM quiz_attempts WHERE learner_id = ? AND course_id = ? AND finished_at IS NULL AND started_at > ? ORDER BY id DESC LIMIT 1').get(L.id, c.id, new Date(Date.now() - meta.minutes * 60e3).toISOString());
    if (open) return json(res, 200, { ...attemptView(open, lang, meta), left: attemptsLeft(L, c) });
    if (attemptsLeft(L, c) <= 0) return json(res, 429, { error: 'attempts' });
    const pool = quizOf(c.id);
    if (!pool.length) return json(res, 400, { error: 'empty' });
    const items = shuffle(pool.slice()).slice(0, Math.min(meta.size, pool.length)).map((q) => ({ id: q.id, perm: shuffle([...Array((q.options?.uz || q.options?.[lang] || []).length).keys()]) }));
    const token = randToken(18);
    db.prepare('INSERT INTO quiz_attempts(token, learner_id, course_id, items, started_at) VALUES (?, ?, ?, ?, ?)').run(token, L.id, c.id, JSON.stringify(items), now());
    const a = db.prepare('SELECT * FROM quiz_attempts WHERE token = ?').get(token);
    return json(res, 201, { ...attemptView(a, lang, meta), left: attemptsLeft(L, c) });
  }
  async function apiQuiz(req, res, slug) {
    const L = learnerFrom(req); if (!L) return json(res, 401, { error: 'auth' });
    const c = courseBySlug(slug); if (!c) return json(res, 404, { error: 'not_found' });
    const b = await readJson(req);
    const a = db.prepare('SELECT * FROM quiz_attempts WHERE token = ? AND learner_id = ? AND course_id = ? AND finished_at IS NULL').get(String(b.attempt || ''), L.id, c.id);
    if (!a) return json(res, 400, { error: 'attempt' });
    const meta = courseMeta(c);
    const late = Date.now() - Date.parse(a.started_at) > (meta.minutes * 60 + GRACE_SEC) * 1000;
    const ans = b.answers && typeof b.answers === 'object' ? b.answers : {};
    const byId = new Map(quizOf(c.id).map((q) => [q.id, q]));
    const items = J(a.items, []).map((it, k) => ({ ...it, n: k + 1, q: byId.get(it.id) })).filter((it) => it.q);
    const wrong = [];
    let ok = 0;
    for (const it of items) {
      const shown = parseInt(ans[it.n], 10);
      if (!late && shown >= 0 && it.perm[shown] === it.q.answer) ok++; else wrong.push(it.n);
    }
    const score = items.length ? Math.round((ok / items.length) * 100) : 0;
    const passed = score >= meta.pass;
    const certId = passed ? randCode('CRT', 2, 4) : null;
    const d = new Date(); d.setFullYear(d.getFullYear() + VALID_YEARS);
    const validUntil = passed ? d.toISOString().slice(0, 10) : null;
    db.prepare('UPDATE quiz_attempts SET finished_at = ? WHERE id = ?').run(now(), a.id);
    db.prepare('INSERT INTO quiz_results(learner_id, course_id, score, passed, cert_id, at, valid_until) VALUES (?, ?, ?, ?, ?, ?, ?)').run(L.id, c.id, score, passed ? 1 : 0, certId, now(), validUntil);
    if (L.user_id) ctx.accounts.event(L.user_id, passed ? 'quiz_pass' : 'quiz_fail', `${c.slug} ${score}%`);
    if (passed) sendText(`🎓 <b>${esc(L.name)}</b> (${esc(L.company || '')}) «${esc(c.data.title?.uz || c.slug)}» kursini ${score}% bilan topshirdi.`).catch(() => {});
    return json(res, 200, { score, passed, cert_id: certId, valid_until: validUntil, wrong, late, pass: meta.pass, left: attemptsLeft(L, c) });
  }
  function apiMe(req, res) {
    const L = learnerFrom(req); if (!L) return json(res, 401, { error: 'auth' });
    return json(res, 200, summary(L, langOf(req)));
  }

  function api(req, res, ip, p, method) {
    let m;
    if (p === '/api/academy/join' && method === 'POST') return apiJoin(req, res, ip);
    if (p === '/api/academy/me' && method === 'GET') return apiMe(req, res);
    if (p === '/api/academy/session' && method === 'GET') return apiSession(req, res);
    if ((m = p.match(/^\/api\/academy\/([a-z0-9-]{1,80})$/)) && method === 'GET') return apiCourse(req, res, m[1]);
    if ((m = p.match(/^\/api\/academy\/([a-z0-9-]{1,80})\/done$/)) && method === 'POST') return apiDone(req, res, m[1]);
    if ((m = p.match(/^\/api\/academy\/([a-z0-9-]{1,80})\/quiz\/start$/)) && method === 'POST') return apiQuizStart(req, res, m[1]);
    if ((m = p.match(/^\/api\/academy\/([a-z0-9-]{1,80})\/quiz$/)) && method === 'POST') return apiQuiz(req, res, m[1]);
    return null;
  }

  /* ---- Telegram Mini App ---- */
  function tgStatus(tgId, lang) {
    const L = db.prepare('SELECT * FROM learners WHERE tg_id = ? ORDER BY id DESC LIMIT 1').get(String(tgId));
    if (!L) return { joined: false };
    db.prepare('UPDATE learners SET last_seen = ? WHERE id = ?').run(now(), L.id);
    return { joined: true, ...summary(L, lang) };
  }
  // Allaqachon ulangan bo'lsa kodsiz yangi kalit beriladi, aks holda ism va kirish kodi kerak
  function tgJoin(tgId, { name, code } = {}) {
    const L = db.prepare('SELECT * FROM learners WHERE tg_id = ? ORDER BY id DESC LIMIT 1').get(String(tgId));
    if (L) return { token: issueToken(L.id), name: L.name };
    name = clean(name, 80); code = clean(code, 24).toUpperCase();
    if (name.length < 3) return { error: 'name' };
    const ac = checkCode(code);
    if (!ac) return { error: 'bad_code' };
    return { token: createLearner(name, ac, String(tgId)), name };
  }

  /* ---- Sahifalar: sertifikat (QR va muddat) va rahbar sahifasi ---- */
  function page(req, res, lang, p, t, c) {
    let m;
    if ((m = p.match(/^\/academy\/cert\/([A-Z0-9-]{6,20})\/$/))) {
      const r = db.prepare('SELECT qr.*, l.name, l.company, c.data cdata FROM quiz_results qr JOIN learners l ON l.id = qr.learner_id JOIN courses c ON c.id = qr.course_id WHERE qr.cert_id = ? AND qr.passed = 1').get(m[1]);
      const verifyUrl = r ? `${c.domain}${pageUrl(lang, `academy/cert/${r.cert_id}/`)}` : '';
      const cert = r ? { id: r.cert_id, name: r.name, company: r.company, course: tr(J(r.cdata, {}).title, lang), score: r.score, date: r.at.slice(0, 10), validUntil: r.valid_until, expired: Boolean(r.valid_until && r.valid_until < today()), verifyUrl, qr: qrSvg(verifyUrl) } : null;
      html(res, renderCert(lang, t, c, cert, VER), cert ? 200 : 404);
      return true;
    }
    if ((m = p.match(/^\/academy\/team\/([A-Za-z0-9_-]{20,40})\/$/))) {
      const ac = db.prepare('SELECT * FROM access_codes WHERE manager_token = ?').get(m[1]);
      if (!ac) return false;
      const courses = listCourses();
      const rows = db.prepare('SELECT * FROM learners WHERE code = ? ORDER BY name').all(ac.code).map((L) => ({ name: L.name, last: (L.last_seen || L.created_at || '').slice(0, 10), cells: courses.map((x) => progressOf(L.id, x)) }));
      if (new URL(req.url, 'http://x').searchParams.get('csv') === '1') {
        const q = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
        const head = [t.academy2.employee, ...courses.map((x) => tr(x.data.title, lang)), t.academy2.lastActive].map(q).join(';');
        const body = rows.map((r) => [r.name, ...r.cells.map((x) => (x.cert && !x.cert.expired ? `${x.cert.score}% ${x.cert.cert_id} (${x.cert.valid_until || ''})` : `${x.pct}%`)), r.last].map(q).join(';'));
        send(res, 200, '﻿' + [head, ...body].join('\r\n'), 'text/csv; charset=utf-8', { 'Content-Disposition': `attachment; filename="team-${ac.code}.csv"`, 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' });
        return true;
      }
      html(res, renderTeam(lang, t, c, { company: ac.company, code: ac.code, seats: ac.seats, courses, rows, csvHref: `?csv=1` }, VER));
      return true;
    }
    return false;
  }

  /* ---- Eslatmalar: 3 kun faol bo'lmagan va Telegram bilan bog'langan o'quvchilarga, ko'pi bilan 7 kunda bir marta ---- */
  async function remindTick() {
    const cut3 = new Date(Date.now() - 3 * 864e5).toISOString();
    const cut7 = new Date(Date.now() - 7 * 864e5).toISOString();
    const list = db.prepare('SELECT * FROM learners WHERE tg_id IS NOT NULL AND COALESCE(last_seen, created_at) < ? AND (reminded_at IS NULL OR reminded_at < ?) LIMIT 100').all(cut3, cut7);
    let n = 0;
    for (const L of list) {
      const u = db.prepare('SELECT lang, blocked FROM tg_users WHERE tg_id = ?').get(L.tg_id);
      if (u?.blocked) continue;
      const lang = LANGS.includes(u?.lang) ? u.lang : 'uz';
      const open = listCourses().map((c) => ({ c, pr: progressOf(L.id, c) })).find((x) => x.pr.done > 0 && !(x.pr.cert && !x.pr.cert.expired));
      db.prepare('UPDATE learners SET reminded_at = ? WHERE id = ?').run(now(), L.id);
      if (!open) continue;
      const tt = T(lang);
      const ok = await sendTo(L.tg_id, esc(fmt(tt.academy2.reminder, { course: tr(open.c.data.title, lang), pct: open.pr.pct })), miniAppButton(tt.academy2.continue, '#academy')).catch(() => false);
      if (ok) n++;
    }
    return n;
  }
  function startReminders() {
    const run = () => remindTick().catch((e) => console.error('Akademiya eslatmasi:', e.message));
    setTimeout(run, 60e3).unref();
    setInterval(run, 6 * 3600e3).unref();
  }

  const summaryForUser = (u, lang) => { const L = learnerOfUser(u); return L ? summary(L, lang) : null; };
  return { api, page, tgStatus, tgJoin, remindTick, startReminders, learnerByToken, summary, summaryForUser };
}
