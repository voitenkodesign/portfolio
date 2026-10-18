// Case image blocks and home sections fade in (styles.css: .case-media) as they enter the viewport.
// Progressive enhancement: nothing is hidden unless this script runs and IntersectionObserver exists.
// With reduced motion they only fade (styles.css). Blocks already in view are shown immediately.
// Footer: current time in Kyiv ("Kyiv 14:32"), updated on the minute. Hidden if the browser can't do it.
(function () {
  var slot = document.querySelector('.local-time');
  if (!slot || !window.Intl) return;
  var out = slot.querySelector('time');
  var fmt, zones = ['Europe/Kyiv', 'Europe/Kiev']; // older browsers only know the old spelling
  for (var i = 0; i < zones.length && !fmt; i++) {
    try { fmt = new Intl.DateTimeFormat('en-GB', { timeZone: zones[i], hour: '2-digit', minute: '2-digit', hour12: false }); } catch (e) {}
  }
  if (!fmt) return;
  // "14:32" is rendered as 14<span class="colon">:</span>32 so the colon can blink (CSS)
  var hh = document.createTextNode(''), mm = document.createTextNode(''), colon = document.createElement('span');
  colon.className = 'colon'; colon.textContent = ':';
  out.textContent = ''; out.appendChild(hh); out.appendChild(colon); out.appendChild(mm);
  function tick() {
    var now = new Date(), parts = fmt.format(now).split(':');
    hh.nodeValue = parts[0]; mm.nodeValue = parts[1];
    out.setAttribute('datetime', now.toISOString());
    setTimeout(tick, 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()) + 50);
  }
  tick();
  slot.hidden = false;

  // Easter egg: hover (mouse), tap (touch) or focus the clock to see the time difference and what I'm
  // probably doing right now in Kyiv, e.g. "2 h ahead of you · probably designing".
  var clock = slot.querySelector('.local-time__clock'), note = slot.querySelector('.local-time__note');
  if (!clock || !note) return;
  var partsFmt = new Intl.DateTimeFormat('en-GB', { timeZone: fmt.resolvedOptions().timeZone, year: 'numeric', month: '2-digit',
    day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false, weekday: 'short' });
  function kyivNow() {
    var p = {}, list = partsFmt.formatToParts(new Date());
    for (var i = 0; i < list.length; i++) p[list[i].type] = list[i].value;
    var h = +p.hour % 24;
    return { weekday: p.weekday, hour: h,
      utcMs: Date.UTC(+p.year, +p.month - 1, +p.day, h, +p.minute) };
  }
  function difference(k) {
    var now = new Date(); now.setSeconds(0, 0);
    var kyivOffset = Math.round((k.utcMs - now.getTime()) / 60000); // Kyiv minus UTC
    var diff = kyivOffset + now.getTimezoneOffset(); // Kyiv minus visitor, in minutes
    if (!diff) return 'same time as you';
    var abs = Math.abs(diff), h = Math.floor(abs / 60), m = abs % 60;
    var span = (h ? h + '\u00a0h' : '') + (h && m ? ' ' : '') + (m ? m + '\u00a0min' : '');
    return span + (diff > 0 ? ' ahead of you' : ' behind you');
  }
  function activity(k) {
    var h = k.hour, weekend = k.weekday === 'Sat' || k.weekday === 'Sun';
    if (weekend) {
      if (h >= 8 && h < 12) return 'slow weekend morning';
      if (h >= 12 && h < 18) return 'weekend, out and about';
      if (h >= 18 && h < 23) return 'probably watching a movie';
      return 'probably asleep';
    }
    if (h >= 7 && h < 10) return 'morning coffee';
    if (h >= 13 && h < 14) return 'lunch break';
    if (h >= 10 && h < 19) return 'probably designing';
    if (h >= 19 && h < 23) return 'evening, still around';
    return 'probably asleep';
  }
  var hideTimer;
  function open(autoClose) {
    var k = kyivNow();
    note.textContent = '';
    var s = document.createElement('span'); s.className = 'sep'; s.textContent = '·';
    note.appendChild(document.createTextNode(difference(k))); note.appendChild(s); note.appendChild(document.createTextNode(activity(k)));
    slot.classList.add('is-open');
    clearTimeout(hideTimer);
    if (autoClose) hideTimer = setTimeout(close, 3000);
  }
  function close() { slot.classList.remove('is-open'); }
  clock.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') open(false); });
  clock.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') close(); });
  clock.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') open(true); });
  clock.addEventListener('focus', function () { open(false); });
  clock.addEventListener('blur', close);
})();

