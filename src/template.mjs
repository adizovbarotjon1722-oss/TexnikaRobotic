import fs from 'fs';
// Sahifa shablonlari. Server (SSR) va statik preview ikkalasi ham shu fayldan foydalanadi.
// mode = 'prod'    : server render, qat'iy CSP, alohida /assets fayllari.
// mode = 'preview' : bitta faylli ko'rib chiqish (Artifact), tillar <template> orqali almashadi.
import { brands } from './content.mjs';
import { LANGS, fmt } from './i18n.mjs';
import { homePlc, homeWarranty, homeDowntime } from './template4.mjs';
import { megaMenu, homeSupport, homeQuality } from './template5.mjs';
import { homeMonitoring } from './template7.mjs';
import { home2 } from './template8.mjs';

export { LANGS };
export const langPrefix = (l) => (l === 'uz' ? '' : `/${l}`);
export const url = (l, sub = '') => `${langPrefix(l)}/${sub}`;
export const langPath = (l) => url(l, '');

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const LANG_META = {
  uz: { name: 'O‘zbekcha', short: 'UZ', og: 'uz_UZ' },
  ru: { name: 'Русский', short: 'RU', og: 'ru_RU' },
  en: { name: 'English', short: 'EN', og: 'en_US' }
};

const ICONS = {
  star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
  chart: '<path d="M3 20h18"/><path d="M5 16l4-5 4 3 6-8"/><circle cx="19" cy="6" r="1.4"/>',
  team: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c.7-3.6 3.1-5.5 6-5.5s5.3 1.9 6 5.5"/><path d="M16 5.2a3 3 0 010 5.6M17.5 14.8c1.8.6 3 2.4 3.5 5.2"/>',
  robot: '<path d="M4 20h9"/><path d="M6 20v-3l3-2"/><circle cx="9" cy="15" r="1.6"/><path d="M10.2 13.8 15 9"/><circle cx="16" cy="8" r="1.6"/><path d="M17.4 8.8 20 11"/><path d="M19 12.5l2 1.5M20.5 10l1.5-.5"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4 5.3 5.3"/><circle cx="12" cy="12" r="6.5"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 2.5v3.5M15 2.5v3.5M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5"/>',
  bolt: '<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6l1-8z"/>',
  doc: '<path d="M14 2.5H6.5A1.5 1.5 0 0 0 5 4v16a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 20V7.5z"/><path d="M14 2.5v5h5"/><path d="M8.5 13l2 2 4-4.5"/><path d="M8.5 18h7"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.3L3.5 17.4a1.5 1.5 0 0 0 2.1 2.1l5.8-5.8a4 4 0 0 0 5.3-5.4l-2.6 2.6-2.2-.6-.6-2.2z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  phone: '<path d="M5 3.5h3.5l1.7 4.3-2.2 1.4a11 11 0 0 0 6.8 6.8l1.4-2.2 4.3 1.7V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.1 1.5 1.5 0 0 1 5 3.5z"/>',
  send: '<path d="M21.5 3 2.5 10.5l7 2.5 2.5 7z"/><path d="M21.5 3 9.5 13"/>',
  chat: '<path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/><path d="M9 10.5c.5 2 2.5 4 4.5 4.5l1.3-1.3 2 1-.3 1.3c-3.5.5-8-4-7.5-7.5L10.3 8l1 2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m3.5 6 8.5 7 8.5-7"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="1.5"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  camera: '<path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.5"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/><circle cx="12" cy="12" r="2"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  cap: '<path d="M2.5 9 12 4.5 21.5 9 12 13.5z"/><path d="M6.5 11v5c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-5"/><path d="M21.5 9v5"/>',
  shield: '<path d="M12 3 4.5 6v5.5c0 4.5 3.2 8.3 7.5 9.5 4.3-1.2 7.5-5 7.5-9.5V6z"/><path d="m8.8 12 2.2 2.2 4.2-4.4"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  qr: '<rect x="3.5" y="3.5" width="6" height="6" rx="1"/><rect x="14.5" y="3.5" width="6" height="6" rx="1"/><rect x="3.5" y="14.5" width="6" height="6" rx="1"/><path d="M14.5 14.5h2.5v2.5M20.5 14.5v.01M14.5 20.5h.01M17.5 20.5h3v-3"/>',
  code: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4.5l-3 15"/>',
  print: '<path d="M7 8V3.5h10V8"/><rect x="3.5" y="8" width="17" height="8" rx="1.5"/><path d="M7 13.5h10v7H7z"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="1.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/><path d="M12 14.5v2.5"/>',
  probe: '<path d="M3 12h3l2-5 3 10 2.5-7 1.5 2h6"/>',
  alert: '<path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4.5M12 17.5v.01"/>',
  plc: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M9 5v14M15 5v14"/><path d="M5.5 9h1M5.5 12h1M11.5 9h1M11.5 12h1M11.5 15h1M17.5 9h1M17.5 12h1"/>',
  user: '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20.5c1.2-4 4-6 7.5-6s6.3 2 7.5 6"/>',
  play: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9v6l5-3z"/>',
  book: '<path d="M4 4.5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4z"/><path d="M20 4.5h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6z"/>',
  device: '<rect x="3" y="4.5" width="13" height="10" rx="1.2"/><path d="M6.5 18.5h6"/><rect x="17.5" y="8" width="4" height="11.5" rx="1"/>',
  logout: '<path d="M14 4.5h4.5a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H14"/><path d="M10 16.5 5.5 12 10 7.5M5.5 12H15"/>',
  home: '<path d="M3.5 11 12 4l8.5 7"/><path d="M6 9.5v10h12v-10"/>',
  stamp: '<path d="M9 3.5h6l-1 7h-4z"/><path d="M5 14.5c0-2 1.5-4 4-4h6c2.5 0 4 2 4 4v2H5z"/><path d="M4 20.5h16"/>'
};
export const icon = (n, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[n] || ''}</svg>`;

export const logo = `<svg class="logo-mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path class="lm-hex" d="M16 2.5 27.7 9.25v13.5L16 29.5 4.3 22.75V9.25z"/><circle class="lm-core" cx="16" cy="16" r="4.2"/><path class="lm-arm" d="M16 16 22.5 10.5M22.5 10.5l2.6 2.4"/></svg>`;


// Portfel rasmi bo'lmasa: brendga mos chizma uslubidagi muqova
// Bosh ko'rinish: haqiqiy robot videosi (ovozsiz, tsikl). Preview faylida faqat birinchi kadr.
const HERO_POSTER = '/assets/img/hero-robot.jpg';
let posterData = '';
export function heroVideo(mode, cfg) {
  if (mode === 'preview') {
    if (!posterData) posterData = 'data:image/jpeg;base64,' + fs.readFileSync(new URL('../public/assets/img/hero-robot.jpg', import.meta.url)).toString('base64');
    return `<img class="hero-video" src="${posterData}" alt="" width="1080" height="1920">`;
  }
  const pos = ['top', 'center', 'bottom', 'left', 'right'].includes(cfg?.hero?.pos) ? cfg.hero.pos : 'top';
  if (cfg?.hero?.src) return `<video class="hero-video hv-${pos}" autoplay muted loop playsinline preload="metadata"><source src="${esc(cfg.hero.src)}" type="${esc(cfg.hero.type)}"></video>`;
  return `<video class="hero-video hv-${pos}" autoplay muted loop playsinline preload="metadata" poster="${HERO_POSTER}" width="1080" height="1920"><source src="/assets/video/hero-robot.webm" type="video/webm"><source src="/assets/video/hero-robot.mp4" type="video/mp4"></video>`;
}

export const realEmail = (cfg) => !!cfg.email && !/@example\./i.test(cfg.email);

