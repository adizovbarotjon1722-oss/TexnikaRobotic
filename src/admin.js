/* Admin panel: analitika, arizalar, portfel, akademiya, matnlar, sozlamalar.
   CSP (Trusted Types) tufayli innerHTML ishlatilmaydi: DOM faqat createElement/textContent bilan quriladi. */
(() => {
  'use strict';
  const root = document.getElementById('adm');
  let CSRF = root.dataset.csrf || '';
  let ME = null;
  const LANGS = ['uz', 'ru', 'en'];
  const LANG_NAME = { uz: 'O‘zbekcha', ru: 'Русский', en: 'English' };
  const STATUS = { new: 'Yangi', diagnosing: 'Tashxis', scheduled: 'Rejalashtirildi', in_progress: 'Ishlanmoqda', waiting_parts: 'Ehtiyot qism kutilmoqda', done: 'Bajarildi', cancelled: 'Bekor qilindi' };
  const PRIO = { critical: 'Kritik', high: 'Yuqori', normal: 'O‘rta', low: 'Past' };
  const LEVEL = { basic: 'Boshlang‘ich', advanced: 'Chuqurlashtirilgan', expert: 'Ekspert' };
  const DEVICE = { desktop: 'Kompyuter', mobile: 'Telefon', tablet: 'Planshet' };
  const SVG_NS = 'http://www.w3.org/2000/svg';

  /* ---------- DOM yordamchilari ---------- */
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k === 'value') el.value = v;
      else if (k === 'checked') el.checked = Boolean(v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const c of kids.flat(Infinity)) if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(String(c)));
    return el;
  }
  function s(tag, attrs, ...kids) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs || {})) if (v != null) el.setAttribute(k, v);
    for (const c of kids.flat()) if (c) el.append(c.nodeType ? c : document.createTextNode(String(c)));
    return el;
  }
  const clear = (el) => { while (el.firstChild) el.firstChild.remove(); return el; };
  const fmtDate = (iso) => { if (!iso) return '—'; const d = new Date(iso); return d.toLocaleString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }); };
  const fmtDay = (d) => { const [, m, dd] = d.split('-'); return `${dd}.${m}`; };
  const num = (n) => Number(n || 0).toLocaleString('ru-RU');

  let toastT;
  function toast(msg, kind = 'ok') {
    let t = document.getElementById('toast');
    if (!t) { t = h('div', { id: 'toast', role: 'status', 'aria-live': 'polite' }); document.body.append(t); }
    t.className = `toast show ${kind}`; t.textContent = msg;
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 3200);
  }

  async function api(path, opts = {}) {
    const init = { method: opts.method || 'GET', headers: {}, credentials: 'same-origin' };
    if (init.method !== 'GET') init.headers['X-CSRF'] = CSRF;
    if (opts.body !== undefined) { init.headers['Content-Type'] = 'application/json'; init.body = JSON.stringify(opts.body); }
    const r = await fetch(path.startsWith('/admin') ? path : '/admin/api' + path, init);
    if (r.status === 401 && path !== '/password') { showLogin(); throw new Error('auth'); }
    const ct = r.headers.get('content-type') || '';
    const data = ct.includes('json') ? await r.json() : null;
    if (!r.ok) { const e = new Error((data && data.error) || String(r.status)); e.status = r.status; throw e; }
    return data;
  }
  const ERR = { bad_password: 'Parol noto‘g‘ri', rate: 'Juda ko‘p urinish. Keyinroq qayta urinib ko‘ring', slug: 'Bu manzil (slug) band yoki noto‘g‘ri', title: 'O‘zbekcha sarlavha majburiy', weak: 'Yangi parol kamida 10 belgi bo‘lsin', domain: 'Domen https:// bilan boshlanishi kerak', email: 'Email noto‘g‘ri', bad_image: 'Rasm formati qabul qilinmadi (JPEG, PNG, WEBP)', company: 'Korxona nomini kiriting', exists: 'Bunday kod mavjud', csrf: 'Sessiya eskirdi, sahifani yangilang', src: 'Video tanlanmagan: fayl yuklang yoki YouTube/Vimeo havolasini kiriting', format: 'Faqat MP4 yoki WebM video yuklanadi', size: 'Video juda katta (4 GB gacha)', offset: 'Yuklash uzildi, qayta urinib ko‘ring', otp_required: 'Ilovadagi 6 xonali kodni kiriting', bad_otp: 'Kod noto‘g‘ri yoki eskirgan', type: 'Faqat PDF, Word, Excel, PowerPoint yoki ZIP fayl', file: 'Fayl tanlanmagan' };
  const errText = (e) => ERR[e.message] || `Xatolik: ${e.message}`;

  /* ---------- Kirish ---------- */
  function showLogin() {
    clear(root);
    const pw = h('input', { type: 'password', id: 'l-pw', autocomplete: 'current-password', required: true, minlength: '10' });
    const st = h('p', { class: 'l-err', role: 'alert' });
    const otp = h('input', { type: 'text', id: 'l-otp', inputmode: 'numeric', autocomplete: 'one-time-code', maxlength: '6', pattern: '[0-9]{6}' });
    const otpBox = h('div', { class: 'l-otp', hidden: true }, h('label', { for: 'l-otp', text: 'Ilovadagi kod (Google Authenticator)' }), otp);
    const btn = h('button', { class: 'btn btn-primary', type: 'submit', text: 'Kirish' });
    const form = h('form', { class: 'login card', onsubmit: async (e) => {
      e.preventDefault(); btn.disabled = true; st.textContent = '';
      try {
        const r = await fetch('/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw.value, otp: otp.value.trim() || undefined }), credentials: 'same-origin' });
        const d = await r.json().catch(() => ({}));
        if (d.error === 'otp_required' || d.error === 'bad_otp') { otpBox.hidden = false; otp.focus(); if (d.error === 'bad_otp') { st.textContent = errText(new Error('bad_otp')); otp.select(); } return; }
        if (!r.ok) throw new Error(d.error || r.status);
        CSRF = d.csrf; boot();
      } catch (er) { st.textContent = errText(er); pw.select(); } finally { btn.disabled = false; }
    } },
    h('div', { class: 'l-logo' }, logo(), h('span', { text: 'Boshqaruv paneli' })),
    h('label', { for: 'l-pw', text: 'Parol' }), pw, otpBox, st, btn,
    h('a', { href: '/', class: 'l-back', text: '← Saytga qaytish' }));
    root.append(h('main', { class: 'login-wrap' }, form));
    pw.focus();
  }
  function logo() {
    return s('svg', { viewBox: '0 0 32 32', width: '28', height: '28', 'aria-hidden': 'true', class: 'logo-ic' },
      s('rect', { x: '2', y: '2', width: '28', height: '28', rx: '7', fill: 'var(--accent)' }),
      s('path', { d: 'M9 23h14M12 23v-5l4-6 5 3', stroke: 'var(--on-accent)', 'stroke-width': '2.4', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
      s('circle', { cx: '21', cy: '15', r: '2.4', fill: 'var(--on-accent)' }));
  }

  /* ---------- Asosiy tuzilma ---------- */
  const TABS = [
    ['dash', 'Analitika', 'M3 20h18M6 16v-5M11 16V7M16 16v-8M21 16V4'],
    ['req', 'Arizalar', 'M5 4h14v16H5zM8 8h8M8 12h8M8 16h5'],
    ['eq', 'Uskunalar', 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2z'],
    ['docs', 'Hujjatlar', 'M14 3H6v18h12V7zM14 3v4h4M9 12h6M9 16h6'],
    ['err', 'Xato kodlari', 'M12 3 2.5 20h19zM12 10v4M12 17v.01'],
    ['team', 'Ustalar', 'M9 11a4 4 0 100-8 4 4 0 000 8zM2 21c.8-4 3.6-6 7-6s6.2 2 7 6M17 8h5M19.5 5.5v5'],
    ['port', 'Portfel', 'M3 7h18v13H3zM8 7V4h8v3'],
    ['rev', 'Baholar', 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z'],
    ['acad', 'Akademiya', 'M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5'],
    ['vid', 'Videolar', 'M3 5h18v14H3zM10 9v6l5-3z'],
    ['man', 'Qo‘llanmalar', 'M4 4.5h6a2 2 0 012 2v13a2 2 0 00-2-2H4zM20 4.5h-6a2 2 0 00-2 2v13a2 2 0 012-2h6z'],
    ['users', 'Foydalanuvchilar', 'M9 11a4 4 0 100-8 4 4 0 000 8zM2 21c.8-4 3.6-6 7-6s6.2 2 7 6M16 3.5a4 4 0 010 7.5M18 15c2 .6 3.4 2.6 4 6'],
    ['text', 'Matnlar', 'M4 6h16M4 12h10M4 18h13'],
    ['set', 'Sozlamalar', 'M12 8a4 4 0 100 8 4 4 0 000-8zM3 12h2M19 12h2M12 3v2M12 19v2']
  ];
  let main, navBtns = {}, badge;

  async function boot() {
    try { ME = await api('/me'); CSRF = ME.csrf; } catch { return showLogin(); }
    clear(root);
    const nav = h('nav', { class: 'side', 'aria-label': 'Bo‘limlar' },
      h('a', { class: 'side-logo', href: '/', title: 'Saytni ochish', target: '_blank', rel: 'noopener' }, logo(), h('span', { text: 'Texnika Servis' })),
      h('div', { class: 'side-nav' }, TABS.map(([k, label, d]) => {
        const b = h('button', { type: 'button', class: 'side-btn', 'data-tab': k, onclick: () => go(k) },
          s('svg', { viewBox: '0 0 24 24', width: '18', height: '18', 'aria-hidden': 'true' }, s('path', { d, fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })),
          h('span', { text: label }));
        if (k === 'req') { badge = h('b', { class: 'side-badge', hidden: true }); b.append(badge); }
        navBtns[k] = b; return b;
      })),
      h('div', { class: 'side-foot' },
        h('a', { href: '/', target: '_blank', rel: 'noopener', class: 'side-link', text: 'Saytni ko‘rish ↗' }),
        h('button', { type: 'button', class: 'side-link', text: 'Chiqish', onclick: logout })));
    main = h('main', { class: 'adm-main', id: 'main', tabindex: '-1' });
    root.append(nav, main);
    window.addEventListener('hashchange', route);
    route();
  }
  async function logout() { try { await api('/admin/logout', { method: 'POST' }); } catch { /* baribir chiqamiz */ } CSRF = ''; showLogin(); }
  function go(k) { if (location.hash !== '#' + k) location.hash = k; else route(); }
  function route() {
    const [k, arg] = location.hash.slice(1).split('/');
    const tab = TABS.some((t) => t[0] === k) ? k : 'dash';
    for (const [n, b] of Object.entries(navBtns)) b.classList.toggle('on', n === tab), b.setAttribute('aria-current', n === tab ? 'page' : 'false');
    clear(main);
    ({ dash: viewDash, req: viewReq, eq: viewEq, docs: viewDocs, err: viewErr, team: viewTeam, port: viewPort, rev: viewRev, acad: viewAcad, vid: viewVid, man: viewMan, users: viewUsers, text: viewText, set: viewSet })[tab](arg);
    main.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
  const head = (title, sub, ...actions) => h('header', { class: 'v-head' }, h('div', {}, h('h1', { text: title }), sub ? h('p', { class: 'muted', text: sub }) : null), h('div', { class: 'v-act' }, actions));
  const loading = () => h('div', { class: 'loading', text: 'Yuklanmoqda…' });

  /* ---------- Analitika ---------- */
  let days = 30;
  async function viewDash() {
    const range = h('div', { class: 'seg', role: 'group', 'aria-label': 'Davr' }, [7, 30, 90, 365].map((d) => h('button', { type: 'button', class: d === days ? 'on' : '', text: d === 365 ? '1 yil' : `${d} kun`, onclick: () => { days = d; route(); } })));
    main.append(head('Analitika', 'Tashrifchilar, arizalar va akademiya. Cookie ishlatilmaydi, IP saqlanmaydi.', range));
    const box = h('div', {}, loading()); main.append(box);
    let st;
    try { st = await api(`/stats?days=${days}`); } catch (e) { clear(box).append(h('p', { class: 'err', text: errText(e) })); return; }
    clear(box);
    const t = st.totals;
    if (badge) { badge.hidden = !t.open; badge.textContent = t.open; }
    const delta = (cur, prev) => { if (!prev) return null; const p = Math.round((cur - prev) / prev * 100); return h('span', { class: `delta ${p >= 0 ? 'up' : 'down'}`, text: `${p >= 0 ? '▲' : '▼'} ${Math.abs(p)}%` }); };
    box.append(h('section', { class: 'kpis' },
      kpi('Tashrifchilar', num(t.visitors), `Bugun: ${num(t.today)}`, delta(t.visitors, t.prevVisitors)),
      kpi('Sahifa ko‘rishlar', num(t.pageviews), t.visitors ? `${(t.pageviews / t.visitors).toFixed(1)} sahifa / tashrif` : ''),
      kpi('Arizalar', num(t.requests), `AI tashxis bilan: ${num(t.aiRequests)}`, delta(t.requests, t.prevRequests)),
      kpi('Konversiya', `${Math.min(100, t.conversion)}%`, 'Tashrifdan arizaga'),
      kpi('Ochiq arizalar', num(t.open), t.critical ? `Kritik: ${t.critical}` : 'Kritik yo‘q', null, t.critical ? 'hot' : '', () => { location.hash = 'req'; })));

    box.append(h('section', { class: 'card chart-card' },
      h('div', { class: 'card-h' }, h('h2', { text: 'Kunlik dinamika' }),
        h('div', { class: 'legend' }, h('span', { class: 'lg lg-v', text: 'Tashrifchilar' }), h('span', { class: 'lg lg-r', text: 'Arizalar' }))),
      dailyChart(st.daily)));

    const grid = h('section', { class: 'grid2' });
    grid.append(
      barCard('Eng ko‘p ochilgan sahifalar', st.pages, (k) => k || '/'),
      barCard('Tillar', st.langs, (k) => LANG_NAME[k] || k || '—'),
      barCard('Qayerdan kelishdi', st.refs, (k) => k),
      barCard('Qurilmalar', st.devices, (k) => DEVICE[k] || k),
      barCard('Tugma bosishlar', st.ctas, ctaLabel),
      barCard('Arizalar holati', st.reqStatus, (k) => STATUS[k] || k),
      barCard('Ustuvorlik', st.reqPriority, (k) => PRIO[k] || k, (k) => `p-${k}`),
      barCard('Xizmat turlari', st.reqService, (k) => k));
    box.append(grid);

    const a = st.academy;
    box.append(h('section', { class: 'grid2' },
      h('div', { class: 'card' }, h('h2', { text: 'Akademiya' }),
        h('div', { class: 'mini-kpis' },
          mini('Tinglovchilar', a.learners), mini('Test urinishlari', a.attempts), mini('Sertifikat olganlar', a.passed),
          mini('O‘tish darajasi', a.attempts ? `${Math.round(a.passed / a.attempts * 100)}%` : '—'))),
      h('div', { class: 'card' }, h('div', { class: 'card-h' }, h('h2', { text: 'So‘nggi arizalar' }), h('a', { href: '#req', class: 'link', text: 'Barchasi →' })),
        st.recent.length ? h('ul', { class: 'recent' }, st.recent.map((r) => h('li', {}, h('a', { href: `#req/${r.id}` },
          h('span', { class: `dot p-${r.priority}`, title: PRIO[r.priority] }), h('b', { class: 'mono', text: r.code }), h('span', { class: 'ell', text: `${r.name || '—'} · ${r.equipment || ''}` }), pill(r.status))))) : empty('Hali arizalar yo‘q'))));
  }
  const CTA = { cta_header: 'Menyu: ariza', cta_hero: 'Bosh ekran: AI tashxis', cta_case: 'Portfel: AI tashxis', call_hero: 'Bosh ekran: qo‘ng‘iroq', call_form: 'Forma: qo‘ng‘iroq', call_footer: 'Pastda: telefon raqam', call_footer_btn: 'Pastda: qo‘ng‘iroq tugmasi', tg_footer: 'Pastda: Telegram', tg_form: 'Forma: Telegram', wa_footer: 'Pastda: WhatsApp', wa_form: 'Forma: WhatsApp', academy_home: 'Akademiyaga o‘tish', ai_ok: 'AI tashxis olindi' };
  const ctaLabel = (k) => CTA[k] || (/^plan_(\d)$/.test(k || '') ? `Narx rejasi ${+k.slice(5) + 1}` : k || '—');
  function kpi(label, val, sub, delta, cls = '', onclick) {
    return h(onclick ? 'button' : 'div', { class: `kpi card ${cls}`, type: onclick ? 'button' : null, onclick }, h('span', { class: 'kpi-l', text: label }), h('strong', { class: 'kpi-v', text: val }), h('span', { class: 'kpi-s' }, sub || '', delta ? ' ' : '', delta));
  }
  const mini = (l, v) => h('div', { class: 'mini' }, h('strong', { text: typeof v === 'number' ? num(v) : v }), h('span', { text: l }));
  const empty = (t) => h('p', { class: 'empty', text: t });
  const pill = (st) => h('span', { class: `pill st-${st}`, text: STATUS[st] || st });

  function barCard(title, rows, label, cls) {
    const max = Math.max(1, ...rows.map((r) => r.n));
    const total = rows.reduce((a, r) => a + r.n, 0);
    return h('div', { class: 'card' }, h('h2', { text: title }),
      rows.length ? h('ul', { class: 'bars' }, rows.map((r) => h('li', {},
        h('div', { class: 'bar-row' }, h('span', { class: 'ell', text: label(r.k), title: label(r.k) }), h('b', { text: `${num(r.n)}` }), h('small', { text: total ? `${Math.round(r.n / total * 100)}%` : '' })),
        h('div', { class: 'bar' }, barFill(r.n / max, cls ? cls(r.k) : ''))))) : empty('Ma’lumot yo‘q'));
  }
  // CSSOM orqali kenglik berish CSP style-src bilan mos (style atributi markupda yozilmaydi)
  function barFill(ratio, cls) { const i = h('i', { class: cls }); i.style.width = `${Math.max(2, ratio * 100)}%`; return i; }

  function dailyChart(daily) {
    const W = 900, H = 240, P = { l: 36, r: 12, t: 14, b: 26 };
    const iw = W - P.l - P.r, ih = H - P.t - P.b;
    const maxV = Math.max(4, ...daily.map((d) => d.visitors));
    const maxR = Math.max(2, ...daily.map((d) => d.requests));
    const nice = (m) => { const p = 10 ** Math.floor(Math.log10(m)); return Math.ceil(m / p) * p; };
    const top = nice(maxV);
    const x = (i) => P.l + (daily.length === 1 ? iw / 2 : (i / (daily.length - 1)) * iw);
    const y = (v) => P.t + ih - (v / top) * ih;
    const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'chart', role: 'img', 'aria-label': 'Kunlik tashrifchilar va arizalar grafigi' });
    for (let k = 0; k <= 4; k++) {
      const v = (top / 4) * k, yy = y(v);
      svg.append(s('line', { x1: P.l, x2: W - P.r, y1: yy, y2: yy, class: 'gl' }), s('text', { x: P.l - 6, y: yy + 4, class: 'ax', 'text-anchor': 'end' }, String(Math.round(v))));
    }
    const bw = Math.max(2, Math.min(14, iw / daily.length * 0.5));
    daily.forEach((d, i) => { if (d.requests) { const hh = (d.requests / maxR) * ih * 0.45; svg.append(s('rect', { x: x(i) - bw / 2, y: P.t + ih - hh, width: bw, height: hh, rx: 2, class: 'rq' })); } });
    const pts = daily.map((d, i) => `${x(i).toFixed(1)},${y(d.visitors).toFixed(1)}`);
    svg.append(s('path', { d: `M${pts[0]} L${pts.join(' L')} L${x(daily.length - 1)},${P.t + ih} L${x(0)},${P.t + ih} Z`, class: 'area' }));
    svg.append(s('path', { d: `M${pts.join(' L')}`, class: 'line' }));
    const step = Math.ceil(daily.length / 8);
    daily.forEach((d, i) => { const last = i === daily.length - 1; if ((i % step === 0 && (last || daily.length - 1 - i >= step / 2)) || last) svg.append(s('text', { x: x(i), y: H - 6, class: 'ax', 'text-anchor': 'middle' }, fmtDay(d.day))); });
    // Kursor bilan qiymatlarni ko'rish
    const tip = h('div', { class: 'tip', hidden: true });
    const guide = s('line', { y1: P.t, y2: P.t + ih, class: 'guide', visibility: 'hidden' });
    const dot = s('circle', { r: 4.5, class: 'pt', visibility: 'hidden' });
    svg.append(guide, dot);
    const wrap = h('div', { class: 'chart-wrap' }, svg, tip);
    svg.addEventListener('pointermove', (e) => {
      const r = svg.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width) * W;
      const i = Math.max(0, Math.min(daily.length - 1, Math.round(((px - P.l) / iw) * (daily.length - 1))));
      const d = daily[i];
      guide.setAttribute('x1', x(i)); guide.setAttribute('x2', x(i)); guide.setAttribute('visibility', 'visible');
      dot.setAttribute('cx', x(i)); dot.setAttribute('cy', y(d.visitors)); dot.setAttribute('visibility', 'visible');
      clear(tip).append(h('b', { text: fmtDay(d.day) }), h('span', { text: `Tashrifchilar: ${d.visitors}` }), h('span', { text: `Ko‘rishlar: ${d.pageviews}` }), h('span', { text: `Arizalar: ${d.requests}` }));
      tip.hidden = false;
      const left = (x(i) / W) * r.width;
      tip.style.left = `${Math.min(r.width - 150, Math.max(0, left + 12))}px`;
    });
    svg.addEventListener('pointerleave', () => { tip.hidden = true; guide.setAttribute('visibility', 'hidden'); dot.setAttribute('visibility', 'hidden'); });
    return wrap;
  }

  /* ---------- Arizalar ---------- */
  const reqFilter = { status: '', q: '', open: '1' };
  async function viewReq(id) {
    if (id) return viewReqOne(+id);
    const q = h('input', { type: 'search', placeholder: 'Kod, ism, telefon, uskuna…', value: reqFilter.q, 'aria-label': 'Qidirish' });
    const sel = h('select', { 'aria-label': 'Holat' }, h('option', { value: '', text: 'Barcha holatlar' }), Object.entries(STATUS).map(([k, v]) => h('option', { value: k, text: v })));
    sel.value = reqFilter.status;
    const openCb = h('input', { type: 'checkbox', checked: reqFilter.open === '1' });
    main.append(head('Arizalar', 'Saytdan kelgan servis so‘rovlari. Har biri Telegramga ham yuboriladi.',
      h('a', { class: 'btn btn-ghost', href: '/admin/api/requests.csv', download: 'arizalar.csv', text: 'CSV yuklab olish' })));
    const list = h('div', { class: 'card tbl-card' }, loading());
    main.append(h('div', { class: 'filters' }, q, sel, h('label', { class: 'cb' }, openCb, ' Faqat ochiqlar')), list);
    let t;
    const load = async () => {
      Object.assign(reqFilter, { q: q.value.trim(), status: sel.value, open: openCb.checked ? '1' : '' });
      const p = new URLSearchParams(Object.entries(reqFilter).filter(([, v]) => v));
      try { renderReqList(list, await api(`/requests?${p}`)); } catch (e) { clear(list).append(h('p', { class: 'err', text: errText(e) })); }
    };
    q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(load, 250); });
    sel.addEventListener('change', load); openCb.addEventListener('change', load);
    load();
  }
  function renderReqList(box, rows) {
    clear(box);
    if (!rows.length) return box.append(empty('Mos ariza topilmadi.'));
    box.append(h('table', { class: 'tbl' },
      h('thead', {}, h('tr', {}, ['', 'Kod', 'Sana', 'Mijoz', 'Uskuna', 'Holat', ''].map((c) => h('th', { text: c })))),
      h('tbody', {}, rows.map((r) => h('tr', { class: 'row-link', tabindex: '0', onclick: () => { location.hash = `req/${r.id}`; }, onkeydown: (e) => { if (e.key === 'Enter') location.hash = `req/${r.id}`; } },
        h('td', {}, h('span', { class: `dot p-${r.priority}`, title: PRIO[r.priority] })),
        h('td', { class: 'mono', text: r.code }),
        h('td', { class: 'nowrap', text: fmtDate(r.created_at) }),
        h('td', {}, h('b', { text: r.name || '—' }), h('small', { class: 'muted block', text: [r.phone, r.company].filter(Boolean).join(' · ') })),
        h('td', { class: 'ell-cell', text: r.equipment || r.service || '—' }),
        h('td', {}, pill(r.status)),
        h('td', { class: 'tags' }, r.has_ai ? h('span', { class: 'tag', text: 'AI' }) : null, r.tg_ok ? null : h('span', { class: 'tag warn', title: 'Telegramga yuborilmagan', text: 'TG ✕' })))))));
  }
  async function viewReqOne(id) {
    main.append(h('a', { href: '#req', class: 'back', text: '← Arizalar' }));
    const box = h('div', {}, loading()); main.append(box);
    let r;
    try { r = await api(`/requests/${id}`); } catch (e) { clear(box).append(h('p', { class: 'err', text: errText(e) })); return; }
    clear(box);
    const tel = (r.phone || '').replace(/[^\d+]/g, '');
    box.append(head(r.code, `${fmtDate(r.created_at)} · ${LANG_NAME[r.lang] || ''}`,
      tel ? h('a', { class: 'btn btn-primary', href: `tel:${tel}`, text: 'Qo‘ng‘iroq qilish' }) : null,
      h('a', { class: 'btn btn-ghost', href: `/${r.lang && r.lang !== 'uz' ? r.lang + '/' : ''}track/#${r.code}`, target: '_blank', rel: 'noopener', text: 'Mijoz sahifasi ↗' }),
      h('button', { type: 'button', class: 'btn btn-ghost', text: 'Taklif tuzish', onclick: () => docFromRequest(r, 'quote') }),
      h('button', { type: 'button', class: 'btn btn-ghost', text: 'Dalolatnoma', onclick: () => docFromRequest(r, 'act') }),
      h('button', { type: 'button', class: 'btn btn-ghost', text: 'Servis hisoboti', onclick: () => docFromRequest(r, 'report') }),
      r.equipment_id ? h('a', { class: 'btn btn-ghost', href: `#eq/${r.equipment_id}`, text: 'Uskuna' }) : null));

    const info = h('dl', { class: 'facts' }, [['Mijoz', r.name], ['Telefon', r.phone], ['Korxona', r.company], ['Xizmat', r.service], ['Uskuna', r.equipment], ['Manba', r.source]].filter(([, v]) => v).map(([k, v]) => [h('dt', { text: k }), h('dd', { text: v })]));
    const left = h('div', { class: 'stack' },
      h('div', { class: 'card' }, h('h2', { text: 'Ariza' }), info, h('h3', { text: 'Muammo tavsifi' }), h('p', { class: 'pre', text: r.message || '—' }),
        r.images.length ? h('div', { class: 'gal' }, r.images.map((f) => h('a', { href: `/admin/uploads/${f}`, target: '_blank', rel: 'noopener' }, h('img', { src: `/admin/uploads/${f}`, alt: 'Mijoz yuborgan rasm', loading: 'lazy' })))) : null));
    if (r.ai) {
      const a = r.ai;
      left.append(h('div', { class: 'card ai-card' },
        h('div', { class: 'card-h' }, h('h2', { text: 'AI tashxis' }), h('span', { class: `pill p-${a.priority}`, text: PRIO[a.priority] || a.priority })),
        h('p', { text: a.diagnosis }), a.priority_reason ? h('p', { class: 'muted', text: a.priority_reason }) : null,
        a.equipment_guess ? h('p', {}, h('b', { text: 'Uskuna: ' }), a.equipment_guess) : null,
        h('h3', { text: 'Ehtimoliy sabablar' }), h('ol', {}, (a.causes || []).map((c) => h('li', { text: c }))),
        h('h3', { text: 'Tavsiya etilgan qadamlar' }), h('ol', {}, (a.next_steps || []).map((c) => h('li', { text: c }))),
        a.safety ? h('p', { class: 'warn-box', text: a.safety }) : null));
    }

    const stSel = h('select', { id: 'u-st' }, Object.entries(STATUS).map(([k, v]) => h('option', { value: k, text: v }))); stSel.value = r.status;
    const prSel = h('select', { id: 'u-pr' }, Object.entries(PRIO).map(([k, v]) => h('option', { value: k, text: v }))); prSel.value = r.priority;
    const note = h('textarea', { id: 'u-note', rows: '3', maxlength: '1000', placeholder: 'Masalan: Ertaga 10:00 da ustaxonaga boramiz. Kerakli ehtiyot qism buyurtma qilindi.' });
    const pub = h('input', { type: 'checkbox', checked: true });
    const save = h('button', { class: 'btn btn-primary', type: 'submit', text: 'Saqlash' });
    const form = h('form', { class: 'card', onsubmit: async (e) => {
      e.preventDefault(); save.disabled = true;
      try { await api(`/requests/${id}`, { method: 'POST', body: { status: stSel.value, priority: prSel.value, note: note.value.trim(), public: pub.checked } }); toast('Saqlandi. Mijoz kuzatuv sahifasida ko‘radi.'); route(); } catch (er) { toast(errText(er), 'bad'); save.disabled = false; }
    } }, h('h2', { text: 'Holatni yangilash' }),
      h('div', { class: 'row2' }, h('div', {}, h('label', { for: 'u-st', text: 'Holat' }), stSel), h('div', {}, h('label', { for: 'u-pr', text: 'Ustuvorlik' }), prSel)),
      h('label', { for: 'u-note', text: 'Izoh (ixtiyoriy)' }), note,
      h('label', { class: 'cb' }, pub, ' Mijozga ko‘rinsin (kuzatuv sahifasida)'), save);
    const tl = h('div', { class: 'card' }, h('h2', { text: 'Tarix' }),
      r.updates.length ? h('ol', { class: 'tl' }, r.updates.map((u) => h('li', {}, h('div', { class: 'tl-h' }, pill(u.status), h('small', { class: 'muted', text: fmtDate(u.created_at) }), u.public ? null : h('span', { class: 'tag', text: 'Ichki' })), u.note ? h('p', { text: u.note }) : null))) : empty('Hali yangilanish yo‘q'));
    const del = h('button', { class: 'btn btn-danger', type: 'button', text: 'Arizani o‘chirish', onclick: async () => {
      if (!confirm(`${r.code} arizasi va uning rasmlari butunlay o‘chirilsinmi?`)) return;
      try { await api(`/requests/${id}`, { method: 'DELETE' }); toast('O‘chirildi'); location.hash = 'req'; } catch (er) { toast(errText(er), 'bad'); }
    } });
    box.append(h('div', { class: 'split' }, left, h('div', { class: 'stack' }, form, tl, h('div', { class: 'danger-zone' }, del))));
  }

  /* ---------- Rasm yuklash (portfel) ---------- */
  function readAsDataUrl(file, max = 1800) {
    return new Promise((resolve, reject) => {
      const img = new Image(); const url = URL.createObjectURL(file);
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
        resolve(c.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('bad_image')); };
      img.src = url;
    });
  }

  /* ---------- Trilingual maydon ---------- */
  function triField(label, val = {}, { area = false, rows = 3, max = 2000, hint } = {}) {
    const inputs = {};
    const tabs = h('div', { class: 'tri-tabs', role: 'tablist' });
    const body = h('div', { class: 'tri-body' });
    LANGS.forEach((l, i) => {
      const inp = area ? h('textarea', { rows: String(rows), maxlength: String(max), value: val[l] || '', 'aria-label': `${label} (${l})`, lang: l }) : h('input', { type: 'text', maxlength: String(max), value: val[l] || '', 'aria-label': `${label} (${l})`, lang: l });
      inp.hidden = i !== 0; inputs[l] = inp; body.append(inp);
      const b = h('button', { type: 'button', role: 'tab', class: i === 0 ? 'on' : '', text: l.toUpperCase(), onclick: () => {
        tabs.querySelectorAll('button').forEach((x) => x.classList.remove('on')); b.classList.add('on');
        LANGS.forEach((m) => { inputs[m].hidden = m !== l; }); inputs[l].focus();
      } });
      const mark = () => b.classList.toggle('missing', !inputs[l].value.trim());
      inp.addEventListener('input', mark); mark();
      tabs.append(b);
    });
    const el = h('div', { class: 'tri' }, h('div', { class: 'tri-h' }, h('span', { class: 'lbl', text: label }), tabs), body, hint ? h('small', { class: 'muted', text: hint }) : null);
    el.value = () => Object.fromEntries(LANGS.map((l) => [l, inputs[l].value.trim()]));
    return el;
  }
  const field = (label, inp, hint) => h('label', { class: 'fld' }, h('span', { class: 'lbl', text: label }), inp, hint ? h('small', { class: 'muted', text: hint }) : null);

  /* ---------- Portfel ---------- */
  async function viewPort(id) {
    if (id) return editPort(id === 'new' ? null : +id);
    main.append(head('Portfel', 'ABB, KUKA va boshqa uskunalarda bajarilgan ishlar. Uch tilda saytda chiqadi.', h('a', { class: 'btn btn-primary', href: '#port/new', text: '+ Yangi ish' })));
    const box = h('div', { class: 'cards' }, loading()); main.append(box);
    let rows;
    try { rows = await api('/portfolio'); } catch (e) { clear(box).append(h('p', { class: 'err', text: errText(e) })); return; }
    clear(box);
    if (rows.some((r) => r.sample)) main.insertBefore(h('p', { class: 'note' }, h('b', { text: 'Namuna ishlar: ' }), 'saytda “namuna” belgisi bilan ko‘rinadi va Google’da indekslanmaydi. O‘zingizning haqiqiy ishlaringizni qo‘shing, keyin namunalarni o‘chiring yoki yashiring.'), box);
    if (!rows.length) box.append(empty('Hali ish qo‘shilmagan.'));
    for (const r of rows) {
      box.append(h('a', { class: 'card p-card', href: `#port/${r.id}` },
        r.images[0] ? h('img', { src: `/media/${r.images[0]}`, alt: '', loading: 'lazy' }) : h('div', { class: `p-ph cv-${r.cover}`, text: r.brand || '—' }),
        h('div', { class: 'p-b' }, h('div', { class: 'tags' }, h('span', { class: 'tag', text: r.brand || '—' }), r.sample ? h('span', { class: 'tag warn', text: 'Namuna' }) : null, r.published ? null : h('span', { class: 'tag', text: 'Yashirin' })),
          h('b', { text: r.data.title?.uz || r.slug }), h('small', { class: 'muted', text: [r.model, r.year].filter(Boolean).join(' · ') }))));
    }
  }
  async function editPort(id) {
    main.append(h('a', { href: '#port', class: 'back', text: '← Portfel' }));
    let r = { slug: '', brand: '', model: '', year: new Date().getFullYear(), images: [], cover: 'robot', data: {}, published: 1, sample: 0, sort: 0 };
    if (id) { const all = await api('/portfolio'); r = all.find((x) => x.id === id); if (!r) return main.append(empty('Topilmadi')); }
    const d = r.data || {};
    const inp = (v, a = {}) => h('input', { type: 'text', value: v ?? '', ...a });
    const f = {
      brand: inp(r.brand, { maxlength: '40', placeholder: 'KUKA' }), model: inp(r.model, { maxlength: '80', placeholder: 'KR 210 R2700, KRC4' }),
      year: inp(r.year, { type: 'number', min: '2000', max: '2100' }), slug: inp(r.slug, { maxlength: '80', placeholder: 'kuka-kr210-mastering', pattern: '[a-z0-9-]*' }),
      sort: inp(r.sort, { type: 'number' }),
      cover: h('select', {}, ['robot', 'kuka', 'abb', 'drive'].map((c) => h('option', { value: c, text: { robot: 'Robot (umumiy)', kuka: 'KUKA', abb: 'ABB', drive: 'Drayver / elektronika' }[c] }))),
      published: h('input', { type: 'checkbox', checked: r.published }), sample: h('input', { type: 'checkbox', checked: r.sample })
    };
    f.cover.value = r.cover || 'robot';
    const tri = {
      title: triField('Sarlavha', d.title, { max: 160 }), industry: triField('Soha', d.industry, { max: 80, hint: 'Masalan: Avtomobil, Oziq-ovqat, Plastmassa' }),
      problem: triField('Muammo', d.problem, { area: true, max: 1500 }), solution: triField('Yechim', d.solution, { area: true, rows: 5, max: 2500 }), result: triField('Natija', d.result, { area: true, max: 1500, hint: 'Raqamlar bilan yozing: to‘xtash vaqti, tejalgan summa, ishlab chiqarish tiklangan vaqt.' })
    };
    let images = [...r.images];
    const gal = h('div', { class: 'gal edit' });
    const drawGal = () => {
      clear(gal);
      images.forEach((file, i) => gal.append(h('figure', {}, h('img', { src: `/media/${file}`, alt: '' }),
        h('div', { class: 'gal-act' },
          i ? h('button', { type: 'button', title: 'Oldinga', text: '←', onclick: () => { [images[i - 1], images[i]] = [images[i], images[i - 1]]; drawGal(); } }) : null,
          h('button', { type: 'button', title: 'Olib tashlash', text: '✕', onclick: () => { images.splice(i, 1); drawGal(); } })),
        i === 0 ? h('figcaption', { text: 'Asosiy' }) : null)));
      gal.append(fileBtn);
    };
    const file = h('input', { type: 'file', accept: 'image/jpeg,image/png,image/webp', multiple: true, hidden: true, onchange: async () => {
      for (const fl of [...file.files].slice(0, 12 - images.length)) {
        try { const data = await readAsDataUrl(fl); const res = await api('/upload', { method: 'POST', body: { image: data } }); images.push(res.file); drawGal(); } catch (e) { toast(errText(e), 'bad'); }
      }
      file.value = '';
    } });
    const fileBtn = h('button', { type: 'button', class: 'add-img', onclick: () => file.click() }, h('span', { text: '+' }), h('small', { text: 'Rasm qo‘shish' }));
    drawGal();
    const save = h('button', { class: 'btn btn-primary', type: 'submit', text: 'Saqlash' });
    const form = h('form', { class: 'editor', onsubmit: async (e) => {
      e.preventDefault(); save.disabled = true;
      const body = { brand: f.brand.value.trim(), model: f.model.value.trim(), year: f.year.value, slug: f.slug.value.trim(), sort: f.sort.value, cover: f.cover.value, published: f.published.checked, sample: f.sample.checked, images,
        ...Object.fromEntries(Object.entries(tri).map(([k, t]) => [k, t.value()])) };
      try { await api(`/portfolio${id ? '/' + id : ''}`, { method: 'POST', body }); toast('Saqlandi'); location.hash = 'port'; } catch (er) { toast(errText(er), 'bad'); save.disabled = false; }
    } },
    head(id ? 'Ishni tahrirlash' : 'Yangi ish', 'Uchala tilni to‘ldiring. To‘ldirilmagan til yorlig‘i to‘q sariq bilan belgilanadi.'),
    h('div', { class: 'split' },
      h('div', { class: 'stack' }, h('div', { class: 'card' }, tri.title, tri.industry, tri.problem, tri.solution, tri.result)),
      h('div', { class: 'stack' },
        h('div', { class: 'card' }, h('h2', { text: 'Rasmlar' }), gal, file, h('small', { class: 'muted', text: 'Muammo, jarayon va natija rasmlari. Mijoz ma’lumotlari ko‘rinmasin.' })),
        h('div', { class: 'card' }, h('div', { class: 'row2' }, field('Brend', f.brand), field('Model', f.model)), h('div', { class: 'row2' }, field('Yil', f.year), field('Tartib', f.sort, 'Kichik raqam oldinda')),
          field('Manzil (slug)', f.slug, 'Bo‘sh qolsa avtomatik yaratiladi'), field('Rasm bo‘lmasa muqova', f.cover),
          h('label', { class: 'cb' }, f.published, ' Saytda ko‘rsatish'), h('label', { class: 'cb' }, f.sample, ' Namuna (indekslanmaydi)')),
        h('div', { class: 'sticky-act' }, save,
          id ? h('button', { type: 'button', class: 'btn btn-danger', text: 'O‘chirish', onclick: async () => { if (!confirm('Bu ish o‘chirilsinmi?')) return; await api(`/portfolio/${id}`, { method: 'DELETE' }); toast('O‘chirildi'); location.hash = 'port'; } }) : null,
          id && r.published ? h('a', { class: 'btn btn-ghost', href: `/portfolio/${r.slug}/`, target: '_blank', rel: 'noopener', text: 'Saytda ko‘rish ↗' }) : null))));
    main.append(form);
  }

  /* ---------- Akademiya ---------- */
  async function viewAcad(id) {
    if (id) return editCourse(id === 'new' ? null : +id);
    main.append(head('Akademiya', 'Ishlab chiqarish xodimlari uchun kurslar, korxona kirish kodlari va tinglovchilar.', h('a', { class: 'btn btn-primary', href: '#acad/new', text: '+ Yangi kurs' })));
    const box = h('div', {}, loading()); main.append(box);
    let courses, codes, learners;
    try { [courses, codes, learners] = await Promise.all([api('/courses'), api('/codes'), api('/learners')]); } catch (e) { clear(box).append(h('p', { class: 'err', text: errText(e) })); return; }
    clear(box);
    box.append(h('div', { class: 'cards' }, courses.map((c) => h('a', { class: 'card c-card', href: `#acad/${c.id}` },
      h('div', { class: 'tags' }, h('span', { class: `tag lv-${c.level}`, text: LEVEL[c.level] || c.level }), h('span', { class: 'tag', text: c.equipment }), c.published ? null : h('span', { class: 'tag', text: 'Yashirin' })),
      h('b', { text: c.data.title?.uz || c.slug }), h('small', { class: 'muted', text: `${c.lessonCount} dars · ${c.hours} soat` })))));

    // Kirish kodlari
    const company = h('input', { type: 'text', maxlength: '100', placeholder: 'Korxona nomi', required: true });
    const seats = h('input', { type: 'number', min: '1', max: '5000', value: '20', 'aria-label': 'O‘rinlar' });
    const exp = h('input', { type: 'date', 'aria-label': 'Amal qilish muddati' });
    const codeForm = h('form', { class: 'inline-form', onsubmit: async (e) => {
      e.preventDefault();
      try { const r = await api('/codes', { method: 'POST', body: { company: company.value.trim(), seats: seats.value, expires: exp.value } }); toast(`Kod yaratildi: ${r.code}`); route(); } catch (er) { toast(errText(er), 'bad'); }
    } }, company, field('O‘rin', seats), field('Muddat', exp), h('button', { class: 'btn btn-primary', type: 'submit', text: 'Kod yaratish' }));
    box.append(h('section', { class: 'card' }, h('h2', { text: 'Korxona kirish kodlari' }),
      h('p', { class: 'muted', text: 'Har bir korxonaga alohida kod bering. Xodimlar kurs sahifasida ism va kodni kiritib o‘qishni boshlaydi.' }), codeForm,
      codes.length ? h('table', { class: 'tbl' }, h('thead', {}, h('tr', {}, ['Kod', 'Korxona', 'Ishlatilgan', 'Muddat', 'Natijalar', ''].map((c) => h('th', { text: c })))),
        h('tbody', {}, codes.map((c) => h('tr', {}, h('td', {}, h('b', { class: 'mono', text: c.code }), ' ', copyBtn(c.code)), h('td', { text: c.company }), h('td', { text: `${c.used} / ${c.seats}` }), h('td', { text: c.expires || 'Cheksiz' }), h('td', {}, c.manager_token ? h('span', {}, h('a', { href: `/academy/team/${c.manager_token}/`, target: '_blank', rel: 'noopener', text: 'Rahbar sahifasi ↗' }), ' ', copyBtn(`${location.origin}/academy/team/${c.manager_token}/`)) : '—'),
          h('td', {}, h('button', { type: 'button', class: 'btn-x', title: 'O‘chirish', text: '✕', onclick: async () => { if (!confirm(`${c.code} kodi o‘chirilsinmi? Yangi xodimlar bu kod bilan kira olmaydi.`)) return; await api(`/codes/${encodeURIComponent(c.code)}`, { method: 'DELETE' }); route(); } })))))) : empty('Kodlar yo‘q')));

    box.append(h('section', { class: 'card' }, h('h2', { text: `Tinglovchilar (${learners.length})` }),
      learners.length ? h('div', { class: 'tbl-scroll' }, h('table', { class: 'tbl' }, h('thead', {}, h('tr', {}, ['Ism', 'Korxona', 'Darslar', 'Eng yaxshi natija', 'Sertifikatlar', 'Qo‘shilgan'].map((c) => h('th', { text: c })))),
        h('tbody', {}, learners.map((l) => h('tr', {}, h('td', { text: l.name }), h('td', { text: l.company || l.code }), h('td', { text: l.lessons_done }), h('td', { text: l.best_score == null ? '—' : `${l.best_score}%` }),
          h('td', {}, (l.certs || '').split(',').filter(Boolean).map((x) => { const [slug, cid] = x.split(':'); return h('a', { class: 'tag ok', href: `/academy/cert/${cid}/`, target: '_blank', rel: 'noopener', text: slug }); })),
          h('td', { class: 'nowrap', text: fmtDate(l.created_at) })))))) : empty('Hali tinglovchi yo‘q')));
  }
  function copyBtn(text) {
    return h('button', { type: 'button', class: 'btn-x', title: 'Nusxalash', text: '⧉', onclick: async (e) => { e.stopPropagation(); try { await navigator.clipboard.writeText(text); toast('Nusxalandi'); } catch { toast(text); } } });
  }
  // Savol muharriri: yakuniy test va dars tekshiruvi uchun umumiy
  function qEditor(q = { q: {}, options: { uz: ['', '', ''], ru: ['', '', ''], en: ['', '', ''] }, answer: 0 }) {
    const qt = triField('Savol', q.q, { max: 300 });
    const n = Math.max(3, ...LANGS.map((l) => (q.options?.[l] || []).length));
    const opts = [];
    const radios = h('div', { class: 'opts' });
    const name = `ans-${Math.random().toString(36).slice(2)}`;
    for (let i = 0; i < n; i++) {
      const r = h('input', { type: 'radio', name, value: String(i), checked: i === q.answer, 'aria-label': `${i + 1}-variant to‘g‘ri` });
      const tf = triField(`${i + 1}-variant`, Object.fromEntries(LANGS.map((l) => [l, q.options?.[l]?.[i] || ''])), { max: 200 });
      opts.push(tf); radios.append(h('div', { class: 'opt' }, h('label', { class: 'cb ans', title: 'To‘g‘ri javob' }, r, ' ✓'), tf));
    }
    const el = h('div', { class: 'q-body' }, qt, h('small', { class: 'muted', text: 'To‘g‘ri variant yonidagi doirani belgilang.' }), radios);
    const value = () => {
      const ov = opts.map((o) => o.value());
      const keep = ov.map((o, i) => (LANGS.some((l) => (o[l] || '').trim()) ? i : -1)).filter((i) => i >= 0);
      const ans = +(radios.querySelector('input:checked')?.value || 0);
      return { q: qt.value(), options: Object.fromEntries(LANGS.map((l) => [l, keep.map((i) => ov[i][l])])), answer: Math.max(0, keep.indexOf(ans)) };
    };
    return { el, value };
  }
  async function editCourse(id) {
    main.append(h('a', { href: '#acad', class: 'back', text: '← Akademiya' }));
    let c = { slug: '', level: 'basic', equipment: '', hours: 2, data: {}, published: 1, sort: 0, lessons: [], quiz: [] };
    if (id) { try { c = await api(`/courses/${id}`); } catch (e) { return main.append(h('p', { class: 'err', text: errText(e) })); } }
    const inp = (v, a = {}) => h('input', { type: 'text', value: v ?? '', ...a });
    const f = { slug: inp(c.slug, { maxlength: '80', required: true, placeholder: 'abb-irc5-operator' }), equipment: inp(c.equipment, { maxlength: '60', placeholder: 'ABB IRC5' }), hours: inp(c.hours, { type: 'number', min: '1', max: '500' }), sort: inp(c.sort, { type: 'number' }),
      level: h('select', {}, Object.entries(LEVEL).map(([k, v]) => h('option', { value: k, text: v }))), published: h('input', { type: 'checkbox', checked: c.published }) };
    f.level.value = c.level;
    let all = [];
    try { all = await api('/courses'); } catch {}
    f.requires = h('select', {}, h('option', { value: '', text: '— yo‘q —' }), all.filter((x) => x.slug !== c.slug).map((x) => h('option', { value: x.slug, text: x.data.title?.uz || x.slug })));
    f.requires.value = c.data.requires || '';
    f.quiz_size = inp(c.data.quiz_size ?? 8, { type: 'number', min: '1', max: '60' });
    f.time_limit = inp(c.data.time_limit ?? 15, { type: 'number', min: '1', max: '180' });
    f.pass = inp(c.data.pass ?? 80, { type: 'number', min: '50', max: '100' });
    const tri = { title: triField('Kurs nomi', c.data.title, { max: 160 }), summary: triField('Qisqacha tavsif', c.data.summary, { area: true, max: 600 }), audience: triField('Kim uchun', c.data.audience, { max: 200 }) };

    const lessonsBox = h('div', { class: 'stack' });
    const lessons = [];
    const addLesson = (l = {}) => {
      const t = triField('Dars nomi', l.title, { max: 160 });
      const b = triField('Matn', l.body, { area: true, rows: 10, max: 20000, hint: 'Formatlash: “## Sarlavha”, “- ro‘yxat”, “1. qadam”, “> Xavfsizlik ogohlantirishi”, **qalin**.' });
      const ck = qEditor(l.check || undefined);
      const vp = videoPicker(l.video, l.videoView);
      const obj = { id: l.id, t, b, ck, vp };
      const card = h('details', { class: 'card lesson-ed', open: !l.id },
        h('summary', {}, h('span', { class: 'num' }), h('span', { class: 'ttl', text: l.title?.uz || 'Yangi dars' }),
          h('span', { class: 'ed-act' },
            h('button', { type: 'button', class: 'btn-x', title: 'Yuqoriga', text: '↑', onclick: (e) => { e.preventDefault(); const i = lessons.indexOf(obj); if (i > 0) { lessons.splice(i, 1); lessons.splice(i - 1, 0, obj); lessonsBox.insertBefore(card, card.previousElementSibling); renum(); } } }),
            h('button', { type: 'button', class: 'btn-x', title: 'O‘chirish', text: '✕', onclick: (e) => { e.preventDefault(); if (!confirm('Dars o‘chirilsinmi?')) return; lessons.splice(lessons.indexOf(obj), 1); card.remove(); renum(); } }))),
        t, h('div', { class: 'fld' }, h('span', { class: 'lbl', text: 'Video dars (ixtiyoriy)' }), vp.el), b, h('details', { class: 'ck-ed', open: !!l.check }, h('summary', { text: 'Tekshiruv savoli (darsni tugatish uchun)' }), h('small', { class: 'muted', text: 'Bo‘sh qoldirilsa, dars tekshiruvsiz tugatiladi.' }), ck.el));
      lessons.push(obj); lessonsBox.append(card); renum();
    };
    const renum = () => lessonsBox.querySelectorAll('.lesson-ed .num').forEach((n, i) => { n.textContent = `${i + 1}`; });
    (c.lessons || []).forEach(addLesson);

    const quizBox = h('div', { class: 'stack' });
    const quiz = [];
    const addQ = (q) => {
      const ed = qEditor(q);
      const obj = ed;
      const card = h('div', { class: 'card q-ed' }, h('div', { class: 'card-h' }, h('b', { class: 'qn' }), h('button', { type: 'button', class: 'btn-x', text: '✕', title: 'O‘chirish', onclick: () => { quiz.splice(quiz.indexOf(obj), 1); card.remove(); renumQ(); } })), ed.el);
      quiz.push(obj); quizBox.append(card); renumQ();
    };
    const renumQ = () => quizBox.querySelectorAll('.qn').forEach((n, i) => { n.textContent = `${i + 1}-savol`; });
    (c.quiz || []).forEach(addQ);

    const save = h('button', { class: 'btn btn-primary', type: 'submit', text: 'Saqlash' });
    const form = h('form', { class: 'editor', onsubmit: async (e) => {
      e.preventDefault(); save.disabled = true;
      const body = { slug: f.slug.value.trim(), level: f.level.value, equipment: f.equipment.value.trim(), hours: f.hours.value, sort: f.sort.value, published: f.published.checked,
        title: tri.title.value(), summary: tri.summary.value(), audience: tri.audience.value(),
        requires: f.requires.value, quiz_size: f.quiz_size.value, time_limit: f.time_limit.value, pass: f.pass.value,
        lessons: lessons.map((l) => ({ id: l.id, title: l.t.value(), body: l.b.value(), check: l.ck.value(), video: l.vp.value() })),
        quiz: quiz.map((q) => q.value()) };
      if (lessons.some((l) => l.vp.busy())) { toast('Video hali yuklanmoqda, tugashini kuting', 'bad'); save.disabled = false; return; }
      try { const r = await api(`/courses${id ? '/' + id : ''}`, { method: 'POST', body }); toast('Kurs saqlandi'); location.hash = `acad/${r.id}`; if (id) route(); } catch (er) { toast(errText(er), 'bad'); } finally { save.disabled = false; }
    } },
    head(id ? 'Kursni tahrirlash' : 'Yangi kurs', 'Darslar, tekshiruv savollari, test banki va sertifikat.'),
    h('div', { class: 'split' },
      h('div', { class: 'stack' },
        h('div', { class: 'card' }, tri.title, tri.summary, tri.audience),
        h('h2', { class: 'sec-t', text: 'Darslar' }), lessonsBox, h('button', { type: 'button', class: 'btn btn-ghost', text: '+ Dars qo‘shish', onclick: () => addLesson() }),
        h('h2', { class: 'sec-t', text: 'Yakuniy test: savollar banki' }), quizBox, h('button', { type: 'button', class: 'btn btn-ghost', text: '+ Savol qo‘shish', onclick: () => addQ() })),
      h('div', { class: 'stack' },
        h('div', { class: 'card' }, field('Manzil (slug)', f.slug, 'Faqat lotin harflari, raqam va “-”'), field('Uskuna', f.equipment), h('div', { class: 'row2' }, field('Daraja', f.level), field('Soat', f.hours)), field('Tartib', f.sort), h('label', { class: 'cb' }, f.published, ' Saytda ko‘rsatish')),
        h('div', { class: 'card' }, h('b', { text: 'Test va ketma-ketlik' }), field('Avval tugatilishi kerak bo‘lgan kurs', f.requires), h('div', { class: 'row2' }, field('Testdagi savollar', f.quiz_size, 'Bankdan tasodifiy tanlanadi'), field('Vaqt (daqiqa)', f.time_limit)), field('O‘tish bali, %', f.pass), h('small', { class: 'muted', text: 'Kuniga 3 urinish. Sertifikat 2 yil amal qiladi.' })),
        h('div', { class: 'sticky-act' }, save,
          id ? h('button', { type: 'button', class: 'btn btn-danger', text: 'O‘chirish', onclick: async () => { if (!confirm('Kurs, darslar va natijalar o‘chirilsinmi?')) return; await api(`/courses/${id}`, { method: 'DELETE' }); toast('O‘chirildi'); location.hash = 'acad'; } }) : null,
          id && c.published ? h('a', { class: 'btn btn-ghost', href: `/academy/${c.slug}/`, target: '_blank', rel: 'noopener', text: 'Saytda ko‘rish ↗' }) : null))));
    main.append(form);
  }


  /* ---------- Video: yuklash va tanlash ---------- */
  // Katta fayl 8 MB lik bo'laklarda yuboriladi; aloqa uzilsa shu bo'lak qayta yuboriladi
  async function uploadVideo(file, onProg) {
    const CH = 8 * 1024 * 1024;
    let name = ''; let off = 0;
    while (off < file.size) {
      const qs = new URLSearchParams({ offset: String(off), total: String(file.size), name, filename: file.name.slice(0, 150) });
      let r; let d;
      for (let tries = 0; ; tries++) {
        try {
          r = await fetch('/admin/api/video-upload?' + qs, { method: 'POST', headers: { 'X-CSRF': CSRF, 'Content-Type': 'application/octet-stream' }, body: file.slice(off, off + CH), credentials: 'same-origin' });
          d = await r.json().catch(() => ({}));
          if (r.status >= 500 && tries < 3) throw new Error('retry');
          break;
        } catch (e) { if (tries >= 3) throw new Error('offset'); await new Promise((ok) => setTimeout(ok, 1500 * (tries + 1))); }
      }
      if (r.status === 409 && d.size) { off = d.size; continue; }
      if (!r.ok) throw new Error(d.error || String(r.status));
      name = d.name; off = d.size;
      onProg(off / file.size);
    }
    return name;
  }
  const fmtSize = (n) => n > 1e9 ? `${(n / 1e9).toFixed(2)} GB` : `${Math.round(n / 1e6)} MB`;
  // Video manbasi: yuklangan fayl yoki YouTube/Vimeo havolasi. value() -> {file} | {url} | null
  function videoPicker(src, view) {
    let cur = src && (src.file || src.yt || src.vimeo) ? src : null;
    let busy = false;
    const box = h('div', { class: 'vp' });
    const prev = h('div', { class: 'vp-prev' });
    const info = h('small', { class: 'muted' });
    const bar = h('progress', { max: '100', value: '0', hidden: true });
    const link = h('input', { type: 'url', placeholder: 'https://youtu.be/… yoki https://vimeo.com/…', value: cur?.yt ? `https://youtu.be/${cur.yt}` : cur?.vimeo ? `https://vimeo.com/${cur.vimeo}` : '' });
    const fileIn = h('input', { type: 'file', accept: 'video/mp4,video/webm', hidden: true });
    const showPrev = (v) => {
      clear(prev);
      if (!v) return;
      if (v.type === 'file') prev.append(h('video', { src: v.src, controls: true, preload: 'metadata' }));
      else prev.append(h('iframe', { src: v.src, title: 'Video', loading: 'lazy', allow: 'fullscreen; picture-in-picture', allowfullscreen: true }));
    };
    const state = () => { info.textContent = cur?.file ? 'Serverga yuklangan video' : cur?.yt ? 'YouTube video' : cur?.vimeo ? 'Vimeo video' : 'Video yo‘q'; rm.hidden = !cur; };
    const rm = h('button', { type: 'button', class: 'btn btn-ghost btn-sm', text: 'Videoni olib tashlash', onclick: () => { cur = null; link.value = ''; clear(prev); state(); } });
    fileIn.addEventListener('change', async () => {
      const f = fileIn.files[0]; if (!f) return;
      if (!/\.(mp4|webm)$/i.test(f.name)) { toast(ERR.format, 'bad'); return; }
      busy = true; bar.hidden = false; bar.value = 0; up.disabled = true;
      info.textContent = `Yuklanmoqda: ${f.name} (${fmtSize(f.size)})`;
      try {
        const name = await uploadVideo(f, (p) => { bar.value = Math.round(p * 100); info.textContent = `Yuklanmoqda: ${Math.round(p * 100)}% · ${fmtSize(f.size)}`; });
        cur = { file: name }; link.value = '';
        showPrev({ type: 'file', src: URL.createObjectURL(f) });
        toast('Video yuklandi. Endi “Saqlash” ni bosing.');
      } catch (e) { toast(errText(e), 'bad'); }
      busy = false; bar.hidden = true; up.disabled = false; fileIn.value = ''; state();
    });
    const up = h('button', { type: 'button', class: 'btn btn-ghost btn-sm', text: 'Video fayl yuklash (MP4)', onclick: () => fileIn.click() });
    link.addEventListener('change', () => { if (link.value.trim()) { cur = { url: link.value.trim() }; clear(prev); info.textContent = 'Havola saqlangach tekshiriladi'; rm.hidden = false; } });
    box.append(prev, h('div', { class: 'vp-act' }, up, fileIn, rm), bar, h('div', { class: 'vp-or' }, h('span', { text: 'yoki havola:' }), link), info);
    showPrev(view); state();
    return { el: box, value: () => cur, busy: () => busy };
  }

  /* ---------- Video qo'llanmalar ---------- */
  async function viewVid(id) {
    if (id) return editVid(id === 'new' ? null : +id);
    main.append(head('Video qo‘llanmalar', 'Saytdagi “Video qo‘llanmalar” bo‘limi. Har bir video hammaga yoki faqat ro‘yxatdan o‘tganlarga ochiq bo‘ladi.', h('a', { class: 'btn btn-ghost', href: '/videos/', target: '_blank', rel: 'noopener', text: 'Saytda ko‘rish ↗' }), h('a', { class: 'btn btn-primary', href: '#vid/new', text: '+ Yangi video' })));
    const box = h('div', { class: 'cards' }, loading()); main.append(box);
    let rows;
    try { rows = await api('/videos'); } catch (e) { clear(box).append(h('p', { class: 'err', text: errText(e) })); return; }
    clear(box);
    if (!rows.length) box.append(empty('Hali video qo‘shilmagan. “+ Yangi video” ni bosing.'));
    for (const v of rows) {
      box.append(h('a', { class: 'card v-card', href: `#vid/${v.id}` },
        h('div', { class: 'v-thumb', text: v.src?.file ? 'MP4' : v.src?.yt ? 'YouTube' : 'Vimeo' }),
        h('div', { class: 'tags' }, h('span', { class: 'tag', text: v.access === 'public' ? 'Hammaga' : 'Ro‘yxatdan o‘tganlarga' }), v.published ? null : h('span', { class: 'tag', text: 'Yashirin' }), v.data.category?.uz ? h('span', { class: 'tag', text: v.data.category.uz }) : null),
        h('b', { text: v.data.title?.uz || '—' }), h('small', { class: 'muted', text: `${num(v.views)} marta ko‘rilgan` })));
    }
  }
  async function editVid(id) {
    main.append(h('a', { href: '#vid', class: 'back', text: '← Videolar' }));
    let v = { src: null, data: {}, access: 'users', published: 1, sort: 0, view: null };
    if (id) { const all = await api('/videos'); v = all.find((x) => x.id === id); if (!v) return main.append(empty('Topilmadi')); }
    const tri = { title: triField('Sarlavha', v.data.title, { max: 160 }), text: triField('Tavsif', v.data.text, { area: true, max: 2000 }), category: triField('Bo‘lim (masalan: KUKA, ABB, Xavfsizlik)', v.data.category, { max: 60 }) };
    const vp = videoPicker(v.src, v.view);
    const access = h('select', {}, h('option', { value: 'users', text: 'Faqat ro‘yxatdan o‘tganlarga' }), h('option', { value: 'public', text: 'Hammaga ochiq' }));
    access.value = v.access;
    const duration = h('input', { type: 'text', maxlength: '12', placeholder: '12:30', value: v.data.duration || '' });
    const sort = h('input', { type: 'number', value: String(v.sort || 0) });
    const published = h('input', { type: 'checkbox', checked: v.published });
    const save = h('button', { class: 'btn btn-primary', type: 'submit', text: 'Saqlash' });
    const form = h('form', { class: 'editor', onsubmit: async (e) => {
      e.preventDefault();
      if (vp.busy()) return toast('Video hali yuklanmoqda, tugashini kuting', 'bad');
      save.disabled = true;
      try {
        await api(`/videos${id ? '/' + id : ''}`, { method: 'POST', body: { title: tri.title.value(), text: tri.text.value(), category: tri.category.value(), duration: duration.value, access: access.value, published: published.checked, sort: sort.value, src: vp.value() } });
        toast('Saqlandi'); location.hash = 'vid';
      } catch (er) { toast(errText(er), 'bad'); } finally { save.disabled = false; }
    } },
    head(id ? 'Videoni tahrirlash' : 'Yangi video', 'MP4 faylni yuklang yoki YouTube/Vimeo havolasini qo‘ying. YouTube’da videoni “Unlisted” (havola orqali) qilib qo‘ysangiz, faqat saytda ko‘rinadi.'),
    h('div', { class: 'split' },
      h('div', { class: 'stack' }, h('div', { class: 'card' }, h('b', { text: 'Video' }), vp.el), h('div', { class: 'card' }, tri.title, tri.text, tri.category)),
      h('div', { class: 'stack' },
        h('div', { class: 'card' }, field('Kim ko‘ra oladi', access), field('Davomiyligi', duration, 'Ixtiyoriy, kartada ko‘rinadi'), field('Tartib', sort, 'Kichik raqam yuqorida'), h('label', { class: 'cb' }, published, ' Saytda ko‘rsatish')),
        h('div', { class: 'sticky-act' }, save,
          id ? h('button', { type: 'button', class: 'btn btn-danger', text: 'O‘chirish', onclick: async () => { if (!confirm('Video o‘chirilsinmi?')) return; await api(`/videos/${id}`, { method: 'DELETE' }); toast('O‘chirildi'); location.hash = 'vid'; } }) : null))));
    main.append(form);
  }

  /* ---------- Foydalanuvchilar ---------- */
  const UEV = { register: 'Ro‘yxatdan o‘tdi', login: 'Kirdi', reset_code: 'Parolni tiklash kodi so‘radi', reset_admin: 'Parolni tiklashni so‘radi (Telegram ulanmagan)', reset_done: 'Parolni tikladi', password: 'Parolni o‘zgartirdi', password_admin: 'Admin vaqtinchalik parol berdi', tg_link: 'Telegram ulandi', academy_join: 'Akademiyaga qo‘shildi', lesson: 'Darsni tugatdi', quiz_pass: 'Testdan o‘tdi', quiz_fail: 'Testdan o‘ta olmadi', video: 'Video ko‘rdi', request: 'Ariza yubordi', login_fail: '⚠ Noto‘g‘ri parol bilan kirishga urinish', verified: 'Akkauntni tasdiqladi', sessions_revoke: 'Boshqa qurilmalardan chiqdi', sessions_admin: 'Admin barcha qurilmalardan chiqardi', manual: 'Qo‘llanmani ochdi' };
  const online = (iso) => iso && Date.now() - Date.parse(iso) < 5 * 60e3;
  async function viewUsers(id) {
    if (id) return userDetail(+id);
    const q = h('input', { type: 'search', placeholder: 'Ism, telefon, email yoki korxona', 'aria-label': 'Qidirish' });
    if (id === 'activity') return usersActivity();
    main.append(head('Foydalanuvchilar', 'Saytda ro‘yxatdan o‘tgan barcha foydalanuvchilar, ularning arizalari, o‘qishi va faolligi.', h('a', { class: 'btn btn-ghost', href: '#users/activity', text: 'Faollik lentasi' }), h('a', { class: 'btn btn-ghost', href: '/admin/api/users.csv', text: 'CSV yuklab olish' })));
    const kp = h('section', { class: 'kpis' }); main.append(kp);
    main.append(h('form', { class: 'inline-form', onsubmit: (e) => { e.preventDefault(); load(); } }, q, h('button', { class: 'btn btn-ghost', type: 'submit', text: 'Qidirish' })));
    const box = h('div', { class: 'card tbl-card' }, loading()); main.append(box);
    async function load() {
      let d;
      try { d = await api('/users' + (q.value.trim() ? `?q=${encodeURIComponent(q.value.trim())}` : '')); } catch (e) { clear(box).append(h('p', { class: 'err', text: errText(e) })); return; }
      clear(kp).append(kpi('Jami foydalanuvchi', num(d.total.all)), kpi('Hozir saytda', num(d.total.online)), kpi('Tasdiqlangan', num(d.total.verified)), kpi('7 kunda yangi', num(d.total.week)), kpi('7 kunda faol', num(d.total.active)));
      clear(box);
      if (!d.rows.length) return box.append(empty(q.value ? 'Hech narsa topilmadi.' : 'Hali hech kim ro‘yxatdan o‘tmagan.'));
      box.append(h('div', { class: 'tbl-scroll' }, h('table', { class: 'tbl' },
        h('thead', {}, h('tr', {}, ['Ism', 'Login', 'Korxona', 'Ro‘yxatdan', 'Oxirgi faollik', 'Arizalar', 'Darslar', 'Sertifikat', 'Telegram', 'Holat'].map((c) => h('th', { text: c })))),
        h('tbody', {}, d.rows.map((u) => h('tr', { class: 'row-link', tabindex: '0', onclick: () => { location.hash = `users/${u.id}`; }, onkeydown: (e) => { if (e.key === 'Enter') location.hash = `users/${u.id}`; } },
          h('td', {}, online(u.last_seen) ? h('span', { class: 'dot on', title: 'Hozir saytda' }) : null, h('b', { text: ' ' + u.name })), h('td', { class: 'mono' }, u.login, u.verified ? h('span', { class: 'tag ok', title: 'SMS yoki email bilan tasdiqlangan', text: '✓' }) : null), h('td', { text: u.company || '—' }), h('td', { class: 'nowrap', text: fmtDate(u.created_at) }),
          h('td', { class: 'nowrap', text: fmtDate(u.last_seen || u.last_active || u.last_login) }), h('td', { text: num(u.requests) }), h('td', { text: num(u.lessons) }), h('td', { text: num(u.certs) }),
          h('td', { text: u.tg ? 'Ulangan' : '—' }), h('td', {}, u.blocked ? h('span', { class: 'tag warn', text: 'Bloklangan' }) : null, u.fails >= 3 ? h('span', { class: 'tag warn', title: 'Oxirgi sutkada noto‘g‘ri parol urinishlari', text: `⚠ ${u.fails} urinish` }) : null)))))));
    }
    load();
  }
  async function userDetail(id) {
    main.append(h('a', { href: '#users', class: 'back', text: '← Foydalanuvchilar' }));
    let u;
    try { u = await api(`/users/${id}`); } catch (e) { return main.append(h('p', { class: 'err', text: errText(e) })); }
    const pwBox = h('div', { class: 'pw-box', hidden: true });
    const act = async (body, msg) => { try { await api(`/users/${id}`, { method: 'POST', body }); toast(msg); route(); } catch (e) { toast(errText(e), 'bad'); } };
    main.append(head(u.name, `${u.login}${u.company ? ' · ' + u.company : ''}`,
      h('button', { type: 'button', class: 'btn btn-ghost', text: 'Vaqtinchalik parol berish', onclick: async () => {
        if (!confirm('Yangi vaqtinchalik parol yaratilsinmi? Eski parol ishlamay qoladi.')) return;
        try { const r = await api(`/users/${id}/password`, { method: 'POST', body: {} }); clear(pwBox).append(h('b', { text: 'Yangi parol: ' }), h('code', { text: r.password }), ' ', h('span', { class: 'muted', text: 'Foydalanuvchiga ayting. U kabinetda o‘z parolini qo‘yadi. Bu parol boshqa ko‘rsatilmaydi.' })); pwBox.hidden = false; } catch (e) { toast(errText(e), 'bad'); }
      } }),
      h('button', { type: 'button', class: 'btn btn-ghost', text: 'Barcha qurilmalardan chiqarish', onclick: () => act({ logout: true }, 'Barcha qurilmalardan chiqarildi') }),
      h('button', { type: 'button', class: 'btn btn-ghost', text: u.verified ? 'Tasdiqni olib tashlash' : 'Tasdiqlangan deb belgilash', onclick: () => act({ verified: !u.verified }, 'Saqlandi') }),
      h('button', { type: 'button', class: 'btn btn-ghost', text: u.blocked ? 'Blokdan chiqarish' : 'Bloklash', onclick: () => act({ blocked: !u.blocked }, u.blocked ? 'Blokdan chiqarildi' : 'Bloklandi') }),
      h('button', { type: 'button', class: 'btn btn-danger', text: 'O‘chirish', onclick: async () => { if (!confirm('Foydalanuvchi o‘chirilsinmi? Arizalari va kurs natijalari saqlanib qoladi.')) return; await api(`/users/${id}`, { method: 'DELETE' }); toast('O‘chirildi'); location.hash = 'users'; } })));
    main.append(pwBox);
    main.append(h('section', { class: 'kpis kpis-sm' }, kpi('Ro‘yxatdan o‘tgan', fmtDate(u.created_at)), kpi('Oxirgi kirish', fmtDate(u.last_login)), kpi('Kirishlar soni', num(u.login_count)), kpi('Telegram', u.tg ? 'Ulangan' : 'Ulanmagan'), kpi('Tasdiq', u.verified ? 'Tasdiqlangan' : 'Yo‘q'), kpi('Holat', u.blocked ? 'Bloklangan' : online(u.last_seen) ? 'Hozir saytda' : 'Faol')));
    main.append(h('div', { class: 'split' },
      h('div', { class: 'stack' },
        h('div', { class: 'card' }, h('h2', { text: `Arizalar (${u.requestsList.length})` }),
          u.requestsList.length ? h('table', { class: 'tbl' }, h('tbody', {}, u.requestsList.map((r) => h('tr', { class: 'row-link', onclick: () => { location.hash = `req/${r.id}`; } }, h('td', { class: 'mono', text: r.code }), h('td', { class: 'nowrap', text: fmtDate(r.created_at) }), h('td', { text: r.equipment || r.service || '—' }), h('td', {}, pill(r.status)))))) : empty('Ariza yo‘q')),
        h('div', { class: 'card' }, h('h2', { text: 'Kurslar' }), u.learner ? h('p', { class: 'muted', text: `Kirish kodi: ${u.learner.code} · ${u.learner.company || ''}` }) : null,
          u.courses.length ? h('table', { class: 'tbl' }, h('tbody', {}, u.courses.map((c) => h('tr', {}, h('td', { text: c.title }), h('td', { text: `${c.done}/${c.total} dars` }), h('td', {}, c.passed ? h('a', { class: 'tag ok', href: `/academy/cert/${c.cert_id}/`, target: '_blank', rel: 'noopener', text: 'Sertifikat' }) : h('span', { class: 'muted', text: `${c.pct}%` })))))) : empty('Kursga yozilmagan'))),
      h('div', { class: 'stack' }, h('div', { class: 'card' }, h('h2', { text: `Kirilgan qurilmalar (${u.sessionsList.length})` }),
        u.sessionsList.length ? h('ul', { class: 'ev-list' }, u.sessionsList.map((x) => h('li', {}, h('span', { class: 'nowrap muted', text: fmtDate(x.last_seen || x.created_at) }), h('span', { text: x.ua || 'Brauzer' }), h('code', { text: x.ip || '' })))) : empty('Hech qayerda kirilmagan')),
      h('div', { class: 'card' }, h('h2', { text: 'Faollik' }),
        u.events.length ? h('ul', { class: 'ev-list' }, u.events.map((e) => h('li', {}, h('span', { class: 'nowrap muted', text: fmtDate(e.at) }), h('span', { text: UEV[e.kind] || e.kind }), e.ref ? h('code', { text: e.ref }) : null))) : empty('Hali faollik yo‘q')))));
  }
  async function usersActivity() {
    main.append(h('a', { href: '#users', class: 'back', text: '← Foydalanuvchilar' }), head('Faollik lentasi', 'Barcha foydalanuvchilarning oxirgi harakatlari: kirish, ro‘yxatdan o‘tish, qo‘llanma va video ochish, noto‘g‘ri parol urinishlari.'));
    const box = h('div', { class: 'card' }, loading()); main.append(box);
    let rows; try { rows = await api('/users-activity'); } catch (e) { return clear(box).append(h('p', { class: 'err', text: errText(e) })); }
    clear(box).append(rows.length ? h('ul', { class: 'ev-list' }, rows.map((e) => h('li', { class: e.kind === 'login_fail' ? 'ev-warn' : '' }, h('span', { class: 'nowrap muted', text: fmtDate(e.at) }), h('a', { href: `#users/${e.uid}`, text: e.name }), h('span', { text: UEV[e.kind] || e.kind }), e.ref ? h('code', { text: e.ref }) : null))) : empty('Hali faollik yo‘q'));
  }

  /* ---------- Qo'llanmalar ---------- */
  const fsize = (b) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);
  async function viewMan(id) {
    if (id) return editMan(id === 'new' ? null : +id);
    main.append(head('Qo‘llanmalar', 'PDF, Word yoki Excel qo‘llanmalar. Foydalanuvchilar kabinetdagi “Qo‘llanmalar” bo‘limida va /manuals/ sahifasida ochadi.', h('a', { class: 'btn btn-ghost', href: '/manuals/', target: '_blank', rel: 'noopener', text: 'Saytda ko‘rish ↗' }), h('a', { class: 'btn btn-primary', href: '#man/new', text: '+ Yangi qo‘llanma' })));
    const box = h('div', { class: 'card tbl-card' }, loading()); main.append(box);
    let rows; try { rows = await api('/manuals'); } catch (e) { return clear(box).append(h('p', { class: 'err', text: errText(e) })); }
    clear(box);
    if (!rows.length) return box.append(empty('Hali qo‘llanma yo‘q. “+ Yangi qo‘llanma” ni bosing va faylni yuklang.'));
    box.append(h('div', { class: 'tbl-scroll' }, h('table', { class: 'tbl' }, h('thead', {}, h('tr', {}, ['Nomi', 'Fayl', 'Kimga', 'Ochilgan', 'Qo‘shilgan', ''].map((c) => h('th', { text: c })))),
      h('tbody', {}, rows.map((m) => h('tr', { class: 'row-link', tabindex: '0', onclick: () => { location.hash = `man/${m.id}`; } },
        h('td', {}, h('b', { text: m.data.title?.uz || m.data.title?.ru || '—' }), m.data.category?.uz ? h('small', { class: 'muted block', text: m.data.category.uz }) : null),
        h('td', { class: 'mono', text: `${(m.file || '').split('.').pop().toUpperCase()} · ${fsize(m.size)}` }), h('td', { text: m.access === 'public' ? 'Hammaga' : 'Ro‘yxatdan o‘tganlarga' }),
        h('td', { text: num(m.downloads) }), h('td', { class: 'nowrap', text: fmtDate(m.created_at) }), h('td', {}, m.published ? null : h('span', { class: 'tag', text: 'Yashirin' }))))))));
  }
  async function editMan(id) {
    main.append(h('a', { href: '#man', class: 'back', text: '← Qo‘llanmalar' }));
    let m = { data: {}, access: 'users', published: 1, sort: 0, file: null };
    if (id) { const all = await api('/manuals'); m = all.find((x) => x.id === id); if (!m) return main.append(empty('Topilmadi')); }
    const tri = { title: triField('Nomi', m.data.title, { max: 160 }), text: triField('Qisqa tavsif', m.data.text, { area: true, max: 1000 }), category: triField('Bo‘lim (masalan: Siemens, KUKA, Xavfsizlik)', m.data.category, { max: 60 }) };
    let file = null;
    const fin = h('input', { type: 'file', accept: '.pdf,.docx,.xlsx,.pptx,.zip,application/pdf' });
    const fst = h('p', { class: 'muted', text: m.file ? `Joriy fayl: ${m.original || m.file} · ${fsize(m.size)}` : 'Fayl hali yuklanmagan' });
    const bar = h('progress', { max: '100', value: '0', hidden: true });
    let busy = false;
    fin.addEventListener('change', () => {
      const f = fin.files[0]; if (!f) return;
      if (f.size > 50 * 1024 * 1024) return toast('Fayl 50 MB dan katta', 'bad');
      busy = true; bar.hidden = false; bar.value = 0; fst.textContent = `Yuklanmoqda: ${f.name}`;
      const x = new XMLHttpRequest();
      x.open('POST', '/admin/api/manual-upload?name=' + encodeURIComponent(f.name));
      x.setRequestHeader('X-CSRF', CSRF); x.setRequestHeader('Content-Type', 'application/octet-stream');
      x.upload.onprogress = (e) => { if (e.lengthComputable) bar.value = Math.round((e.loaded / e.total) * 100); };
      x.onload = () => { busy = false; let d = {}; try { d = JSON.parse(x.responseText); } catch {}
        if (x.status !== 200) { fst.textContent = errText(new Error(d.error || String(x.status))); bar.hidden = true; return; }
        file = d.file; fst.textContent = `Yuklandi: ${f.name} · ${fsize(d.size)}`; bar.value = 100;
        if (!tri.title.value().uz) { const inp = tri.title.querySelector('input'); if (inp && !inp.value) inp.value = f.name.replace(/\.[a-z0-9]+$/i, ''); } };
      x.onerror = () => { busy = false; fst.textContent = 'Yuklash uzildi, qayta urinib ko‘ring'; };
      x.send(f);
    });
    const access = h('select', {}, h('option', { value: 'users', text: 'Faqat ro‘yxatdan o‘tganlarga' }), h('option', { value: 'public', text: 'Hammaga ochiq' }));
    access.value = m.access;
    const sort = h('input', { type: 'number', value: String(m.sort || 0) });
    const published = h('input', { type: 'checkbox', checked: Boolean(m.published) });
    const notify = h('input', { type: 'checkbox', checked: !id });
    const save = h('button', { class: 'btn btn-primary', type: 'submit', text: 'Saqlash' });
    main.append(h('form', { class: 'editor', onsubmit: async (e) => {
      e.preventDefault();
      if (busy) return toast('Fayl hali yuklanmoqda', 'bad');
      save.disabled = true;
      try {
        await api(`/manuals${id ? '/' + id : ''}`, { method: 'POST', body: { title: tri.title.value(), text: tri.text.value(), category: tri.category.value(), access: access.value, published: published.checked, sort: sort.value, file: file || undefined, notify: notify.checked } });
        toast('Saqlandi'); location.hash = 'man';
      } catch (er) { toast(errText(er), 'bad'); } finally { save.disabled = false; }
    } },
    head(id ? 'Qo‘llanmani tahrirlash' : 'Yangi qo‘llanma', 'Faylni tanlang (PDF tavsiya qilinadi, 50 MB gacha), nomini uch tilda yozing va saqlang.'),
    h('div', { class: 'split' },
      h('div', { class: 'stack' }, h('div', { class: 'card' }, h('b', { text: 'Fayl' }), fin, bar, fst, id && m.file ? h('a', { class: 'btn btn-ghost sm', href: `/admin/api/manuals/${id}/file`, target: '_blank', rel: 'noopener', text: 'Faylni ochish ↗' }) : null), h('div', { class: 'card' }, tri.title, tri.text, tri.category)),
      h('div', { class: 'stack' },
        h('div', { class: 'card' }, field('Kim ochishi mumkin', access, 'Mijozlarga mo‘ljallangan qo‘llanmalarni “faqat ro‘yxatdan o‘tganlarga” qoldiring'), field('Tartib', sort, 'Kichik raqam yuqorida'), h('label', { class: 'cb' }, published, ' Saytda ko‘rsatish'), h('label', { class: 'cb' }, notify, ' Telegram ulagan foydalanuvchilarga xabar yuborish')),
        h('div', { class: 'sticky-act' }, save,
          id ? h('button', { type: 'button', class: 'btn btn-danger', text: 'O‘chirish', onclick: async () => { if (!confirm('Qo‘llanma va fayl o‘chirilsinmi?')) return; await api(`/manuals/${id}`, { method: 'DELETE' }); toast('O‘chirildi'); location.hash = 'man'; } }) : null)))));
  }

  /* ---------- Xavfsizlik (Sozlamalar ichida) ---------- */
  const RES = { ok: 'Kirdi', bad_password: 'Noto‘g‘ri parol', bad_otp: 'Noto‘g‘ri kod', rate: 'Bloklandi (ko‘p urinish)' };
  async function securityCard() {
    let d; try { d = await api('/security'); } catch (e) { return h('div', { class: 'card' }, h('p', { class: 'err', text: errText(e) })); }
    const box = h('div', {});
    const code = h('input', { type: 'text', inputmode: 'numeric', maxlength: '6', placeholder: '123456', autocomplete: 'one-time-code' });
    if (d.totp) {
      const pw = h('input', { type: 'password', autocomplete: 'current-password', placeholder: 'Admin paroli' });
      box.append(h('p', {}, h('span', { class: 'dot on' }), h('b', { text: ' Ikki bosqichli kirish yoqilgan.' })), h('p', { class: 'muted', text: 'Admin panelga kirishda parol va telefon ilovasidagi kod so‘raladi. Telefon yo‘qolsa: hostingdagi ADMIN_PASSWORD ni yangi parolga almashtiring, ikki bosqichli kirish o‘chadi.' }),
        h('details', {}, h('summary', { text: 'O‘chirish' }), h('div', { class: 'stack' }, field('Parol', pw), field('Ilovadagi kod', code),
          h('button', { type: 'button', class: 'btn btn-danger', text: 'Ikki bosqichli kirishni o‘chirish', onclick: async () => { try { await api('/2fa/disable', { method: 'POST', body: { password: pw.value, code: code.value } }); toast('O‘chirildi'); route(); } catch (e) { toast(errText(e), 'bad'); } } }))));
    } else {
      const area = h('div', { class: 'stack' });
      box.append(h('p', {}, h('span', { class: 'dot off' }), h('b', { text: ' Ikki bosqichli kirish o‘chiq.' })), h('p', { class: 'muted', text: 'Yoqing: parol o‘g‘irlansa ham, telefoningizdagi kodsiz admin panelga hech kim kira olmaydi.' }), area,
        h('button', { type: 'button', class: 'btn btn-primary', text: 'Yoqish', onclick: async (ev) => {
          ev.target.remove();
          try {
            const r = await api('/2fa/start', { method: 'POST' });
            area.append(h('p', { text: '1. Telefoningizga Google Authenticator yoki Microsoft Authenticator ilovasini o‘rnating.' }), h('p', { text: '2. Ilovada “+” ni bosib, shu QR kodni skanerlang:' }),
              h('img', { src: `/admin/api/2fa/qr.svg?t=${Date.now()}`, alt: 'QR kod', width: '200', height: '200', class: 'qr-2fa' }),
              h('p', { class: 'muted' }, 'Yoki kalitni qo‘lda kiriting: ', h('code', { text: r.secret })),
              h('p', { text: '3. Ilovadagi 6 xonali kodni yozing:' }), code,
              h('button', { type: 'button', class: 'btn btn-primary', text: 'Tasdiqlash va yoqish', onclick: async () => { try { await api('/2fa/enable', { method: 'POST', body: { code: code.value } }); toast('Ikki bosqichli kirish yoqildi'); route(); } catch (e) { toast(errText(e), 'bad'); } } }));
          } catch (e) { toast(errText(e), 'bad'); }
        } }));
    }
    const v = d.verify || {};
    const sent = (ch) => { const r = (v.sent24 || []).find((x) => x.channel === ch); return r ? `24 soatda ${r.ok || 0} ta yuborildi${r.failed ? `, ${r.failed} ta xato` : ''}` : '24 soatda yuborilmagan'; };
    return h('div', { class: 'card' }, h('h2', { text: 'Xavfsizlik' }), box,
      h('h3', { text: 'Ro‘yxatdan o‘tishda tasdiqlash' }),
      h('ul', { class: 'conn' },
        h('li', {}, h('span', { class: `dot ${v.sms ? 'on' : 'off'}` }), h('div', {}, h('b', { text: 'SMS (Eskiz.uz)' }), h('small', { class: 'muted block', text: v.sms ? sent('sms') : 'O‘chiq. Hostingda ESKIZ_EMAIL va ESKIZ_PASSWORD ni kiriting.' }))),
        h('li', {}, h('span', { class: `dot ${v.email ? 'on' : 'off'}` }), h('div', {}, h('b', { text: 'Email (Brevo)' }), h('small', { class: 'muted block', text: v.email ? sent('email') : 'O‘chiq. Hostingda BREVO_API_KEY va MAIL_FROM ni kiriting.' })))),
      (v.lastErrors || []).length ? h('p', { class: 'err', text: `Oxirgi xato: ${v.lastErrors[0].error}` }) : null,
      h('p', { class: 'muted', text: `Foydalanuvchilarning noto‘g‘ri parol urinishlari (24 soat): ${d.fails24}` }),
      h('h3', { text: 'Admin panelga kirishlar' }),
      h('ul', { class: 'ev-list' }, d.log.slice(0, 15).map((x) => h('li', { class: x.ok ? '' : 'ev-warn' }, h('span', { class: 'nowrap muted', text: fmtDate(x.at) }), h('span', { text: RES[x.result] || x.result }), h('code', { text: `${x.ip || ''} · ${x.ua || ''}` })))));
  }

  /* ---------- Matnlar ---------- */
  let textLang = 'uz';
  const SECTION = { meta: 'SEO (Google)', meta2: 'SEO: ichki sahifalar', nav: 'Menyu', nav2: 'Menyu', hero: 'Bosh ekran', term: 'Terminal', stats: 'Raqamlar', services: 'Xizmatlar', extra: 'Qo‘shimcha xizmatlar', brandsBlock: 'Brendlar', process: 'Ish jarayoni', industries: 'Sohalar', why: 'Nega biz', faq: 'Savol-javob', contact: 'Aloqa formasi', ai: 'AI tashxis', track: 'Kuzatuv', portfolio: 'Portfel', academy: 'Akademiya', plans: 'Narxlar', footer: 'Pastki qism', footer2: 'Pastki qism', notFound: '404 sahifa', a11y: 'Maxsus imkoniyatlar' };
  async function viewText() {
    const seg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Til' }, LANGS.map((l) => h('button', { type: 'button', class: l === textLang ? 'on' : '', text: LANG_NAME[l], onclick: () => { textLang = l; route(); } })));
    main.append(head('Matnlar', 'Saytdagi istalgan matnni tahrirlang. O‘zgarish darhol saytda ko‘rinadi. “Asl holiga” tugmasi o‘zgarishni bekor qiladi.', seg));
    const q = h('input', { type: 'search', placeholder: 'Matn ichidan qidirish: masalan “24/7” yoki “narx”', 'aria-label': 'Qidirish' });
    const onlyCh = h('input', { type: 'checkbox' });
    const box = h('div', {}, loading());
    main.append(h('div', { class: 'filters' }, q, h('label', { class: 'cb' }, onlyCh, ' Faqat o‘zgartirilganlar')), box);
    let data;
    try { data = await api(`/texts?lang=${textLang}`); } catch (e) { clear(box).append(h('p', { class: 'err', text: errText(e) })); return; }
    const groups = new Map();
    for (const [k, v] of Object.entries(data.base)) {
      if (typeof v !== 'string') continue;
      const g = k.split('.')[0];
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g).push([k, v]);
    }
    const rows = [];
    clear(box);
    for (const [g, items] of groups) {
      const sec = h('details', { class: 'card tx-group' }, h('summary', {}, h('b', { text: SECTION[g] || g }), h('small', { class: 'muted', text: `${items.length} ta matn` })));
      for (const [k, base] of items) {
        const cur = data.overrides[k] ?? base;
        const long = base.length > 70 || cur.length > 70;
        const ta = h(long ? 'textarea' : 'input', { value: cur, rows: long ? String(Math.min(8, Math.ceil(cur.length / 80) + 1)) : null, type: long ? null : 'text', lang: textLang, 'aria-label': k, maxlength: '5000' });
        const st = h('small', { class: 'tx-st' });
        const reset = h('button', { type: 'button', class: 'btn-x', title: 'Asl holiga qaytarish', text: '↺', hidden: !(k in data.overrides) });
        const row = h('div', { class: `tx-row ${k in data.overrides ? 'changed' : ''}` }, h('div', { class: 'tx-k' }, h('code', { text: k.split('.').slice(1).join(' › ') || k }), st, reset), ta);
        const saveOne = async (value) => {
          try {
            await api('/texts', { method: 'POST', body: { lang: textLang, key: k, value } });
            const changed = value !== null && value !== base;
            if (changed) data.overrides[k] = value; else delete data.overrides[k];
            row.classList.toggle('changed', changed); reset.hidden = !changed; st.textContent = 'Saqlandi ✓'; setTimeout(() => { st.textContent = ''; }, 1800);
          } catch (e) { st.textContent = errText(e); }
        };
        ta.addEventListener('change', () => saveOne(ta.value));
        reset.addEventListener('click', () => { ta.value = base; saveOne(null); });
        rows.push({ row, sec, k, text: () => `${k} ${ta.value} ${base}`.toLowerCase() });
        sec.append(row);
      }
      box.append(sec);
    }
    const filter = () => {
      const s2 = q.value.trim().toLowerCase();
      const secs = new Map();
      for (const r of rows) {
        const show = (!s2 || r.text().includes(s2)) && (!onlyCh.checked || r.row.classList.contains('changed'));
        r.row.hidden = !show;
        secs.set(r.sec, (secs.get(r.sec) || 0) + (show ? 1 : 0));
      }
      for (const [sec, n] of secs) { sec.hidden = !n; if (s2 || onlyCh.checked) sec.open = n > 0; }
    };
    q.addEventListener('input', filter); onlyCh.addEventListener('change', filter);
  }

  /* ---------- Uskunalar: mijozlar, QR pasport, profilaktika ---------- */
  const EV = { repair: 'Ta’mirlash', maintenance: 'Profilaktika', request: 'Ariza', note: 'Izoh', install: 'Ro‘yxatga olindi' };
  const today = () => new Date().toISOString().slice(0, 10);
  let eqTab = 'eq';
  async function viewEq(arg) {
    if (arg && /^\d+$/.test(arg)) return eqOne(+arg);
    const seg = h('div', { class: 'seg', role: 'group' }, [['eq', 'Uskunalar'], ['mt', 'Profilaktika rejasi'], ['cust', 'Mijozlar']].map(([k, l]) => h('button', { type: 'button', class: k === eqTab ? 'on' : '', text: l, onclick: () => { eqTab = k; route(); } })));
    main.append(head('Uskunalar', 'Har bir uskunaga QR yorliq: mijoz skanerlaydi, pasport va ariza formasi ochiladi. Profilaktika vaqti kelganda Telegram eslatadi.', seg));
    const box = h('div', {}, loading()); main.append(box);
    try {
      if (eqTab === 'cust') return await custList(box);
      if (eqTab === 'mt') return await mtList(box);
      await eqList(box);
    } catch (e) { clear(box).append(h('p', { class: 'err', text: errText(e) })); }
  }
  async function eqList(box) {
    const [rows, custs] = await Promise.all([api('/equipment'), api('/customers')]);
    clear(box);
    const picked = new Set();
    const qrBtn = h('a', { class: 'btn btn-ghost', href: '#', target: '_blank', rel: 'noopener', text: 'QR yorliqlarni chop etish', onclick: (e) => { const ids = picked.size ? [...picked] : rows.map((r) => r.id); if (!ids.length) { e.preventDefault(); return; } e.currentTarget.href = `/admin/qr?ids=${ids.join(',')}`; } });
    box.append(h('div', { class: 'filters' }, h('a', { class: 'btn btn-primary', href: '#', text: '+ Yangi uskuna', onclick: (e) => { e.preventDefault(); clear(box).append(eqForm(null, custs)); } }), qrBtn, h('small', { class: 'muted', text: 'Belgilanmasa hammasi chop etiladi.' })));
    if (!rows.length) return box.append(empty('Hali uskuna qo‘shilmagan. Avval “Mijozlar”da korxona qo‘shing, keyin uskuna.'));
    box.append(h('table', { class: 'tbl' },
      h('thead', {}, h('tr', {}, ['', 'Kod', 'Uskuna', 'Korxona', 'Joyi', 'Keyingi profilaktika', 'Arizalar'].map((c) => h('th', { text: c })))),
      h('tbody', {}, rows.map((r) => h('tr', { class: 'row-link', tabindex: '0', onclick: (e) => { if (e.target.type !== 'checkbox') location.hash = `eq/${r.id}`; } },
        h('td', {}, h('input', { type: 'checkbox', 'aria-label': 'Tanlash', onchange: (e) => { e.target.checked ? picked.add(r.id) : picked.delete(r.id); } })),
        h('td', { class: 'mono', text: r.code }),
        h('td', {}, h('b', { text: [r.brand, r.model].filter(Boolean).join(' ') }), r.serial ? h('small', { class: 'muted block', text: `S/N ${r.serial}` }) : null),
        h('td', { text: r.company || '—' }), h('td', { text: r.location || '—' }),
        h('td', { class: r.next_due && r.next_due < today() ? 'bad nowrap' : 'nowrap', text: r.next_due || '—' }),
        h('td', { text: String(r.req_count) }))))));
  }
  function eqForm(e, custs) {
    e = e || {};
    const f = {}; const inp = (k, a = {}) => (f[k] = h('input', { type: 'text', value: e[k] ?? '', ...a }));
    f.customer_id = h('select', {}, h('option', { value: '', text: '— Korxona tanlanmagan —' }), custs.map((c) => h('option', { value: String(c.id), text: c.company })));
    f.customer_id.value = e.customer_id ? String(e.customer_id) : '';
    const save = h('button', { class: 'btn btn-primary', type: 'submit', text: 'Saqlash' });
    return h('form', { class: 'card', onsubmit: async (ev) => {
      ev.preventDefault(); save.disabled = true;
      try { const r = await api(`/equipment${e.id ? '/' + e.id : ''}`, { method: 'POST', body: Object.fromEntries(Object.entries(f).map(([k, i]) => [k, i.value.trim()])) }); toast('Saqlandi'); location.hash = `eq/${r.id}`; route(); } catch (er) { toast(errText(er), 'bad'); save.disabled = false; }
    } }, h('h2', { text: e.id ? 'Uskunani tahrirlash' : 'Yangi uskuna' }),
      h('div', { class: 'grid-f' }, field('Korxona', f.customer_id), field('Brend', inp('brand', { maxlength: '40', placeholder: 'KUKA, ABB, Haitian…' })), field('Model', inp('model', { maxlength: '80', placeholder: 'KR 210 R2700' })), field('Seriya raqami', inp('serial', { maxlength: '60' })),
        field('Turi', inp('kind', { maxlength: '60', placeholder: 'Payvandlash roboti' })), field('Joyi', inp('location', { maxlength: '120', placeholder: 'Sex 2, 3-liniya' })), field('Yili', inp('year', { type: 'number', min: '1980', max: '2100' })), field('Ichki izoh', inp('notes', { maxlength: '1000' }))),
      save);
  }
  async function eqOne(id) {
    main.append(h('a', { href: '#eq', class: 'back', text: '← Uskunalar' }));
    const box = h('div', {}, loading()); main.append(box);
    let e, custs;
    try { [e, custs] = await Promise.all([api(`/equipment/${id}`), api('/customers')]); } catch (er) { clear(box).append(h('p', { class: 'err', text: errText(er) })); return; }
    clear(box);
    const pub = `${ME.domain}/e/${e.code}/`;
    box.append(head(`${[e.brand, e.model].filter(Boolean).join(' ')} · ${e.code}`, [e.company, e.location].filter(Boolean).join(' · '),
      h('a', { class: 'btn btn-primary', href: `/admin/qr?ids=${e.id}`, target: '_blank', rel: 'noopener', text: 'QR yorliq' }),
      h('a', { class: 'btn btn-ghost', href: `/e/${e.code}/`, target: '_blank', rel: 'noopener', text: 'Pasport sahifasi ↗' })));
    // Profilaktika
    const mtTitle = h('input', { type: 'text', maxlength: '160', placeholder: 'Reduktor moyini almashtirish', required: true });
    const mtInt = h('input', { type: 'number', min: '1', max: '3650', value: '180' });
    const mtNext = h('input', { type: 'date' });
    const mtNotify = h('input', { type: 'checkbox', checked: true });
    const mt = h('div', { class: 'card' }, h('h2', { text: 'Profilaktika rejasi' }),
      e.maintenance.length ? h('ul', { class: 'recent' }, e.maintenance.map((m) => h('li', {},
        h('span', { class: `dot ${m.next_due < today() ? 'p-critical' : 'p-normal'}` }), h('b', { text: m.title }), h('span', { class: 'ell muted', text: `har ${m.interval_days} kunda · keyingisi ${m.next_due}${m.last_done ? ` · oxirgi ${m.last_done}` : ''}` }),
        h('button', { type: 'button', class: 'btn btn-ghost sm', text: '✓ Bajarildi', onclick: async () => { await api(`/maintenance/${m.id}/done`, { method: 'POST', body: {} }); toast('Belgilandi, keyingi sana hisoblandi'); route(); } }),
        h('button', { type: 'button', class: 'btn-x', title: 'O‘chirish', text: '✕', onclick: async () => { if (!confirm('Reja o‘chirilsinmi?')) return; await api(`/maintenance/${m.id}`, { method: 'DELETE' }); route(); } })))) : empty('Reja yo‘q'),
      h('form', { class: 'mt-add', onsubmit: async (ev) => {
        ev.preventDefault();
        try { await api('/maintenance', { method: 'POST', body: { equipment_id: e.id, title: mtTitle.value.trim(), interval_days: mtInt.value, next_due: mtNext.value, notify_customer: mtNotify.checked } }); toast('Reja qo‘shildi'); route(); } catch (er) { toast(errText(er), 'bad'); }
      } }, h('h3', { text: 'Yangi ish' }), field('Ish nomi', mtTitle), h('div', { class: 'row2' }, field('Har necha kunda', mtInt), field('Keyingi sana', mtNext, 'Bo‘sh bo‘lsa bugundan hisoblanadi')), h('label', { class: 'cb' }, mtNotify, ' Mijozga 3 kun oldin Telegramda eslatilsin'), h('button', { class: 'btn btn-ghost', type: 'submit', text: '+ Qo‘shish' })));
    // Tarix
    const evKind = h('select', {}, Object.entries(EV).filter(([k]) => k !== 'request').map(([k, v]) => h('option', { value: k, text: v })));
    const evText = h('textarea', { rows: '2', maxlength: '1000', placeholder: 'Masalan: 3-o‘q enkoder kabeli almashtirildi' });
    const evDate = h('input', { type: 'date', value: today() });
    const evPub = h('input', { type: 'checkbox', checked: true });
    const hist = h('div', { class: 'card' }, h('h2', { text: 'Uskuna tarixi' }),
      h('form', { class: 'mt-add', onsubmit: async (ev) => {
        ev.preventDefault();
        await api(`/equipment/${e.id}/events`, { method: 'POST', body: { kind: evKind.value, text: evText.value.trim(), at: evDate.value, public: evPub.checked } }); toast('Qo‘shildi'); route();
      } }, h('div', { class: 'row2' }, field('Turi', evKind), field('Sana', evDate)), field('Tavsif', evText), h('label', { class: 'cb' }, evPub, ' Pasport sahifasida ko‘rinsin'), h('button', { class: 'btn btn-ghost', type: 'submit', text: '+ Yozuv' })),
      e.events.length ? h('ol', { class: 'tl' }, e.events.map((x) => h('li', {}, h('div', { class: 'tl-h' }, h('b', { text: EV[x.kind] || x.kind }), h('small', { class: 'muted', text: x.at.slice(0, 10) }), x.public ? null : h('span', { class: 'tag', text: 'Ichki' }),
        h('button', { type: 'button', class: 'btn-x', title: 'O‘chirish', text: '✕', onclick: async () => { await api(`/events/${x.id}`, { method: 'DELETE' }); route(); } })), x.text ? h('p', { text: x.text }) : null))) : null);
    const reqs = h('div', { class: 'card' }, h('h2', { text: 'Arizalar' }), e.requests.length ? h('ul', { class: 'recent' }, e.requests.map((r) => h('li', {}, h('a', { href: `#req/${r.id}` }, h('span', { class: `dot p-${r.priority}` }), h('b', { class: 'mono', text: r.code }), h('span', { class: 'ell', text: fmtDate(r.created_at) }), pill(r.status))))) : empty('Ariza yo‘q'));
    const del = h('button', { class: 'btn btn-danger', type: 'button', text: 'Uskunani o‘chirish', onclick: async () => { if (!confirm(`${e.code} va uning tarixi o‘chirilsinmi? QR yorliq ishlamay qoladi.`)) return; await api(`/equipment/${e.id}`, { method: 'DELETE' }); location.hash = 'eq'; } });
    box.append(h('div', { class: 'split' }, h('div', { class: 'stack' }, mt, hist), h('div', { class: 'stack' }, h('div', { class: 'card' }, h('h2', { text: 'QR manzili' }), h('p', { class: 'mono break' }, pub, copyBtn(pub))), reqs, eqForm(e, custs), h('div', { class: 'danger-zone' }, del))));
  }
  async function mtList(box) {
    const rows = await api('/maintenance?days=60');
    clear(box);
    if (!rows.length) return box.append(empty('Yaqin 60 kunda profilaktika yo‘q. Uskuna sahifasida reja qo‘shing.'));
    box.append(h('p', { class: 'muted', text: 'Har kuni ertalab 08:00 da muhandisga 7 kunlik ro‘yxat Telegramda keladi. Botda /profilaktika buyrug‘i ham bor.' }));
    box.append(h('table', { class: 'tbl' },
      h('thead', {}, h('tr', {}, ['Sana', 'Ish', 'Uskuna', 'Korxona', 'Telefon', ''].map((c) => h('th', { text: c })))),
      h('tbody', {}, rows.map((m) => h('tr', {},
        h('td', { class: m.next_due < today() ? 'bad nowrap' : 'nowrap', text: m.next_due }),
        h('td', {}, h('b', { text: m.title })),
        h('td', {}, h('a', { href: `#eq/${m.equipment_id}`, text: [m.brand, m.model].filter(Boolean).join(' ') || m.eq_code })),
        h('td', { text: m.company || '—' }), h('td', { class: 'nowrap', text: m.phone || '—' }),
        h('td', {}, h('button', { type: 'button', class: 'btn btn-ghost sm', text: '✓ Bajarildi', onclick: async () => { await api(`/maintenance/${m.id}/done`, { method: 'POST', body: {} }); toast('Belgilandi'); route(); } })))))));
  }
  async function custList(box) {
    const rows = await api('/customers');
    clear(box);
    const f = {}; const inp = (k, a = {}) => (f[k] = h('input', { type: 'text', ...a }));
    let editId = null;
    const save = h('button', { class: 'btn btn-primary', type: 'submit', text: 'Qo‘shish' });
    const form = h('form', { class: 'card', onsubmit: async (e) => {
      e.preventDefault();
      try { await api(`/customers${editId ? '/' + editId : ''}`, { method: 'POST', body: Object.fromEntries(Object.entries(f).map(([k, i]) => [k, i.value.trim()])) }); toast('Saqlandi'); route(); } catch (er) { toast(errText(er), 'bad'); }
    } }, h('h2', { text: 'Korxona' }), h('div', { class: 'grid-f' }, field('Nomi', inp('company', { maxlength: '120', required: true })), field('Mas’ul shaxs', inp('contact', { maxlength: '80' })), field('Telefon', inp('phone', { maxlength: '20' })), field('Manzil', inp('address', { maxlength: '200' })), field('Izoh', inp('notes', { maxlength: '1000' }))), save);
    box.append(h('div', { class: 'split' }, h('div', { class: 'stack' },
      rows.length ? h('table', { class: 'tbl' },
        h('thead', {}, h('tr', {}, ['Korxona', 'Telefon', 'Uskuna', 'Telegram', 'Ulanish kodi', ''].map((c) => h('th', { text: c })))),
        h('tbody', {}, rows.map((c) => h('tr', {},
          h('td', {}, h('b', { text: c.company }), c.contact ? h('small', { class: 'muted block', text: c.contact }) : null),
          h('td', { class: 'nowrap', text: c.phone || '—' }), h('td', { text: String(c.eq_count) }), h('td', { text: String(c.tg_count) }),
          h('td', { class: 'mono nowrap' }, c.link_code, copyBtn(c.tg_link || c.link_code)),
          h('td', { class: 'nowrap' },
            h('button', { type: 'button', class: 'btn-x', title: 'Tahrirlash', text: '✎', onclick: () => { editId = c.id; for (const k of Object.keys(f)) f[k].value = c[k] || ''; save.textContent = 'Saqlash'; f.company.focus(); } }),
            h('button', { type: 'button', class: 'btn-x', title: 'O‘chirish', text: '✕', onclick: async () => { if (!confirm(`${c.company} o‘chirilsinmi? Uskunalar qoladi, korxonasiz.`)) return; await api(`/customers/${c.id}`, { method: 'DELETE' }); route(); } }))))))
        : empty('Hali korxona yo‘q.'),
      h('p', { class: 'muted', text: 'Ulanish kodi yoki havolani korxona xodimiga yuboring. U botda yoki ilovada kodni kiritsa, korxona uskunalari, profilaktika eslatmalari va hujjatlar unga Telegramda keladi.' })),
      form));
  }

  /* ---------- Hujjatlar: tijorat taklifi va dalolatnoma ---------- */
  const DOCK = { quote: 'Tijorat taklifi', invoice: 'To‘lov uchun hisob', act: 'Bajarilgan ishlar dalolatnomasi', report: 'Servis hisoboti' };
  const DOCS = { draft: 'Qoralama', sent: 'Yuborilgan', accepted: 'Qabul qilingan', paid: 'To‘langan' };
  const DOCPILL = { draft: 'new', sent: 'scheduled', accepted: 'done', paid: 'done' };
  const docSum = (data) => {
    const sub = (data.items || []).reduce((a, i) => a + (Number(i.qty) || 0) * (Number(i.price) || 0), 0);
    const base = sub - Math.round(sub * (Number(data.discount) || 0)) / 100;
    return Math.round(base * (1 + (Number(data.vat) || 0) / 100));
  };
  let docFilter = { kind: '', status: '', q: '' };
  async function viewDocs(arg) {
    if (arg) return docEdit(arg === 'new' ? null : +arg);
    main.append(head('Hujjatlar', 'Tijorat taklifi, to‘lov uchun hisob, dalolatnoma va servis hisoboti: uch tilda, summa so‘z bilan, imzo va muhr bilan. Mijozga havola Telegram yoki email orqali yuboriladi.', h('a', { class: 'btn btn-primary', href: '#docs/new', text: '+ Yangi hujjat' })));
    const box = h('div', {}, loading()); main.append(box);
    let rows; try { rows = await api('/docs'); } catch (e) { clear(box).append(h('p', { class: 'err', text: errText(e) })); return; }
    clear(box);
    if (!rows.length) return box.append(empty('Hali hujjat yo‘q. Ariza sahifasidan “Taklif tuzish” yoki “Servis hisoboti” tugmasi bilan ham yaratish mumkin.'));
    const fk = h('select', { 'aria-label': 'Turi' }, h('option', { value: '', text: 'Barcha turlar' }), Object.entries(DOCK).map(([k, v]) => h('option', { value: k, text: v }))); fk.value = docFilter.kind;
    const fs = h('select', { 'aria-label': 'Holat' }, h('option', { value: '', text: 'Barcha holatlar' }), Object.entries(DOCS).map(([k, v]) => h('option', { value: k, text: v }))); fs.value = docFilter.status;
    const fq = h('input', { type: 'search', placeholder: 'Raqam, mijoz yoki ariza bo‘yicha qidirish', value: docFilter.q, 'aria-label': 'Qidirish' });
    const sumBox = h('p', { class: 'muted doc-sum' });
    const tb = h('tbody');
    const draw = () => {
      docFilter = { kind: fk.value, status: fs.value, q: fq.value.trim().toLowerCase() };
      const list = rows.filter((d) => (!docFilter.kind || d.kind === docFilter.kind) && (!docFilter.status || d.status === docFilter.status)
        && (!docFilter.q || [d.number, d.data.customer, d.company, d.request_code, d.data.equipment].join(' ').toLowerCase().includes(docFilter.q)));
      const byCur = {};
      for (const d of list) { const c = d.data.currency || 'UZS'; byCur[c] = (byCur[c] || 0) + (Number(d.total) || 0); }
      sumBox.textContent = `${list.length} ta hujjat · jami: ${Object.entries(byCur).map(([c, v]) => `${num(Math.round(v))} ${c}`).join(', ') || '0'}`;
      clear(tb).append(...(list.length ? list.map((d) => h('tr', { class: 'row-link', tabindex: '0', onclick: () => { location.hash = `docs/${d.id}`; }, onkeydown: (e) => { if (e.key === 'Enter') location.hash = `docs/${d.id}`; } },
        h('td', { class: 'mono', text: d.number }), h('td', { text: DOCK[d.kind] || d.kind }), h('td', { text: d.data.customer || d.company || '—' }), h('td', { class: 'mono', text: d.request_code || '—' }),
        h('td', { class: 'nowrap', text: `${num(d.total)} ${d.data.currency || ''}` }), h('td', {}, h('span', { class: `pill st-${DOCPILL[d.status] || 'new'}`, text: DOCS[d.status] || d.status })), h('td', { class: 'nowrap', text: fmtDate(d.data.date || d.created_at) })))
        : [h('tr', {}, h('td', { colspan: '7', class: 'muted', text: 'Filtrga mos hujjat yo‘q' }))]));
    };
    for (const el of [fk, fs]) el.addEventListener('change', draw);
    fq.addEventListener('input', draw);
    box.append(h('div', { class: 'filters' }, fk, fs, fq), sumBox,
      h('div', { class: 'tbl-scroll' }, h('table', { class: 'tbl' }, h('thead', {}, h('tr', {}, ['Raqam', 'Turi', 'Mijoz', 'Ariza', 'Jami', 'Holat', 'Sana'].map((c) => h('th', { text: c })))), tb)));
    draw();
  }
  async function docEdit(id, preset) {
    main.append(h('a', { href: '#docs', class: 'back', text: '← Hujjatlar' }));
    let d = preset || { kind: 'quote', lang: 'uz', status: 'draft', data: { items: [{ name: '', qty: 1, unit: 'xizmat', price: 0 }], currency: 'UZS', vat: 0, valid_days: 10 } };
    let custs = [], all = [];
    try { [custs, d, all] = await Promise.all([api('/customers'), id ? api(`/docs/${id}`) : Promise.resolve(d), api('/docs').catch(() => [])]); } catch (e) { return main.append(h('p', { class: 'err', text: errText(e) })); }
    const dd = d.data || {};
    const rp = dd.report || {};
    // Avvalgi hujjatlardagi qatorlar: nomini yozganda birlik va oxirgi narx avtomatik qo‘yiladi
    const catalog = new Map();
    for (const x of all.slice().reverse()) for (const it of x.data.items || []) if (it.name) catalog.set(it.name, it);
    const dlId = 'doc-items-dl';
    const dl = h('datalist', { id: dlId }, [...catalog.keys()].slice(-300).map((n) => h('option', { value: n })));
    const kind = h('select', {}, Object.entries(DOCK).map(([k, v]) => h('option', { value: k, text: v }))); kind.value = d.kind;
    const lang = h('select', {}, LANGS.map((l) => h('option', { value: l, text: LANG_NAME[l] }))); lang.value = d.lang;
    const status = h('select', {}, Object.entries(DOCS).map(([k, v]) => h('option', { value: k, text: v }))); status.value = d.status || 'draft';
    const cust = h('select', {}, h('option', { value: '', text: '— Ro‘yxatdan tanlanmagan —' }), custs.map((c) => h('option', { value: String(c.id), text: c.company }))); cust.value = d.customer_id ? String(d.customer_id) : '';
    const custName = h('input', { type: 'text', maxlength: '200', value: dd.customer || '', placeholder: '“Navoiy Avto” MChJ' });
    const date = h('input', { type: 'date', value: dd.date || (d.created_at || new Date().toISOString()).slice(0, 10) });
    const contract = h('input', { type: 'text', maxlength: '120', value: dd.contract || '', placeholder: '№ 12/2026, 05.01.2026' });
    const equipment = h('input', { type: 'text', maxlength: '200', value: dd.equipment || '', placeholder: 'KUKA KR 210 R2700, S/N 123456' });
    const engineer = h('input', { type: 'text', maxlength: '120', value: dd.engineer || '' });
    const cur = h('select', {}, ['UZS', 'USD', 'EUR', 'RUB'].map((c) => h('option', { value: c, text: c }))); cur.value = dd.currency || 'UZS';
    const vat = h('input', { type: 'number', min: '0', max: '30', step: '1', value: dd.vat || 0 });
    const disc = h('input', { type: 'number', min: '0', max: '100', step: 'any', value: dd.discount || 0 });
    const valid = h('input', { type: 'number', min: '0', max: '365', value: dd.valid_days || 0 });
    const due = h('input', { type: 'number', min: '0', max: '365', value: dd.due_days || 0 });
    const notes = h('textarea', { rows: '3', maxlength: '3000', value: dd.notes || '', placeholder: 'To‘lov sharti, kafolat muddati, ish muddati…' });
    const ta = (v, ph) => h('textarea', { rows: '3', maxlength: '4000', value: v || '', placeholder: ph });
    const rs = { symptom: ta(rp.symptom, 'Liniya to‘xtagan, SRVO-050 xatosi…'), cause: ta(rp.cause, 'J3 o‘qi enkoder kabeli shikastlangan…'), work: ta(rp.work, 'Kabel almashtirildi, mastering bajarildi, 2 soat sinov…'), recommend: ta(rp.recommend, 'Kabel paketini 6 oyda bir ko‘rikdan o‘tkazish…') };
    const nextDate = h('input', { type: 'date', value: rp.next_date || '' });
    const total = h('b', { class: 'doc-total' });
    const itemsBox = h('tbody');
    const items = [];
    const recalc = () => {
      const sub = items.reduce((a, it) => a + (Number(it.qty.value) || 0) * (Number(it.price.value) || 0), 0);
      const base = sub - Math.round(sub * (Number(disc.value) || 0)) / 100;
      total.textContent = `Jami: ${num(Math.round(base * (1 + (Number(vat.value) || 0) / 100)))} ${cur.value}`;
    };
    const addItem = (it = { name: '', qty: 1, unit: '', price: 0 }) => {
      const o = { name: h('input', { type: 'text', maxlength: '300', value: it.name, list: dlId, placeholder: 'Ish yoki ehtiyot qism', 'aria-label': 'Nomi' }), qty: h('input', { type: 'number', min: '0', step: 'any', value: it.qty, 'aria-label': 'Miqdor' }), unit: h('input', { type: 'text', maxlength: '20', value: it.unit, 'aria-label': 'O‘lchov' }), price: h('input', { type: 'number', min: '0', step: 'any', value: it.price, 'aria-label': 'Narx' }) };
      o.name.addEventListener('change', () => { const c = catalog.get(o.name.value.trim()); if (c) { if (!o.unit.value) o.unit.value = c.unit || ''; if (!Number(o.price.value)) o.price.value = c.price || 0; recalc(); } });
      const tr = h('tr', {}, h('td', {}, o.name), h('td', { class: 'w-s' }, o.qty), h('td', { class: 'w-s' }, o.unit), h('td', { class: 'w-m' }, o.price), h('td', {}, h('button', { type: 'button', class: 'btn-x', text: '✕', title: 'O‘chirish', onclick: () => { items.splice(items.indexOf(o), 1); tr.remove(); recalc(); } })));
      for (const k of ['qty', 'price']) o[k].addEventListener('input', recalc);
      items.push(o); itemsBox.append(tr); recalc();
    };
    (dd.items || []).forEach(addItem);
    for (const el of [vat, disc]) el.addEventListener('input', recalc);
    cur.addEventListener('change', recalc);
    const body = () => ({ kind: kind.value, lang: lang.value, customer_id: cust.value, customer: custName.value.trim(), request_id: d.request_id || '', currency: cur.value, vat: vat.value, discount: disc.value, valid_days: valid.value, due_days: due.value,
      date: date.value, contract: contract.value.trim(), ref: dd.ref || '', equipment: equipment.value.trim(), engineer: engineer.value.trim(), notes: notes.value.trim(), status: status.value,
      report: { ...Object.fromEntries(Object.entries(rs).map(([k, v]) => [k, v.value.trim()])), next_date: nextDate.value },
      items: items.map((o) => ({ name: o.name.value.trim(), qty: o.qty.value, unit: o.unit.value.trim(), price: o.price.value })) });
    // Turga qarab kerakli maydonlarni ko‘rsatish
    const fValid = field('Taklif amal qiladi (kun)', valid), fDue = field('To‘lov muddati (kun)', due, 'Hisobda “… kun ichida” deb yoziladi');
    const repCard = h('div', { class: 'card' }, h('h2', { text: 'Servis hisoboti' }), field('Murojaat sababi va belgilar', rs.symptom), field('Aniqlangan sabab', rs.cause), field('Bajarilgan ishlar', rs.work), field('Tavsiyalar', rs.recommend), field('Keyingi texnik xizmat sanasi', nextDate));
    const syncKind = () => { const k = kind.value; fValid.hidden = k !== 'quote'; fDue.hidden = k !== 'invoice'; repCard.hidden = k !== 'report'; };
    kind.addEventListener('change', syncKind);
    const save = h('button', { class: 'btn btn-primary', type: 'submit', text: 'Saqlash' });
    const copyAs = (k, label) => h('button', { type: 'button', class: 'btn btn-ghost', text: label, onclick: async () => {
      try { await api(`/docs/${id}`, { method: 'POST', body: body() }); const r = await api(`/docs/${id}/copy`, { method: 'POST', body: { kind: k } }); toast('Yangi hujjat yaratildi'); location.hash = `docs/${r.id}`; } catch (er) { toast(errText(er), 'bad'); }
    } });
    const form = h('form', { class: 'editor', onsubmit: async (e) => {
      e.preventDefault(); save.disabled = true;
      try { const r = await api(`/docs${id ? '/' + id : ''}`, { method: 'POST', body: body() }); toast('Saqlandi'); if (!id) location.hash = `docs/${r.id}`; else route(); } catch (er) { toast(errText(er), 'bad'); } finally { save.disabled = false; }
    } },
    head(id ? `${DOCK[d.kind] || 'Hujjat'} ${d.number}` : 'Yangi hujjat', id ? `${DOCS[d.status] || ''}${d.request_code ? ` · ariza ${d.request_code}` : ''}${dd.ref ? ` · asos ${dd.ref}` : ''}` : 'Saqlagach raqam beriladi va chop etish sahifasi ochiladi.'),
    dl,
    h('div', { class: 'split' },
      h('div', { class: 'stack' },
        h('div', { class: 'card' }, h('h2', { text: 'Ishlar va ehtiyot qismlar' }),
          h('div', { class: 'tbl-scroll' }, h('table', { class: 'tbl items-tbl' }, h('thead', {}, h('tr', {}, ['Nomi', 'Miqdor', 'O‘lchov', 'Narx', ''].map((c) => h('th', { text: c })))), itemsBox)),
          h('div', { class: 'filters' }, h('button', { type: 'button', class: 'btn btn-ghost', text: '+ Qator', onclick: () => addItem() }), total),
          h('small', { class: 'muted', text: 'Avval ishlatilgan nomni tanlasangiz, o‘lchov va oxirgi narx o‘zi qo‘yiladi. Servis hisobotida qatorlar bo‘lmasa jadval chiqmaydi.' })),
        repCard,
        h('div', { class: 'card' }, field('Izoh va shartlar', notes))),
      h('div', { class: 'stack' },
        h('div', { class: 'card' }, h('div', { class: 'row2' }, field('Turi', kind), field('Til', lang)), h('div', { class: 'row2' }, field('Sana', date), field('Holat', status)),
          field('Korxona', cust), field('Mijoz nomi (hujjatda)', custName, 'Bo‘sh bo‘lsa korxona nomi olinadi'), field('Shartnoma', contract), field('Uskuna', equipment), field('Mas’ul muhandis', engineer),
          h('div', { class: 'row2' }, field('Valyuta', cur), field('QQS, %', vat)), h('div', { class: 'row2' }, field('Chegirma, %', disc), h('div', {}, fValid, fDue)),
          h('small', { class: 'muted', text: 'Imzo va muhr rasmi: Sozlamalar → Hujjatlar uchun imzo va muhr.' })),
        h('div', { class: 'sticky-act' }, save,
          id ? h('a', { class: 'btn btn-ghost', href: d.url, target: '_blank', rel: 'noopener', text: 'Chop etish / PDF ↗', onclick: async (e) => { if (d.status === 'draft') { e.preventDefault(); toast('Avval “Mijozga yuborish” bosing: qoralama ochiq havolada ko‘rinmaydi', 'bad'); } } }) : null,
          id ? h('button', { type: 'button', class: 'btn btn-ghost', text: d.recipients ? `Telegramda yuborish (${d.recipients})` : 'Yuborilgan deb belgilash', onclick: async () => {
            try { await api(`/docs/${id}`, { method: 'POST', body: body() }); const r = await api(`/docs/${id}/send`, { method: 'POST' }); toast(r.sent ? `Telegramda ${r.sent} kishiga yuborildi` : 'Havola ochildi. Uni email yoki messenjerda yuboring'); route(); } catch (er) { toast(errText(er), 'bad'); }
          } }) : null,
          id && d.status !== 'draft' ? h('a', { class: 'btn btn-ghost', href: `mailto:?subject=${encodeURIComponent(`${DOCK[d.kind]} ${d.number}`)}&body=${encodeURIComponent(d.url)}`, text: 'Email orqali' }) : null,
          id && d.status !== 'draft' ? h('p', { class: 'mono break' }, d.url, copyBtn(d.url)) : null,
          id ? h('div', { class: 'doc-copy' }, h('span', { class: 'lbl', text: 'Shu hujjat asosida yaratish' }),
            d.kind !== 'invoice' ? copyAs('invoice', 'To‘lov uchun hisob') : null, d.kind !== 'act' ? copyAs('act', 'Dalolatnoma') : null, d.kind !== 'report' ? copyAs('report', 'Servis hisoboti') : null, copyAs(d.kind, 'Nusxa')) : null,
          id ? h('button', { type: 'button', class: 'btn btn-danger', text: 'O‘chirish', onclick: async () => { if (!confirm('Hujjat o‘chirilsinmi?')) return; await api(`/docs/${id}`, { method: 'DELETE' }); location.hash = 'docs'; } }) : null))));
    main.append(form);
    syncKind();
  }
  async function docFromRequest(r, kind) {
    try {
      const out = await api('/docs', { method: 'POST', body: { kind, lang: r.lang || 'uz', request_id: r.id, items: kind === 'report' ? [] : [{ name: kind === 'act' ? `Ta’mirlash ishlari: ${r.equipment || r.service || ''}`.trim() : 'Diagnostika', qty: 1, unit: 'xizmat', price: 0 }], valid_days: kind === 'quote' ? 10 : 0, equipment: r.equipment || '', report: kind === 'report' ? { symptom: r.message || '' } : {} } });
      location.hash = `docs/${out.id}`;
    } catch (e) { toast(errText(e), 'bad'); }
  }

  /* ---------- Ustalar ---------- */
  async function viewTeam(arg) {
    if (arg) return teamEdit(arg === 'new' ? null : +arg);
    main.append(head('Ustalar', 'Saytdagi “Ustalar” sahifasi va bosh sahifadagi blok. Rasm, tajriba, ko‘nikmalar va bajargan ishlarni uch tilda kiriting.', h('a', { class: 'btn btn-primary', href: '#team/new', text: '+ Yangi usta' })));
    const box = h('div', {}, loading()); main.append(box);
    let rows; try { rows = await api('/team'); } catch (e) { clear(box).append(h('p', { class: 'err', text: errText(e) })); return; }
    clear(box);
    if (!rows.length) return box.append(empty('Hali usta qo‘shilmagan'));
    box.append(h('div', { class: 'tbl-scroll' }, h('table', { class: 'tbl' },
      h('thead', {}, h('tr', {}, ['', 'Ism', 'Lavozim', 'Tajriba', 'Saytda', 'Tartib'].map((c) => h('th', { text: c })))),
      h('tbody', {}, rows.map((m) => h('tr', { class: 'row-link', tabindex: '0', onclick: () => { location.hash = `team/${m.id}`; } },
        h('td', {}, m.photo ? h('img', { src: `/media/${m.photo}`, alt: '', class: 'tm-thumb' }) : h('span', { class: 'tm-thumb tm-thumb-e', text: (m.name || '?')[0] })),
        h('td', { text: m.name }), h('td', { text: m.data.role?.uz || '—' }), h('td', { text: m.years ? `${m.years} yil` : '—' }),
        h('td', { text: m.published ? 'Ha' : 'Yo‘q' }), h('td', { text: String(m.sort) })))))));
  }
  async function teamEdit(id) {
    main.append(h('a', { href: '#team', class: 'back', text: '← Ustalar' }));
    let m = { name: '', photo: '', years: '', skills: [], sort: 0, published: 1, data: {} };
    if (id) { try { m = (await api('/team')).find((x) => x.id === id) || m; } catch (e) { return main.append(h('p', { class: 'err', text: errText(e) })); } }
    const d = m.data || {};
    const name = h('input', { type: 'text', maxlength: '80', value: m.name, required: true });
    const years = h('input', { type: 'number', min: '0', max: '60', value: m.years || '' });
    const sort = h('input', { type: 'number', value: m.sort || 0 });
    const pub = h('input', { type: 'checkbox', checked: m.published !== 0 });
    const skills = h('input', { type: 'text', maxlength: '600', value: (m.skills || []).join(', '), placeholder: 'ABB IRC5, KUKA KR C4, Siemens S7-1500, TIA Portal' });
    const tri = { role: triField('Lavozim', d.role, { max: 80 }), bio: triField('Qisqacha ma’lumot', d.bio, { area: true, max: 1200 }), works: triField('Bajargan ishlari (har qatorga bittadan)', d.works, { area: true, rows: 5 }), certs: triField('Sertifikatlar (har qatorga bittadan)', d.certs, { area: true, rows: 3, max: 1000 }) };
    let photo = m.photo || '';
    const prev = h('div', { class: 'tm-prev' });
    const drawPrev = () => clear(prev).append(photo ? h('img', { src: `/media/${photo}`, alt: '' }) : h('span', { class: 'muted', text: 'Rasm yo‘q' }));
    drawPrev();
    const file = h('input', { type: 'file', accept: 'image/jpeg,image/png,image/webp', class: 'vh' });
    file.addEventListener('change', async () => {
      const fl = file.files[0]; if (!fl) return;
      try { const data = await readAsDataUrl(fl); const r = await api('/upload', { method: 'POST', body: { image: data } }); photo = r.file; drawPrev(); toast('Rasm yuklandi. Saqlashni unutmang'); } catch (e) { toast(errText(e), 'bad'); }
      file.value = '';
    });
    const save = h('button', { class: 'btn btn-primary', type: 'submit', text: 'Saqlash' });
    main.append(h('form', { class: 'editor', onsubmit: async (e) => {
      e.preventDefault(); save.disabled = true;
      const body = { name: name.value.trim(), years: years.value, sort: sort.value, published: pub.checked, skills: skills.value, photo, ...Object.fromEntries(Object.entries(tri).map(([k, f]) => [k, f.value()])) };
      try { const r = await api(`/team${id ? '/' + id : ''}`, { method: 'POST', body }); toast('Saqlandi'); if (!id) location.hash = `team/${r.id}`; } catch (er) { toast(errText(er), 'bad'); } finally { save.disabled = false; }
    } },
    head(id ? m.name : 'Yangi usta', 'Ma’lumotlar saytda darhol ko‘rinadi.'),
    h('div', { class: 'split' },
      h('div', { class: 'stack' }, h('div', { class: 'card' }, field('Ism familiya', name), tri.role, field('Uskunalar va ko‘nikmalar', skills, 'Vergul bilan ajrating'), tri.bio), h('div', { class: 'card' }, tri.works, tri.certs)),
      h('div', { class: 'stack' },
        h('div', { class: 'card' }, h('span', { class: 'lbl', text: 'Rasm' }), prev, h('div', { class: 'filters' }, h('button', { type: 'button', class: 'btn btn-ghost sm', text: 'Rasm tanlash', onclick: () => file.click() }), h('button', { type: 'button', class: 'btn btn-ghost sm', text: 'Olib tashlash', onclick: () => { photo = ''; drawPrev(); } }), file),
          h('small', { class: 'muted', text: 'Tik (portret) rasm yaxshi ko‘rinadi, masalan 800×1000.' })),
        h('div', { class: 'card' }, h('div', { class: 'row2' }, field('Tajriba (yil)', years), field('Tartib raqami', sort, 'Kichigi birinchi')), h('label', { class: 'cb' }, pub, ' Saytda ko‘rsatish')),
        h('div', { class: 'sticky-act' }, save,
          id ? h('button', { type: 'button', class: 'btn btn-danger', text: 'O‘chirish', onclick: async () => { if (!confirm('Usta o‘chirilsinmi?')) return; await api(`/team/${id}`, { method: 'DELETE' }); location.hash = 'team'; } }) : null)))));
  }

  // Saytdan kelgan baholar (sayt qulayligi va xizmat sifati)
  async function feedbackCard() {
    let d; try { d = await api('/feedback'); } catch (e) { return h('p', { class: 'err', text: errText(e) }); }
    const s = d.summary || {};
    const st = (n) => (n ? '★'.repeat(n) + '☆'.repeat(5 - n) : '—');
    return h('div', { class: 'card fb-card' }, h('h2', { text: 'Saytdan kelgan baholar' }),
      h('p', { class: 'muted', text: `Sayt: ${s.site ?? '—'} (${s.ns || 0} ta) · Xizmat: ${s.service ?? '—'} (${s.nv || 0} ta). Izohli baholarni “Saytda” deb belgilasangiz, bosh sahifada ko‘rinadi.` }),
      d.rows.length ? h('div', { class: 'tbl-scroll' }, h('table', { class: 'tbl' }, h('thead', {}, h('tr', {}, ['Sana', 'Sayt', 'Xizmat', 'Izoh', 'Kimdan', 'Saytda', ''].map((c) => h('th', { text: c })))),
        h('tbody', {}, d.rows.map((r) => {
          const cb = h('input', { type: 'checkbox', checked: !!r.published, onchange: async () => { try { await api(`/feedback/${r.id}`, { method: 'POST', body: { published: cb.checked } }); toast('Saqlandi'); } catch (e) { toast(errText(e), 'bad'); } } });
          return h('tr', {}, h('td', { class: 'nowrap', text: fmtDate(r.created_at) }), h('td', { class: 'nowrap', text: st(r.site) }), h('td', { class: 'nowrap', text: st(r.service) }), h('td', { text: r.text || '—' }), h('td', { text: r.name || '—' }), h('td', {}, cb),
            h('td', {}, h('button', { type: 'button', class: 'btn-x', text: '✕', title: 'O‘chirish', onclick: async (e) => { if (!confirm('O‘chirilsinmi?')) return; await api(`/feedback/${r.id}`, { method: 'DELETE' }); e.target.closest('tr').remove(); } })));
        })))) : empty('Hozircha baho yo‘q'));
  }

  /* ---------- Xato kodlari ---------- */
  async function viewRev() {
    main.append(head('Mijoz baholari', 'Ariza “bajarildi” bo‘lgach mijoz sayt, bot yoki ilova orqali baholaydi. E’lon qilingan izohli baholar bosh sahifada ko‘rinadi.'));
    main.append(await feedbackCard(), h('h2', { class: 'sub-h', text: 'Ariza bo‘yicha baholar' }));
    const box = h('div', {}, loading()); main.append(box);
    let rows; try { rows = await api('/reviews'); } catch (e) { clear(box).append(h('p', { class: 'err', text: errText(e) })); return; }
    if (!rows.length) return clear(box).append(empty('Hozircha baholar yo‘q'));
    clear(box).append(h('table', { class: 'tbl' },
      h('thead', {}, h('tr', {}, ['Sana', 'Ariza', 'Baho', 'Izoh', 'Kimdan', 'Saytda', ''].map((c) => h('th', { text: c })))),
      h('tbody', {}, rows.map((r) => {
        const cb = h('input', { type: 'checkbox', checked: !!r.published, 'aria-label': 'Saytda ko‘rsatish', onchange: async () => { try { await api(`/reviews/${r.id}`, { method: 'POST', body: { published: cb.checked } }); toast(cb.checked ? 'E’lon qilindi' : 'Yashirildi'); } catch (e) { toast(errText(e), 'bad'); cb.checked = !cb.checked; } } });
        return h('tr', {}, h('td', { class: 'mono', text: String(r.created_at).slice(0, 10) }), h('td', {}, r.code ? h('a', { href: `#req/${r.request_id}`, class: 'mono', text: r.code }) : '—'),
          h('td', { class: 'stars-cell', text: '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating) }), h('td', { class: 'ell-cell', text: r.text || '—', title: r.text || '' }), h('td', { text: [r.name, r.company].filter(Boolean).join(' · ') || '—' }),
          h('td', {}, cb), h('td', {}, h('button', { type: 'button', class: 'btn-x', title: 'O‘chirish', text: '✕', onclick: async () => { if (!confirm('Baho o‘chirilsinmi?')) return; await api(`/reviews/${r.id}`, { method: 'DELETE' }); route(); } })));
      }))));
  }
  async function viewErr(arg) {
    if (arg) return errEdit(arg === 'new' ? null : +arg);
    main.append(head('Xato kodlari', 'KUKA, ABB, FANUC va chastota o‘zgartirgichlar xatolari. Har kod uch tilda alohida sahifa: Google’dan mijoz keladi.', h('a', { class: 'btn btn-primary', href: '#err/new', text: '+ Yangi kod' }), h('a', { class: 'btn btn-ghost', href: '/errors/', target: '_blank', rel: 'noopener', text: 'Saytda ↗' })));
    const q = h('input', { type: 'search', placeholder: 'Kod yoki nom bo‘yicha qidirish', 'aria-label': 'Qidirish' });
    const box = h('div', {}, loading()); main.append(h('div', { class: 'filters' }, q), box);
    let rows; try { rows = await api('/errors'); } catch (e) { clear(box).append(h('p', { class: 'err', text: errText(e) })); return; }
    const draw = () => {
      const s2 = q.value.trim().toLowerCase();
      const list = rows.filter((r) => !s2 || `${r.brand} ${r.code} ${r.data.title?.uz || ''}`.toLowerCase().includes(s2));
      clear(box).append(h('table', { class: 'tbl' },
        h('thead', {}, h('tr', {}, ['Brend', 'Kod', 'Nomi', 'Daraja', 'Ko‘rishlar', ''].map((c) => h('th', { text: c })))),
        h('tbody', {}, list.map((r) => h('tr', { class: 'row-link', tabindex: '0', onclick: () => { location.hash = `err/${r.id}`; } },
          h('td', { text: r.brand }), h('td', { class: 'mono', text: r.code }), h('td', { class: 'ell-cell', text: r.data.title?.uz || '' }),
          h('td', {}, h('span', { class: `pill p-${r.severity === 'normal' ? 'normal' : r.severity}`, text: { critical: 'Kritik', high: 'Yuqori', normal: 'Oddiy' }[r.severity] })),
          h('td', { text: num(r.views) }), h('td', {}, r.published ? null : h('span', { class: 'tag', text: 'Yashirin' })))))));
    };
    q.addEventListener('input', draw); draw();
  }
  async function errEdit(id) {
    main.append(h('a', { href: '#err', class: 'back', text: '← Xato kodlari' }));
    let x = { brand: '', code: '', controller: '', severity: 'normal', published: 1, data: {} };
    if (id) { try { x = (await api('/errors')).find((r) => r.id === id); if (!x) throw new Error('not_found'); } catch (e) { return main.append(h('p', { class: 'err', text: errText(e) })); } }
    const lines = (o) => Object.fromEntries(LANGS.map((l) => [l, (o?.[l] || []).join('\n')]));
    const split = (o) => Object.fromEntries(Object.entries(o).map(([l, v]) => [l, v.split('\n').map((s2) => s2.trim()).filter(Boolean)]));
    const brand = h('input', { type: 'text', maxlength: '30', value: x.brand, required: true, placeholder: 'KUKA, ABB, FANUC, Siemens…' });
    const code = h('input', { type: 'text', maxlength: '60', value: x.code, required: true, placeholder: 'SRVO-062' });
    const ctrl = h('input', { type: 'text', maxlength: '60', value: x.controller, placeholder: 'IRC5 / RobotWare 6' });
    const sev = h('select', {}, [['critical', 'Kritik'], ['high', 'Yuqori'], ['normal', 'Oddiy']].map(([k, v]) => h('option', { value: k, text: v }))); sev.value = x.severity;
    const pub = h('input', { type: 'checkbox', checked: x.published });
    const tri = { title: triField('Nomi (qisqa tavsif)', x.data.title, { max: 160 }), causes: triField('Sabablar (har qatorga bittadan)', lines(x.data.causes), { area: true, rows: 5 }), checks: triField('Tekshirish qadamlari (har qatorga bittadan)', lines(x.data.checks), { area: true, rows: 6 }), note: triField('Xavfsizlik ogohlantirishi', x.data.note, { area: true, rows: 2, max: 600 }) };
    const save = h('button', { class: 'btn btn-primary', type: 'submit', text: 'Saqlash' });
    main.append(h('form', { class: 'editor', onsubmit: async (e) => {
      e.preventDefault(); save.disabled = true;
      try { await api(`/errors${id ? '/' + id : ''}`, { method: 'POST', body: { brand: brand.value.trim(), code: code.value.trim(), controller: ctrl.value.trim(), severity: sev.value, published: pub.checked, title: tri.title.value(), causes: split(tri.causes.value()), checks: split(tri.checks.value()), note: tri.note.value() } }); toast('Saqlandi'); location.hash = 'err'; } catch (er) { toast(errText(er), 'bad'); } finally { save.disabled = false; }
    } }, head(id ? `${x.brand} ${x.code}` : 'Yangi xato kodi', 'Har til uchun alohida sahifa va Google uchun savol-javob belgisi avtomatik yaratiladi.'),
    h('div', { class: 'split' }, h('div', { class: 'card stack' }, tri.title, tri.causes, tri.checks, tri.note),
      h('div', { class: 'stack' }, h('div', { class: 'card' }, field('Brend', brand), field('Kod', code), field('Kontroller', ctrl), field('Daraja', sev), h('label', { class: 'cb' }, pub, ' Saytda ko‘rsatish')),
        h('div', { class: 'sticky-act' }, save, id ? h('button', { type: 'button', class: 'btn btn-danger', text: 'O‘chirish', onclick: async () => { if (!confirm('Kod o‘chirilsinmi?')) return; await api(`/errors/${id}`, { method: 'DELETE' }); location.hash = 'err'; } }) : null)))));
  }

  /* ---------- Sozlamalar ---------- */
  async function viewSet() {
    main.append(head('Sozlamalar', 'Aloqa ma’lumotlari, ulanishlar va xavfsizlik.'));
    let st;
    try { st = await api('/settings'); } catch (e) { return main.append(h('p', { class: 'err', text: errText(e) })); }
    const F = [['brand', 'Brend nomi'], ['engineerName', 'Muhandis ismi'], ['phone', 'Telefon (saytda ko‘rinadi)'], ['whatsapp', 'WhatsApp raqami (faqat raqam)'], ['telegram', 'Telegram username (@ siz)'], ['email', 'Email'], ['city_uz', 'Shahar (o‘zbekcha)'], ['city_ru', 'Shahar (ruscha)'], ['city_en', 'Shahar (inglizcha)'], ['responseHours', 'Javob berish vaqti (soat)'], ['domain', 'Sayt domeni (https://...)']];
    const F2 = [['company_legal', 'Yuridik nom (hujjatlarda)'], ['company_address', 'Yuridik manzil'], ['company_inn', 'STIR (INN)'], ['company_bank', 'Bank'], ['company_account', 'Hisob raqami'], ['company_mfo', 'MFO']];
    const F3 = [['googleVerify', 'Google Search Console kodi', 'Meta teg kodi yoki HTML fayl nomi (google1234abcd.html)'], ['yandexVerify', 'Yandex Webmaster kodi', 'yandex-verification content qiymati'], ['admin_tg_ids', 'Qo‘shimcha admin Telegram ID lari', 'Vergul bilan. Bu odamlar Mini App’da boshqaruv bo‘limini ko‘radi']];
    const F4 = [['warrantyMonths', 'Ishga kafolat (oy)', 'Saytda, botda va kafolat tekshiruvida ishlatiladi. Standart: 6'], ['partsMonths', 'Ehtiyot qismga kafolat (oy gacha)', 'Saytdagi kafolat shartlarida. Standart: 12']];
    const inputs = {};
    const save = h('button', { class: 'btn btn-primary', type: 'submit', text: 'Saqlash' });
    const form = h('form', { class: 'card', onsubmit: async (e) => {
      e.preventDefault(); save.disabled = true;
      try { await api('/settings', { method: 'POST', body: Object.fromEntries(Object.entries(inputs).map(([k, i]) => [k, i.value.trim()])) }); toast('Saqlandi'); } catch (er) { toast(errText(er), 'bad'); } finally { save.disabled = false; }
    } }, h('h2', { text: 'Aloqa va brend' }), h('div', { class: 'grid-f' }, F.map(([k, l]) => { inputs[k] = h('input', { type: k === 'responseHours' ? 'number' : 'text', value: st[k] ?? '' }); return field(l, inputs[k]); }),
        (() => { const sel = h('select', {}, h('option', { value: 'open', text: 'Ochiq: hamma ko‘radi va bir bosishda qo‘ng‘iroq qiladi' }), h('option', { value: 'lock', text: 'Yopiq: ariza qoldirgandan keyin ochiladi' })); sel.value = st.phoneMode === 'lock' ? 'lock' : 'open'; inputs.phoneMode = sel; return field('Telefon raqami saytda', sel, 'Ochiq rejim ko‘proq qo‘ng‘iroq olib keladi'); })()),
      h('h2', { text: 'Rekvizitlar (taklif va dalolatnomada)' }), h('div', { class: 'grid-f' }, F2.map(([k, l]) => { inputs[k] = h('input', { type: 'text', value: st[k] ?? '' }); return field(l, inputs[k]); })),
      h('h2', { text: 'Google, Yandex va Telegram' }), h('div', { class: 'grid-f' }, F3.map(([k, l, hint]) => { inputs[k] = h('input', { type: 'text', value: st[k] ?? '' }); return field(l, inputs[k], hint); })),
      h('h2', { text: 'Kafolat' }), h('div', { class: 'grid-f' }, F4.map(([k, l, hint]) => { inputs[k] = h('input', { type: 'number', min: '1', max: '60', value: st[k] ?? '' }); return field(l, inputs[k], hint); })), save);

    const ai = ME.ai || {};
    const conn = h('div', { class: 'card' }, h('h2', { text: 'Ulanishlar' }),
      h('ul', { class: 'conn' },
        h('li', {}, h('span', { class: `dot ${ai.enabled ? 'on' : 'off'}` }), h('div', {}, h('b', { text: 'AI tashxis (AI Gateway)' }), h('small', { class: 'muted block', text: ai.enabled ? `Yoqilgan · model: ${ai.model || '—'}${ai.gateway ? ' · gateway orqali' : ''}` : 'O‘chiq. Serverda AI_GATEWAY_URL va AI_GATEWAY_API_KEY o‘zgaruvchilarini kiriting.' }))),
        h('li', {}, h('span', { class: `dot ${ME.tg ? 'on' : 'off'}` }), h('div', {}, h('b', { text: 'Telegram xabarnomalar' }), h('small', { class: 'muted block', text: ME.tg ? `Yoqilgan${ME.webhook ? ' · /holat buyrug‘i ishlaydi' : ''}` : 'O‘chiq. TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID ni kiriting (README’da qadamlar bor).' })),
          ME.tg ? h('button', { type: 'button', class: 'btn btn-ghost sm', text: 'Sinov xabari', onclick: async () => { try { await api('/tg-test', { method: 'POST' }); toast('Telegramga yuborildi'); } catch (e) { toast(errText(e), 'bad'); } } }) : null)),
      st.botUsername ? h('p', {}, h('b', { text: 'Bot: ' }), h('a', { href: `https://t.me/${st.botUsername}`, target: '_blank', rel: 'noopener', text: `@${st.botUsername}` }), ' · Mini App: ', h('span', { class: 'mono', text: `${ME.domain}/tg/` })) : null,
      h('p', { class: 'muted', text: `Versiya: ${ME.version}` }));

    const cur = h('input', { type: 'password', autocomplete: 'current-password', required: true });
    const nxt = h('input', { type: 'password', autocomplete: 'new-password', minlength: '10', required: true });
    const pwForm = h('form', { class: 'card', onsubmit: async (e) => {
      e.preventDefault();
      try { await api('/password', { method: 'POST', body: { current: cur.value, next: nxt.value } }); toast('Parol o‘zgardi. Qayta kiring.'); showLogin(); } catch (er) { toast(errText(er), 'bad'); }
    } }, h('h2', { text: 'Parolni o‘zgartirish' }), field('Joriy parol', cur), field('Yangi parol', nxt, 'Kamida 10 belgi. Barcha qurilmalardagi sessiyalar yopiladi.'), h('button', { class: 'btn btn-ghost', type: 'submit', text: 'O‘zgartirish' }));
    main.append(h('div', { class: 'split' }, h('div', { class: 'stack' }, form, await sectionsCard(), await sigCard()), h('div', { class: 'stack' }, await securityCard(), await heroCard(), conn, pwForm)));
  }

  // Bosh sahifadagi bo‘limlarni yashirish yoki qayta ko‘rsatish
  async function sectionsCard() {
    const SECS = [['directions', 'To‘rt yo‘nalish kartalari'], ['monitoring', 'Avtomatik monitoring'], ['training', 'O‘qitish (kurslar)'], ['team', 'Ustalar va bajarilgan ishlar'], ['trust', 'Kafolat va baholash']];
    let st; try { st = await api('/sections'); } catch (e) { return h('div', { class: 'card' }, h('p', { class: 'err', text: errText(e) })); }
    const hid = new Set(st.hidden || []);
    const boxes = SECS.map(([k, l]) => [k, h('input', { type: 'checkbox', checked: !hid.has(k) }), l]);
    const save = h('button', { type: 'submit', class: 'btn btn-ghost', text: 'Saqlash' });
    return h('form', { class: 'card', onsubmit: async (e) => {
      e.preventDefault(); save.disabled = true;
      try { await api('/sections', { method: 'POST', body: { hidden: boxes.filter(([, c]) => !c.checked).map(([k]) => k) } }); toast('Saqlandi. Bosh sahifa yangilandi'); } catch (er) { toast(errText(er), 'bad'); } finally { save.disabled = false; }
    } }, h('h2', { text: 'Bosh sahifa bo‘limlari' }), h('p', { class: 'muted', text: 'Belgini olib tashlasangiz, bo‘lim bosh sahifada ko‘rinmaydi. Ma’lumotlar o‘chmaydi, istalgan payt qaytarish mumkin. Bosh ekran va ariza formasi doim ko‘rinadi. Ustalar bo‘limi ma’lumoti “Ustalar” bo‘limida to‘ldiriladi.' }),
      h('div', { class: 'sec-list' }, boxes.map(([, c, l]) => h('label', { class: 'cb' }, c, ` ${l}`))), save);
  }

  // Hujjatlardagi imzo va muhr rasmi
  async function sigCard() {
    let st; try { st = await api('/doc-assets'); } catch (e) { return h('div', { class: 'card' }, h('p', { class: 'err', text: errText(e) })); }
    const toData = (file) => new Promise((ok, bad) => {
      const img = new Image(); const u = URL.createObjectURL(file);
      img.onload = () => { const sc = Math.min(1, 600 / Math.max(img.width, img.height)); const c = document.createElement('canvas'); c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(u); ok(c.toDataURL('image/png')); };
      img.onerror = () => { URL.revokeObjectURL(u); bad(new Error('Rasmni o‘qib bo‘lmadi')); };
      img.src = u;
    });
    const slot = (k, label) => {
      const prev = h('div', { class: 'sig-prev' }, st[k] ? h('img', { src: st[k], alt: label }) : h('small', { class: 'muted', text: 'Yuklanmagan' }));
      const inp = h('input', { type: 'file', accept: 'image/png,image/jpeg,image/webp', class: 'vh' });
      const pick = h('button', { type: 'button', class: 'btn btn-ghost sm', text: 'Rasm tanlash', onclick: () => inp.click() });
      inp.addEventListener('change', async () => {
        const f = inp.files[0]; if (!f) return;
        try { const v = await toData(f); if (v.length > 400 * 1024) throw new Error('Rasm juda katta. Kichikroq PNG tanlang'); await api('/doc-assets', { method: 'POST', body: { [k]: v } }); st[k] = v; clear(prev).append(h('img', { src: v, alt: label })); toast('Saqlandi'); } catch (er) { toast(er.message || errText(er), 'bad'); }
        inp.value = '';
      });
      const del = h('button', { type: 'button', class: 'btn btn-ghost sm', text: 'O‘chirish', onclick: async () => { try { await api('/doc-assets', { method: 'POST', body: { [k]: '' } }); st[k] = ''; clear(prev).append(h('small', { class: 'muted', text: 'Yuklanmagan' })); toast('O‘chirildi'); } catch (er) { toast(errText(er), 'bad'); } } });
      return h('div', {}, h('span', { class: 'lbl', text: label }), prev, h('div', { class: 'filters' }, pick, del, inp));
    };
    return h('div', { class: 'card' }, h('h2', { text: 'Hujjatlar uchun imzo va muhr' }),
      h('p', { class: 'muted', text: 'Oq yoki shaffof fonda skanerlangan rasm (PNG yaxshiroq). Yuborilgan barcha hujjatlarda ijrochi imzosi o‘rnida chiqadi.' }),
      h('div', { class: 'sig-row' }, slot('sign', 'Imzo'), slot('stamp', 'Muhr')));
  }

  // Bosh sahifa fonidagi video: yangi fayl yuklash, kadr joylashuvi, standart videoga qaytish
  async function heroCard() {
    let hv;
    try { hv = await api('/hero'); } catch (e) { return h('div', { class: 'card' }, h('p', { class: 'err', text: errText(e) })); }
    let file = hv.file;
    const POS = { top: 'yuqori qismi', center: 'o‘rtasi', bottom: 'pastki qismi', left: 'chap tomoni', right: 'o‘ng tomoni' };
    const vid = h('video', { class: `hero-prev hp-${hv.pos}`, src: hv.src, muted: true, loop: true, autoplay: true, playsinline: true, preload: 'metadata' });
    vid.muted = true;
    const pos = h('select', {}, Object.entries(POS).map(([k, l]) => h('option', { value: k, text: `Videoning ${l}`, selected: k === hv.pos })));
    pos.addEventListener('change', () => { vid.className = `hero-prev hp-${pos.value}`; });
    const info = h('small', { class: 'muted block' });
    const bar = h('progress', { max: '100', value: '0', hidden: true });
    const state = () => { info.textContent = file ? 'Siz yuklagan video ko‘rsatilmoqda' : 'Standart video ko‘rsatilmoqda'; reset.hidden = !file; };
    const fileIn = h('input', { type: 'file', accept: 'video/mp4,video/webm', hidden: true });
    const up = h('button', { type: 'button', class: 'btn btn-ghost btn-sm', text: 'Yangi video yuklash (MP4)', onclick: () => fileIn.click() });
    const reset = h('button', { type: 'button', class: 'btn btn-ghost btn-sm', text: 'Standart videoga qaytarish', onclick: () => { file = ''; vid.src = '/assets/video/hero-robot.webm'; state(); } });
    fileIn.addEventListener('change', async () => {
      const f = fileIn.files[0]; if (!f) return;
      if (!/\.(mp4|webm)$/i.test(f.name)) { toast(ERR.format, 'bad'); return; }
      up.disabled = true; save.disabled = true; bar.hidden = false; bar.value = 0;
      try {
        file = await uploadVideo(f, (p) => { bar.value = Math.round(p * 100); info.textContent = `Yuklanmoqda: ${Math.round(p * 100)}% · ${fmtSize(f.size)}`; });
        vid.src = URL.createObjectURL(f);
        toast('Video yuklandi. Endi “Saqlash” ni bosing.');
      } catch (e) { toast(errText(e), 'bad'); }
      up.disabled = false; save.disabled = false; bar.hidden = true; fileIn.value = ''; state();
    });
    const save = h('button', { type: 'button', class: 'btn btn-primary', text: 'Saqlash', onclick: async () => {
      save.disabled = true;
      try { await api('/hero', { method: 'POST', body: { file, pos: pos.value } }); toast('Bosh sahifa videosi saqlandi'); } catch (e) { toast(errText(e), 'bad'); } finally { save.disabled = false; }
    } });
    state();
    return h('div', { class: 'card' }, h('h2', { text: 'Bosh sahifa videosi' }),
      h('p', { class: 'muted', text: 'Saytning eng yuqorisida, matn ortida aylanib turadigan video. Ovozsiz, 10–30 soniyali MP4 tavsiya qilinadi; hajmi 20 MB dan oshmagani ma’qul, aks holda telefonda sekin ochiladi.' }),
      h('div', { class: 'hero-prev-box' }, vid), h('div', { class: 'vp-act' }, up, fileIn, reset), bar, field('Joylashuv', pos, 'Video ekranga sig‘maganda qaysi qismi ko‘rinib turishi'), h('p', {}, info), save);
  }

  /* ---------- Ishga tushirish ---------- */
  try { const t = localStorage.getItem('theme'); if (t) document.documentElement.dataset.theme = t; } catch { /* yo'q */ }
  if (CSRF) boot(); else showLogin();
})();
