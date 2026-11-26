// Texnika Servis serveri: sahifalar (SSR, 3 til), API, admin panel.
// Tashqi freymvork yo'q: node:http + node:sqlite. Ishga tushirish: npm start
import http from 'http';
import fs from 'fs';
import zlib from 'zlib';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { db, DATA_DIR, now, J, getSetting, setSetting, seed, seedErrorCodes, seedCourses2 } from './db.mjs';
import { SEC_HEADERS, rateLimit, randCode, randToken, sha256, verifyPassword, hashPassword, ensureAdminPassword, createSession, getSession, destroySession, destroyAllSessions, parseCookies, decodeImage, clean } from './security.mjs';
import { diagnose, aiEnabled, aiInfo } from './ai.mjs';
import { notifyRequest, sendText, sendTo, tgEnabled, setWebhook, botInfo, api as tgApi } from './telegram.mjs';
import { createOps, topErrors } from './ops.mjs';
import { createTgApp } from './tgapp.mjs';
import { createAcademy } from './academy.mjs';
import { createReviews } from './reviews.mjs';
import { createWarranty } from './warranty.mjs';
import { createAccounts } from './accounts.mjs';
import { createMedia } from './media.mjs';
import { renderAccount, renderVideos } from '../src/template6.mjs';
import { renderPlc, renderWarranty } from '../src/template4.mjs';
import { renderMonitoring } from '../src/template7.mjs';
import { renderTeam, renderService } from '../src/template8.mjs';
import { renderLpHub, renderLpService, renderLpCity, LP_SLUGS, LP_CITIES } from '../src/template9.mjs';
import { createTeam, listTeam, feedbackSummary, listFeedbackPublic } from './team.mjs';
import { renderSupport } from '../src/template5.mjs';
import { track, stats } from './analytics.mjs';
import { texts, flatten, baseTexts, LANGS } from '../src/i18n.mjs';
import { renderHome, renderPortfolioList, renderPortfolioItem, renderTrack, renderAcademyList, renderAcademyCourse, render404, url as pageUrl, esc } from '../src/template.mjs';
import { md } from './md.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = parseInt(process.env.PORT || '8080', 10);
const TRUST_PROXY = process.env.TRUST_PROXY === '1';
const PROD = process.env.NODE_ENV === 'production';
const STATUSES = ['new', 'diagnosing', 'scheduled', 'in_progress', 'waiting_parts', 'done', 'cancelled'];
const PRIORITIES = ['critical', 'high', 'normal', 'low'];

seed();
seedErrorCodes();
seedCourses2();
const firstPw = ensureAdminPassword();
if (firstPw) console.log(`\n  ADMIN PAROL (bir marta ko'rsatiladi, saqlab qo'ying): ${firstPw}\n  Kirish: /admin\n`);

/* ---------- Sozlamalar va matnlar ---------- */
const fileCfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));
const SETTING_KEYS = ['brand', 'engineerName', 'phone', 'whatsapp', 'telegram', 'email', 'city_uz', 'city_ru', 'city_en', 'responseHours', 'domain',
  'company_legal', 'company_address', 'company_inn', 'company_bank', 'company_account', 'company_mfo', 'googleVerify', 'yandexVerify', 'admin_tg_ids', 'warrantyMonths', 'partsMonths', 'phoneMode'];
const EXTRA_KEYS = SETTING_KEYS.slice(11);
const HOME_SECTIONS = ['directions', 'monitoring', 'training', 'team', 'trust'];
let BOT_USERNAME = '';
let heroOf = () => '';
function cfg() {
  const s = Object.fromEntries(db.prepare(`SELECT key, value FROM settings WHERE key IN (${SETTING_KEYS.map(() => '?').join(',')})`).all(...SETTING_KEYS).map((r) => [r.key, r.value]));
  const c = { ...fileCfg, city: { ...fileCfg.city } };
  for (const k of ['brand', 'engineerName', 'phone', 'whatsapp', 'telegram', 'email', 'responseHours']) if (s[k]) c[k] = s[k];
  for (const l of LANGS) if (s[`city_${l}`]) c.city[l] = s[`city_${l}`];
  c.domain = (process.env.PUBLIC_URL || s.domain || fileCfg.domain).replace(/\/+$/, '');
  for (const k of EXTRA_KEYS) c[k] = s[k] || '';
  c.hiddenSections = J(getSetting('hidden_sections', '[]'), []);
  c.googleVerify ||= process.env.GOOGLE_SITE_VERIFICATION || '';
  c.yandexVerify ||= process.env.YANDEX_VERIFICATION || '';
  // Search Console "HTML fayl" usuli: google1234abcd.html yoki yandex_1234abcd.html nomi berilsa, shu fayl beriladi
  c.googleFile = /^google[0-9a-f]+\.html$/i.test(c.googleVerify) ? c.googleVerify : '';
  c.yandexFile = /^yandex_[0-9a-f]+\.html$/i.test(c.yandexVerify) ? c.yandexVerify : '';
  if (c.googleFile) c.googleVerify = '';
  if (c.yandexFile) c.yandexVerify = '';
  c.warrantyMonths = parseInt(c.warrantyMonths, 10) || fileCfg.warrantyMonths || 3;
  c.partsMonths = parseInt(c.partsMonths, 10) || fileCfg.partsMonths || 12;
  c.phoneOpen = c.phoneMode !== 'lock';
  c.botUsername = BOT_USERNAME;
  // Admin yuklagan bosh sahifa videosi (bo'lmasa standart video)
  const hv = heroOf();
  c.hero = { src: hv ? `/media/hero/${hv}` : '', type: hv.endsWith('.webm') ? 'video/webm' : 'video/mp4', pos: getSetting('hero_pos', '') || 'top' };
  return c;
}
let overridesCache = null;
function overrides(lang) {
  if (!overridesCache) {
    overridesCache = { uz: {}, ru: {}, en: {} };
    for (const r of db.prepare('SELECT lang, key, value FROM text_overrides').all()) if (overridesCache[r.lang]) overridesCache[r.lang][r.key] = r.value;
  }
  return overridesCache[lang];
}
const T = (lang) => texts(lang, cfg(), overrides(lang));

/* ---------- Statik fayllar (xotirada) ---------- */
const MIME = { '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8' };
const assets = new Map();
function loadAssets() {
  const css = fs.readFileSync(path.join(ROOT, 'src/fonts/fonts.css'), 'utf8').replaceAll('../fonts/', '/assets/fonts/') + '\n' + fs.readFileSync(path.join(ROOT, 'src/style.css'), 'utf8');
  assets.set('/assets/css/style.css', { body: Buffer.from(css), type: MIME['.css'] });
  assets.set('/assets/js/app.js', { body: fs.readFileSync(path.join(ROOT, 'src/app.js')), type: MIME['.js'] });
  assets.set('/assets/css/admin.css', { body: fs.readFileSync(path.join(ROOT, 'src/admin.css')), type: MIME['.css'] });
  assets.set('/assets/js/admin.js', { body: fs.readFileSync(path.join(ROOT, 'src/admin.js')), type: MIME['.js'] });
  assets.set('/assets/js/tg.js', { body: fs.readFileSync(path.join(ROOT, 'src/tg.js')), type: MIME['.js'] });
  assets.set('/assets/css/tg.css', { body: fs.readFileSync(path.join(ROOT, 'src/tg.css')), type: MIME['.css'] });
  assets.set('/assets/js/print.js', { body: Buffer.from("document.addEventListener('click',(e)=>{if(e.target.closest('[data-print]'))window.print();});\n"), type: MIME['.js'] });
  for (const f of fs.readdirSync(path.join(ROOT, 'src/fonts')).filter((f) => f.endsWith('.woff2'))) assets.set(`/assets/fonts/${f}`, { body: fs.readFileSync(path.join(ROOT, 'src/fonts', f)), type: MIME['.woff2'], immutable: true });
  const walk = (dir, base) => { for (const f of fs.readdirSync(dir)) { const p = path.join(dir, f); if (fs.statSync(p).isDirectory()) walk(p, `${base}${f}/`); else assets.set(`${base}${f}`, { body: fs.readFileSync(p), type: MIME[path.extname(f)] || 'application/octet-stream' }); } };
  walk(path.join(ROOT, 'public'), '/');
  const h = crypto.createHash('sha256');
  for (const k of ['/assets/css/style.css', '/assets/js/app.js', '/assets/css/admin.css', '/assets/js/admin.js', '/assets/js/tg.js', '/assets/css/tg.css']) h.update(assets.get(k).body);
  return h.digest('hex').slice(0, 10);
}
const VER = loadAssets();

