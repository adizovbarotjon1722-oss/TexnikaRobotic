// Kafolat: ariza "bajarildi" bo'lgan kundan {warrantyMonths} oy. Ariza raqami bo'yicha sayt, bot va Mini App tekshiradi.
import { db } from './db.mjs';
import { rateLimit } from './security.mjs';

const CODE_RE = /^TX-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
const DAY = 86400e3;

export function addMonths(iso, n) {
  const d = new Date(String(iso).slice(0, 10) + 'T00:00:00Z');
  const day = d.getUTCDate();
  d.setUTCDate(1); d.setUTCMonth(d.getUTCMonth() + n);
  const last = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(day, last));
  return d.toISOString().slice(0, 10);
}

export function createWarranty(ctx) {
  const months = () => Math.min(Math.max(parseInt(ctx.cfg().warrantyMonths, 10) || 3, 1), 60);
  // Ish yakunlangan sana: oxirgi "done" yangilanishi (bo'lmasa ariza yangilangan sana)
  function info(code) {
    code = String(code || '').toUpperCase().trim();
    if (!CODE_RE.test(code)) return null;
    const r = db.prepare('SELECT id, code, status, updated_at, equipment FROM requests WHERE code = ?').get(code);
    if (!r) return null;
    if (r.status !== 'done') return { code, status: 'not_done', months: months() };
    const u = db.prepare("SELECT MAX(created_at) d FROM request_updates WHERE request_id = ? AND status = 'done'").get(r.id);
    const doneAt = String(u?.d || r.updated_at).slice(0, 10);
    const until = addMonths(doneAt, months());
    const today = new Date().toISOString().slice(0, 10);
    const days = Math.round((Date.parse(until) - Date.parse(today)) / DAY);
    return { code, status: days >= 0 ? 'active' : 'expired', done_at: doneAt, until, days: Math.max(days, 0), months: months(), equipment: r.equipment || '' };
  }
  function api(req, res, ip, code) {
    if (!rateLimit(`warranty:${ip}`, 30, 600e3)) return ctx.json(res, 429, { error: 'rate' });
    const w = info(code);
    return w ? ctx.json(res, 200, w) : ctx.json(res, 404, { error: 'not_found' });
  }
  return { info, api, months };
}
