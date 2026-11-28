// 16-bosqich: aniq maqsadli bosh sahifa (7 blok), Ustalar, Robot servisi, Elektron hujjatlar, baholash
import { layout, esc, icon, url, secHead, aiFormFor, portfolioCard, heroVideo, pageHero, telHref, tgUser, LANGS } from './template.mjs';
import { homeMonitoring } from './template7.mjs';
import { fmt } from './i18n.mjs';

const CAT_HREF = { plc: 'plc/', robots: 'robots/', to: 'services/equipment-maintenance/', training: 'academy/', mon: 'monitoring/', docs: 'documents/' };
export function callbackForm(cb, lang, service = '') {
  return `<form class="cb-form" id="cb-form" novalidate data-lang="${lang}"${service ? ` data-service="${esc(service)}"` : ''} data-ok="${esc(cb.ok)}" data-err="${esc(cb.err)}" data-err-phone="${esc(cb.errPhone)}">
    <h2 class="cb-title">${esc(cb.title)}</h2><p class="cb-lead">${esc(cb.lead)}</p>
    <div class="cb-row"><label class="vh" for="cb-phone">${esc(cb.phone)}</label><input id="cb-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="20" placeholder="+998 __ ___ __ __" required>
      <button class="btn btn-primary" type="submit">${esc(cb.send)}</button></div>
    <label class="cb-urgent"><input type="checkbox" name="urgent"> <span>${esc(cb.urgent)}</span></label>
    <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
    <p class="cb-note">${esc(cb.consent)}</p>
    <p class="cb-msg" role="status" aria-live="polite"></p>
  </form>`;
}
const DIR_HREF = { training: 'academy/', mon: 'monitoring/', robots: 'robots/', docs: 'documents/' };
const initials = (n) => String(n || '').split(/\s+/).filter(Boolean).slice(0, 2).map((x) => x[0]).join('').toUpperCase();
const lines = (s) => String(s || '').split('\n').map((x) => x.trim()).filter(Boolean);

function starsInput(name, label, hint) {
  const opts = [5, 4, 3, 2, 1].map((n) => `<input type="radio" id="${name}-${n}" name="${name}" value="${n}"><label for="${name}-${n}" title="${n}">${icon('star', 'ic st-ic')}<span class="vh">${n}</span></label>`).join('');
  return `<fieldset class="rate-row"><legend>${esc(label)}${hint ? `<small>${esc(hint)}</small>` : ''}</legend><div class="stars-in">${opts}</div></fieldset>`;
}
const starsShow = (v) => `<span class="stars-show" aria-hidden="true">${[1, 2, 3, 4, 5].map((n) => `<i class="${v >= n - 0.25 ? 'on' : v >= n - 0.75 ? 'half' : ''}"></i>`).join('')}</span>`;

