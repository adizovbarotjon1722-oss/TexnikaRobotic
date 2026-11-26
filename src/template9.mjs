// 18-bosqich: qidiruv uchun xizmat va shahar sahifalari, har biriga alohida animatsion sxema
import { layout, esc, icon, url, secHead, aiFormFor, telHref, tgUser } from './template.mjs';
import { callbackForm } from './template8.mjs';
import { fmt } from './i18n.mjs';

/* ---------- Animatsion sxemalar (SVG + CSS, inline style yo‘q) ---------- */
const MOTIF = {
  'siemens-s7-plc-repair': 'ladder', 'plc-programming': 'ladder',
  'vfd-inverter-repair': 'wave', 'servo-drive-repair': 'wave',
  'abb-robot-repair': 'arm', 'kuka-robot-repair': 'arm',
  'hmi-panel-repair': 'hmi', 'equipment-maintenance': 'gears'
};
// Texnik yozuvlar barcha tillarda bir xil (ekrandagi asbob ko‘rsatkichi kabi)
const READOUT = {
  'siemens-s7-plc-repair': ['CPU 1516-3 PN/DP', 'RUN', 'OB1 4.2 ms'],
  'plc-programming': ['TIA Portal V18', 'ONLINE', 'FB12 · DB40'],
  'vfd-inverter-repair': ['VFD 22 kW', 'f 50.0 Hz', 'I 38.6 A'],
  'servo-drive-repair': ['SERVO AXIS 2', 'POS OK', 'ERR 0.002°'],
  'abb-robot-repair': ['IRC5 · IRB 6700', 'AUTO', 'J1 +34.2°'],
  'kuka-robot-repair': ['KRC4 · KR 210', 'T1', 'A2 −18.7°'],
  'hmi-panel-repair': ['HMI TP1200', 'COMM OK', 'ALM 0'],
  'equipment-maintenance': ['PM PLAN', 'ON TIME', 'RMS 2.1 mm/s'],
  hub: ['PROFINET', 'NODES 6', '1 ms'],
  city: ['SERVICE MAP', 'UZ', '9 CITY']
};

