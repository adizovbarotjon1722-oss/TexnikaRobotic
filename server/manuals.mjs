// Qo'llanmalar (PDF, Word, Excel): admin yuklaydi, foydalanuvchilar kabinetda yoki /manuals/ sahifasida ochadi.
// Fayllar faqat server orqali beriladi: "faqat ro'yxatdan o'tganlarga" qo'llanmani kirmagan odam ocholmaydi.
import fs from 'fs';
import path from 'path';
import { db, DATA_DIR, now, J } from './db.mjs';
import { randToken, clean } from './security.mjs';
import { sendTo } from './telegram.mjs';
import { LANGS } from '../src/i18n.mjs';

const DDIR = path.join(DATA_DIR, 'media/docs');
fs.mkdirSync(DDIR, { recursive: true });
const MAX = 50 * 1024 * 1024;
const FILE_RE = /^[A-Za-z0-9_-]{24}\.(pdf|docx|xlsx|pptx|zip)$/;
const MIME = { pdf: 'application/pdf', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', zip: 'application/zip' };

db.exec(`CREATE TABLE IF NOT EXISTS manuals (id INTEGER PRIMARY KEY, data TEXT NOT NULL, file TEXT, size INTEGER NOT NULL DEFAULT 0, original TEXT,
  access TEXT NOT NULL DEFAULT 'users', published INTEGER NOT NULL DEFAULT 1, sort INTEGER NOT NULL DEFAULT 0, downloads INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL);`);

const tr = (o, lang) => o?.[lang] || o?.uz || '';
// Fayl boshidagi baytlar bo'yicha tur: PDF yoki Office/ZIP
function sniff(buf, original) {
  if (buf.length > 5 && buf.toString('ascii', 0, 5) === '%PDF-') return 'pdf';
  if (buf.length > 4 && buf[0] === 0x50 && buf[1] === 0x4b && buf[2] === 0x03 && buf[3] === 0x04) {
    const ext = String(original || '').toLowerCase().split('.').pop();
    return ['docx', 'xlsx', 'pptx'].includes(ext) ? ext : 'zip';
  }
  return null;
}
const row = (r) => ({ ...r, data: J(r.data, {}) });

export function createManuals(ctx) {
  const { json, readJson, send } = ctx;
  const list = (all = false) => db.prepare(`SELECT * FROM manuals ${all ? '' : 'WHERE published = 1 AND file IS NOT NULL'} ORDER BY sort, id DESC`).all().map(row);

  // Sahifa uchun: til bo'yicha matnlar, kirmagan foydalanuvchiga yopiq qo'llanmalar belgilanadi
  function forPage(lang, user) {
    const fresh = new Date(Date.now() - 14 * 864e5).toISOString();
    return list().map((m) => ({
      id: m.id, title: tr(m.data.title, lang), text: tr(m.data.text, lang), category: tr(m.data.category, lang), ext: m.file.split('.').pop(), size: m.size,
      access: m.access, locked: m.access === 'users' && !user, isNew: m.created_at > fresh, created_at: m.created_at
    }));
  }

  function serve(req, res, id, user) {
    const m = db.prepare('SELECT * FROM manuals WHERE id = ? AND published = 1').get(id);
    if (!m || !FILE_RE.test(m.file || '')) return send(res, 404, 'Not found', 'text/plain; charset=utf-8');
    if (m.access === 'users' && !user) { res.writeHead(302, { Location: `/account/?next=${encodeURIComponent('/account/#manuals')}` }); return res.end(); }
    const f = path.join(DDIR, m.file);
    let st; try { st = fs.statSync(f); } catch { return send(res, 404, 'Not found', 'text/plain; charset=utf-8'); }
    const ext = m.file.split('.').pop();
    const name = (clean(tr(J(m.data, {}).title, 'uz'), 80).replace(/[^\p{L}\p{N} ._-]+/gu, '').trim() || 'qollanma') + '.' + ext;
    res.writeHead(200, {
      'Content-Type': MIME[ext], 'Content-Length': st.size,
      'Content-Disposition': `${ext === 'pdf' ? 'inline' : 'attachment'}; filename="manual.${ext}"; filename*=UTF-8''${encodeURIComponent(name)}`,
      'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; sandbox", 'Cross-Origin-Resource-Policy': 'same-origin', 'X-Robots-Tag': 'noindex'
    });
    if (req.method === 'HEAD') return res.end();
    if (!rangeless.has(`${id}:${user ? user.id : req.socket.remoteAddress}`)) {
      rangeless.add(`${id}:${user ? user.id : req.socket.remoteAddress}`);
      db.prepare('UPDATE manuals SET downloads = downloads + 1 WHERE id = ?').run(id);
      if (user) ctx.accounts.event(user.id, 'manual', tr(J(m.data, {}).title, 'uz').slice(0, 120));
    }
    const s = fs.createReadStream(f); s.on('error', () => res.destroy()); res.on('close', () => s.destroy()); s.pipe(res);
  }
  // Bir foydalanuvchining qayta ochishlari bir soatda bir marta hisoblanadi
  const rangeless = new Set();
  setInterval(() => rangeless.clear(), 3600e3).unref();

  // Yangi qo'llanma haqida Telegram ulagan foydalanuvchilarga xabar
  async function notify(m) {
    const users = db.prepare("SELECT tg_id, lang FROM users WHERE tg_id IS NOT NULL AND blocked = 0").all();
    for (const u of users) {
      const lang = LANGS.includes(u.lang) ? u.lang : 'uz';
      const t = ctx.T(lang).acc2;
      await sendTo(u.tg_id, `📘 ${t.manualNew}: <b>${String(tr(m.data.title, lang)).replace(/[&<>]/g, '')}</b>\n${ctx.cfg().domain}${lang === 'uz' ? '' : '/' + lang}/account/#manuals`).catch(() => {});
      await new Promise((r) => setTimeout(r, 60));
    }
  }

  async function admin(req, res, p, method, q, readBody) {
    let m;
    if (p === '/manuals' && method === 'GET') return json(res, 200, list(true)), true;
    if (p === '/manual-upload' && method === 'POST') {
      const buf = await readBody(req, MAX + 1);
      if (!buf.length || buf.length > MAX) return json(res, 400, { error: 'size' }), true;
      const original = clean(q.get('name'), 160);
      const ext = sniff(buf, original);
      if (!ext) return json(res, 400, { error: 'type' }), true;
      const file = `${randToken(18)}.${ext}`;
      fs.writeFileSync(path.join(DDIR, file), buf);
      db.prepare('INSERT INTO manual_files_tmp(file, original, size, created_at) VALUES (?, ?, ?, ?)').run(file, original, buf.length, now());
      return json(res, 200, { file, size: buf.length, original }), true;
    }
    if ((m = p.match(/^\/manuals(?:\/(\d+))?$/)) && method === 'POST') {
      const b = await readJson(req);
      const tri = (v, max) => Object.fromEntries(LANGS.map((l) => [l, clean(v?.[l], max)]));
      const data = { title: tri(b.title, 160), text: tri(b.text, 1000), category: tri(b.category, 60) };
      if (!data.title.uz && !data.title.ru && !data.title.en) return json(res, 400, { error: 'title' }), true;
      const access = b.access === 'public' ? 'public' : 'users';
      const id = m[1] ? +m[1] : null;
      const prev = id ? db.prepare('SELECT * FROM manuals WHERE id = ?').get(id) : null;
      if (id && !prev) return json(res, 404, { error: 'not_found' }), true;
      let file = prev?.file || null, size = prev?.size || 0, original = prev?.original || '';
      if (b.file && b.file !== file) {
        const t = FILE_RE.test(b.file) && db.prepare('SELECT * FROM manual_files_tmp WHERE file = ?').get(b.file);
        if (!t) return json(res, 400, { error: 'file' }), true;
        if (file) try { fs.unlinkSync(path.join(DDIR, file)); } catch {}
        file = t.file; size = t.size; original = t.original;
        db.prepare('DELETE FROM manual_files_tmp WHERE file = ?').run(t.file);
      }
      if (!file) return json(res, 400, { error: 'file' }), true;
      const vals = [JSON.stringify(data), file, size, original, access, b.published ? 1 : 0, parseInt(b.sort, 10) || 0];
      let rid = id;
      if (id) db.prepare('UPDATE manuals SET data = ?, file = ?, size = ?, original = ?, access = ?, published = ?, sort = ? WHERE id = ?').run(...vals, id);
      else rid = Number(db.prepare('INSERT INTO manuals(data, file, size, original, access, published, sort, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(...vals, now()).lastInsertRowid);
      if (b.notify && b.published) notify({ data }).catch(() => {});
      return json(res, 200, { ok: true, id: rid }), true;
    }
    if ((m = p.match(/^\/manuals\/(\d+)$/)) && method === 'DELETE') {
      const r = db.prepare('SELECT file FROM manuals WHERE id = ?').get(+m[1]);
      if (r?.file) try { fs.unlinkSync(path.join(DDIR, r.file)); } catch {}
      db.prepare('DELETE FROM manuals WHERE id = ?').run(+m[1]);
      return json(res, 200, { ok: true }), true;
    }
    if ((m = p.match(/^\/manuals\/(\d+)\/file$/)) && method === 'GET') {
      // Admin uchun ko'rish (nashr qilinmagan bo'lsa ham)
      const r = db.prepare('SELECT * FROM manuals WHERE id = ?').get(+m[1]);
      if (!r || !FILE_RE.test(r.file || '')) return send(res, 404, ''), true;
      const ext = r.file.split('.').pop();
      res.writeHead(200, { 'Content-Type': MIME[ext], 'Content-Disposition': `${ext === 'pdf' ? 'inline' : 'attachment'}; filename="manual.${ext}"`, 'Cache-Control': 'no-store', 'Content-Security-Policy': "default-src 'none'; sandbox", 'X-Content-Type-Options': 'nosniff' });
      fs.createReadStream(path.join(DDIR, r.file)).pipe(res);
      return true;
    }
    return false;
  }

  // Saqlanmay qolgan yuklamalar (1 kundan eski) tozalanadi
  setInterval(() => {
    for (const t of db.prepare('SELECT file FROM manual_files_tmp WHERE created_at < ?').all(new Date(Date.now() - 864e5).toISOString())) {
      try { fs.unlinkSync(path.join(DDIR, t.file)); } catch {}
      db.prepare('DELETE FROM manual_files_tmp WHERE file = ?').run(t.file);
    }
  }, 3600e3).unref();

  return { forPage, serve, admin, list };
}
db.exec('CREATE TABLE IF NOT EXISTS manual_files_tmp (file TEXT PRIMARY KEY, original TEXT, size INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL);');
