// 16-bosqich: Ustalar (rasm, tajriba, bajargan ishlari) va sayt/xizmatni baholash formasi
import { db, now, J } from './db.mjs';
import { rateLimit, clean } from './security.mjs';
import { sendText } from './telegram.mjs';
import { esc } from '../src/template.mjs';
import { LANGS } from '../src/i18n.mjs';

db.exec(`
CREATE TABLE IF NOT EXISTS team (id INTEGER PRIMARY KEY, sort INTEGER NOT NULL DEFAULT 0, name TEXT NOT NULL, photo TEXT, years INTEGER, skills TEXT NOT NULL DEFAULT '', data TEXT NOT NULL DEFAULT '{}', published INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS feedback (id INTEGER PRIMARY KEY, site INTEGER, service INTEGER, text TEXT, name TEXT, lang TEXT, published INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL);
`);

const tri = (v, n) => Object.fromEntries(LANGS.map((l) => [l, clean(v?.[l], n)]));
const row = (r) => r && { ...r, data: J(r.data, {}), skills: r.skills ? r.skills.split(',').map((x) => x.trim()).filter(Boolean) : [] };

export function listTeam(all = false) {
  return db.prepare(`SELECT * FROM team ${all ? '' : 'WHERE published = 1'} ORDER BY sort, id`).all().map(row);
}

export function feedbackSummary() {
  return db.prepare('SELECT COUNT(site) ns, ROUND(AVG(site), 1) site, COUNT(service) nv, ROUND(AVG(service), 1) service FROM feedback').get();
}
export const listFeedbackPublic = (n = 6) => db.prepare("SELECT service rating, text, name, lang, created_at FROM feedback WHERE published = 1 AND text != '' ORDER BY id DESC LIMIT ?").all(n);

export function createTeam(ctx) {
  const { json, readJson } = ctx;

  async function apiFeedback(req, res, ip) {
    if (!rateLimit(`fb:${ip}`, 5, 3600e3)) return json(res, 429, { error: 'rate' });
    const b = await readJson(req);
    const r = (v) => { const n = parseInt(v, 10); return n >= 1 && n <= 5 ? n : null; };
    const site = r(b.site), service = r(b.service);
    if (!site && !service) return json(res, 400, { error: 'validation' });
    const lang = LANGS.includes(b.lang) ? b.lang : 'uz';
    const text = clean(b.text, 600), name = clean(b.name, 80);
    db.prepare('INSERT INTO feedback(site, service, text, name, lang, created_at) VALUES (?,?,?,?,?,?)').run(site, service, text, name, lang, now());
    const st = (n) => (n ? '★'.repeat(n) + '☆'.repeat(5 - n) : '—');
    sendText(`📝 <b>Saytdan baho</b>\nSayt: ${st(site)}\nXizmat: ${st(service)}${name ? `\n${esc(name)}` : ''}${text ? `\n«${esc(text)}»` : ''}`).catch(() => {});
    return json(res, 201, { ok: true });
  }

  async function admin(req, res, p, method) {
    let m;
    if (p === '/team' && method === 'GET') { json(res, 200, listTeam(true)); return true; }
    if ((m = p.match(/^\/team(?:\/(\d+))?$/)) && method === 'POST') {
      const b = await readJson(req, 64 * 1024);
      const name = clean(b.name, 80);
      if (!name) { json(res, 400, { error: 'name' }); return true; }
      const photo = /^[A-Za-z0-9_-]{16}\.(jpg|png|webp)$/.test(b.photo || '') ? b.photo : '';
      const years = Math.min(Math.max(parseInt(b.years, 10) || 0, 0), 60) || null;
      const skills = String(b.skills || '').split(',').map((x) => clean(x, 40)).filter(Boolean).slice(0, 20).join(', ');
      const data = { role: tri(b.role, 80), bio: tri(b.bio, 1200), works: tri(b.works, 2000), certs: tri(b.certs, 1000) };
      const sort = parseInt(b.sort, 10) || 0;
      const pub = b.published === false || b.published === 0 ? 0 : 1;
      if (m[1]) {
        db.prepare('UPDATE team SET sort=?, name=?, photo=?, years=?, skills=?, data=?, published=?, updated_at=? WHERE id = ?').run(sort, name, photo, years, skills, JSON.stringify(data), pub, now(), +m[1]);
        json(res, 200, { ok: true, id: +m[1] });
      } else {
        const id = Number(db.prepare('INSERT INTO team(sort, name, photo, years, skills, data, published, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?)').run(sort, name, photo, years, skills, JSON.stringify(data), pub, now(), now()).lastInsertRowid);
        json(res, 201, { ok: true, id });
      }
      return true;
    }
    if ((m = p.match(/^\/team\/(\d+)$/)) && method === 'DELETE') { db.prepare('DELETE FROM team WHERE id = ?').run(+m[1]); json(res, 200, { ok: true }); return true; }
    if (p === '/feedback' && method === 'GET') { json(res, 200, { rows: db.prepare('SELECT * FROM feedback ORDER BY id DESC LIMIT 300').all(), summary: feedbackSummary() }); return true; }
    if ((m = p.match(/^\/feedback\/(\d+)$/)) && method === 'POST') { const b = await readJson(req); db.prepare('UPDATE feedback SET published = ? WHERE id = ?').run(b.published ? 1 : 0, +m[1]); json(res, 200, { ok: true }); return true; }
    if ((m = p.match(/^\/feedback\/(\d+)$/)) && method === 'DELETE') { db.prepare('DELETE FROM feedback WHERE id = ?').run(+m[1]); json(res, 200, { ok: true }); return true; }
    return false;
  }

  return { apiFeedback, admin };
}
