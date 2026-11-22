// 16-bosqich: aniq maqsadli bosh sahifa (7 blok), Ustalar, Robot servisi, Elektron hujjatlar, baholash
import { layout, esc, icon, url, secHead, aiFormFor, portfolioCard, heroVideo, pageHero, LANGS } from './template.mjs';
import { homeMonitoring } from './template7.mjs';
import { fmt } from './i18n.mjs';

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
  return `<main id="main" class="v2">
  <section class="hx" aria-labelledby="hero-title">
    <div class="hx-bg" aria-hidden="true"></div>
    <div class="wrap hx-in">
      <div class="hx-copy">
        <h1 id="hero-title"><span class="h1k">${esc(v.hero.h1k)}</span> <span class="h1a">${esc(v.hero.h1a)}</span> <span class="h1b">${esc(v.hero.h1b)}</span></h1>
        <p class="lead">${esc(v.hero.lead)}</p>
        <div class="cta-row">
          <a class="btn btn-primary btn-lg" href="#contact" data-ev="cta_hero">${esc(v.hero.cta1)}${icon('arrow')}</a>
          <a class="btn btn-ghost btn-lg" href="${url(lang, 'academy/')}" data-ev="cta_courses">${icon('cap')}${esc(v.hero.cta2)}</a>
        </div>
        <ul class="hx-dirs">${v.dir.items.map((d) => `<li><a href="${url(lang, DIR_HREF[d.key])}">${icon(d.icon)}<span>${esc(d.title)}</span></a></li>`).join('')}</ul>
      </div>
      <figure class="hx-screen" aria-hidden="true">
        <div class="hx-bar"><i></i><i></i><i></i><span>${esc(cfg.brand)} · Live</span></div>
        <div class="hx-media">${heroVideo('prod', cfg)}</div>
        <ul class="hx-tele">${v.hero.tele.map(([k, x], i) => `<li class="tl-${i}"><span>${esc(k)}</span><b>${esc(x)}</b></li>`).join('')}</ul>
      </figure>
    </div>
  </section>

  ${on('directions') ? `<section class="section dx" id="services" aria-labelledby="dx-title"><div class="wrap">
    ${secHead(v.dir.eyebrow, v.dir.title, '', 'dx-title')}
    <ol class="dx-grid">${v.dir.items.map((d, i) => `<li class="dx-card reveal">
      <a href="${url(lang, DIR_HREF[d.key])}" class="dx-link" data-ev="dir_${d.key}">
        <span class="dx-n">0${i + 1}</span><span class="dx-ic">${icon(d.icon)}</span>
        <h3>${esc(d.title)}</h3><p>${esc(d.text)}</p>
        <ul>${d.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        <span class="dx-more">${esc(v.dir.more)}${icon('arrow')}</span>
      </a></li>`).join('')}</ol>
  </div></section>` : ''}

  ${on('monitoring') ? homeMonitoring(t, lang, 'prod') : ''}

  ${on('training') ? `<section class="section tx" id="training" aria-labelledby="tx-title"><div class="wrap">
    <div class="sec-head-row">${secHead(v.train.eyebrow, v.train.title, v.train.lead, 'tx-title')}<a class="btn btn-ghost" href="${url(lang, 'academy/')}">${esc(v.train.more)}${icon('arrow')}</a></div>
    <ol class="tx-list">${v.train.tracks.map((k, i) => `<li class="tx-row reveal">
      <span class="tx-n mono">${String(i + 1).padStart(2, '0')}</span>
      <div class="tx-main"><h3>${esc(k.name)}</h3><ul>${k.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <dl class="tx-meta"><div><dt>${esc(v.train.level)}</dt><dd>${esc(k.level)}</dd></div><div><dt>${esc(v.train.dur)}</dt><dd>${esc(k.dur)}</dd></div></dl>
    </li>`).join('')}</ol>
    <div class="tx-foot"><ul class="tx-formats">${v.train.formats.map((x) => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul><a class="btn btn-primary" href="#contact" data-svc="${esc(v.train.eyebrow)}" data-ev="cta_training">${esc(v.train.cta)}${icon('arrow')}</a></div>
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

  <section class="section contact" id="contact" aria-labelledby="contact-title">
    <div class="wrap contact-in">
      <div class="contact-copy reveal">
        <p class="eyebrow">${esc(t.ai.eyebrow)}</p>
        <h2 id="contact-title">${esc(v.contact.title)}</h2>
        <p class="sec-lead">${esc(t.ai.lead)}</p>
        <p class="hours"><span class="dot" aria-hidden="true"></span>${esc(t.contact.hours)}</p>
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