function ladder() {
  const rungs = [[60, 'I0.0', 'I0.1', 'Q0.0'], [120, 'I0.2', 'M10.1', 'Q0.1'], [180, 'I1.0', 'T37', 'Q0.4'], [240, 'M2.0', 'I1.3', 'Q1.0']];
  return `<g class="lx-rail"><path d="M40 30V270M440 30V270"/></g>
  ${rungs.map(([y, a, b, c], i) => `<g class="lx-rung lx-r${i}">
    <path class="lx-wire" d="M40 ${y}H120M140 ${y}H220M240 ${y}H360M400 ${y}H440"/>
    <path class="lx-ct" d="M120 ${y - 14}V${y + 14}M140 ${y - 14}V${y + 14}M220 ${y - 14}V${y + 14}M240 ${y - 14}V${y + 14}"/>
    ${i === 1 ? `<path class="lx-ct" d="M222 ${y + 12}L238 ${y - 12}"/>` : ''}
    <path class="lx-coil" d="M368 ${y - 14}a14 14 0 0 0 0 28M392 ${y - 14}a14 14 0 0 1 0 28"/>
    <path class="lx-flow" d="M40 ${y}H440"/>
    <text x="130" y="${y - 22}">${a}</text><text x="230" y="${y - 22}">${b}</text><text x="380" y="${y - 22}">${c}</text>
  </g>`).join('')}`;
}
function wave(slug) {
  const sine = `M0 120q40 -80 80 0${'t80 0'.repeat(11)}`;
  const pwm = [6, 14, 24, 30, 24, 14, 6, 6, 14, 24, 30, 24, 14, 6, 6, 14, 24, 30, 24, 14].map((w, i) => `M${i * 32} 250V${250 - 34}h${w}V250`).join('');
  return `<g class="wv-grid"><path d="M20 120H460M20 250H460M60 30V280M160 30V280M260 30V280M360 30V280"/></g>
  <svg x="20" y="20" width="440" height="260" viewBox="0 20 440 260" class="wv-clip">
    <g class="wv-move"><path class="wv-sine" d="${sine}"/>${slug === 'servo-drive-repair' ? `<path class="wv-sine wv-b" d="M0 140q40 -60 80 0${'t80 0'.repeat(11)}"/>` : ''}</g>
    <g class="wv-move wv-fast"><path class="wv-pwm" d="${pwm}"/></g>
  </svg>
  <text x="26" y="44">U, V</text><text x="26" y="206">PWM</text>
  <circle class="wv-cur" cx="240" cy="120" r="5"/>`;
}
function arm() {
  return `<g class="am-grid"><path d="M30 262H450"/></g>
  <path class="am-path" d="M110 120Q240 10 380 110"/>
  <rect class="am-base" x="170" y="236" width="80" height="26" rx="3"/>
  <g class="am-j1"><rect class="am-link" x="198" y="128" width="24" height="112" rx="10"/><circle class="am-joint" cx="210" cy="236" r="16"/>
    <g class="am-j2"><rect class="am-link" x="204" y="116" width="132" height="22" rx="10"/><circle class="am-joint" cx="210" cy="127" r="13"/>
      <g class="am-j3"><path class="am-tool" d="M336 112v30M336 142h-10M336 142h10"/><circle class="am-joint" cx="336" cy="127" r="9"/><circle class="am-tcp" cx="336" cy="150" r="4"/></g>
    </g>
  </g>
  <text x="34" y="44">TCP X1250 Y0 Z980</text>`;
}
function hmi() {
  return `<rect class="hm-frame" x="40" y="26" width="400" height="236" rx="10"/>
  <rect class="hm-scr" x="56" y="42" width="368" height="186" rx="4"/>
  <path class="hm-axis" d="M76 180H260M76 70V180"/>
  <polyline class="hm-trend" points="76,160 100,150 124,156 148,120 172,128 196,96 220,110 244,84 260,92"/>
  <g class="hm-bars"><rect x="290" y="80" width="22" height="100"/><rect x="322" y="80" width="22" height="100"/><rect x="354" y="80" width="22" height="100"/><rect x="386" y="80" width="22" height="100"/></g>
  <rect class="hm-alm" x="76" y="196" width="332" height="20" rx="3"/>
  <text x="84" y="210">ALARM 0x2F CLEARED · TOUCH CAL OK</text>
  <circle class="hm-led" cx="240" cy="246" r="4"/>`;
}
function gearPath(cx, cy, r, n) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI * i) / n, a2 = (Math.PI * (i + 1)) / n, rr = i % 2 ? r - 10 : r;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`, `${(cx + rr * Math.cos(a2)).toFixed(1)} ${(cy + rr * Math.sin(a2)).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
}
function gears() {
  return `<g class="gr-a"><path class="gr-g" d="${gearPath(150, 150, 74, 12)}"/><circle class="gr-h" cx="150" cy="150" r="22"/></g>
  <g class="gr-b"><path class="gr-g" d="${gearPath(268, 150, 50, 8)}"/><circle class="gr-h" cx="268" cy="150" r="14"/></g>
  <g class="gr-chk"><path class="gr-box" d="M340 70h100M340 120h100M340 170h100M340 220h100"/>${[0, 1, 2, 3].map((i) => `<path class="gr-tick gr-t${i}" d="M342 ${56 + i * 50}l6 6 12 -14"/>`).join('')}</g>
  <text x="366" y="62">LUBE</text><text x="366" y="112">BELT</text><text x="366" y="162">TEMP</text><text x="366" y="212">VIBR</text>`;
}
const CITY_XY = { toshkent: [69.24, 41.31], samarqand: [66.96, 39.65], fargona: [71.78, 40.38], andijon: [72.34, 40.78], namangan: [71.67, 41.0], navoiy: [65.38, 40.1], buxoro: [64.42, 39.77], qarshi: [65.79, 38.86], nukus: [59.6, 42.46] };
// Yorliq joylashuvi: [dx, dy, anchor] — Farg‘ona vodiysida nomlar ustma-ust tushmasligi uchun
const LBL = { toshkent: [-9, 4, 'end'], namangan: [0, -12, 'middle'], andijon: [9, -6, 'start'], fargona: [9, 12, 'start'], navoiy: [0, -12, 'middle'], buxoro: [-9, 4, 'end'] };
const geo = ([lon, lat]) => [Math.round(30 + ((lon - 58) / 15.5) * 370), Math.round(40 + ((44 - lat) / 6) * 220)];
function map(cities, cur) {
  const c0 = geo(CITY_XY[cur] || CITY_XY.toshkent);
  const grid = [59, 62, 65, 68, 71].map((lon) => { const x = geo([lon, 44])[0]; return `<path d="M${x} 30V280"/><text x="${x + 4}" y="276">${lon}°E</text>`; }).join('') + [43, 41, 39].map((lat) => { const y = geo([58, lat])[1]; return `<path d="M30 ${y}H450"/><text x="34" y="${y - 4}">${lat}°N</text>`; }).join('');
  return `<g class="mp-grid">${grid}</g>
  ${cities.filter(([s]) => s !== cur).map(([s]) => { const [x, y] = geo(CITY_XY[s]); return `<path class="mp-link" d="M${c0[0]} ${c0[1]}L${x} ${y}"/>`; }).join('')}
  ${cities.map(([s, n]) => { const [x, y] = geo(CITY_XY[s]); const on = s === cur; return `<g class="mp-pt${on ? ' is-cur' : ''}">${on ? `<circle class="mp-ring" cx="${x}" cy="${y}" r="8"/>` : ''}<circle cx="${x}" cy="${y}" r="${on ? 6 : 4}"/>${(([dx, dy, a]) => `<text x="${x + dx}" y="${y + dy}" text-anchor="${a}">${esc(n)}</text>`)(LBL[s] || [9, 4, 'start'])}</g>`; }).join('')}`;
}
function bus() {
  const nodes = [['PLC', 60], ['HMI', 136], ['VFD', 212], ['SERVO', 288], ['ROBOT', 364], ['SCADA', 420]];
  return `<path class="bs-line" d="M40 150H450"/>
  ${nodes.map(([n, x], i) => `<g class="bs-node"><path class="bs-drop" d="M${x} 150V${i % 2 ? 196 : 104}"/><rect x="${x - 30}" y="${i % 2 ? 196 : 66}" width="60" height="38" rx="5"/><text x="${x}" y="${i % 2 ? 220 : 90}" text-anchor="middle">${n}</text></g>`).join('')}
  <path class="bs-pk" d="M40 150H450"/><path class="bs-pk bs-pk2" d="M40 150H450"/>`;
}

