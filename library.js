/* ═══════════════════════════════════════════════════════
   MYCODELAB · js/library.js — Library page controller
   ═══════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  MCL.initNavbar();
  MCL.Search.init();

  /* ── State ── */
  const state = { lang: 'all', author: 'all' };

  /* ════════════════════════════════════
     BUILD SIDEBAR
  ════════════════════════════════════ */
  function buildSidebar () {
    const nav = document.getElementById('sidebarNav');
    if (!nav) return;

    nav.innerHTML = MCL.categories.map(cat => `
      <div class="sidebar-cat" id="scat-${cat.id}">
        <button class="sidebar-cat-btn"
                aria-expanded="false"
                aria-controls="sproj-${cat.id}"
                data-cat-id="${cat.id}"
                style="--cat-color: ${cat.color}">
          <span class="sidebar-cat-icon" aria-hidden="true">${cat.icon}</span>
          <span class="sidebar-cat-name">${cat.name}</span>
          <span class="sidebar-cat-count">${cat.projects.length}</span>
          <svg class="sidebar-cat-chevron" width="10" height="10" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
        <div class="sidebar-projects" id="sproj-${cat.id}" role="list">
          ${cat.projects.map(p => `
            <a href="project.html?cat=${cat.id}&id=${p.id}"
               class="sidebar-proj-link"
               role="listitem"
               data-proj-id="${p.id}">
              ${p.title}
            </a>
          `).join('')}
        </div>
      </div>
    `).join('');

    // Toggle expand
    nav.querySelectorAll('.sidebar-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id      = btn.dataset.catId;
        const projDiv = document.getElementById(`sproj-${id}`);
        const open    = projDiv.classList.toggle('--open');
        btn.classList.toggle('--open', open);
        btn.setAttribute('aria-expanded', open);
      });
    });

    // Expand category matching hash
    const hash = location.hash.slice(1);
    if (hash) {
      const btn = nav.querySelector(`[data-cat-id="${hash}"]`);
      if (btn) btn.click();
    }
  }

  /* ── Sidebar text filter ── */
  const sidebarInput = document.getElementById('sidebarFilter');
  if (sidebarInput) {
    sidebarInput.addEventListener('input', () => {
      const q = sidebarInput.value.toLowerCase().trim();
      document.querySelectorAll('.sidebar-cat').forEach(el => {
        const name  = el.querySelector('.sidebar-cat-name')?.textContent.toLowerCase() || '';
        const links = el.querySelectorAll('.sidebar-proj-link');
        let anyMatch = name.includes(q);
        links.forEach(a => {
          const match = !q || a.textContent.toLowerCase().includes(q);
          a.style.display = match ? '' : 'none';
          if (match) anyMatch = true;
        });
        el.style.display = anyMatch ? '' : 'none';
      });
    });
  }

  /* ════════════════════════════════════
     BUILD LIBRARY CONTENT
  ════════════════════════════════════ */
  function getFilteredProjects (cat) {
    return cat.projects.filter(p => {
      const langOk   = state.lang   === 'all' || p.language === state.lang;
      const authorOk = state.author === 'all' || p.author   === state.author;
      return langOk && authorOk;
    });
  }

  function renderLibrary () {
    const content  = document.getElementById('libraryContent');
    const noResult = document.getElementById('noResults');
    if (!content) return;

    let totalVisible = 0;

    content.innerHTML = MCL.categories.map(cat => {
      const visible = getFilteredProjects(cat);
      totalVisible += visible.length;

      return `
        <section class="lib-category-section reveal"
                 id="${cat.id}"
                 aria-labelledby="libcat-${cat.id}">
          <div class="lib-cat-header">
            <span class="lib-cat-icon" style="--cat-color:${cat.color}" aria-hidden="true">${cat.icon}</span>
            <h2 class="lib-cat-name" id="libcat-${cat.id}">${cat.name}</h2>
            <span class="lib-cat-count">${visible.length} / ${cat.projects.length}</span>
          </div>
          ${visible.length ? `
            <div class="lib-projects-grid">
              ${visible.map(p => `
                <a href="project.html?cat=${cat.id}&id=${p.id}"
                   class="lib-proj-card"
                   aria-label="${p.title}">
                  <div class="lib-proj-card-top">
                    <span class="lang-badge ${MCL.langClass(p.language)}">${p.language}</span>
                    <span style="font-family:var(--font-mono);font-size:.62rem;color:var(--tx-03)">${p.type.toUpperCase()}</span>
                  </div>
                  <div class="lib-proj-title">${p.title}</div>
                  <p class="lib-proj-desc">${p.description}</p>
                  <div class="lib-proj-meta">
                    <span class="lib-proj-author">${MCL.getContributor(p.author)?.name.split(' ')[0] || p.author}</span>
                    <span class="lib-proj-type">${p.file}</span>
                  </div>
                </a>
              `).join('')}
            </div>
          ` : `
            <p style="font-family:var(--font-serif);font-size:.82rem;color:var(--tx-03);padding:12px 0">
              No implementations match the current filters in this category.
            </p>
          `}
        </section>
      `;
    }).join('');

    noResult?.classList.toggle('hidden', totalVisible > 0);
    MCL.initScrollReveal('.reveal');

    // Highlight active sidebar link if hash matches
    highlightActiveSidebar();
  }

  /* ════════════════════════════════════
     FILTERS
  ════════════════════════════════════ */
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const filterKey = chip.dataset.filter;
      const val       = chip.dataset.value;

      chip.closest('.filter-chips').querySelectorAll('.chip')
        .forEach(c => c.classList.remove('--active'));
      chip.classList.add('--active');

      state[filterKey] = val;
      renderLibrary();
    });
  });

  /* ════════════════════════════════════
     SIDEBAR ACTIVE STATE (scroll-based)
  ════════════════════════════════════ */
  function highlightActiveSidebar () {
    const sections = Array.from(document.querySelectorAll('.lib-category-section'));
    const links    = document.querySelectorAll('.sidebar-proj-link');

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id  = e.target.id;
          const btn = document.querySelector(`.sidebar-cat-btn[data-cat-id="${id}"]`);
          if (btn && !btn.classList.contains('--open')) btn.click();
        }
      });
    }, { threshold: 0.15, rootMargin: '-60px 0px -60% 0px' });

    sections.forEach(s => obs.observe(s));
  }

  /* ════════════════════════════════════
     SCROLL TO HASH
  ════════════════════════════════════ */
  function scrollToHash () {
    const hash = location.hash.slice(1);
    if (!hash) return;
    setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }

  /* ── BOOT ── */
  buildSidebar();
  renderLibrary();
  scrollToHash();
  MCL.initCopyButtons();
});
