/* ═══════════════════════════════════════════════════════════
   MYCODELAB — script.js
   SPA Router · Content Renderers · Search Engine · GitHub Integration
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════════════════════
   CONFIGURATION
══════════════════════════════════════════════════════════ */
const CONFIG = {
  github:     'https://github.com/sabhineet/computational-physics-library',
  raw:        'https://raw.githubusercontent.com/sabhineet/computational-physics-library/main',
  githubApi:  'https://api.github.com/repos/sabhineet/computational-physics-library/contents',
  codes:      'codes',
  catalogUrl: './catalog.json',
  // File types the site knows how to render
  supportedExts: new Set(['py', 'ipynb', 'md', 'html']),
  // Files that should NOT become project entries
  skipFiles: new Set(['readme.md', 'index.html', 'license', 'license.md', '.gitignore']),
};

/* ══════════════════════════════════════════════════════════
   GLOBAL STATE
══════════════════════════════════════════════════════════ */
const state = {
  catalog:       null,
  currentRoute:  null,
  sidebarOpen:   false,
  searchOpen:    false,
  searchIndex:   [],
  searchFocusIdx: -1,
};

/* ══════════════════════════════════════════════════════════
   DOM REFERENCES
══════════════════════════════════════════════════════════ */
const $ = id => document.getElementById(id);

const DOM = {
  get appShell()     { return $('app-shell'); },
  get pageRoot()     { return $('page-root'); },
  get pageLoader()   { return $('page-loader'); },
  get sidebar()      { return $('sidebar'); },
  get sidebarNav()   { return $('sidebar-nav'); },
  get sidebarBackdrop() { return $('sidebar-backdrop'); },
  get sidebarToggle(){ return $('sidebar-toggle'); },
  get navToggle()    { return $('nav-toggle'); },
  get mobileMenu()   { return $('mobile-menu'); },
  get topNav()       { return $('top-nav'); },
  get searchOverlay(){ return $('search-overlay'); },
  get searchInput()  { return $('search-input'); },
  get searchResults(){ return $('search-results'); },
  get searchTrigger(){ return $('search-trigger'); },
  get searchBackdrop(){ return $('search-backdrop'); },
};

/* ══════════════════════════════════════════════════════════
   UTILITIES
══════════════════════════════════════════════════════════ */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function githubRawUrl(catPath, filename) {
  return `${CONFIG.raw}/${CONFIG.codes}/${catPath}/${filename}`;
}

function githubBrowseUrl(catPath, filename) {
  return `${CONFIG.github}/blob/main/${CONFIG.codes}/${catPath}/${filename}`;
}

function setTitle(t) {
  document.title = t ? `${t} — MYCODELAB` : 'MYCODELAB — Computational Physics Library';
}

/* ══════════════════════════════════════════════════════════
   ROUTER
══════════════════════════════════════════════════════════ */
function parseRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '') || '';
  const parts = hash.split('/').filter(Boolean);
  if (!parts.length || parts[0] === '')        return { view: 'home' };
  if (parts[0] === 'library')                  return { view: 'library' };
  if (parts[0] === 'about')                    return { view: 'about' };
  if (parts[0] === 'category' && parts[1])     return { view: 'category', catId: parts[1] };
  if (parts[0] === 'project' && parts[1] && parts[2])
                                               return { view: 'project', catId: parts[1], projId: parts[2] };
  return { view: 'home' };
}

function navigate(path) {
  window.location.hash = path;
}

function onRouteChange() {
  const route = parseRoute();
  state.currentRoute = route;
  dispatch(route);
}

function dispatch(route) {
  // Close mobile menus on navigate
  closeMobileMenu();
  if (state.searchOpen) closeSearch();

  switch (route.view) {
    case 'home':     renderHome();                         break;
    case 'library':  renderLibrary();                      break;
    case 'category': renderCategory(route.catId);          break;
    case 'project':  renderProject(route.catId, route.projId); break;
    case 'about':    renderAbout();                        break;
    default:         renderHome();
  }

  // Update active nav links
  document.querySelectorAll('.nav-link[data-route]').forEach(a => {
    a.classList.toggle('active', a.dataset.route === route.view);
  });
}

/* ══════════════════════════════════════════════════════════
   CATALOG LOADER  +  GITHUB LIVE SYNC
══════════════════════════════════════════════════════════ */

/**
 * Load catalog.json (metadata) then merge with the live GitHub
 * file tree so any new folders or .py files are discovered
 * automatically — no manual catalog edits needed.
 */