function motif(kind, slug, extra = {}) {
  const r = READOUT[slug] || READOUT[kind] || READOUT.hub;
  const svg = kind === 'ladder' ? ladder() : kind === 'wave' ? wave(slug) : kind === 'arm' ? arm() : kind === 'hmi' ? hmi() : kind === 'gears' ? gears() : kind === 'map' ? map(extra.cities, extra.cur) : bus();
  return `<figure class="lpx lpx-${kind}${extra.mini ? ' lpx-mini' : ''}" aria-hidden="true">
    ${extra.mini ? '' : `<figcaption class="lpx-bar"><i class="lpx-led"></i><span>${esc(r[0])}</span><b>${esc(r[1])}</b><span>${esc(r[2])}</span></figcaption>`}
    <svg viewBox="0 0 480 300" focusable="false">${svg}</svg>
  </figure>`;
}

/* ---------- Umumiy bloklar ---------- */
const stars = (v) => `<span class="stars-show" aria-hidden="true">${[1, 2, 3, 4, 5].map((n) => `<i class="${v >= n - 0.25 ? 'on' : v >= n - 0.75 ? 'half' : ''}"></i>`).join('')}</span>`;

function ratingBlock(t, lang, L, data) {
  const rs = data.rs || {}, fb = data.fb || {};
  const n = (rs.n || 0) + (fb.nv || 0);
  const avg = n ? Math.round((((rs.avg || 0) * (rs.n || 0)) + ((fb.service || 0) * (fb.nv || 0))) / n * 10) / 10 : 0;
  const quotes = (data.quotes || []).slice(0, 3);
  const home = url(lang, '');
  if (!n && !(fb.ns > 0)) {
    return `<div class="lp-rate is-empty reveal">${stars(0)}<p>${esc(L.noRating)}</p><a class="btn btn-ghost" href="${home}#trust">${esc(L.rateLink)}${icon('arrow')}</a></div>`;
  }
  return `<div class="lp-rate reveal">
    <div class="lp-score">${n ? `<div class="lp-big"><b>${avg.toFixed(1)}</b><span>${esc(L.ratingOf)}</span></div>${stars(avg)}<p class="muted">${n} ${esc(L.votes)}</p>` : ''}
      ${fb.ns > 0 ? `<p class="lp-site">${esc(L.siteRating)}: <b>${Number(fb.site).toFixed(1)}</b> · ${fb.ns} ${esc(L.votes)}</p>` : ''}
      <a class="btn btn-ghost" href="${home}#trust">${esc(L.rateLink)}</a></div>
    ${quotes.length ? `<ul class="lp-quotes">${quotes.map((q) => `<li>${stars(q.rating || 0)}<blockquote>${esc(q.text)}</blockquote><cite>${esc(q.name || '—')}${q.company ? `, ${esc(q.company)}` : ''}</cite></li>`).join('')}</ul>` : ''}
  </div>`;
}
const ratingLd = (data) => {
  const rs = data.rs || {}, fb = data.fb || {};
  const n = (rs.n || 0) + (fb.nv || 0);
  if (!n) return null;
  const avg = Math.round((((rs.avg || 0) * (rs.n || 0)) + ((fb.service || 0) * (fb.nv || 0))) / n * 10) / 10;
  return { '@type': 'AggregateRating', ratingValue: avg, reviewCount: n, bestRating: 5, worstRating: 1 };
};