/* ---------- Javob yordamchilari ---------- */
// Matnli javoblar brotli yoki gzip bilan siqiladi (uzoqdagi mijozlar uchun sahifa tezroq ochiladi)
const ZCACHE = new WeakMap();
function compress(req, body, type) {
  if (!req || !body || body.length < 1024 || !/^(text\/|application\/(json|javascript|manifest|xml)|image\/svg)/.test(type)) return null;
  const ae = String(req.headers['accept-encoding'] || '');
  const enc = /\bbr\b/.test(ae) ? 'br' : /\bgzip\b/.test(ae) ? 'gzip' : null;
  if (!enc) return null;
  const cached = Buffer.isBuffer(body) ? ZCACHE.get(body)?.[enc] : null;
  if (cached) return { enc, out: cached };
  const out = enc === 'br' ? zlib.brotliCompressSync(body, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } }) : zlib.gzipSync(body, { level: 6 });
  if (Buffer.isBuffer(body)) ZCACHE.set(body, { ...(ZCACHE.get(body) || {}), [enc]: out });
  return { enc, out };
}
function send(res, status, body, type = 'text/html; charset=utf-8', extra = {}) {
  const h = { ...SEC_HEADERS, 'Content-Type': type, ...extra };
  for (const k of Object.keys(h)) if (h[k] === null) delete h[k];
  const z = compress(res.req, body, type);
  if (z) { h['Content-Encoding'] = z.enc; h.Vary = 'Accept-Encoding'; body = z.out; }
  res.writeHead(status, h);
  res.end(body);
}
// Ommaviy sahifalar Telegram Web ichida (Mini App dan o'tilganda) ham ochilishi uchun; admin esa hech qayerga joylanmaydi
const PUB_FRAME = { 'Content-Security-Policy': SEC_HEADERS['Content-Security-Policy'].replace("frame-ancestors 'none'", "frame-ancestors 'self' https://web.telegram.org"), 'X-Frame-Options': null };
const json = (res, status, obj, extra = {}) => send(res, status, JSON.stringify(obj), 'application/json; charset=utf-8', { 'Cache-Control': 'no-store', ...extra });
const html = (res, body, status = 200) => send(res, status, body, 'text/html; charset=utf-8', { 'Cache-Control': 'no-cache', ...PUB_FRAME });

function clientIp(req) {
  if (TRUST_PROXY) { const f = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim(); if (f) return f; }
  return req.socket.remoteAddress || '';
}
const isSecure = (req) => req.socket.encrypted || (TRUST_PROXY && req.headers['x-forwarded-proto'] === 'https');

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', (c) => { size += c.length; if (size > limit) { reject(Object.assign(new Error('too_large'), { status: 413 })); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}
async function readJson(req, limit = 64 * 1024) {
  if (!String(req.headers['content-type'] || '').startsWith('application/json')) throw Object.assign(new Error('bad_type'), { status: 415 });
  const b = await readBody(req, limit);
  try { return JSON.parse(b.toString('utf8') || '{}'); } catch { throw Object.assign(new Error('bad_json'), { status: 400 }); }
}
// Boshqa saytdan yuborilgan POST so'rovlarni rad etish
function sameOrigin(req) {
  const o = req.headers.origin;
  if (!o) return true;
  try { return new URL(o).host === req.headers.host; } catch { return false; }
}

/* ---------- Ma'lumot yuklash ---------- */
const rowPortfolio = (r) => ({ ...r, images: J(r.images, []), data: J(r.data, {}) });
const listPortfolio = (all = false) => db.prepare(`SELECT * FROM portfolio ${all ? '' : 'WHERE published = 1'} ORDER BY sort, id DESC`).all().map(rowPortfolio);
const rowCourse = (r) => ({ ...r, data: J(r.data, {}) });
function listCourses(all = false) {
  return db.prepare(`SELECT c.*, (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id) lessonCount FROM courses c ${all ? '' : 'WHERE published = 1'} ORDER BY sort, id`).all().map(rowCourse);
}
const courseBySlug = (slug) => { const r = db.prepare('SELECT * FROM courses WHERE slug = ? AND published = 1').get(slug); return r ? rowCourse(r) : null; };
const lessonsOf = (cid) => db.prepare('SELECT * FROM lessons WHERE course_id = ? ORDER BY sort, id').all(cid).map((l) => ({ id: l.id, sort: l.sort, ...J(l.data, {}) }));
const quizOf = (cid) => db.prepare('SELECT * FROM quiz WHERE course_id = ? ORDER BY sort, id').all(cid).map((q) => ({ id: q.id, sort: q.sort, answer: q.answer, ...J(q.data, {}) }));

/* ---------- Ommaviy sahifalar ---------- */
function routePage(req, res, p) {
  let lang = 'uz';
  const m = p.match(/^\/(ru|en)(\/.*)?$/);
  if (m) { lang = m[1]; p = m[2] || '/'; }
  if (!p.endsWith('/')) { res.writeHead(301, { ...SEC_HEADERS, Location: `${m ? `/${lang}` : ''}${p}/` }); return res.end(); }
  const t = T(lang); const c = cfg();
  let mm;
  if (p === '/') return html(res, renderHome(lang, t, c, { portfolio: listPortfolio(), courses: listCourses(), errors: topErrors(10), reviews: reviews.listPublic(3), reviewSummary: reviews.summary(), team: listTeam(), feedback: feedbackSummary(), feedbackPublic: listFeedbackPublic(3) }, VER));
  if (ops.page(req, res, lang, p, t, c)) return;
  if (p === '/monitoring/') return html(res, renderMonitoring(lang, t, c, VER));
  if (p === '/robots/') return html(res, renderService(lang, t, c, 'robots', VER));
  if (p === '/documents/') return html(res, renderService(lang, t, c, 'docs', VER));
  if (p === '/team/') return html(res, renderTeam(lang, t, c, listTeam(), listPortfolio().filter((x) => !x.sample), VER));
  if (p === '/plc/') return html(res, renderPlc(lang, t, c, { cases: listPortfolio().filter((x) => x.cover === 'plc' || /plc|s7-|simatic|mitsubishi|omron|allen|modicon/i.test(`${x.brand} ${x.model}`)) }, VER));
  if (p.startsWith('/services/')) {
    const lpData = () => ({ rs: reviews.summary(), fb: feedbackSummary(), quotes: [...reviews.listPublic(3), ...listFeedbackPublic(3)].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))).slice(0, 3) });
    let out = null;
    if (p === '/services/') out = renderLpHub(lang, t, c, lpData(), VER);
    else if ((mm = p.match(/^\/services\/city\/([a-z]{2,20})\/$/))) out = renderLpCity(lang, t, c, mm[1], lpData(), VER);
    else if ((mm = p.match(/^\/services\/([a-z0-9-]{2,60})\/$/))) out = renderLpService(lang, t, c, mm[1], lpData(), VER);
    if (out) return html(res, out);
  }
  if (p === '/warranty/') return html(res, renderWarranty(lang, t, c, VER));
  if (p === '/support/') return html(res, renderSupport(lang, t, c, VER));
  if (p === '/portfolio/') return html(res, renderPortfolioList(lang, t, c, listPortfolio(), VER));
  if ((mm = p.match(/^\/portfolio\/([a-z0-9-]{1,80})\/$/))) {
    const r = db.prepare('SELECT * FROM portfolio WHERE slug = ? AND published = 1').get(mm[1]);
    if (r) return html(res, renderPortfolioItem(lang, t, c, rowPortfolio(r), VER));
  }
  if (p === '/track/') return html(res, renderTrack(lang, t, c, VER));
  if (p === '/academy/') return html(res, renderAcademyList(lang, t, c, listCourses(), VER));
  if (p === '/account/') {
    const u = accounts.userFrom(req);
    return html(res, renderAccount(lang, t, c, u ? { user: accounts.pub(u), requests: accounts.myRequests(u.id), academy: academy.summaryForUser(u, lang), videos: media.forPage(lang, u).length, tgReady: tgEnabled() && Boolean(BOT_USERNAME) } : null, VER));
  }
  if (p === '/videos/') return html(res, renderVideos(lang, t, c, media.forPage(lang, accounts.userFrom(req)), Boolean(accounts.userFrom(req)), VER));
  if (academy.page(req, res, lang, p, t, c)) return;
  if ((mm = p.match(/^\/academy\/([a-z0-9-]{1,80})\/$/))) {
    const course = courseBySlug(mm[1]);
    if (course) return html(res, renderAcademyCourse(lang, t, c, course, lessonsOf(course.id), VER));
  }
  return html(res, render404(lang, t, c, VER), 404);
}

