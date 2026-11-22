// 12-bosqich: shaxsiy kabinet (kirish, ro'yxatdan o'tish, parolni tiklash, boshqaruv paneli) va video qo'llanmalar sahifasi.
import { layout, esc, icon, url, pageHero } from './template.mjs';
import { fmt } from './i18n.mjs';

const field = (id, label, input, hint = '') => `<div class="field"><label for="${id}">${esc(label)}</label>${input}${hint ? `<small class="hint">${esc(hint)}</small>` : ''}</div>`;
const inp = (id, type, attrs = '') => `<input id="${id}" type="${type}" ${attrs}>`;
const day = (s) => String(s || '').slice(0, 10);

function authBlock(a) {
  const pw = (id, ac) => inp(id, 'password', `autocomplete="${ac}" minlength="8" maxlength="200" required`);
  return `<div class="acc-auth">
    <div class="acc-tabs" role="tablist">
      <button type="button" role="tab" id="tab-login" aria-controls="f-login" aria-selected="true" data-tab="login">${esc(a.tabLogin)}</button>
      <button type="button" role="tab" id="tab-register" aria-controls="f-register" aria-selected="false" data-tab="register">${esc(a.tabRegister)}</button>
    </div>
    <form class="form acc-form" id="f-login" role="tabpanel" aria-labelledby="tab-login" novalidate>
      ${field('l-login', a.login, inp('l-login', 'text', 'autocomplete="username" inputmode="email" maxlength="120" required'))}
      ${field('l-pw', a.password, pw('l-pw', 'current-password'))}
      <button class="btn btn-primary" type="submit">${esc(a.doLogin)}${icon('arrow')}</button>
      <p class="form-status" role="status" aria-live="polite"></p>
      <button type="button" class="link-btn" data-tab="forgot">${esc(a.forgotLink)}</button>
    </form>
    <form class="form acc-form" id="f-register" role="tabpanel" aria-labelledby="tab-register" hidden novalidate>
      ${field('r-name', a.name, inp('r-name', 'text', 'autocomplete="name" maxlength="80" required'))}
      ${field('r-login', a.login, inp('r-login', 'text', 'autocomplete="username" inputmode="email" maxlength="120" required'), a.loginHint)}
      ${field('r-company', a.company, inp('r-company', 'text', 'autocomplete="organization" maxlength="100"'))}
      <div class="row2">${field('r-pw', a.password, pw('r-pw', 'new-password'), a.pwHint)}${field('r-pw2', a.password2, pw('r-pw2', 'new-password'))}</div>
      <div class="hp" aria-hidden="true"><label for="r-web">Website</label><input id="r-web" type="text" tabindex="-1" autocomplete="off"></div>
      <button class="btn btn-primary" type="submit">${esc(a.doRegister)}${icon('arrow')}</button>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>
    <div class="acc-form" id="f-forgot" hidden>
      <h2>${esc(a.forgotTitle)}</h2>
      <p class="muted">${esc(a.forgotLead)}</p>
      <form class="form" id="f-forgot1" novalidate>
        ${field('fg-login', a.login, inp('fg-login', 'text', 'autocomplete="username" inputmode="email" maxlength="120" required'))}
        <button class="btn btn-primary" type="submit">${esc(a.sendCode)}</button>
        <p class="form-status" role="status" aria-live="polite"></p>
      </form>
      <form class="form" id="f-forgot2" hidden novalidate>
        ${field('fg-code', a.code, inp('fg-code', 'text', 'inputmode="numeric" autocomplete="one-time-code" maxlength="6" required'))}
        <div class="row2">${field('fg-pw', a.newPassword, pw('fg-pw', 'new-password'), a.pwHint)}${field('fg-pw2', a.password2, pw('fg-pw2', 'new-password'))}</div>
        <button class="btn btn-primary" type="submit">${esc(a.savePassword)}</button>
        <p class="form-status" role="status" aria-live="polite"></p>
      </form>
      <button type="button" class="link-btn" data-tab="login">${icon('back')}${esc(a.backToLogin)}</button>
    </div>
  </div>`;
}

