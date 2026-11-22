// 5-bosqich: PLC ta'miri, kafolat va sifat, to'xtash narxi kalkulyatori (bosh sahifa bo'limlari va alohida sahifalar).
import { layout, esc, icon, url, secHead, aiFormFor, portfolioCard } from './template.mjs';
import { plcRack, ladder, faultPic, sart } from './art.mjs';
import { plcScene } from './scene.mjs';

const link = (lang, mode, sub) => (mode === 'preview' ? '#' : url(lang, sub));
const crumbsLd = (items) => ({ '@type': 'BreadcrumbList', itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) });
const jsonScript = (id, data) => `<script type="application/json" id="${id}">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

/* ---------- Bosh sahifa: PLC ---------- */
export function homePlc(t, lang, cfg, mode) {
  const p = t.plc;
  return `<section class="section plc-band" id="plc" aria-labelledby="plc-title">
    <div class="wrap plc-in">
      <div class="plc-copy reveal">
        ${secHead(p.eyebrow, p.title, p.homeLead, 'plc-title', '', 'plcmini')}
        <ul class="plc-points">${p.points.map((x) => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul>
        <div class="cta-row"><a class="btn btn-primary" href="${link(lang, mode, 'plc/')}" data-ev="plc_home">${icon('plc')}${esc(p.more)}</a><a class="btn btn-ghost" href="#contact" data-ev="plc_home_req">${esc(p.cta)}</a></div>
      </div>
      <figure class="plc-fig plc-photo reveal">${plcScene(p.eyebrow)}<figcaption>${ladder('Ladder')}<span>LAD · OB1 · NW 1–3</span></figcaption></figure>
    </div>
  </section>`;
}

/* ---------- Kafolatni tekshirish formasi (bosh sahifa va /warranty/) ---------- */
function wCheck(t, lang, mode) {
  const w = t.warranty;
  return `<form class="w-check" id="w-form" novalidate data-lang="${lang}" data-active="${esc(w.active)}" data-expired="${esc(w.expired)}" data-not-done="${esc(w.notDone)}" data-not-found="${esc(w.notFound)}" data-until="${esc(w.until)}" data-since="${esc(w.since)}" data-left="${esc(w.left)}" data-err-rate="${esc(t.track.errRate)}" data-claim-href="${mode === 'preview' ? '#contact' : `${url(lang, '')}#contact`}" data-claim="${esc(w.claimBtn)}">
    <h3>${icon('shield')}${esc(w.checkTitle)}</h3>
    <p>${esc(w.checkLead)}</p>
    <div class="w-row"><label class="vh" for="w-code">${esc(w.code)}</label><input id="w-code" name="code" type="text" placeholder="TX-XXXX-XXXX" maxlength="12" autocomplete="off" spellcheck="false" required><button class="btn btn-primary" type="submit">${esc(w.check)}</button></div>
    <div class="w-res" id="w-res" hidden aria-live="polite"></div>
  </form>`;
}

/* ---------- Bosh sahifa: kafolat ---------- */
export function homeWarranty(t, lang, cfg, mode) {
  const w = t.warranty;
  return `<section class="section section-alt w-band" id="warranty" aria-labelledby="w-title">
    <div class="wrap">
      <div class="sec-head-row">${secHead(w.eyebrow, w.title, w.homeLead, 'w-title', '', 'stamp')}<a class="btn btn-ghost" href="${link(lang, mode, 'warranty/')}">${esc(w.more)}${icon('arrow')}</a></div>
      <div class="w-grid">
        <ul class="pillars">${w.pillars.map((x, i) => `<li class="pillar reveal p-${esc(x.k)}"><span class="pl-n">0${i + 1}</span>${icon(x.k === 'auth' ? 'qr' : x.k === 'qual' ? 'probe' : 'shield')}<h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></li>`).join('')}</ul>
        <div class="w-side reveal"><div class="seal" aria-hidden="true"><svg viewBox="0 0 160 160"><circle class="sl-o" cx="80" cy="80" r="72"/><circle class="sl-i" cx="80" cy="80" r="58"/><path id="sl-arc" class="sl-arc" d="M80 80m-64 0a64 64 0 1 1 128 0a64 64 0 1 1-128 0"/><text class="sl-t"><textPath href="#sl-arc">${esc(`${w.stamp} · ${cfg.brand.toUpperCase()} · ${w.stamp} · `)}</textPath></text><text class="sl-big" x="80" y="88" text-anchor="middle">${esc(w.stampSub)}</text></svg></div>${wCheck(t, lang, mode)}</div>
      </div>
    </div>
  </section>`;
}

/* ---------- Bosh sahifa: to'xtash narxi kalkulyatori ---------- */
export function homeDowntime(t, lang) {
  const d = t.downtime;
  const num = (id, label, v, hint = '') => `<div class="field"><label for="${id}">${esc(label)}</label><input id="${id}" type="number" inputmode="numeric" min="0" step="any" value="${v}">${hint ? `<small>${esc(hint)}</small>` : ''}</div>`;
  return `<section class="section dt-band" id="downtime" aria-labelledby="dt-title">
    <div class="wrap dt-in">
      <div class="reveal">${secHead(d.eyebrow, d.title, d.lead, 'dt-title', '', 'gauge')}</div>
      <form class="dt reveal" id="dt-form" data-lang="${lang}" data-cur="${esc(d.cur)}">
        <div class="dt-in-f">${num('dt-h', d.perHour, 5000000, d.perHourHint)}${num('dt-n', d.hours, 4)}${num('dt-m', d.times, 2)}</div>
        <dl class="dt-out"><div><dt>${esc(d.perEvent)}</dt><dd><output id="dt-e" for="dt-h dt-n">0</output></dd></div><div><dt>${esc(d.perMonth)}</dt><dd><output id="dt-mo" for="dt-h dt-n dt-m">0</output></dd></div><div class="dt-y"><dt>${esc(d.perYear)}</dt><dd><output id="dt-y" for="dt-h dt-n dt-m">0</output></dd></div></dl>
        <p class="dt-half">${icon('bolt')}<span>${esc(d.half)}:</span> <b id="dt-half">0</b></p>
        <a class="btn btn-primary" href="#contact" data-ev="downtime_cta">${esc(d.cta)}${icon('arrow')}</a>
      </form>
    </div>
  </section>`;
}

/* ---------- PLC chiroqlari bo'yicha tashxis ---------- */
function ledTool(t, lang, mode) {
  const p = t.plc; const l = p.led;
  const rows = [['power', l.power, ['off', 'on'], 'on', 'led-g'], ['run', l.run, ['off', 'on', 'blink'], 'on', 'led-g'], ['err', l.err, ['off', 'on', 'blink'], 'off', 'led-r'], ['bus', l.bus, ['off', 'on', 'blink'], 'off', 'led-r'], ['maint', l.maint, ['off', 'on', 'blink'], 'off', 'led-y']];
  const panel = `<svg class="lt-panel" viewBox="0 0 120 190" aria-hidden="true" focusable="false"><rect class="pm-box" x="10" y="6" width="100" height="178" rx="5"/><path class="pm-ln" d="M10 28h100M10 160h100"/><text class="slb" x="18" y="21">CPU</text>${rows.map(([k, , , def, cls], i) => `<circle class="led ${cls} lt-l st-${def}" id="lt-${k}" cx="28" cy="${48 + i * 24}" r="5"/><text class="slb s" x="40" y="${52 + i * 24}">${esc(k.toUpperCase())}</text>`).join('')}<rect class="pm-ln" x="70" y="166" width="30" height="12" rx="2"/></svg>`;
  return `<section class="section section-alt" id="led" aria-labelledby="led-title"><div class="wrap">
    ${secHead(p.eyebrow, p.ledTitle, p.ledLead, 'led-title', '', 'scan')}
    <form class="led-tool reveal" id="led-tool" data-off="${esc(l.off)}">
      ${panel}
      <div class="lt-rows">${rows.map(([k, label, opts, def]) => `<fieldset class="lt-row"><legend>${esc(label)}</legend><div class="seg">${opts.map((o) => `<label><input type="radio" name="lt-${k}" value="${o}"${o === def ? ' checked' : ''}><span>${esc(l[o])}</span></label>`).join('')}</div></fieldset>`).join('')}</div>
      <div class="lt-res" aria-live="polite"><p class="eyebrow">${esc(l.result)}</p><h3 id="lt-t">${esc(p.results.ok.t)}</h3><p id="lt-x">${esc(p.results.ok.x)}</p><ol id="lt-s">${p.results.ok.s.map((x) => `<li>${esc(x)}</li>`).join('')}</ol><a class="btn btn-primary" href="${mode === 'preview' ? '#contact' : '#plc-form'}" data-ev="led_send">${icon('camera')}${esc(l.send)}</a><small>${esc(l.note)}</small></div>
    </form>
    ${jsonScript('led-data', p.results)}
  </div></section>`;
}

/* ---------- /plc/ sahifasi ---------- */
export function renderPlc(lang, t, cfg, { cases = [] } = {}, ver) {
  const p = t.plc;
  const sub = 'plc/';
  const body = `<main id="main">
  <section class="page-hero plc-hero"><div class="hero-bg" aria-hidden="true"><div class="grid"></div><div class="scan"></div></div>
    <div class="wrap plc-hero-in">
      <div><p class="eyebrow">${esc(p.eyebrow)}</p><h1>${esc(p.title)}</h1><p class="lead">${esc(p.lead)}</p>
        <div class="cta-row"><a class="btn btn-primary btn-lg" href="#plc-form" data-ev="plc_hero">${icon('camera')}${esc(p.cta)}</a><a class="btn btn-ghost btn-lg" href="#led">${icon('probe')}${esc(p.ledTitle)}</a></div></div>
      <figure class="plc-fig plc-photo">${plcScene(p.eyebrow)}</figure>
    </div>
  </section>

  <section class="section section-tight" aria-labelledby="pf-plat"><div class="wrap plat-in">
    <div>${secHead(p.eyebrow, p.platformsTitle, '', 'pf-plat', '', 'plcmini')}<figure class="ladder-fig reveal">${plcRack(p.eyebrow)}${ladder('Ladder logic')}<figcaption>DIN 35 · LAD · OB1</figcaption></figure></div>
    <ul class="plat">${p.platforms.map(([b, m, sw]) => `<li class="reveal"><b>${esc(b)}</b><span>${esc(m)}</span><small>${icon('code')}${esc(sw)}</small></li>`).join('')}</ul>
  </div></section>

  <section class="section" id="faults" aria-labelledby="faults-title"><div class="wrap">
    ${secHead(p.eyebrow, p.faultsTitle, p.faultsLead, 'faults-title', '', 'alarm')}
    <ul class="faults">${p.faults.map((f, i) => `<li class="fault reveal" id="f-${esc(f.pic)}"><figure class="fault-pic">${faultPic(f.pic)}<span class="fp-n">FIG. ${String(i + 1).padStart(2, '0')}</span></figure><div class="fault-body"><h3>${esc(f.title)}</h3><p class="f-sym"><b>${esc(p.symptom)}:</b> ${esc(f.symptom)}</p><h4>${esc(p.causes)}</h4><ul>${f.causes.map((c) => `<li>${esc(c)}</li>`).join('')}</ul><p class="f-fix">${icon('wrench')}<span><b>${esc(p.fix)}:</b> ${esc(f.fix)}</span></p></div></li>`).join('')}</ul>
  </div></section>

  ${ledTool(t, lang, 'prod')}

  <section class="section" aria-labelledby="plc-proc"><div class="wrap">
    ${secHead(p.eyebrow, p.processTitle, '', 'plc-proc', '', 'conveyor')}
    <ol class="steps steps-5">${p.process.map((s, i) => `<li class="step reveal"><span class="step-n">0${i + 1}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join('')}</ol>
    <p class="plans-note">${icon('shield')}<a href="${url(lang, 'warranty/')}">${esc(t.warranty.title)}</a></p>
  </div></section>

  ${cases.length ? `<section class="section section-alt" aria-labelledby="plc-cases"><div class="wrap">${secHead(t.portfolio.eyebrow, p.casesTitle, '', 'plc-cases', '', 'caliper')}<ul class="pf-grid">${cases.slice(0, 6).map((x) => portfolioCard(t, lang, x, 'prod')).join('')}</ul></div></section>` : ''}

  <section class="section section-alt contact" id="plc-form" aria-labelledby="plc-form-title"><div class="wrap contact-in">
    <div class="contact-copy reveal"><p class="eyebrow">${esc(t.ai.eyebrow)}</p><h2 id="plc-form-title">${esc(p.cta)}</h2><p class="sec-lead">${esc(t.ai.lead)}</p>
      <div class="faq">${p.faq.map((f) => `<details class="qa"><summary><span>${esc(f.q)}</span>${icon('plus', 'ic qa-ic')}</summary><p>${esc(f.a)}</p></details>`).join('')}</div></div>
    ${aiFormFor(t, cfg, { service: p.svc })}
  </div></section>
</main>`;
  const pageUrl = cfg.domain + url(lang, sub);
  const jsonLd = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Service', name: p.svc, serviceType: 'PLC repair', description: t.meta5.plcDesc, url: pageUrl, inLanguage: lang, provider: { '@id': cfg.domain + '/#org' }, areaServed: { '@type': 'Country', name: 'Uzbekistan' } },
    { '@type': 'FAQPage', mainEntity: p.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    crumbsLd([[cfg.brand, cfg.domain + url(lang, '')], [t.nav5.plc, pageUrl]])
  ] };
  return layout({ lang, t, cfg, sub, title: t.meta5.plcTitle, description: t.meta5.plcDesc, keywords: 'PLC ta’miri, PLC remonti, PLC dasturlash, ремонт ПЛК, программирование ПЛК, восстановление программы ПЛК, PLC repair, PLC programming, Siemens S7-1200, S7-1500, S7-300, S7-400, LOGO!, ET 200, TIA Portal, Step 7, Mitsubishi FX, Mitsubishi Q, Omron CP1, Omron NJ, Allen-Bradley CompactLogix, Delta DVP, Schneider Modicon, Profinet, Profibus, CPU STOP, SF BF xatosi, ошибка SF BF, HMI, PLC monitoring, мониторинг ПЛК', body, jsonLd, assetVer: ver });
}

/* ---------- /warranty/ sahifasi ---------- */
export function renderWarranty(lang, t, cfg, ver) {
  const w = t.warranty;
  const sub = 'warranty/';
  const list = (items, ic, cls = '') => `<ul class="w-list${cls}">${items.map((x) => `<li>${icon(ic)}<span>${esc(x)}</span></li>`).join('')}</ul>`;
  const body = `<main id="main">
  <section class="page-hero w-hero"><div class="hero-bg" aria-hidden="true"><div class="grid"></div></div>
    <div class="wrap w-hero-in"><div><p class="eyebrow">${esc(w.eyebrow)}</p><h1>${esc(w.title)}</h1><p class="lead">${esc(w.lead)}</p></div>${sart('stamp').replace('class="sa sa-stamp"', 'class="sa sa-stamp sa-xl"')}</div>
  </section>
  <section class="section section-tight"><div class="wrap">
    <ul class="pillars">${w.pillars.map((x, i) => `<li class="pillar reveal p-${esc(x.k)}"><span class="pl-n">0${i + 1}</span>${icon(x.k === 'auth' ? 'qr' : x.k === 'qual' ? 'probe' : 'shield')}<h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></li>`).join('')}</ul>
  </div></section>
  <section class="section section-alt" aria-labelledby="w-terms"><div class="wrap w-cols">
    <div class="reveal">${secHead(w.eyebrow, w.termsTitle, '', 'w-terms', '', 'stamp')}${list(w.terms, 'check')}</div>
    <div class="reveal w-not"><h3>${esc(w.notTitle)}</h3>${list(w.not, 'x', ' w-list-not')}</div>
  </div></section>
  <section class="section" aria-labelledby="w-auth"><div class="wrap w-cols">
    <div class="reveal">${secHead(w.pillars[0].title, w.authTitle, '', 'w-auth', '', 'magnifier')}${list(w.auth, 'qr')}</div>
    <div class="reveal">${secHead(w.pillars[1].title, w.qualTitle, '', 'w-qual', '', 'clip')}<ol class="w-qc">${w.qual.map((x, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span>${esc(x)}<i aria-hidden="true">${icon('check')}</i></li>`).join('')}</ol></div>
  </div></section>
  <section class="section section-alt" id="claim" aria-labelledby="w-claim"><div class="wrap w-cols">
    <div class="reveal">${secHead(w.eyebrow, w.claimTitle, '', 'w-claim', '', 'conveyor')}<ol class="steps steps-3">${w.claim.map((s, i) => `<li class="step"><span class="step-n">0${i + 1}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join('')}</ol></div>
    <div class="reveal">${wCheck(t, lang, 'prod')}</div>
  </div></section>
</main>`;
  const pageUrl = cfg.domain + url(lang, sub);
  const jsonLd = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', name: t.meta5.warrantyTitle, url: pageUrl, inLanguage: lang, about: { '@id': cfg.domain + '/#org' } },
    crumbsLd([[cfg.brand, cfg.domain + url(lang, '')], [w.title, pageUrl]])
  ] };
  return layout({ lang, t, cfg, sub, title: t.meta5.warrantyTitle, description: t.meta5.warrantyDesc, keywords: t.meta9.kw.warranty, body, jsonLd, assetVer: ver });
}
