// 3-bosqich sahifalari: xato kodlari ma'lumotnomasi, uskuna pasporti (QR), tijorat taklifi va dalolatnoma.
import { layout, esc, icon, url, pageHero, logo, aiFormFor, phoneLock } from './template.mjs';
import { fmt } from './i18n.mjs';
import { amountInWords } from './numwords.mjs';

const BRAND_NAME = { KUKA: 'KUKA', ABB: 'ABB', FANUC: 'FANUC', Yaskawa: 'Yaskawa', Siemens: 'Siemens', Danfoss: 'Danfoss', Delta: 'Delta', Inovance: 'Inovance' };
const crumbsLd = (items) => ({ '@type': 'BreadcrumbList', itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) });
const sevPill = (t, s) => `<span class="sev sev-${esc(s)}">${esc(t.errors.sev[s] || s)}</span>`;

/* ---------- Xato kodlari ro'yxati ---------- */
export function renderErrorsList(lang, t, cfg, list, { q = '', brand = '' } = {}, ver) {
  const e = t.errors;
  const brands = [...new Set(list.map((x) => x.brand))];
  const ql = q.toLowerCase();
  const shown = list.filter((x) => (!brand || x.brand === brand) && (!ql || `${x.code} ${x.brand} ${x.data.title?.[lang] || ''}`.toLowerCase().includes(ql)));
  const groups = brands.filter((b) => !brand || b === brand).map((b) => [b, shown.filter((x) => x.brand === b)]).filter(([, a]) => a.length);
  const base = url(lang, 'errors/');
  const body = `<main id="main">${pageHero(e.eyebrow, e.title, e.lead)}
  <section class="section section-tight"><div class="wrap">
    <form class="err-search err-search-lg" action="${base}" method="get" role="search" id="err-filter" data-empty="${esc(e.none)}">
      <label class="vh" for="err-q">${esc(e.search)}</label>${icon('search')}
      <input id="err-q" name="q" type="search" value="${esc(q)}" placeholder="${esc(e.search)}" autocomplete="off" spellcheck="false">
      ${brand ? `<input type="hidden" name="brand" value="${esc(brand)}">` : ''}
    </form>
    <nav class="brand-tabs" aria-label="${esc(e.title)}"><a href="${base}${q ? `?q=${encodeURIComponent(q)}` : ''}"${!brand ? ' aria-current="page"' : ''}>${esc(e.all)} <small>${list.length}</small></a>${brands.map((b) => `<a href="${base}?brand=${encodeURIComponent(b)}"${brand === b ? ' aria-current="page"' : ''}>${esc(b)} <small>${list.filter((x) => x.brand === b).length}</small></a>`).join('')}</nav>
    <div id="err-groups">${groups.map(([b, a]) => `<section class="err-group" data-brand="${esc(b)}"><h2>${esc(b)}</h2><ul class="err-list">${a.map((x) => `<li data-s="${esc(`${x.code} ${x.brand} ${x.data.title?.[lang] || ''}`.toLowerCase())}"><a href="${url(lang, `errors/${x.slug}/`)}"><code>${esc(x.code)}</code><span>${esc(x.data.title?.[lang] || '')}</span>${sevPill(t, x.severity)}</a></li>`).join('')}</ul></section>`).join('')}</div>
    <p class="err-none" id="err-none"${groups.length ? ' hidden' : ''}>${esc(e.none)} <a href="${url(lang, '')}#contact">${esc(e.ctaBtn)}</a></p>
  </div></section></main>`;
  const jsonLd = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', name: t.meta3.errorsTitle, url: cfg.domain + base, inLanguage: lang, about: { '@id': cfg.domain + '/#org' } },
    { '@type': 'ItemList', itemListElement: list.slice(0, 100).map((x, i) => ({ '@type': 'ListItem', position: i + 1, url: cfg.domain + url(lang, `errors/${x.slug}/`), name: `${x.brand} ${x.code}` })) },
    crumbsLd([[cfg.brand, cfg.domain + url(lang, '')], [e.title, cfg.domain + base]])
  ] };
  return layout({ lang, t, cfg, sub: 'errors/', title: t.meta3.errorsTitle, description: t.meta3.errorsDesc, keywords: `${brands.join(', ')}, error codes, коды ошибок, xato kodlari`, body, jsonLd, assetVer: ver, noindex: Boolean(q || brand) });
}