export function coverSvg(p) {
  const kind = p.cover || 'robot';
  const art = {
    kuka: '<path class="cv-body" d="M70 150 80 120h40l8 30z"/><path class="cv-body" d="M95 120c-4-30 0-50 4-70h14c4 20 6 40 2 70z"/><path class="cv-body" d="M104 50h70c8 0 10 12 0 14h-70z"/><circle class="cv-j" cx="104" cy="57" r="9"/><circle class="cv-j" cx="104" cy="120" r="11"/>',
    abb: '<path class="cv-body" d="M70 150 78 124h44l8 26z"/><path class="cv-body" d="M92 124 112 64l14 6-18 56z"/><path class="cv-body" d="M118 66l62-18 4 13-62 18z"/><circle class="cv-j" cx="119" cy="68" r="9"/><circle class="cv-j" cx="100" cy="124" r="11"/>',
    plc: '<rect class="cv-body" x="56" y="44" width="128" height="96" rx="4"/><path class="cv-line" d="M88 44v96M120 44v96M152 44v96M56 62h128"/><circle class="cv-j" cx="70" cy="80" r="4"/><path class="cv-line" d="M98 76h12M98 88h12M98 100h12M130 76h12M130 88h12M162 76h12M162 88h12"/>',
    drive: '<rect class="cv-body" x="78" y="40" width="84" height="110" rx="6"/><rect class="cv-screen" x="92" y="56" width="56" height="24" rx="2"/><path class="cv-line" d="M92 96h56M92 108h56M92 120h40"/><circle class="cv-j" cx="140" cy="132" r="6"/>',
    robot: '<path class="cv-body" d="M70 150 80 120h40l8 30z"/><path class="cv-body" d="M95 120 110 60h14l-10 60z"/><circle class="cv-j" cx="104" cy="120" r="11"/>'
  }[kind] || '';
  return `<svg class="cover-svg" viewBox="0 0 240 170" aria-hidden="true" focusable="false"><defs><pattern id="cvg-${esc(p.slug)}" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M12 0H0V12" class="cv-grid"/></pattern></defs><rect width="240" height="170" fill="url(#cvg-${esc(p.slug)})"/>${art}<text x="228" y="26" text-anchor="end" class="cv-brand">${esc(p.brand || '')}</text><text x="228" y="160" text-anchor="end" class="cv-model">${esc((p.model || '').length > 28 ? p.model.slice(0, 27) + '…' : (p.model || ''))}</text></svg>`;
}

/* ---------- Umumiy qismlar ---------- */