async function loadCatalog() {
  try {
    const res = await fetch(CONFIG.catalogUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    state.catalog = await res.json();
    buildSearchIndex();
    return true;
  } catch (err) {
    console.error('Failed to load catalog.json:', err);
    return false;
  }
}

/**
 * Kick off GitHub sync in the background after initial render.
 * Re-renders the current route once sync completes so stats + new files appear.
 */
async function syncWithGitHubBackground() {
  let success = false;

  success = await syncWithGitHub();
  if (!success) {
    console.warn('[MYCODELAB] GitHub sync failed, retrying in 8s…');
    await new Promise(r => setTimeout(r, 8000));
    success = await syncWithGitHub();
  }

  if (success) {
    buildSearchIndex();
    if (state.currentRoute) dispatch(state.currentRoute);
  } else {
    console.warn('[MYCODELAB] GitHub sync unavailable — showing catalog.json only.');
  }
}

// AFTER
// Only successful responses are cached — failures are never stored so retries work.
const _ghCache = {};

async function ghFetch(path) {
  if (_ghCache[path]) return _ghCache[path];
  try {
    const res = await fetch(`${CONFIG.githubApi}/${path}`, {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) {
      // 403 = rate-limited, 404 = path doesn't exist — both are soft failures
      console.warn(`[MYCODELAB] GitHub API: HTTP ${res.status} for ${path}`);
      return null;
    }
    const data = await res.json();
    _ghCache[path] = data; // only cache success
    return data;
  } catch (err) {
    console.warn(`[MYCODELAB] GitHub API unavailable (${path}):`, err.message);
    return null;
  }
}

// ── Helpers for auto-generating entries from filenames ──

/** "Bisection_Method.py"  →  "Bisection Method" */
function filenameToTitle(name) {
  return name
    .replace(/\.[^.]+$/, '')             // strip extension
    .replace(/[_\-]+/g, ' ')             // underscores / dashes → spaces
    .replace(/\b\w/g, c => c.toUpperCase()); // Title Case
}

/** "Bisection_Method.py"  →  "bisection-method" */
function filenameToId(name) {
  return name
    .replace(/\.[^.]+$/, '')
    .replace(/[_\s()[\]]+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function autoProject(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  return {
    id:          filenameToId(filename),
    title:       filenameToTitle(filename),
    description: `${filenameToTitle(filename)} — numerical implementation.`,
    file:        filename,
    type:        ext,
    tags:        [],
    _auto:       true,   // flag so we can tell it was auto-discovered
  };
}

function autoCategory(folderName, projects = []) {
  const title = folderName.replace(/[_\-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return {
    id:          slugify(folderName),
    title,
    path:        folderName,
    symbol:      '{}',
    description: `${title} algorithms and implementations.`,
    keywords:    [title.toLowerCase()],
    projects,
    _auto:       true,
  };
}

/**
 * syncWithGitHub()
 *
 * 1. Fetch codes/ directory listing from GitHub API
 * 2. For every folder found:
 *    a. If it matches a catalog category → fetch its files and
 *       add any that aren't already in the catalog
 *    b. If it's a brand-new folder → create a new category entry
 *       with auto-generated project entries for each file
 * 3. Update live stats counters
 *
 * Runs once at startup (awaited before first render).
 * Silently degrades if the API is unreachable (rate-limited / offline).
 */
async function syncWithGitHub() {
  const rootItems = await ghFetch(CONFIG.codes);
  if (!rootItems || !Array.isArray(rootItems)) return false; // API unavailable — use catalog only

  const ghFolders = rootItems.filter(i => i.type === 'dir');

  for (const folder of ghFolders) {
    // Match against catalog by path name (case-insensitive)
    let catEntry = state.catalog.categories.find(
      c => c.path.toLowerCase() === folder.name.toLowerCase()
    );

    // Fetch this folder's file listing
    const folderItems = await ghFetch(`${CONFIG.codes}/${folder.name}`);
    if (!folderItems || !Array.isArray(folderItems)) continue;

    // Collect renderable code files (skip README, index.html, etc.)
    const codeFiles = folderItems.filter(item => {
      if (item.type !== 'file') return false;
      const ext  = item.name.split('.').pop().toLowerCase();
      const base = item.name.toLowerCase();
      return CONFIG.supportedExts.has(ext) && !CONFIG.skipFiles.has(base);
    });

    if (catEntry) {
      // ── Existing category: add any files not already catalogued ──
      for (const file of codeFiles) {
        const alreadyIn = catEntry.projects.some(
          p => p.file.toLowerCase() === file.name.toLowerCase()
        );
        if (!alreadyIn) {
          catEntry.projects.push(autoProject(file.name));
        }
      }
    } else {
      // ── New folder not in catalog.json at all: create it ──
      const newProjects = codeFiles.map(f => autoProject(f.name));
      state.catalog.categories.push(autoCategory(folder.name, newProjects));
    }
  }

  // Recalculate live stats so the homepage counters are accurate
  const totalProjects = state.catalog.categories.reduce(
    (sum, c) => sum + c.projects.length, 0
  );
  state.catalog.meta.stats.projects     = totalProjects;
  state.catalog.meta.stats.categories   = state.catalog.categories.length;
  state.catalog.meta.stats.contributors = state.catalog.contributors.length;
  return true;
}

function getCategoryById(id) {
  return state.catalog?.categories.find(c => c.id === id) || null;
}

function getProjectById(catId, projId) {
  const cat = getCategoryById(catId);
  return cat?.projects.find(p => p.id === projId) || null;
}

/* ══════════════════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════════════════ */
function renderSidebarNav(activeCatId = null, activeProjId = null) {
  if (!state.catalog) return;
  const nav = DOM.sidebarNav;
  if (!nav) return;

  nav.innerHTML = state.catalog.categories.map(cat => {
    const isCatActive = cat.id === activeCatId;
    const hasProjects  = cat.projects.length > 0;

    const projectsHtml = hasProjects ? cat.projects.map(proj => {
      const isProjActive = proj.id === activeProjId;
      return `
        <div class="sidebar-proj-link ${isProjActive ? 'active' : ''}"
             onclick="navigate('#/project/${cat.id}/${proj.id}')"
             title="${escapeHtml(proj.title)}">
          <span class="sidebar-proj-dot"></span>
          <span>${escapeHtml(proj.title)}</span>
        </div>`;
    }).join('') : '';

    return `
      <div class="sidebar-section">
        <button class="sidebar-cat-btn ${isCatActive ? 'active' : ''} ${isCatActive && hasProjects ? 'expanded' : ''}"
                onclick="handleSidebarCatClick(this, '${cat.id}')"
                data-cat-id="${cat.id}">
          <span class="sidebar-cat-symbol">${escapeHtml(cat.symbol)}</span>
          <span class="sidebar-cat-name">${escapeHtml(cat.title)}</span>
          ${hasProjects ? `<span class="sidebar-cat-count">${cat.projects.length}</span>` : ''}
          ${hasProjects ? '<span class="sidebar-chevron">›</span>' : ''}
        </button>
        ${hasProjects ? `
          <div class="sidebar-projects ${isCatActive ? 'open' : ''}" id="sp-${cat.id}">
            ${projectsHtml}
          </div>` : ''}
      </div>`;
  }).join('');
}

function handleSidebarCatClick(btn, catId) {
  const cat = getCategoryById(catId);
  if (!cat) return;

  if (cat.projects.length === 0) {
    navigate(`#/category/${catId}`);
    return;
  }

  const projsEl = document.getElementById(`sp-${catId}`);
  const isExpanded = btn.classList.contains('expanded');

  // Collapse all others
  document.querySelectorAll('.sidebar-cat-btn.expanded').forEach(b => {
    if (b !== btn) {
      b.classList.remove('expanded');
      const otherId = b.dataset.catId;
      const otherProjs = document.getElementById(`sp-${otherId}`);
      if (otherProjs) otherProjs.classList.remove('open');
    }
  });

  btn.classList.toggle('expanded', !isExpanded);
  if (projsEl) projsEl.classList.toggle('open', !isExpanded);

  navigate(`#/category/${catId}`);
}

function showSidebar(catId, projId) {
  DOM.appShell.classList.add('has-sidebar');
  renderSidebarNav(catId, projId);
  // Auto-expand active category
  if (catId) {
    const btn = document.querySelector(`.sidebar-cat-btn[data-cat-id="${catId}"]`);
    const projsEl = document.getElementById(`sp-${catId}`);
    if (btn) btn.classList.add('expanded');
    if (projsEl) projsEl.classList.add('open');
  }
}

function hideSidebar() {
  DOM.appShell.classList.remove('has-sidebar');
  state.sidebarOpen = false;
  DOM.sidebar.classList.remove('open');
  DOM.sidebarBackdrop.classList.remove('visible');
}

function toggleSidebarMobile() {
  state.sidebarOpen = !state.sidebarOpen;
  DOM.sidebar.classList.toggle('open', state.sidebarOpen);
  DOM.sidebarBackdrop.classList.toggle('visible', state.sidebarOpen);
  DOM.sidebarToggle.setAttribute('aria-expanded', state.sidebarOpen);
}

/* ══════════════════════════════════════════════════════════
   PAGE RENDERER HELPERS
══════════════════════════════════════════════════════════ */
function showLoader() {
  DOM.pageRoot.innerHTML = '';
  DOM.pageLoader.removeAttribute('hidden');
  DOM.pageLoader.style.display = 'flex';
}
function hideLoader() {
  DOM.pageLoader.setAttribute('hidden', '');
  DOM.pageLoader.style.display = 'none';
}

function setPage(html) {
  hideLoader();
  DOM.pageRoot.innerHTML = html;
  // Re-run Prism if available
  if (window.Prism) Prism.highlightAll();
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function githubSvg(w = 14) {
  return `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`;
}

function breadcrumbs(items) {
  const parts = [{ label: '~/library', action: "navigate('#/library')" }, ...items];
  return `<div class="breadcrumbs">
    <span class="bc-link" onclick="navigate('#/')">home</span>
    <span class="bc-sep">/</span>
    ${parts.map((p, i) => i < parts.length - 1
      ? `<span class="bc-link" onclick="${p.action}">${escapeHtml(p.label)}</span><span class="bc-sep">/</span>`
      : `<span class="bc-current">${escapeHtml(p.label)}</span>`
    ).join('')}
  </div>`;
}

/* ══════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════ */
function renderHome() {
  setTitle('');
  hideSidebar();

  const cat = state.catalog;
  if (!cat) { setPage('<div class="page-body"><p style="color:var(--text-muted);font-family:var(--font-mono)">Loading catalog…</p></div>'); return; }

  const { meta, contributors, categories } = cat;

  // Hero tree panel
  const treeItems = categories.map((c, i) => {
    const isLast = i === categories.length - 1;
    const connector = isLast ? '└──' : '├──';
    const count = c.projects.length;
    return `<div class="tree-item" onclick="navigate('#/category/${c.id}')">
      <span class="tree-connector">${connector}</span>
      <span class="tree-icon">▸</span>
      <span class="tree-name">${escapeHtml(c.path)}/</span>
      ${count > 0
        ? `<span class="tree-badge">${count} file${count > 1 ? 's' : ''}</span>`
        : `<span class="tree-count">—</span>`}
    </div>`;
  }).join('');

  // Category cards
  const catCards = categories.map(c => `
    <div class="category-card" onclick="navigate('#/category/${c.id}')">
      <div class="cat-card-symbol">${escapeHtml(c.symbol)}</div>
      <div class="cat-card-title">${escapeHtml(c.title)}</div>
      <div class="cat-card-desc">${escapeHtml(c.description.slice(0, 120))}…</div>
      <div class="cat-card-footer">
        <span class="cat-card-count">
          <span>${c.projects.length}</span> project${c.projects.length !== 1 ? 's' : ''}
        </span>
        <span class="cat-card-arrow">→</span>
      </div>
    </div>
  `).join('');

  // Contributor cards
  const contribCards = contributors.map(c => `
    <div class="contributor-card">
      <div class="contrib-header">
        <div class="contrib-avatar">${escapeHtml(c.initials)}</div>
        <div class="contrib-meta">
          <div class="contrib-name">${escapeHtml(c.name)}</div>
          <div class="contrib-institution">${escapeHtml(c.institution)}</div>
          <div class="contrib-degree">${escapeHtml(c.degree)}</div>
        </div>
      </div>
      <div class="contrib-body">
        <div class="contrib-focus">${escapeHtml(c.focus)}</div>
        <p class="contrib-bio">${escapeHtml(c.bio)}</p>
      </div>
      <div class="contrib-tags">${c.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
      <a href="https://github.com/${c.github}" target="_blank" rel="noopener" class="contrib-gh-link">
        ${githubSvg(13)} github.com/${escapeHtml(c.github)}
      </a>
    </div>
  `).join('');

  setPage(`
    <!-- HERO -->
    <section class="hero">
      <div class="hero-bg" aria-hidden="true"></div>
      <div class="hero-content">
        <div class="hero-eyebrow">
          <span class="hero-eyebrow-dot"></span>
          <span class="hero-eyebrow-text">Collaborative Scientific Computing Repository</span>
        </div>
        <h1 class="hero-title">
          <span class="hero-title-line">My</span>
          <span class="hero-title-italic">Code</span>
          <span class="hero-title-sub">Laboratory</span>
        </h1>
        <p class="hero-desc">${escapeHtml(meta.description)}</p>
        <div class="hero-stats">
          <div class="hero-stat">
            <span class="stat-num" id="stat-projects">${meta.stats.projects}</span>
            <span class="stat-label">Projects</span>
          </div>
          <div class="hero-stat">
            <span class="stat-num">${meta.stats.categories}</span>
            <span class="stat-label">Categories</span>
          </div>
          <div class="hero-stat">
            <span class="stat-num">${contributors.length}</span>
            <span class="stat-label">Contributors</span>
          </div>
          <div class="hero-stat">
            <span class="stat-num">${meta.stats.languages}</span>
            <span class="stat-label">Languages</span>
          </div>
        </div>
        <div class="hero-actions">
          <button class="btn btn-primary" onclick="navigate('#/library')">Browse Library</button>
          <a href="${CONFIG.github}" target="_blank" rel="noopener" class="btn btn-outline">
            ${githubSvg()} GitHub Repository
          </a>
        </div>
      </div>
      <div class="hero-panel" aria-hidden="true">
        <div class="panel-header">
          <div class="panel-dots">
            <span class="panel-dot pd-red"></span>
            <span class="panel-dot pd-amber"></span>
            <span class="panel-dot pd-green"></span>
          </div>
          <span class="panel-title">Repository Index</span>
        </div>
        <div class="panel-body">
          <div class="panel-path">
            <span class="p-repo">sabhineet</span>
            <span class="p-sep">/</span>
            <span class="p-dir">computational-physics-library</span>
            <span class="p-sep">/</span>
            <span class="p-dir">codes</span>
          </div>
          ${treeItems}
        </div>
      </div>
    </section>

    <!-- CATEGORIES -->
    <section class="home-section">
      <div class="container">
        <span class="section-label">01 — Library</span>
        <h2 class="section-title">Repository Categories</h2>
        <p class="section-desc">Browse by computational domain. Each category contains algorithm implementations, worked examples, and reference material.</p>
        <div class="categories-grid">${catCards}</div>
      </div>
    </section>

    <!-- CONTRIBUTORS -->
    <section class="home-section">
      <div class="container">
        <span class="section-label">02 — Contributors</span>
        <h2 class="section-title">Research Team</h2>
        <p class="section-desc">Graduate physics students building and maintaining this archive as part of their academic work.</p>
        <div class="contributors-grid">${contribCards}</div>
      </div>
    </section>

    <!-- GETTING STARTED -->
    <section class="home-section">
      <div class="container">
        <span class="section-label">03 — Documentation</span>
        <h2 class="section-title">Getting Started</h2>
        <p class="section-desc">Clone the repository and run any script locally. All code is self-contained and documented.</p>
        <div class="docs-grid">
          <div class="doc-block">
            <h3 class="doc-block-title">
              <span class="doc-icon">▶</span> Installation
            </h3>
            <p class="doc-text">Clone the repository and navigate to any category folder:</p>
            <div class="doc-code">git clone ${CONFIG.github}.git
cd computational-physics-library
pip install numpy scipy matplotlib</div>
            <p class="doc-text">Run any Python script directly:</p>
            <div class="doc-code">cd codes/Root-Finding
python Bisection_Method.py</div>
          </div>
          <div class="doc-block">
            <h3 class="doc-block-title">
              <span class="doc-icon">⊞</span> Repository Structure
            </h3>
            <div class="doc-code">codes/
├── Root-Finding/
│   ├── Bisection_Method.py
│   ├── Newton_Raphson_Method.py
│   └── README.md
├── System_of_Linear_Equations/
│   ├── Gauss_Elimination.py
│   └── LU_decomposition.py
├── Integration/
├── Differentiation/
└── …</div>
          </div>
          <div class="doc-block">
            <h3 class="doc-block-title">
              <span class="doc-icon">⊕</span> Contributing
            </h3>
            <ol class="steps-list">
              ${['Fork the repository on GitHub and clone locally.',
                 'Create a branch: <code>git checkout -b feature/method-name</code>',
                 'Add your code to the appropriate category folder with a docstring.',
                 'Include a brief README.md describing the algorithm and usage.',
                 'Open a Pull Request — we review within 48 hours.']
                .map((s, i) => `<li class="step-item"><span class="step-num">0${i+1}</span><span>${s}</span></li>`)
                .join('')}
            </ol>
          </div>
          <div class="doc-block">
            <h3 class="doc-block-title">
              <span class="doc-icon">⬡</span> Dependencies
            </h3>
            <div class="doc-code">numpy     &gt;= 1.24   # Array operations
scipy     &gt;= 1.11   # Scientific algorithms
matplotlib &gt;= 3.7  # Visualization
sympy     &gt;= 1.12   # Symbolic computation</div>
            <p class="doc-text" style="margin-top:10px">All codes target Python 3.10+. No additional build system required.</p>
          </div>
        </div>
      </div>
    </section>

    ${renderFooter()}
  `);
}

/* ══════════════════════════════════════════════════════════
   LIBRARY PAGE
══════════════════════════════════════════════════════════ */
function renderLibrary() {
  setTitle('Library');
  hideSidebar();

  const { categories } = state.catalog;
  const totalProjects = categories.reduce((s, c) => s + c.projects.length, 0);

  const catSections = categories.map(cat => {
    const projRows = cat.projects.length > 0
      ? cat.projects.map(p => projectRow(cat, p)).join('')
      : `<div class="empty-state" style="padding:24px">
           <span class="empty-icon" style="font-size:1.2rem">—</span>
           <p class="empty-desc">Coming soon. <a href="${CONFIG.github}" target="_blank">Contribute on GitHub ↗</a></p>
         </div>`;

    return `
      <div style="margin-bottom:48px">
        <div style="display:flex;align-items:baseline;gap:14px;margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid var(--border)">
          <span style="font-family:var(--font-mono);font-size:1.1rem;color:var(--accent)">${escapeHtml(cat.symbol)}</span>
          <h2 style="font-family:var(--font-display);font-size:1.25rem;color:var(--text-primary);cursor:pointer"
              onclick="navigate('#/category/${cat.id}')">${escapeHtml(cat.title)}</h2>
          <span style="font-family:var(--font-mono);font-size:0.62rem;color:var(--text-muted);margin-left:auto">
            ${cat.projects.length} project${cat.projects.length !== 1 ? 's' : ''}
          </span>
        </div>
        <p style="font-family:var(--font-body);font-size:0.84rem;color:var(--text-muted);margin-bottom:14px;line-height:1.7">
          ${escapeHtml(cat.description)}
        </p>
        ${projRows}
      </div>`;
  }).join('');

  setPage(`
    <div class="page-header">
      <div class="page-header-inner">
        ${breadcrumbs([])}
        <h1 class="page-title">Library</h1>
        <p class="page-desc">All ${totalProjects} implementations across ${categories.length} computational domains.</p>
      </div>
    </div>
    <div class="page-body">
      <div class="lib-search-bar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" placeholder="Filter by name, tag, or description…" id="lib-filter" oninput="filterLibrary(this.value)" />
      </div>
      <div id="lib-body">${catSections}</div>
    </div>
    ${renderFooter()}
  `);
}

function filterLibrary(query) {
  const q = query.toLowerCase().trim();
  const { categories } = state.catalog;

  document.querySelectorAll('#lib-body > div').forEach((section, i) => {
    const cat = categories[i];
    if (!cat) return;
    const rows = section.querySelectorAll('.project-row');
    let visible = 0;

    rows.forEach(row => {
      const proj = cat.projects[parseInt(row.dataset.projIdx)];
      if (!proj) return;
      const match = !q
        || proj.title.toLowerCase().includes(q)
        || proj.description.toLowerCase().includes(q)
        || (proj.tags || []).some(t => t.toLowerCase().includes(q));
      row.style.display = match ? '' : 'none';
      if (match) visible++;
    });

    const catMatch = !q || cat.title.toLowerCase().includes(q)
                        || cat.description.toLowerCase().includes(q);
    section.style.display = (catMatch || visible > 0) ? '' : 'none';
  });
}

/* ══════════════════════════════════════════════════════════
   CATEGORY PAGE
══════════════════════════════════════════════════════════ */
function renderCategory(catId) {
  const cat = getCategoryById(catId);
  if (!cat) { renderHome(); return; }

  setTitle(cat.title);
  showSidebar(catId, null);

  const projRows = cat.projects.length > 0
    ? `<div class="project-list">${cat.projects.map((p, i) => projectRow(cat, p, i)).join('')}</div>`
    : `<div class="empty-state">
         <span class="empty-icon">∅</span>
         <h3 class="empty-title">No implementations yet</h3>
         <p class="empty-desc">
           This category is reserved for future content.<br>
           <a href="${CONFIG.github}" target="_blank" rel="noopener">Contribute on GitHub ↗</a>
         </p>
       </div>`;

  setPage(`
    <div class="page-header">
      <div class="page-header-inner">
        ${breadcrumbs([{ label: cat.title, action: '' }])}
        <h1 class="page-title">
          <span style="font-family:var(--font-mono);color:var(--accent);font-size:0.6em;vertical-align:middle;margin-right:10px">${escapeHtml(cat.symbol)}</span>
          ${escapeHtml(cat.title)}
        </h1>
        <p class="page-desc">${escapeHtml(cat.description)}</p>
      </div>
    </div>
    <div class="page-body">
      <div class="project-list-header">
        <span class="list-label">IMPLEMENTATIONS</span>
        <span class="list-count">${cat.projects.length} file${cat.projects.length !== 1 ? 's' : ''}</span>
      </div>
      ${projRows}
    </div>
    ${renderFooter()}
  `);
}

function projectRow(cat, proj, idx = 0) {
  const tags = (proj.tags || []).map(t => `<span class="proj-tag">${escapeHtml(t)}</span>`).join('');
  return `
    <div class="project-row" data-proj-idx="${idx}" onclick="navigate('#/project/${cat.id}/${proj.id}')">
      <div>
        <div class="proj-title">${escapeHtml(proj.title)}</div>
        <div class="proj-desc">${escapeHtml(proj.description)}</div>
        <div class="proj-tags">${tags}</div>
      </div>
      <div class="proj-actions">
        <span class="proj-file-badge">.${proj.type}</span>
        <a href="${githubBrowseUrl(cat.path, proj.file)}"
           target="_blank" rel="noopener"
           class="proj-gh-btn"
           onclick="event.stopPropagation()">
          ${githubSvg(11)} View on GitHub
        </a>
      </div>
    </div>`;
}

/* ══════════════════════════════════════════════════════════
   PROJECT PAGE
══════════════════════════════════════════════════════════ */
async function renderProject(catId, projId) {
  const cat  = getCategoryById(catId);
  const proj = getProjectById(catId, projId);
  if (!cat || !proj) { renderCategory(catId); return; }

  setTitle(`${proj.title} — ${cat.title}`);
  showSidebar(catId, projId);
  showLoader();

  // Prev/Next
  const idx = cat.projects.findIndex(p => p.id === projId);
  const prev = idx > 0 ? cat.projects[idx - 1] : null;
  const next  = idx < cat.projects.length - 1 ? cat.projects[idx + 1] : null;

  const prevBtn = prev
    ? `<div class="proj-nav-btn" onclick="navigate('#/project/${cat.id}/${prev.id}')">
         <span class="proj-nav-dir">← Previous</span>
         <span class="proj-nav-name">${escapeHtml(prev.title)}</span>
       </div>` : '<div></div>';
  const nextBtn = next
    ? `<div class="proj-nav-btn next" onclick="navigate('#/project/${cat.id}/${next.id}')">
         <span class="proj-nav-dir">Next →</span>
         <span class="proj-nav-name">${escapeHtml(next.title)}</span>
       </div>` : '<div></div>';

  const tags = (proj.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('');
  const ghUrl = githubBrowseUrl(cat.path, proj.file);
  const rawUrl = githubRawUrl(cat.path, proj.file);

  const header = `
    <div class="project-header">
      ${breadcrumbs([
        { label: cat.title, action: `navigate('#/category/${cat.id}')` },
        { label: proj.title, action: '' }
      ])}
      <div class="project-meta-row">
        <span class="meta-badge ${proj.type}">.${proj.type}</span>
        <span class="meta-badge">${escapeHtml(proj.file)}</span>
        ${proj.complexity ? `<span class="meta-badge">${escapeHtml(proj.complexity)}</span>` : ''}
      </div>
      <h1 class="project-title">${escapeHtml(proj.title)}</h1>
      <p class="project-description">${escapeHtml(proj.description)}</p>
      <div class="proj-tags" style="margin-bottom:0">${tags}</div>
      <div class="project-actions">
        <a href="${ghUrl}" target="_blank" rel="noopener" class="btn btn-ghost">
          ${githubSvg()} View on GitHub
        </a>
        <a href="${rawUrl}" download="${proj.file}" class="btn btn-ghost">
          ↓ Download
        </a>
        <button class="btn btn-ghost" onclick="copyFileUrl('${rawUrl}')">⎘ Copy URL</button>
      </div>
    </div>`;

  const navHtml = `<div class="proj-nav">${prevBtn}${nextBtn}</div>`;

  // Fetch and render content
  let contentHtml = '';
  try {
    const res = await fetch(rawUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    contentHtml = renderContentByType(proj.type, text, proj.file);
  } catch (err) {
    contentHtml = `
      <div class="code-viewer">
        <div class="fetch-error">
          <span class="error-title">⚠ Could not fetch file</span>
          <p>The file could not be retrieved from GitHub. Ensure the repository is public and the file path is correct.</p>
          <code>${escapeHtml(rawUrl)}</code>
          <p style="margin-top:10px">
            <a href="${ghUrl}" target="_blank" rel="noopener" style="color:var(--accent)">View directly on GitHub ↗</a>
          </p>
        </div>
      </div>`;
  }

  setPage(header + contentHtml + navHtml + renderFooter());
}

function renderContentByType(type, text, filename) {
  switch (type) {
    case 'py':   return renderPythonViewer(text, filename);
    case 'ipynb': {
      try { return renderNotebookViewer(JSON.parse(text), filename); }
      catch { return renderPythonViewer(text, filename); }
    }
    case 'md':   return renderMarkdownViewer(text);
    case 'html': return renderEmbeddedHtml(text);
    default:     return renderPythonViewer(text, filename);
  }
}

/* ── PYTHON VIEWER ─────────────────────────────────────── */
function renderPythonViewer(code, filename) {
  const escaped = escapeHtml(code);
  const lineCount = code.split('\n').length;
  return `
    <div class="code-viewer">
      <div class="viewer-toolbar">
        <div class="toolbar-filename">
          <span style="color:var(--text-muted)">python</span>
          <span class="ext">${escapeHtml(filename)}</span>
          <span style="color:var(--text-faint);font-size:0.62rem">${lineCount} lines</span>
        </div>
        <div class="toolbar-actions">
          <button class="toolbar-btn" id="copy-code-btn" onclick="copyCode()">⎘ Copy</button>
          <a href="${filename}" download class="toolbar-btn" style="text-decoration:none">↓ Raw</a>
        </div>
      </div>
      <div class="viewer-code-wrap">
        <pre class="language-python line-numbers"><code class="language-python" id="code-block">${escaped}</code></pre>
      </div>
    </div>`;
}

async function copyCode() {
  const el = document.getElementById('code-block');
  if (!el) return;
  try {
    await navigator.clipboard.writeText(el.textContent);
    const btn = document.getElementById('copy-code-btn');
    if (btn) { btn.textContent = '✓ Copied'; btn.classList.add('copied'); }
    setTimeout(() => {
      if (btn) { btn.innerHTML = '⎘ Copy'; btn.classList.remove('copied'); }
    }, 2000);
  } catch { /* silent fail */ }
}

async function copyFileUrl(url) {
  try { await navigator.clipboard.writeText(url); } catch { /* silent fail */ }
}

/* ── MARKDOWN VIEWER ───────────────────────────────────── */
function renderMarkdownViewer(md) {
  let html = '';
  if (window.marked) {
    marked.setOptions({ breaks: true, gfm: true });
    html = marked.parse(md);
  } else {
    html = `<pre style="white-space:pre-wrap;font-family:var(--font-mono);font-size:0.8rem;color:var(--text-secondary)">${escapeHtml(md)}</pre>`;
  }
  return `<div class="md-viewer">${html}</div>`;
}

/* ── NOTEBOOK VIEWER ───────────────────────────────────── */
function renderNotebookViewer(nb) {
  if (!nb.cells || !Array.isArray(nb.cells)) {
    return `<div class="code-viewer"><div class="fetch-error"><span class="error-title">Invalid notebook format</span></div></div>`;
  }

  const cells = nb.cells.map(cell => {
    const src = Array.isArray(cell.source) ? cell.source.join('') : (cell.source || '');

    if (cell.cell_type === 'markdown') {
      const html = window.marked ? marked.parse(src) : `<pre>${escapeHtml(src)}</pre>`;
      return `<div class="nb-cell nb-md-cell">${html}</div>`;
    }

    if (cell.cell_type === 'code') {
      const highlighted = window.Prism
        ? Prism.highlight(src, Prism.languages.python, 'python')
        : escapeHtml(src);

      let outputHtml = '';
      if (cell.outputs && cell.outputs.length) {
        outputHtml = cell.outputs.map(out => {
          if (out.output_type === 'stream') {
            const t = Array.isArray(out.text) ? out.text.join('') : (out.text || '');
            return `<div class="nb-output"><pre>${escapeHtml(t)}</pre></div>`;
          }
          if (out.output_type === 'display_data' || out.output_type === 'execute_result') {
            if (out.data?.['image/png']) {
              return `<div class="nb-output"><img src="data:image/png;base64,${out.data['image/png']}" alt="cell output" /></div>`;
            }
            if (out.data?.['text/plain']) {
              const t = Array.isArray(out.data['text/plain']) ? out.data['text/plain'].join('') : out.data['text/plain'];
              return `<div class="nb-output"><pre>${escapeHtml(t)}</pre></div>`;
            }
          }
          return '';
        }).join('');
      }

      return `
        <div class="nb-cell nb-code-cell">
          <div class="nb-code-header">
            <span class="nb-in-label">In</span>
          </div>
          <pre class="language-python"><code>${highlighted}</code></pre>
          ${outputHtml}
        </div>`;
    }
    return '';
  }).join('');

  return `<div class="nb-viewer">${cells}</div>`;
}

/* ── HTML EMBED ────────────────────────────────────────── */
function renderEmbeddedHtml(html) {
  return `
    <div class="code-viewer">
      <div style="background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--radius-md);padding:12px;margin-bottom:12px;font-family:var(--font-mono);font-size:0.7rem;color:var(--text-muted)">
        ℹ Custom HTML content rendered below
      </div>
      <div style="background:#fff;border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--border)">
        <iframe srcdoc="${escapeHtml(html)}" style="width:100%;min-height:500px;border:none;display:block" title="Project HTML"></iframe>
      </div>
    </div>`;
}

/* ══════════════════════════════════════════════════════════
   ABOUT PAGE
══════════════════════════════════════════════════════════ */
function renderAbout() {
  setTitle('About');
  hideSidebar();

  const { contributors, meta } = state.catalog;

  const contribCards = contributors.map(c => `
    <div class="contributor-card">
      <div class="contrib-header">
        <div class="contrib-avatar">${escapeHtml(c.initials)}</div>
        <div class="contrib-meta">
          <div class="contrib-name">${escapeHtml(c.name)}</div>
          <div class="contrib-institution">${escapeHtml(c.institution)}</div>
          <div class="contrib-degree">${escapeHtml(c.degree)}</div>
        </div>
      </div>
      <div class="contrib-body">
        <div class="contrib-focus">${escapeHtml(c.focus)}</div>
        <p class="contrib-bio">${escapeHtml(c.bio)}</p>
      </div>
      <div class="contrib-tags">${c.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
      <a href="https://github.com/${c.github}" target="_blank" rel="noopener" class="contrib-gh-link">
        ${githubSvg(13)} github.com/${escapeHtml(c.github)}
      </a>
    </div>
  `).join('');

  setPage(`
    <div class="page-header">
      <div class="page-header-inner">
        ${breadcrumbs([{ label: 'about', action: '' }])}
        <h1 class="page-title">About MYCODELAB</h1>
        <p class="page-desc">A collaborative computational physics code archive.</p>
      </div>
    </div>
    <div class="about-section">
      <p class="about-intro">
        MYCODELAB is an open-source archive of numerical methods and computational physics algorithms,
        built and maintained by graduate physics students at UPES Dehradun, SPPU Pune, and the University of Sussex.
        The library is intended as both a personal reference and a publicly accessible educational resource —
        offering clean, documented implementations of standard algorithms encountered in a graduate physics curriculum.
      </p>
      <h2 class="about-h2">Contributors</h2>
      <div class="contributors-grid">${contribCards}</div>
      <div style="margin-top:48px;padding-top:32px;border-top:1px solid var(--border)">
        <h2 class="about-h2">Repository</h2>
        <p style="font-family:var(--font-body);font-size:0.9rem;color:var(--text-body);line-height:1.8;margin-bottom:16px">
          All source code is available on GitHub under the MIT License. Contributions, corrections, and additions are welcome via pull request.
        </p>
        <a href="${CONFIG.github}" target="_blank" rel="noopener" class="btn btn-outline">
          ${githubSvg()} ${CONFIG.github.replace('https://github.com/', 'github.com/')}
        </a>
      </div>
    </div>
    ${renderFooter()}
  `);
}

/* ══════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════ */
function renderFooter() {
  return `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="nav-logo" style="cursor:default">
            <span class="logo-mark">MCL</span>
            <span class="logo-sep">·</span>
            <span class="logo-name">MYCODELAB</span>
          </div>
          <p>Open-source computational physics code archive. Built by physics students, for everyone.</p>
        </div>
        <div class="footer-links">
          <a href="#/">Home</a>
          <a href="#/library">Library</a>
          <a href="#/about">About</a>
          <a href="${CONFIG.github}" target="_blank" rel="noopener">GitHub ↗</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2025 ${(state.catalog?.contributors || []).map(c => c.name).join(' & ')} · MIT License</span>
        <span>MYCODELAB · Computational Physics Library</span>
      </div>
    </footer>`;
}

/* ══════════════════════════════════════════════════════════
   SEARCH ENGINE
══════════════════════════════════════════════════════════ */
function buildSearchIndex() {
  state.searchIndex = [];
  const { categories } = state.catalog;

  categories.forEach(cat => {
    // Category entry
    state.searchIndex.push({
      type: 'category',
      title: cat.title,
      symbol: cat.symbol,
      context: 'Category',
      keywords: [cat.title, ...(cat.keywords || [])],
      action: `navigate('#/category/${cat.id}')`,
    });
    // Project entries
    cat.projects.forEach(proj => {
      state.searchIndex.push({
        type: 'project',
        title: proj.title,
        symbol: cat.symbol,
        context: cat.title,
        keywords: [
          proj.title, proj.description,
          ...(proj.tags || []),
          proj.file, proj.type,
        ],
        action: `navigate('#/project/${cat.id}/${proj.id}')`,
      });
    });
  });
}

function searchQuery(q) {
  if (!q || q.length < 2) return [];
  const ql = q.toLowerCase();
  return state.searchIndex
    .filter(item => item.keywords.some(k => k && k.toLowerCase().includes(ql)))
    .slice(0, 12);
}

function highlightMatch(str, q) {
  if (!q) return escapeHtml(str);
  const idx = str.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return escapeHtml(str);
  return escapeHtml(str.slice(0, idx))
    + `<mark>${escapeHtml(str.slice(idx, idx + q.length))}</mark>`
    + escapeHtml(str.slice(idx + q.length));
}

function renderSearchResults(q) {
  const results = searchQuery(q);
  const container = DOM.searchResults;
  if (!container) return;
  state.searchFocusIdx = -1;

  if (!q || q.length < 2) {
    container.innerHTML = '<div class="search-empty"><p>Start typing to search the library…</p></div>';
    return;
  }
  if (!results.length) {
    container.innerHTML = `<div class="search-empty"><p>No results for "<strong>${escapeHtml(q)}</strong>"</p></div>`;
    return;
  }

  container.innerHTML = results.map((r, i) => `
    <div class="search-result-item" tabindex="-1"
         data-idx="${i}" data-action="${escapeHtml(r.action)}"
         onclick="${r.action};closeSearch()">
      <span class="sr-icon">${escapeHtml(r.symbol)}</span>
      <div class="sr-body">
        <div class="sr-title">${highlightMatch(r.title, q)}</div>
        <div class="sr-context">${escapeHtml(r.context)}</div>
      </div>
      <span class="sr-type">${r.type}</span>
    </div>
  `).join('');
}

function openSearch() {
  state.searchOpen = true;
  DOM.searchOverlay.classList.add('visible');
  DOM.searchOverlay.setAttribute('aria-hidden', 'false');
  setTimeout(() => DOM.searchInput?.focus(), 50);
}

function closeSearch() {
  state.searchOpen = false;
  DOM.searchOverlay.classList.remove('visible');
  DOM.searchOverlay.setAttribute('aria-hidden', 'true');
  if (DOM.searchInput) DOM.searchInput.value = '';
  if (DOM.searchResults) DOM.searchResults.innerHTML = '<div class="search-empty"><p>Start typing to search the library…</p></div>';
}

function navigateSearchResults(dir) {
  const items = DOM.searchResults.querySelectorAll('.search-result-item');
  if (!items.length) return;
  items[state.searchFocusIdx]?.classList.remove('focused');
  state.searchFocusIdx = Math.max(0, Math.min(items.length - 1, state.searchFocusIdx + dir));
  items[state.searchFocusIdx]?.classList.add('focused');
  items[state.searchFocusIdx]?.scrollIntoView({ block: 'nearest' });
}

function activateSearchResult() {
  const items = DOM.searchResults.querySelectorAll('.search-result-item');
  const item = state.searchFocusIdx >= 0 ? items[state.searchFocusIdx] : items[0];
  if (item) item.click();
}

/* ══════════════════════════════════════════════════════════
   NAVIGATION BAR SCROLL EFFECT
══════════════════════════════════════════════════════════ */
function initScrollEffect() {
  window.addEventListener('scroll', () => {
    DOM.topNav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ══════════════════════════════════════════════════════════
   MOBILE MENU
══════════════════════════════════════════════════════════ */
function closeMobileMenu() {
  DOM.mobileMenu.classList.remove('open');
  DOM.navToggle.setAttribute('aria-expanded', 'false');
}

/* ══════════════════════════════════════════════════════════
   EVENT BINDINGS
══════════════════════════════════════════════════════════ */
function bindEvents() {
  // Router
  window.addEventListener('hashchange', onRouteChange);

  // Navbar scroll
  initScrollEffect();

  // Mobile hamburger
  DOM.navToggle?.addEventListener('click', () => {
    const isOpen = DOM.mobileMenu.classList.toggle('open');
    DOM.navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Sidebar toggle (mobile)
  DOM.sidebarToggle?.addEventListener('click', toggleSidebarMobile);

  // Sidebar backdrop (mobile close)
  DOM.sidebarBackdrop?.addEventListener('click', () => {
    state.sidebarOpen = false;
    DOM.sidebar.classList.remove('open');
    DOM.sidebarBackdrop.classList.remove('visible');
  });

  // Search trigger
  DOM.searchTrigger?.addEventListener('click', openSearch);
  DOM.searchBackdrop?.addEventListener('click', closeSearch);

  // Search input
  DOM.searchInput?.addEventListener('input', e => renderSearchResults(e.target.value));
  DOM.searchInput?.addEventListener('keydown', e => {
    if (e.key === 'Escape')     closeSearch();
    if (e.key === 'ArrowDown')  { e.preventDefault(); navigateSearchResults(1); }
    if (e.key === 'ArrowUp')    { e.preventDefault(); navigateSearchResults(-1); }
    if (e.key === 'Enter')      activateSearchResult();
  });

  // Global keyboard
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      state.searchOpen ? closeSearch() : openSearch();
    }
    if (e.key === 'Escape' && state.searchOpen) closeSearch();
  });
}

/* ══════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════ */
async function init() {
  bindEvents();
  showLoader();

  const ok = await loadCatalog();
  if (!ok) {
    DOM.pageRoot.innerHTML = `
      <div style="padding:60px 32px;text-align:center;font-family:var(--font-mono);color:var(--text-muted)">
        <div style="font-size:2rem;color:var(--text-faint);margin-bottom:16px">!</div>
        <p>Could not load catalog.json.<br>
        Ensure the file exists in the same directory as index.html.</p>
      </div>`;
    hideLoader();
    return;
  }

  // Render immediately from local catalog — no spinner wait
  onRouteChange();

  // Then sync GitHub in the background (silently updates stats + discovers new files)
  syncWithGitHubBackground();
}

document.addEventListener('DOMContentLoaded', init);
