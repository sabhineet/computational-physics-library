/* ═══════════════════════════════════════════════════════
   MYCODELAB · js/home.js — Homepage controller
   FIX v2: stats counter always fires, terminal robust,
           contributors render with null-safe guards
   ═══════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar & search — safe to run immediately ── */
  MCL.initNavbar();
  MCL.Search.init();

  /* ── Terminal — starts its own setTimeout chain, fire immediately ── */
  MCL.buildTerminal('terminalBody');

  /* ─────────────────────────────────────────────────────
     Wait for GitHub sync (MCL.ready) before rendering
     grids and stats counters, so auto-discovered projects
     are included and totalProjects is the final value.
     Falls back to static data instantly if API is offline.
  ───────────────────────────────────────────────────── */
  MCL.ready.then(() => {

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

    /* ─────────────────────────────────────────────────────
       STATS COUNTER
       Hero is above the fold so IntersectionObserver may
       never fire if already visible. Double-trigger: watch
       AND check immediately after sync resolves.
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
        if (entries[0].isIntersecting) { runCounters(); obs.disconnect(); }
      }, { threshold: 0.1 });

      obs.observe(statsEl);

      // Already in viewport? Fire after a short paint delay
      const rect = statsEl.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setTimeout(runCounters, 150);
      }
    }

    /* ── Scroll reveal & copy buttons ── */
    MCL.initScrollReveal('.reveal');
    MCL.initCopyButtons();

  }); // end MCL.ready.then

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
