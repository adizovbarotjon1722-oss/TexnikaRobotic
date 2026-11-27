// 20-bosqich: shaxsiy kabinet (yon menyu: umumiy, arizalar, o'qish, videolar, qo'llanmalar, profil, xavfsizlik),
// SMS/email tasdiqlashli kirish va ro'yxatdan o'tish, qo'llanmalar sahifasi.
import { layout, esc, icon, url, telHref } from './template.mjs';
import { player } from './template6.mjs';
import { fmt, LANGS } from './i18n.mjs';

const field = (id, label, input, hint = '') => `<div class="field"><label for="${id}">${esc(label)}</label>${input}${hint ? `<small class="hint">${esc(hint)}</small>` : ''}</div>`;
const inp = (id, type, attrs = '') => `<input id="${id}" type="${type}" ${attrs}>`;
const day = (s) => String(s || '').slice(0, 10);
const when = (s) => String(s || '').slice(0, 16).replace('T', ' ');
const initials = (n) => String(n || '').split(/\s+/).filter(Boolean).slice(0, 2).map((x) => x[0]).join('').toUpperCase() || '•';
const size = (b) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);
const ORDER = ['new', 'diagnosing', 'scheduled', 'in_progress', 'waiting_parts', 'done'];
const ERRS = ['errLogin', 'errExists', 'errWeak', 'errMatch', 'errName', 'errLoginFmt', 'errCode', 'errBlocked', 'errRate', 'errNet', 'errCurrent', 'saved', 'pwChanged', 'codeSent', 'tgWait'];
const ERRS2 = ['errSend', 'errWait', 'errWeak2', 'codeSentSms', 'codeSentEmail', 'codeLeadSms', 'codeLeadEmail', 'resendIn', 'resend', 'verifiedOk', 'ended'];
const dataAttrs = (a, b) => [...ERRS.map((k) => [k, a[k]]), ...ERRS2.map((k) => [k, b[k]])].map(([k, v]) => `data-${k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())}="${esc(v)}"`).join(' ');

