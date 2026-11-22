// O'z analitikamiz: cookie yo'q, IP saqlanmaydi. Tashrifchi = kunlik tuz + IP + brauzer xeshi (ertasi kuni bog'lab bo'lmaydi).
import crypto from 'crypto';
import { db, now, getSetting, setSetting, J } from './db.mjs';

const BOT = /bot|crawl|spider|slurp|facebookexternalhit|headless|preview|monitor|curl|wget|python|axios|go-http/i;
const today = () => new Date().toISOString().slice(0, 10);

function daySalt(day) {
  const k = `salt_${day}`;
  let s = getSetting(k);
  if (!s) { s = crypto.randomBytes(16).toString('hex'); setSetting(k, s); db.prepare("DELETE FROM settings WHERE key LIKE 'salt_%' AND key < ?").run(`salt_${day}`); }
  return s;
}

const device = (ua) => (/ipad|tablet/i.test(ua) ? 'tablet' : /mobi|android|iphone/i.test(ua) ? 'mobile' : 'desktop');

const ALLOWED = new Set(['pv', 'cta']);
export function track(type, { path, lang, ref, meta }, ip, ua) {
  if (BOT.test(ua || '')) return;
  if (!ALLOWED.has(type)) return;
  const day = today();
  const visitor = crypto.createHash('sha256').update(`${daySalt(day)}|${ip}|${ua}`).digest('hex').slice(0, 16);
  let refHost = '';
  try { refHost = ref ? new URL(ref).hostname.replace(/^www\./, '') : ''; } catch { /* yaroqsiz referer */ }
  db.prepare('INSERT INTO events(ts, day, type, path, lang, ref, device, visitor, meta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
    now(), day, type, String(path || '').slice(0, 120), ['uz', 'ru', 'en'].includes(lang) ? lang : '', refHost.slice(0, 80), device(ua || ''), visitor, meta ? String(meta).slice(0, 60) : null
  );
}

export function stats(days = 30) {
  days = Math.min(Math.max(parseInt(days, 10) || 30, 1), 365);
  const since = new Date(Date.now() - (days - 1) * 864e5).toISOString().slice(0, 10);
  const q = (sql, ...a) => db.prepare(sql).all(since, ...a);
  const one = (sql, ...a) => db.prepare(sql).get(since, ...a);

  const daily = new Map();
  for (let i = 0; i < days; i++) { const d = new Date(Date.parse(since) + i * 864e5).toISOString().slice(0, 10); daily.set(d, { day: d, visitors: 0, pageviews: 0, requests: 0 }); }
  for (const r of q("SELECT day, COUNT(DISTINCT visitor) v, COUNT(*) pv FROM events WHERE day >= ? AND type='pv' GROUP BY day")) { const o = daily.get(r.day); if (o) { o.visitors = r.v; o.pageviews = r.pv; } }
  for (const r of q("SELECT substr(created_at,1,10) day, COUNT(*) n FROM requests WHERE substr(created_at,1,10) >= ? GROUP BY day")) { const o = daily.get(r.day); if (o) o.requests = r.n; }

  const tot = one("SELECT COUNT(DISTINCT day||visitor) v, COUNT(*) pv FROM events WHERE day >= ? AND type='pv'");
  const reqTot = one('SELECT COUNT(*) n, SUM(ai IS NOT NULL) ai FROM requests WHERE substr(created_at,1,10) >= ?');
  const prevSince = new Date(Date.parse(since) - days * 864e5).toISOString().slice(0, 10);
  const prev = db.prepare("SELECT COUNT(DISTINCT day||visitor) v FROM events WHERE day >= ? AND day < ? AND type='pv'").get(prevSince, since);
  const prevReq = db.prepare('SELECT COUNT(*) n FROM requests WHERE substr(created_at,1,10) >= ? AND substr(created_at,1,10) < ?').get(prevSince, since);

  return {
    days,
    totals: {
      visitors: tot.v, pageviews: tot.pv, requests: reqTot.n, aiRequests: reqTot.ai || 0,
      conversion: tot.v ? +(reqTot.n / tot.v * 100).toFixed(1) : 0,
      prevVisitors: prev.v, prevRequests: prevReq.n,
      open: db.prepare("SELECT COUNT(*) n FROM requests WHERE status NOT IN ('done','cancelled')").get().n,
      critical: db.prepare("SELECT COUNT(*) n FROM requests WHERE priority='critical' AND status NOT IN ('done','cancelled')").get().n,
      today: db.prepare("SELECT COUNT(DISTINCT visitor) v FROM events WHERE day = ? AND type='pv'").get(today()).v
    },
    daily: [...daily.values()],
    pages: q("SELECT path k, COUNT(*) n FROM events WHERE day >= ? AND type='pv' GROUP BY path ORDER BY n DESC LIMIT 10"),
    langs: q("SELECT lang k, COUNT(DISTINCT day||visitor) n FROM events WHERE day >= ? AND type='pv' GROUP BY lang ORDER BY n DESC"),
    refs: q("SELECT CASE WHEN ref='' THEN '(to‘g‘ridan-to‘g‘ri)' ELSE ref END k, COUNT(DISTINCT day||visitor) n FROM events WHERE day >= ? AND type='pv' GROUP BY k ORDER BY n DESC LIMIT 8"),
    devices: q("SELECT device k, COUNT(DISTINCT day||visitor) n FROM events WHERE day >= ? AND type='pv' GROUP BY device ORDER BY n DESC"),
    ctas: q("SELECT meta k, COUNT(*) n FROM events WHERE day >= ? AND type='cta' GROUP BY meta ORDER BY n DESC LIMIT 10"),
    reqStatus: q('SELECT status k, COUNT(*) n FROM requests WHERE substr(created_at,1,10) >= ? GROUP BY status ORDER BY n DESC'),
    reqPriority: q('SELECT priority k, COUNT(*) n FROM requests WHERE substr(created_at,1,10) >= ? GROUP BY priority'),
    reqService: q("SELECT CASE WHEN service='' OR service IS NULL THEN '—' ELSE service END k, COUNT(*) n FROM requests WHERE substr(created_at,1,10) >= ? GROUP BY k ORDER BY n DESC LIMIT 8"),
    academy: {
      learners: db.prepare('SELECT COUNT(*) n FROM learners').get().n,
      passed: db.prepare('SELECT COUNT(*) n FROM quiz_results WHERE passed = 1').get().n,
      attempts: db.prepare('SELECT COUNT(*) n FROM quiz_results').get().n
    },
    recent: db.prepare('SELECT id, code, created_at, name, equipment, status, priority FROM requests ORDER BY id DESC LIMIT 6').all()
  };
}
export { J };