function header(t, lang, sub, mode, cfg) {
  const home = url(lang, '');
  const nav = [
    [url(lang, 'academy/'), t.v2.nav.training, 'academy/'],
    [url(lang, 'monitoring/'), t.v2.nav.mon, 'monitoring/'],
    [url(lang, 'robots/'), t.v2.nav.robots, 'robots/'],
    [url(lang, 'documents/'), t.v2.nav.docs, 'documents/'],
    [url(lang, 'team/'), t.v2.nav.team, 'team/'],
    [url(lang, 'support/'), t.v2.nav.help, 'support/']
  ];
  const langLinks = LANGS.map((l) => {
    const m = LANG_META[l];
    const cur = l === lang;
    if (mode === 'preview') return `<button type="button" class="lang-opt${cur ? ' is-current' : ''}" data-lang-switch="${l}" lang="${l}" aria-pressed="${cur}" title="${esc(m.name)}">${m.short}</button>`;
    return `<a class="lang-opt${cur ? ' is-current' : ''}" href="${url(l, sub)}" hreflang="${l}" lang="${l}"${cur ? ' aria-current="true"' : ''} title="${esc(m.name)}">${m.short}</a>`;
  }).join('');
  return `
<a class="skip" href="#main">${esc(t.a11y.skip)}</a>
<header class="site-header" id="top"><span class="scroll-prog" aria-hidden="true"></span>
  <div class="wrap hdr">
    <a class="brand" href="${mode === 'preview' ? '#top' : home}">${logo}<span class="brand-name">${esc(cfg.brand)}</span></a>
    <nav class="nav" id="site-nav" aria-label="${esc(t.a11y.menu)}">
      <ul>${nav.map(([href, label, key]) => `<li><a href="${href}"${sub && (sub === key || (key.endsWith('/') && key.length > 1 && sub.startsWith(key))) ? ' aria-current="page" class="is-active"' : ''}>${esc(label)}</a></li>`).join('')}</ul>
    </nav>
    <div class="hdr-tools">
      ${megaMenu(t, lang, mode)}
      <div class="lang" role="group" aria-label="${esc(t.a11y.lang)}">${langLinks}</div>
      <button type="button" class="icon-btn theme-toggle" aria-label="${esc(t.a11y.theme)}" title="${esc(t.a11y.theme)}">${icon('sun', 'ic i-sun')}${icon('moon', 'ic i-moon')}</button>
      ${mode === 'preview' ? '' : `<a class="icon-btn hdr-acc" href="${url(lang, 'account/')}" data-in="${esc(t.acc.navLabel)}" data-out="${esc(t.acc.signIn)}" aria-label="${esc(t.acc.navLabel)}" title="${esc(t.acc.navLabel)}"${sub === 'account/' ? ' aria-current="page"' : ''}>${icon('user')}<span class="hdr-acc-t">${esc(t.acc.signIn)}</span></a><a class="icon-btn hdr-adm" href="/admin/" hidden aria-label="${esc(t.staff.admin)}" title="${esc(t.staff.admin)}">${icon('shield')}</a>`}
      <a class="btn btn-sm btn-primary hdr-cta" href="${mode === 'preview' ? '#contact' : `${home}#contact`}" data-ev="cta_header">${esc(t.nav.cta)}</a>
      <button type="button" class="icon-btn burger" aria-controls="site-nav" aria-expanded="false" aria-label="${esc(t.a11y.menu)}">${icon('menu')}</button>
    </div>
  </div>
</header>`;
}

export const telHref = (p) => `tel:${String(p).replace(/[^\d+]/g, '')}`;
// Telefon raqami HTMLda to'liq chiqmaydi: ariza yuborilgach app.js serverdan olib ochadi
export const phoneMask = (p) => String(p).split(' ').map((g, i) => (i < 2 ? g : g.replace(/\d/g, '•'))).join(' ');
// Telegram havolasi: bot yoki haqiqiy username (namuna «username» bo'lsa ko'rsatilmaydi)
export const tgUser = (cfg) => cfg.botUsername || (cfg.telegram && cfg.telegram !== 'username' ? cfg.telegram : '');
export const phoneLock = (cfg, t, ev, cls = '', href = '#contact') => cfg.phoneOpen ? `<a class="ph-lock is-open ${cls}" href="${telHref(cfg.phone)}" data-ev="${ev}"><span class="ph-num">${esc(cfg.phone)}</span></a>` : `<a class="ph-lock ${cls}" href="${href}" data-ph data-ev="${ev}" title="${esc(t.lock.hint)}"><span class="ph-num">${esc(phoneMask(cfg.phone))}</span><span class="ph-key" aria-hidden="true">${icon('lock')}</span></a>`;

// Mobil pastki panel: qo'ng'iroq, Telegram, ariza (har sahifada, telefonda)
function actionBar(t, lang, cfg, sub) {
  if (sub === 'admin' || !t.v3) return '';
  const b = t.v3.bar, tg = tgUser(cfg), home = url(lang, '');
  const call = cfg.phoneOpen ? `<a href="${telHref(cfg.phone)}" data-ev="bar_call">${icon('phone')}<span>${esc(b.call)}</span></a>` : `<a href="${home}#contact" data-ph-btn data-call="${esc(b.call)}" data-ev="bar_call">${icon('phone')}<span>${esc(b.call)}</span></a>`;
  return `<nav class="m-bar" aria-label="${esc(b.order)}">${call}${tg ? `<a href="https://t.me/${esc(tg)}" target="_blank" rel="noopener noreferrer" data-ev="bar_tg">${icon('send')}<span>${esc(b.tg)}</span></a>` : ''}<a class="m-bar-main" href="${sub === '' ? '' : home}#contact" data-ev="bar_order">${icon('doc')}<span>${esc(b.order)}</span></a></nav>`;
}

function footer(t, lang, cfg, mode, sub = null) {
  const home = mode === 'preview' ? '' : url(lang, '');
  const year = cfg.lastUpdated.slice(0, 4);
  return `${sub === '' ? '' : `
<section class="call-band" aria-labelledby="call-title">
  <div class="wrap call-in">
    <div class="call-copy">
      <p class="eyebrow">${esc(t.footer2.call)}</p>
      <h2 id="call-title">${esc(t.v7.callTitle)}</h2>
      <p class="call-ph">${phoneLock(cfg, t, 'call_footer', 'ph-sm', `${home}#contact`)}</p>
      <p class="call-lead" data-ph-lead="${esc(t.footer2.callLead)}">${esc(cfg.phoneOpen ? t.footer2.callLead : t.lock.bandLead)}</p>
    </div>
    <div class="call-actions">
      ${cfg.phoneOpen ? `<a class="btn btn-primary btn-lg" href="${telHref(cfg.phone)}" data-ev="call_footer_btn">${icon('phone')}<span>${esc(t.footer2.call)}</span></a>` : `<a class="btn btn-primary btn-lg" href="${home}#contact" data-ph-btn data-call="${esc(t.footer2.call)}" data-ev="call_footer_btn">${icon('phone')}<span>${esc(t.lock.call)}</span></a>`}
      ${tgUser(cfg) ? `<a class="btn btn-ghost btn-lg" href="https://t.me/${esc(tgUser(cfg))}" target="_blank" rel="noopener noreferrer" data-ev="tg_footer">${icon('send')}${esc(t.footer2.telegram)}</a>` : ''}
      <a class="btn btn-ghost btn-lg" href="#" target="_blank" rel="noopener noreferrer" data-wa-btn hidden data-ev="wa_footer">${icon('chat')}WhatsApp</a>
    </div>
  </div>
</section>`}
<footer class="site-footer">
  <div class="wrap ftr">
    <div class="ftr-brand">${logo}<div><strong>${esc(cfg.brand)}</strong><p>${esc(t.footer.tagline)}</p><p class="ftr-contacts">${phoneLock(cfg, t, 'call_ftr', 'ph-sm', `${home}#contact`)}${realEmail(cfg) ? ` · <a href="mailto:${esc(cfg.email)}">${esc(cfg.email)}</a>` : ''}</p></div></div>
    <nav aria-label="${esc(t.a11y.menu)}"><ul class="ftr-nav">
      <li><a href="${mode === 'preview' ? '#' : url(lang, 'services/')}">${esc(t.lp.hub.eyebrow)}</a></li>
      <li><a href="${mode === 'preview' ? '#' : url(lang, 'academy/')}">${esc(t.v2.nav.training)}</a></li>
      <li><a href="${mode === 'preview' ? '#' : url(lang, 'robots/')}">${esc(t.v2.nav.robots)}</a></li>
      <li><a href="${mode === 'preview' ? '#' : url(lang, 'documents/')}">${esc(t.v2.nav.docs)}</a></li>
      <li><a href="${mode === 'preview' ? '#' : url(lang, 'team/')}">${esc(t.v2.nav.team)}</a></li>
      <li><a href="${mode === 'preview' ? '#' : url(lang, 'videos/')}">${esc(t.vid.title)}</a></li>
      <li><a href="${mode === 'preview' ? '#' : url(lang, 'manuals/')}">${esc(t.acc2.pageTitle)}</a></li>
      <li><a href="${mode === 'preview' ? '#' : url(lang, 'portfolio/')}">${esc(t.nav2.portfolio)}</a></li>
      <li><a href="${mode === 'preview' ? '#' : url(lang, 'errors/')}">${esc(t.nav3.errors)}</a></li>
      <li><a href="${mode === 'preview' ? '#' : url(lang, 'track/')}">${esc(t.nav2.track)}</a></li>
      <li><a href="${mode === 'preview' ? '#plc' : url(lang, 'plc/')}">${esc(t.nav5.plc)}</a></li>
      <li><a href="${mode === 'preview' ? '#monitoring' : url(lang, 'monitoring/')}">${esc(t.nav9.mon)}</a></li>
      <li><a href="${mode === 'preview' ? '#warranty' : url(lang, 'warranty/')}">${esc(t.nav5.warranty)}</a></li>
      <li><a href="${mode === 'preview' ? '#support' : url(lang, 'support/')}">${esc(t.support.eyebrow)}</a></li>
    </ul></nav>
    <details class="privacy"><summary>${esc(t.footer.privacyTitle)}</summary><p>${esc(t.footer.privacy)}</p></details>
  </div>
  <div class="wrap ftr-bottom"><p>© <span class="yr">${year}</span> ${esc(cfg.brand)}. ${esc(t.footer.rights)}</p><p class="ftr-note">${esc(t.brandsBlock.note)}</p>${mode === 'preview' ? '' : `<p><a class="ftr-staff" href="/admin/" rel="nofollow">${icon('lock')}${esc(t.staff.login)}</a></p>`}</div>
</footer>`;
}

export function secHead(eyebrow, title, lead, id, extra = '', art = '') {
  return `<header class="sec-head reveal${extra}"><p class="eyebrow">${esc(eyebrow)}</p><h2${id ? ` id="${id}"` : ''}>${esc(title)}</h2>${lead ? `<p class="sec-lead">${esc(lead)}</p>` : ''}</header>`;
}

/* ---------- Bosh sahifa ---------- */

export function aiFormFor(t, cfg, o = {}) { return aiForm(t, cfg, o); }

function aiForm(t, cfg, o = {}) {
  const serviceOptions = [...t.services.items.map((s) => s.title), ...(t.plc?.svc ? [t.plc.svc] : []), ...(t.mon?.svc ? [t.mon.svc] : []), ...t.extra.items.map((s) => s.title), ...(t.v3?.cat.items.map((s) => s.name) || []), ...(o.service ? [o.service] : []), t.contact.other].filter((x, i, a) => a.indexOf(x) === i);
  const c = t.contact;
  const ai = t.ai;
  return `
<form class="form ai-form reveal" id="lead-form" novalidate data-tg="${esc(cfg.telegram)}"
  data-err-name="${esc(c.errName)}" data-err-phone="${esc(c.errPhone)}" data-err-msg="${esc(c.errMsg)}" data-err-consent="${esc(c.errConsent)}" data-err-rate="${esc(c.errRate)}"
  data-err-off="${esc(ai.errOff)}" data-err-ai-rate="${esc(ai.errRate)}" data-err-fail="${esc(ai.errFail)}" data-err-img="${esc(ai.errImg)}"
  data-analyzing="${esc(ai.analyzing)}" data-sending="${esc(ai.sending)}"
  data-p-critical="${esc(ai.p.critical)}" data-p-high="${esc(ai.p.high)}" data-p-normal="${esc(ai.p.normal)}" data-p-low="${esc(ai.p.low)}"
  data-h="${esc(c.msgHeader)}" data-l-name="${esc(c.name)}" data-l-phone="${esc(c.phone)}" data-l-equipment="${esc(c.equipment)}" data-l-message="${esc(c.message)}"${o.equipmentCode ? ` data-eq-code="${esc(o.equipmentCode)}"` : ''}>
  ${o.equipmentCode ? `<input type="hidden" name="equipment_code" value="${esc(o.equipmentCode)}">` : ''}
  <div class="f-row">
    <div class="field"><label for="f-name">${esc(c.name)}</label><input id="f-name" name="name" type="text" autocomplete="name" maxlength="80" required></div>
    <div class="field"><label for="f-phone">${esc(c.phone)}</label><input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" maxlength="20" placeholder="+998 __ ___ __ __" required></div>
  </div>
  <div class="f-row">
    <div class="field"><label for="f-company">${esc(c.company)}</label><input id="f-company" name="company" type="text" autocomplete="organization" maxlength="100"${o.company ? ` value="${esc(o.company)}"` : ''}></div>
    <div class="field"><label for="f-service">${esc(c.service)}</label><select id="f-service" name="service"><option value="">${esc(c.choose)}</option>${serviceOptions.map((x) => `<option${o.service === x ? ' selected' : ''}>${esc(x)}</option>`).join('')}</select></div>
  </div>
  <div class="field"><label for="f-equipment">${esc(c.equipment)}</label><input id="f-equipment" name="equipment" type="text" maxlength="120" placeholder="${esc(c.equipmentPh)}"${o.equipment ? ` value="${esc(o.equipment)}"` : ''}></div>
  <div class="field"><label for="f-message">${esc(c.message)}</label><textarea id="f-message" name="message" rows="4" maxlength="2000" placeholder="${esc(c.messagePh)}" required></textarea></div>
  <div class="field">
    <span class="lbl" id="photos-lbl">${esc(ai.photos)}</span>
    <div class="drop" id="drop">
      <ul class="thumbs" id="thumbs" aria-labelledby="photos-lbl"></ul>
      <label class="add-photo" for="f-photos">${icon('camera')}<span>${esc(ai.addPhoto)}</span></label>
      <input id="f-photos" class="vh" type="file" accept="image/jpeg,image/png,image/webp" multiple data-remove="${esc(ai.removePhoto)}">
    </div>
  </div>
  <div class="hp" aria-hidden="true"><label for="f-website">Website</label><input id="f-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
  <label class="consent" for="f-consent"><input id="f-consent" name="consent" type="checkbox" required><span>${esc(c.consent)}</span></label>
  <div class="send-row">
    <button class="btn btn-ghost btn-ai" type="submit" data-action="ai">${icon('probe')}<span>${esc(ai.analyze)}</span></button>
    <button class="btn btn-primary" type="submit" data-action="send">${icon('send')}<span>${esc(ai.send)}</span></button>
  </div>
  <p class="form-status" id="form-status" role="status" aria-live="polite"></p>

  <section class="ai-result" id="ai-result" hidden aria-live="polite" aria-labelledby="ai-res-title">
    <div class="ai-res-head"><h3 id="ai-res-title">${icon('probe')}${esc(ai.resTitle)}</h3><span class="pill" id="ai-priority"></span></div>
    <p class="ai-diag" id="ai-diag"></p>
    <div class="ai-cols">
      <div><h4>${esc(ai.causes)}</h4><ul class="ai-list" id="ai-causes"></ul></div>
      <div><h4>${esc(ai.steps)}</h4><ol class="ai-list ai-steps" id="ai-steps"></ol></div>
    </div>
    <p class="ai-safety" id="ai-safety" hidden>${icon('alert')}<span></span></p>
    <p class="ai-disc">${esc(ai.disclaimer)}</p>
  </section>

  <section class="ok-panel" id="ok-panel" hidden aria-live="polite">
    <div class="ok-ic">${icon('check')}</div>
    <h3>${esc(ai.okTitle)}</h3>
    <p>${esc(ai.okText)}</p>
    <p class="ok-code"><code id="ok-code"></code><button type="button" class="copy-btn" id="ok-copy" aria-label="${esc(t.a11y.copy)}">${icon('copy')}</button></p>
    <p class="ok-hint">${esc(ai.okHint)}</p>
    <a class="btn btn-primary" id="ok-track" href="#">${esc(ai.okTrack)}${icon('arrow')}</a>
  </section>
  <p class="alt-ch">${esc(ai.orChannels)} <a href="https://t.me/${esc(cfg.telegram)}" target="_blank" rel="noopener noreferrer" data-ev="tg_form">Telegram</a></p>
</form>`;
}

export function portfolioCard(t, lang, p, mode) {
  const d = p.data;
  const href = mode === 'preview' ? '#' : url(lang, `portfolio/${p.slug}/`);
  const img = p.images?.[0];
  return `<li class="pf-card reveal"><a href="${href}" class="pf-link">
    <div class="pf-media">${img ? `<img src="/media/${esc(img)}" alt="${esc(d.title[lang])}" loading="lazy" width="640" height="420">` : coverSvg(p)}${p.sample ? `<span class="pf-sample">${esc(t.portfolio.sample)}</span>` : ''}</div>
    <div class="pf-body"><p class="pf-meta"><span>${esc(p.brand)}</span><span>${esc(d.industry?.[lang] || '')}</span>${p.year ? `<span>${esc(p.year)}</span>` : ''}</p>
    <h3>${esc(d.title[lang])}</h3><p class="pf-res">${icon('check')}<span>${esc(d.result[lang])}</span></p></div></a></li>`;
}

function home(t, lang, cfg, data, mode) {
  const hid = new Set(cfg.hiddenSections || []); const on = (k) => !hid.has(k);
  const allBrands = [...brands.robots, ...brands.german, ...brands.chinese, ...brands.other];
  const pf = (data.portfolio || []).filter((p) => !p.sample).slice(0, 3);
  const planHref = [`#contact`, `#contact`, mode === 'preview' ? '#' : url(lang, 'academy/')];

  return `
<main id="main">
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-bg" aria-hidden="true"><div class="grid"></div><div class="scan"></div></div>
    <div class="hero-scene" aria-hidden="true">${heroVideo(mode, cfg)}</div>
    <div class="wrap hero-in">
      <div class="hero-copy">
        <h1 id="hero-title"><span class="h1k">${esc(t.hero.h1k)}</span> <span class="h1a">${esc(t.hero.h1a)}</span> <span class="h1b">${esc(t.hero.h1b)}</span></h1>
        <p class="lead">${esc(t.hero.lead)}</p>
        <div class="cta-row">
          <a class="btn btn-primary btn-lg" href="#contact" data-ev="cta_hero">${icon('probe')}${esc(t.ai.analyze)}</a>
          <a class="btn btn-ghost btn-lg" href="https://t.me/${esc(cfg.botUsername || cfg.telegram)}" target="_blank" rel="noopener noreferrer" data-ev="tg_hero">${icon('send')}${esc(t.v7.tgHero)}</a>
        </div>
        <ul class="badges">${t.hero.badges.map((b) => `<li>${icon('check')}${esc(b)}</li>`).join('')}</ul>
      </div>
    </div>
  </section>

  ${on('stats') ? `<section class="stats" aria-label="${esc(cfg.brand)}"><div class="wrap"><dl class="stats-grid">${t.stats.map((s) => `<div class="stat reveal"><dt class="stat-v"><span class="num" data-count="${esc(s.v)}">${esc(s.v)}</span><span class="suf">${esc(s.s)}</span></dt><dd>${esc(s.l)}</dd></div>`).join('')}</dl></div></section>` : ''}

  ${on('services') ? `<section class="section" id="services" aria-labelledby="services-title">
    <div class="wrap">
      ${secHead(t.services.eyebrow, t.services.title, t.services.lead, 'services-title', '', 'gears')}
      <ul class="svc-grid">${t.services.items.map((s) => `<li class="svc reveal"><div class="svc-ic">${icon(s.icon)}</div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p><ul class="tags">${s.tags.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></li>`).join('')}</ul>
      <div class="extra reveal"><div class="extra-head"><p class="eyebrow">${esc(t.extra.eyebrow)}</p><h3>${esc(t.extra.title)}</h3></div><ul class="extra-list">${t.extra.items.map((x) => `<li>${icon('plus')}<div><h4>${esc(x.title)}</h4><p>${esc(x.text)}</p></div></li>`).join('')}</ul></div>
    </div>
  </section>` : ''}

  ${on('quality') ? homeQuality(t) : ''}

  ${on('plc') ? homePlc(t, lang, cfg, mode) : ''}
  ${on('monitoring') ? homeMonitoring(t, lang, mode) : ''}

  ${on('brands') ? `<section class="brands" aria-labelledby="brands-title">
    <div class="wrap"><h2 id="brands-title" class="brands-title">${esc(t.brandsBlock.title)}</h2></div>
    <div class="wrap"><ul class="brand-list">${allBrands.map((b) => `<li>${esc(b)}</li>`).join('')}</ul></div>
    <div class="wrap"><p class="brands-note">${esc(t.brandsBlock.note)}</p></div>
  </section>` : ''}

  <section class="section contact" id="contact" aria-labelledby="contact-title">
    <div class="wrap contact-in">
      <div class="contact-copy reveal">
        <p class="eyebrow">${esc(t.ai.eyebrow)}</p>
        <h2 id="contact-title">${esc(t.ai.title)}</h2>
        <p class="sec-lead">${esc(t.ai.lead)}</p>
        <ol class="ai-how">
          <li><span>1</span>${esc(t.process.steps[0].text)}</li>
          <li><span>2</span>${esc(t.ai.steps)}: ${esc(t.ai.causes.toLowerCase())}, ${esc(t.ai.priority.toLowerCase())}</li>
          <li><span>3</span>${esc(t.ai.okHint)}</li>
        </ol>
        <p class="hours"><span class="dot" aria-hidden="true"></span>${esc(t.contact.hours)}</p>
        ${cfg.botUsername ? `<a class="tg-card" href="https://t.me/${esc(cfg.botUsername)}" target="_blank" rel="noopener noreferrer" data-ev="tg_bot">${icon('send')}<span><b>${esc(t.homeTg.title)}</b><small>${esc(t.homeTg.text)}</small></span>${icon('arrow')}</a>` : ''}
      </div>
      ${aiForm(t, cfg)}
    </div>
  </section>

  ${on('process') ? `<section class="section section-alt" id="process" aria-labelledby="process-title">
    <div class="wrap">
      ${secHead(t.process.eyebrow, t.process.title, '', 'process-title', '', 'conveyor')}
      <ol class="steps">${t.process.steps.map((s, i) => `<li class="step reveal"><span class="step-n">0${i + 1}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join('')}</ol>
    </div>
  </section>` : ''}

  ${on('downtime') ? homeDowntime(t, lang) : ''}

  ${on('plans') ? `<section class="section" id="plans" aria-labelledby="plans-title">
    <div class="wrap">
      ${secHead(t.plans.eyebrow, t.plans.title, '', 'plans-title', '', 'clip')}
      <ul class="plans">${t.plans.items.map((p, i) => `<li class="plan reveal${p.featured ? ' is-featured' : ''}">${p.featured ? `<span class="plan-flag">${esc(p.featured)}</span>` : ''}<h3>${esc(p.name)}</h3><p class="plan-for">${esc(p.for)}</p><ul>${p.points.map((x) => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul><a class="btn ${p.featured ? 'btn-primary' : 'btn-ghost'}" href="${planHref[i]}" data-ev="plan_${i}">${esc(p.cta)}</a></li>`).join('')}</ul>
      <p class="plans-note">${icon('shield')}${esc(t.plans.note)}</p>
    </div>
  </section>` : ''}

  ${on('warranty') ? homeWarranty(t, lang, cfg, mode) : ''}

  ${on('support') ? homeSupport(t, lang, cfg, mode) : ''}

  ${pf.length && on('portfolio') ? `<section class="section" id="portfolio" aria-labelledby="pf-title">
    <div class="wrap">
      <div class="sec-head-row">${secHead(t.portfolio.eyebrow, t.portfolio.title, t.portfolio.lead, 'pf-title', '', 'caliper')}<a class="btn btn-ghost" href="${mode === 'preview' ? '#' : url(lang, 'portfolio/')}">${esc(t.portfolio.all)}${icon('arrow')}</a></div>
      <ul class="pf-grid">${pf.map((p) => portfolioCard(t, lang, p, mode)).join('')}</ul>
    </div>
  </section>` : ''}

  ${(data.errors || []).length && on('errors') ? `<section class="section err-band" id="errors" aria-labelledby="err-title">
    <div class="wrap err-in">
      <div class="reveal">${secHead(t.errors.homeEyebrow, t.errors.homeTitle, t.errors.homeLead, 'err-title', '', 'alarm')}</div>
      <div class="reveal err-box">
        <form class="err-search" action="${mode === 'preview' ? '#' : url(lang, 'errors/')}" method="get" role="search">
          <label class="vh" for="home-err-q">${esc(t.errors.search)}</label>
          ${icon('search')}<input id="home-err-q" name="q" type="search" placeholder="${esc(t.errors.search)}" autocomplete="off" spellcheck="false">
          <button class="btn btn-primary" type="submit">${esc(t.errors.homeBtn)}</button>
        </form>
        <ul class="err-chips">${data.errors.slice(0, 10).map((e) => `<li><a href="${mode === 'preview' ? '#' : url(lang, `errors/${e.slug}/`)}"><b>${esc(e.code)}</b><span>${esc(e.brand)}</span></a></li>`).join('')}</ul>
      </div>
    </div>
  </section>` : ''}

  ${(data.reviews || []).length && on('reviews') ? `<section class="section reviews-band" id="reviews" aria-labelledby="rv-title"><div class="wrap">
    ${secHead(t.reviews.eyebrow, t.reviews.title, t.reviews.lead, 'rv-title', '', 'stars')}${data.reviewSummary?.n ? `<p class="rv-sum"><b>${esc(data.reviewSummary.avg)}</b><span class="rv-stars" aria-hidden="true">${'★'.repeat(Math.round(data.reviewSummary.avg))}</span><small>${esc(fmt(t.reviews.stars, { n: data.reviewSummary.avg }))} · ${esc(data.reviewSummary.n)}</small></p>` : ''}
    <ul class="rv-list">${data.reviews.map((r) => `<li class="rv reveal"><p class="rv-stars" aria-label="${esc(fmt(t.reviews.stars, { n: r.rating }))}">${'★'.repeat(r.rating)}<span>${'★'.repeat(5 - r.rating)}</span></p><blockquote>${esc(r.text)}</blockquote><p class="rv-who">${esc([r.name, r.company].filter(Boolean).join(' · '))}<time>${esc(String(r.created_at).slice(0, 7))}</time></p></li>`).join('')}</ul>
  </div></section>` : ''}

  ${on('faq') ? `<section class="section section-alt" id="faq" aria-labelledby="faq-title">
    <div class="wrap narrow">
      ${secHead(t.faq.eyebrow, t.faq.title, '', 'faq-title', '', 'magnifier')}
      <div class="faq">${t.faq.items.map((f, i) => `<details class="qa reveal"${i === 0 ? ' open' : ''}><summary><span>${esc(f.q)}</span>${icon('plus', 'ic qa-ic')}</summary><p>${esc(f.a)}</p></details>`).join('')}</div>
    </div>
  </section>` : ''}
</main>`;
}

/* ---------- Ichki sahifalar ---------- */

export function pageHero(eyebrow, title, lead, crumbs = '') {
  return `<section class="page-hero"><div class="hero-bg" aria-hidden="true"><div class="grid"></div></div><div class="wrap page-hero-in">${crumbs}<p class="eyebrow">${esc(eyebrow)}</p><h1>${esc(title)}</h1>${lead ? `<p class="lead">${esc(lead)}</p>` : ''}</div></section>`;
}

function portfolioList(t, lang, items) {
  return `<main id="main">${pageHero(t.portfolio.eyebrow, t.portfolio.title, t.portfolio.lead)}
  <section class="section section-tight"><div class="wrap">${items.length ? `<ul class="pf-grid">${items.map((p) => portfolioCard(t, lang, p, 'prod')).join('')}</ul>` : `<div class="empty">${icon('wrench')}<p>${esc(t.portfolio.empty)}</p></div>`}</div></section></main>`;
}

function portfolioItem(t, lang, p) {
  const d = p.data;
  const imgs = p.images || [];
  return `<main id="main">
  ${pageHero(t.portfolio.eyebrow, d.title[lang], '', `<a class="crumb" href="${url(lang, 'portfolio/')}">${icon('back')}${esc(t.portfolio.back)}</a>`)}
  <section class="section section-tight"><div class="wrap case">
    <div class="case-media">
      ${imgs.length ? `<div class="gallery">${imgs.map((im, i) => `<figure class="${i === 0 ? 'g-main' : ''}"><img src="/media/${esc(im)}" alt="${esc(d.title[lang])} ${i + 1}" loading="${i ? 'lazy' : 'eager'}"></figure>`).join('')}</div>` : `<div class="case-cover">${coverSvg(p)}</div>`}
      ${p.sample ? `<p class="pf-sample-note"><span class="pf-sample">${esc(t.portfolio.sample)}</span></p>` : ''}
    </div>
    <div class="case-body">
      <dl class="case-facts"><div><dt>${esc(t.portfolio.equipment)}</dt><dd>${esc(p.brand)} ${esc(p.model || '')}</dd></div><div><dt>${esc(t.portfolio.industry)}</dt><dd>${esc(d.industry?.[lang] || '')}</dd></div>${p.year ? `<div><dt>${esc(t.portfolio.year)}</dt><dd>${esc(p.year)}</dd></div>` : ''}</dl>
      <ol class="case-steps">
        <li><h2>${esc(t.portfolio.problem)}</h2><p>${esc(d.problem[lang])}</p></li>
        <li><h2>${esc(t.portfolio.solution)}</h2><p>${esc(d.solution[lang])}</p></li>
        <li class="is-result"><h2>${esc(t.portfolio.result)}</h2><p>${esc(d.result[lang])}</p></li>
      </ol>
      <div class="case-cta"><p>${esc(t.portfolio.similar)}</p><a class="btn btn-primary" href="${url(lang, '')}#contact" data-ev="cta_case">${icon('probe')}${esc(t.ai.analyze)}</a></div>
    </div>
  </div></section></main>`;
}

function trackPage(t, lang) {
  const tr = t.track;
  const statusAttrs = Object.entries(tr.s).map(([k, v]) => `data-s-${k.replace('_', '-')}="${esc(v)}"`).join(' ');
  return `<main id="main">${pageHero(tr.eyebrow, tr.title, tr.lead)}
  <section class="section section-tight"><div class="wrap narrow">
    <form class="form track-form" id="track-form" novalidate data-not-found="${esc(tr.notFound)}" data-err-rate="${esc(tr.errRate)}" data-loading="${esc(tr.loading)}" ${statusAttrs}
      data-l-created="${esc(tr.created)}" data-l-updated="${esc(tr.updated)}" data-l-equipment="${esc(tr.equipment)}" data-l-service="${esc(tr.service)}" data-l-priority="${esc(t.ai.priority)}"
      data-p-critical="${esc(t.ai.p.critical)}" data-p-high="${esc(t.ai.p.high)}" data-p-normal="${esc(t.ai.p.normal)}" data-p-low="${esc(t.ai.p.low)}" data-lang="${lang}" data-l-w="${esc(t.nav5.warranty)}" data-w-on="${esc(t.warranty.trackLine)}" data-w-off="${esc(t.warranty.expired)}">
      <div class="track-row">
        <div class="field"><label for="t-code">${esc(tr.code)}</label><input id="t-code" name="code" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="14" placeholder="${esc(tr.codePh)}" required></div>
        <button class="btn btn-primary" type="submit">${icon('search')}${esc(tr.btn)}</button>
      </div>
      <p class="form-status" id="track-status" role="status" aria-live="polite"></p>
    </form>
    <section class="track-res" id="track-res" hidden aria-live="polite">
      <div class="tr-head"><code id="tr-code"></code><span class="pill" id="tr-status"></span></div>
      <ol class="tr-bar" id="tr-bar">${['new', 'diagnosing', 'scheduled', 'in_progress', 'done'].map((s) => `<li data-step="${s}"><span></span>${esc(tr.s[s])}</li>`).join('')}</ol>
      <dl class="tr-facts" id="tr-facts"></dl>
      <form class="form rate-form" id="rate-form" hidden novalidate data-thanks="${esc(t.reviews.thanks)}" data-done="${esc(t.reviews.done)}">
        <h2 class="tr-h">${esc(t.reviews.rateTitle)}</h2><p class="rate-lead">${esc(t.reviews.rateLead)}</p>
        <fieldset class="rate-stars"><legend class="vh">${esc(t.reviews.rateTitle)}</legend>${[5, 4, 3, 2, 1].map((n) => `<input type="radio" name="rating" id="rt-${n}" value="${n}"><label for="rt-${n}" title="${esc(fmt(t.reviews.stars, { n }))}">★</label>`).join('')}</fieldset>
        <div class="field"><label for="rt-text">${esc(t.reviews.comment)}</label><textarea id="rt-text" rows="3" maxlength="600"></textarea></div>
        <div class="field"><label for="rt-name">${esc(t.reviews.name)}</label><input id="rt-name" type="text" maxlength="80" autocomplete="organization"></div>
        <button class="btn btn-primary" type="submit">${esc(t.reviews.send)}</button>
        <p class="form-status" id="rate-status" role="status" aria-live="polite"></p>
      </form>
      <h2 class="tr-h">${esc(tr.history)}</h2>
      <ol class="timeline" id="tr-timeline"></ol>
    </section>
  </div></section></main>`;
}

function academyList(t, lang, courses) {
  const a = t.academy; const a2 = t.academy2;
  const bySlug = Object.fromEntries(courses.map((c) => [c.slug, c]));
  // O'quv yo'li: avval talab qilingan kurslar, keyin ularga tayanganlar
  const base = courses.filter((c) => !c.data.requires || !bySlug[c.data.requires]);
  const next = courses.filter((c) => !base.includes(c));
  const card = (c, step) => `<li class="course reveal" data-course="${esc(c.slug)}"><a href="${url(lang, `academy/${c.slug}/`)}">
      <div class="course-top"><span class="ac-eq">${esc(c.equipment)}</span><span class="lvl lvl-${esc(c.level)}">${esc(a.level[c.level] || c.level)}</span></div>
      <h2>${esc(c.data.title[lang])}</h2><p>${esc(c.data.summary[lang])}</p>
      <p class="course-meta">${icon('clock')}${esc(c.hours)} ${esc(a.hours)} · ${esc(c.lessonCount)} ${esc(a.lessons)} · ${icon('cap')}${esc(a.cert)}</p>
      ${c.data.requires && bySlug[c.data.requires] ? `<p class="course-req">${icon('lock')}${esc(fmt(a2.lockedShort, { course: bySlug[c.data.requires].data.title[lang] }))}</p>` : ''}
      <div class="course-mine" hidden><progress max="100" value="0"></progress><b></b></div>
      <span class="course-go">${esc(a.open)}${icon('arrow')}</span></a><span class="course-step" aria-hidden="true">${String(step).padStart(2, '0')}</span></li>`;
  return `<main id="main">${pageHero(a.eyebrow, a.title, a.lead)}
  <section class="section section-tight"><div class="wrap" id="ac-list" data-passed="${esc(a2.passedShort)}" data-expired="${esc(a2.expired)}" data-continue="${esc(a2.continue)}" data-lang="${lang}">
    <div class="my-courses" id="my-courses" hidden><h2>${esc(a2.myCourses)}</h2><ul class="my-list" id="my-list"></ul></div>
    <h2 class="path-h">${esc(a2.path)}</h2>
    <ol class="course-path">
      <li class="path-stage"><ul class="course-grid">${base.map((c, i) => card(c, i + 1)).join('')}</ul></li>
      ${next.length ? `<li class="path-stage"><ul class="course-grid">${next.map((c, i) => card(c, base.length + i + 1)).join('')}</ul></li>` : ''}
    </ol>
    <div class="corp reveal">${icon('shield')}<p>${esc(a.corporate)}</p><a class="btn btn-ghost" href="${url(lang, '')}#contact">${esc(a.getCode)}</a></div>
  </div></section></main>`;
}

function academyCourse(t, lang, c, lessons) {
  const a = t.academy;
  return `<main id="main">
  ${pageHero(c.equipment, c.data.title[lang], c.data.summary[lang], `<a class="crumb" href="${url(lang, 'academy/')}">${icon('back')}${esc(a.courses)}</a>`)}
  <section class="section section-tight"><div class="wrap course-page" id="course" data-slug="${esc(c.slug)}" data-lang="${lang}"
     data-bad-code="${esc(a.badCode)}" data-answer-all="${esc(a.answerAll)}" data-passed="${esc(a.passed)}" data-failed="${esc(a.failed)}" data-score="${esc(a.score)}"
     data-mark-done="${esc(a.markDone)}" data-done="${esc(a.done)}" data-next="${esc(a.next)}" data-prev="${esc(a.prev)}" data-cert-open="${esc(a.certOpen)}" data-quiz="${esc(a.quiz)}" data-submit="${esc(a.submit)}" data-quiz-lead="${esc(a.quizLead)}" data-cert-base="${url(lang, 'academy/cert/')}"
     data-check="${esc(t.academy2.check)}" data-check-lead="${esc(t.academy2.checkLead)}" data-check-wrong="${esc(t.academy2.checkWrong)}" data-locked="${esc(t.academy2.locked)}" data-start="${esc(t.academy2.startQuiz)}" data-quiz-info="${esc(t.academy2.quizInfo)}" data-time-left="${esc(t.academy2.timeLeft)}" data-no-attempts="${esc(t.academy2.noAttempts)}" data-time-up="${esc(t.academy2.timeUp)}" data-wrong-list="${esc(t.academy2.wrongList)}" data-retry="${esc(t.academy2.retry)}" data-valid-until="${esc(t.academy2.validUntil)}" data-lessons-first="${esc(t.academy2.lessonsFirst || '')}" data-academy="${url(lang, 'academy/')}">
    <aside class="syllabus">
      <h2>${esc(a.syllabus)}</h2>
      <p class="syl-meta">${esc(a.level[c.level] || c.level)} · ${esc(c.hours)} ${esc(a.hours)}</p>
      <div class="prog" id="prog" hidden><span>${esc(a.progress)}</span><div class="prog-bar"><i id="prog-fill"></i></div><b id="prog-pct">0%</b></div>
      <ol class="syl-list" id="syl-list">${lessons.map((l, i) => `<li data-lesson="${l.id}"><button type="button" disabled><span class="syl-n">${i + 1}</span><span>${esc(l.title[lang])}</span></button></li>`).join('')}<li data-lesson="quiz"><button type="button" disabled><span class="syl-n">${icon('cap')}</span><span>${esc(a.quiz)}</span></button></li></ol>
      <p class="syl-who"><b>${esc(a.forWho)}:</b> ${esc(c.data.audience?.[lang] || '')}</p>
      <button type="button" class="btn btn-sm btn-ghost" id="ac-logout" hidden>${esc(a.logout)}</button>
    </aside>
    <div class="lesson-pane">
      <div class="join join-login" id="join-login" hidden>
        <h2>${esc(a.joinTitle)}</h2><p>${esc(t.acc.academyLogin)}</p>
        <p class="join-acts"><a class="btn btn-primary" href="${url(lang, 'account/')}?next=${encodeURIComponent(url(lang, `academy/${c.slug}/`))}">${icon('user')}${esc(t.acc.signIn)}</a> <a class="btn btn-ghost" href="${url(lang, 'account/')}?tab=register&amp;next=${encodeURIComponent(url(lang, `academy/${c.slug}/`))}">${esc(t.acc.tabRegister)}</a></p>
      </div>
      <form class="form join" id="join-form" hidden novalidate>
        <h2>${esc(a.joinTitle)}</h2><p>${esc(t.acc.academyCodeLead)}</p>
        <div class="field"><label for="j-code">${esc(a.code)}</label><input id="j-code" type="text" maxlength="24" autocomplete="off" autocapitalize="characters" spellcheck="false" required></div>
        <button class="btn btn-primary" type="submit">${esc(a.join)}${icon('arrow')}</button>
        <p class="form-status" id="join-status" role="status" aria-live="polite"></p>
        <p class="join-help">${esc(a.corporate)} <a href="${url(lang, '')}#contact">${esc(a.getCode)}</a></p>
      </form>
      <article class="lesson" id="lesson" hidden tabindex="-1"></article>
    </div>
  </div></section></main>`;
}

function certPage(t, lang, cert) {
  const a = t.academy;
  if (!cert) return `<main id="main">${pageHero(a.cert, a.certNotFound, '')}</main>`;
  return `<main id="main" class="cert-main"><section class="section section-tight"><div class="wrap">
    <div class="cert${cert.expired ? ' is-expired' : ''}">
      <div class="cert-top">${logo}<span>${esc(t._brand)}</span></div>
      <p class="eyebrow">${esc(a.certTitle)}</p>
      <h1 class="cert-name">${esc(cert.name)}</h1>
      <p class="cert-text">${esc(a.certText)}</p>
      <p class="cert-course">${esc(cert.course)}</p>
      <dl class="cert-facts"><div><dt>${esc(a.score)}</dt><dd>${esc(cert.score)}%</dd></div><div><dt>${esc(a.certDate)}</dt><dd>${esc(cert.date)}</dd></div>${cert.validUntil ? `<div class="${cert.expired ? 'is-exp' : ''}"><dt>${esc(cert.expired ? t.academy2.expired : t.academy2.validUntil)}</dt><dd>${esc(cert.validUntil)}</dd></div>` : ''}<div><dt>${esc(a.certId)}</dt><dd><code>${esc(cert.id)}</code></dd></div></dl>
      <div class="cert-foot">${cert.qr ? `<figure class="cert-qr">${cert.qr}<figcaption>${esc(t.academy2.scanToVerify)}</figcaption></figure>` : ''}<p class="cert-verify">${icon('shield')}${esc(a.certVerify)}: <span>${esc(cert.verifyUrl)}</span></p></div>
      ${cert.company ? `<p class="cert-co">${esc(cert.company)}</p>` : ''}
      <p class="cert-tools"><button type="button" class="btn btn-ghost" data-print>${icon('print')}${esc(t.doc?.print || 'Print')}</button></p>
    </div>
  </div></section></main>`;
}

/* ---------- Sahifa qobig'i ---------- */

function ogAndAlt(lang, cfg, sub, title, description) {
  const pageUrl = cfg.domain + url(lang, sub);
  return `<link rel="canonical" href="${pageUrl}">
${LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${cfg.domain}${url(l, sub)}">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${cfg.domain}${url('uz', sub)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(cfg.brand)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${pageUrl}">
<meta property="og:image" content="${cfg.domain}/assets/img/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${LANG_META[lang].og}">
${LANGS.filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${LANG_META[l].og}">`).join('\n')}
<meta name="twitter:card" content="summary_large_image">`;
}

// Qidiruv natijasida kesilmasligi uchun: sarlavha ~65, tavsif ~160 belgigacha
const fitTitle = (title) => { const i = title.lastIndexOf(' | '); return title.length > 65 && i > 0 ? title.slice(0, i) : title; };
const fitDesc = (d) => { d = String(d || ''); if (d.length <= 160) return d; const cut = d.slice(0, 157); return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,.;:\s]+$/, '') + '…'; };

export function layout({ lang, t, cfg, sub, title, description, keywords, body, jsonLd, noindex, assetVer, bodyClass = '' }) {
  title = fitTitle(title); description = fitDesc(description);
  return `<!doctype html>
<html lang="${lang}" data-lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${keywords ? `<meta name="keywords" content="${esc(keywords)}">` : ''}
<meta name="robots" content="${noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}">
<meta name="author" content="${esc(cfg.engineerName)}">
<meta name="format-detection" content="telephone=no">
${cfg.googleVerify ? `<meta name="google-site-verification" content="${esc(cfg.googleVerify)}">` : ''}${cfg.yandexVerify ? `<meta name="yandex-verification" content="${esc(cfg.yandexVerify)}">` : ''}
<meta name="theme-color" content="#0f151c" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#f2f4f6" media="(prefers-color-scheme: light)">
${noindex ? '' : ogAndAlt(lang, cfg, sub, title, description)}
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/ibm-plex-sans-700-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/style.css?v=${assetVer}">
<script src="/assets/js/app.js?v=${assetVer}" defer></script>
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>` : ''}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
<div id="app">${header(t, lang, sub, 'prod', cfg)}${body}${footer(t, lang, cfg, 'prod', sub)}${actionBar(t, lang, cfg, sub)}</div>
<a class="tg-back" id="tg-back" href="/tg/#academy" hidden>${icon('back')}${esc(t.academy2.backToApp)}</a>
</body>
</html>
`;
}

/* ---------- Schema.org ---------- */

function orgLd(lang, t, cfg) {
  const org = cfg.domain + '/#org';
  const services = [...t.services.items, ...t.extra.items];
  return {
    '@type': 'ProfessionalService', '@id': org, name: cfg.brand, url: cfg.domain + '/', logo: cfg.domain + '/assets/img/logo.png', image: cfg.domain + '/assets/img/og.png',
    description: t.meta.description, ...(realEmail(cfg) ? { email: cfg.email } : {}), ...(cfg.phoneOpen ? { telephone: cfg.phone.replace(/\s/g, '') } : {}), priceRange: '$$',
    address: { '@type': 'PostalAddress', addressLocality: cfg.city[lang], addressCountry: cfg.country }, areaServed: [{ '@type': 'Country', name: 'Uzbekistan' }, ...['Tashkent', 'Samarkand', 'Andijan', 'Fergana', 'Namangan', 'Navoiy', 'Bukhara', 'Karshi', 'Nukus'].map((n) => ({ '@type': 'City', name: n }))],
    knowsAbout: ['PLC service', 'PLC repair', 'Industrial equipment maintenance', 'Industrial robot repair', 'ABB robots', 'KUKA robots', 'Siemens S7', 'SCADA', 'Variable frequency drive repair', 'Servo drive repair', 'CNC machine repair'],
    openingHours: cfg.workHours, knowsLanguage: ['uz', 'ru', 'en'], founder: { '@type': 'Person', name: cfg.engineerName, jobTitle: 'Engineer' },
    ...(tgUser(cfg) ? { sameAs: [`https://t.me/${tgUser(cfg)}`] } : {}),
    contactPoint: { '@type': 'ContactPoint', ...(realEmail(cfg) ? { email: cfg.email } : { url: cfg.domain + url(lang, '') + '#contact' }), contactType: 'customer service', availableLanguage: ['Uzbek', 'Russian', 'English'] },
    hasOfferCatalog: { '@type': 'OfferCatalog', name: t.services.eyebrow, itemListElement: services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title, description: s.text, areaServed: 'UZ', provider: { '@id': org } } })) }
  };
}
const crumbsLd = (items) => ({ '@type': 'BreadcrumbList', itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) });

/* ---------- Ommaviy render funksiyalari ---------- */

export function renderHome(lang, t, cfg, data, assetVer) {
  const pageUrl = cfg.domain + url(lang, '');
  const jsonLd = { '@context': 'https://schema.org', '@graph': [
    orgLd(lang, t, cfg),
    { '@type': 'WebSite', '@id': cfg.domain + '/#site', url: cfg.domain + '/', name: cfg.brand, inLanguage: LANGS, publisher: { '@id': cfg.domain + '/#org' } },
    { '@type': 'WebPage', '@id': pageUrl + '#page', url: pageUrl, name: t.v2.metaTitle, inLanguage: lang, isPartOf: { '@id': cfg.domain + '/#site' }, about: { '@id': cfg.domain + '/#org' } }
  ] };
  return layout({ lang, t, cfg, sub: '', title: t.v2.metaTitle, description: t.v2.metaDesc, keywords: t.meta.keywords, body: home2(t, lang, cfg, data), jsonLd, assetVer });
}

export function renderPortfolioList(lang, t, cfg, items, assetVer) {
  const jsonLd = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', name: t.meta2.portfolioTitle, url: cfg.domain + url(lang, 'portfolio/'), inLanguage: lang, about: { '@id': cfg.domain + '/#org' } },
    crumbsLd([[cfg.brand, cfg.domain + url(lang, '')], [t.portfolio.title, cfg.domain + url(lang, 'portfolio/')]])
  ] };
  return layout({ lang, t, cfg, sub: 'portfolio/', title: t.meta2.portfolioTitle, description: t.meta2.portfolioDesc, keywords: t.meta9.kw.portfolio, body: portfolioList(t, lang, items), jsonLd, assetVer });
}