// Home: on touch screens there is no hover, so a tap on "Open to work" makes the dot wink (CSS .is-winking).
(function () {
  var status = document.querySelector('.status');
  if (!status) return;
  var timer;
  status.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse') return; // mouse already winks on hover
    clearTimeout(timer);
    status.classList.remove('is-winking');
    void status.offsetWidth; // restart the animation on repeated taps
    status.classList.add('is-winking');
    timer = setTimeout(function () { status.classList.remove('is-winking'); }, 400); // wink is .34s
  });
})();

// Home: hide the header "Email me" while the hero buttons are visible, show it once they scroll away.
// The nav links slide into its place by --nav-shift (its width + the nav gap), measured here.
(function () {
  var cta = document.querySelector('.hero__cta'), btn = document.querySelector('.site-nav .btn');
  if (!cta || !btn || !('IntersectionObserver' in window)) return;
  var root = document.documentElement;
  function measure() {
    var gap = parseFloat(getComputedStyle(btn.parentNode).columnGap) || 0;
    root.style.setProperty('--nav-shift', (btn.offsetWidth + gap) + 'px');
  }
  measure();
  window.addEventListener('resize', measure);
  var first = true;
  new IntersectionObserver(function (entries) {
    root.classList.toggle('hero-cta-visible', entries[0].isIntersecting);
    if (first) { first = false; requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('nav-ready'); }); }); }
  }, { rootMargin: '-64px 0px 0px 0px' }).observe(cta);
})();

// CV links point to /cv (_redirects sends it to the current file). If a cv.pdf sits in the site root,
// the links go straight to it instead, so a new CV only needs the file dropped into the repo.
(function () {
  var links = document.querySelectorAll('a[data-cv]');
  if (!links.length || !window.fetch) return;
  fetch('/cv.pdf', { method: 'HEAD' }).then(function (r) {
    if (!r.ok || !/pdf/i.test(r.headers.get('content-type') || '')) return;
    for (var i = 0; i < links.length; i++) links[i].href = '/cv.pdf';
  }).catch(function () {});
})();

// Home hero scene: hold the entrance until the pictures are decoded, so cards never fly in empty.
// Waits at most 2.5 s; without this script the scene simply plays as soon as the page renders.
(function () {
  var scene = document.querySelector('.scene');
  if (!scene) return;
  var imgs = scene.querySelectorAll('img'), waits = [];
  scene.classList.add('is-loading');
  for (var i = 0; i < imgs.length; i++) waits.push(imgs[i].decode ? imgs[i].decode().catch(function () {}) : Promise.resolve());
  var go = function () { scene.classList.remove('is-loading'); };
  Promise.all(waits).then(go);
  setTimeout(go, 2500);
})();

(function () {
  if (!('IntersectionObserver' in window)) return;
  var blocks = document.querySelectorAll('.case .prose > .media, .case .prose > .gallery, .cards > .card, .clubs, .stats, .about__row, .cta');
  if (!blocks.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      // threshold 0.1, or a quarter of the viewport for blocks too tall to reach 10%
      if (e.intersectionRatio >= 0.1 || e.intersectionRect.height >= window.innerHeight * 0.25) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: [0, 0.1, 0.25] });
  var vh = window.innerHeight;
  for (var i = 0; i < blocks.length; i++) {
    var el = blocks[i], r = el.getBoundingClientRect();
    if (r.top < vh && r.bottom > 0) el.classList.add('is-in'); // in view on load: no fade
    el.classList.add('case-media');
    if (!el.classList.contains('is-in')) io.observe(el);
  }
  document.documentElement.classList.add('js');
})();

