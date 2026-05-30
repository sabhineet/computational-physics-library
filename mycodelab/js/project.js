/* ═══════════════════════════════════════════════════════
   MYCODELAB · js/project.js — Project detail controller
   Reads ?cat=&id= from URL and renders the project page
   ═══════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  MCL.initNavbar();
  MCL.Search.init();

  /* ── Parse URL params ── */
  const params = new URLSearchParams(location.search);
  const catId  = params.get('cat');
  const projId = params.get('id');

  const cat  = MCL.getCategory(catId);
  const proj = cat?.projects.find(p => p.id === projId);

  if (!cat || !proj) {
    renderNotFound();
    return;
  }

  /* ── Update page title ── */
  document.title = `${proj.title} — MYCODELAB`;

  /* ── Build sidebar ── */
  buildSidebar(catId, projId);

  /* ── Render header ── */
  renderHeader(cat, proj);

  /* ── Render meta strip ── */
  renderMeta(cat, proj);

  /* ── Render content ── */
  renderContent(proj);

  MCL.initScrollReveal('.reveal');
  MCL.initCopyButtons();

  /* ════════════════════════════════════
     SIDEBAR
  ════════════════════════════════════ */
  function buildSidebar (activeCatId, activeProjId) {
    const nav = document.getElementById('sidebarNav');
    if (!nav) return;

    nav.innerHTML = MCL.categories.map(c => `
      <div class="sidebar-cat" id="scat-${c.id}">
        <button class="sidebar-cat-btn ${c.id === activeCatId ? '--active --open' : ''}"
                aria-expanded="${c.id === activeCatId}"
                aria-controls="sproj-${c.id}"
                data-cat-id="${c.id}"
                style="--cat-color: ${c.color}">
          <span class="sidebar-cat-icon" aria-hidden="true">${c.icon}</span>
          <span class="sidebar-cat-name">${c.name}</span>
          <span class="sidebar-cat-count">${c.projects.length}</span>
          <svg class="sidebar-cat-chevron" width="10" height="10" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
        <div class="sidebar-projects ${c.id === activeCatId ? '--open' : ''}"
             id="sproj-${c.id}" role="list">
          ${c.projects.map(p => `
            <a href="project.html?cat=${c.id}&id=${p.id}"
               class="sidebar-proj-link ${p.id === activeProjId && c.id === activeCatId ? '--active' : ''}"
               role="listitem">
              ${p.title}
            </a>
          `).join('')}
        </div>
      </div>
    `).join('');

    nav.querySelectorAll('.sidebar-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id      = btn.dataset.catId;
        const projDiv = document.getElementById(`sproj-${id}`);
        const open    = projDiv.classList.toggle('--open');
        btn.classList.toggle('--open', open);
        btn.setAttribute('aria-expanded', open);
      });
    });

    /* Sidebar filter */
    const sidebarInput = document.getElementById('sidebarFilter');
    if (sidebarInput) {
      sidebarInput.addEventListener('input', () => {
        const q = sidebarInput.value.toLowerCase().trim();
        document.querySelectorAll('.sidebar-cat').forEach(el => {
          const name  = el.querySelector('.sidebar-cat-name')?.textContent.toLowerCase() || '';
          const links = el.querySelectorAll('.sidebar-proj-link');
          let anyMatch = !q || name.includes(q);
          links.forEach(a => {
            const match = !q || a.textContent.toLowerCase().includes(q);
            a.style.display = match ? '' : 'none';
            if (match) anyMatch = true;
          });
          el.style.display = anyMatch ? '' : 'none';
        });
      });
    }
  }

  /* ════════════════════════════════════
     HEADER
  ════════════════════════════════════ */
  function renderHeader (cat, proj) {
    const author = MCL.getContributor(proj.author);
    const ghUrl  = `https://github.com/mycodelab/codes/${cat.folder}/${proj.folder}/${proj.file}`;

    document.getElementById('projectHeader').innerHTML = `
      <div class="proj-detail-header">
        <nav class="proj-detail-breadcrumb breadcrumbs" aria-label="Breadcrumb">
          <a href="../index.html">Home</a>
          <span class="sep" aria-hidden="true">/</span>
          <a href="library.html">Library</a>
          <span class="sep" aria-hidden="true">/</span>
          <a href="library.html#${cat.id}" style="color:${cat.color}">${cat.name}</a>
          <span class="sep" aria-hidden="true">/</span>
          <span class="current" aria-current="page">${proj.title}</span>
        </nav>
        <div class="proj-detail-top">
          <div>
            <h1 class="proj-detail-title">${proj.title}</h1>
            <div class="proj-detail-method">
              <span style="color:var(--tx-03)">method — </span>${proj.method}
            </div>
            <p class="proj-detail-desc">${proj.description}</p>
          </div>
          <div class="proj-detail-actions">
            <a href="${ghUrl}" target="_blank" rel="noopener" class="btn btn--outline">
              ${MCL.githubIcon} View on GitHub
            </a>
            <button class="btn btn--ghost" id="downloadBtn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download
            </button>
          </div>
        </div>
      </div>
    `;

    /* Download simulated trigger */
    document.getElementById('downloadBtn')?.addEventListener('click', () => {
      alert(`In the live repository:\n\nwget ${ghUrl}`);
    });
  }

  /* ════════════════════════════════════
     META STRIP
  ════════════════════════════════════ */
  function renderMeta (cat, proj) {
    const author = MCL.getContributor(proj.author);
    document.getElementById('projectMeta').innerHTML = `
      <div class="proj-meta-strip" role="list" aria-label="Project metadata">
        <div class="proj-meta-item" role="listitem">
          <span class="proj-meta-key">Category</span>
          <span class="proj-meta-val" style="color:${cat.color}">${cat.name}</span>
        </div>
        <div class="proj-meta-item" role="listitem">
          <span class="proj-meta-key">Language</span>
          <span class="proj-meta-val">
            <span class="lang-badge ${MCL.langClass(proj.language)}">${proj.language}</span>
          </span>
        </div>
        <div class="proj-meta-item" role="listitem">
          <span class="proj-meta-key">File</span>
          <span class="proj-meta-val">${proj.file}</span>
        </div>
        <div class="proj-meta-item" role="listitem">
          <span class="proj-meta-key">Author</span>
          <span class="proj-meta-val">${author ? author.name : proj.author}</span>
        </div>
        <div class="proj-meta-item" role="listitem">
          <span class="proj-meta-key">Type</span>
          <span class="proj-meta-val">.${proj.type} source</span>
        </div>
        <div class="proj-meta-item" role="listitem">
          <span class="proj-meta-key">Tags</span>
          <span class="proj-meta-val">${proj.tags.slice(0, 3).join(', ')}</span>
        </div>
      </div>
    `;
  }

  /* ════════════════════════════════════
     CONTENT AREA
     Priority: index.html > .ipynb > README.md > .py
     For the demo, we render .py with simulated source
  ════════════════════════════════════ */
  function renderContent (proj) {
    const area = document.getElementById('projectContent');
    if (!area) return;

    /* In a real deployment, you'd fetch the file via GitHub raw API.
       Here we generate a representative simulation of the file. */
    const sampleCode = generateSampleCode(proj);

    /* Prev / Next navigation */
    const allProjs = MCL.allProjects;
    const idx      = allProjs.findIndex(p => p.id === proj.id);
    const prev     = allProjs[idx - 1];
    const next     = allProjs[idx + 1];

    area.innerHTML = `
      <div class="proj-content-area">

        <!-- Code viewer -->
        <div class="code-viewer reveal" aria-label="Source code: ${proj.file}">
          <div class="code-viewer-header">
            <span class="code-viewer-filename">${proj.file}</span>
            <div class="code-viewer-actions">
              <button class="copy-btn btn btn--ghost" id="copyCodeBtn" aria-label="Copy source code">copy</button>
              <a href="https://github.com/mycodelab/codes/${MCL.getCategory(catId)?.folder}/${proj.folder}/${proj.file}"
                 target="_blank" rel="noopener"
                 class="btn btn--ghost">${MCL.githubIcon} raw</a>
            </div>
          </div>
          <div class="code-viewer-body">
            <pre aria-label="Python source code">${MCL.highlightPython(sampleCode)}</pre>
          </div>
        </div>

        <!-- Expected output -->
        <div class="output-block reveal" aria-label="Expected output">
          <div class="output-block-header">Expected Output</div>
          <div class="output-block-body">${proj.output}</div>
        </div>

        <!-- Tags -->
        <div style="margin-top:var(--sp-xl);display:flex;gap:6px;flex-wrap:wrap">
          ${proj.tags.map(t =>
            `<span style="font-family:var(--font-mono);font-size:.62rem;color:var(--tx-02);
                          background:var(--bg-02);border:1px solid var(--bd-00);
                          border-radius:var(--r-xs);padding:3px 9px">${t}</span>`
          ).join('')}
        </div>

        <!-- Prev / Next -->
        <nav class="proj-related" aria-label="Adjacent projects">
          ${prev ? `
            <a href="project.html?cat=${prev.categoryId}&id=${prev.id}" class="proj-related-link">
              <span class="proj-related-dir">← Previous</span>
              <span class="proj-related-name">${prev.title}</span>
            </a>
          ` : '<span></span>'}
          ${next ? `
            <a href="project.html?cat=${next.categoryId}&id=${next.id}" class="proj-related-link proj-related-link--next">
              <span class="proj-related-dir">Next →</span>
              <span class="proj-related-name">${next.title}</span>
            </a>
          ` : '<span></span>'}
        </nav>
      </div>
    `;

    /* Wire copy button to full pre content */
    document.getElementById('copyCodeBtn')?.addEventListener('click', function () {
      navigator.clipboard.writeText(sampleCode).then(() => {
        this.textContent = 'copied!';
        this.classList.add('--copied');
        setTimeout(() => { this.textContent = 'copy'; this.classList.remove('--copied'); }, 2000);
      });
    });
  }

  /* ════════════════════════════════════
     SAMPLE CODE GENERATOR
     Produces representative Python matching each project
  ════════════════════════════════════ */
  function generateSampleCode (proj) {
    const header = `"""
${proj.title}
${'─'.repeat(proj.title.length)}
Method  : ${proj.method}
Author  : ${(MCL.getContributor(proj.author)?.name || proj.author)}
File    : ${proj.file}

Description:
    ${proj.description}
"""