/* ---------- Kirish / ro'yxatdan o'tish ---------- */
function codeStep(b, id) {
  return `<div class="cab-code" id="${id}" hidden>
    <p class="cab-code-lead" aria-live="polite"></p>
    ${field(`${id}-in`, b.codeLabel, inp(`${id}-in`, 'text', 'inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" class="code-in"'))}
    <div class="cab-code-row"><button type="button" class="link-btn" data-resend>${esc(b.resend)}</button><button type="button" class="link-btn" data-change>${esc(b.changeLogin)}</button></div>
  </div>`;
}
function authBlock(t, lang) {
  const a = t.acc, b = t.acc2;
  const pw = (id, ac) => inp(id, 'password', `autocomplete="${ac}" minlength="8" maxlength="200" required`);
  return `<div class="cab-auth">
    <aside class="cab-auth-side">
      <p class="eyebrow">${esc(a.eyebrow)}</p><h1>${esc(b.authTitle)}</h1><p class="lead">${esc(b.authLead)}</p>
      <ul class="cab-perks">${b.perks.map(([ic, h, x]) => `<li>${icon(ic)}<div><b>${esc(h)}</b><span>${esc(x)}</span></div></li>`).join('')}</ul>
      <p class="cab-safe">${icon('lock')}<span>${esc(b.tipsList[1])}</span></p>
    </aside>
    <div class="cab-auth-card">
      <div class="acc-tabs" role="tablist">
        <button type="button" role="tab" id="tab-login" aria-controls="f-login" aria-selected="true" data-tab="login">${esc(a.tabLogin)}</button>
        <button type="button" role="tab" id="tab-register" aria-controls="f-register" aria-selected="false" data-tab="register">${esc(a.tabRegister)}</button>
      </div>
      <form class="form acc-form" id="f-login" role="tabpanel" aria-labelledby="tab-login" novalidate>
        ${field('l-login', a.login, inp('l-login', 'text', 'autocomplete="username" inputmode="email" maxlength="120" required'), a.loginHint)}
        ${field('l-pw', a.password, pw('l-pw', 'current-password'))}
        <button class="btn btn-primary btn-block" type="submit">${esc(a.doLogin)}${icon('arrow')}</button>
        <p class="form-status" role="status" aria-live="polite"></p>
        <button type="button" class="link-btn" data-tab="forgot">${esc(a.forgotLink)}</button>
      </form>
      <form class="form acc-form" id="f-register" role="tabpanel" aria-labelledby="tab-register" hidden novalidate>
        <div class="reg-fields">
          ${field('r-name', a.name, inp('r-name', 'text', 'autocomplete="name" maxlength="80" required'))}
          ${field('r-login', a.login, inp('r-login', 'text', 'autocomplete="username" inputmode="email" maxlength="120" required'), a.loginHint)}
          ${field('r-company', a.company, inp('r-company', 'text', 'autocomplete="organization" maxlength="100"'))}
          <div class="row2">${field('r-pw', a.password, pw('r-pw', 'new-password'), b.errWeak2)}${field('r-pw2', a.password2, pw('r-pw2', 'new-password'))}</div>
        </div>
        ${codeStep(b, 'r-code')}
        <div class="hp" aria-hidden="true"><label for="r-web">Website</label><input id="r-web" type="text" tabindex="-1" autocomplete="off"></div>
        <button class="btn btn-primary btn-block" type="submit" data-l1="${esc(a.doRegister)}" data-l2="${esc(b.confirm)}">${esc(a.doRegister)}${icon('arrow')}</button>
        <p class="form-status" role="status" aria-live="polite"></p>
      </form>
      <div class="acc-form" id="f-forgot" hidden>
        <h2>${esc(a.forgotTitle)}</h2>
        <form class="form" id="f-forgot1" novalidate>
          ${field('fg-login', a.login, inp('fg-login', 'text', 'autocomplete="username" inputmode="email" maxlength="120" required'))}
          <button class="btn btn-primary btn-block" type="submit">${esc(a.sendCode)}</button>
          <p class="form-status" role="status" aria-live="polite"></p>
        </form>
        <form class="form" id="f-forgot2" hidden novalidate>
          ${field('fg-code', a.code, inp('fg-code', 'text', 'inputmode="numeric" autocomplete="one-time-code" maxlength="6" class="code-in" required'))}
          <div class="row2">${field('fg-pw', a.newPassword, pw('fg-pw', 'new-password'), b.errWeak2)}${field('fg-pw2', a.password2, pw('fg-pw2', 'new-password'))}</div>
          <button class="btn btn-primary btn-block" type="submit">${esc(a.savePassword)}</button>
          <p class="form-status" role="status" aria-live="polite"></p>
        </form>
        <button type="button" class="link-btn" data-tab="login">${icon('back')}${esc(a.backToLogin)}</button>
      </div>
    </div>
  </div>`;
}

/* ---------- Kabinet ---------- */
function stepBar(t, s) {
  if (s === 'cancelled') return `<span class="st st-cancelled">${esc(t.track.s.cancelled)}</span>`;
  const i = Math.max(0, ORDER.indexOf(s));
  return `<div class="req-prog" title="${esc(t.track.s[s] || s)}"><span class="st st-${esc(s)}">${esc(t.track.s[s] || s)}</span><i class="req-bar"><b class="w${Math.round((i / (ORDER.length - 1)) * 10)}"></b></i></div>`;
}
const reqTable = (t, lang, rows) => `<div class="tbl-scroll"><table class="acc-tbl"><thead><tr><th>${esc(t.acc.colCode)}</th><th>${esc(t.acc.colDate)}</th><th>${esc(t.acc.colEquipment)}</th><th>${esc(t.acc.colStatus)}</th></tr></thead><tbody>${rows.map((r) => `<tr><td><a class="mono" href="${url(lang, 'track/')}#${esc(r.code)}">${esc(r.code)}</a></td><td class="nowrap">${esc(day(r.created_at))}</td><td>${esc(r.equipment || r.service || '—')}</td><td>${stepBar(t, r.status)}</td></tr>`).join('')}</tbody></table></div>`;

