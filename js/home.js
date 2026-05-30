/* ═══════════════════════════════════════════════════════
   MYCODELAB · js/home.js — Homepage controller
   ═══════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── Categories grid ── */
  const catGrid = document.getElementById('categoriesGrid');
  if (catGrid) {
    catGrid.innerHTML = MCL.categories.map(cat => {
      const html = MCL.renderCategoryCard(cat);
      // Wrap in reveal div
      return `<div class="reveal">${html}</div>`;
    }).join('');
  }

  /* ── Projects grid (first 6) ── */
  const projGrid = document.getElementById('projectsGrid');
  if (projGrid) {
    const featured = MCL.allProjects.slice(0, 6);
    projGrid.innerHTML = featured.map(p => {
      return `<div class="reveal">${MCL.renderProjectCard(p)}</div>`;
    }).join('');
  }

  /* ── Contributors ── */
  const contribGrid = document.getElementById('contributorsGrid');
  if (contribGrid) {
    contribGrid.innerHTML = MCL.contributors.map(c =>
      `<div class="reveal">${MCL.renderContributorCard(c)}</div>`
    ).join('');
  }

  /* ── Terminal ── */
  MCL.buildTerminal('terminalBody');

  /* ── Counter observer ── */
  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        MCL.animateCounters();
        obs.unobserve(statsEl);
      }
    }, { threshold: 0.5 });
    obs.observe(statsEl);
  }

  /* ── Scroll reveal ── */
  MCL.initScrollReveal('.reveal');

  /* ── Navbar ── */
  MCL.initNavbar();

  /* ── Search ── */
  MCL.Search.init();

  /* ── Copy buttons ── */
  MCL.initCopyButtons();

  /* ── Active nav link (scroll spy for single-page sections) ── */
  const sections = ['home', 'categories', 'projects', 'contributors', 'docs'];
  const navLinks = document.querySelectorAll('.nav-link[href^="#"], .nav-link[href="index.html"]');

  const updateActive = () => {
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 100) current = id;
    });
    navLinks.forEach(a => {
      const href = a.getAttribute('href');
      a.classList.toggle('active',
        href === `#${current}` || (current === 'home' && (href === '#home' || href === 'index.html'))
      );
    });
  };

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
});