function trustStrip(v3) {
  return `<section class="tz" aria-label="${esc(v3.trust.label)}"><div class="wrap">
    <ul class="tz-list">${v3.trust.items.map(([ic, a, x]) => `<li>${icon(ic)}<div><b>${esc(a)}</b><span>${esc(x)}</span></div></li>`).join('')}</ul>
  </div></section>`;
}
function ctas(t, cfg, L, svc) {
  const v3 = t.v3, tg = tgUser(cfg);
  return `<div class="cta-row">
    <a class="btn btn-primary btn-lg" href="#lp-form" data-ev="lp_order">${esc(L.cta)}${icon('arrow')}</a>
    ${cfg.phoneOpen ? `<a class="btn btn-ghost btn-lg" href="${telHref(cfg.phone)}" data-ev="lp_call">${icon('phone')}<span>${esc(cfg.phone)}</span></a>` : `<a class="btn btn-ghost btn-lg" href="#cb-form" data-ev="lp_call">${icon('phone')}<span>${esc(v3.cb.title)}</span></a>`}
    ${tg ? `<a class="btn btn-ghost btn-lg" href="https://t.me/${esc(tg)}" target="_blank" rel="noopener noreferrer" data-ev="lp_tg">${icon('send')}<span>${esc(v3.hero.tg)}</span></a>` : ''}
  </div>`;
}
const crumbs = (items) => `<nav class="crumbs lp-crumbs" aria-label="breadcrumb"><ol>${items.map(([n, h], i) => `<li>${h && i < items.length - 1 ? `<a href="${h}">${esc(n)}</a>` : `<span aria-current="page">${esc(n)}</span>`}</li>`).join('')}</ol></nav>`;
const ldCrumbs = (cfg, items) => ({ '@type': 'BreadcrumbList', itemListElement: items.map(([name, h], i) => ({ '@type': 'ListItem', position: i + 1, name, item: cfg.domain + h })) });