function dashBlock(t, lang, d) {
  const a = t.acc; const u = d.user;
  const courses = (d.academy?.courses || []).filter((c) => c.done > 0 || c.passed || c.expired);
  const certs = courses.filter((c) => c.passed).length;
  const reqRows = d.requests.map((r) => `<tr><td><a class="mono" href="${url(lang, 'track/')}#${esc(r.code)}">${esc(r.code)}</a></td><td class="nowrap">${esc(day(r.created_at))}</td><td>${esc(r.equipment || r.service || '—')}</td><td><span class="st st-${esc(r.status)}">${esc(t.track.s[r.status] || r.status)}</span></td></tr>`).join('');
  const courseItems = courses.map((c) => `<li class="${c.passed ? 'is-passed' : c.expired ? 'is-exp' : ''}">
      <a href="${url(lang, `academy/${c.slug}/`)}"><strong>${esc(c.title)}</strong><progress max="100" value="${c.pct}">${c.pct}%</progress>
      <span>${esc(c.passed ? a.passed : c.expired ? a.expired : `${a.continue} · ${c.pct}%`)}</span></a>
      ${c.cert_id ? `<a class="acc-cert" href="${url(lang, `academy/cert/${esc(c.cert_id)}/`)}">${icon('shield')}${esc(a.certificate)}</a>` : ''}
    </li>`).join('');
  return `<div class="acc-dash">
    <div class="acc-head">
      <div><h2>${esc(fmt(a.hello, { name: u.name }))}</h2><p class="muted">${esc(u.login)}${u.company ? ` · ${esc(u.company)}` : ''} · ${esc(a.since)} ${esc(day(u.created_at))}</p></div>
      <button type="button" class="btn btn-sm btn-ghost" id="acc-logout">${esc(a.logout)}</button>
    </div>
    <dl class="acc-stats">
      <div><dt>${esc(a.statRequests)}</dt><dd>${d.requests.length}</dd></div>
      <div><dt>${esc(a.statCourses)}</dt><dd>${courses.length}</dd></div>
      <div><dt>${esc(a.statCerts)}</dt><dd>${certs}</dd></div>
      <div><dt>${esc(a.statVideos)}</dt><dd>${d.videos}</dd></div>
    </dl>
    <div class="acc-grid">
      <section class="acc-card acc-wide" aria-labelledby="h-req">
        <div class="acc-card-h"><h3 id="h-req">${esc(a.myRequests)}</h3><a class="btn btn-sm btn-primary" href="${url(lang, '')}#contact">${icon('plus')}${esc(a.newRequest)}</a></div>
        ${reqRows ? `<div class="tbl-scroll"><table class="acc-tbl"><thead><tr><th>${esc(a.colCode)}</th><th>${esc(a.colDate)}</th><th>${esc(a.colEquipment)}</th><th>${esc(a.colStatus)}</th></tr></thead><tbody>${reqRows}</tbody></table></div>` : `<p class="muted">${esc(a.noRequests)}</p>`}
      </section>
      <section class="acc-card" aria-labelledby="h-courses">
        <div class="acc-card-h"><h3 id="h-courses">${esc(a.myCourses)}</h3></div>
        ${courseItems ? `<ul class="acc-courses">${courseItems}</ul>` : `<p class="muted">${esc(a.noCourses)}</p>`}
        <a class="btn btn-sm btn-ghost" href="${url(lang, 'academy/')}">${icon('cap')}${esc(a.toAcademy)}</a>
      </section>
      <section class="acc-card" aria-labelledby="h-vid">
        <div class="acc-card-h"><h3 id="h-vid">${esc(a.videosTitle)}</h3></div>
        <p class="muted">${esc(a.videosLead)}</p>
        <a class="btn btn-sm btn-ghost" href="${url(lang, 'videos/')}">${icon('play')}${esc(a.openVideos)}</a>
      </section>
      <section class="acc-card" aria-labelledby="h-prof">
        <div class="acc-card-h"><h3 id="h-prof">${esc(a.profile)}</h3></div>
        <form class="form" id="f-profile" novalidate>
          ${field('p-name', a.name, inp('p-name', 'text', `autocomplete="name" maxlength="80" required value="${esc(u.name)}"`))}
          ${field('p-company', a.company, inp('p-company', 'text', `autocomplete="organization" maxlength="100" value="${esc(u.company)}"`))}
          <button class="btn btn-sm btn-primary" type="submit">${esc(a.save)}</button>
          <p class="form-status" role="status" aria-live="polite"></p>
        </form>
      </section>
      <section class="acc-card" aria-labelledby="h-pw">
        <div class="acc-card-h"><h3 id="h-pw">${esc(a.security)}</h3></div>
        <form class="form" id="f-password" novalidate>
          <input type="text" autocomplete="username" value="${esc(u.login)}" hidden>
          ${field('pw-cur', a.currentPassword, inp('pw-cur', 'password', 'autocomplete="current-password" maxlength="200" required'))}
          ${field('pw-new', a.newPassword, inp('pw-new', 'password', 'autocomplete="new-password" minlength="8" maxlength="200" required'), a.pwHint)}
          ${field('pw-new2', a.password2, inp('pw-new2', 'password', 'autocomplete="new-password" minlength="8" maxlength="200" required'))}
          <button class="btn btn-sm btn-primary" type="submit">${esc(a.changePassword)}</button>
          <p class="form-status" role="status" aria-live="polite"></p>
        </form>
      </section>
      <section class="acc-card" aria-labelledby="h-tg">
        <div class="acc-card-h"><h3 id="h-tg">${esc(a.tgTitle)}</h3>${u.tg ? `<span class="tag ok">${icon('check')}</span>` : ''}</div>
        <p class="muted">${esc(u.tg ? a.tgOn : d.tgReady ? a.tgOff : a.tgUnavailable)}</p>
        ${u.tg ? `<button type="button" class="btn btn-sm btn-ghost" id="tg-unlink">${esc(a.tgDisconnect)}</button>` : d.tgReady ? `<button type="button" class="btn btn-sm btn-primary" id="tg-link">${icon('send')}${esc(a.tgConnect)}</button>` : ''}
        <p class="form-status" id="tg-status" role="status" aria-live="polite"></p>
      </section>
    </div>
  </div>`;
}

