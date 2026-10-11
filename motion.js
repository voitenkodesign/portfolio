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