function manualRow(b, m) {
  return `<li class="man-row${m.locked ? ' is-locked' : ''}" data-q="${esc(`${m.title} ${m.category} ${m.text}`.toLowerCase())}">
    <span class="man-ext man-${esc(m.ext)}">${esc(m.ext.toUpperCase())}</span>
    <div class="man-body"><h3>${esc(m.title)}${m.isNew ? ` <span class="tag ok">${esc(b.isNew)}</span>` : ''}</h3>${m.text ? `<p>${esc(m.text)}</p>` : ''}
      <small class="muted">${[m.category, size(m.size), day(m.created_at)].filter(Boolean).map(esc).join(' · ')}</small></div>
    ${m.locked ? `<span class="man-lock">${icon('lock')}</span>` : `<a class="btn btn-sm ${m.ext === 'pdf' ? 'btn-primary' : 'btn-ghost'}" href="/manuals/f/${m.id}/" target="_blank" rel="noopener" data-ev="manual_open">${esc(m.ext === 'pdf' ? b.open : b.download)}</a>`}
  </li>`;
}
const vidCard = (t, v) => `<li class="vid-card" data-cat="${esc(v.category)}"><div class="vid-media">${player({ ...v, _t: t.vid })}</div><div class="vid-body"><div class="vid-tags">${v.category ? `<span class="tag">${esc(v.category)}</span>` : ''}${v.duration ? `<span class="tag mono">${esc(v.duration)}</span>` : ''}</div><h3>${esc(v.title)}</h3>${v.text ? `<p>${esc(v.text)}</p>` : ''}</div></li>`;

