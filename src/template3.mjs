// 4-bosqich sahifalari: korxona rahbari uchun jamoa natijalari.
import { layout, esc, icon, url, pageHero } from './template.mjs';
import { fmt } from './i18n.mjs';

export function renderTeam(lang, t, cfg, d, ver) {
  const a = t.academy2;
  const cell = (x) => {
    if (x.cert && !x.cert.expired) return `<td class="tm-ok"><a href="${url(lang, `academy/cert/${esc(x.cert.cert_id)}/`)}">${icon('check')}${esc(x.cert.score)}%</a><small>${esc(a.validUntil)} ${esc(x.cert.valid_until || '')}</small></td>`;
    if (x.cert?.expired) return `<td class="tm-exp">${esc(a.expired)}</td>`;
    if (!x.done) return `<td class="tm-none">${esc(a.notStarted)}</td>`;
    return `<td><progress class="tm-bar" max="100" value="${Number(x.pct) || 0}"></progress><small>${esc(x.pct)}%</small></td>`;
  };
  const passed = d.rows.reduce((n, r) => n + r.cells.filter((x) => x.cert && !x.cert.expired).length, 0);
  const body = `<main id="main">${pageHero(a.team, d.company, a.teamLead)}
  <section class="section section-tight"><div class="wrap">
    <div class="tm-kpis"><div><b>${d.rows.length}<small>/${esc(d.seats)}</small></b><span>${esc(a.employee)}</span></div><div><b>${passed}</b><span>${esc(t.academy.cert)}</span></div><div><b><code>${esc(d.code)}</code></b><span>${esc(t.academy.code)}</span></div></div>
    <div class="tm-wrap"><table class="tm">
      <thead><tr><th scope="col">${esc(a.employee)}</th>${d.courses.map((c) => `<th scope="col">${esc(c.data.title?.[lang] || c.slug)}</th>`).join('')}<th scope="col">${esc(a.lastActive)}</th></tr></thead>
      <tbody>${d.rows.length ? d.rows.map((r) => `<tr><th scope="row">${esc(r.name)}</th>${r.cells.map(cell).join('')}<td class="tm-date">${esc(r.last)}</td></tr>`).join('') : `<tr><td colspan="${d.courses.length + 2}" class="tm-none">${esc(a.notStarted)}</td></tr>`}</tbody>
    </table></div>
    <p class="tm-actions"><a class="btn btn-ghost" href="${esc(d.csvHref)}" download>${icon('doc')}${esc(a.csv)}</a> <button type="button" class="btn btn-ghost" data-print>${icon('print')}${esc(t.doc?.print || 'Print')}</button></p>
  </div></section></main>`;
  return layout({ lang, t, cfg, sub: 'academy/', title: `${a.team}: ${d.company} | ${cfg.brand}`, description: a.teamLead, body, noindex: true, assetVer: ver, bodyClass: 'is-team' });
}

export const lockedLabel = (t, title) => fmt(t.academy2.lockedShort, { course: title });