function hero(eyebrow, h1, lead, crumbHtml, side, extra = '') {
  return `<section class="lp-hero"><div class="hero-bg" aria-hidden="true"><div class="grid"></div></div>
    <div class="wrap lp-hero-in"><div class="lp-hero-copy">${crumbHtml}<p class="eyebrow">${esc(eyebrow)}</p><h1>${esc(h1)}</h1><p class="lead">${esc(lead)}</p>${extra}</div>${side}</div></section>`;
}
function serviceCards(lp, lang, cls = '') {
  return `<ul class="lp-cards${cls}">${lp.services.map((s) => `<li class="reveal"><a href="${url(lang, `services/${s.slug}/`)}">${motif(MOTIF[s.slug], s.slug, { mini: true })}<h3>${esc(s.name)}</h3><p>${esc(s.lead.length > 130 ? s.lead.slice(0, s.lead.lastIndexOf(' ', 128)) + '…' : s.lead)}</p><span class="lp-more">${esc(lp.l.more)}${icon('arrow')}</span></a></li>`).join('')}</ul>`;
}
const cityLinks = (lp, lang, cur) => `<ul class="lp-chips">${lp.cities.map(([s, n]) => `<li><a${s === cur ? ' aria-current="page"' : ''} href="${url(lang, `services/city/${s}/`)}">${icon('spark')}${esc(n)}</a></li>`).join('')}</ul>`;

function formSection(t, cfg, lang, L, svcName, faq) {
  return `<section class="section contact" id="lp-form" aria-labelledby="lp-form-t"><div class="wrap contact-in">
    <div class="contact-copy reveal"><h2 id="lp-form-t">${esc(L.cta)}</h2><p class="sec-lead">${esc(t.v2.contact.title)}</p>
      ${faq && faq.length ? `<h3 class="lp-faq-t">${esc(L.faq)}</h3><div class="faq">${faq.map(([q, a]) => `<details class="qa"><summary><span>${esc(q)}</span>${icon('plus', 'ic qa-ic')}</summary><p>${esc(a)}</p></details>`).join('')}</div>` : ''}</div>
    ${aiFormFor(t, cfg, { service: svcName })}
  </div></section>`;
}
const steps = (t) => `<ol class="steps steps-5 lp-steps">${t.v3.cat.steps.map(([h, x], i) => `<li class="step reveal"><span class="step-n">0${i + 1}</span><h3>${esc(h)}</h3><p>${esc(x)}</p></li>`).join('')}</ol>`;

