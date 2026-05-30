/* ═══════════════════════════════════════════════════════
   MYCODELAB · js/home.js — Homepage controller
   FIX v2: stats counter always fires, terminal robust,
           contributors render with null-safe guards
   ═══════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar first (always safe) ── */
  MCL.initNavbar();
  MCL.Search.init();

  /* ── Categories grid ── */
  const catGrid = document.getElementById('categoriesGrid');
  if (catGrid) {
    catGrid.innerHTML = MCL.categories.map(cat =>
      `<div class="reveal">${MCL.renderCategoryCard(cat)}</div>`
    ).join('');
  }

  /* ── Projects grid (first 6 from flat list) ── */
  const projGrid = document.getElementById('projectsGrid');
  if (projGrid) {
    projGrid.innerHTML = MCL.allProjects.slice(0, 6).map(p =>
      `<div class="reveal">${MCL.renderProjectCard(p)}</div>`
    ).join('');
  }

  /* ── Contributors ── */
  const contribGrid = document.getElementById('contributorsGrid');
  if (contribGrid && MCL.contributors && MCL.contributors.length) {
    contribGrid.innerHTML = MCL.contributors.map(c =>
      `<div class="reveal">${MCL.renderContributorCard(c)}</div>`
    ).join('');
  }

  /* ── Terminal — fire immediately, no observer needed ── */
  MCL.buildTerminal('terminalBody');

  /* ─────────────────────────────────────────────────────
     STATS COUNTER FIX
     Problem: hero is above the fold on load, so the
     IntersectionObserver with threshold:0.5 may never
     trigger its callback if the element is already
     partially visible when the observer attaches.
     Fix: check isIntersecting immediately AND watch.
  ───────────────────────────────────────────────────── */
  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) {
    let counted = false;

    const runCounters = () => {
      if (counted) return;
      counted = true;
      MCL.animateCounters();
    };

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        runCounters();
        obs.disconnect();
      }
    }, { threshold: 0.1 });   // lower threshold — 10% visible is enough

    obs.observe(statsEl);

    // Fallback: if element is already in viewport right now, fire directly
    const rect = statsEl.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      // Small delay so the page has painted
      setTimeout(runCounters, 300);
    }
  }

  /* ── Scroll reveal ── */
  MCL.initScrollReveal('.reveal');

  /* ── Copy buttons ── */
  MCL.initCopyButtons();

  /* ── Active nav link (scroll spy) ── */
  const sections  = ['home', 'categories', 'projects', 'contributors', 'docs'];
  const navLinks  = document.querySelectorAll('.nav-link');

  const updateActive = () => {
    let current = 'home';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY + 120 >= el.offsetTop) current = id;
    });
    navLinks.forEach(a => {
      const href = a.getAttribute('href') || '';
      const isHome = current === 'home' && (href === 'index.html' || href === '#home' || href === './');
      const isSec  = href === `#${current}`;
      a.classList.toggle('active', isHome || isSec);
    });
  };

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
});
