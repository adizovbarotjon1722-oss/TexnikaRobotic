// 14-bosqich: PLC monitoring tizimlari sahifasi (/monitoring/) va bosh sahifadagi qisqa blok.
import { layout, esc, icon, url, secHead, aiFormFor } from './template.mjs';

const crumbsLd = (items) => ({ '@type': 'BreadcrumbList', itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) });

// Namuna panel: dispetcherlik ekranining soddalashtirilgan ko'rinishi (haqiqiy ma'lumot emas)
function demoPanel(m) {
  const P = m.panel;
  const rows = [['run', 87, '1 240', '0:12'], ['alarm', 61, '760', '0:41'], ['stop', 74, '2 030', '0:06']];
  return `<figure class="mon-panel" aria-label="${esc(P.title)}">
    <header><b>${esc(P.title)}</b><span>${esc(P.shift)} · 14:35</span></header>
    <table><thead><tr><th></th><th>${esc(P.oee)}</th><th>${esc(P.out)}</th><th>${esc(P.down)}</th></tr></thead><tbody>
    ${rows.map(([st, oee, out, down], i) => `<tr><td><span class="mon-st st-${st}"></span><span class="mon-ln">${esc(P.lines[i])}</span><small>${esc(P[st])}</small></td><td><span class="mon-oee"><i class="w${Math.round(oee / 10)}"></i></span><b>${oee}%</b></td><td class="mono">${out}</td><td class="mono">${down}</td></tr>`).join('')}
    </tbody></table>
    <svg class="mon-trend" viewBox="0 0 300 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 40 L25 36 L50 38 L75 30 L100 32 L125 22 L150 26 L175 18 L200 44 L225 46 L250 28 L275 24 L300 20" fill="none" stroke="currentColor" stroke-width="2" vector-effect="non-scaling-stroke"/><line x1="0" y1="12" x2="300" y2="12" class="mon-lim" vector-effect="non-scaling-stroke"/></svg>
    <footer><b>${esc(P.log)}</b><ul>${P.events.map(([tm, x]) => `<li><span class="mono">${esc(tm)}</span>${esc(x)}</li>`).join('')}</ul></footer>
  </figure>`;
}

export function homeMonitoring(t, lang, mode) {
  const m = t.mon;
  const href = mode === 'preview' ? '#contact' : url(lang, 'monitoring/');
  return `<section class="section mon-band" id="monitoring" aria-labelledby="mon-home-title"><div class="wrap mon-hero-in">
    <div class="reveal">${secHead(m.eyebrow, m.title, m.homeLead, 'mon-home-title')}
      <ul class="plc-points">${m.what.slice(0, 4).map(([x]) => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul>
      <div class="cta-row"><a class="btn btn-primary" href="${href}" data-ev="mon_home">${esc(m.more)}${icon('arrow')}</a></div></div>
    <div class="reveal">${demoPanel(m)}</div>
  </div></section>`;
}

export function renderMonitoring(lang, t, cfg, ver) {
  const m = t.mon;
  const sub = 'monitoring/';
  const body = `<main id="main">
  <section class="page-hero mon-hero"><div class="hero-bg" aria-hidden="true"><div class="grid"></div><div class="scan"></div></div>
    <div class="wrap mon-hero-in">
      <div><p class="eyebrow">${esc(m.eyebrow)}</p><h1>${esc(m.title)}</h1><p class="lead">${esc(m.lead)}</p>
        <div class="cta-row"><a class="btn btn-primary btn-lg" href="#mon-form" data-ev="mon_hero">${esc(m.cta)}</a></div>
        <p class="mon-safe">${icon('shield')}${esc(m.safe)}</p></div>
      ${demoPanel(m)}
    </div>
  </section>

  <section class="section" aria-labelledby="mon-what"><div class="wrap">
    ${secHead(m.eyebrow, m.whatTitle, '', 'mon-what')}
    <ul class="mon-what">${m.what.map(([h, x], i) => `<li class="reveal"><span class="mono">${String(i + 1).padStart(2, '0')}</span><h3>${esc(h)}</h3><p>${esc(x)}</p></li>`).join('')}</ul>
  </div></section>

  <section class="section section-alt" aria-labelledby="mon-how"><div class="wrap">
    ${secHead(m.eyebrow, m.howTitle, m.howLead, 'mon-how')}
    <ol class="mon-arch">${m.arch.map(([h, x]) => `<li class="reveal"><b>${esc(h)}</b><span>${esc(x)}</span></li>`).join('')}</ol>
    <h3 class="mon-sub">${esc(m.protoTitle)}</h3>
    <ul class="mon-proto">${m.protocols.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
  </div></section>

  <section class="section" aria-labelledby="mon-steps"><div class="wrap">
    ${secHead(m.eyebrow, m.stepsTitle, '', 'mon-steps')}
    <ol class="steps steps-5">${m.steps.map(([h, x], i) => `<li class="step reveal"><span class="step-n">0${i + 1}</span><h3>${esc(h)}</h3><p>${esc(x)}</p></li>`).join('')}</ol>
  </div></section>

  <section class="section section-alt" aria-labelledby="mon-pkg"><div class="wrap">
    ${secHead(m.eyebrow, m.pkgTitle, m.pkgLead, 'mon-pkg')}
    <ul class="plans">${m.pkgs.map((p, i) => `<li class="plan reveal"><h3>${esc(p.name)}</h3><p class="plan-for">${esc(p.for)}</p><ul>${p.items.map((x) => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul><a class="btn ${i === 1 ? 'btn-primary' : 'btn-ghost'}" href="#mon-form" data-ev="mon_pkg_${i}">${esc(m.cta)}</a></li>`).join('')}</ul>
  </div></section>

  <section class="section contact" id="mon-form" aria-labelledby="mon-form-title"><div class="wrap contact-in">
    <div class="contact-copy reveal"><p class="eyebrow">${esc(m.eyebrow)}</p><h2 id="mon-form-title">${esc(m.cta)}</h2><p class="sec-lead">${esc(m.homeLead)}</p>
      <div class="faq">${m.faq.map((f) => `<details class="qa"><summary><span>${esc(f.q)}</span>${icon('plus', 'ic qa-ic')}</summary><p>${esc(f.a)}</p></details>`).join('')}</div></div>
    ${aiFormFor(t, cfg, { service: m.svc })}
  </div></section>
</main>`;
  const pageUrl = cfg.domain + url(lang, sub);
  const jsonLd = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Service', name: m.svc, serviceType: 'PLC monitoring, SCADA, OEE', description: t.meta9.monDesc, url: pageUrl, inLanguage: lang, provider: { '@id': cfg.domain + '/#org' }, areaServed: { '@type': 'Country', name: 'Uzbekistan' },
      hasOfferCatalog: { '@type': 'OfferCatalog', name: m.pkgTitle, itemListElement: m.pkgs.map((p) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: `${m.svc}: ${p.name}`, description: p.items.join(', ') } })) } },
    { '@type': 'FAQPage', mainEntity: m.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    crumbsLd([[cfg.brand, cfg.domain + url(lang, '')], [t.nav9.mon, pageUrl]])
  ] };
  return layout({ lang, t, cfg, sub, title: t.meta9.monTitle, description: t.meta9.monDesc, keywords: t.meta9.monKeywords, body, jsonLd, assetVer: ver });
}