import numpy as np
import matplotlib.pyplot as plt
`;

    const bodies = {
      'bisection': `

def bisection(f, a, b, tol=1e-10, max_iter=200):
    """Bisection method for root finding on [a, b]."""
    if f(a) * f(b) >= 0:
        raise ValueError("f(a) and f(b) must have opposite signs.")
    
    history = []
    for i in range(max_iter):
        c = (a + b) / 2.0
        fc = f(c)
        history.append({'iter': i + 1, 'x': c, 'fx': fc})
        
        if abs(fc) < tol or (b - a) / 2.0 < tol:
            break
        if f(a) * fc < 0:
            b = c
        else:
            a = c
    
    return c, history


# ── Example: f(x) = x³ - 2x - 5 ──
f = lambda x: x**3 - 2*x - 5

root, hist = bisection(f, 1.0, 3.0)

print(f"Root found: x* = {root:.8f}")
print(f"f(x*)     = {f(root):.2e}")
print(f"Iterations: {len(hist)}")

# Convergence plot
iters  = [h['iter'] for h in hist]
errors = [abs(h['fx']) for h in hist]

plt.figure(figsize=(7, 4))
plt.semilogy(iters, errors, 'o-', color='#c9a84c', linewidth=1.5, markersize=4)
plt.xlabel('Iteration')
plt.ylabel('|f(x)|')
plt.title('Bisection Method — Convergence')
plt.tight_layout()
plt.savefig('bisection_convergence.png', dpi=150)
plt.show()
`,
      'newton-raphson': `

