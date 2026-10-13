// Case image blocks and home sections fade in (styles.css: .case-media) as they enter the viewport.
// Progressive enhancement: nothing is hidden unless this script runs, IntersectionObserver exists
// and the visitor has not asked for reduced motion. Blocks already in view are shown immediately.
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
    var span = (h ? h + ' h' : '') + (h && m ? ' ' : '') + (m ? m + ' min' : '');
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
(function () {
  var cta = document.querySelector('.hero__cta');
  if (!cta || !('IntersectionObserver' in window)) return;
  var root = document.documentElement;
  new IntersectionObserver(function (entries) {
    root.classList.toggle('hero-cta-visible', entries[0].isIntersecting);
  }, { rootMargin: '-64px 0px 0px 0px' }).observe(cta);
})();

(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
