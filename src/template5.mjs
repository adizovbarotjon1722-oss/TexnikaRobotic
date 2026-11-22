// 6-bosqich: bo'limlar yacheykalari (bosh sahifa va sarlavhadagi menyu), qo'llab-quvvatlash bo'limi va sahifasi.
import { layout, esc, icon, url, secHead, aiFormFor } from './template.mjs';
import { sart } from './art.mjs';

// Har bo'lim: [prod manzil, preview manzil, chizma]
const HUB = {
  services: ['#services', '#services', 'gears'],
  plc: ['plc/', '#plc', 'plcmini'],
  monitoring: ['monitoring/', '#monitoring', 'factory'],
  ai: ['#contact', '#contact', 'scan'],
  support: ['support/', '#support', 'headset'],
  errors: ['errors/', '#errors', 'alarm'],
  warranty: ['warranty/', '#warranty', 'stamp'],
  academy: ['academy/', '#top', 'book'],
  videos: ['videos/', '#top', 'screen'],
  portfolio: ['portfolio/', '#portfolio', 'caliper'],
  track: ['track/', '#top', 'magnifier'],
  calc: ['#downtime', '#downtime', 'gauge']
};
const hubHref = (lang, mode, k) => { const [p, pv] = HUB[k]; if (mode === 'preview') return pv; return p.startsWith('#') ? url(lang, '') + p : url(lang, p); };

export function hubSection(t, lang, mode) {
  const h = t.hub;
  return `<section class="hub" id="sections" aria-labelledby="hub-title"><div class="wrap">
    <div class="hub-head"><p class="eyebrow">${esc(h.eyebrow)}</p><h2 id="hub-title">${esc(h.title)}</h2></div>
    <ul class="hub-grid">${Object.keys(HUB).map((k) => `<li><a class="cell c-${k}" href="${hubHref(lang, mode, k)}" data-ev="hub_${k}">${sart(HUB[k][2])}<span class="cell-t">${esc(h.items[k][0])}</span><span class="cell-d">${esc(h.items[k][1])}</span>${icon('arrow', 'ic cell-a')}</a></li>`).join('')}</ul>
  </div></section>`;
}

// Sarlavhadagi "Bo'limlar" menyusi: JS siz ochiladi (details), app.js tashqariga bosilganda yopadi
export function megaMenu(t, lang, mode) {
  const h = t.hub;
  return `<details class="mega" id="mega"><summary class="btn btn-sm btn-ghost">${icon('menu')}<span>${esc(h.menu)}</span></summary>
    <div class="mega-panel"><div class="wrap"><ul class="mega-grid">${Object.keys(HUB).map((k) => `<li><a href="${hubHref(lang, mode, k)}" data-ev="mega_${k}">${sart(HUB[k][2])}<span><b>${esc(h.items[k][0])}</b><small>${esc(h.items[k][1])}</small></span></a></li>`).join('')}</ul></div></div>
  </details>`;
}

function channelHref(t, lang, cfg, mode, k) {
  if (k === 'tg') return `https://t.me/${cfg.botUsername || cfg.telegram}`;
  if (k === 'remote') return mode === 'preview' ? '#support' : `${url(lang, 'support/')}#remote`;
  return mode === 'preview' ? '#contact' : `${url(lang, '')}#contact`;
}
const channels = (t, lang, cfg, mode) => `<ul class="sp-ch">${t.support.channels.map((c) => `<li class="reveal"><span class="sp-ic">${icon(c.icon)}</span><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p><a class="sp-link" href="${esc(channelHref(t, lang, cfg, mode, c.k))}"${c.k === 'tg' ? ' target="_blank" rel="noopener noreferrer"' : ''} data-ev="support_${c.k}">${esc(c.cta)}${icon('arrow')}</a></li>`).join('')}</ul>`;
export const prio = (t) => { const s = t.support; return `<div class="sp-prio-wrap"><table class="sp-prio"><caption>${esc(s.prioTitle)}</caption><thead><tr>${s.prioCols.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead><tbody>${s.prio.map((r) => `<tr class="pr-${r.k}"><th scope="row"><span class="pr-dot"></span>${esc(r.name)}</th><td>${esc(r.when)}</td><td>${esc(r.answer)}</td></tr>`).join('')}</tbody></table></div>`; };

export function homeSupport(t, lang, cfg, mode) {
  const s = t.support;
  return `<section class="section sp-band" id="support" aria-labelledby="sp-title"><div class="wrap">
    <div class="sec-head-row">${secHead(s.eyebrow, s.title, s.homeLead, 'sp-title', '', 'headset')}<a class="btn btn-ghost" href="${mode === 'preview' ? '#support' : url(lang, 'support/')}">${esc(s.more)}${icon('arrow')}</a></div>
    ${channels(t, lang, cfg, mode)}
  </div></section>`;
}