/* ---------- Bitta xato kodi ---------- */
export function renderErrorItem(lang, t, cfg, x, related, ver) {
  const e = t.errors;
  const d = x.data;
  const title = d.title?.[lang] || '';
  const causes = d.causes?.[lang] || [];
  const checks = d.checks?.[lang] || [];
  const note = d.note?.[lang] || '';
  const sub = `errors/${x.slug}/`;
  const home = url(lang, '');
  const prefill = `${home}?eq=${encodeURIComponent(`${x.brand} ${x.controller || ''}`.trim())}&code=${encodeURIComponent(x.code)}#contact`;
  const body = `<main id="main">
  ${pageHero(`${x.brand}${x.controller ? ` · ${x.controller}` : ''}`, `${x.code}: ${title}`, '', `<a class="crumb" href="${url(lang, 'errors/')}">${icon('back')}${esc(e.back)}</a>`)}
  <section class="section section-tight"><div class="wrap err-page">
    <article class="err-article">
      <p class="err-meta">${sevPill(t, x.severity)}${x.controller ? `<span>${esc(e.controller)}: ${esc(x.controller)}</span>` : ''}</p>
      <h2>${esc(e.causes)}</h2>
      <ul class="err-causes">${causes.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
      <h2>${esc(e.checks)}</h2>
      <ol class="err-checks">${checks.map((c) => `<li>${esc(c)}</li>`).join('')}</ol>
      ${note ? `<p class="err-note">${icon('alert')}<span><b>${esc(e.note)}:</b> ${esc(note)}</span></p>` : ''}
      <p class="err-disc">${esc(e.disclaimer)}</p>
    </article>
    <aside class="err-side">
      <div class="err-cta">
        <h2>${esc(e.ctaTitle)}</h2>
        <p>${esc(e.ctaText)}</p>
        <a class="btn btn-primary" href="${prefill}" data-ev="err_cta">${icon('camera')}${esc(e.ctaBtn)}</a>
        ${phoneLock(cfg, t, 'err_call', 'btn btn-ghost', prefill)}
      </div>
      ${related.length ? `<div class="err-rel"><h2>${esc(e.related)}</h2><ul>${related.map((r) => `<li><a href="${url(lang, `errors/${r.slug}/`)}"><code>${esc(r.code)}</code><span>${esc(r.data.title?.[lang] || '')}</span></a></li>`).join('')}</ul></div>` : ''}
    </aside>
  </div></section></main>`;
  const pageUrl = cfg.domain + url(lang, sub);
  const jsonLd = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'TechArticle', headline: `${x.brand} ${x.code}: ${title}`, inLanguage: lang, url: pageUrl, about: `${x.brand} ${x.controller || ''}`.trim(), author: { '@type': 'Person', name: cfg.engineerName }, publisher: { '@id': cfg.domain + '/#org' }, dateModified: (x.updated_at || '').slice(0, 10) || undefined },
    { '@type': 'FAQPage', mainEntity: [
      { '@type': 'Question', name: `${x.brand} ${x.code}?`, acceptedAnswer: { '@type': 'Answer', text: title } },
      { '@type': 'Question', name: `${e.causes} (${x.code})`, acceptedAnswer: { '@type': 'Answer', text: causes.join('; ') } },
      { '@type': 'Question', name: `${e.checks} (${x.code})`, acceptedAnswer: { '@type': 'Answer', text: checks.join(' ') } }
    ] },
    crumbsLd([[cfg.brand, cfg.domain + home], [e.title, cfg.domain + url(lang, 'errors/')], [`${x.brand} ${x.code}`, pageUrl]])
  ] };
  const desc = `${x.brand} ${x.code}: ${title}. ${causes.slice(0, 2).join('; ')}`.slice(0, 158);
  return layout({ lang, t, cfg, sub, title: fmt(t.meta3.errorTitle, { code: x.code, brandName: BRAND_NAME[x.brand] || x.brand }), description: desc, keywords: `${x.brand} ${x.code}, ${x.code}, ${x.brand} error ${x.code}, ошибка ${x.code}, ${x.code} xatosi`, body, jsonLd, assetVer: ver });
}

