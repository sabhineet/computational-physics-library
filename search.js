/* ═══════════════════════════════════════════════════════
   MYCODELAB · js/search.js
   Global search — categories, projects, contributors
   ═══════════════════════════════════════════════════════ */

'use strict';

const MCL = window.MCL || {};
window.MCL = MCL;

MCL.Search = (function () {

  // Build a flat search index once
  const INDEX = [];

  function buildIndex () {
    if (INDEX.length) return;

    MCL.categories.forEach(cat => {
      INDEX.push({
        type:  'category',
        id:    cat.id,
        title: cat.name,
        sub:   cat.description,
        icon:  cat.icon,
        href:  `pages/library.html#${cat.id}`,
        color: cat.color,
      });

      cat.projects.forEach(p => {
        INDEX.push({
          type:  'project',
          id:    p.id,
          catId: cat.id,
          title: p.title,
          sub:   `${cat.name} · ${p.language} · ${p.method}`,
          icon:  cat.icon,
          href:  `pages/project.html?cat=${cat.id}&id=${p.id}`,
          color: cat.color,
          searchText: [p.title, p.description, p.method, p.language, cat.name, ...p.tags].join(' ').toLowerCase(),
        });
      });
    });

    MCL.contributors.forEach(c => {
      INDEX.push({
        type:  'contributor',
        id:    c.id,
        title: c.name,
        sub:   `${c.institution} · ${c.degree}`,
        icon:  'P',
        href:  `pages/contributors.html#${c.id}`,
        color: '#c9a84c',
        searchText: [c.name, c.institution, ...c.specializations].join(' ').toLowerCase(),
      });
    });
  }

  function query (q) {
    if (!q || q.trim().length < 1) return [];
    const terms = q.toLowerCase().trim().split(/\s+/);
    return INDEX.filter(item => {
      const text = (item.searchText || (item.title + ' ' + item.sub).toLowerCase());
      return terms.every(t => text.includes(t));
    }).slice(0, 8);
  }

  /* ── DOM ── */
  let overlay, input, results, selected = -1, resultEls = [];

  function open () {
    buildIndex();
    overlay.removeAttribute('hidden');
    input.value = '';
    renderResults([]);
    setTimeout(() => input.focus(), 60);
    document.body.style.overflow = 'hidden';
  }

  function close () {
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
    selected = -1;
  }

  function renderResults (items) {
    if (!items.length) {
      results.innerHTML = `<div class="search-empty">
        ${input.value ? 'No results found.' : 'Type to search categories, projects, and contributors…'}
      </div>`;
      resultEls = [];
      return;
    }

    results.innerHTML = items.map((item, i) => `
      <a href="${item.href}" class="search-result-item" data-idx="${i}">
        <div class="sri-icon" style="color:${item.color}">${item.icon}</div>
        <div class="sri-body">
          <div class="sri-title">${item.title}</div>
          <div class="sri-meta">${item.type} · ${item.sub}</div>
        </div>
      </a>
    `).join('');

    resultEls = Array.from(results.querySelectorAll('.search-result-item'));
    selected  = -1;
  }

  function selectItem (idx) {
    resultEls.forEach((el, i) => el.classList.toggle('--selected', i === idx));
    selected = idx;
    if (resultEls[idx]) resultEls[idx].scrollIntoView({ block: 'nearest' });
  }

  function init () {
    overlay = document.getElementById('searchOverlay');
    input   = document.getElementById('searchInput');
    results = document.getElementById('searchResults');

    if (!overlay || !input || !results) return;

    // Triggers
    const trigger = document.getElementById('searchTrigger');
    if (trigger) trigger.addEventListener('click', open);

    const closeBtn = document.getElementById('searchClose');
    if (closeBtn) closeBtn.addEventListener('click', close);

    // Click outside
    overlay.addEventListener('click', e => {
      if (e.target === overlay) close();
    });

    // Input
    input.addEventListener('input', () => {
      renderResults(query(input.value));
      selected = -1;
    });

    // Keyboard navigation
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        overlay.hasAttribute('hidden') ? open() : close();
        return;
      }
      if (!overlay.hasAttribute('hidden')) {
        if (e.key === 'Escape') { close(); return; }
        if (e.key === 'ArrowDown') { e.preventDefault(); selectItem(Math.min(selected + 1, resultEls.length - 1)); }
        if (e.key === 'ArrowUp')   { e.preventDefault(); selectItem(Math.max(selected - 1, 0)); }
        if (e.key === 'Enter' && selected >= 0) {
          e.preventDefault();
          resultEls[selected]?.click();
        }
      }
    });
  }

  return { init, open, close, query };

})();