export function renderPortfolioItem(lang, t, cfg, p, assetVer) {
  const d = p.data;
  const sub = `portfolio/${p.slug}/`;
  const desc = `${d.problem[lang]} ${d.result[lang]}`.slice(0, 160);
  const jsonLd = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Article', headline: d.title[lang], description: desc, inLanguage: lang, url: cfg.domain + url(lang, sub), author: { '@type': 'Person', name: cfg.engineerName }, publisher: { '@id': cfg.domain + '/#org' }, ...(p.images?.length ? { image: p.images.map((i) => `${cfg.domain}/media/${i}`) } : {}), about: `${p.brand} ${p.model || ''}`.trim() },
    crumbsLd([[cfg.brand, cfg.domain + url(lang, '')], [t.portfolio.title, cfg.domain + url(lang, 'portfolio/')], [d.title[lang], cfg.domain + url(lang, sub)]])
  ] };
  return layout({ lang, t, cfg, sub, title: `${d.title[lang]} | ${cfg.brand}`, description: desc, keywords: [p.brand, p.model && `${p.brand || ''} ${p.model}`.trim(), t.meta9.kw.portfolio].filter(Boolean).join(', '), body: portfolioItem(t, lang, p), jsonLd, assetVer, noindex: !!p.sample });
}

export function renderTrack(lang, t, cfg, assetVer) {
  return layout({ lang, t, cfg, sub: 'track/', title: t.meta2.trackTitle, description: t.meta2.trackDesc, keywords: t.meta9.kw.track, body: trackPage(t, lang), assetVer });
}