/* ---------- Sahifalar ---------- */
export function renderLpHub(lang, t, cfg, data, ver) {
  const lp = t.lp, L = lp.l, sub = 'services/';
  const cr = [[cfg.brand, url(lang, '')], [lp.hub.eyebrow, url(lang, sub)]];
  const body = `<main id="main" class="v2 lp">
  ${hero(lp.hub.eyebrow, lp.hub.title, lp.hub.lead, crumbs(cr), motif('bus', 'hub'), ctas(t, cfg, L))}
  ${trustStrip(t.v3)}
  <section class="section" aria-labelledby="lp-svc"><div class="wrap">${secHead(lp.hub.eyebrow, L.services, '', 'lp-svc')}${serviceCards(lp, lang)}</div></section>
  <section class="section section-alt" aria-labelledby="lp-proc"><div class="wrap">${secHead(lp.hub.eyebrow, L.process, '', 'lp-proc')}${steps(t)}</div></section>
  <section class="section" aria-labelledby="lp-rt"><div class="wrap">${secHead(lp.hub.eyebrow, L.rating, '', 'lp-rt')}${ratingBlock(t, lang, L, data)}</div></section>
  <section class="section section-alt lp-map-sec" aria-labelledby="lp-ct"><div class="wrap lp-two">${motif('map', 'city', { cities: lp.cities, cur: 'toshkent' })}<div>${secHead(lp.hub.eyebrow, L.cities, '', 'lp-ct')}${cityLinks(lp, lang)}</div></div></section>
  ${formSection(t, cfg, lang, L, '', null)}
</main>`;
  const r = ratingLd(data);
  const jsonLd = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'ItemList', name: lp.hub.title, itemListElement: lp.services.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.name, url: cfg.domain + url(lang, `services/${s.slug}/`) })) },
    { '@type': 'LocalBusiness', '@id': cfg.domain + '/#org', name: cfg.brand, url: cfg.domain + url(lang, ''), ...(r ? { aggregateRating: r } : {}) },
    ldCrumbs(cfg, cr)
  ] };
  return layout({ lang, t, cfg, sub, title: lp.hub.metaTitle, description: lp.hub.metaDesc, body, jsonLd, assetVer: ver });
}

export function renderLpService(lang, t, cfg, slug, data, ver) {
  const lp = t.lp, L = lp.l, s = lp.services.find((x) => x.slug === slug);
  if (!s) return null;
  const sub = `services/${slug}/`, kind = MOTIF[slug];
  const cr = [[cfg.brand, url(lang, '')], [lp.hub.eyebrow, url(lang, 'services/')], [s.name, url(lang, sub)]];
  const others = lp.services.filter((x) => x.slug !== slug && MOTIF[x.slug] === kind).concat(lp.services.filter((x) => x.slug !== slug && MOTIF[x.slug] !== kind)).slice(0, 3);
  const body = `<main id="main" class="v2 lp lp-k-${kind}">
  ${hero(lp.hub.eyebrow, s.h1, s.lead, crumbs(cr), motif(kind, slug), ctas(t, cfg, L))}
  ${trustStrip(t.v3)}
  <section class="section" aria-label="${esc(s.name)}"><div class="wrap lp-two lp-sw">
    <div class="lp-col reveal"><h2>${esc(L.symptoms)}</h2><ul class="lp-sym">${s.symptoms.map((x) => `<li><i class="lp-fault" aria-hidden="true"></i><span>${esc(x)}</span></li>`).join('')}</ul></div>
    <div class="lp-col reveal"><h2>${esc(L.work)}</h2><ol class="lp-work">${s.work.map((x, i) => `<li><span class="mono">${String(i + 1).padStart(2, '0')}</span><span>${esc(x)}</span></li>`).join('')}</ol></div>
  </div></section>
  <section class="section section-alt" aria-labelledby="lp-pr"><div class="wrap lp-two lp-pricing">
    <div class="lp-price reveal"><p class="eyebrow">${esc(L.price)}</p><h2 id="lp-pr">${esc(s.price)}</h2><p>${esc(L.priceNote)}</p>
      <a class="btn btn-primary" href="#lp-form" data-ev="lp_price">${esc(L.ask)}${icon('arrow')}</a></div>
    ${callbackForm(t.v3.cb, lang, s.name)}
  </div></section>
  <section class="section" aria-labelledby="lp-proc"><div class="wrap">${secHead(s.name, L.process, '', 'lp-proc')}${steps(t)}</div></section>
  <section class="section section-alt" aria-labelledby="lp-rt"><div class="wrap">${secHead(s.name, L.rating, '', 'lp-rt')}${ratingBlock(t, lang, L, data)}</div></section>
  ${formSection(t, cfg, lang, L, s.name, s.faq)}
  <section class="section" aria-labelledby="lp-rel"><div class="wrap">${secHead(lp.hub.eyebrow, L.related, '', 'lp-rel')}
    <ul class="lp-cards lp-cards-3">${others.map((o) => `<li class="reveal"><a href="${url(lang, `services/${o.slug}/`)}">${motif(MOTIF[o.slug], o.slug, { mini: true })}<h3>${esc(o.name)}</h3><span class="lp-more">${esc(L.more)}${icon('arrow')}</span></a></li>`).join('')}</ul>
    <h3 class="lp-sub">${esc(L.cities)}</h3>${cityLinks(lp, lang)}</div></section>
</main>`;
  const pageUrl = cfg.domain + url(lang, sub), r = ratingLd(data);
  const jsonLd = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Service', name: s.name, serviceType: s.name, description: s.metaDesc, url: pageUrl, inLanguage: lang, provider: { '@id': cfg.domain + '/#org' },
      areaServed: lp.cities.map(([, n]) => ({ '@type': 'City', name: n })), ...(r ? { aggregateRating: r } : {}) },
    { '@type': 'FAQPage', mainEntity: s.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    ldCrumbs(cfg, cr)
  ] };
  return layout({ lang, t, cfg, sub, title: s.metaTitle, description: s.metaDesc, body, jsonLd, assetVer: ver });
}