function sitemap(res) {
  const c = cfg();
  const subs = ['', 'services/', ...LP_SLUGS.map((x) => `services/${x}/`), ...LP_CITIES.map((x) => `services/city/${x}/`), 'academy/', 'monitoring/', 'robots/', 'documents/', 'team/', 'plc/', 'warranty/', 'support/', 'portfolio/', 'videos/', 'track/', ...ops.sitemapPaths(), ...listPortfolio().filter((p) => !p.sample).map((p) => `portfolio/${p.slug}/`), ...listCourses().map((x) => `academy/${x.slug}/`)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${subs.flatMap((s) => LANGS.map((l) => `  <url><loc>${esc(c.domain + pageUrl(l, s))}</loc><lastmod>${now().slice(0, 10)}</lastmod>${LANGS.map((a) => `<xhtml:link rel="alternate" hreflang="${a}" href="${esc(c.domain + pageUrl(a, s))}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${esc(c.domain + pageUrl('uz', s))}"/></url>`)).join('\n')}\n</urlset>\n`;
  send(res, 200, xml, MIME['.xml'], { 'Cache-Control': 'public, max-age=3600' });
}
function verifyFile(p) {
  const c = cfg();
  if (c.googleFile && p === '/' + c.googleFile) return `google-site-verification: ${c.googleFile}`;
  if (c.yandexFile && p === '/' + c.yandexFile) return `<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head><body>Verification: ${c.yandexFile.slice(7, -5)}</body></html>`;
  return '';
}

function robots(res) {
  const c = cfg();
  send(res, 200, `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nDisallow: /academy/cert/\nDisallow: /e/\nDisallow: /doc/\nDisallow: /tg/\nDisallow: /account/\nDisallow: /media/v/\n\nSitemap: ${c.domain}/sitemap.xml\n`, MIME['.txt'], { 'Cache-Control': 'public, max-age=3600' });
}
function securityTxt(res) {
  const c = cfg();
  const exp = new Date(Date.now() + 180 * 864e5).toISOString().replace(/\.\d+Z$/, 'Z');
  send(res, 200, `Contact: mailto:${c.email}\nExpires: ${exp}\nPreferred-Languages: uz, ru, en\nCanonical: ${c.domain}/.well-known/security.txt\n`, MIME['.txt']);
}

/* ---------- Ommaviy API ---------- */
const diagCache = new Map(); // diag_id -> { at, result }
setInterval(() => { const t = Date.now(); for (const [k, v] of diagCache) if (t - v.at > 3600e3) diagCache.delete(k); }, 300e3).unref();

function parseImages(arr) {
  if (!Array.isArray(arr)) return [];
  if (arr.length > 4) throw Object.assign(new Error('too_many_images'), { status: 400, code: 'bad_image' });
  return arr.map((s) => { const im = decodeImage(s); if (!im) throw Object.assign(new Error('bad_image'), { status: 400, code: 'bad_image' }); return im; });
}

async function apiDiagnose(req, res, ip) {
  if (!rateLimit(`ai:${ip}`, 6, 3600e3) || !rateLimit('ai:global', 300, 3600e3)) return json(res, 429, { error: 'rate' });
  const b = await readJson(req, 14 * 1024 * 1024);
  const lang = LANGS.includes(b.lang) ? b.lang : 'uz';
  const message = clean(b.message, 2000);
  if (message.length < 10) return json(res, 400, { error: 'message' });
  const images = parseImages(b.images);
  if (!aiEnabled()) return json(res, 503, { error: 'ai_off' });
  try {
    const result = await diagnose({ lang, equipment: clean(b.equipment, 120), message, images });
    const id = randToken(18);
    diagCache.set(id, { at: Date.now(), result });
    return json(res, 200, { diag_id: id, ...result, model: undefined });
  } catch (e) {
    console.error('AI xato:', e.code || '', e.message);
    return json(res, e.code === 'ai_off' ? 503 : 502, { error: e.code === 'ai_off' ? 'ai_off' : 'ai_fail' });
  }
}

function saveRequestImages(images) {
  return images.map((im) => {
    const name = `${randToken(12)}.${im.ext}`;
    fs.writeFileSync(path.join(DATA_DIR, 'uploads/req', name), im.data, { mode: 0o600 });
    return name;
  });
}

async function apiCreateRequest(req, res, ip) {
  if (!rateLimit(`req:${ip}`, 5, 3600e3) || !rateLimit('req:global', 200, 3600e3)) return json(res, 429, { error: 'rate' });
  const b = await readJson(req, 14 * 1024 * 1024);
  if (b.website) return json(res, 200, { ok: true, code: randCode() }); // bot tuzog'i: jim "muvaffaqiyat"
  const r = {
    lang: LANGS.includes(b.lang) ? b.lang : 'uz', name: clean(b.name, 80), phone: clean(b.phone, 20), company: clean(b.company, 100),
    service: clean(b.service, 120), equipment: clean(b.equipment, 120), message: clean(b.message, 2000)
  };
  const digits = r.phone.replace(/\D/g, '');
  if (r.name.length < 2 || digits.length < 9 || digits.length > 15 || r.message.length < 10 || b.consent !== true) return json(res, 400, { error: 'validation' });
  const images = parseImages(b.images);
  const diag = b.diag_id && diagCache.get(String(b.diag_id));
  const eq = /^EQ-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(String(b.equipment_code || '')) ? db.prepare('SELECT * FROM equipment WHERE code = ?').get(b.equipment_code) : null;
  const user = accounts.userFrom(req);
  const out = createRequest({ ...r, ai: diag ? diag.result : null }, images, { source: eq ? 'qr' : 'web', equipment: eq, userId: user?.id || null });
  if (user) accounts.event(user.id, 'request', out.code);
  const c = cfg();
  return json(res, 201, { ok: true, code: out.code, track: pageUrl(r.lang, 'track/') + '#' + out.code, contact: { phone: c.phone, whatsapp: c.whatsapp } });
}

// Arizani yaratish: sayt formasi, QR pasport, Telegram bot va Mini App uchun umumiy
function createRequest(r, images, { source = 'web', equipment = null, tgId = null, userId = null } = {}) {
  const files = saveRequestImages(images);
  if (equipment) {
    r.equipment = [equipment.brand, equipment.model, equipment.serial ? `S/N ${equipment.serial}` : '', equipment.location].filter(Boolean).join(' · ').slice(0, 120);
    if (!r.company && equipment.customer_id) r.company = db.prepare('SELECT company FROM customers WHERE id = ?').get(equipment.customer_id)?.company || '';
  }
  r.priority = r.ai ? r.ai.priority : (PRIORITIES.includes(r.priority) ? r.priority : 'normal');
  r.source = source;
  let code;
  for (let i = 0; i < 5; i++) { code = randCode(); if (!db.prepare('SELECT 1 FROM requests WHERE code = ?').get(code)) break; }
  const t = now();
  const ins = db.prepare('INSERT INTO requests(code, created_at, updated_at, lang, name, phone, company, service, equipment, message, images, status, priority, ai, source, equipment_id, tg_id, user_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
    .run(code, t, t, r.lang, r.name, r.phone, r.company || '', r.service || '', r.equipment || '', r.message, JSON.stringify(files), 'new', r.priority, r.ai ? JSON.stringify(r.ai) : null, source, equipment?.id || null, tgId, userId);
  const id = Number(ins.lastInsertRowid);
  db.prepare('INSERT INTO request_updates(request_id, created_at, status, note, public) VALUES (?, ?, ?, ?, 1)').run(id, t, 'new', '');
  if (equipment) db.prepare('INSERT INTO equipment_events(equipment_id, at, kind, text, request_id) VALUES (?, ?, ?, ?, ?)').run(equipment.id, t, 'request', r.message.slice(0, 300), id);
  r.code = code;
  // Telegram xabari javobni kutdirmaydi
  notifyRequest({ ...r, id }, files.map((f) => path.join(DATA_DIR, 'uploads/req', f)), `${cfg().domain}/admin#req/${id}`)
    .then((ok) => ok && db.prepare('UPDATE requests SET tg_ok = 1 WHERE id = ?').run(id))
    .catch((e) => console.error('Telegram xato:', e.message));
  return { id, code };
}

// Qayta qo'ng'iroq: faqat telefon raqami (va «hozir to'xtagan» belgisi) bilan tezkor ariza
async function apiCallback(req, res, ip) {
  if (!rateLimit(`cb:${ip}`, 4, 3600e3) || !rateLimit('req:global', 200, 3600e3)) return json(res, 429, { error: 'rate' });
  const b = await readJson(req, 8 * 1024);
  if (b.website) return json(res, 200, { ok: true, code: randCode() });
  const lang = LANGS.includes(b.lang) ? b.lang : 'uz';
  const phone = clean(b.phone, 20), digits = phone.replace(/\D/g, '');
  if (digits.length < 9 || digits.length > 15) return json(res, 400, { error: 'phone' });
  const urgent = b.urgent === true;
  const tt = T(lang).v3.cb;
  const out = createRequest({ lang, name: clean(b.name, 80) || '—', phone, service: clean(b.service, 120) || (lang === 'ru' ? 'Обратный звонок' : lang === 'en' ? 'Call back' : 'Qayta qo‘ng‘iroq'), equipment: '', message: urgent ? tt.msgUrgent : tt.msg, priority: urgent ? 'critical' : 'high' }, [], { source: 'callback' });
  return json(res, 201, { ok: true, code: out.code });
}

function apiTrack(req, res, ip, code) {
  if (!rateLimit(`track:${ip}`, 30, 600e3)) return json(res, 429, { error: 'rate' });
  code = String(code || '').toUpperCase();
  if (!/^TX-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) return json(res, 404, { error: 'not_found' });
  const r = db.prepare('SELECT id, code, created_at, updated_at, service, equipment, status, priority FROM requests WHERE code = ?').get(code);
  if (!r) return json(res, 404, { error: 'not_found' });
  const updates = db.prepare('SELECT created_at, status, note FROM request_updates WHERE request_id = ? AND public = 1 ORDER BY id').all(r.id);
  const canRate = reviews.canRate(r);
  const w = r.status === 'done' ? warranty.info(r.code) : null;
  delete r.id;
  return json(res, 200, { ...r, updates, canRate, warranty: w ? { status: w.status, until: w.until, days: w.days } : null });
}

async function apiEvent(req, res, ip) {
  if (!rateLimit(`ev:${ip}`, 120, 600e3)) return send(res, 204, '');
  const b = await readBody(req, 4096).then((x) => J(x.toString('utf8'), {}));
  track(String(b.t || ''), { path: b.p, lang: b.l, ref: b.r, meta: b.m }, ip, String(req.headers['user-agent'] || ''));
  send(res, 204, '');
}

function addUpdate(id, { status, priority, note, public: pub }) {
  const t = now();
  const r = db.prepare('SELECT status, priority FROM requests WHERE id = ?').get(id);
  if (!r) return false;
  const st = STATUSES.includes(status) ? status : r.status;
  const pr = PRIORITIES.includes(priority) ? priority : r.priority;
  db.prepare('UPDATE requests SET status = ?, priority = ?, updated_at = ? WHERE id = ?').run(st, pr, t, id);
  if (st !== r.status || note) {
    db.prepare('INSERT INTO request_updates(request_id, created_at, status, note, public) VALUES (?, ?, ?, ?, ?)').run(id, t, st, note || '', pub ? 1 : 0);
    if (pub) notifyCustomer(id).catch((e) => console.error('Mijozga xabar:', e.message));
    if (st === 'done' && r.status !== 'done') tg.askReview(id).catch((e) => console.error('Baho so‘rovi:', e.message));
  }
  return true;
}

// Ariza Telegram orqali (bot yoki Mini App) kelgan bo'lsa yoki mijoz kuzatayotgan bo'lsa, unga holat o'zgarishini yuborish
async function notifyCustomer(id) {
  const r = db.prepare('SELECT code, lang, status, tg_id FROM requests WHERE id = ?').get(id);
  if (!r) return;
  const u = db.prepare('SELECT note FROM request_updates WHERE request_id = ? AND public = 1 ORDER BY id DESC LIMIT 1').get(id);
  const followers = db.prepare("SELECT tg_id, lang FROM tg_users WHERE blocked = 0 AND (tg_id = ? OR follows LIKE ?)").all(r.tg_id || '-', `%"${r.code}"%`);
  for (const f of followers) {
    const lang = LANGS.includes(f.lang) ? f.lang : r.lang || 'uz';
    const t = T(lang);
    const text = `<b>${esc(r.code)}</b>: ${esc(t.track.s[r.status] || r.status)}${u?.note ? `\n${esc(u.note)}` : ''}`;
    await sendTo(f.tg_id, text, miniAppButton(t.tgx.open, `#r/${r.code}`)).catch(() => {});
  }
}

// Telegram Mini App tugmasi (faqat https manzilda ishlaydi)
const miniAppUrl = (hash = '') => `${cfg().domain}/tg/${hash}`;
function miniAppButton(text, hash = '') {
  const u = miniAppUrl(hash);
  return u.startsWith('https://') ? { reply_markup: { inline_keyboard: [[{ text, web_app: { url: u } }]] } } : {};
}

const ctx = { json, readJson, html, send, cfg, T, VER, createRequest, addUpdate, miniAppButton, STATUSES, setting: getSetting, botUsername: () => BOT_USERNAME, isSecure, clientIp };
const media = createMedia(ctx);
heroOf = media.heroFile;
ctx.media = media;
const accounts = createAccounts(ctx);
ctx.accounts = accounts;
const ops = createOps(ctx);
const academy = createAcademy({ ...ctx, courseBySlug, listCourses, lessonsOf, quizOf });
ctx.academy = academy;
const reviews = createReviews(ctx);
const team = createTeam(ctx);
if (!listTeam(true).length) db.prepare('INSERT INTO team(sort, name, years, skills, data, published, created_at, updated_at) VALUES (0, ?, NULL, ?, ?, 1, ?, ?)').run(cfg().engineerName || 'Barotjon', 'ABB, KUKA, Siemens PLC, Xitoy va Germaniya uskunalari, sanoat elektronikasi', JSON.stringify({ role: { uz: 'Bosh muhandis', ru: 'Главный инженер', en: 'Lead engineer' } }), now(), now());
ctx.reviews = reviews;
const warranty = createWarranty(ctx);
ctx.warranty = warranty;
ctx.ops = ops;
const tg = createTgApp(ctx);

// Mini App sahifasi: Telegram skripti va Telegram Web ichida ochilishi uchun alohida CSP
function tgShell(res) {
  const headers = { ...SEC_HEADERS };
  delete headers['X-Frame-Options'];
  headers['Content-Security-Policy'] = ["default-src 'none'", "script-src 'self' https://telegram.org", "style-src 'self'", "font-src 'self'", "img-src 'self' data: blob:", "connect-src 'self'", "base-uri 'none'", "form-action 'none'", 'frame-ancestors https://web.telegram.org', "object-src 'none'"].join('; ');
  headers['Cross-Origin-Opener-Policy'] = 'unsafe-none';
  res.writeHead(200, { ...headers, 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
  res.end(`<!doctype html><html lang="uz"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="robots" content="noindex, nofollow"><title>${esc(cfg().brand)}</title><link rel="stylesheet" href="/assets/css/tg.css?v=${VER}"><script src="https://telegram.org/js/telegram-web-app.js?59"></script><script src="/assets/js/tg.js?v=${VER}" defer></script></head><body><div id="app" data-i18n="/api/app/i18n"><p class="boot">…</p></div></body></html>`);
}
// Mini App matnlari (3 tilda) va holat nomlari
function tgI18n(res) {
  const out = {};
  for (const l of LANGS) { const t = T(l); out[l] = { ...t.tgx.app, ...t.tg4.app, wActive: t.warranty.trackLine, wExpired: t.warranty.expired, status: t.track.s, p: t.ai.p, eq: t.eq, doc: { quote: t.doc.quote, act: t.doc.act, invoice: t.doc.invoice, report: t.doc.report, accepted: t.doc.accepted }, sev: t.errors.sev, causes: t.errors.causes, checks: t.errors.checks, ai: { title: t.tgx.aiTitle, steps: t.tgx.steps } }; }
  json(res, 200, out, { 'Cache-Control': 'public, max-age=300' });
}

/* ---------- Admin ---------- */
const COOKIE = (req) => (isSecure(req) ? '__Host-tx_admin' : 'tx_admin');
function adminSession(req) { return getSession(parseCookies(req.headers.cookie)[COOKIE(req)]); }

function adminShell(res, csrf) {
  send(res, 200, `<!doctype html><html lang="uz"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>Admin · ${esc(cfg().brand)}</title><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/assets/css/style.css?v=${VER}"><link rel="stylesheet" href="/assets/css/admin.css?v=${VER}"><script src="/assets/js/admin.js?v=${VER}" defer></script></head><body class="adm"><div id="adm" data-csrf="${esc(csrf || '')}"></div></body></html>`, 'text/html; charset=utf-8', { 'Cache-Control': 'no-cache' });
}

async function adminLogin(req, res, ip) {
  if (!sameOrigin(req)) return json(res, 403, { error: 'origin' });
  if (!rateLimit(`login:${ip}`, 5, 900e3)) return json(res, 429, { error: 'rate' });
  const b = await readJson(req);
  if (!verifyPassword(String(b.password || ''), getSetting('admin_hash'))) { await new Promise((r) => setTimeout(r, 400)); return json(res, 401, { error: 'bad_password' }); }
  const s = createSession();
  const cookie = `${COOKIE(req)}=${s.token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${s.maxAge}${isSecure(req) ? '; Secure' : ''}`;
  return json(res, 200, { ok: true, csrf: s.csrf }, { 'Set-Cookie': cookie });
}

function adminUploadServe(req, res, file) {
  if (!adminSession(req)) return send(res, 401, '');
  if (!/^[A-Za-z0-9_-]{16}\.(jpg|png|webp)$/.test(file)) return send(res, 404, '');
  const p = path.join(DATA_DIR, 'uploads/req', file);
  if (!fs.existsSync(p)) return send(res, 404, '');
  send(res, 200, fs.readFileSync(p), MIME['.' + file.split('.').pop()], { 'Cache-Control': 'private, max-age=3600', 'Content-Security-Policy': "default-src 'none'; sandbox" });
}

async function adminApi(req, res, p, sess) {
  const method = req.method;
  if (method !== 'GET' && (req.headers['x-csrf'] !== sess.csrf || !sameOrigin(req))) return json(res, 403, { error: 'csrf' });
  let m;
  const q = new URL(req.url, 'http://x').searchParams;

  if (p === '/me') return json(res, 200, { csrf: sess.csrf, ai: aiInfo(), tg: tgEnabled(), webhook: Boolean(process.env.TELEGRAM_WEBHOOK_SECRET), domain: cfg().domain, version: VER, botUsername: BOT_USERNAME });
  if (p === '/stats') return json(res, 200, stats(q.get('days')));

  /* Arizalar */
  if (p === '/requests' && method === 'GET') {
    const where = []; const args = [];
    if (STATUSES.includes(q.get('status'))) { where.push('status = ?'); args.push(q.get('status')); }
    if (q.get('open') === '1') where.push("status NOT IN ('done','cancelled')");
    if (q.get('q')) { where.push('(code LIKE ? OR name LIKE ? OR phone LIKE ? OR equipment LIKE ? OR company LIKE ?)'); const s = `%${clean(q.get('q'), 60)}%`; args.push(s, s, s, s, s); }
    const rows = db.prepare(`SELECT id, code, created_at, updated_at, name, phone, company, service, equipment, status, priority, ai IS NOT NULL has_ai, tg_ok FROM requests ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY CASE WHEN status IN ('done','cancelled') THEN 1 ELSE 0 END, CASE priority WHEN 'critical' THEN 0 WHEN 'high' THEN 1 WHEN 'normal' THEN 2 ELSE 3 END, id DESC LIMIT 300`).all(...args);
    return json(res, 200, rows);
  }
  if ((m = p.match(/^\/requests\/(\d+)$/))) {
    const id = +m[1];
    if (method === 'GET') {
      const r = db.prepare('SELECT * FROM requests WHERE id = ?').get(id);
      if (!r) return json(res, 404, { error: 'not_found' });
      return json(res, 200, { ...r, images: J(r.images, []), ai: J(r.ai), updates: db.prepare('SELECT * FROM request_updates WHERE request_id = ? ORDER BY id DESC').all(id) });
    }
    if (method === 'POST') {
      const b = await readJson(req);
      if (!addUpdate(id, { status: b.status, priority: b.priority, note: clean(b.note, 1000), public: b.public !== false })) return json(res, 404, { error: 'not_found' });
      return json(res, 200, { ok: true });
    }
    if (method === 'DELETE') {
      const r = db.prepare('SELECT images FROM requests WHERE id = ?').get(id);
      if (r) for (const f of J(r.images, [])) fs.rmSync(path.join(DATA_DIR, 'uploads/req', path.basename(f)), { force: true });
      db.prepare('DELETE FROM requests WHERE id = ?').run(id);
      return json(res, 200, { ok: true });
    }
  }
  if (p === '/requests.csv') {
    const rows = db.prepare('SELECT code, created_at, status, priority, name, phone, company, service, equipment, message FROM requests ORDER BY id DESC').all();
    const cell = (v) => { let s = String(v ?? ''); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
    const csv = '﻿' + ['code,created_at,status,priority,name,phone,company,service,equipment,message', ...rows.map((r) => Object.values(r).map(cell).join(','))].join('\r\n');
    return send(res, 200, csv, 'text/csv; charset=utf-8', { 'Content-Disposition': 'attachment; filename="arizalar.csv"', 'Cache-Control': 'no-store' });
  }

  /* Rasm yuklash (portfel) */
  if (p === '/upload' && method === 'POST') {
    const b = await readJson(req, 12 * 1024 * 1024);
    const im = decodeImage(b.image, 8 * 1024 * 1024);
    if (!im) return json(res, 400, { error: 'bad_image' });
    const name = `${randToken(12)}.${im.ext}`;
    fs.writeFileSync(path.join(DATA_DIR, 'media', name), im.data);
    return json(res, 201, { file: name });
  }

  /* Portfel */
  if (p === '/portfolio' && method === 'GET') return json(res, 200, listPortfolio(true));
  if ((m = p.match(/^\/portfolio(?:\/(\d+))?$/)) && method === 'POST') {
    const b = await readJson(req, 256 * 1024);
    const tri = (o, n) => Object.fromEntries(LANGS.map((l) => [l, clean(o?.[l], n)]));
    const data = { industry: tri(b.industry, 80), title: tri(b.title, 160), problem: tri(b.problem, 1500), solution: tri(b.solution, 2500), result: tri(b.result, 1500) };
    if (!data.title.uz) return json(res, 400, { error: 'title' });
    const slug = clean(b.slug, 80).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '') || `ish-${Date.now()}`;
    const images = (Array.isArray(b.images) ? b.images : []).filter((f) => /^[A-Za-z0-9_-]{16}\.(jpg|png|webp)$/.test(f)).slice(0, 12);
    const vals = [slug, clean(b.brand, 40), clean(b.model, 80), parseInt(b.year, 10) || null, JSON.stringify(images), ['kuka', 'abb', 'drive', 'robot'].includes(b.cover) ? b.cover : 'robot', JSON.stringify(data), b.published ? 1 : 0, b.sample ? 1 : 0, parseInt(b.sort, 10) || 0];
    try {
      if (m[1]) db.prepare('UPDATE portfolio SET slug=?, brand=?, model=?, year=?, images=?, cover=?, data=?, published=?, sample=?, sort=? WHERE id = ?').run(...vals, +m[1]);
      else db.prepare('INSERT INTO portfolio(slug, brand, model, year, images, cover, data, published, sample, sort, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)').run(...vals, now());
    } catch (e) { return json(res, 409, { error: 'slug' }); }
    return json(res, 200, { ok: true });
  }
  if ((m = p.match(/^\/portfolio\/(\d+)$/)) && method === 'DELETE') { db.prepare('DELETE FROM portfolio WHERE id = ?').run(+m[1]); return json(res, 200, { ok: true }); }

  /* Akademiya */
  if (p === '/courses' && method === 'GET') return json(res, 200, listCourses(true));
  if ((m = p.match(/^\/courses\/(\d+)$/)) && method === 'GET') {
    const c = db.prepare('SELECT * FROM courses WHERE id = ?').get(+m[1]);
    if (!c) return json(res, 404, { error: 'not_found' });
    return json(res, 200, { ...rowCourse(c), lessons: lessonsOf(c.id).map((l) => ({ ...l, videoView: media.view(l.video) })), quiz: quizOf(c.id) });
  }
  if ((m = p.match(/^\/courses(?:\/(\d+))?$/)) && method === 'POST') {
    const b = await readJson(req, 1024 * 1024);
    const tri = (o, n) => Object.fromEntries(LANGS.map((l) => [l, clean(o?.[l], n)]));
    const slug = clean(b.slug, 80).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
    if (!slug) return json(res, 400, { error: 'slug' });
    const num = (v, lo, hi, d) => Math.min(Math.max(parseInt(v, 10) || d, lo), hi);
    const requires = clean(b.requires, 80).toLowerCase().replace(/[^a-z0-9-]+/g, '');
    const data = JSON.stringify({ title: tri(b.title, 160), summary: tri(b.summary, 600), audience: tri(b.audience, 200), requires: requires === slug ? '' : requires, quiz_size: num(b.quiz_size, 1, 60, 8), time_limit: num(b.time_limit, 1, 180, 15), pass: num(b.pass, 50, 100, 80) });
    const optsOf = (o) => Object.fromEntries(LANGS.map((l) => [l, (Array.isArray(o?.[l]) ? o[l] : []).slice(0, 6).map((x) => clean(x, 200))]));
    const checkOf = (k) => (k && LANGS.some((l) => clean(k.q?.[l], 300)) ? { q: tri(k.q, 300), options: optsOf(k.options), answer: Math.max(0, parseInt(k.answer, 10) || 0) } : null);
    const lessons = (Array.isArray(b.lessons) ? b.lessons : []).slice(0, 60);
    const quiz = (Array.isArray(b.quiz) ? b.quiz : []).slice(0, 120);
    db.exec('BEGIN');
    try {
      let id = m[1] ? +m[1] : null;
      const vals = [slug, ['basic', 'advanced', 'expert'].includes(b.level) ? b.level : 'basic', clean(b.equipment, 60), parseInt(b.hours, 10) || 1, data, b.published ? 1 : 0, parseInt(b.sort, 10) || 0];
      if (id) db.prepare('UPDATE courses SET slug=?, level=?, equipment=?, hours=?, data=?, published=?, sort=? WHERE id = ?').run(...vals, id);
      else id = Number(db.prepare('INSERT INTO courses(slug, level, equipment, hours, data, published, sort) VALUES (?,?,?,?,?,?,?)').run(...vals).lastInsertRowid);
      const keep = [];
      const oldFiles = id ? lessonsOf(id).map((l) => l.video?.file).filter(Boolean) : [];
      lessons.forEach((l, i) => {
        const d = JSON.stringify({ title: tri(l.title, 160), body: tri(l.body, 20000), check: checkOf(l.check), video: media.parseSrc(l.video) });
        if (l.id && db.prepare('SELECT 1 FROM lessons WHERE id = ? AND course_id = ?').get(l.id, id)) { db.prepare('UPDATE lessons SET sort = ?, data = ? WHERE id = ?').run(i + 1, d, l.id); keep.push(l.id); }
        else keep.push(Number(db.prepare('INSERT INTO lessons(course_id, sort, data) VALUES (?, ?, ?)').run(id, i + 1, d).lastInsertRowid));
      });
      db.prepare(`DELETE FROM lessons WHERE course_id = ? ${keep.length ? `AND id NOT IN (${keep.map(() => '?').join(',')})` : ''}`).run(id, ...keep);
      db.prepare('DELETE FROM quiz WHERE course_id = ?').run(id);
      quiz.forEach((qq, i) => {
        const opts = optsOf(qq.options);
        db.prepare('INSERT INTO quiz(course_id, sort, data, answer) VALUES (?, ?, ?, ?)').run(id, i + 1, JSON.stringify({ q: tri(qq.q, 300), options: opts }), Math.max(0, parseInt(qq.answer, 10) || 0));
      });
      db.exec('COMMIT');
      oldFiles.forEach((f) => media.dropIfUnused(f));
      return json(res, 200, { ok: true, id });
    } catch (e) { db.exec('ROLLBACK'); return json(res, 409, { error: 'slug' }); }
  }
  if ((m = p.match(/^\/courses\/(\d+)$/)) && method === 'DELETE') {
    const files = lessonsOf(+m[1]).map((l) => l.video?.file).filter(Boolean);
    db.prepare('DELETE FROM courses WHERE id = ?').run(+m[1]);
    files.forEach((f) => media.dropIfUnused(f));
    return json(res, 200, { ok: true });
  }

  if (p === '/codes' && method === 'GET') return json(res, 200, db.prepare('SELECT a.*, (SELECT COUNT(*) FROM learners l WHERE l.code = a.code) used FROM access_codes a ORDER BY created_at DESC').all());
  if (p === '/codes' && method === 'POST') {
    const b = await readJson(req);
    const company = clean(b.company, 100); if (!company) return json(res, 400, { error: 'company' });
    const code = clean(b.code, 24).toUpperCase().replace(/[^A-Z0-9-]/g, '') || randCode('AK', 2, 4);
    try { db.prepare('INSERT INTO access_codes(code, company, seats, expires, created_at, manager_token) VALUES (?, ?, ?, ?, ?, ?)').run(code, company, Math.min(Math.max(parseInt(b.seats, 10) || 20, 1), 5000), /^\d{4}-\d{2}-\d{2}$/.test(b.expires || '') ? b.expires : null, now(), randToken(18)); } catch { return json(res, 409, { error: 'exists' }); }
    return json(res, 201, { code });
  }
  if ((m = p.match(/^\/codes\/([A-Z0-9-]+)$/)) && method === 'DELETE') { db.prepare('DELETE FROM access_codes WHERE code = ?').run(m[1]); return json(res, 200, { ok: true }); }
  if (p === '/learners') {
    return json(res, 200, db.prepare(`SELECT l.id, l.name, l.company, l.code, l.created_at,
      (SELECT COUNT(*) FROM progress p WHERE p.learner_id = l.id) lessons_done,
      (SELECT MAX(score) FROM quiz_results r WHERE r.learner_id = l.id) best_score,
      (SELECT GROUP_CONCAT(c.slug || ':' || r.cert_id) FROM quiz_results r JOIN courses c ON c.id = r.course_id WHERE r.learner_id = l.id AND r.passed = 1) certs
      FROM learners l ORDER BY l.id DESC LIMIT 500`).all());
  }

  /* Matnlar */
  if (p === '/texts' && method === 'GET') {
    const lang = LANGS.includes(q.get('lang')) ? q.get('lang') : 'uz';
    const base = flatten(baseTexts(lang));
    delete base.htmlLang; delete base.ogLocale; delete base.langShort;
    return json(res, 200, { base, overrides: overrides(lang) });
  }
  if (p === '/texts' && method === 'POST') {
    const b = await readJson(req, 128 * 1024);
    const lang = LANGS.includes(b.lang) ? b.lang : null;
    const base = lang ? flatten(baseTexts(lang)) : {};
    if (!lang || !(b.key in base)) return json(res, 400, { error: 'key' });
    if (b.value === null || b.value === base[b.key]) db.prepare('DELETE FROM text_overrides WHERE lang = ? AND key = ?').run(lang, b.key);
    else db.prepare('INSERT INTO text_overrides(lang, key, value) VALUES (?, ?, ?) ON CONFLICT(lang, key) DO UPDATE SET value = excluded.value').run(lang, b.key, clean(b.value, 5000));
    overridesCache = null;
    return json(res, 200, { ok: true });
  }

  /* Sozlamalar */
  if (p === '/settings' && method === 'GET') {
    const c = cfg();
    return json(res, 200, { brand: c.brand, engineerName: c.engineerName, phone: c.phone, whatsapp: c.whatsapp, telegram: c.telegram, email: c.email, city_uz: c.city.uz, city_ru: c.city.ru, city_en: c.city.en, responseHours: c.responseHours, domain: c.domain, ...Object.fromEntries(EXTRA_KEYS.map((k) => [k, getSetting(k, '')])), botUsername: BOT_USERNAME });
  }
  if (p === '/settings' && method === 'POST') {
    const b = await readJson(req);
    for (const k of SETTING_KEYS) {
      if (!(k in b)) continue;
      let v = clean(b[k], 200);
      if (k === 'whatsapp') v = v.replace(/\D/g, '');
      if (k === 'telegram') v = v.replace(/^@/, '').replace(/[^A-Za-z0-9_]/g, '');
      if (k === 'responseHours') v = String(Math.min(Math.max(parseInt(v, 10) || 2, 1), 72));
      if (k === 'domain' && v && !/^https:\/\/[a-z0-9.-]+(:\d+)?$/i.test(v)) return json(res, 400, { error: 'domain' });
      if (k === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return json(res, 400, { error: 'email' });
      if (k === 'googleVerify' || k === 'yandexVerify') v = v.replace(/[^A-Za-z0-9_.-]/g, '');
      if (k === 'warrantyMonths' || k === 'partsMonths') v = v ? String(Math.min(Math.max(parseInt(v, 10) || 3, 1), 60)) : '';
      if (k === 'phoneMode') v = v === 'lock' ? 'lock' : 'open';
      if (k === 'admin_tg_ids') v = v.split(/[\s,]+/).filter((x) => /^-?\d{3,20}$/.test(x)).join(',');
      setSetting(k, v);
    }
    return json(res, 200, { ok: true });
  }
  if (p === '/sections' && method === 'GET') return json(res, 200, { hidden: J(getSetting('hidden_sections', '[]'), []) });
  if (p === '/sections' && method === 'POST') {
    const b = await readJson(req);
    const hidden = (Array.isArray(b.hidden) ? b.hidden : []).filter((k) => HOME_SECTIONS.includes(k));
    setSetting('hidden_sections', JSON.stringify(hidden));
    return json(res, 200, { ok: true, hidden });
  }
  if (p === '/doc-assets' && method === 'GET') return json(res, 200, { sign: getSetting('doc_sign', ''), stamp: getSetting('doc_stamp', '') });
  if (p === '/doc-assets' && method === 'POST') {
    const b = await readJson(req, 900 * 1024);
    for (const k of ['sign', 'stamp']) {
      if (!(k in b)) continue;
      const v = String(b[k] || '');
      if (v && (!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(v) || v.length > 400 * 1024)) return json(res, 400, { error: 'image' });
      setSetting(`doc_${k}`, v);
    }
    return json(res, 200, { ok: true });
  }
  if (p === '/password' && method === 'POST') {
    const b = await readJson(req);
    if (!verifyPassword(String(b.current || ''), getSetting('admin_hash'))) return json(res, 401, { error: 'bad_password' });
    if (String(b.next || '').length < 10) return json(res, 400, { error: 'weak' });
    setSetting('admin_hash', hashPassword(String(b.next)));
    destroyAllSessions();
    return json(res, 200, { ok: true });
  }
  if (p === '/tg-test' && method === 'POST') {
    try { const ok = await sendText(`✅ ${esc(cfg().brand)}: Telegram ulanishi ishlayapti.`); return json(res, ok ? 200 : 503, { ok }); } catch (e) { return json(res, 502, { error: e.message }); }
  }
  if (await reviews.admin(req, res, p, method)) return;
  if (await team.admin(req, res, p, method)) return;
  if (await accounts.admin(req, res, p, method, q)) return;
  if (await media.admin(req, res, p, method, q, readBody)) return;
  await ops.admin(req, res, p, method, q);
  if (res.headersSent) return;
  return json(res, 404, { error: 'not_found' });
}

/* ---------- Router ---------- */
async function handle(req, res) {
  const u = new URL(req.url, 'http://local');
  let p = decodeURIComponent(u.pathname);
  if (p.includes('\0') || p.includes('..')) return send(res, 400, 'Bad request', 'text/plain');
  const ip = clientIp(req);
  const method = req.method;

  if (!['GET', 'HEAD', 'POST', 'DELETE'].includes(method)) return send(res, 405, '', 'text/plain', { Allow: 'GET, HEAD, POST, DELETE' });
  if (!rateLimit(`all:${ip}`, 600, 60e3)) return send(res, 429, 'Too many requests', 'text/plain', { 'Retry-After': '60' });

  // Statik
  const a = assets.get(p);
  if (a && (method === 'GET' || method === 'HEAD')) {
    const cc = a.immutable || u.searchParams.has('v') ? 'public, max-age=31536000, immutable' : 'public, max-age=86400';
    // Video: Safari faqat Range so'rovlari bilan ijro etadi
    if (a.type.startsWith('video/')) {
      const size = a.body.length, rm = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
      if (rm && (rm[1] || rm[2])) {
        let start = rm[1] ? +rm[1] : size - +rm[2], end = rm[1] && rm[2] ? Math.min(+rm[2], size - 1) : size - 1;
        if (start < 0) start = 0;
        if (start >= size || start > end) return send(res, 416, '', 'text/plain', { 'Content-Range': `bytes */${size}` });
        return send(res, 206, method === 'HEAD' ? '' : a.body.subarray(start, end + 1), a.type, { 'Cache-Control': cc, 'Accept-Ranges': 'bytes', 'Content-Range': `bytes ${start}-${end}/${size}` });
      }
      return send(res, 200, method === 'HEAD' ? '' : a.body, a.type, { 'Cache-Control': cc, 'Accept-Ranges': 'bytes' });
    }
    return send(res, 200, method === 'HEAD' ? '' : a.body, a.type, { 'Cache-Control': cc });
  }
  let m;
  if ((m = p.match(/^\/media\/([A-Za-z0-9_-]{16}\.(jpg|png|webp))$/))) {
    const f = path.join(DATA_DIR, 'media', m[1]);
    if (fs.existsSync(f)) return send(res, 200, fs.readFileSync(f), MIME['.' + m[2]], { 'Cache-Control': 'public, max-age=31536000, immutable', 'Content-Security-Policy': "default-src 'none'; sandbox" });
    return send(res, 404, '', 'text/plain');
  }
  if ((m = p.match(/^\/media\/hero\/([A-Za-z0-9_-]{24}\.(?:mp4|webm))$/)) && (method === 'GET' || method === 'HEAD')) return media.serve(req, res, m[1], u.searchParams, true);
  if ((m = p.match(/^\/media\/v\/([A-Za-z0-9_-]{24}\.(?:mp4|webm))$/)) && (method === 'GET' || method === 'HEAD')) return media.serve(req, res, m[1], u.searchParams);
  if (p === '/sitemap.xml') return sitemap(res);
  if (p === '/robots.txt') return robots(res);
  { const vf = verifyFile(p); if (vf) { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); return res.end(vf); } }
  if (p === '/.well-known/security.txt') return securityTxt(res);
  if (p === '/healthz') return json(res, 200, { ok: true });

  // Ommaviy API
  if (p.startsWith('/api/')) {
    if (method === 'POST' && !sameOrigin(req)) return json(res, 403, { error: 'origin' });
    if (p === '/api/diagnose' && method === 'POST') return apiDiagnose(req, res, ip);
    if (p === '/api/requests' && method === 'POST') return apiCreateRequest(req, res, ip);
    if (p === '/api/callback' && method === 'POST') return apiCallback(req, res, ip);
    if ((m = p.match(/^\/api\/track\/([A-Za-z0-9-]{1,20})$/)) && method === 'GET') return apiTrack(req, res, ip, m[1]);
    if (p === '/api/e' && method === 'POST') return apiEvent(req, res, ip);
    if ((m = p.match(/^\/api\/warranty\/([A-Za-z0-9-]{1,20})$/)) && method === 'GET') return warranty.api(req, res, ip, m[1]);
    if (p === '/api/review' && method === 'POST') return reviews.apiWeb(req, res, ip);
    if (p === '/api/feedback' && method === 'POST') return team.apiFeedback(req, res, ip);
    if (p.startsWith('/api/account/')) return accounts.api(req, res, ip, p, method);
    if ((m = p.match(/^\/api\/videos\/(\d+)\/view$/)) && method === 'POST') return media.apiView(req, res, ip, +m[1], accounts.userFrom(req));
    if (p.startsWith('/api/academy/')) { const r = academy.api(req, res, ip, p, method); if (r !== null) return r; }
    if ((m = p.match(/^\/api\/tg\/([A-Za-z0-9_-]{16,})$/)) && method === 'POST') return tg.webhook(req, res, m[1]);
    if ((m = p.match(/^\/api\/doc\/([A-Za-z0-9_-]{20,40})\/accept$/)) && method === 'POST') return ops.apiDocAccept(req, res, ip, m[1]);
    if (p === '/api/app/i18n' && method === 'GET') return tgI18n(res);
    if (p.startsWith('/api/app/')) return tg.app(req, res, ip, p.slice('/api/app'.length));
    return json(res, 404, { error: 'not_found' });
  }

  // Admin
  if (p === '/admin' || p === '/admin/') { const s = adminSession(req); return adminShell(res, s?.csrf); }
  if (p === '/admin/login' && method === 'POST') return adminLogin(req, res, ip);
  if (p === '/admin/logout' && method === 'POST') {
    const tok = parseCookies(req.headers.cookie)[COOKIE(req)];
    const s = getSession(tok);
    if (s && req.headers['x-csrf'] === s.csrf) destroySession(tok);
    return json(res, 200, { ok: true }, { 'Set-Cookie': `${COOKIE(req)}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${isSecure(req) ? '; Secure' : ''}` });
  }
  if ((m = p.match(/^\/admin\/uploads\/([^/]+)$/))) return adminUploadServe(req, res, m[1]);
  if (p === '/admin/qr') { if (!adminSession(req)) return send(res, 401, '', 'text/plain'); return ops.qrPage(res, (u.searchParams.get('ids') || '').split(',').map((x) => parseInt(x, 10)).filter((x) => x > 0).slice(0, 200)); }
  if (p === '/tg' || p === '/tg/') return tgShell(res);
  if (p.startsWith('/admin/api/')) {
    const s = adminSession(req);
    if (!s) return json(res, 401, { error: 'auth' });
    return adminApi(req, res, p.slice('/admin/api'.length), s);
  }

  if (method !== 'GET' && method !== 'HEAD') return send(res, 405, '', 'text/plain');
  return routePage(req, res, p);
}

const server = http.createServer((req, res) => {
  handle(req, res).catch((e) => {
    if (!e.status || e.status >= 500) console.error(e);
    if (!res.headersSent) json(res, e.status || 500, { error: e.code || (e.status ? e.message : 'server') });
  });
});
server.headersTimeout = 20_000;
server.requestTimeout = 120_000;
server.listen(PORT, () => console.log(`Texnika Servis: http://localhost:${PORT}  (AI: ${aiEnabled() ? 'yoqilgan' : 'o‘chiq'}, Telegram: ${tgEnabled() ? 'yoqilgan' : 'o‘chiq'}${PROD ? ', production' : ''})`));
// Telegram /holat buyrug'i uchun webhook: TELEGRAM_WEBHOOK_SECRET va PUBLIC_URL berilsa avtomatik ulanadi
if (tgEnabled() && process.env.TELEGRAM_WEBHOOK_SECRET && process.env.PUBLIC_URL) {
  setWebhook(`${process.env.PUBLIC_URL.replace(/\/+$/, '')}/api/tg/${process.env.TELEGRAM_WEBHOOK_SECRET}`, process.env.TELEGRAM_WEBHOOK_SECRET)
    .then(() => console.log('Telegram webhook ulandi')).catch((e) => console.error('Telegram webhook xatosi:', e.message));
}
botInfo().then((b) => { if (b?.username) BOT_USERNAME = b.username; }).catch(() => {});
// Bot menyusidagi tugma Mini App ni ochadi (https domen bo'lsa)
if (process.env.TELEGRAM_BOT_TOKEN && miniAppUrl().startsWith('https://')) tgApi('setChatMenuButton', { menu_button: { type: 'web_app', text: 'Ilova', web_app: { url: miniAppUrl() } } }).catch((e) => console.error('Menyu tugmasi:', e.message));
// Bot menyusidagi buyruqlar ro'yxati (3 tilda)
if (process.env.TELEGRAM_BOT_TOKEN) {
  const cmds = { uz: ['Ilovani ochish', 'Ariza holati', 'Xato kodi bo‘yicha yordam', 'O‘qish holati', 'Kafolatni tekshirish'], ru: ['Открыть приложение', 'Статус заявки', 'Помощь по коду ошибки', 'Ход обучения', 'Проверить гарантию'], en: ['Open the app', 'Request status', 'Error code help', 'Training progress', 'Check warranty'] };
  for (const [l, d] of Object.entries(cmds)) tgApi('setMyCommands', { commands: ['ilova', 'holat', 'xato', 'kurslar', 'kafolat'].map((command, i) => ({ command, description: d[i] })), ...(l === 'uz' ? {} : { language_code: l }) }).catch(() => {});
}
ops.startScheduler();
academy.startReminders();
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { server.close(); db.close(); process.exit(0); });