export function renderAcademyList(lang, t, cfg, courses, assetVer) {
  const jsonLd = { '@context': 'https://schema.org', '@graph': courses.map((c) => ({ '@type': 'Course', name: c.data.title[lang], description: c.data.summary[lang], inLanguage: lang, url: cfg.domain + url(lang, `academy/${c.slug}/`), provider: { '@type': 'Organization', name: cfg.brand, sameAs: cfg.domain + '/' } })) };
  return layout({ lang, t, cfg, sub: 'academy/', title: t.meta2.academyTitle, description: t.meta2.academyDesc, keywords: t.meta9.kw.academy, body: academyList(t, lang, courses), jsonLd, assetVer });
}

export function renderAcademyCourse(lang, t, cfg, c, lessons, assetVer) {
  const sub = `academy/${c.slug}/`;
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Course', name: c.data.title[lang], description: c.data.summary[lang], inLanguage: lang, url: cfg.domain + url(lang, sub), provider: { '@type': 'Organization', name: cfg.brand, sameAs: cfg.domain + '/' }, educationalLevel: c.level, timeRequired: `PT${c.hours}H`, syllabusSections: lessons.map((l) => ({ '@type': 'Syllabus', name: l.title[lang] })) };
  return layout({ lang, t, cfg, sub, title: `${c.data.title[lang]} | ${t.academy.eyebrow} ${cfg.brand}`, description: c.data.summary[lang], body: academyCourse(t, lang, c, lessons), jsonLd, assetVer });
}