/* ---------- Uskuna pasporti (QR orqali ochiladi) ---------- */
export function renderEquipment(lang, t, cfg, eq, ver) {
  const q = t.eq;
  if (!eq) return layout({ lang, t, cfg, sub: '', title: `${q.notFound} | ${cfg.brand}`, description: q.notFound, body: `<main id="main">${pageHero(q.eyebrow, q.notFound, '')}</main>`, noindex: true, assetVer: ver });
  const name = [eq.brand, eq.model].filter(Boolean).join(' ');
  const today = new Date().toISOString().slice(0, 10);
  const facts = [[q.owner, eq.company], [q.kind, eq.kind], [q.serial, eq.serial], [q.location, eq.location], [q.year, eq.year]].filter(([, v]) => v);
  const next = eq.maintenance[0];
  const body = `<main id="main">
  ${pageHero(`${q.eyebrow} · ${eq.code}`, name || eq.code, '')}
  <section class="section section-tight"><div class="wrap eq-page">
    <div class="eq-info">
      <dl class="eq-facts">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      ${next ? `<div class="eq-next${next.next_due < today ? ' is-overdue' : ''}">${icon('clock')}<div><small>${esc(q.next)}</small><b>${esc(next.title)}</b><span>${esc(next.next_due)}${next.next_due < today ? ` · ${esc(q.overdue)}` : ''}</span></div></div>` : ''}
      <h2>${esc(q.history)}</h2>
      ${eq.events.length ? `<ol class="timeline eq-tl">${eq.events.map((ev) => `<li class="ev-${esc(ev.kind)}"><time>${esc(ev.at.slice(0, 10))}</time><strong>${esc(q.ev[ev.kind] || ev.kind)}</strong>${ev.text ? `<p>${esc(ev.text)}</p>` : ''}</li>`).join('')}</ol>` : `<p class="muted">${esc(q.noHistory)}</p>`}
    </div>
    <div class="eq-report">
      <h2>${esc(q.report)}</h2>
      <p class="sec-lead">${esc(q.reportLead)}</p>
      ${cfg.botUsername ? `<a class="tg-card" href="https://t.me/${esc(cfg.botUsername)}?start=eq_${esc(eq.code)}" target="_blank" rel="noopener noreferrer" data-ev="eq_tg">${icon('send')}<span><b>${esc(q.tg)}</b><small>@${esc(cfg.botUsername)}</small></span>${icon('arrow')}</a>` : ''}
      ${aiFormFor(t, cfg, { equipmentCode: eq.code, equipment: [name, eq.serial ? `S/N ${eq.serial}` : '', eq.location].filter(Boolean).join(' · '), company: eq.company })}
    </div>
  </div></section></main>`;
  return layout({ lang, t, cfg, sub: `e/${eq.code}/`, title: `${name} · ${eq.code} | ${cfg.brand}`, description: q.eyebrow, body, noindex: true, assetVer: ver });
}