export function renderAccount(lang, t, cfg, data, assetVer) {
  const a = t.acc;
  const errs = ['errLogin', 'errExists', 'errWeak', 'errMatch', 'errName', 'errLoginFmt', 'errCode', 'errBlocked', 'errRate', 'errNet', 'errCurrent', 'saved', 'pwChanged', 'codeSent', 'tgWait'];
  const body = `<main id="main">${pageHero(a.eyebrow, data ? a.title : a.tabLogin, a.lead)}
  <section class="section section-tight"><div class="wrap acc" id="acc" data-lang="${lang}" ${errs.map((k) => `data-${k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())}="${esc(a[k])}"`).join(' ')}>
    ${data ? dashBlock(t, lang, data) : authBlock(a)}
  </div></section></main>`;
  return layout({ lang, t, cfg, sub: 'account/', title: `${a.metaTitle} | ${cfg.brand}`, description: a.metaDesc, body, noindex: true, assetVer });
}

/* ---------- Video qo'llanmalar ---------- */
function player(v) {
  if (!v.view) return `<div class="vid-lock">${icon('lock')}<span>${esc(v._t.locked)}</span></div>`;
  if (v.view.type === 'file') return `<video class="vid-el" controls preload="metadata" playsinline controlslist="nodownload" data-vid="${v.id}"><source src="${esc(v.view.src)}" type="${esc(v.view.mime)}"></video>`;
  return `<iframe class="vid-el" src="${esc(v.view.src)}" title="${esc(v.title)}" loading="lazy" allow="fullscreen; picture-in-picture; encrypted-media" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" data-vid="${v.id}"></iframe>`;
}

export function renderVideos(lang, t, cfg, videos, signedIn, assetVer) {
  const v = t.vid;
  const cats = [...new Set(videos.map((x) => x.category).filter(Boolean))];
  const anyLocked = videos.some((x) => x.locked);
  const cards = videos.map((x) => `<li class="vid-card${x.locked ? ' is-locked' : ''}" data-cat="${esc(x.category)}">
      <div class="vid-media">${player({ ...x, _t: v })}</div>
      <div class="vid-body">
        <div class="vid-tags">${x.category ? `<span class="tag">${esc(x.category)}</span>` : ''}${x.access === 'users' ? `<span class="tag">${esc(v.membersOnly)}</span>` : ''}${x.duration ? `<span class="tag mono">${esc(x.duration)}</span>` : ''}</div>
        <h2>${esc(x.title)}</h2>
        ${x.text ? `<p>${esc(x.text)}</p>` : ''}
      </div>
    </li>`).join('');
  const body = `<main id="main">${pageHero(v.eyebrow, v.title, v.lead)}
  <section class="section section-tight"><div class="wrap vids" id="vids">
    ${anyLocked && !signedIn ? `<div class="vid-note">${icon('lock')}<p>${esc(v.locked)}</p><a class="btn btn-sm btn-primary" href="${url(lang, 'account/')}?next=${encodeURIComponent(url(lang, 'videos/'))}">${esc(v.signIn)}</a></div>` : ''}
    ${cats.length > 1 ? `<div class="chips" role="group" aria-label="${esc(v.title)}"><button type="button" class="chip is-on" data-cat="" aria-pressed="true">${esc(v.all)}</button>${cats.map((c) => `<button type="button" class="chip" data-cat="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join('')}</div>` : ''}
    ${cards ? `<ul class="vid-grid">${cards}</ul>` : `<div class="empty">${icon('play')}<p>${esc(v.empty)}</p></div>`}
  </div></section></main>`;
  return layout({ lang, t, cfg, sub: 'videos/', title: `${v.metaTitle} | ${cfg.brand}`, description: v.metaDesc, keywords: t.meta9.kw.videos, body, assetVer });
}
