// Mijoz baholari: ariza "bajarildi" bo'lgach sayt (ariza holati sahifasi), bot yoki Mini App orqali olinadi,
// admin tasdiqlagandan keyin bosh sahifada ko'rinadi.
import { db, now } from './db.mjs';
import { rateLimit, clean } from './security.mjs';
import { sendText } from './telegram.mjs';
import { esc } from '../src/template.mjs';

const CODE_RE = /^TX-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

export function createReviews(ctx) {
  const { json, readJson } = ctx;
  const byRequest = (rid) => db.prepare('SELECT * FROM reviews WHERE request_id = ?').get(rid);
  const canRate = (r) => Boolean(r && r.status === 'done' && !byRequest(r.id));

  function notifyAdmin(id) {
    const v = db.prepare('SELECT v.*, r.code FROM reviews v LEFT JOIN requests r ON r.id = v.request_id WHERE v.id = ?').get(id);
    if (!v) return;
    const kb = process.env.TELEGRAM_WEBHOOK_SECRET ? { reply_markup: { inline_keyboard: [[{ text: '✅ Saytda e’lon qilish', callback_data: `rvp:${v.id}` }]] } } : {};
    sendText(`⭐ <b>Yangi baho</b> ${esc(v.code || '')}\n${stars(v.rating)}${v.name ? ` · ${esc(v.name)}` : ''}${v.text ? `\n«${esc(v.text)}»` : ''}`, kb).catch(() => {});
  }
  function add({ request, rating, text = '', name = '', company = '', tgId = null, lang = 'uz', notify = true }) {
    rating = parseInt(rating, 10);
    if (!(rating >= 1 && rating <= 5) || !canRate(request)) return null;
    const id = Number(db.prepare('INSERT INTO reviews(request_id, tg_id, name, company, rating, text, lang, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(request.id, tgId, clean(name, 80), clean(company || request.company, 100), rating, clean(text, 600), lang, now()).lastInsertRowid);
    if (notify) notifyAdmin(id);
    return id;
  }
  const setText = (id, text) => db.prepare('UPDATE reviews SET text = ? WHERE id = ?').run(clean(text, 600), id);
  const publish = (id, on = true) => db.prepare('UPDATE reviews SET published = ? WHERE id = ?').run(on ? 1 : 0, id).changes > 0;
  const listPublic = (n = 6) => db.prepare("SELECT rating, text, name, company, lang, created_at FROM reviews WHERE published = 1 AND text != '' ORDER BY id DESC LIMIT ?").all(n);
  const summary = () => db.prepare('SELECT COUNT(*) n, ROUND(AVG(rating), 1) avg FROM reviews WHERE published = 1').get();

  // Sayt: ariza raqamini bilgan kishi (mijoz) bir marta baholaydi
  async function apiWeb(req, res, ip) {
    if (!rateLimit(`review:${ip}`, 10, 3600e3)) return json(res, 429, { error: 'rate' });
    const b = await readJson(req);
    const code = String(b.code || '').toUpperCase().trim();
    const r = CODE_RE.test(code) ? db.prepare('SELECT id, status, company, lang FROM requests WHERE code = ?').get(code) : null;
    if (!r) return json(res, 404, { error: 'not_found' });
    if (byRequest(r.id)) return json(res, 409, { error: 'done' });
    const id = add({ request: r, rating: b.rating, text: b.text, name: b.name, lang: r.lang });
    return id ? json(res, 201, { ok: true }) : json(res, 400, { error: 'validation' });
  }

  async function admin(req, res, p, method) {
    let m;
    if (p === '/reviews' && method === 'GET') { json(res, 200, db.prepare('SELECT v.*, r.code FROM reviews v LEFT JOIN requests r ON r.id = v.request_id ORDER BY v.id DESC LIMIT 300').all()); return true; }
    if ((m = p.match(/^\/reviews\/(\d+)$/)) && method === 'POST') { const b = await readJson(req); publish(+m[1], Boolean(b.published)); json(res, 200, { ok: true }); return true; }
    if ((m = p.match(/^\/reviews\/(\d+)$/)) && method === 'DELETE') { db.prepare('DELETE FROM reviews WHERE id = ?').run(+m[1]); json(res, 200, { ok: true }); return true; }
    return false;
  }

  return { add, setText, publish, listPublic, summary, canRate, byRequest, apiWeb, admin, notifyAdmin };
}