/* ---------- Tijorat taklifi / dalolatnoma ---------- */
const money = (n, cur) => `${Number(n || 0).toLocaleString('ru-RU', { maximumFractionDigits: 2 }).replace(/ /g, ' ')} ${cur}`;
export function docTotals(d) {
  const items = d.items || [];
  const subtotal = items.reduce((a, i) => a + (Number(i.qty) || 0) * (Number(i.price) || 0), 0);
  const discount = d.discount ? Math.round(subtotal * Number(d.discount)) / 100 : 0;
  const base = subtotal - discount;
  const vat = d.vat ? Math.round(base * Number(d.vat)) / 100 : 0;
  return { subtotal, discount, vat, total: base + vat };
}
const DOC_TITLE = { quote: 'quote', invoice: 'invoice', act: 'act', report: 'report' };
export function renderDoc(t, cfg, doc, ver) {
  const lang = doc?.lang || 'uz';
  const k = t.doc;
  if (!doc) return layout({ lang, t, cfg, sub: '', title: k.notFound, description: k.notFound, body: `<main id="main">${pageHero('', k.notFound, '')}</main>`, noindex: true, assetVer: ver });
  const d = doc.data;
  const cur = d.currency || 'UZS';
  const tot = docTotals(d);
  const kind = DOC_TITLE[doc.kind] ? doc.kind : 'quote';
  const isQuote = kind === 'quote';
  const title = k[DOC_TITLE[kind]];
  const date = d.date || doc.created_at.slice(0, 10);
  const realMail = cfg.email && !/@example\./i.test(cfg.email);
  const req = [cfg.company_legal || cfg.brand, cfg.company_address, cfg.company_inn ? `STIR/INN ${cfg.company_inn}` : '', cfg.company_bank, cfg.company_account ? `h/r ${cfg.company_account}` : '', cfg.company_mfo ? `MFO ${cfg.company_mfo}` : '', cfg.phone, realMail ? cfg.email : ''].filter(Boolean);
  const rp = d.report || {};
  const block = (h, v) => v ? `<div class="doc-notes"><h2>${esc(h)}</h2><p>${esc(v)}</p></div>` : '';
  const meta = [
    [k.no, doc.number], [k.date, date], doc.request_code ? [k.request, doc.request_code] : null,
    d.contract ? [k.contract, d.contract] : null, d.ref ? [k.ref, d.ref] : null
  ].filter(Boolean);
  const hasItems = (d.items || []).length > 0;
  const table = hasItems ? `
      ${kind === 'report' ? `<h2 class="doc-h">${esc(k.parts)}</h2>` : ''}
      <div class="doc-scroll"><table class="doc-table">
        <thead><tr><th>#</th><th>${esc(k.item)}</th><th>${esc(k.qty)}</th><th>${esc(k.unit)}</th><th>${esc(k.price)}</th><th>${esc(k.sum)}</th></tr></thead>
        <tbody>${d.items.map((i, n) => `<tr><td>${n + 1}</td><td>${esc(i.name)}</td><td>${esc(i.qty)}</td><td>${esc(i.unit || '')}</td><td>${esc(money(i.price, ''))}</td><td>${esc(money((Number(i.qty) || 0) * (Number(i.price) || 0), ''))}</td></tr>`).join('')}</tbody>
        <tfoot>
          <tr><td colspan="5">${esc(k.subtotal)}</td><td>${esc(money(tot.subtotal, cur))}</td></tr>
          ${tot.discount ? `<tr><td colspan="5">${esc(k.discount)} ${esc(d.discount)}%</td><td>−${esc(money(tot.discount, cur))}</td></tr>` : ''}
          ${d.vat ? `<tr><td colspan="5">${esc(k.vat)} ${esc(d.vat)}%</td><td>${esc(money(tot.vat, cur))}</td></tr>` : ''}
          <tr class="doc-total"><td colspan="5">${esc(k.total)}</td><td>${esc(money(tot.total, cur))}</td></tr>
        </tfoot>
      </table></div>
      <p class="doc-words"><span>${esc(k.inWords)}:</span> ${esc(amountInWords(tot.total, cur, lang))}</p>` : '';
  const sigImg = (src, cls) => src ? `<img class="${cls}" src="${esc(src)}" alt="">` : '';
  const custSign = kind === 'act' || kind === 'report' || doc.status === 'accepted';
  const body = `<main id="main" class="doc-main"><section class="section section-tight"><div class="wrap">
    <div class="doc-tools">
      <button type="button" class="btn btn-ghost" data-print>${icon('print')}${esc(k.print)}</button>
      ${isQuote && doc.status !== 'accepted' ? `<button type="button" class="btn btn-primary" id="doc-accept" data-token="${esc(doc.token)}" data-ok="${esc(k.accepted)}">${icon('check')}${esc(k.accept)}</button>` : ''}
      ${isQuote && doc.status === 'accepted' ? `<p class="doc-ok">${icon('check')}${esc(k.accepted)}</p>` : ''}
    </div>
    <article class="doc-sheet doc-${kind}">
      <header class="doc-head">
        <div class="doc-brand">${logo}<div><strong>${esc(cfg.company_legal || cfg.brand)}</strong><small>${esc(req.slice(1).join(' · '))}</small></div></div>
        <div class="doc-no"><h1>${esc(title)}</h1>${meta.map(([a, b]) => `<p>${esc(a)}${a === k.no ? '' : ':'} ${esc(b)}</p>`).join('')}</div>
      </header>
      <dl class="doc-parties"><div><dt>${esc(k.executor)}</dt><dd>${esc(cfg.company_legal || cfg.brand)}</dd></div><div><dt>${esc(k.customer)}</dt><dd>${esc(d.customer || '—')}</dd></div>${d.equipment ? `<div><dt>${esc(k.equipment)}</dt><dd>${esc(d.equipment)}</dd></div>` : ''}${d.engineer ? `<div><dt>${esc(k.engineer)}</dt><dd>${esc(d.engineer)}</dd></div>` : ''}</dl>
      ${kind === 'act' ? `<p class="doc-acttext">${esc(k.actText)}</p>` : ''}
      ${kind === 'invoice' ? `<p class="doc-acttext">${esc(k.invoiceText)}</p>` : ''}
      ${kind === 'report' ? `${block(k.symptom, rp.symptom)}${block(k.cause, rp.cause)}${block(k.work, rp.work)}` : ''}
      ${table}
      ${kind === 'report' ? `${block(k.recommend, rp.recommend)}${rp.next_date ? `<p class="doc-valid"><b>${esc(k.nextDate)}:</b> ${esc(rp.next_date)}</p>` : ''}` : ''}
      ${isQuote && d.valid_days ? `<p class="doc-valid"><b>${esc(k.valid)}:</b> ${esc(d.valid_days)} ${esc(k.days)}</p>` : ''}
      ${kind === 'invoice' && d.due_days ? `<p class="doc-valid"><b>${esc(k.due)}:</b> ${esc(fmt(k.dueText, { n: d.due_days }))}</p>` : ''}
      ${d.notes ? block(k.notes, d.notes) : ''}
      <div class="doc-req"><h2>${esc(k.requisites)}</h2><p>${req.map(esc).join('<br>')}</p></div>
      <div class="doc-sign">
        <div><span class="doc-sigline">${sigImg(cfg.docSign, 'doc-sigimg')}${sigImg(cfg.docStamp, 'doc-stamp')}</span><small>${esc(k.signExec)}${cfg.docStamp ? '' : ` · ${esc(k.stamp)}`}</small></div>
        ${custSign ? `<div><span class="doc-sigline"></span><small>${esc(k.signCust)} · ${esc(k.stamp)}</small></div>` : ''}
      </div>
    </article>
  </div></section></main>`;
  return layout({ lang, t, cfg, sub: '', title: `${title} ${doc.number} | ${cfg.brand}`, description: title, body, noindex: true, assetVer: ver, bodyClass: 'is-doc' });
}
