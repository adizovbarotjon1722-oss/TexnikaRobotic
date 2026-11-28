/* Texnika Servis: sayt skripti.
   innerHTML ishlatilmaydi; dars matni faqat "lesson" Trusted Types siyosati orqali qo'yiladi (server uni xavfsiz markdowndan yaratadi). */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };
  // Bosh ko'rinish videosi: harakatni kamaytirish yoqilgan bo'lsa yoki trafikni tejash rejimida to'xtatiladi
  each(document.querySelectorAll('video.hero-video'), function (v) {
    var save = navigator.connection && navigator.connection.saveData;
    v.muted = true;
    if (reduce || save) { v.removeAttribute('autoplay'); v.pause(); return; }
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  });
  var PREVIEW = false;

  function store(key, val) {
    try {
      if (val === undefined) return window.localStorage.getItem(key);
      if (val === null) window.localStorage.removeItem(key); else window.localStorage.setItem(key, val);
    } catch (e) { return null; }
    return null;
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function svgIcon(name) {
    // Mavjud ikonani sahifadan nusxalash (yangi SVG yozmaslik uchun)
    var src = document.querySelector('[data-icon-src="' + name + '"]');
    return src ? src.cloneNode(true) : null;
  }

  var policy = null;
  if (window.trustedTypes && window.trustedTypes.createPolicy) {
    try { policy = window.trustedTypes.createPolicy('lesson', { createHTML: function (s) { return s; } }); } catch (e) { policy = null; }
  }
  function setLessonHtml(node, html) { node.innerHTML = policy ? policy.createHTML(html) : html; }

  /* Mavzu */
  var savedTheme = store('theme');
  if (savedTheme === 'light' || savedTheme === 'dark') root.setAttribute('data-theme', savedTheme);
  function currentTheme() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var h = document.querySelector('.site-header');
      if (h) h.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    });
  }, { passive: true });

  /* Analitika: cookie yo'q */
  function lang() { var a = document.getElementById('app'); return (a && a.getAttribute('data-lang')) || root.getAttribute('lang') || 'uz'; }
  function beacon(data) {
    if (PREVIEW) return;
    try {
      var body = JSON.stringify(data);
      if (navigator.sendBeacon) navigator.sendBeacon('/api/e', new Blob([body], { type: 'application/json' }));
      else fetch('/api/e', { method: 'POST', body: body, headers: { 'content-type': 'application/json' }, keepalive: true });
    } catch (e) { /* analitika ixtiyoriy */ }
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-ev]');
    if (a) beacon({ t: 'cta', p: location.pathname, l: lang(), m: a.getAttribute('data-ev') });
  });

  var observers = [];
  function observe(els, cb, opts) {
    if (!('IntersectionObserver' in window)) { els.forEach(function (x) { cb(x); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { cb(en.target); io.unobserve(en.target); } });
    }, opts || { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    els.forEach(function (x) { io.observe(x); });
    observers.push(io);
  }

  function api(method, url, body, headers) {
    var h = headers || {};
    if (body !== undefined) h['content-type'] = 'application/json';
    return fetch(url, { method: method, headers: h, body: body !== undefined ? JSON.stringify(body) : undefined, credentials: 'same-origin' })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, data: j }; }); });
  }

  function copyText(text, btn) {
    function done(ok) { if (btn && ok) { btn.classList.add('is-done'); setTimeout(function () { btn.classList.remove('is-done'); }, 1600); } }
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(function () { done(true); return true; }, function () { return false; });
    return Promise.resolve(false);
  }

  function initApp(app) {
    observers.forEach(function (o) { o.disconnect(); });
    observers = [];

    var tbtn = app.querySelector('.theme-toggle');
    if (tbtn) tbtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store('theme', next);
    });

    var burger = app.querySelector('.burger');
    var nav = app.querySelector('#site-nav');
    if (burger && nav) {
      var closeNav = function () { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); };
      burger.addEventListener('click', function () {
        var open = !nav.classList.contains('is-open');
        nav.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', String(open));
      });
      nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeNav(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });
    }

    if (!reduce) {
      var vh = window.innerHeight || 800;
      var pending = Array.prototype.filter.call(app.querySelectorAll('.reveal'), function (x) { return x.getBoundingClientRect().top > vh; });
      pending.forEach(function (x) {
        var sib = x.parentElement ? Array.prototype.indexOf.call(x.parentElement.children, x) : 0;
        x.style.setProperty('--rd', Math.min(sib, 5) * 0.07 + 's');
        x.classList.add('will-reveal');
      });
      observe(pending, function (x) { x.classList.add('is-in'); });
    }

    initMotion(app);

    var nums = Array.prototype.filter.call(app.querySelectorAll('[data-count]'), function (x) { return /^\d+$/.test(x.getAttribute('data-count')); });
    observe(nums, function (x) {
      var end = parseInt(x.getAttribute('data-count'), 10);
      if (reduce || end < 2) { x.textContent = String(end); return; }
      var t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / 1200, 1);
        x.textContent = String(Math.round(end * (1 - Math.pow(1 - p, 3))));
        if (p < 1) window.requestAnimationFrame(step);
      }
      x.textContent = '0';
      window.requestAnimationFrame(step);
    }, { threshold: 0.4 });

    each(app.querySelectorAll('.svc, .plan, .course'), function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });

    each(app.querySelectorAll('[data-copy]'), function (b) { b.addEventListener('click', function () { copyText(b.getAttribute('data-copy'), b); }); });
    each(app.querySelectorAll('.yr'), function (y) { var n = new Date().getFullYear(); if (n > parseInt(y.textContent, 10)) y.textContent = String(n); });

    initLeadForm(app);
    initPhone(app);
    initPrefill(app);
    initErrors(app);
    initDoc(app);
    initTrack(app);
    initCourse(app);
    initAccount(app);
    initVideos(app);
    initAccLink(app);
    initAcList(app);
    initTgBack(app);
    initMega(app);
    initLedTool(app);
    initDowntime(app);
    initWarranty(app);
    initLangSwitch(app);
  }

  /* ---------- Rasm siqish ---------- */
  function compress(file) {
    return new Promise(function (resolve, reject) {
      if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 15 * 1024 * 1024) return reject(new Error('type'));
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var max = 1600, w = img.naturalWidth, h = img.naturalHeight;
        var k = Math.min(1, max / Math.max(w, h));
        var c = document.createElement('canvas');
        c.width = Math.round(w * k); c.height = Math.round(h * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('decode')); };
      img.src = url;
    });
  }

  /* ---------- AI tashxis va ariza formasi ---------- */
  var loadedAt = Date.now();
  function clean(v, max) { return String(v || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F‪-‮⁦-⁩]/g, '').trim().slice(0, max); }

  function initLeadForm(app) {
    var form = app.querySelector('#lead-form');
    if (!form) return;
    var d = form.dataset;
    var status = form.querySelector('#form-status');
    var photos = [];
    var diagId = null;
    var busy = false;
    var thumbs = form.querySelector('#thumbs');
    var input = form.querySelector('#f-photos');
    var drop = form.querySelector('#drop');
    var addBtn = form.querySelector('.add-photo');

    function say(msg, kind) { status.textContent = msg || ''; status.className = 'form-status' + (kind ? ' is-' + kind : ''); }
    function setErr(field, msg) {
      var wrap = field.closest('.field') || field.closest('.consent');
      if (!wrap) return;
      var old = wrap.querySelector('.err'); if (old) old.remove();
      wrap.classList.toggle('has-error', !!msg);
      field.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (msg) { var p = el('span', 'err', msg); p.id = field.id + '-err'; wrap.appendChild(p); field.setAttribute('aria-describedby', p.id); }
      else field.removeAttribute('aria-describedby');
    }
    each(form.querySelectorAll('input, textarea'), function (f) { f.addEventListener('input', function () { if (f.getAttribute('aria-invalid') === 'true') setErr(f, ''); }); });
    form.querySelector('#f-phone').addEventListener('input', function (e) { e.target.value = e.target.value.replace(/[^\d+\-\s()]/g, ''); });

    function renderThumbs() {
      thumbs.replaceChildren();
      photos.forEach(function (src, i) {
        var li = el('li', 'thumb');
        var im = el('img'); im.src = src; im.alt = ''; li.appendChild(im);
        var rm = el('button', 'thumb-x', '×'); rm.type = 'button'; rm.setAttribute('aria-label', input.getAttribute('data-remove') + ' ' + (i + 1));
        rm.addEventListener('click', function () { photos.splice(i, 1); diagId = null; renderThumbs(); });
        li.appendChild(rm);
        thumbs.appendChild(li);
      });
      addBtn.hidden = photos.length >= 4;
    }
    function addFiles(files) {
      var list = Array.prototype.slice.call(files, 0, 4 - photos.length);
      Promise.all(list.map(function (f) { return compress(f).catch(function () { return null; }); })).then(function (res) {
        var bad = res.some(function (x) { return !x; });
        res.forEach(function (x) { if (x) photos.push(x); });
        diagId = null;
        renderThumbs();
        say(bad ? d.errImg : '', bad ? 'err' : '');
      });
    }
    input.addEventListener('change', function () { addFiles(input.files); input.value = ''; });
    ['dragover', 'dragenter'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('is-over'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('is-over'); }); });
    drop.addEventListener('drop', function (e) { if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files); });
    form.addEventListener('paste', function (e) {
      var files = e.clipboardData && e.clipboardData.files;
      if (files && files.length) addFiles(files);
    });

    function values() {
      var f = form.elements;
      return {
        lang: lang(), name: clean(f.name.value, 80), phone: clean(f.phone.value, 20), company: clean(f.company.value, 100),
        service: clean(f.service.value, 120), equipment: clean(f.equipment.value, 120), message: clean(f.message.value, 2000),
        consent: f.consent.checked, website: f.website.value,
        equipment_code: f.equipment_code ? f.equipment_code.value : undefined
      };
    }

    function setBusy(btn, on, label) {
      busy = on;
      each(form.querySelectorAll('.send-row .btn'), function (b) { b.disabled = on; });
      var span = btn.querySelector('span');
      if (on) { btn.setAttribute('data-label', span.textContent); span.textContent = label; btn.classList.add('is-busy'); }
      else { if (btn.getAttribute('data-label')) span.textContent = btn.getAttribute('data-label'); btn.classList.remove('is-busy'); }
    }

    function showAi(r) {
      var box = form.querySelector('#ai-result');
      var pill = form.querySelector('#ai-priority');
      pill.textContent = d['p' + r.priority.charAt(0).toUpperCase() + r.priority.slice(1)] || r.priority;
      pill.className = 'pill pri-' + r.priority;
      form.querySelector('#ai-diag').textContent = r.diagnosis;
      var fill = function (id, arr) { var ul = form.querySelector(id); ul.replaceChildren(); (arr || []).forEach(function (x) { ul.appendChild(el('li', null, x)); }); };
      fill('#ai-causes', r.causes); fill('#ai-steps', r.next_steps);
      var s = form.querySelector('#ai-safety');
      s.hidden = !r.safety; s.querySelector('span').textContent = r.safety || '';
      box.hidden = false;
      box.classList.remove('is-shown'); void box.offsetWidth; box.classList.add('is-shown');
      box.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
    }

    function mockDiag(v) {
      var L = lang();
      var M = {
        uz: { diagnosis: 'Namuna javob (preview): tavsifga ko‘ra, robot yuk ma’lumotlari noto‘g‘ri bo‘lgani sababli harakat nazorati ishga tushgan bo‘lishi mumkin.', causes: ['Yangi asbob uchun yuk (payload) ma’lumotlari yangilanmagan', 'Kichik to‘qnashuv yoki tiqilish', 'Reduktor yoki tormoz nosozligi'], next_steps: ['Xato kodini to‘liq yozib oling va displey rasmini yuboring', 'Oxirgi o‘zgarishlarni (asbob, dastur) eslab qoling', 'Robotni qo‘lda rejimda sekin harakatlantirib, g‘ayritabiiy ovoz bor-yo‘qligini tekshiring'], safety: 'Robot zonasiga faqat qo‘lda rejimda kiring.' },
        ru: { diagnosis: 'Пример ответа (превью): по описанию вероятно срабатывание контроля движения из-за неверных данных нагрузки.', causes: ['Не обновлены данные нагрузки для нового инструмента', 'Лёгкое столкновение или заедание', 'Неисправность редуктора или тормоза'], next_steps: ['Запишите полный код ошибки и пришлите фото дисплея', 'Вспомните последние изменения (инструмент, программа)', 'В ручном режиме медленно проведите робот и прислушайтесь к шумам'], safety: 'Входите в зону робота только в ручном режиме.' },
        en: { diagnosis: 'Sample answer (preview): based on the description, motion supervision most likely tripped because of wrong payload data.', causes: ['Payload data not updated for the new tool', 'Minor collision or jam', 'Gearbox or brake fault'], next_steps: ['Write down the full fault code and send a photo of the display', 'Note the latest changes (tool, program)', 'Jog the robot slowly in manual mode and listen for unusual noise'], safety: 'Enter the cell only in manual mode.' }
      }[L] || {};
      M.priority = /stop|to‘xta|стоит|встал|avariya/i.test(v.message) ? 'critical' : 'high';
      return new Promise(function (r) { setTimeout(function () { r({ status: 200, data: Object.assign({ diag_id: 'demo' }, M) }); }, 1400); });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (busy) return;
      var action = (e.submitter && e.submitter.getAttribute('data-action')) || 'send';
      var btn = form.querySelector('[data-action="' + action + '"]');
      var v = values();
      var f = form.elements;
      if (v.website) return;
      var ok = true, first = null;
      function check(field, valid, msg) { setErr(field, valid ? '' : msg); if (!valid) { ok = false; if (!first) first = field; } }
      check(f.message, v.message.length >= 10, d.errMsg);
      if (action === 'send') {
        var digits = v.phone.replace(/\D/g, '');
        check(f.name, v.name.length >= 2, d.errName);
        check(f.phone, digits.length >= 9 && digits.length <= 15, d.errPhone);
        check(f.consent, v.consent, d.errConsent);
      }
      if (!ok) { say(''); first.focus(); return; }
      if (Date.now() - loadedAt < 2000) { say(d.errRate, 'err'); return; }

      if (action === 'ai') {
        setBusy(btn, true, d.analyzing);
        say(d.analyzing);
        var req = PREVIEW ? mockDiag(v) : api('POST', '/api/diagnose', { lang: v.lang, equipment: v.equipment, message: v.message, images: photos });
        req.then(function (r) {
          setBusy(btn, false);
          if (r.status === 200) { diagId = r.data.diag_id; say(''); showAi(r.data); beacon({ t: 'cta', p: location.pathname, l: lang(), m: 'ai_ok' }); }
          else if (r.status === 503) say(d.errOff, 'err');
          else if (r.status === 429) say(d.errAiRate, 'err');
          else if (r.status === 400 && r.data.error === 'bad_image') say(d.errImg, 'err');
          else say(d.errFail, 'err');
        }).catch(function () { setBusy(btn, false); say(d.errFail, 'err'); });
        return;
      }

      setBusy(btn, true, d.sending);
      var payload = Object.assign({}, v, { images: photos, diag_id: diagId });
      var send = PREVIEW ? new Promise(function (r) { setTimeout(function () { r({ status: 201, data: { code: 'TX-DEMO-0001', track: '#', contact: { phone: app.getAttribute('data-pv-ph') || '', whatsapp: app.getAttribute('data-pv-wa') || '' } } }); }, 900); }) : api('POST', '/api/requests', payload);
      send.then(function (r) {
        setBusy(btn, false);
        if (r.status === 201 || r.status === 200) {
          say('');
          var panel = form.querySelector('#ok-panel');
          form.querySelector('#ok-code').textContent = r.data.code;
          form.querySelector('#ok-track').setAttribute('href', r.data.track || '#');
          var cb = form.querySelector('#ok-copy');
          cb.onclick = function () { copyText(r.data.code, cb); };
          form.classList.add('is-sent');
          panel.hidden = false;
          panel.focus && panel.setAttribute('tabindex', '-1');
          panel.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
          store('last_code', r.data.code);
          if (r.data.contact && r.data.contact.phone) { store('contact', JSON.stringify(r.data.contact)); revealPhone(app, r.data.contact); }
          form.reset(); photos = []; renderThumbs(); diagId = null;
          form.querySelector('#ai-result').hidden = true;
        } else if (r.status === 429) say(d.errRate, 'err');
        else if (r.status === 400 && r.data.error === 'bad_image') say(d.errImg, 'err');
        else say(d.errFail, 'err');
      }).catch(function () { setBusy(btn, false); say(d.errFail, 'err'); });
    });
    renderThumbs();
  }

  /* ---------- Harakat: CAD kursori, o'qish chizig'i, jarayon chizig'i, magnit tugmalar ---------- */
  function initMotion(app) {
    each(app.querySelectorAll('.steps'), function (steps) {
      each(steps.children, function (li, i) { li.style.setProperty('--i', i); });
      if (reduce) steps.style.setProperty('--steps', 1);
      else observe([steps], function () { steps.style.setProperty('--steps', 1); }, { threshold: 0.3 });
    });
    var prog = app.querySelector('.scroll-prog');
    if (prog && !(window.CSS && CSS.supports && CSS.supports('animation-timeline', 'scroll()'))) {
      var tick = false;
      window.addEventListener('scroll', function () {
        if (tick) return; tick = true;
        window.requestAnimationFrame(function () {
          var h = document.documentElement.scrollHeight - window.innerHeight;
          prog.style.setProperty('--sp', h > 0 ? Math.min(1, window.scrollY / h).toFixed(4) : 0);
          tick = false;
        });
      }, { passive: true });
    }
    if (reduce || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var hero = app.querySelector('.hero');
    var cad = hero && hero.querySelector('.cad');
    if (cad) {
      var xy = cad.querySelector('.cad-xy');
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        hero.style.setProperty('--cx', x + 'px'); hero.style.setProperty('--cy', y + 'px');
        cad.style.setProperty('--cx', x + 'px'); cad.style.setProperty('--cy', y + 'px');
        xy.textContent = 'X ' + String(Math.round(x * 2.5)).padStart(4, '0') + '  Y ' + String(Math.round(y * 2.5)).padStart(4, '0');
        hero.classList.add('cad-on');
      });
      hero.addEventListener('pointerleave', function () { hero.classList.remove('cad-on'); });
    }
    each(app.querySelectorAll('.btn-primary.btn-lg'), function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.translate = ((e.clientX - r.left - r.width / 2) * 0.12).toFixed(1) + 'px ' + ((e.clientY - r.top - r.height / 2) * 0.2).toFixed(1) + 'px';
      });
      b.addEventListener('pointerleave', function () { b.style.translate = ''; });
    });
  }

  /* ---------- Telefon raqami: ariza yuborilgandan keyin ochiladi ---------- */
  function revealPhone(scope, c) {
    var tel = 'tel:' + String(c.phone).replace(/[^\d+]/g, '');
    each(scope.querySelectorAll('[data-ph]'), function (a) {
      a.setAttribute('href', tel); a.classList.add('is-open'); a.removeAttribute('title');
      var n = a.querySelector('.ph-num'); if (n) n.textContent = c.phone;
      var k = a.querySelector('.ph-key'); if (k) k.remove();
    });
    each(scope.querySelectorAll('[data-ph-btn]'), function (b) { b.setAttribute('href', tel); var sp = b.querySelector('span'); if (sp) sp.textContent = b.getAttribute('data-call'); });
    each(scope.querySelectorAll('[data-ph-lead]'), function (p) { p.textContent = p.getAttribute('data-ph-lead'); });
    if (c.whatsapp) each(scope.querySelectorAll('[data-wa-btn]'), function (w) { w.setAttribute('href', 'https://wa.me/' + String(c.whatsapp).replace(/\D/g, '')); w.hidden = false; });
  }
  function initPhone(app) {
    var saved = null;
    try { saved = JSON.parse(store('contact') || 'null'); } catch (e) { saved = null; }
    if (saved && saved.phone) { revealPhone(app, saved); return; }
    // Yopiq raqam bosilganda: formaga o'tib, birinchi maydonga fokus
    each(app.querySelectorAll('[data-ph]:not(.is-open), [data-ph-btn]'), function (a) {
      a.addEventListener('click', function () {
        if (a.classList.contains('is-open') || /^tel:/.test(a.getAttribute('href'))) return;
        var f = app.querySelector('#lead-form');
        if (f && (a.getAttribute('href') || '').charAt(0) === '#') setTimeout(function () { var n = f.querySelector('#f-name'); if (n) n.focus({ preventScroll: true }); }, 450);
      });
    });
  }

  /* ---------- Xato kodi sahifasidan formani to'ldirish (?eq=...&code=...) ---------- */
  function initPrefill(app) {
    var form = app.querySelector('#lead-form');
    if (!form || !location.search) return;
    var q = new URLSearchParams(location.search);
    var eq = clean(q.get('eq'), 120), code = clean(q.get('code'), 60);
    if (eq && !form.elements.equipment.value) form.elements.equipment.value = eq;
    if (code && !form.elements.message.value) form.elements.message.value = code + ': ';
  }

  /* ---------- Xato kodlari: sahifani qayta yuklamasdan filtr ---------- */
  function initErrors(app) {
    var f = app.querySelector('#err-filter');
    var groups = app.querySelector('#err-groups');
    if (!f || !groups) return;
    var inp = f.querySelector('#err-q');
    var none = app.querySelector('#err-none');
    function run() {
      var s = inp.value.trim().toLowerCase();
      var any = false;
      each(groups.querySelectorAll('.err-group'), function (g) {
        var n = 0;
        each(g.querySelectorAll('li[data-s]'), function (li) { var ok = !s || li.getAttribute('data-s').indexOf(s) !== -1; li.hidden = !ok; if (ok) n++; });
        g.hidden = !n; if (n) any = true;
      });
      if (none) none.hidden = any;
    }
    inp.addEventListener('input', run);
    f.addEventListener('submit', function (e) { e.preventDefault(); run(); });
  }

  /* ---------- Hujjat: chop etish va taklifni qabul qilish ---------- */
  function initDoc(app) {
    each(app.querySelectorAll('[data-print]'), function (b) { b.addEventListener('click', function () { window.print(); }); });
    var acc = app.querySelector('#doc-accept');
    if (acc) acc.addEventListener('click', function () {
      acc.disabled = true;
      api('POST', '/api/doc/' + encodeURIComponent(acc.getAttribute('data-token')) + '/accept', {}).then(function (r) {
        if (r.status !== 200) { acc.disabled = false; return; }
        var p = el('p', 'doc-ok', acc.getAttribute('data-ok'));
        acc.replaceWith(p);
      }).catch(function () { acc.disabled = false; });
    });
  }

  /* ---------- Ariza holati ---------- */
  function fmtDate(iso) {
    try { return new Date(iso).toLocaleString(lang() === 'en' ? 'en-GB' : lang() === 'ru' ? 'ru-RU' : 'uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (e) { return iso.slice(0, 16).replace('T', ' '); }
  }
  function fmtDay(iso) {
    try { return new Date(String(iso).slice(0, 10) + 'T12:00:00Z').toLocaleDateString(lang() === 'en' ? 'en-GB' : lang() === 'ru' ? 'ru-RU' : 'uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' }); } catch (e) { return String(iso).slice(0, 10); }
  }
  function initTrack(app) {
    var form = app.querySelector('#track-form');
    if (!form) return;
    var d = form.dataset;
    var inp = form.querySelector('#t-code');
    var st = form.querySelector('#track-status');
    var res = app.querySelector('#track-res');
    var sLabel = function (s) { return d['s' + s.split('_').map(function (x) { return x.charAt(0).toUpperCase() + x.slice(1); }).join('')] || s; };
    var pLabel = function (p) { return d['p' + p.charAt(0).toUpperCase() + p.slice(1)] || p; };

    inp.addEventListener('input', function () {
      var v = inp.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (v.indexOf('TX') === 0) v = v.slice(2);
      v = v.slice(0, 8);
      inp.value = 'TX-' + v.slice(0, 4) + (v.length > 4 ? '-' + v.slice(4) : '');
      if (!v) inp.value = '';
    });

    function lookup(code) {
      st.textContent = d.loading; st.className = 'form-status';
      api('GET', '/api/track/' + encodeURIComponent(code)).then(function (r) {
        if (r.status !== 200) { res.hidden = true; st.textContent = r.status === 429 ? d.errRate : d.notFound; st.className = 'form-status is-err'; return; }
        st.textContent = '';
        var x = r.data;
        app.querySelector('#tr-code').textContent = x.code;
        var pill = app.querySelector('#tr-status');
        pill.textContent = sLabel(x.status); pill.className = 'pill st-' + x.status;
        var order = ['new', 'diagnosing', 'scheduled', 'in_progress', 'done'];
        var idx = order.indexOf(x.status === 'waiting_parts' ? 'in_progress' : x.status);
        each(app.querySelectorAll('#tr-bar li'), function (li, i) {
          li.classList.toggle('is-done', idx >= 0 && i < idx);
          li.classList.toggle('is-current', i === idx);
          li.classList.toggle('is-cancel', x.status === 'cancelled');
        });
        var facts = app.querySelector('#tr-facts'); facts.replaceChildren();
        [[d.lCreated, fmtDate(x.created_at)], [d.lUpdated, fmtDate(x.updated_at)], [d.lEquipment, x.equipment], [d.lService, x.service], [d.lPriority, pLabel(x.priority)], [d.lW, x.warranty ? (x.warranty.status === 'active' ? d.wOn.replace('{date}', x.warranty.until) : d.wOff) : '']].forEach(function (p) {
          if (!p[1]) return;
          var w = el('div'); w.appendChild(el('dt', null, p[0])); w.appendChild(el('dd', null, p[1])); facts.appendChild(w);
        });
        var tl = app.querySelector('#tr-timeline'); tl.replaceChildren();
        x.updates.slice().reverse().forEach(function (u) {
          var li = el('li', 'st-' + u.status);
          li.appendChild(el('time', null, fmtDate(u.created_at)));
          li.appendChild(el('strong', null, sLabel(u.status)));
          if (u.note) li.appendChild(el('p', null, u.note));
          tl.appendChild(li);
        });
        var rf = app.querySelector('#rate-form');
        if (rf) { rf.hidden = !x.canRate; rf.setAttribute('data-code', x.code); }
        res.hidden = false;
        try { history.replaceState(null, '', '#' + x.code); } catch (e) { /* ixtiyoriy */ }
      }).catch(function () { st.textContent = d.notFound; st.className = 'form-status is-err'; });
    }
    var rf = app.querySelector('#rate-form');
    if (rf) rf.addEventListener('submit', function (e) {
      e.preventDefault();
      var c = rf.querySelector('input[name="rating"]:checked');
      var rs = rf.querySelector('#rate-status');
      if (!c) { rf.querySelector('.rate-stars').classList.remove('shake'); void rf.offsetWidth; rf.querySelector('.rate-stars').classList.add('shake'); return; }
      api('POST', '/api/review', { code: rf.getAttribute('data-code'), rating: parseInt(c.value, 10), text: clean(rf.querySelector('#rt-text').value, 600), name: clean(rf.querySelector('#rt-name').value, 80) }).then(function (r) {
        if (r.status === 201 || r.status === 409) { var p = el('p', 'rate-ok', r.status === 201 ? rf.dataset.thanks : rf.dataset.done); rf.replaceChildren(p); return; }
        rs.textContent = '…'; rs.className = 'form-status is-err';
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var code = inp.value.trim().toUpperCase();
      if (!/^TX-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) { st.textContent = d.notFound; st.className = 'form-status is-err'; inp.focus(); return; }
      lookup(code);
    });
    var h = (location.hash || '').slice(1).toUpperCase();
    var last = store('last_code');
    if (/^TX-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(h)) { inp.value = h; lookup(h); }
    else if (last && /^TX-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(last)) inp.value = last;
  }

  /* ---------- Akademiya: kurs ---------- */
  function fmt(s, v) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return k in v ? v[k] : m; }); }
  function mmss(sec) { sec = Math.max(0, sec | 0); var m = Math.floor(sec / 60), s = sec % 60; return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s; }

  function signedIn() { return /(?:^|;\s*)tx_in=1/.test(document.cookie); }
  // Dars videosi: o'z serverimizdagi fayl yoki YouTube/Vimeo
  function videoBox(v, title) {
    var w = el('div', 'lesson-video');
    var m;
    if (v.type === 'file') {
      m = el('video'); m.controls = true; m.preload = 'metadata'; m.playsInline = true;
      m.setAttribute('controlslist', 'nodownload');
      var s = el('source'); s.src = v.src; s.type = v.mime; m.appendChild(s);
    } else {
      m = el('iframe'); m.src = v.src; m.title = title || ''; m.loading = 'lazy';
      m.setAttribute('allow', 'fullscreen; picture-in-picture; encrypted-media'); m.setAttribute('allowfullscreen', '');
      m.referrerPolicy = 'strict-origin-when-cross-origin';
    }
    w.appendChild(m);
    return w;
  }

  function initCourse(app) {
    var box = app.querySelector('#course');
    if (!box) return;
    var d = box.dataset;
    var slug = d.slug;
    var TOKEN_KEY = 'ac_token';
    var join = box.querySelector('#join-form');
    var joinLogin = box.querySelector('#join-login');
    var lessonEl = box.querySelector('#lesson');
    var syl = box.querySelector('#syl-list');
    var state = null;
    var current = null;
    var timer = null;

    function auth() { var t = store(TOKEN_KEY); return t ? { authorization: 'Bearer ' + t } : null; }
    function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }

    // Saytda o'qish kabinet orqali: kirmagan bo'lsa kirish taklifi, kod kiritilmagan bo'lsa kod formasi
    function needLogin() { join.hidden = true; if (joinLogin) joinLogin.hidden = false; lessonEl.hidden = true; }
    function needCode() { if (joinLogin) joinLogin.hidden = true; join.hidden = false; lessonEl.hidden = true; }
    function load() {
      var h = auth();
      if (!h) {
        if (!signedIn()) return needLogin();
        api('GET', '/api/academy/session').then(function (r) {
          if (r.status === 200 && r.data.token) { store(TOKEN_KEY, r.data.token); return load(); }
          if (r.status === 200 && r.data.need_code) return needCode();
          needLogin();
        }, needLogin);
        return;
      }
      api('GET', '/api/academy/' + slug + '?lang=' + d.lang, undefined, h).then(function (r) {
        if (r.status === 401) { store(TOKEN_KEY, null); return load(); }
        join.hidden = true;
        if (joinLogin) joinLogin.hidden = true;
        box.querySelector('#ac-logout').hidden = false;
        if (r.status === 403 && r.data && r.data.requires) return renderLocked(r.data.requires);
        if (r.status !== 200) return;
        state = r.data;
        box.querySelector('#prog').hidden = false;
        each(syl.querySelectorAll('button'), function (b) { b.disabled = false; });
        renderProgress();
        var firstOpen = state.lessons.filter(function (l) { return state.done.indexOf(l.id) < 0; })[0];
        show(firstOpen ? firstOpen.id : 'quiz');
      });
    }
    function renderLocked(rq) {
      lessonEl.replaceChildren();
      lessonEl.hidden = false;
      var w = el('div', 'locked');
      w.appendChild(el('p', 'eyebrow', d.locked));
      w.appendChild(el('h2', null, rq.title));
      var a = el('a', 'btn btn-primary', d.start); a.href = d.academy + rq.slug + '/';
      w.appendChild(a);
      lessonEl.appendChild(w);
    }
    function passed() { return !!(state.best && !state.best.expired); }
    function renderProgress() {
      var total = state.lessons.length + 1;
      var n = state.done.length + (passed() ? 1 : 0);
      var pct = Math.round(n / total * 100);
      box.querySelector('#prog-fill').style.width = pct + '%';
      box.querySelector('#prog-pct').textContent = pct + '%';
      each(syl.querySelectorAll('li'), function (li) {
        var id = li.getAttribute('data-lesson');
        var done = id === 'quiz' ? passed() : state.done.indexOf(parseInt(id, 10)) >= 0;
        li.classList.toggle('is-done', done);
        li.classList.toggle('is-current', String(current) === id);
      });
    }
    function navBtn(label, cls, onClick) { var b = el('button', 'btn btn-sm ' + cls, label); b.type = 'button'; b.addEventListener('click', onClick); return b; }
    function radios(name, options) {
      var frag = document.createDocumentFragment();
      options.forEach(function (o, oi) {
        var lab = el('label', 'opt');
        var r = el('input'); r.type = 'radio'; r.name = name; r.value = String(oi); r.id = name + '-' + oi;
        lab.htmlFor = r.id;
        lab.appendChild(r); lab.appendChild(el('span', null, o));
        frag.appendChild(lab);
      });
      return frag;
    }

    function show(id) {
      stopTimer();
      current = id;
      lessonEl.replaceChildren();
      lessonEl.hidden = false;
      if (id === 'quiz') renderQuizIntro();
      else {
        var i = -1;
        state.lessons.forEach(function (l, k) { if (l.id === id) i = k; });
        var l = state.lessons[i];
        if (!l) return;
        lessonEl.appendChild(el('p', 'eyebrow', (i + 1) + ' / ' + state.lessons.length));
        lessonEl.appendChild(el('h2', null, l.title));
        if (l.video) lessonEl.appendChild(videoBox(l.video, l.title));
        var body = el('div', 'lesson-body'); setLessonHtml(body, l.html); lessonEl.appendChild(body);
        var isDone = state.done.indexOf(l.id) >= 0;
        var chk = null, msg = null;
        if (l.check && !isDone) {
          chk = el('fieldset', 'q checkpoint');
          chk.appendChild(el('legend', null, d.check));
          chk.appendChild(el('p', 'cp-q', l.check.q));
          chk.appendChild(radios('cp' + l.id, l.check.options));
          msg = el('p', 'form-status'); msg.setAttribute('role', 'status');
          chk.appendChild(msg);
          lessonEl.appendChild(chk);
        }
        var bar = el('div', 'lesson-nav');
        if (i > 0) bar.appendChild(navBtn(d.prev, 'btn-ghost', function () { show(state.lessons[i - 1].id); }));
        var goNext = function () { show(i + 1 < state.lessons.length ? state.lessons[i + 1].id : 'quiz'); };
        var doneBtn = navBtn(isDone ? d.done : d.markDone, isDone ? 'btn-ghost is-done' : 'btn-primary', function () {
          if (isDone) return goNext();
          var body2 = { lesson: l.id };
          if (chk) {
            var c = chk.querySelector('input:checked');
            if (!c) { msg.textContent = d.checkLead; msg.className = 'form-status is-err'; return; }
            body2.answer = parseInt(c.value, 10);
          }
          doneBtn.disabled = true;
          api('POST', '/api/academy/' + slug + '/done', body2, auth()).then(function (r) {
            doneBtn.disabled = false;
            if (r.status === 400 && r.data && r.data.error === 'wrong') {
              msg.textContent = d.checkWrong; msg.className = 'form-status is-err';
              chk.classList.remove('shake'); void chk.offsetWidth; chk.classList.add('shake');
              return;
            }
            if (r.status !== 200) return;
            if (state.done.indexOf(l.id) < 0) state.done.push(l.id);
            renderProgress();
            goNext();
          });
        });
        bar.appendChild(doneBtn);
        if (i + 1 < state.lessons.length) bar.appendChild(navBtn(d.next, 'btn-ghost', function () { show(state.lessons[i + 1].id); }));
        else bar.appendChild(navBtn(d.quiz, 'btn-ghost', function () { show('quiz'); }));
        lessonEl.appendChild(bar);
      }
      renderProgress();
      lessonEl.focus({ preventScroll: true });
      if (window.innerWidth < 900) lessonEl.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }

    function certBlock(score, certId, validUntil) {
      var w = el('div', 'quiz-res is-pass');
      w.appendChild(el('p', null, d.passed + ' ' + d.score + ': ' + score + '%'));
      if (validUntil) w.appendChild(el('p', 'small', d.validUntil + ': ' + validUntil));
      var a = el('a', 'btn btn-primary', d.certOpen); a.href = d.certBase + certId + '/';
      w.appendChild(a);
      return w;
    }
    function quizHead() {
      lessonEl.appendChild(el('p', 'eyebrow', d.quiz));
      lessonEl.appendChild(el('h2', null, d.quiz));
    }
    function renderQuizIntro() {
      quizHead();
      var q = state.quiz;
      lessonEl.appendChild(el('p', 'quiz-lead', d.quizLead.replace(/\d+%/, q.pass + '%')));
      if (passed()) lessonEl.appendChild(certBlock(state.best.score, state.best.cert_id, state.best.valid_until));
      lessonEl.appendChild(el('p', 'quiz-info', fmt(d.quizInfo, { n: q.size, min: q.minutes, left: q.left })));
      var msg = el('p', 'form-status'); msg.setAttribute('role', 'status');
      var allDone = state.lessons.every(function (l) { return state.done.indexOf(l.id) >= 0; });
      var sb = navBtn(d.start, 'btn-primary btn-start', function () {
        sb.disabled = true;
        api('POST', '/api/academy/' + slug + '/quiz/start?lang=' + d.lang, {}, auth()).then(function (r) {
          sb.disabled = false;
          if (r.status === 429) { msg.textContent = d.noAttempts; msg.className = 'form-status is-err'; return; }
          if (r.status === 400 && r.data && r.data.error === 'lessons') { msg.textContent = d.lessonsFirst; msg.className = 'form-status is-err'; return; }
          if (r.status !== 200 && r.status !== 201) { msg.textContent = d.failed; msg.className = 'form-status is-err'; return; }
          state.quiz.left = r.data.left;
          renderQuiz(r.data);
        });
      });
      if (!allDone) { msg.textContent = d.lessonsFirst; sb.disabled = true; }
      if (q.left <= 0) { msg.textContent = d.noAttempts; sb.disabled = true; }
      lessonEl.appendChild(sb);
      lessonEl.appendChild(msg);
    }
    function renderQuiz(att) {
      lessonEl.replaceChildren();
      quizHead();
      var clock = el('div', 'quiz-clock');
      clock.appendChild(el('span', null, d.timeLeft));
      var tv = el('b', null, mmss(att.seconds)); clock.appendChild(tv);
      lessonEl.appendChild(clock);
      var f = el('form', 'quiz'); f.noValidate = true;
      att.questions.forEach(function (q) {
        var fs = el('fieldset', 'q');
        fs.appendChild(el('legend', null, q.n + '. ' + q.q));
        fs.appendChild(radios('q' + q.n, q.options));
        f.appendChild(fs);
      });
      var msg = el('p', 'form-status'); msg.setAttribute('role', 'status');
      var sb = el('button', 'btn btn-primary', d.submit); sb.type = 'submit';
      f.appendChild(sb); f.appendChild(msg);
      var end = Date.now() + att.seconds * 1000;
      var sent = false;
      function submit(force) {
        if (sent) return;
        var answers = {}; var all = true;
        att.questions.forEach(function (q) { var c = f.querySelector('input[name="q' + q.n + '"]:checked'); if (c) answers[q.n] = parseInt(c.value, 10); else all = false; });
        if (!all && !force) { msg.textContent = d.answerAll; msg.className = 'form-status is-err'; return; }
        sent = true; sb.disabled = true; stopTimer();
        api('POST', '/api/academy/' + slug + '/quiz', { attempt: att.attempt, answers: answers }, auth()).then(function (r) {
          if (r.status !== 200) { sent = false; sb.disabled = false; msg.textContent = d.failed; msg.className = 'form-status is-err'; return; }
          showResult(r.data, force);
        });
      }
      function tick() {
        var left = Math.round((end - Date.now()) / 1000);
        tv.textContent = mmss(left);
        clock.classList.toggle('is-low', left <= 60);
        if (left <= 0) submit(true);
      }
      timer = setInterval(tick, 1000);
      f.addEventListener('submit', function (e) { e.preventDefault(); submit(false); });
      lessonEl.appendChild(f);
    }
    function showResult(x, timeUp) {
      lessonEl.replaceChildren();
      quizHead();
      if (timeUp) lessonEl.appendChild(el('p', 'quiz-info', d.timeUp));
      if (x.passed) {
        state.best = { score: x.score, cert_id: x.cert_id, valid_until: x.valid_until, expired: false };
        lessonEl.appendChild(certBlock(x.score, x.cert_id, x.valid_until));
      } else {
        var w = el('div', 'quiz-res is-fail');
        w.appendChild(el('p', null, d.failed + ' ' + d.score + ': ' + x.score + '%'));
        lessonEl.appendChild(w);
      }
      if (x.wrong && x.wrong.length) lessonEl.appendChild(el('p', 'quiz-wrong', fmt(d.wrongList, { list: x.wrong.join(', ') })));
      state.quiz.left = x.left;
      if (!x.passed) lessonEl.appendChild(navBtn(d.retry, 'btn-ghost', function () { show('quiz'); }));
      renderProgress();
    }

    syl.addEventListener('click', function (e) {
      var li = e.target.closest('li[data-lesson]');
      if (!li || !state) return;
      var id = li.getAttribute('data-lesson');
      show(id === 'quiz' ? 'quiz' : parseInt(id, 10));
    });
    join.addEventListener('submit', function (e) {
      e.preventDefault();
      var st = join.querySelector('#join-status');
      var code = clean(join.querySelector('#j-code').value, 24).toUpperCase();
      if (!code) { st.textContent = d.badCode; st.className = 'form-status is-err'; return; }
      api('POST', '/api/academy/join', { code: code }).then(function (r) {
        if (r.status === 201 || r.status === 200) { store(TOKEN_KEY, r.data.token); st.textContent = ''; load(); }
        else if (r.status === 401) needLogin();
        else { st.textContent = d.badCode; st.className = 'form-status is-err'; }
      });
    });
    box.querySelector('#ac-logout').addEventListener('click', function () { store(TOKEN_KEY, null); location.reload(); });
    load();
  }

  /* ---------- Akademiya: ro'yxat (Mening kurslarim) ---------- */
  function initAcList(app) {
    var box = app.querySelector('#ac-list');
    var t = store('ac_token');
    if (!box || !t) return;
    var d = box.dataset;
    api('GET', '/api/academy/me?lang=' + d.lang, undefined, { authorization: 'Bearer ' + t }).then(function (r) {
      if (r.status !== 200) return;
      var mine = box.querySelector('#my-list');
      var started = r.data.courses.filter(function (c) { return c.done > 0 || c.passed || c.expired; });
      r.data.courses.forEach(function (c) {
        var card = box.querySelector('[data-course="' + c.slug + '"]');
        if (!card) return;
        var m = card.querySelector('.course-mine');
        if (c.done > 0 || c.passed) { m.hidden = false; m.querySelector('progress').value = c.pct; m.querySelector('b').textContent = c.passed ? d.passed : c.pct + '%'; }
        card.classList.toggle('is-passed', c.passed);
        card.classList.toggle('is-locked', !!c.locked);
        if (!c.locked) { var rq = card.querySelector('.course-req'); if (rq) rq.hidden = true; }
      });
      if (!started.length) return;
      started.forEach(function (c) {
        var li = el('li', c.passed ? 'is-passed' : (c.expired ? 'is-exp' : ''));
        var a = el('a'); a.href = box.querySelector('[data-course="' + c.slug + '"] a').getAttribute('href');
        a.appendChild(el('strong', null, c.title));
        var pr = el('progress'); pr.max = 100; pr.value = c.pct; a.appendChild(pr);
        a.appendChild(el('span', null, c.passed ? d.passed : (c.expired ? d.expired : d.continue + ' · ' + c.pct + '%')));
        li.appendChild(a); mine.appendChild(li);
      });
      box.querySelector('#my-courses').hidden = false;
    });
  }

  /* ---------- Telegram ichida ochilgan bo'lsa: ilovaga qaytish ---------- */
  function initTgBack(app) {
    try { if (/[?&]tg=1\b/.test(location.search)) sessionStorage.setItem('tg_back', '1'); } catch (e) {}
    var on = false; try { on = sessionStorage.getItem('tg_back') === '1'; } catch (e) {}
    var a = document.getElementById('tg-back');
    if (a && on) a.hidden = false;
  }

  /* ---------- Preview: tillar <template> orqali ---------- */
  function swapTo(app, l) {
    var tpl = document.getElementById('tpl-' + l);
    if (!tpl) return false;
    app.replaceChildren(tpl.content.cloneNode(true));
    app.setAttribute('data-lang', l);
    root.setAttribute('lang', l);
    if (tpl.dataset.title) document.title = tpl.dataset.title;
    return true;
  }
  /* ---------- Bo'limlar menyusi: tashqariga bosilganda, Esc yoki havola bosilganda yopiladi ---------- */
  var megaBound = false;
  function initMega(app) {
    if (megaBound) return;
    megaBound = true;
    function close(except) { each(document.querySelectorAll('details.mega[open]'), function (d) { if (d !== except) d.removeAttribute('open'); }); }
    document.addEventListener('click', function (e) {
      var d = e.target.closest && e.target.closest('details.mega');
      if (!d) return close();
      if (e.target.closest('.mega-panel a')) d.removeAttribute('open');
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ---------- 5-bosqich: PLC chiroqlari, to'xtash narxi, kafolat ---------- */
  function ledRule(s) {
    if (s.power === 'off') return 'psu';
    if (s.bus !== 'off') return 'bus';
    if (s.err === 'blink') return 'flash';
    if (s.err === 'on') return s.run === 'on' ? 'module' : 'stop';
    if (s.run === 'blink') return 'start';
    if (s.maint !== 'off') return 'batt';
    if (s.run === 'off') return 'manual';
    return 'ok';
  }
  function initLedTool(app) {
    var form = app.querySelector('#led-tool');
    var data = app.querySelector('#led-data');
    if (!form || !data) return;
    var R = {};
    try { R = JSON.parse(data.textContent); } catch (e) { return; }
    var keys = ['power', 'run', 'err', 'bus', 'maint'];
    function update() {
      var s = {};
      keys.forEach(function (k) {
        var c = form.querySelector('input[name="lt-' + k + '"]:checked');
        s[k] = c ? c.value : 'off';
        var led = form.querySelector('#lt-' + k);
        if (led) led.setAttribute('class', led.getAttribute('class').replace(/\bst-\w+/, '').trim() + ' st-' + s[k]);
      });
      var r = R[ledRule(s)];
      if (!r) return;
      var box = form.querySelector('.lt-res');
      form.querySelector('#lt-t').textContent = r.t;
      form.querySelector('#lt-x').textContent = r.x;
      var ol = form.querySelector('#lt-s'); ol.replaceChildren();
      r.s.forEach(function (x) { ol.appendChild(el('li', null, x)); });
      box.classList.remove('is-new'); void box.offsetWidth; box.classList.add('is-new');
    }
    form.addEventListener('change', update);
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    update();
  }

  function initDowntime(app) {
    var form = app.querySelector('#dt-form');
    if (!form) return;
    var loc = { uz: 'ru-RU', ru: 'ru-RU', en: 'en-US' }[form.getAttribute('data-lang')] || 'ru-RU';
    var cur = form.getAttribute('data-cur') || '';
    var nf;
    try { nf = new Intl.NumberFormat(loc, { maximumFractionDigits: 0 }); } catch (e) { nf = { format: function (n) { return String(Math.round(n)); } }; }
    var v = function (id) { var x = parseFloat(form.querySelector('#' + id).value); return isFinite(x) && x > 0 ? x : 0; };
    var put = function (id, n) { form.querySelector('#' + id).textContent = nf.format(n) + ' ' + cur; };
    function calc() {
      var ev = v('dt-h') * v('dt-n');
      var mo = ev * v('dt-m');
      put('dt-e', ev); put('dt-mo', mo); put('dt-y', mo * 12); put('dt-half', mo * 6);
    }
    form.addEventListener('input', calc);
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    calc();
  }

  function initWarranty(app) {
    var form = app.querySelector('#w-form');
    if (!form) return;
    var d = form.dataset;
    var inp = form.querySelector('#w-code');
    var out = form.querySelector('#w-res');
    inp.addEventListener('input', function () {
      var v = inp.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (v.indexOf('TX') === 0) v = v.slice(2);
      v = v.slice(0, 8);
      inp.value = v ? 'TX-' + v.slice(0, 4) + (v.length > 4 ? '-' + v.slice(4) : '') : '';
    });
    function show(cls, title, rows, claim) {
      out.replaceChildren();
      out.className = 'w-res ' + cls;
      out.appendChild(el('p', 'w-st', title));
      if (rows.length) {
        var dl = el('dl');
        rows.forEach(function (r) { var w = el('div'); w.appendChild(el('dt', null, r[0])); w.appendChild(el('dd', null, r[1])); dl.appendChild(w); });
        out.appendChild(dl);
      }
      if (claim) { var a = el('a', 'btn btn-ghost btn-sm', d.claim); a.href = d.claimHref; out.appendChild(a); }
      out.hidden = false;
    }
    function render(st, x) {
      if (st === 429) return show('is-err', d.errRate, []);
      if (st !== 200) return show('is-err', d.notFound, []);
      if (x.status === 'not_done') return show('is-wait', d.notDone, []);
      var rows = [[d.since, fmtDay(x.done_at)], [d.until, fmtDay(x.until)]];
      if (x.status === 'active') { rows.push(['', d.left.replace('{n}', x.days)]); return show('is-ok', d.active, rows, true); }
      show('is-exp', d.expired, rows);
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var code = inp.value.trim().toUpperCase();
      if (!/^TX-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) { inp.focus(); inp.classList.remove('shake'); void inp.offsetWidth; inp.classList.add('shake'); return; }
      if (PREVIEW) {
        var t0 = new Date(Date.now() - 41 * 864e5), t1 = new Date(t0); t1.setMonth(t1.getMonth() + 6);
        return render(200, { status: 'active', done_at: t0.toISOString(), until: t1.toISOString(), days: Math.round((t1 - Date.now()) / 864e5) });
      }
      api('GET', '/api/warranty/' + encodeURIComponent(code)).then(function (r) { render(r.status, r.data); }, function () { render(0); });
    });
  }

  /* ---------- Shaxsiy kabinet ---------- */
  function initAccLink(app) {
    var adm = app.querySelector('.hdr-adm');
    if (adm && /(?:^|;\s*)tx_adm=1/.test(document.cookie)) adm.hidden = false;
    var a = app.querySelector('.hdr-acc');
    if (!a || !signedIn()) return;
    a.classList.add('is-in');
    var t = a.querySelector('.hdr-acc-t'); if (t) t.textContent = a.getAttribute('data-in');
  }
  function initAccount(app) {
    var box = app.querySelector('#acc');
    if (!box) return;
    var d = box.dataset;
    var q = new URLSearchParams(location.search);
    var next = q.get('next') || '';
    if (!/^\/(?!\/)[A-Za-z0-9\/_.#-]*$/.test(next)) next = '';
    var val = function (id) { var x = box.querySelector('#' + id); return x ? x.value : ''; };
    function status(f, text, ok) { var st = f.querySelector('.form-status'); if (!st) return; st.textContent = text || ''; st.className = 'form-status' + (text ? (ok ? ' is-ok' : ' is-err') : ''); }
    function errText(r) {
      var e = r && r.data && r.data.error;
      return ({ bad_login: d.errLogin, exists: d.errExists, weak: d.errWeak2, name: d.errName, login: d.errLoginFmt, bad_code: d.errCode, blocked: d.errBlocked, rate: d.errRate, bad_password: d.errCurrent, send: d.errSend, cap: d.errSend, wait: d.errWait })[e] || d.errNet;
    }
    function enter() { store('ac_token', null); location.href = next || location.pathname; }
    function bind(sel, fn) {
      var f = box.querySelector(sel);
      if (!f) return;
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var b = f.querySelector('button[type="submit"]');
        if (b.disabled) return;
        b.disabled = true;
        Promise.resolve().then(function () { return fn(f); }).catch(function () { status(f, d.errNet); }).then(function () { b.disabled = false; });
      });
    }
    // Kodni qayta yuborish tugmasi: 60 soniya kutish
    function cooldown(btn, sec) {
      if (!btn) return;
      var label = d.resend, left = sec || 60;
      btn.disabled = true;
      var tick = function () { if (left <= 0) { btn.disabled = false; btn.textContent = label; return; } btn.textContent = d.resendIn.replace('{s}', left); left--; setTimeout(tick, 1000); };
      tick();
    }
    var panes = { login: '#f-login', register: '#f-register', forgot: '#f-forgot' };
    function tab(name) {
      Object.keys(panes).forEach(function (k) { var f = box.querySelector(panes[k]); if (f) f.hidden = k !== name; });
      each(box.querySelectorAll('[role="tab"]'), function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-tab') === name)); });
      var f = box.querySelector(panes[name]);
      var i = f && f.querySelector('input:not([hidden])');
      if (i) i.focus();
    }
    each(box.querySelectorAll('[data-tab]'), function (b) { b.addEventListener('click', function () { tab(b.getAttribute('data-tab')); }); });
    if (box.querySelector('#f-login')) {
      var t0 = q.get('tab') || location.hash.slice(1);
      if (t0 === 'register' || t0 === 'forgot') tab(t0);
    }
    // Kod maydoni: faqat raqam, 6 ta bo'lganda forma o'zi yuboriladi
    each(box.querySelectorAll('.code-in'), function (x) {
      x.addEventListener('input', function () {
        x.value = x.value.replace(/\D/g, '').slice(0, 6);
        var f = x.form; if (x.value.length === 6 && f && f.id !== 'f-forgot2' && f.requestSubmit) f.requestSubmit();
      });
    });

    bind('#f-login', function (f) {
      var lg = val('l-login').trim(), pw = val('l-pw');
      if (!lg || !pw) return status(f, d.errLogin);
      return api('POST', '/api/account/login', { login: lg, password: pw }).then(function (r) { if (r.status === 200) return enter(); status(f, errText(r)); });
    });

    // Ro'yxatdan o'tish: 1) ma'lumotlar 2) kerak bo'lsa SMS/email kod
    var reg = box.querySelector('#f-register');
    var regStep = 1;
    function regBody() { return { name: clean(val('r-name'), 80), login: val('r-login').trim(), company: clean(val('r-company'), 100), password: val('r-pw'), lang: d.lang, website: val('r-web') }; }
    function regMode(step, channel) {
      regStep = step;
      var fields = reg.querySelector('.reg-fields'), code = reg.querySelector('#r-code'), btn = reg.querySelector('button[type="submit"]');
      fields.hidden = step === 2; code.hidden = step !== 2;
      btn.firstChild.textContent = step === 2 ? btn.getAttribute('data-l2') : btn.getAttribute('data-l1');
      if (step === 2) {
        code.querySelector('.cab-code-lead').textContent = channel === 'email' ? d.codeLeadEmail : d.codeLeadSms;
        var ci = code.querySelector('input'); ci.value = ''; ci.focus();
        cooldown(code.querySelector('[data-resend]'), 60);
      }
    }
    function askCode(f) {
      var b = regBody();
      return api('POST', '/api/account/code', { purpose: 'register', login: b.login, lang: d.lang, website: b.website }).then(function (r) {
        if (r.status !== 200) return status(f, errText(r));
        status(f, '');
        if (!r.data.channel) return register(f, '');
        regMode(2, r.data.channel);
      });
    }
    function register(f, code) {
      var b = regBody(); b.code = code;
      return api('POST', '/api/account/register', b).then(function (r) {
        if (r.status === 200) return enter();
        if (r.data && r.data.error === 'need_code') return askCode(f);
        status(f, errText(r));
      });
    }
    if (reg) {
      bind('#f-register', function (f) {
        if (regStep === 2) {
          var c = val('r-code-in');
          if (c.length !== 6) return status(f, d.errCode);
          return register(f, c);
        }
        var b = regBody();
        if (b.name.length < 2) return status(f, d.errName);
        if (!/@/.test(b.login) && b.login.replace(/\D/g, '').length < 9) return status(f, d.errLoginFmt);
        if (b.password.length < 8) return status(f, d.errWeak2);
        if (b.password !== val('r-pw2')) return status(f, d.errMatch);
        return register(f, '');
      });
      reg.querySelector('[data-resend]').addEventListener('click', function () { askCode(reg); });
      reg.querySelector('[data-change]').addEventListener('click', function () { regMode(1); status(reg, ''); });
    }

    var resetLogin = '';
    bind('#f-forgot1', function (f) {
      var lg = val('fg-login').trim();
      if (!lg) return status(f, d.errLoginFmt);
      return api('POST', '/api/account/forgot', { login: lg }).then(function (r) {
        if (r.status !== 200) return status(f, errText(r));
        resetLogin = lg;
        var ch = r.data && r.data.channel;
        status(f, ch === 'sms' ? d.codeSentSms : ch === 'email' ? d.codeSentEmail : d.codeSent, true);
        var f2 = box.querySelector('#f-forgot2'); f2.hidden = false; f2.querySelector('input').focus();
      });
    });
    bind('#f-forgot2', function (f) {
      var pw = val('fg-pw');
      if (pw.length < 8) return status(f, d.errWeak2);
      if (pw !== val('fg-pw2')) return status(f, d.errMatch);
      return api('POST', '/api/account/reset', { login: resetLogin, code: val('fg-code'), password: pw }).then(function (r) { if (r.status === 200) return enter(); status(f, errText(r)); });
    });

    /* ---- Kabinet: yon menyu bo'limlari ---- */
    var cab = box.querySelector('.cab');
    if (cab) {
      var names = Array.prototype.map.call(cab.querySelectorAll('.cab-pane'), function (p) { return p.getAttribute('data-pane'); });
      var show = function (name, focus) {
        if (names.indexOf(name) < 0) name = 'home';
        each(cab.querySelectorAll('.cab-pane'), function (p) { p.hidden = p.getAttribute('data-pane') !== name; });
        each(cab.querySelectorAll('.cab-ni'), function (a) { if (a.getAttribute('data-go') === name) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
        each(cab.querySelectorAll('.cab-pane:not([data-pane="' + name + '"]) video'), function (v) { if (!v.paused) v.pause(); });
        if (focus) { var h = cab.querySelector('#h-' + name); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } if (window.innerWidth < 900) cab.querySelector('.cab-main').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      };
      each(cab.querySelectorAll('[data-go]'), function (a) {
        a.addEventListener('click', function (e) { e.preventDefault(); var n = a.getAttribute('data-go'); history.replaceState(null, '', '#' + n); show(n, true); });
      });
      window.addEventListener('hashchange', function () { show(location.hash.slice(1), false); });
      show(location.hash.slice(1), false);
      each(cab.querySelectorAll('.chip'), function (c) {
        c.addEventListener('click', function () {
          var cat = c.getAttribute('data-cat');
          each(cab.querySelectorAll('.chip'), function (x) { var on = x === c; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
          each(cab.querySelectorAll('.vid-card'), function (card) { card.hidden = !!cat && card.getAttribute('data-cat') !== cat; });
        });
      });
      each(cab.querySelectorAll('video[data-vid]'), function (v) {
        var counted = false;
        v.addEventListener('play', function () { if (counted) return; counted = true; api('POST', '/api/videos/' + v.getAttribute('data-vid') + '/view', {}); });
      });
    }
    var mq = box.querySelector('#man-q');
    if (mq) mq.addEventListener('input', function () {
      var s = mq.value.trim().toLowerCase();
      each(box.querySelectorAll('.man-row'), function (r) { r.hidden = !!s && r.getAttribute('data-q').indexOf(s) < 0; });
    });

    // Akkauntni tasdiqlash
    var vf = box.querySelector('#f-verify');
    if (vf) {
      var vs = vf.querySelector('#vf-send');
      var sendV = function () {
        return api('POST', '/api/account/code', { purpose: 'verify', lang: d.lang }).then(function (r) {
          if (r.status !== 200) return status(vf, errText(r));
          status(vf, vf.getAttribute('data-channel') === 'email' ? d.codeLeadEmail : d.codeLeadSms, true);
          vf.querySelector('.cab-verify-in').hidden = false; vf.querySelector('input').focus();
          vs.textContent = d.resend; cooldown(vs, 60);
        });
      };
      vs.addEventListener('click', sendV);
      bind('#f-verify', function (f) {
        return api('POST', '/api/account/verify', { code: val('vf-code') }).then(function (r) {
          if (r.status !== 200) return status(f, errText(r));
          status(f, d.verifiedOk, true); setTimeout(function () { location.reload(); }, 900);
        });
      });
    }

    var out = box.querySelector('#acc-logout');
    if (out) out.addEventListener('click', function () {
      api('POST', '/api/account/logout', {}).then(function () { store('ac_token', null); location.href = location.pathname; });
    });
    bind('#f-profile', function (f) {
      var name = clean(val('p-name'), 80);
      if (name.length < 2) return status(f, d.errName);
      return api('POST', '/api/account/profile', { name: name, company: clean(val('p-company'), 100), lang: val('p-lang') || d.lang }).then(function (r) { status(f, r.status === 200 ? d.saved : errText(r), r.status === 200); });
    });
    bind('#f-password', function (f) {
      var pw = val('pw-new');
      if (pw.length < 8) return status(f, d.errWeak2);
      if (pw !== val('pw-new2')) return status(f, d.errMatch);
      return api('POST', '/api/account/password', { current: val('pw-cur'), next: pw }).then(function (r) {
        if (r.status === 200) { f.reset(); return status(f, d.pwChanged, true); }
        status(f, errText(r));
      });
    });
    // Qurilmalardan chiqarish
    var devSt = box.querySelector('#dev-status');
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-end]');
      if (!b) return;
      b.disabled = true;
      api('POST', '/api/account/sessions', { id: b.getAttribute('data-end') }).then(function (r) {
        if (r.status !== 200) { b.disabled = false; devSt.textContent = d.errNet; devSt.className = 'form-status is-err'; return; }
        if (b.getAttribute('data-end') === 'others') { each(box.querySelectorAll('.dev:not(.is-cur)'), function (x) { x.remove(); }); b.remove(); }
        else { var li = b.closest('.dev'); if (li) li.remove(); }
        devSt.textContent = d.ended; devSt.className = 'form-status is-ok';
      });
    });
    var tgs = box.querySelector('#tg-status');
    var link = box.querySelector('#tg-link');
    if (link) link.addEventListener('click', function () {
      var w = window.open('', '_blank');
      api('POST', '/api/account/tg-link', {}).then(function (r) {
        if (r.status !== 200) { if (w) w.close(); tgs.textContent = d.errNet; tgs.className = 'form-status is-err'; return; }
        if (w) w.location.href = r.data.url; else location.href = r.data.url;
        tgs.textContent = d.tgWait; tgs.className = 'form-status is-ok';
      });
    });
    var unlink = box.querySelector('#tg-unlink');
    if (unlink) unlink.addEventListener('click', function () { api('POST', '/api/account/tg-unlink', {}).then(function () { location.reload(); }); });
  }

  /* ---------- Video qo'llanmalar ---------- */
  function initVideos(app) {
    var box = app.querySelector('#vids');
    if (!box) return;
    each(box.querySelectorAll('.chip'), function (c) {
      c.addEventListener('click', function () {
        var cat = c.getAttribute('data-cat');
        each(box.querySelectorAll('.chip'), function (x) { var on = x === c; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
        each(box.querySelectorAll('.vid-card'), function (card) { card.hidden = !!cat && card.getAttribute('data-cat') !== cat; });
      });
    });
    // Bir video boshqasi boshlanganda to'xtaydi; ko'rishlar soni hisoblanadi
    each(box.querySelectorAll('video[data-vid]'), function (v) {
      var counted = false;
      v.addEventListener('play', function () {
        each(box.querySelectorAll('video[data-vid]'), function (o) { if (o !== v && !o.paused) o.pause(); });
        if (counted) return;
        counted = true;
        api('POST', '/api/videos/' + v.getAttribute('data-vid') + '/view', {});
      });
    });
  }

  function initLangSwitch(app) {
    each(app.querySelectorAll('[data-lang-switch]'), function (b) {
      b.addEventListener('click', function () {
        var l = b.getAttribute('data-lang-switch');
        if (!swapTo(app, l)) return;
        store('lang', l);
        initApp(app);
        var nb = app.querySelector('[data-lang-switch="' + l + '"]');
        if (nb) nb.focus();
      });
    });
  }

  // 16-bosqich: sayt va xizmatni baholash formasi
  function initRate() {
    var f = document.getElementById('rate-form');
    if (!f) return;
    var msg = f.querySelector('.rate-msg');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = function (n) { var x = f.querySelector('input[name="' + n + '"]:checked'); return x ? Number(x.value) : null; };
      var body = { site: val('site'), service: val('service'), text: f.text.value.trim(), name: f.name.value.trim(), lang: f.getAttribute('data-lang') };
      msg.className = 'rate-msg';
      if (!body.site && !body.service) { msg.textContent = f.getAttribute('data-need'); msg.classList.add('bad'); return; }
      var btn = f.querySelector('button[type="submit"]'); btn.disabled = true;
      fetch('/api/feedback', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), credentials: 'same-origin' })
        .then(function (r) { if (!r.ok) throw new Error(String(r.status)); msg.textContent = f.getAttribute('data-thanks'); msg.classList.add('ok'); f.reset(); beacon({ t: 'ev', e: 'rate_sent', p: location.pathname, l: lang() }); })
        .catch(function () { msg.textContent = f.getAttribute('data-err'); msg.classList.add('bad'); })
        .then(function () { btn.disabled = false; });
    });
  }

  /* ---------- Qayta qo'ng'iroq formasi (faqat telefon) ---------- */
  function initSvcLinks() {
    each(document.querySelectorAll('[data-svc]'), function (a) {
      a.addEventListener('click', function () {
        var sel = document.getElementById('f-service'), v = a.getAttribute('data-svc');
        if (!sel) return;
        for (var i = 0; i < sel.options.length; i++) if (sel.options[i].text === v) { sel.selectedIndex = i; break; }
      });
    });
  }

  function initCallback() {
    var f = document.getElementById('cb-form');
    if (!f) return;
    var msg = f.querySelector('.cb-msg');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var phone = f.phone.value.trim(), digits = phone.replace(/\D/g, '');
      msg.className = 'cb-msg';
      if (digits.length < 9 || digits.length > 15) { msg.textContent = f.getAttribute('data-err-phone'); msg.classList.add('bad'); f.phone.focus(); return; }
      var btn = f.querySelector('button[type="submit"]'); btn.disabled = true;
      var body = { phone: phone, urgent: f.urgent.checked, website: f.website.value, lang: f.getAttribute('data-lang') , service: f.getAttribute('data-service') || undefined };
      fetch('/api/callback', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), credentials: 'same-origin' })
        .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
        .then(function (d) { msg.textContent = f.getAttribute('data-ok').replace('{code}', d.code || ''); msg.classList.add('ok'); f.reset(); beacon({ t: 'ev', e: body.urgent ? 'callback_urgent' : 'callback', p: location.pathname, l: lang() }); })
        .catch(function () { msg.textContent = f.getAttribute('data-err'); msg.classList.add('bad'); })
        .then(function () { btn.disabled = false; });
    });
  }

  function boot() {
    var app = document.getElementById('app');
    if (!app) return;
    PREVIEW = app.getAttribute('data-preview') === '1';
    if (PREVIEW) { var pref = store('lang'); if (pref && pref !== app.getAttribute('data-lang')) swapTo(app, pref); }
    initApp(app);
    initRate();
    initCallback();
    // Telefonda bosh sahifa videosi yashirin: trafikni tejash uchun umuman yuklanmaydi
    if (window.matchMedia && matchMedia('(max-width: 760px)').matches) each(document.querySelectorAll('.hx3 .hx-screen video'), function (v) { v.pause(); v.removeAttribute('autoplay'); each(v.querySelectorAll('source'), function (s) { s.remove(); }); v.removeAttribute('src'); v.load(); });
    initSvcLinks();
    beacon({ t: 'pv', p: location.pathname, l: lang(), r: document.referrer });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
