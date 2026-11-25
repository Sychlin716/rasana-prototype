/* RASANA prototype runtime: hash router, screen transitions, and the in-screen
   interactions (chips, steppers, text fields, OTP, auto-advance, save toast). */
(function () {
  'use strict';

  var DATA = window.RASANA;
  var byKey = {};
  DATA.screens.forEach(function (s) { byKey[s.key] = s; });

  var screensEl = document.getElementById('screens');
  var panelEl = document.getElementById('panel');
  var toastEl = document.getElementById('toast');
  var toastTextEl = document.getElementById('toast-text');

  // Tabs are siblings, so they cross-fade; everything else is a stack move.
  var TABS = { home: 1, takar: 1, timbang: 1, tumbuh: 1, akun: 1 };

  // The closing beat after a decision is committed. Without it a save says nothing.
  var SAVED = {
    'rencana>takar': 'Rencana besok tersimpan',
    'resep>lengkapi': 'Resep tersimpan',
    'simulasi>produk': 'Harga baru tersimpan',
    'produkBaru>produk': 'Produk ditambahkan',
    'setup3>source': 'Produk pertama tersimpan',
    'pos>posLoading': null,
  };

  var score = 0;
  var recipeDone = false;   // set when the recipe is saved, so Beranda and Lengkapi agree
  var VIDEO_SECONDS = 192;   // 3:12
  var VIDEO_SPEED = 16;      // the prototype has no real video file, so playback is accelerated
  var video = { pct: 0, playing: false, raf: 0, last: 0, scr: null };
  var current = null;
  var stack = [];
  var timer = null;
  var toastTimer = null;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  // ---------- helpers ----------
  function rupiah(n) {
    return 'Rp ' + String(Math.max(0, Math.round(n))).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  function bump(el) {
    if (!el) return;
    el.classList.remove('is-bump');
    void el.offsetWidth;
    el.classList.add('is-bump');
  }

  // ---------- live arithmetic inside a screen ----------
  function recalc(root, changed) {
    var q = function (id) { return root.querySelector('[data-id="' + id + '"]'); };
    var val = function (sel) { var e = root.querySelector(sel); return e ? +e.dataset.num : null; };

    var rows = root.querySelectorAll('[data-ing]');
    if (rows.length) {
      var sum = 0;
      rows.forEach(function (r) {
        if (r.classList.contains('ing-off')) return;
        var qty = +r.querySelector('[data-stepper] [data-val]').dataset.num;
        var price = +(r.querySelector('[data-price]').textContent.replace(/\D/g, '') || 0);
        var sub = Math.round(qty / 1000 * price);
        sum += sub;
        r.querySelector('[data-sub]').textContent = rupiah(sub);
      });
      var yld = +(root.querySelector('[data-yield]').textContent.replace(/\D/g, '') || 0);
      q('rs-total').textContent = rupiah(sum);
      q('rs-unit').textContent = yld > 0 ? rupiah(sum / yld) : '-';
      if (changed) { bump(q('rs-total')); bump(q('rs-unit')); }
    }

    if (q('man-total')) {
      var t = q('man-total');
      t.textContent = rupiah(val('[data-stepper="man"] [data-val]') * 8000);
      if (changed) bump(t);
    }
    if (q('rc-total')) {
      var total = val('[data-stepper="rc"] [data-val]') + val('[data-stepper="rk"] [data-val]');
      q('rc-total').textContent = total + ' roti';
      q('rc-cost').textContent = rupiah(total * 3200);
      if (changed) { bump(q('rc-total')); bump(q('rc-cost')); }
    }
    if (q('sim-month')) {
      var price = val('[data-stepper="price"] [data-val]');
      var month = (price - 4500) * 624;
      var diff = month - 2184000;
      q('sim-month').textContent = rupiah(month);
      var tag = q('sim-diff');
      tag.querySelector('.t').textContent = (diff >= 0 ? '+ ' : '- ') + rupiah(Math.abs(diff));
      tag.style.background = diff >= 0 ? '#FFC224' : '#C22A11';
      tag.querySelector('.t').style.color = diff >= 0 ? '#16240D' : '#fff';
      var d = price - 8000;
      q('sim-note').textContent = d > 0
        ? 'Naik ' + rupiah(d) + ' dari harga sekarang Rp 8.000'
        : d < 0 ? 'Turun ' + rupiah(-d) + ' dari harga sekarang Rp 8.000'
          : 'Sama dengan harga sekarang Rp 8.000';
      if (changed) bump(q('sim-month'));
    }
  }

  // ---------- interactions ----------
  function chipToggle(c) {
    if (c.dataset.chip === 'multi') {
      var on = c.dataset.sel === '1' ? 0 : 1;
      c.dataset.sel = on;
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
      return;
    }
    var group = c.parentElement.parentElement;
    group.querySelectorAll('[data-chip="single"]').forEach(function (x) {
      x.dataset.sel = 0; x.setAttribute('aria-pressed', 'false');
    });
    c.dataset.sel = 1;
    c.setAttribute('aria-pressed', 'true');
  }

  function step(btn) {
    var st = btn.closest('[data-stepper]');
    var v = st.querySelector('[data-val]');
    var next = Math.max(+st.dataset.min, (+v.dataset.num) + (+btn.dataset.d));
    v.dataset.num = next;
    v.textContent = st.dataset.fmt === 'rp' ? rupiah(next) : String(next);
    bump(v);
    recalc(btn.closest('.screen'), true);
  }

  function showToast(text) {
    if (!text) return;
    toastTextEl.textContent = text;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2400);
  }

  // ---------- lesson video (simulated playback) ----------
  function clock(sec) {
    sec = Math.round(sec);
    return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  }
  function paintVideo() {
    var scr = video.scr;
    if (!scr) return;
    var fill = scr.querySelector('.vp-fill');
    var time = scr.querySelector('[data-id="vp-time"]');
    if (fill) fill.style.width = (video.pct * 100).toFixed(2) + '%';
    if (time) time.textContent = clock(video.pct * VIDEO_SECONDS) + ' / ' + clock(VIDEO_SECONDS);
  }
  function stopVideo() {
    video.playing = false;
    cancelAnimationFrame(video.raf);
    if (video.scr) video.scr.classList.remove('is-play');
  }
  function finishVideo() {
    stopVideo();
    video.pct = 1;
    paintVideo();
    var scr = video.scr;
    scr.classList.add('v-done');
    var nx = scr.querySelector('.v-next');
    if (nx) nx.removeAttribute('aria-disabled');
    showToast('Video selesai. Lanjut ke kuis.');
  }
  function tickVideo(now) {
    if (!video.playing) return;
    var dt = Math.min(64, now - video.last);   // a long frame never makes the bar jump
    video.last = now;
    video.pct = Math.min(1, video.pct + (dt / 1000) * VIDEO_SPEED / VIDEO_SECONDS);
    paintVideo();
    if (video.pct >= 1) return finishVideo();
    video.raf = requestAnimationFrame(tickVideo);
  }
  function togglePlay(scr) {
    video.scr = scr;
    if (video.pct >= 1) video.pct = 0;
    if (video.playing) return stopVideo();
    video.playing = true;
    scr.classList.add('is-play');
    video.last = performance.now();
    video.raf = requestAnimationFrame(tickVideo);
  }
  function seek(scr, e) {
    var track = e.target.closest('[data-act="seek"]');
    var r = track.getBoundingClientRect();
    video.scr = scr;
    video.pct = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    paintVideo();
    if (video.pct >= 1) finishVideo();
  }

  // ---------- recipe: add and remove ingredients ----------
  function syncIngFull(scr) {
    scr.classList.toggle('ing-full', !scr.querySelector('.ing-off[data-spare]'));
  }
  function removeIng(btn) {
    var row = btn.closest('[data-ing]'), scr = btn.closest('.screen');
    row.classList.add('ing-off');
    if (row.hasAttribute('data-spare')) {      // spare rows go back to blank
      row.querySelector('[contenteditable][aria-label="Nama bahan"]').textContent = '';
      row.querySelector('[data-price]').textContent = '0';
      var v = row.querySelector('[data-val]'); v.dataset.num = 100; v.textContent = '100';
    }
    syncIngFull(scr); recalc(scr, true);
  }
  function addIng(btn) {
    var scr = btn.closest('.screen');
    var row = scr.querySelector('.ing-off[data-spare]');
    if (!row) return;
    row.classList.remove('ing-off');
    syncIngFull(scr); recalc(scr, true);
    var name = row.querySelector('[contenteditable]');
    row.scrollIntoView({ block: 'nearest', behavior: reduce.matches ? 'auto' : 'smooth' });
    name.focus({ preventScroll: true });
  }

  // ---------- quiz ----------
  function answer(opt) {
    var scr = opt.closest('.screen');
    if (scr.classList.contains('q-done')) return;
    var right = opt.dataset.ok === '1';
    opt.dataset.state = right ? 'ok' : 'no';
    scr.querySelectorAll('.qopt').forEach(function (o) { if (o.dataset.ok === '1') o.dataset.state = 'ok'; });
    if (right) score++;
    scr.classList.add('q-done', right ? 'q-ok' : 'q-no');
    var nx = scr.querySelector('.q-next');
    if (nx) nx.removeAttribute('aria-disabled');
  }

  // ---------- routing ----------
  function render(key) {
    var el = document.createElement('div');
    el.className = 'screen';
    el.dataset.key = key;
    if (recipeDone) el.classList.add('recipe-done');
    el.innerHTML = byKey[key].html;
    // stagger the top-level blocks of the content column, capped so it never drags
    var content = el.querySelector('div[style*="flex:1 1 0"]');
    if (content) {
      [].slice.call(content.children, 0, 8).forEach(function (c, i) {
        c.setAttribute('data-rise', '');
        c.style.setProperty('--i', i);
      });
    }
    return el;
  }

  function go(key, dir, toast) {
    if (!byKey[key] || key === current) return;
    clearTimeout(timer);

    var incoming = render(key);
    // Everything already mounted is on its way out. Only the last one animates; any older
    // ones are dropped at once, so fast tapping can never pile screens up in the DOM.
    var existing = [].slice.call(screensEl.querySelectorAll('.screen'));
    var outgoing = existing.length ? existing[existing.length - 1] : null;
    existing.slice(0, -1).forEach(function (el) { el.remove(); });
    var instant = reduce.matches;

    screensEl.appendChild(incoming);
    void incoming.offsetWidth;
    incoming.classList.add('is-in');

    if (outgoing && !instant) {
      incoming.classList.add('a-' + dir + '-in');
      outgoing.classList.add('a-' + dir + '-out');
      var done = function () { if (outgoing.parentNode) outgoing.remove(); };
      outgoing.addEventListener('animationend', done, { once: true });
      setTimeout(done, 500);
      incoming.addEventListener('animationend', function () {
        incoming.classList.remove('a-' + dir + '-in');
      }, { once: true });
    } else if (outgoing) {
      outgoing.remove();
    }

    if (key === 'kuis1') score = 0;
    if (key === 'resep') syncIngFull(incoming);
    if (key === 'kuisHasil') {
      var sc = incoming.querySelector('[data-id="quiz-score"]');
      if (sc) sc.textContent = score + ' dari 3';
    }
    if (key === 'pelajaran') { stopVideo(); video.pct = 0; video.scr = incoming; }
    else if (video.playing) stopVideo();

    current = key;
    document.title = 'Rasana · ' + byKey[key].name.replace(/^\d+\w*\s/, '');
    if (panelEl) {
      panelEl.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-current', b.dataset.k === key ? 'true' : 'false');
      });
      var active = panelEl.querySelector('[aria-current="true"]');
      if (active) active.scrollIntoView({ block: 'nearest' });
    }

    showToast(toast);

    // Screens that move on by themselves (loading). The timer is bound to the screen that
    // scheduled it, so leaving early can never let a stale timer hijack a later screen.
    var auto = incoming.querySelector('[data-after]');
    if (auto) {
      var owner = key;
      timer = setTimeout(function () {
        if (current === owner) navigate(auto.dataset.after, 'push');
      }, +auto.dataset.afterMs);
    }
  }

  function navigate(key, dir, toast) {
    if (dir === 'push') stack.push(current);
    if (dir === 'pop') stack.pop();
    location.hash = '#/' + key;
    go(key, dir, toast);
  }

  function back() {
    if (!stack.length) return;
    var prev = stack[stack.length - 1];
    if (prev) navigate(prev, 'pop');
  }

  // ---------- events ----------
  screensEl.addEventListener('click', function (e) {
    var chip = e.target.closest('[data-chip]');
    if (chip) { chipToggle(chip); return; }
    var act = e.target.closest('[data-act="step"]');
    if (act) { step(act); return; }
    var scr = e.target.closest('.screen');
    if (e.target.closest('[data-act="seek"]')) { seek(scr, e); return; }
    if (e.target.closest('[data-act="play"]')) { togglePlay(scr); return; }
    var rm = e.target.closest('[data-act="rm"]');
    if (rm) { removeIng(rm); return; }
    var ad = e.target.closest('[data-act="addIng"]');
    if (ad) { addIng(ad); return; }
    var opt = e.target.closest('[data-act="quiz"]');
    if (opt) { answer(opt); return; }
    var link = e.target.closest('[data-go]');
    if (!link || link.getAttribute('aria-disabled') === 'true') return;
    var to = link.dataset.go;
    var dir = TABS[to] && TABS[current] ? 'fade' : /Kembali|Batalkan/.test(link.getAttribute('aria-label') || '') ? 'pop' : 'push';
    var saved = dir !== 'pop';   // going back is not saving
    if (saved && current === 'resep' && to === 'lengkapi') recipeDone = true;
    navigate(to, dir, saved ? SAVED[current + '>' + to] : undefined);
  });

  screensEl.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var t = e.target;
    if (!t.matches || t.isContentEditable) return;
    if (t.matches('[data-chip]') || t.matches('[data-act]')) { e.preventDefault(); t.click(); }
  });

  // OTP: one digit per box, focus moves forward
  screensEl.addEventListener('input', function (e) {
    var num = e.target.closest && e.target.closest('[data-price],[data-yield]');
    if (num) { recalc(num.closest('.screen'), true); return; }
    var box = e.target.closest && e.target.closest('[data-otp]');
    if (!box) return;
    var ch = (box.textContent || '').replace(/\D/g, '').slice(-1);
    box.innerHTML = ch
      ? '<div class="t" style="font-family:Poppins,sans-serif;font-weight:700;font-size:20px;line-height:26px;color:#16240D;white-space:pre">' + ch + '</div>'
      : '';
    if (ch && box.nextElementSibling) box.nextElementSibling.focus();
  });

  // tidy typed prices on leaving the field: 12000 becomes 12.000
  screensEl.addEventListener('focusout', function (e) {
    var f = e.target.closest && e.target.closest('[data-price]');
    if (!f) return;
    var d = f.textContent.replace(/\D/g, '');
    f.textContent = (d || '0').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') back();
  });

  window.addEventListener('hashchange', function () {
    var key = (location.hash || '').replace('#/', '');
    if (byKey[key] && key !== current) {
      var dir = stack[stack.length - 1] === key ? 'pop' : 'push';
      if (dir === 'pop') stack.pop();
      go(key, dir);
    }
  });

  // ---------- fit the device to the viewport ----------
  function fit() {
    var wide = window.innerWidth > 920;
    var pad = wide ? 48 : 0;
    var avail = window.innerWidth - pad - (wide ? 280 : 0);
    var s = Math.min(wide ? 1 : 2, (window.innerHeight - pad) / 844, avail / 390);
    document.documentElement.style.setProperty('--s', s.toFixed(4));
  }
  window.addEventListener('resize', fit);
  fit();

  // ---------- side panel index ----------
  if (panelEl) {
    var sections = [];
    DATA.screens.forEach(function (s) { if (sections.indexOf(s.section) < 0) sections.push(s.section); });
    panelEl.innerHTML =
      '<h1>Rasana · prototipe</h1><p>Klik elemen di layar. Tab dan Enter jalan, Escape untuk kembali.</p>' +
      sections.map(function (sec) {
        return '<h2>' + sec + '</h2>' + DATA.screens.filter(function (s) { return s.section === sec; })
          .map(function (s) { return '<button data-k="' + s.key + '">' + s.name + '</button>'; }).join('');
      }).join('');
    panelEl.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (b) { stack = []; navigate(b.dataset.k, 'fade'); }
    });
  }

  // ---------- boot ----------
  var start = (location.hash || '').replace('#/', '');
  go(byKey[start] ? start : 'welcome', 'fade');
  if (!byKey[start]) location.replace('#/welcome');
})();