function dash(t, lang, cfg, d) {
  const a = t.acc, b = t.acc2, u = d.user, n = b.nav;
  const courses = (d.academy?.courses || []).filter((c) => c.done > 0 || c.passed || c.expired);
  const certs = courses.filter((c) => c.passed).length;
  const active = d.requests.filter((r) => !['done', 'cancelled'].includes(r.status));
  const done = d.requests.filter((r) => r.status === 'done').length;
  const isEmail = u.login.includes('@');
  const freshMan = d.manuals.filter((m) => m.isNew).slice(0, 3);
  const pane = (id, title, lead, body, extra = '') => `<section class="cab-pane" id="p-${id}" data-pane="${id}" aria-labelledby="h-${id}"${id === 'home' ? '' : ' hidden'}>
      <header class="cab-ph"><div><h2 id="h-${id}">${esc(title)}</h2>${lead ? `<p class="muted">${esc(lead)}</p>` : ''}</div>${extra}</header>${body}</section>`;
  const navItem = (id, ic, count) => `<a href="#${id}" class="cab-ni" data-go="${id}"${id === 'home' ? ' aria-current="page"' : ''}>${icon(ic)}<span>${esc(n[id])}</span>${count ? `<b class="cab-cnt">${count}</b>` : ''}</a>`;
  const verifyBox = !u.verified && d.verifyChannel ? `<div class="cab-verify" id="cab-verify">
      <div class="cab-verify-h">${icon('shield')}<div><b>${esc(isEmail ? b.verifyTitleEmail : b.verifyTitle)}</b><p>${esc(b.verifyLead)}</p></div></div>
      <form class="form cab-verify-f" id="f-verify" novalidate data-channel="${esc(d.verifyChannel)}">
        <button class="btn btn-sm btn-primary" type="button" id="vf-send">${esc(b.sendCode)}</button>
        <div class="cab-verify-in" hidden>${inp('vf-code', 'text', `inputmode="numeric" autocomplete="one-time-code" maxlength="6" class="code-in" aria-label="${esc(b.codeLabel)}"`)}<button class="btn btn-sm btn-primary" type="submit">${esc(b.confirm)}</button></div>
        <p class="form-status" role="status" aria-live="polite"></p>
      </form></div>` : '';
  const courseItems = courses.map((c) => `<li class="${c.passed ? 'is-passed' : c.expired ? 'is-exp' : ''}">
      <a href="${url(lang, `academy/${c.slug}/`)}"><strong>${esc(c.title)}</strong><progress max="100" value="${c.pct}">${c.pct}%</progress>
      <span>${esc(c.passed ? a.passed : c.expired ? a.expired : `${a.continue} · ${c.pct}%`)}</span></a>
      ${c.cert_id ? `<a class="acc-cert" href="${url(lang, `academy/cert/${esc(c.cert_id)}/`)}">${icon('shield')}${esc(a.certificate)}</a>` : ''}
    </li>`).join('');
  const cats = [...new Set(d.videos.map((x) => x.category).filter(Boolean))];

  const home = `${verifyBox}
    <dl class="cab-stats">
      <a href="#requests" data-go="requests"><dt>${esc(b.statActive)}</dt><dd>${active.length}</dd></a>
      <a href="#requests" data-go="requests"><dt>${esc(b.statDone)}</dt><dd>${done}</dd></a>
      <a href="#manuals" data-go="manuals"><dt>${esc(b.statManuals)}</dt><dd>${d.manuals.length}</dd></a>
      <a href="#learn" data-go="learn"><dt>${esc(b.statCerts)}</dt><dd>${certs}</dd></a>
    </dl>
    <div class="cab-quick" role="group" aria-label="${esc(b.quick)}">
      <a href="${url(lang, '')}#contact">${icon('plus')}<span>${esc(b.qRequest)}</span></a>
      <a href="${url(lang, 'track/')}">${icon('search')}<span>${esc(b.qTrack)}</span></a>
      <a href="${url(lang, 'academy/')}">${icon('cap')}<span>${esc(b.qAcademy)}</span></a>
      ${cfg.phoneOpen ? `<a href="${telHref(cfg.phone)}">${icon('phone')}<span>${esc(b.qCall)}</span></a>` : ''}
    </div>
    <div class="cab-two">
      <div class="cab-card"><div class="cab-card-h"><h3>${esc(b.recent)}</h3><a href="#requests" data-go="requests" class="link">${esc(b.all)}</a></div>
        ${d.requests.length ? `<ul class="cab-mini">${d.requests.slice(0, 4).map((r) => `<li><a class="mono" href="${url(lang, 'track/')}#${esc(r.code)}">${esc(r.code)}</a><span>${esc(r.equipment || r.service || '—')}</span>${stepBar(t, r.status)}</li>`).join('')}</ul>` : `<p class="muted">${esc(a.noRequests)}</p>`}</div>
      <div class="cab-card"><div class="cab-card-h"><h3>${esc(b.fresh)}</h3><a href="#manuals" data-go="manuals" class="link">${esc(b.all)}</a></div>
        ${freshMan.length || d.videos.length ? `<ul class="cab-mini">${freshMan.map((m) => `<li>${icon('book')}<a href="/manuals/f/${m.id}/" target="_blank" rel="noopener">${esc(m.title)}</a><span class="tag ok">${esc(b.isNew)}</span></li>`).join('')}${d.videos.slice(0, 3 - Math.min(3, freshMan.length) || 0).map((v) => `<li>${icon('play')}<a href="#videos" data-go="videos">${esc(v.title)}</a></li>`).join('')}</ul>` : `<p class="muted">${esc(b.none)}</p>`}</div>
    </div>`;

  const sessions = d.sessions.map((s) => `<li class="dev${s.current ? ' is-cur' : ''}">${icon('device')}<div><b>${esc(s.device)}</b><small class="muted">${esc(s.ip)} · ${esc(b.lastSeen)}: ${esc(when(s.last_seen))}</small></div>${s.current ? `<span class="tag ok">${esc(b.thisDevice)}</span>` : `<button type="button" class="btn btn-sm btn-ghost" data-end="${esc(s.id)}">${esc(b.endSession)}</button>`}</li>`).join('');

  return `<div class="cab">
    <aside class="cab-side">
      <div class="cab-me"><span class="cab-av" aria-hidden="true">${esc(initials(u.name))}</span><div><b>${esc(u.name)}</b><small>${esc(u.login)}</small>
        ${u.verified ? `<span class="tag ok">${icon('check')}${esc(b.verified)}</span>` : d.verifyChannel ? `<span class="tag warn">${esc(b.unverified)}</span>` : ''}</div></div>
      <nav class="cab-nav" aria-label="${esc(a.title)}">
        ${navItem('home', 'home')}${navItem('requests', 'doc', active.length)}${navItem('learn', 'cap')}${navItem('videos', 'play')}${navItem('manuals', 'book', freshMan.length)}${navItem('profile', 'user')}${navItem('security', 'lock')}
      </nav>
      <button type="button" class="cab-out" id="acc-logout">${icon('logout')}<span>${esc(a.logout)}</span></button>
    </aside>
    <div class="cab-main">
      ${pane('home', fmt(a.hello, { name: u.name.split(' ')[0] }), `${u.company ? u.company + ' · ' : ''}${a.since} ${day(u.created_at)}`, home)}
      ${pane('requests', n.requests, b.reqLead, d.requests.length ? reqTable(t, lang, d.requests) : `<div class="empty">${icon('doc')}<p>${esc(a.noRequests)}</p></div>`, `<a class="btn btn-sm btn-primary" href="${url(lang, '')}#contact">${icon('plus')}${esc(a.newRequest)}</a>`)}
      ${pane('learn', n.learn, b.learnLead, courseItems ? `<ul class="acc-courses">${courseItems}</ul>` : `<div class="empty">${icon('cap')}<p>${esc(a.noCourses)}</p></div>`, `<a class="btn btn-sm btn-ghost" href="${url(lang, 'academy/')}">${icon('cap')}${esc(a.toAcademy)}</a>`)}
      ${pane('videos', n.videos, b.vidLead, d.videos.length ? `${cats.length > 1 ? `<div class="chips" role="group"><button type="button" class="chip is-on" data-cat="" aria-pressed="true">${esc(t.vid.all)}</button>${cats.map((c) => `<button type="button" class="chip" data-cat="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join('')}</div>` : ''}<ul class="vid-grid cab-vids">${d.videos.map((v) => vidCard(t, v)).join('')}</ul>` : `<div class="empty">${icon('play')}<p>${esc(b.noVideos)}</p></div>`)}
      ${pane('manuals', n.manuals, b.manLead, d.manuals.length ? `<div class="man-search">${icon('search')}<input type="search" id="man-q" placeholder="${esc(b.manSearch)}" aria-label="${esc(b.manSearch)}"></div><ul class="man-list">${d.manuals.map((m) => manualRow(b, m)).join('')}</ul>` : `<div class="empty">${icon('book')}<p>${esc(b.noManuals)}</p></div>`)}
      ${pane('profile', n.profile, b.profLead, `<div class="cab-card"><form class="form" id="f-profile" novalidate>
          ${field('p-login', b.loginLabel, inp('p-login', 'text', `value="${esc(u.login)}" readonly`))}
          ${field('p-name', a.name, inp('p-name', 'text', `autocomplete="name" maxlength="80" required value="${esc(u.name)}"`))}
          ${field('p-company', a.company, inp('p-company', 'text', `autocomplete="organization" maxlength="100" value="${esc(u.company)}"`))}
          ${field('p-lang', b.langLabel, `<select id="p-lang">${LANGS.map((l) => `<option value="${l}"${(u.lang || lang) === l ? ' selected' : ''}>${({ uz: 'O‘zbekcha', ru: 'Русский', en: 'English' })[l]}</option>`).join('')}</select>`)}
          <button class="btn btn-primary" type="submit">${esc(a.save)}</button>
          <p class="form-status" role="status" aria-live="polite"></p>
        </form></div>`)}
      ${pane('security', n.security, b.secLead, `<div class="cab-two">
        <div class="cab-card"><h3>${esc(a.changePassword)}</h3>
          <form class="form" id="f-password" novalidate>
            <input type="text" autocomplete="username" value="${esc(u.login)}" hidden>
            ${field('pw-cur', a.currentPassword, inp('pw-cur', 'password', 'autocomplete="current-password" maxlength="200" required'))}
            ${field('pw-new', a.newPassword, inp('pw-new', 'password', 'autocomplete="new-password" minlength="8" maxlength="200" required'), b.errWeak2)}
            ${field('pw-new2', a.password2, inp('pw-new2', 'password', 'autocomplete="new-password" minlength="8" maxlength="200" required'))}
            <button class="btn btn-primary" type="submit">${esc(a.changePassword)}</button>
            <p class="form-status" role="status" aria-live="polite"></p>
          </form></div>
        <div class="stack">
          <div class="cab-card"><h3>${esc(b.devices)}</h3><p class="muted">${esc(b.devicesLead)}</p><ul class="dev-list" id="dev-list">${sessions}</ul>
            ${d.sessions.length > 1 ? `<button type="button" class="btn btn-sm btn-ghost" data-end="others">${icon('logout')}${esc(b.endOthers)}</button>` : ''}<p class="form-status" id="dev-status" role="status" aria-live="polite"></p></div>
          <div class="cab-card"><div class="cab-card-h"><h3>${esc(a.tgTitle)}</h3>${u.tg ? `<span class="tag ok">${icon('check')}</span>` : ''}</div>
            <p class="muted">${esc(u.tg ? a.tgOn : d.tgReady ? a.tgOff : a.tgUnavailable)}</p>
            ${u.tg ? `<button type="button" class="btn btn-sm btn-ghost" id="tg-unlink">${esc(a.tgDisconnect)}</button>` : d.tgReady ? `<button type="button" class="btn btn-sm btn-primary" id="tg-link">${icon('send')}${esc(a.tgConnect)}</button>` : ''}
            <p class="form-status" id="tg-status" role="status" aria-live="polite"></p></div>
          <div class="cab-card cab-tips"><h3>${esc(b.tips)}</h3><ul>${b.tipsList.map((x) => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul></div>
        </div></div>`)}
    </div>
  </div>`;
}

export function renderAccount2(lang, t, cfg, data, assetVer) {
  const a = t.acc;
  const body = `<main id="main" class="cab-page">
  <section class="section section-tight"><div class="wrap acc" id="acc" data-lang="${lang}" ${dataAttrs(a, t.acc2)}>
    ${data ? dash(t, lang, cfg, data) : authBlock(t, lang)}
  </div></section></main>`;
  return layout({ lang, t, cfg, sub: 'account/', title: `${a.metaTitle} | ${cfg.brand}`, description: a.metaDesc, body, noindex: true, assetVer });
}

/* ---------- Qo'llanmalar sahifasi ---------- */
export function renderManuals(lang, t, cfg, list, signedIn, assetVer) {
  const b = t.acc2;
  const body = `<main id="main">
  <section class="page-hero"><div class="hero-bg" aria-hidden="true"><div class="grid"></div></div><div class="wrap page-hero-in"><p class="eyebrow">${esc(t.acc.eyebrow)}</p><h1>${esc(b.pageTitle)}</h1><p class="lead">${esc(b.pageLead)}</p></div></section>
  <section class="section section-tight"><div class="wrap" id="acc">
    ${list.some((m) => m.locked) && !signedIn ? `<div class="vid-note">${icon('lock')}<p>${esc(b.lockedNote)}</p><a class="btn btn-sm btn-primary" href="${url(lang, 'account/')}?next=${encodeURIComponent(url(lang, 'manuals/'))}">${esc(t.vid.signIn)}</a></div>` : ''}
    ${list.length ? `<div class="man-search">${icon('search')}<input type="search" id="man-q" placeholder="${esc(b.manSearch)}" aria-label="${esc(b.manSearch)}"></div><ul class="man-list">${list.map((m) => manualRow(b, m)).join('')}</ul>` : `<div class="empty">${icon('book')}<p>${esc(b.noManuals)}</p></div>`}
  </div></section></main>`;
  return layout({ lang, t, cfg, sub: 'manuals/', title: `${b.pageTitle} | ${cfg.brand}`, description: b.pageMeta, body, assetVer });
}
