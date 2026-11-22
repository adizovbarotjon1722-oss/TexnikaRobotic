// Telegram Mini App: mijoz (arizalar, yangi ariza, uskunalar, hujjatlar, xato kodlari) va muhandis boshqaruvi.
// innerHTML ishlatilmaydi: barcha elementlar DOM orqali yaratiladi.
(function () {
  'use strict';
  var TG = window.Telegram && window.Telegram.WebApp;
  var root = document.getElementById('app');
  var S = { token: '', lang: 'uz', admin: false, ai: false, L: null, I18N: null, name: '' };

  /* ---------- Yordamchilar ---------- */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      var v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (var i = 2; i < arguments.length; i++) add(el, arguments[i]);
    return el;
  }
  function add(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { add(el, x); }); return; }
    el.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
  }
  var ICONS = {
    home: 'M3.5 11 12 4l8.5 7M6 9.5V20h12V9.5',
    list: 'M8 6.5h12M8 12h12M8 17.5h12M4 6.5h.01M4 12h.01M4 17.5h.01',
    plus: 'M12 5v14M5 12h14',
    cap: 'M2.5 9 12 4.5 21.5 9 12 13.5zM6.5 11v5c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-5',
    gear: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4 5.3 5.3',
    alert: 'M12 3.5 2.5 20h19zM12 10v4.5M12 17.5v.01',
    doc: 'M14 2.5H6.5A1.5 1.5 0 0 0 5 4v16a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 20V7.5zM14 2.5v5h5M8.5 13h7M8.5 17h7',
    chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
    phone: 'M5 3.5h3.5l1.7 4.3-2.2 1.4a11 11 0 0 0 6.8 6.8l1.4-2.2 4.3 1.7V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.1 1.5 1.5 0 0 1 5 3.5z',
    send: 'M21.5 3 2.5 10.5l7 2.5 2.5 7zM21.5 3 9.5 13',
    arrow: 'M5 12h14M13 6l6 6-6 6',
    lock: 'M5 10.5h14v10H5zM8 10.5V7.5a4 4 0 0 1 8 0v3',
    check: 'm5 12.5 4.5 4.5L19 7.5',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20.5c1-4 4.5-6 8-6s7 2 8 6',
    pin: 'M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    camera: 'M4 8h3l1.5-2.5h7L17 8h3v11.5H4zM12 10a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z'
  };
  function icon(name) {
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('class', 'i');
    var p = document.createElementNS(NS, 'path'); p.setAttribute('d', ICONS[name] || ''); svg.appendChild(p);
    return svg;
  }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }
  function fmt(s, v) { return String(s || '').replace(/\{(\w+)\}/g, function (m, k) { return v[k] != null ? v[k] : m; }); }
  function L(k) { return (S.L && S.L[k]) || k; }
  function day(s) { return String(s || '').slice(0, 10); }
  function haptic(t) { try { TG.HapticFeedback.notificationOccurred(t); } catch (e) { /* yo'q */ } }
  function money(n, c) { return Number(n || 0).toLocaleString('ru-RU') + ' ' + (c || ''); }

  function api(path, opts) {
    opts = opts || {};
    var headers = { Authorization: 'Bearer ' + S.token };
    if (opts.body) headers['Content-Type'] = 'application/json';
    return fetch('/api/app' + path, { method: opts.method || (opts.body ? 'POST' : 'GET'), headers: headers, body: opts.body ? JSON.stringify(opts.body) : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) { var e = new Error(j.error || r.status); e.status = r.status; throw e; } return j; }); });
  }

  var view = h('main', { class: 'view' });
  var nav = h('nav', { class: 'tabs' });
  function statusPill(st) { return h('span', { class: 'st st-' + st, text: (S.L.status && S.L.status[st]) || st }); }
  function prioPill(p) { return p ? h('span', { class: 'pr pr-' + p, text: (S.L.p && S.L.p[p]) || p }) : null; }
  function empty(text) { return h('p', { class: 'empty', text: text || L('none') }); }
  function card() { return h.apply(null, ['div', { class: 'card' }].concat([].slice.call(arguments))); }
  function sec(title) { return h('h2', { class: 'sec', text: title }); }
  function loading() { clear(view); view.appendChild(h('div', { class: 'spin', 'aria-label': '…' })); }
  function fail() { clear(view); view.appendChild(empty(L('error'))); haptic('error'); }
  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }

  function reqItem(r, href) {
    return h('a', { class: 'item', href: href || '#r/' + r.code },
      h('div', { class: 'item-top' }, h('code', { text: r.code }), statusPill(r.status)),
      h('div', { class: 'item-sub', text: [r.equipment, r.company, r.name].filter(Boolean).join(' · ') || r.message || '' }),
      h('div', { class: 'item-meta' }, h('time', { text: day(r.created_at) }), prioPill(r.priority)));
  }

  /* ---------- Sahifalar ---------- */
  var pages = {};
  pages.home = function () {
    return api('/home').then(function (d) {
      clear(view);
      view.appendChild(h('header', { class: 'hello' }, h('div', null, h('h1', { text: fmt(L('greeting'), { name: d.name || '' }) }), d.companies.length ? h('p', { class: 'muted', text: d.companies.join(', ') }) : null), langSwitch()));
      view.appendChild(h('a', { class: 'cta', href: '#new' }, h('span', { class: 'cta-ico' }, icon('plus')), h('span', null, h('b', { text: L('create') }), h('small', { text: S.ai ? L('analyzing').replace('…', '') : L('send') }))));
      view.appendChild(h('div', { class: 'tiles' },
        h('a', { class: 'tile', href: '#academy' }, icon('cap'), h('span', { text: L('academy') })),
        h('a', { class: 'tile', href: '#errors' }, icon('alert'), h('span', { text: L('errors') })),
        h('a', { class: 'tile', href: S.admin ? '#eq' : '#docs' }, icon(S.admin ? 'gear' : 'doc'), h('span', { text: S.admin ? L('equipment') : L('docs') }))));
      view.appendChild(sec(L('openReq')));
      view.appendChild(d.open.length ? h('div', { class: 'list' }, d.open.map(function (r) { return reqItem(r); })) : empty());
      if (d.due.length) {
        view.appendChild(sec(L('due')));
        view.appendChild(h('div', { class: 'list' }, d.due.map(function (e) { return eqItem(e); })));
      }
      view.appendChild(sec(L('follow')));
      view.appendChild(inlineForm(L('followPh'), L('add'), /^TX-[A-Z0-9]{4}-[A-Z0-9]{4}$/, function (code) { return api('/follow', { body: { code: code } }).then(function () { go('#r/' + code); }); }));
      if (!d.companies.length) {
        view.appendChild(sec(L('link')));
        view.appendChild(h('p', { class: 'muted small', text: L('linkHelp') }));
        view.appendChild(linkForm());
      }
      var cbox = h('div');
      view.appendChild(cbox);
      api('/contact').then(function (c) { add(cbox, contactCard(c)); }).catch(function () {});
    });
  };
  // Muhandis bilan bog'lanish: raqam faqat ariza yuborgan foydalanuvchiga ko'rsatiladi
  function openExt(url) { try { if (/^https:/.test(url)) TG.openLink(url); else location.href = url; } catch (e) { location.href = url; } }
  function contactCard(c) {
    if (!c || (!c.phone && !c.telegram)) return null;
    return h('section', { class: 'card contact' }, h('h3', { text: L('contact') }),
      c.phone ? h('p', { class: 'contact-num', text: c.phone }) : null,
      h('div', { class: 'row' },
        c.phone ? h('a', { class: 'btn', href: 'tel:' + String(c.phone).replace(/[^\d+]/g, '') }, icon('phone'), L('call')) : null,
        c.telegram ? h('button', { type: 'button', class: 'btn ghost', onclick: function () { try { TG.openTelegramLink('https://t.me/' + c.telegram); } catch (e) { openExt('https://t.me/' + c.telegram); } } }, icon('send'), L('write')) : null));
  }
  function inlineForm(ph, btn, re, onOk) {
    var inp = h('input', { type: 'text', placeholder: ph, autocapitalize: 'characters', maxlength: '14', spellcheck: 'false' });
    var msg = h('p', { class: 'form-msg', role: 'status' });
    var f = h('form', { class: 'inline', onsubmit: function (e) {
      e.preventDefault();
      var v = inp.value.trim().toUpperCase();
      if (!re.test(v)) { msg.textContent = L('badCode'); haptic('error'); return; }
      msg.textContent = '…';
      onOk(v).then(function () { haptic('success'); }).catch(function () { msg.textContent = L('badCode'); haptic('error'); });
    } }, inp, h('button', { type: 'submit', class: 'btn', text: btn }));
    return h('div', null, f, msg);
  }
  function linkForm() {
    return inlineForm(L('linkPh'), L('linkBtn'), /^CL-[A-Z0-9]{4}-[A-Z0-9]{4}$/, function (code) { return api('/link', { body: { code: code } }).then(function () { go('#eq'); }); });
  }
  function langSwitch() {
    return h('div', { class: 'langs' }, ['uz', 'ru', 'en'].map(function (l) {
      return h('button', { type: 'button', class: l === S.lang ? 'on' : '', text: l.toUpperCase(), onclick: function () {
        api('/lang', { body: { lang: l } }).catch(function () {});
        setLang(l); renderNav(); route();
      } });
    }));
  }

  pages.requests = function () {
    return api('/requests').then(function (list) {
      clear(view);
      view.appendChild(h('h1', { class: 'title', text: L('requests') }));
      view.appendChild(list.length ? h('div', { class: 'list' }, list.map(function (r) { return reqItem(r); })) : empty());
    });
  };

  pages.request = function (code) {
    return api('/requests/' + encodeURIComponent(code)).then(function (r) {
      clear(view);
      view.appendChild(h('header', { class: 'detail-head' }, h('code', { class: 'big', text: r.code }), statusPill(r.status), prioPill(r.priority)));
      if (r.equipment) view.appendChild(h('p', { class: 'muted', text: r.equipment }));
      view.appendChild(stages(r.status, r.created_at));
      if (r.message) view.appendChild(card(h('p', { class: 'pre', text: r.message })));
      if (r.ai) view.appendChild(aiCard(r.ai));
      if (r.warranty) view.appendChild(h('p', { class: 'w-line' + (r.warranty.status === 'active' ? ' ok' : ''), text: r.warranty.status === 'active' ? L('wActive').replace('{date}', r.warranty.until) : L('wExpired') }));
      if (r.canRate) view.appendChild(rateCard(r.code));
      view.appendChild(sec(L('history')));
      view.appendChild(timeline(r.updates));
      var cb = h('div'); view.appendChild(cb);
      api('/contact').then(function (c) { add(cb, contactCard(c)); }).catch(function () {});
    }).catch(function (e) {
      if (e.status === 404) {
        clear(view);
        view.appendChild(empty(L('badCode')));
        view.appendChild(inlineForm(L('followPh'), L('add'), /^TX-[A-Z0-9]{4}-[A-Z0-9]{4}$/, function (c) { return api('/follow', { body: { code: c } }).then(function () { go('#r/' + c); }); }));
        return;
      }
      throw e;
    });
  };
  // Ariza bosqichlari: qabul -> diagnostika -> ta'mir -> bajarildi
  var STAGE = { new: 0, diagnosing: 1, scheduled: 1, in_progress: 2, waiting_parts: 2, done: 3 };
  function stages(st, created) {
    var cur = STAGE[st]; if (cur === undefined) return null;
    var keys = ['new', 'diagnosing', 'in_progress', 'done'];
    return h('ol', { class: 'stages', 'aria-label': L('history') }, keys.map(function (k, i) {
      return h('li', { class: i < cur ? 'is-done' : i === cur ? 'is-cur' : '' }, h('span', { class: 'stg-dot' }, i < cur || (i === cur && k === 'done') ? icon('check') : null), h('span', { class: 'stg-l', text: (S.L.status && S.L.status[i === 2 && (st === 'waiting_parts') ? st : k]) || k }));
    }));
  }
  function rateCard(code) {
    var val = 0;
    var stars = h('div', { class: 'stars', role: 'radiogroup', 'aria-label': L('rate') });
    function draw() { [].forEach.call(stars.children, function (b, i) { b.classList.toggle('on', i < val); b.setAttribute('aria-checked', String(i + 1 === val)); }); }
    for (var i = 1; i <= 5; i++) (function (n) { stars.appendChild(h('button', { type: 'button', role: 'radio', 'aria-label': n + '/5', text: '★', onclick: function () { val = n; draw(); haptic('success'); } })); })(i);
    var txt = h('textarea', { rows: '3', maxlength: '600', placeholder: L('comment') });
    var msg = h('p', { class: 'form-msg', role: 'status' });
    var box = h('section', { class: 'card rate' }, h('h3', { text: L('rate') }), stars, txt, msg);
    box.appendChild(h('button', { type: 'button', class: 'btn btn-main', text: L('rateSend'), onclick: function () {
      if (!val) { haptic('error'); return; }
      api('/requests/' + code + '/review', { body: { rating: val, text: txt.value } }).then(function () { clear(box); box.appendChild(h('p', { class: 'ok', text: L('rateThanks') })); haptic('success'); }).catch(function () { msg.textContent = L('error'); });
    } }));
    return box;
  }
  function timeline(ups) {
    return h('ol', { class: 'tl' }, ups.map(function (u) {
      return h('li', null, h('time', { text: day(u.created_at) }), h('b', { text: (S.L.status && S.L.status[u.status]) || u.status || '' }), u.note ? h('p', { text: u.note }) : null);
    }));
  }
  function aiCard(ai) {
    return h('section', { class: 'card ai' }, h('h3', { text: S.L.ai.title.replace(/^\S+\s/, '') }), h('p', { text: ai.diagnosis }),
      ai.next_steps && ai.next_steps.length ? [h('h4', { text: S.L.ai.steps }), h('ol', null, ai.next_steps.map(function (s) { return h('li', { text: s }); }))] : null,
      ai.safety ? h('p', { class: 'warn' }, icon('alert'), h('span', { text: ai.safety })) : null);
  }

  /* Yangi ariza */
  var draftImages = [];
  pages['new'] = function (pre) {
    return Promise.all([api('/home'), api('/equipment')]).then(function (res) {
      var me = res[0], eqs = res[1];
      clear(view); draftImages = [];
      view.appendChild(h('h1', { class: 'title', text: L('create') }));
      var sel = null;
      if (eqs.length) {
        sel = h('select', { id: 'n-eq' }, eqs.map(function (e) { return h('option', { value: e.code, selected: pre === e.code, text: [e.brand, e.model, e.location].filter(Boolean).join(' · ') }); }), h('option', { value: '', text: L('other') }));
      }
      var eqText = h('input', { id: 'n-eqt', type: 'text', maxlength: '120', placeholder: 'KUKA KR 210 / ABB IRB 6700 / …' });
      var phone = h('input', { id: 'n-phone', type: 'tel', inputmode: 'tel', maxlength: '20', value: me.phone || '', placeholder: '+998 __ ___ __ __' });
      var msgEl = h('textarea', { id: 'n-msg', rows: '5', maxlength: '2000' });
      var thumbs = h('ul', { class: 'thumbs' });
      var file = h('input', { type: 'file', accept: 'image/jpeg,image/png,image/webp', multiple: true, class: 'vh', id: 'n-file', onchange: function () {
        [].slice.call(file.files).slice(0, 4 - draftImages.length).forEach(function (f) {
          resize(f).then(function (d) { draftImages.push(d); drawThumbs(); });
        });
        file.value = '';
      } });
      function drawThumbs() {
        clear(thumbs);
        draftImages.forEach(function (d, i) { thumbs.appendChild(h('li', null, h('img', { src: d, alt: '' }), h('button', { type: 'button', 'aria-label': '×', text: '×', onclick: function () { draftImages.splice(i, 1); drawThumbs(); } }))); });
        addBtn.hidden = draftImages.length >= 4;
      }
      var addBtn = h('label', { for: 'n-file', class: 'add-photo' }, icon('camera'), L('photos'));
      var status = h('p', { class: 'form-msg', role: 'status' });
      var result = h('div');
      function syncEq() { eqText.closest('.field').hidden = sel && sel.value !== ''; }
      if (sel) sel.addEventListener('change', syncEq);
      var form = h('form', { class: 'form', onsubmit: function (e) {
        e.preventDefault();
        if (msgEl.value.trim().length < 10 || phone.value.replace(/\D/g, '').length < 9) { status.textContent = L('error'); haptic('error'); return; }
        submit();
      } },
        sel ? h('div', { class: 'field' }, h('label', { for: 'n-eq', text: L('equipmentField') }), sel) : null,
        h('div', { class: 'field' }, h('label', { for: 'n-eqt', text: L('equipmentField') }), eqText),
        h('div', { class: 'field' }, h('label', { for: 'n-msg', text: L('message') }), msgEl),
        h('div', { class: 'field' }, thumbs, addBtn, file),
        h('div', { class: 'field' }, h('label', { for: 'n-phone', text: L('phone') }), phone),
        status, h('button', { type: 'submit', class: 'btn btn-main', text: L('send') }));
      view.appendChild(form); view.appendChild(result);
      syncEq();
      function submit() {
        var btn = form.querySelector('.btn-main');
        btn.disabled = true; status.textContent = S.ai ? L('analyzing') : L('sending');
        try { TG.MainButton.showProgress(); } catch (e) { /* eski versiya */ }
        api('/requests', { body: { message: msgEl.value, phone: phone.value, equipment: eqText.value, equipment_code: sel ? sel.value : '', images: draftImages } })
          .then(function (r) {
            haptic('success');
            clear(view);
            view.appendChild(h('div', { class: 'done' }, h('p', { class: 'done-ico' }, icon('check')), h('h1', { text: L('sent') }), h('code', { class: 'big', text: r.code })));
            if (r.ai) view.appendChild(aiCard(r.ai));
            add(view, contactCard(r.contact));
            view.appendChild(h('a', { class: 'btn btn-main', href: '#r/' + r.code, text: L('history') }));
          })
          .catch(function () { btn.disabled = false; status.textContent = L('error'); haptic('error'); });
      }
    });
  };
  function resize(f) {
    return new Promise(function (resolve, reject) {
      var img = new Image(); var u = URL.createObjectURL(f);
      img.onload = function () {
        var s = Math.min(1, 1600 / Math.max(img.width, img.height));
        var c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(u); resolve(c.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = reject; img.src = u;
    });
  }

  /* Uskunalar */
  function eqItem(e) {
    var overdue = e.next_due && e.next_due < new Date().toISOString().slice(0, 10);
    return h('a', { class: 'item' + (overdue ? ' is-over' : ''), href: '#eq/' + e.code },
      h('div', { class: 'item-top' }, h('b', { text: [e.brand, e.model].filter(Boolean).join(' ') || e.code }), h('code', { text: e.code })),
      h('div', { class: 'item-sub', text: [e.location, e.company].filter(Boolean).join(' · ') }),
      e.next_due ? h('div', { class: 'item-meta' }, h('span', { text: e.next_title || S.L.eq.next }), h('time', { text: e.next_due + (overdue ? ' · ' + S.L.eq.overdue : '') })) : null);
  }
  pages.eq = function () {
    return api('/equipment').then(function (list) {
      clear(view);
      view.appendChild(h('h1', { class: 'title', text: L('equipment') }));
      if (!list.length) { view.appendChild(h('p', { class: 'muted small', text: L('linkHelp') })); view.appendChild(linkForm()); return; }
      view.appendChild(h('div', { class: 'list' }, list.map(eqItem)));
    });
  };
  pages.eqOne = function (code) {
    return api('/equipment/' + encodeURIComponent(code)).then(function (e) {
      clear(view);
      var q = S.L.eq;
      view.appendChild(h('header', { class: 'detail-head col' }, h('h1', { text: [e.brand, e.model].filter(Boolean).join(' ') }), h('code', { text: e.code })));
      view.appendChild(card(h('dl', { class: 'facts' }, [[q.owner, e.company], [q.kind, e.kind], [q.serial, e.serial], [q.location, e.location], [q.year, e.year]].filter(function (x) { return x[1]; }).map(function (x) { return h('div', null, h('dt', { text: x[0] }), h('dd', { text: String(x[1]) })); }))));
      if (e.maintenance.length) {
        view.appendChild(sec(q.next));
        view.appendChild(h('div', { class: 'list' }, e.maintenance.map(function (m) { return h('div', { class: 'item static' }, h('div', { class: 'item-top' }, h('b', { text: m.title }), h('time', { text: m.next_due })), m.last_done ? h('div', { class: 'item-sub', text: '✓ ' + m.last_done }) : null); })));
      }
      view.appendChild(h('a', { class: 'btn btn-main', href: '#new/' + e.code, text: q.report }));
      view.appendChild(sec(q.history));
      view.appendChild(e.events.length ? h('ol', { class: 'tl' }, e.events.map(function (ev) { return h('li', null, h('time', { text: day(ev.at) }), h('b', { text: q.ev[ev.kind] || ev.kind }), ev.text ? h('p', { text: ev.text }) : null); })) : empty(q.noHistory));
    });
  };

  pages.docs = function () {
    return api('/docs').then(function (list) {
      clear(view);
      view.appendChild(h('h1', { class: 'title', text: L('docs') }));
      view.appendChild(list.length ? h('div', { class: 'list' }, list.map(function (d) {
        return h('a', { class: 'item', href: d.url, onclick: function (ev) { ev.preventDefault(); try { TG.openLink(location.origin + d.url); } catch (e) { location.href = d.url; } } },
          h('div', { class: 'item-top' }, h('b', { text: (d.kind === 'quote' ? S.L.doc.quote : S.L.doc.act) + ' ' + d.number }), d.status === 'accepted' ? h('span', { class: 'st st-done', text: S.L.doc.accepted }) : null),
          h('div', { class: 'item-meta' }, h('time', { text: day(d.created_at) }), h('b', { text: money(d.total, d.currency) })));
      })) : empty());
    });
  };

  pages.errors = function () {
    clear(view);
    view.appendChild(h('h1', { class: 'title', text: L('errors') }));
    var inp = h('input', { type: 'search', placeholder: 'SRVO-001, 50204, F30001 …', spellcheck: 'false' });
    var out = h('div', { class: 'list' });
    var timer;
    function run() {
      api('/errors?q=' + encodeURIComponent(inp.value)).then(function (list) {
        clear(out);
        if (!list.length) { out.appendChild(empty()); return; }
        list.forEach(function (x) {
          var body = h('div', { class: 'err-body', hidden: true },
            h('h4', { text: S.L.causes }), h('ul', null, x.causes.map(function (c) { return h('li', { text: c }); })),
            h('h4', { text: S.L.checks }), h('ol', null, x.checks.map(function (c) { return h('li', { text: c }); })),
            x.note ? h('p', { class: 'warn', text: x.note }) : null,
            h('a', { class: 'btn', href: '#new', text: L('create') }));
          out.appendChild(h('div', { class: 'item err' }, h('button', { type: 'button', class: 'err-head', 'aria-expanded': 'false', onclick: function () { body.hidden = !body.hidden; this.setAttribute('aria-expanded', String(!body.hidden)); } },
            h('div', { class: 'item-top' }, h('code', { text: x.brand + ' ' + x.code }), h('span', { class: 'sev sev-' + x.severity, text: S.L.sev[x.severity] || '' })),
            h('div', { class: 'item-sub', text: x.title })), body));
        });
      }).catch(fail);
    }
    inp.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(run, 250); });
    view.appendChild(h('div', { class: 'search' }, inp));
    view.appendChild(out);
    run();
    return Promise.resolve();
  };

  /* ---------- O'qish (sayt akademiyasi bilan bir xil hisob) ---------- */
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* yo'q */ } }
  function siteUrl(sub) { return (S.lang === 'uz' ? '' : '/' + S.lang) + '/' + sub; }
  pages.academy = function () {
    return api('/academy').then(function (a) {
      clear(view);
      view.appendChild(h('h1', { class: 'title', text: L('academy') }));
      if (!a.joined) {
        view.appendChild(h('p', { class: 'muted', text: L('acLead') }));
        var nm = h('input', { id: 'ac-n', type: 'text', maxlength: '80', autocomplete: 'name', value: S.name || '' });
        var cd = h('input', { id: 'ac-c', type: 'text', maxlength: '24', autocapitalize: 'characters', spellcheck: 'false' });
        var msg = h('p', { class: 'form-msg', role: 'status' });
        view.appendChild(h('form', { class: 'form', onsubmit: function (e) {
          e.preventDefault();
          api('/academy/join', { body: { name: nm.value, code: cd.value } }).then(function (r) { lsSet('ac_token', r.token); haptic('success'); route(); }).catch(function () { msg.textContent = L('badCode'); haptic('error'); });
        } }, h('div', { class: 'field' }, h('label', { for: 'ac-n', text: L('acName') }), nm), h('div', { class: 'field' }, h('label', { for: 'ac-c', text: L('acCode') }), cd), msg, h('button', { type: 'submit', class: 'btn btn-main', text: L('acJoin') })));
        return;
      }
      // Saytdagi kurs sahifasi shu kalit bilan ochiladi
      var ready = lsGet('ac_token') ? Promise.resolve() : api('/academy/join', { body: {} }).then(function (r) { lsSet('ac_token', r.token); });
      return ready.then(function () {
        view.appendChild(h('p', { class: 'muted', text: [a.name, a.company].filter(Boolean).join(' · ') }));
        view.appendChild(h('div', { class: 'list' }, a.courses.map(function (c) {
          var bar = h('progress', { max: '100', value: String(c.pct) });
          return h('a', { class: 'item course' + (c.passed ? ' is-ok' : '') + (c.locked ? ' is-locked' : ''), href: siteUrl('academy/' + c.slug + '/?tg=1') },
            h('div', { class: 'item-top' }, h('b', { text: c.title }), c.passed ? h('span', { class: 'st st-done', text: L('acPassed') }) : (c.locked ? icon('lock') : h('span', { class: 'pct', text: c.pct + '%' }))),
            h('div', { class: 'item-sub', text: c.locked ? fmt(L('acLocked'), { course: c.locked.title }) : c.equipment }),
            c.done || c.passed ? bar : null,
            c.passed && c.cert_id ? h('div', { class: 'item-meta' }, h('span', { text: L('acCert') + ' ' + c.cert_id }), c.valid_until ? h('time', { text: c.valid_until }) : null) : null);
        })));
      });
    });
  };

  /* ---------- Muhandis boshqaruvi ---------- */
  pages.admin = function () {
    return Promise.all([api('/admin/summary'), api('/admin/requests?open=1'), api('/admin/maintenance')]).then(function (res) {
      var s = res[0], reqs = res[1], due = res[2];
      clear(view);
      view.appendChild(h('h1', { class: 'title', text: L('admin') }));
      view.appendChild(h('div', { class: 'kpis' }, [[L('visitorsToday'), s.today], [L('openCount'), s.open], [L('critical'), s.critical], [L('dueCount'), s.due]].map(function (k, i) { return h('div', { class: 'kpi' + (i === 2 && k[1] ? ' hot' : '') }, h('b', { text: String(k[1]) }), h('small', { text: k[0] })); })));
      var max = Math.max.apply(null, s.daily.map(function (d) { return d.v; }).concat([1]));
      view.appendChild(h('div', { class: 'spark', 'aria-hidden': 'true' }, s.daily.map(function (d) { var b = h('i', { title: d.day + ': ' + d.v }); b.style.height = Math.max(4, Math.round(d.v / max * 100)) + '%'; if (d.r) b.className = 'has-r'; return b; })));
      var q = h('input', { type: 'search', placeholder: L('search') });
      var list = h('div', { class: 'list' });
      var openOnly = true;
      function draw(rows) { clear(list); if (!rows.length) list.appendChild(empty()); rows.forEach(function (r) { list.appendChild(reqItem(r, '#admin/r/' + r.id)); }); }
      var tOpen = h('button', { type: 'button', class: 'on', text: L('filterOpen') });
      var tAll = h('button', { type: 'button', text: L('filterAll') });
      function reload() { api('/admin/requests?' + (openOnly ? 'open=1&' : '') + 'q=' + encodeURIComponent(q.value)).then(draw).catch(fail); }
      tOpen.onclick = function () { openOnly = true; tOpen.className = 'on'; tAll.className = ''; reload(); };
      tAll.onclick = function () { openOnly = false; tAll.className = 'on'; tOpen.className = ''; reload(); };
      var tm; q.addEventListener('input', function () { clearTimeout(tm); tm = setTimeout(reload, 300); });
      view.appendChild(sec(L('requests')));
      view.appendChild(h('div', { class: 'seg' }, tOpen, tAll));
      view.appendChild(h('div', { class: 'search' }, q));
      view.appendChild(list); draw(reqs);
      view.appendChild(sec(L('due')));
      view.appendChild(due.length ? h('div', { class: 'list' }, due.map(function (m) {
        var over = m.next_due < new Date().toISOString().slice(0, 10);
        var b = h('button', { type: 'button', class: 'btn small', text: L('markDone') });
        b.onclick = function () {
          var go2 = function () { b.disabled = true; api('/admin/maintenance/' + m.id + '/done', { body: {} }).then(function () { haptic('success'); route(); }).catch(fail); };
          try { TG.showConfirm(m.title + ' — ' + L('markDone') + '?', function (ok) { if (ok) go2(); }); } catch (e) { go2(); }
        };
        return h('div', { class: 'item static' + (over ? ' is-over' : '') }, h('div', { class: 'item-top' }, h('b', { text: m.title }), h('time', { text: m.next_due })), h('div', { class: 'item-sub', text: [m.eq, m.company].filter(Boolean).join(' · ') }), h('div', { class: 'row' }, m.phone ? h('a', { class: 'btn small ghost', href: 'tel:' + m.phone.replace(/[^\d+]/g, ''), text: L('call') }) : null, b));
      })) : empty());
    });
  };
  pages.adminReq = function (id) {
    return api('/admin/requests/' + id).then(function (r) {
      clear(view);
      view.appendChild(h('header', { class: 'detail-head' }, h('code', { class: 'big', text: r.code }), statusPill(r.status), prioPill(r.priority)));
      view.appendChild(card(h('dl', { class: 'facts' }, [['user', [r.name, r.company].filter(Boolean).join(' · ')], ['phone', r.phone], ['gear', r.equipment], ['list', r.service], ['pin', r.source], ['camera', r.images ? String(r.images) : '']].filter(function (x) { return x[1]; }).map(function (x) { return h('div', null, h('dt', null, icon(x[0])), h('dd', { text: x[1] })); })), h('p', { class: 'pre', text: r.message })));
      if (r.phone) view.appendChild(h('a', { class: 'btn ghost', href: 'tel:' + r.phone.replace(/[^\d+]/g, '') }, icon('phone'), L('call')));
      if (r.ai) view.appendChild(aiCard({ diagnosis: r.ai.diagnosis, next_steps: (r.ai.causes || []).concat(r.ai.next_steps || []), safety: r.ai.safety }));
      var st = h('select', { id: 'a-st' }, Object.keys(S.L.status).map(function (k) { return h('option', { value: k, selected: k === r.status, text: S.L.status[k] }); }));
      var pr = h('select', { id: 'a-pr' }, ['critical', 'high', 'normal', 'low'].map(function (k) { return h('option', { value: k, selected: k === r.priority, text: S.L.p[k] }); }));
      var note = h('textarea', { id: 'a-note', rows: '3', maxlength: '1000' });
      var pub = h('input', { type: 'checkbox', id: 'a-pub', checked: true });
      var msg = h('p', { class: 'form-msg', role: 'status' });
      view.appendChild(sec(L('setStatus')));
      view.appendChild(h('form', { class: 'form', onsubmit: function (e) {
        e.preventDefault();
        api('/admin/requests/' + id, { body: { status: st.value, priority: pr.value, note: note.value, public: pub.checked } }).then(function () { haptic('success'); msg.textContent = L('saved'); setTimeout(route, 500); }).catch(fail);
      } }, h('div', { class: 'row2' }, st, pr), h('div', { class: 'field' }, h('label', { for: 'a-note', text: L('note') }), note), h('label', { class: 'check', for: 'a-pub' }, pub, h('span', { text: '👁' })), msg, h('button', { type: 'submit', class: 'btn btn-main', text: L('save') })));
      view.appendChild(sec(L('history')));
      view.appendChild(timeline(r.updates));
    });
  };

  /* ---------- Marshrut ---------- */
  function renderNav() {
    clear(nav);
    var items = [['#', 'home', L('home')], ['#requests', 'list', L('requests')], ['#new', 'plus', L('create')], ['#academy', 'cap', L('academy')], ['#eq', 'gear', L('equipment')]];
    if (S.admin) items[4] = ['#admin', 'chart', L('admin')];
    items.forEach(function (it) { nav.appendChild(h('a', { href: it[0], 'data-k': it[0], class: it[1] === 'plus' ? 'is-new' : null }, h('span', { class: 'ico' }, icon(it[1])), h('span', { class: 'lbl', text: it[2] }))); });
  }
  function route() {
    var hs = location.hash.replace(/^#/, '');
    var parts = hs.split('/');
    var key = parts[0] || '';
    [].forEach.call(nav.children, function (a) { a.classList.toggle('on', a.getAttribute('data-k') === '#' + key || (key === '' && a.getAttribute('data-k') === '#') || (key === 'r' && a.getAttribute('data-k') === '#requests')); });
    try { if (key) TG.BackButton.show(); else TG.BackButton.hide(); } catch (e) { /* yo'q */ }
    window.scrollTo(0, 0);
    loading();
    var p;
    if (key === 'r' && parts[1]) p = pages.request(parts[1].toUpperCase());
    else if (key === 'requests') p = pages.requests();
    else if (key === 'new') p = pages['new'](parts[1]);
    else if (key === 'eq' && parts[1]) p = pages.eqOne(parts[1]);
    else if (key === 'eq') p = pages.eq();
    else if (key === 'docs') p = pages.docs();
    else if (key === 'errors') p = pages.errors();
    else if (key === 'academy') p = pages.academy();
    else if (key === 'admin' && S.admin && parts[1] === 'r') p = pages.adminReq(parseInt(parts[2], 10));
    else if (key === 'admin' && S.admin) p = pages.admin();
    else p = pages.home();
    p.catch(fail);
  }
  function setLang(l) { S.lang = S.I18N[l] ? l : 'uz'; S.L = S.I18N[S.lang]; document.documentElement.lang = S.lang; }

  function boot() {
    fetch('/api/app/i18n').then(function (r) { return r.json(); }).then(function (i18n) {
      S.I18N = i18n; setLang('uz');
      if (!TG || !TG.initData) { clear(root); root.appendChild(h('p', { class: 'boot', text: L('noAccess') })); return; }
      TG.ready(); TG.expand();
      document.documentElement.setAttribute('data-scheme', TG.colorScheme || 'dark');
      try { TG.BackButton.onClick(function () { history.length > 1 ? history.back() : go('#'); }); } catch (e) { /* yo'q */ }
      return fetch('/api/app/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initData: TG.initData }) })
        .then(function (r) { if (!r.ok) throw new Error('auth'); return r.json(); })
        .then(function (a) {
          S.token = a.token; S.admin = a.admin; S.ai = a.ai; S.name = a.user.name || ''; setLang(a.user.lang);
          clear(root); root.appendChild(view); root.appendChild(nav);
          renderNav();
          var sp = (TG.initDataUnsafe && TG.initDataUnsafe.start_param) || '';
          if (!location.hash && /^r_TX-/.test(sp)) location.hash = '#r/' + sp.slice(2);
          window.addEventListener('hashchange', route);
          route();
        });
    }).catch(function () { clear(root); root.appendChild(h('p', { class: 'boot', text: (S.L && S.L.error) || 'Error' })); });
  }
  boot();
})();