def newton_raphson(f, df, x0, tol=1e-10, max_iter=100):
    """Newton-Raphson iteration for root finding."""
    x = x0
    history = [{'iter': 0, 'x': x, 'fx': f(x)}]
    
    for i in range(1, max_iter + 1):
        fx  = f(x)
        dfx = df(x)
        if abs(dfx) < 1e-14:
            raise ZeroDivisionError("Derivative too small — saddle point?")
        x -= fx / dfx
        history.append({'iter': i, 'x': x, 'fx': f(x)})
        if abs(f(x)) < tol:
            break
    
    return x, history


f  = lambda x: x**3 - 2*x - 5
df = lambda x: 3*x**2 - 2

root, hist = newton_raphson(f, df, x0=2.0)
print(f"Root: x* = {root:.10f}  ({len(hist) - 1} iterations)")
`,
      'rk4': `

def rk4_step(f, t, y, h):
    """Single RK4 step."""
    k1 = f(t,           y)
    k2 = f(t + h/2,     y + h*k1/2)
    k3 = f(t + h/2,     y + h*k2/2)
    k4 = f(t + h,       y + h*k3)
    return y + (h / 6) * (k1 + 2*k2 + 2*k3 + k4)


def rk4_solve(f, t0, tf, y0, h=0.001):
    """Integrate dy/dt = f(t, y) from t0 to tf with step h."""
    t      = np.arange(t0, tf + h, h)
    y      = np.zeros((len(t), len(np.atleast_1d(y0))))
    y[0]   = y0
    for i in range(1, len(t)):
        y[i] = rk4_step(f, t[i-1], y[i-1], h)
    return t, y