export function renderCert(lang, t, cfg, cert, assetVer) {
  return layout({ lang, t: { ...t, _brand: cfg.brand }, cfg, sub: 'academy/cert/', title: `${t.academy.cert} | ${cfg.brand}`, description: t.academy.certTitle, body: certPage({ ...t, _brand: cfg.brand }, lang, cert), noindex: true, assetVer, bodyClass: 'is-cert' });
}

export function render404(lang, t, cfg, assetVer) {
  const body = `<main id="main">${pageHero('404', t.notFound.title, t.notFound.text)}<section class="section section-tight"><div class="wrap"><a class="btn btn-primary" href="${url(lang, '')}">${icon('back')}${esc(t.notFound.back)}</a></div></section></main>`;
  return layout({ lang, t, cfg, sub: '', title: `404 | ${cfg.brand}`, description: `${t.notFound.title}. ${t.notFound.text} ${t.meta.description}`, body, noindex: true, assetVer });
}

// Bitta faylli preview (server yo'q): AI tashxis va ariza namunaviy javob bilan ishlaydi.
export function renderPreview(cfg, textsByLang, data, css, js) {
  const inner = (l) => header(textsByLang[l], l, '', 'preview', cfg) + home(textsByLang[l], l, cfg, data, 'preview') + footer(textsByLang[l], l, cfg, 'preview');
  const tpls = LANGS.map((l) => `<template id="tpl-${l}" data-title="${esc(textsByLang[l].meta.title)}">${inner(l)}</template>`).join('\n');
  return `<title>Texnika Servis</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap">
<style>${css}</style>
<div id="app" data-lang="uz" data-preview="1" data-pv-ph="${esc(cfg.phone)}" data-pv-wa="${esc(cfg.whatsapp)}">${inner('uz')}</div>
${tpls}
<script>${js}</script>
`;
}