// Theme toy (design-system and white-label cases): pick a club theme and drag the split to compare it with
// the base theme. The token panel is optional (design-system only); its values are the real club variables
// from the Figma file. Each toy starts a short demo when it comes into view and stops for good at the first
// touch, click or key. Reduced motion: no demo, no wipe.
[].forEach.call(document.querySelectorAll('[data-toy]'), function (toy) {
  var screen = toy.querySelector('[data-toy-screen]'), handle = toy.querySelector('[data-toy-handle]');
  var radios = [].slice.call(toy.querySelectorAll('[data-toy-switch] [role="radio"]'));
  var tokens = toy.querySelector('[data-toy-tokens]'), nameEl = toy.querySelector('[data-toy-name]');
  var tagEl = toy.querySelector('[data-toy-tag]'), status = toy.querySelector('[data-toy-status]');
  var scan = toy.querySelector('.toy__scan');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CLUBS = {
    test: { name: 'Base theme', tag: 'Base', primary: '#7C3AED', radius: 9999, font: 'Inter Black', page: '#FFFFFF', picture: 'Grey placeholder' },
    fck:  { name: 'FC Copenhagen', tag: 'FCK', primary: '#0F2DB9', radius: 4, font: 'FCK Sans Bold', page: '#FCFCFD', picture: 'Club photo' },
    fcm:  { name: 'FC Midtjylland', tag: 'FCM', primary: '#DE2807', radius: 9999, font: 'FCM Rialta Bold', page: '#000000', picture: 'Club photo' },
    dbu:  { name: 'DBU · ForDanmark', tag: 'DBU', primary: '#C90B0E', radius: 6, font: 'DBU Bold', page: '#FFFFFF', picture: 'Club photo' }
  };
  var current = 'fck', split = 50, demo = null, touched = false;

  function setSplit(v) {
    split = Math.max(0, Math.min(100, v));
    screen.style.setProperty('--split', split + '%');
    screen.classList.toggle('is-left-small', split < 18);
    screen.classList.toggle('is-right-small', split > 82);
    screen.classList.toggle('is-edge', split < 1.5 || split > 98.5);
    var c = CLUBS[current], t = Math.round(split);
    handle.setAttribute('aria-valuenow', t);
    handle.setAttribute('aria-valuetext', t + '% base theme, ' + (100 - t) + '% ' + c.name.replace(' ', ' '));
  }

  function setValue(key, text, delay) {
    var el = tokens.querySelector('[data-v="' + key + '"]');
    if (!el || el.textContent === text) return;
    el.classList.remove('is-new');
    setTimeout(function () { el.textContent = text; void el.offsetWidth; if (!reduce) el.classList.add('is-new'); }, reduce ? 0 : delay);
  }

  function pick(id, quiet) {
    if (!CLUBS[id] || id === current) return;
    var c = CLUBS[id], prev = current; current = id;
    radios.forEach(function (r) { var on = r.getAttribute('data-club') === id; r.setAttribute('aria-checked', on); r.tabIndex = on ? 0 : -1; });
    screen.classList.toggle('is-test', id === 'test');
    nameEl.textContent = c.name; tagEl.textContent = c.tag;
    if (tokens) {
      tokens.style.setProperty('--primary', c.primary);
      tokens.style.setProperty('--page', c.page);
      tokens.style.setProperty('--radius-control', c.radius > 999 ? '999px' : c.radius + 'px');
      var step = 60;
      setValue('primary', c.primary, 0);
      setValue('radius', c.radius > 999 ? 'pill' : c.radius + ' px', step);
      setValue('font', c.font, step * 2);
      setValue('page', c.page, step * 3);
      setValue('picture', c.picture, step * 4);
    }
    if (id !== 'test') swapShot(id);
    setSplit(split);
    if (!quiet && status) status.textContent = 'Plugin applied ' + c.tag + ' variables';
  }

  function swapShot(id) {
    var shots = [].slice.call(toy.querySelectorAll('[data-shot]'));
    var next = toy.querySelector('[data-shot="' + id + '"]');
    if (next.classList.contains('is-on')) return;
    if (next.loading === 'lazy') next.loading = 'eager';
    if (reduce) { shots.forEach(function (s) { s.classList.toggle('is-on', s === next); }); return; }
    next.classList.remove('is-go'); next.classList.add('is-entering');
    scan.classList.remove('is-go');
    void next.offsetWidth;
    next.classList.add('is-go'); scan.classList.add('is-go');
    setTimeout(function () {
      shots.forEach(function (s) { if (s !== next) s.classList.remove('is-on'); });
      next.classList.add('is-on'); next.classList.remove('is-entering', 'is-go');
      scan.classList.remove('is-go');
    }, 650);
  }

  function stopDemo() { touched = true; if (demo) { clearTimeout(demo); demo = null; } }

  // Club buttons: click, arrows and Home/End move between them (radio group), 1-4 jump from anywhere in the toy
  var order = ['test', 'fck', 'fcm', 'dbu'];
  radios.forEach(function (r, i) {
    r.addEventListener('click', function () { stopDemo(); pick(r.getAttribute('data-club')); });
    r.addEventListener('keydown', function (e) {
      var k = e.key, j = null;
      if (k === 'ArrowRight' || k === 'ArrowDown') j = (i + 1) % radios.length;
      if (k === 'ArrowLeft' || k === 'ArrowUp') j = (i - 1 + radios.length) % radios.length;
      if (k === 'Home') j = 0;
      if (k === 'End') j = radios.length - 1;
      if (j === null) return;
      e.preventDefault(); stopDemo(); radios[j].focus(); pick(radios[j].getAttribute('data-club'));
    });
  });
  toy.addEventListener('keydown', function (e) {
    var n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) { stopDemo(); pick(order[n - 1]); }
  });

  // Split: drag anywhere on the screen (vertical scroll still works on touch: touch-action pan-y), or arrows on the handle
  var dragging = false;
  function fromEvent(e) { var r = screen.getBoundingClientRect(); setSplit((e.clientX - r.left) / r.width * 100); }
  screen.addEventListener('pointerdown', function (e) {
    if (current === 'test') return;
    stopDemo(); dragging = true; screen.setPointerCapture(e.pointerId); fromEvent(e);
  });
  screen.addEventListener('pointermove', function (e) { if (dragging) fromEvent(e); });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) { screen.addEventListener(t, function () { dragging = false; }); });
  handle.addEventListener('keydown', function (e) {
    var d = { ArrowLeft: -5, ArrowRight: 5, PageDown: -20, PageUp: 20 }[e.key];
    if (e.key === 'Home') d = -100; if (e.key === 'End') d = 100;
    if (d === undefined) return;
    e.preventDefault(); stopDemo(); setSplit(split + d);
  });

  // Demo: the split slides open, then themes take turns until someone touches the toy
  function tween(from, to, ms, done) {
    var t0 = null;
    function f(t) {
      if (touched) return;
      if (t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      setSplit(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(f); else if (done) done();
    }
    requestAnimationFrame(f);
  }
  function cycle() {
    if (touched) return;
    var i = order.indexOf(current), next = order[i === order.length - 1 ? 1 : i + 1];
    pick(next, true);
    demo = setTimeout(cycle, 2600);
  }
  toy.addEventListener('pointerdown', stopDemo, { passive: true });

  toy.classList.add('is-ready');
  setSplit(50);
  if (reduce || !('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting || touched) return;
    io.disconnect();
    setSplit(100);
    demo = setTimeout(function () { tween(100, 50, 900, function () { if (!touched) demo = setTimeout(cycle, 1400); }); }, 400);
  }, { threshold: 0.5 });
  io.observe(screen);
});