export function memberCard(t, lang, m, full = false) {
  const q = t.v2.team;
  const d = m.data || {};
  const photo = m.photo ? `<img src="/media/${esc(m.photo)}" alt="${esc(m.name)}" loading="lazy" width="480" height="560">` : `<span class="tm-mono" aria-hidden="true">${esc(initials(m.name))}</span>`;
  const works = lines(d.works?.[lang] || d.works?.uz);
  const certs = lines(d.certs?.[lang] || d.certs?.uz);
  return `<li class="tm-card reveal">
    <div class="tm-photo">${photo}${m.years ? `<span class="tm-years"><b>${esc(m.years)}</b> ${esc(q.years)}</span>` : ''}</div>
    <div class="tm-body">
      <h3>${esc(m.name)}</h3>
      ${d.role?.[lang] || d.role?.uz ? `<p class="tm-role">${esc(d.role[lang] || d.role.uz)}</p>` : ''}
      ${m.skills.length ? `<ul class="tm-skills" aria-label="${esc(q.skills)}">${m.skills.slice(0, full ? 20 : 6).map((s) => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
      ${full && (d.bio?.[lang] || d.bio?.uz) ? `<p class="tm-bio">${esc(d.bio[lang] || d.bio.uz)}</p>` : ''}
      ${full && works.length ? `<h4>${esc(q.works)}</h4><ul class="tm-list">${works.map((x) => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul>` : ''}
      ${full && certs.length ? `<h4>${esc(q.certs)}</h4><ul class="tm-list">${certs.map((x) => `<li>${icon('shield')}${esc(x)}</li>`).join('')}</ul>` : ''}
    </div>
  </li>`;
}

function rateBlock(t, lang) {
  const r = t.v2.trust;
  return `<form class="rate-form" id="rate-form" novalidate data-lang="${lang}" data-thanks="${esc(r.thanks)}" data-err="${esc(r.err)}" data-need="${esc(r.need)}">
    <h3>${esc(r.rateTitle)}</h3><p class="muted">${esc(r.rateLead)}</p>
    ${starsInput('site', r.site)}${starsInput('service', r.service, r.serviceHint)}
    <div class="field"><label for="rf-text">${esc(r.text)}</label><textarea id="rf-text" name="text" rows="3" maxlength="600"></textarea></div>
    <div class="field"><label for="rf-name">${esc(r.name)}</label><input id="rf-name" name="name" type="text" maxlength="80" autocomplete="name"></div>
    <button class="btn btn-primary" type="submit">${esc(r.send)}</button>
    <p class="rate-msg" role="status" aria-live="polite"></p>
  </form>`;
}

// "Sayt nima uchun kerak": kimga, qanday foyda, bepul vositalar, odatiy usul bilan solishtirish
export function whyBlock(t, lang, cfg) {
  const w = t.why;
  if (!w) return '';
  const href = (h) => (h.startsWith('#') ? h : url(lang, h));
  return `<section class="section wy" id="why" aria-labelledby="wy-title"><div class="wrap">
    ${secHead(w.eyebrow, w.title, w.lead, 'wy-title')}
    <h3 class="wy-sub">${esc(w.forTitle)}</h3>
    <ul class="wy-roles">${w.roles.map((r, i) => `<li class="wy-role reveal">
      <div class="wy-role-top"><span class="wy-ic">${icon(r.icon)}</span><span class="wy-n mono">${String(i + 1).padStart(2, '0')}</span></div>
      <h4>${esc(r.role)}</h4>
      <p class="wy-pain"><span class="mono">${icon('alert')}</span>${esc(r.pain)}</p>
      <p class="wy-gain"><span class="mono">${icon('check')}</span>${esc(r.gain)}</p>
      <a class="link-arrow" href="${href(r.href)}">${esc(r.link)}${icon('arrow')}</a>
    </li>`).join('')}</ul>
    <div class="wy-grid">
      <div class="wy-tools-wrap">
        <h3 class="wy-sub">${esc(w.toolsTitle)}</h3><p class="wy-note">${esc(w.toolsLead)}</p>
        <ul class="wy-tools">${w.tools.map((x) => `<li><a class="wy-tool reveal" href="${href(x.href)}"><span class="wy-ic">${icon(x.icon)}</span><span class="wy-tool-t"><b>${esc(x.name)}</b><small>${esc(x.text)}</small></span>${icon('arrow', 'ic wy-go')}</a></li>`).join('')}</ul>
      </div>
      <div class="wy-cmp-wrap">
        <h3 class="wy-sub">${esc(w.cmpTitle)}</h3>
        <div class="wy-cmp" role="table" aria-label="${esc(w.cmpTitle)}">
          <div class="wy-row wy-head" role="row">${w.cmpHead.map((x, i) => `<span role="columnheader"${i === 2 ? ' class="wy-us"' : ''}>${esc(x)}</span>`).join('')}</div>
          ${w.cmp.map(([k, a, b]) => `<div class="wy-row" role="row"><span role="rowheader" class="wy-k">${esc(k)}</span><span role="cell" class="wy-old">${esc(a)}</span><span role="cell" class="wy-us">${icon('check')}${esc(b)}</span></div>`).join('')}
        </div>
        <div class="cta-row wy-cta"><a class="btn btn-primary" href="#contact" data-ev="cta_why">${esc(w.cta)}${icon('arrow')}</a>${cfg.phoneOpen ? `<a class="btn btn-ghost" href="${telHref(cfg.phone)}" data-ev="call_why">${icon('phone')}<span>${esc(cfg.phone)}</span></a>` : ''}</div>
      </div>
    </div>
  </div></section>`;
}

export function home2(t, lang, cfg, data) {
  const v = t.v2;
  const hid = new Set(cfg.hiddenSections || []);
  const on = (k) => !hid.has(k);
  const team = (data.team || []).slice(0, 4);
  const pf = (data.portfolio || []).filter((p) => !p.sample).slice(0, 3);
  const fb = data.feedback || {};
  const rs = data.reviewSummary || {};
  const quotes = [...(data.reviews || []), ...(data.feedbackPublic || [])].slice(0, 3);
  const r = v.trust;
  const v3 = t.v3, h = v3.hero, c = v3.cat, tg = tgUser(cfg);
  return `<main id="main" class="v2">
  <section class="hx hx3" aria-labelledby="hero-title">
    <div class="hx-bg" aria-hidden="true"></div>
    <div class="wrap hx-in">
      <div class="hx-copy">
        <h1 id="hero-title"><span class="h1k">${esc(h.h1k)}</span> <span class="h1a">${esc(h.h1)}</span></h1>
        <p class="lead">${esc(h.lead)}</p>
        <div class="cta-row">
          <a class="btn btn-primary btn-lg" href="#contact" data-ev="cta_hero">${esc(h.order)}${icon('arrow')}</a>
          ${cfg.phoneOpen ? `<a class="btn btn-ghost btn-lg hx-call" href="${telHref(cfg.phone)}" data-ev="cta_call">${icon('phone')}<span>${esc(cfg.phone)}</span></a>` : `<a class="btn btn-ghost btn-lg hx-call" href="#cb-form" data-ev="cta_call">${icon('phone')}<span>${esc(v3.cb.title)}</span></a>`}
          ${tg ? `<a class="btn btn-ghost btn-lg hx-tg" href="https://t.me/${esc(tg)}" target="_blank" rel="noopener noreferrer" data-ev="tg_hero">${icon('send')}<span>${esc(h.tg)}</span></a>` : ''}
        </div>
        <dl class="hx-facts">${h.facts.map(([k, x]) => `<div><dt>${esc(k)}</dt><dd>${esc(x)}</dd></div>`).join('')}</dl>
      </div>
      <div class="hx-side">
        <figure class="hx-screen" aria-hidden="true">
          <div class="hx-bar"><i></i><i></i><i></i><span>${esc(cfg.brand)} · Live</span></div>
          <div class="hx-media">${heroVideo('prod', cfg)}</div>
        </figure>
        ${callbackForm(v3.cb, lang)}
      </div>
    </div>
  </section>

  <section class="tz" aria-label="${esc(v3.trust.label)}"><div class="wrap">
    <ul class="tz-list">${v3.trust.items.map(([ic, a, x]) => `<li>${icon(ic)}<div><b>${esc(a)}</b><span>${esc(x)}</span></div></li>`).join('')}</ul>
    <p class="tz-brands"><span>${esc(v3.trust.brandsLabel)}</span>${v3.trust.brands.map((x) => `<b>${esc(x)}</b>`).join('')}</p>
  </div></section>

  ${on('why') ? whyBlock(t, lang, cfg) : ''}

  ${on('directions') ? `<section class="section cat" id="services" aria-labelledby="cat-title"><div class="wrap">
    ${secHead(c.eyebrow, c.title, c.lead, 'cat-title')}
    <div class="cat-table" role="table" aria-label="${esc(c.eyebrow)}">
      <div class="cat-row cat-head" role="row">${c.head.map((x) => `<span role="columnheader">${esc(x)}</span>`).join('')}<span aria-hidden="true"></span></div>
      ${c.items.map((it) => `<div class="cat-row reveal" role="row">
        <span role="cell" class="cat-name">${CAT_HREF[it.key] ? `<a href="${url(lang, CAT_HREF[it.key])}">${esc(it.name)}</a>` : esc(it.name)}</span>
        <span role="cell" class="cat-text">${esc(it.text)}</span>
        <span role="cell" class="cat-price">${esc(it.price)}</span>
        <span role="cell" class="cat-act"><a class="btn btn-ghost btn-sm" href="#contact" data-svc="${esc(it.name)}" data-ev="cat_${it.key}">${esc(c.ask)}</a></span>
      </div>`).join('')}
    </div>
    ${t.lp ? `<nav class="cat-all" aria-label="${esc(t.lp.hub.eyebrow)}"><a class="btn btn-ghost btn-sm" href="${url(lang, 'services/')}">${esc(t.lp.hub.eyebrow)}${icon('arrow')}</a>${t.lp.services.map((x) => `<a href="${url(lang, `services/${x.slug}/`)}">${esc(x.name)}</a>`).join('')}</nav>` : ''}
    <h3 class="cat-sub">${esc(c.stepsTitle)}</h3>
    <ol class="steps steps-5 cat-steps">${c.steps.map(([a, x], i) => `<li class="step reveal"><span class="step-n">0${i + 1}</span><h3>${esc(a)}</h3><p>${esc(x)}</p></li>`).join('')}</ol>
  </div></section>` : ''}

  ${on('team') && (team.length || pf.length) ? `<section class="section section-alt tmx" id="team" aria-labelledby="tm-title"><div class="wrap">
    <div class="sec-head-row">${secHead(v.team.eyebrow, v.team.title, v.team.lead, 'tm-title')}<a class="btn btn-ghost" href="${url(lang, 'team/')}">${esc(v.team.more)}${icon('arrow')}</a></div>
    ${team.length ? `<ul class="tm-grid${team.length === 1 ? ' tm-one' : ''}">${team.map((m) => memberCard(t, lang, m)).join('')}</ul>` : ''}
    ${pf.length ? `<h3 class="tm-sub">${esc(v.team.casesTitle)}</h3><ul class="pf-grid">${pf.map((p) => portfolioCard(t, lang, p, 'prod')).join('')}</ul>` : ''}
  </div></section>` : ''}

  ${on('trust') ? `<section class="section trx" id="trust" aria-labelledby="tr-title"><div class="wrap">
    ${secHead(r.eyebrow, r.title, '', 'tr-title')}
    <div class="tr-grid">
      <div class="tr-left">
        <dl class="tr-war">${r.warranty.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl>
        <a class="link-arrow" href="${url(lang, 'warranty/')}">${esc(r.wLink)}${icon('arrow')}</a>
        <div class="tr-scores">
          ${rs.n ? `<div class="tr-score"><b>${esc(rs.avg)}</b>${starsShow(rs.avg)}<span>${esc(r.avgService)} · ${esc(rs.n)} ${esc(r.votes)}</span></div>` : ''}
          ${fb.ns ? `<div class="tr-score"><b>${esc(fb.site)}</b>${starsShow(fb.site)}<span>${esc(r.avgSite)} · ${esc(fb.ns)} ${esc(r.votes)}</span></div>` : ''}
        </div>
        ${quotes.length ? `<h3 class="tr-sub">${esc(r.reviews)}</h3><ul class="tr-quotes">${quotes.map((q) => `<li><p>«${esc(q.text)}»</p><span>${q.rating ? starsShow(q.rating) : ''}${esc([q.name, q.company].filter(Boolean).join(', '))}</span></li>`).join('')}</ul>` : ''}
      </div>
      ${rateBlock(t, lang)}
    </div>
  </div></section>` : ''}

  ${on('training') ? `<section class="section tx" id="training" aria-labelledby="tx-title"><div class="wrap">
    <div class="sec-head-row">${secHead(v.train.eyebrow, v.train.title, v.train.lead, 'tx-title')}<a class="btn btn-ghost" href="${url(lang, 'academy/')}">${esc(v.train.more)}${icon('arrow')}</a></div>
    <ol class="tx-list">${v.train.tracks.map((k, i) => `<li class="tx-row reveal">
      <span class="tx-n mono">${String(i + 1).padStart(2, '0')}</span>
      <div class="tx-main"><h3>${esc(k.name)}</h3><ul>${k.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <dl class="tx-meta"><div><dt>${esc(v.train.level)}</dt><dd>${esc(k.level)}</dd></div><div><dt>${esc(v.train.dur)}</dt><dd>${esc(k.dur)}</dd></div></dl>
    </li>`).join('')}</ol>
    <div class="tx-foot"><ul class="tx-formats">${v.train.formats.map((x) => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul><a class="btn btn-primary" href="#contact" data-svc="${esc(v.train.eyebrow)}" data-ev="cta_training">${esc(v.train.cta)}${icon('arrow')}</a></div>
  </div></section>` : ''}

  ${on('monitoring') ? homeMonitoring(t, lang, 'prod') : ''}

  <section class="section contact" id="contact" aria-labelledby="contact-title">
    <div class="wrap contact-in">
      <div class="contact-copy reveal">
        <p class="eyebrow">${esc(t.ai.eyebrow)}</p>
        <h2 id="contact-title">${esc(v.contact.title)}</h2>
        <p class="sec-lead">${esc(t.ai.lead)}</p>
        <p class="hours"><span class="dot" aria-hidden="true"></span>${esc(t.contact.hours)}</p>
        <p class="area"><b>${esc(t.v3.area.title)}:</b> ${esc(t.v3.area.text)}</p>
        ${cfg.botUsername ? `<a class="tg-card" href="https://t.me/${esc(cfg.botUsername)}" target="_blank" rel="noopener noreferrer" data-ev="tg_bot">${icon('send')}<span><b>${esc(t.v7?.tgHero || 'Telegram')}</b><small>@${esc(cfg.botUsername)}</small></span></a>` : ''}
      </div>
      ${aiFormFor(t, cfg)}
    </div>
  </section>
</main>`;
}

export function renderTeam(lang, t, cfg, team, cases, ver) {
  const q = t.v2.team;
  const sub = 'team/';
  const body = `<main id="main" class="v2">${pageHero(q.eyebrow, q.title, q.lead)}
  <section class="section section-tight"><div class="wrap">
    ${team.length ? `<ul class="tm-grid tm-full${team.length === 1 ? ' tm-one' : ''}">${team.map((m) => memberCard(t, lang, m, true)).join('')}</ul>` : `<p class="muted">${esc(q.empty)}</p>`}
  </div></section>
  ${cases.length ? `<section class="section section-alt"><div class="wrap"><div class="sec-head-row">${secHead(t.portfolio.eyebrow, q.casesTitle, '', 'tm-cases')}<a class="btn btn-ghost" href="${url(lang, 'portfolio/')}">${esc(q.casesMore)}${icon('arrow')}</a></div>
    <ul class="pf-grid">${cases.slice(0, 6).map((p) => portfolioCard(t, lang, p, 'prod')).join('')}</ul></div></section>` : ''}
</main>`;
  const jsonLd = { '@context': 'https://schema.org', '@graph': team.map((m) => ({ '@type': 'Person', name: m.name, jobTitle: m.data?.role?.[lang] || undefined, worksFor: { '@id': cfg.domain + '/#org' }, knowsAbout: m.skills, ...(m.photo ? { image: `${cfg.domain}/media/${m.photo}` } : {}) })) };
  return layout({ lang, t, cfg, sub, title: q.metaTitle, description: q.metaDesc, body, jsonLd, assetVer: ver });
}

export function renderService(lang, t, cfg, key, ver) {
  const m = t.v2.pages[key];
  const sub = key === 'docs' ? 'documents/' : 'robots/';
  const body = `<main id="main" class="v2">
  <section class="page-hero svc-hero"><div class="hero-bg" aria-hidden="true"><div class="grid"></div></div>
    <div class="wrap page-hero-in"><p class="eyebrow">${esc(m.eyebrow)}</p><h1>${esc(m.title)}</h1><p class="lead">${esc(m.lead)}</p>
      <div class="cta-row"><a class="btn btn-primary btn-lg" href="#svc-form" data-ev="svc_${key}">${esc(m.cta)}${icon('arrow')}</a></div></div>
  </section>
  <section class="section" aria-labelledby="svc-what"><div class="wrap">
    ${secHead(m.eyebrow, m.whatTitle, '', 'svc-what')}
    <ul class="mon-what">${m.what.map(([h, x], i) => `<li class="reveal"><span class="mono">${String(i + 1).padStart(2, '0')}</span><h3>${esc(h)}</h3><p>${esc(x)}</p></li>`).join('')}</ul>
  </div></section>
  <section class="section section-alt" aria-labelledby="svc-steps"><div class="wrap">
    ${secHead(m.eyebrow, m.stepsTitle, '', 'svc-steps')}
    <ol class="steps steps-5">${m.steps.map(([h, x], i) => `<li class="step reveal"><span class="step-n">0${i + 1}</span><h3>${esc(h)}</h3><p>${esc(x)}</p></li>`).join('')}</ol>
  </div></section>
  <section class="section" aria-labelledby="svc-pkg"><div class="wrap">
    ${secHead(m.eyebrow, m.pkgTitle, m.pkgLead, 'svc-pkg')}
    <ul class="plans">${m.pkgs.map((p, i) => `<li class="plan reveal${i === 1 ? ' is-featured' : ''}"><h3>${esc(p.name)}</h3><p class="plan-for">${esc(p.for)}</p><ul>${p.items.map((x) => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul><a class="btn ${i === 1 ? 'btn-primary' : 'btn-ghost'}" href="#svc-form">${esc(m.cta)}</a></li>`).join('')}</ul>
  </div></section>
  <section class="section contact" id="svc-form" aria-labelledby="svc-form-title"><div class="wrap contact-in">
    <div class="contact-copy reveal"><p class="eyebrow">${esc(m.eyebrow)}</p><h2 id="svc-form-title">${esc(m.cta)}</h2><p class="sec-lead">${esc(t.v2.contact.title)}</p>
      <div class="faq">${m.faq.map((f) => `<details class="qa"><summary><span>${esc(f.q)}</span>${icon('plus', 'ic qa-ic')}</summary><p>${esc(f.a)}</p></details>`).join('')}</div></div>
    ${aiFormFor(t, cfg, { service: m.svc })}
  </div></section>
</main>`;
  const pageUrl = cfg.domain + url(lang, sub);
  const jsonLd = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Service', name: m.svc, description: m.metaDesc, url: pageUrl, inLanguage: lang, provider: { '@id': cfg.domain + '/#org' }, areaServed: { '@type': 'Country', name: 'Uzbekistan' },
      hasOfferCatalog: { '@type': 'OfferCatalog', name: m.pkgTitle, itemListElement: m.pkgs.map((p) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: `${m.svc}: ${p.name}`, description: p.items.join(', ') } })) } },
    { '@type': 'FAQPage', mainEntity: m.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    { '@type': 'BreadcrumbList', itemListElement: [[cfg.brand, cfg.domain + url(lang, '')], [m.eyebrow, pageUrl]].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) }
  ] };
  return layout({ lang, t, cfg, sub, title: m.metaTitle, description: m.metaDesc, keywords: m.kw, body, jsonLd, assetVer: ver });
}

export { fmt, LANGS };