# ── Pendulum: θ'' + (g/l)sin(θ) = 0 ──
g, l = 9.81, 1.0

def pendulum(t, state):
    theta, omega = state
    return np.array([omega, -(g/l) * np.sin(theta)])

theta0 = np.radians(15)
t, sol = rk4_solve(pendulum, 0, 10, y0=[theta0, 0.0])

print(f"Integration complete. Steps: {len(t)}")
print(f"Energy drift: {abs(sol[-1, 1]**2/2 - sol[0, 1]**2/2):.2e}")
`,
    };

    return header + (bodies[proj.id] || `

def compute(x):
    """${proj.description}"""
    # Implementation of ${proj.method}
    result = np.zeros_like(x)
    for i, xi in enumerate(x):
        result[i] = xi  # placeholder
    return result


x = np.linspace(-1, 1, 100)
y = compute(x)

print(f"Method: ${proj.method}")
print(f"Output: ${proj.output}")
print("Done.")
`);
  }

  /* ════════════════════════════════════
     404 / NOT FOUND
  ════════════════════════════════════ */
  function renderNotFound () {
    const main = document.getElementById('pageMain');
    if (main) {
      main.innerHTML = `
        <div style="padding:80px 40px;text-align:center">
          <div style="font-family:var(--font-display);font-size:3rem;color:var(--tx-03);margin-bottom:16px">∅</div>
          <h1 style="font-family:var(--font-display);color:var(--tx-00);margin-bottom:12px">Project not found</h1>
          <p style="font-family:var(--font-serif);color:var(--tx-01);margin-bottom:24px">
            The requested project does not exist in the repository manifest.
          </p>
          <a href="library.html" class="btn btn--primary">Return to Library</a>
        </div>
      `;
    }
  }
});