// Home hero scene: with a mouse, each layer leans toward the pointer by its depth (front cards more,
// the phone least), eased toward the target every frame so it never jumps and can change direction
// mid-move. Uses the `translate` property, so it adds to the CSS entrance and scroll drift.
(function () {
  var scene = document.querySelector('.scene');
  if (!scene || !window.matchMedia) return;
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var depth = { phone: .25, quiz: .6, product: .7, notification: .9, ticket: 1, result: 1.2 };
  var layers = [];
  scene.querySelectorAll('.scene__layer').forEach(function (layer) {
    var name = layer.className.split('scene__layer--')[1];
    layers.push({ el: layer.firstElementChild, d: depth[name] || .5 });
  });
  var tx = 0, ty = 0, x = 0, y = 0, frame = 0;
  function step() {
    x += (tx - x) * .08; y += (ty - y) * .08;
    for (var i = 0; i < layers.length; i++) {
      layers[i].el.style.translate = (x * layers[i].d * 16).toFixed(2) + 'px ' + (y * layers[i].d * 12).toFixed(2) + 'px';
    }
    frame = Math.abs(tx - x) > .001 || Math.abs(ty - y) > .001 ? requestAnimationFrame(step) : 0;
  }
  function aim(nx, ny) { tx = nx; ty = ny; if (!frame) frame = requestAnimationFrame(step); }
  // -1..1 from the centre of the viewport
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    aim(e.clientX / innerWidth * 2 - 1, e.clientY / innerHeight * 2 - 1);
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', function () { aim(0, 0); });
})();
