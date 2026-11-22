// Video: admin paneldan bo'laklab yuklash (katta fayllar ham uzilmaydi), imzolangan va muddatli havola orqali ko'rsatish,
// YouTube/Vimeo havolalari, video qo'llanmalar kutubxonasi (hammaga yoki faqat ro'yxatdan o'tganlarga).
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { db, DATA_DIR, now, J, getSetting, setSetting } from './db.mjs';
import { randToken, clean, rateLimit } from './security.mjs';
import { LANGS } from '../src/i18n.mjs';

const VDIR = path.join(DATA_DIR, 'media/video');
const MAX_VIDEO = 4 * 1024 * 1024 * 1024;
const CHUNK = 8 * 1024 * 1024;
const LINK_HOURS = 12;
const FILE_RE = /^[A-Za-z0-9_-]{24}\.(mp4|webm)$/;
const tr = (o, lang) => o?.[lang] || o?.uz || '';

// MP4 ("ftyp" 4-baytdan) yoki WebM (EBML sarlavhasi)
function sniffVideo(buf) {
  if (buf.length >= 12 && buf.toString('ascii', 4, 8) === 'ftyp') return 'mp4';
  if (buf.length >= 4 && buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) return 'webm';
  return null;
}

// YouTube yoki Vimeo havolasidan identifikator
export function parseLink(u) {
  u = String(u || '').trim();
  let m;
  if ((m = u.match(/^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/))) return { yt: m[1] };
  if ((m = u.match(/^https?:\/\/(?:www\.|player\.)?vimeo\.com\/(?:video\/)?(\d{5,12})/))) return { vimeo: m[1] };
  return null;
}