export function renderSupport(lang, t, cfg, ver) {
  const s = t.support;
  const selfHref = { errors: url(lang, 'errors/'), led: `${url(lang, 'plc/')}#led`, academy: url(lang, 'academy/'), track: url(lang, 'track/') };
  const selfIc = { errors: 'alert', led: 'plc', academy: 'cap', track: 'search' };
  const body = `<main id="main">
  <section class="page-hero sp-hero"><div class="hero-bg" aria-hidden="true"><div class="grid"></div><div class="scan"></div></div>
    <div class="wrap w-hero-in"><div><p class="eyebrow">${esc(s.eyebrow)}</p><h1>${esc(s.title)}</h1><p class="lead">${esc(s.lead)}</p>
      <div class="cta-row"><a class="btn btn-primary btn-lg" href="#sp-form" data-ev="support_hero">${icon('send')}${esc(t.nav.cta)}</a><a class="btn btn-ghost btn-lg" href="#remote">${icon('code')}${esc(s.remoteTitle)}</a></div></div>${sart('headset').replace('class="sa sa-headset"', 'class="sa sa-headset sa-xl"')}</div>
  </section>
  <section class="section section-tight" aria-labelledby="sp-ch"><div class="wrap">${secHead(s.eyebrow, s.channelsTitle, '', 'sp-ch', '', 'grid')}${channels(t, lang, cfg, 'prod')}</div></section>
  <section class="section section-alt" aria-labelledby="sp-pr"><div class="wrap w-cols">
    <div class="reveal">${secHead(s.eyebrow, s.prioTitle, '', 'sp-pr', '', 'alarm')}${prio(t)}</div>
    <div class="reveal" id="remote">${secHead(s.eyebrow, s.remoteTitle, '', 'sp-rm', '', 'scan')}<ol class="steps steps-3">${s.remote.map((r, i) => `<li class="step"><span class="step-n">0${i + 1}</span><h3>${esc(r.title)}</h3><p>${esc(r.text)}</p></li>`).join('')}</ol><p class="sp-safe">${icon('lock')}<span>${esc(s.safety)}</span></p></div>
  </div></section>
  <section class="section" aria-labelledby="sp-self"><div class="wrap">${secHead(s.eyebrow, s.selfTitle, '', 'sp-self', '', 'magnifier')}
    <ul class="sp-self">${s.self.map((x) => `<li class="reveal"><a href="${selfHref[x.k]}">${icon(selfIc[x.k])}<span><b>${esc(x.title)}</b><small>${esc(x.text)}</small></span>${icon('arrow')}</a></li>`).join('')}</ul>
  </div></section>
  <section class="section section-alt contact" id="sp-form" aria-labelledby="sp-form-t"><div class="wrap contact-in">
    <div class="contact-copy reveal"><p class="eyebrow">${esc(t.ai.eyebrow)}</p><h2 id="sp-form-t">${esc(t.ai.title)}</h2><p class="sec-lead">${esc(t.ai.lead)}</p>
      <div class="faq">${s.faq.map((f) => `<details class="qa"><summary><span>${esc(f.q)}</span>${icon('plus', 'ic qa-ic')}</summary><p>${esc(f.a)}</p></details>`).join('')}</div></div>
    ${aiFormFor(t, cfg)}
  </div></section>
</main>`;
  const pageUrl = cfg.domain + url(lang, 'support/');
  const jsonLd = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Service', name: s.title, serviceType: 'Technical support', description: t.meta6.supportDesc, url: pageUrl, inLanguage: lang, provider: { '@id': cfg.domain + '/#org' }, areaServed: { '@type': 'Country', name: 'Uzbekistan' } },
    { '@type': 'FAQPage', mainEntity: s.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
  ] };
  return layout({ lang, t, cfg, sub: 'support/', title: t.meta6.supportTitle, description: t.meta6.supportDesc, keywords: t.meta9.kw.support, body, jsonLd, assetVer: ver });
}

// Bosh sahifa: sifat standarti, ustuvorliklar, javob muddatlari va sifat nazorati
export function homeQuality(t) {
  const q = t.v7.qp, w = t.warranty;
  return `<section class="section qp-band" id="quality" aria-labelledby="qp-title"><div class="wrap">
    ${secHead(q.eyebrow, q.title, q.lead, 'qp-title')}
    <ol class="qp-list">${q.principles.map((x, i) => `<li class="reveal"><span class="qp-n">${String(i + 1).padStart(2, '0')}</span><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></li>`).join('')}</ol>
    <div class="qp-cols">
      <div class="reveal">${prio(t)}</div>
      <div class="reveal qp-qc"><h3>${esc(w.qualTitle)}</h3><ol>${w.qual.map((x) => `<li>${icon('check')}<span>${esc(x)}</span></li>`).join('')}</ol></div>
    </div>
  </div></section>`;
}
