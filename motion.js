// Case image blocks and home sections fade in (styles.css: .case-media) as they enter the viewport.
// Progressive enhancement: nothing is hidden unless this script runs, IntersectionObserver exists
// and the visitor has not asked for reduced motion. Blocks already in view are shown immediately.
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