export function renderLpCity(lang, t, cfg, citySlug, data, ver) {
  const lp = t.lp, L = lp.l, city = lp.cities.find(([s]) => s === citySlug);
  if (!city) return null;
  const c = city[1], C = lp.city, f = (x) => fmt(x, { c });
  const sub = `services/city/${citySlug}/`;
  const cr = [[cfg.brand, url(lang, '')], [lp.hub.eyebrow, url(lang, 'services/')], [c, url(lang, sub)]];
  const body = `<main id="main" class="v2 lp lp-k-map">
  ${hero(lp.hub.eyebrow, f(C.title), f(C.lead), crumbs(cr), motif('map', 'city', { cities: lp.cities, cur: citySlug }), ctas(t, cfg, L))}
  ${trustStrip(t.v3)}
  <section class="section" aria-labelledby="lp-how"><div class="wrap">${secHead(c, L.process, '', 'lp-how')}
    <ol class="lp-how">${C.how.map(([h, x], i) => `<li class="reveal"><span class="lp-how-n">${String(i + 1).padStart(2, '0')}</span><h3>${esc(f(h))}</h3><p>${esc(f(x))}</p></li>`).join('')}</ol></div></section>
  <section class="section section-alt" aria-labelledby="lp-svc"><div class="wrap">${secHead(c, f(C.servicesTitle), '', 'lp-svc')}${serviceCards(lp, lang)}</div></section>
  <section class="section" aria-labelledby="lp-rt"><div class="wrap">${secHead(c, L.rating, '', 'lp-rt')}${ratingBlock(t, lang, L, data)}</div></section>
  ${formSection(t, cfg, lang, L, '', null)}
  <section class="section section-alt" aria-labelledby="lp-ct"><div class="wrap">${secHead(lp.hub.eyebrow, L.cities, '', 'lp-ct')}${cityLinks(lp, lang, citySlug)}</div></section>
</main>`;
  const pageUrl = cfg.domain + url(lang, sub), r = ratingLd(data);
  const jsonLd = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Service', name: f(C.title), description: f(C.metaDesc), url: pageUrl, inLanguage: lang, provider: { '@id': cfg.domain + '/#org' }, areaServed: { '@type': 'City', name: c },
      hasOfferCatalog: { '@type': 'OfferCatalog', name: f(C.servicesTitle), itemListElement: lp.services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, url: cfg.domain + url(lang, `services/${s.slug}/`) } })) }, ...(r ? { aggregateRating: r } : {}) },
    ldCrumbs(cfg, cr)
  ] };
  return layout({ lang, t, cfg, sub, title: f(C.metaTitle), description: f(C.metaDesc), body, jsonLd, assetVer: ver });
}

export const LP_SLUGS = Object.keys(MOTIF);
export const LP_CITIES = Object.keys(CITY_XY);