export function createMedia(ctx) {
  const { json, readJson, send } = ctx;
  let secret = getSetting('media_secret');
  if (!secret) { secret = randToken(32); setSetting('media_secret', secret); }
  const sig = (name, e) => crypto.createHmac('sha256', secret).update(`${name}.${e}`).digest('base64url').slice(0, 32);
  const sign = (name) => { const e = Math.floor(Date.now() / 1000) + LINK_HOURS * 3600; return `/media/v/${name}?e=${e}&s=${sig(name, e)}`; };
  const fileOk = (name) => FILE_RE.test(name || '') && Boolean(db.prepare('SELECT 1 FROM video_files WHERE name = ? AND complete = 1').get(name));

  // Admin yuborgan qiymatdan saqlanadigan manba: { file } | { yt } | { vimeo } | null
  function parseSrc(v) {
    if (!v) return null;
    if (typeof v === 'string') return parseLink(v);
    if (v.file && fileOk(v.file)) return { file: v.file };
    if (v.yt && /^[A-Za-z0-9_-]{11}$/.test(v.yt)) return { yt: v.yt };
    if (v.vimeo && /^\d{5,12}$/.test(v.vimeo)) return { vimeo: v.vimeo };
    if (v.url) return parseLink(v.url);
    return null;
  }
  // Brauzer uchun: fayl bo'lsa imzolangan havola, aks holda embed manzili
  function view(src) {
    if (!src) return null;
    if (src.file) return fileOk(src.file) ? { type: 'file', src: sign(src.file), mime: src.file.endsWith('.webm') ? 'video/webm' : 'video/mp4' } : null;
    if (src.yt) return { type: 'embed', src: `https://www.youtube-nocookie.com/embed/${src.yt}?rel=0&modestbranding=1` };
    if (src.vimeo) return { type: 'embed', src: `https://player.vimeo.com/video/${src.vimeo}?dnt=1` };
    return null;
  }

  /* ---- Ko'rsatish: Range bilan oqim (butun fayl xotiraga o'qilmaydi) ---- */
  // Bosh sahifa videosi hammaga ochiq: imzosiz, uzoq keshlanadi (har yuklashda nomi yangi)
  const heroFile = () => { const f = getSetting('hero_video', ''); return fileOk(f) ? f : ''; };
  function serve(req, res, name, q, pub = false) {
    const e = parseInt(q.get('e'), 10);
    const s = String(q.get('s') || '');
    const okSig = pub ? name === heroFile() : e > Date.now() / 1000 && s.length === 32 && crypto.timingSafeEqual(Buffer.from(s), Buffer.from(sig(name, e)));
    if (!FILE_RE.test(name) || !okSig) return send(res, pub ? 404 : 403, '', 'text/plain');
    const f = path.join(VDIR, name);
    let st; try { st = fs.statSync(f); } catch { return send(res, 404, '', 'text/plain'); }
    const size = st.size;
    const head = { 'Content-Type': name.endsWith('.webm') ? 'video/webm' : 'video/mp4', 'Accept-Ranges': 'bytes', 'Cache-Control': pub ? 'public, max-age=2592000, immutable' : 'private, max-age=3600', 'X-Content-Type-Options': 'nosniff', 'Cross-Origin-Resource-Policy': 'same-origin', 'Content-Security-Policy': "default-src 'none'; sandbox" };
    const rm = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
    let start = 0; let end = size - 1; let status = 200;
    if (rm && (rm[1] || rm[2])) {
      start = rm[1] ? +rm[1] : Math.max(0, size - +rm[2]);
      end = rm[1] && rm[2] ? Math.min(+rm[2], size - 1) : size - 1;
      if (start >= size || start > end) { res.writeHead(416, { ...head, 'Content-Range': `bytes */${size}` }); return res.end(); }
      status = 206; head['Content-Range'] = `bytes ${start}-${end}/${size}`;
    }
    head['Content-Length'] = end - start + 1;
    res.writeHead(status, head);
    if (req.method === 'HEAD') return res.end();
    const stream = fs.createReadStream(f, { start, end });
    stream.on('error', () => res.destroy());
    res.on('close', () => stream.destroy());
    stream.pipe(res);
  }

  /* ---- Yuklash: 8 MB lik bo'laklar, har biri alohida so'rov ---- */
  async function upload(req, res, q, readBody) {
    const offset = parseInt(q.get('offset'), 10) || 0;
    const total = parseInt(q.get('total'), 10) || 0;
    if (total <= 0 || total > MAX_VIDEO) return json(res, 400, { error: 'size' });
    const buf = await readBody(req, CHUNK + 1024);
    if (!buf.length) return json(res, 400, { error: 'empty' });
    let name = String(q.get('name') || '');
    if (!offset) {
      const kind = sniffVideo(buf);
      if (!kind) return json(res, 415, { error: 'format' });
      name = `${randToken(18)}.${kind}`;
      fs.writeFileSync(path.join(VDIR, name), buf);
      db.prepare('INSERT INTO video_files(name, original, size, complete, created_at) VALUES (?, ?, ?, 0, ?)').run(name, clean(q.get('filename'), 160), buf.length, now());
    } else {
      const row = FILE_RE.test(name) && db.prepare('SELECT * FROM video_files WHERE name = ? AND complete = 0').get(name);
      if (!row) return json(res, 404, { error: 'not_found' });
      const cur = fs.statSync(path.join(VDIR, name)).size;
      if (cur !== offset) return json(res, 409, { error: 'offset', size: cur });
      fs.appendFileSync(path.join(VDIR, name), buf);
      db.prepare('UPDATE video_files SET size = ? WHERE name = ?').run(cur + buf.length, name);
    }
    const size = fs.statSync(path.join(VDIR, name)).size;
    if (size > total) { fs.rmSync(path.join(VDIR, name), { force: true }); db.prepare('DELETE FROM video_files WHERE name = ?').run(name); return json(res, 400, { error: 'size' }); }
    const complete = size === total;
    if (complete) db.prepare('UPDATE video_files SET complete = 1 WHERE name = ?').run(name);
    return json(res, 200, { name, size, complete, preview: complete ? sign(name) : null });
  }
  // Hech qayerda ishlatilmayotgan faylni o'chirish
  function dropIfUnused(name) {
    if (!FILE_RE.test(name || '')) return;
    const like = `%"file":"${name}"%`;
    if (getSetting('hero_video', '') === name || db.prepare('SELECT 1 FROM videos WHERE src LIKE ?').get(like) || db.prepare('SELECT 1 FROM lessons WHERE data LIKE ?').get(like)) return;
    fs.rmSync(path.join(VDIR, name), { force: true });
    db.prepare('DELETE FROM video_files WHERE name = ?').run(name);
  }
  // Yarim yuklanib qolgan fayllar (1 kundan eski) tozalanadi
  function cleanup() {
    for (const r of db.prepare('SELECT name FROM video_files WHERE complete = 0 AND created_at < ?').all(new Date(Date.now() - 864e5).toISOString())) {
      fs.rmSync(path.join(VDIR, r.name), { force: true });
      db.prepare('DELETE FROM video_files WHERE name = ?').run(r.name);
    }
  }
  setInterval(cleanup, 6 * 3600e3).unref();

  /* ---- Video qo'llanmalar kutubxonasi ---- */
  const rowVideo = (r) => ({ ...r, src: J(r.src, null), data: J(r.data, {}) });
  function list(all = false) { return db.prepare(`SELECT * FROM videos ${all ? '' : 'WHERE published = 1'} ORDER BY sort, id DESC`).all().map(rowVideo); }
  // Sahifa uchun: ruxsat bo'lmasa manba berilmaydi (faqat "kirish kerak" kartasi)
  function forPage(lang, user) {
    return list().map((v) => {
      const allowed = v.access === 'public' || Boolean(user);
      return { id: v.id, title: tr(v.data.title, lang), text: tr(v.data.text, lang), category: tr(v.data.category, lang), duration: v.data.duration || '', access: v.access, locked: !allowed, view: allowed ? view(v.src) : null };
    });
  }
  async function apiView(req, res, ip, id, user) {
    if (!rateLimit(`vv:${ip}:${id}`, 3, 3600e3)) return json(res, 200, { ok: true });
    const v = db.prepare('SELECT id, access FROM videos WHERE id = ? AND published = 1').get(id);
    if (!v) return json(res, 404, { error: 'not_found' });
    db.prepare('UPDATE videos SET views = views + 1 WHERE id = ?').run(id);
    if (user) ctx.accounts.event(user.id, 'video', String(id));
    return json(res, 200, { ok: true });
  }

  async function admin(req, res, p, method, q, readBody) {
    let m;
    if (p === '/video-upload' && method === 'POST') return upload(req, res, q, readBody), true;
    // Bosh sahifa videosi: yuklangan fayl (bo'sh = standart video) va kadrdagi joylashuv
    if (p === '/hero' && method === 'GET') { const f = heroFile(); return json(res, 200, { file: f, pos: getSetting('hero_pos', '') || 'top', src: f ? `/media/hero/${f}` : '/assets/video/hero-robot.webm' }), true; }
    if (p === '/hero' && method === 'POST') {
      const b = await readJson(req);
      const old = getSetting('hero_video', '');
      const f = b.file ? String(b.file) : '';
      if (f && !fileOk(f)) return json(res, 400, { error: 'src' }), true;
      setSetting('hero_video', f);
      setSetting('hero_pos', ['top', 'center', 'bottom', 'left', 'right'].includes(b.pos) ? b.pos : 'top');
      if (old && old !== f) dropIfUnused(old);
      return json(res, 200, { ok: true }), true;
    }
    if (p === '/videos' && method === 'GET') return json(res, 200, list(true).map((v) => ({ ...v, view: view(v.src) }))), true;
    if ((m = p.match(/^\/videos(?:\/(\d+))?$/)) && method === 'POST') {
      const b = await readJson(req, 128 * 1024);
      const tri = (o, n) => Object.fromEntries(LANGS.map((l) => [l, clean(o?.[l], n)]));
      const src = parseSrc(b.src);
      if (!src) return json(res, 400, { error: 'src' }), true;
      const data = { title: tri(b.title, 160), text: tri(b.text, 2000), category: tri(b.category, 60), duration: clean(b.duration, 12) };
      if (!data.title.uz) return json(res, 400, { error: 'title' }), true;
      const vals = [JSON.stringify(src), JSON.stringify(data), b.access === 'public' ? 'public' : 'users', b.published ? 1 : 0, parseInt(b.sort, 10) || 0];
      let old = null;
      if (m[1]) { old = db.prepare('SELECT src FROM videos WHERE id = ?').get(+m[1]); db.prepare('UPDATE videos SET src=?, data=?, access=?, published=?, sort=? WHERE id = ?').run(...vals, +m[1]); }
      else db.prepare('INSERT INTO videos(src, data, access, published, sort, created_at) VALUES (?,?,?,?,?,?)').run(...vals, now());
      if (old) dropIfUnused(J(old.src, {})?.file);
      return json(res, 200, { ok: true }), true;
    }
    if ((m = p.match(/^\/videos\/(\d+)$/)) && method === 'DELETE') {
      const old = db.prepare('SELECT src FROM videos WHERE id = ?').get(+m[1]);
      db.prepare('DELETE FROM videos WHERE id = ?').run(+m[1]);
      if (old) dropIfUnused(J(old.src, {})?.file);
      return json(res, 200, { ok: true }), true;
    }
    return false;
  }

  return { parseSrc, view, serve, admin, forPage, apiView, dropIfUnused, sign, heroFile };
}
