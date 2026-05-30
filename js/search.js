/* ═══════════════════════════════════════════════════════
   MYCODELAB · js/search.js  v2
   Works from both root (index.html) and pages/ context.
   ═══════════════════════════════════════════════════════ */

'use strict';

window.MCL = window.MCL || {};
const MCL  = window.MCL;

MCL.Search = (function () {

  const INDEX = [];

  /* Detect if we're inside pages/ to build correct hrefs */
  const inPages = location.pathname.includes('/pages/');
  const prefix  = inPages ? '' : 'pages/';

  function buildIndex () {
    if (INDEX.length) return;

    MCL.categories.forEach(cat => {
      INDEX.push({
        type:       'category',
        id:         cat.id,
        title:      cat.name,
        sub:        cat.description,
        icon:       cat.icon,
        href:       `${prefix}library.html#${cat.id}`,
        color:      cat.color,
        searchText: (cat.name + ' ' + cat.description).toLowerCase(),
      });

      cat.projects.forEach(p => {
        INDEX.push({
          type:       'project',
          id:         p.id,
          catId:      cat.id,
          title:      p.title,
          sub:        `${cat.name} · ${p.language} · ${p.method}`,
          icon:       cat.icon,
          href:       `${prefix}project.html?cat=${cat.id}&id=${p.id}`,
          color:      cat.color,
          searchText: [p.title, p.description, p.method, p.language, cat.name, ...p.tags]
                        .join(' ').toLowerCase(),
        });
      });
    });

    MCL.contributors.forEach(c => {
      INDEX.push({
        type:       'contributor',
        id:         c.id,
        title:      c.name,
        sub:        `${c.institution} · ${c.degree}`,
        icon:       'P',
        href:       `${prefix}contributors.html#${c.id}`,
        color:      '#c9a84c',
        searchText: [c.name, c.institution, ...(c.specializations || [])].join(' ').toLowerCase(),
      });
    });
  }

  function query (q) {
    if (!q || !q.trim()) return [];
    const terms = q.toLowerCase().trim().split(/\s+/);
    return INDEX.filter(item =>
      terms.every(t => item.searchText.includes(t))
    ).slice(0, 9);
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
    selected  = -1;
    resultEls = [];
  }

  function renderResults (items) {
    if (!items.length) {
      results.innerHTML = `<div class="search-empty">
        ${input.value.trim() ? 'No results found.' : 'Type to search categories, projects, contributors…'}
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
    resultEls[idx]?.scrollIntoView({ block: 'nearest' });
  }

  function init () {
    overlay = document.getElementById('searchOverlay');
    input   = document.getElementById('searchInput');
    results = document.getElementById('searchResults');
    if (!overlay || !input || !results) return;

    document.getElementById('searchTrigger')?.addEventListener('click', open);
    document.getElementById('searchClose')?.addEventListener('click', close);

    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    input.addEventListener('input', () => {
      renderResults(query(input.value));
      selected = -1;
    });

    document.addEventListener('keydown', e => {
      // Open with ⌘K / Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        overlay.hasAttribute('hidden') ? open() : close();
        return;
      }
      if (!overlay.hasAttribute('hidden')) {
        if (e.key === 'Escape')    { close(); return; }
        if (e.key === 'ArrowDown') { e.preventDefault(); selectItem(Math.min(selected + 1, resultEls.length - 1)); }
        if (e.key === 'ArrowUp')   { e.preventDefault(); selectItem(Math.max(selected - 1, 0)); }
        if (e.key === 'Enter' && selected >= 0) { e.preventDefault(); resultEls[selected]?.click(); }
      }
    });
  }

  return { init, open, close, query };

})();
