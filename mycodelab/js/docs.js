/* ═══════════════════════════════════════════════════════
   MYCODELAB · js/docs.js — Documentation page controller
   ═══════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  MCL.initNavbar();
  MCL.Search.init();
  MCL.initCopyButtons();

  /* ── Docs sidebar scroll spy ── */
  const sections = Array.from(document.querySelectorAll('.docs-section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.docs-nav-link'));

  const setActive = (id) => {
    navLinks.forEach(a => {
      a.classList.toggle('--active', a.getAttribute('href') === `#${id}`);
    });
  };

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) setActive(e.target.id);
    });
  }, {
    rootMargin: '-10% 0px -75% 0px',
    threshold: 0,
  });

  sections.forEach(s => obs.observe(s));

  /* ── Smooth scroll on sidebar link click ── */
  navLinks.forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href.startsWith('#')) return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
        setActive(href.slice(1));
      }
    });
  });

  /* ── Scroll to hash on load ── */
  const hash = location.hash.slice(1);
  if (hash) {
    setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 150);
  }
});
