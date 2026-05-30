/* ═══════════════════════════════════════════════════════
   MYCODELAB · js/project.js  v2
   Reads ?cat=&id= and renders the project page.
   Uses MCL.meta.github for all external links.
   ═══════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  MCL.initNavbar();
  MCL.Search.init();

  const params = new URLSearchParams(location.search);
  const catId  = params.get('cat');
  const projId = params.get('id');

  /* Wait for GitHub sync before rendering so auto-discovered
     projects are available when we look up ?cat= & ?id=     */
  MCL.ready.then(() => {
    const cat  = MCL.getCategory(catId);
    const proj = cat?.projects.find(p => p.id === projId);

    if (!cat || !proj) { renderNotFound(); return; }

    document.title = `${proj.title} — MYCODELAB`;

    buildSidebar(catId, projId);
    renderHeader(cat, proj);
    renderMeta(cat, proj);
    renderContent(cat, proj);

    MCL.initScrollReveal('.reveal');
    MCL.initCopyButtons();
  });

  /* ════════════════════════
     SIDEBAR
  ════════════════════════ */
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
               class="sidebar-proj-link ${(p.id === activeProjId && c.id === activeCatId) ? '--active' : ''}"
               role="listitem">${p.title}</a>
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
        btn.setAttribute('aria-expanded', String(open));
      });
    });

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

  /* ════════════════════════
     HEADER
  ════════════════════════ */
  function renderHeader (cat, proj) {
    const author   = MCL.getContributor(proj.author);
    const ghFolder = MCL.folderUrl(cat, proj);
    const ghRaw    = MCL.rawUrl(cat, proj);

    document.getElementById('projectHeader').innerHTML = `
      <div class="proj-detail-header">
        <nav class="proj-detail-breadcrumb breadcrumbs" aria-label="Breadcrumb">
          <a href="../index.html">Home</a>
          <span class="sep">/</span>
          <a href="library.html">Library</a>
          <span class="sep">/</span>
          <a href="library.html#${cat.id}" style="color:${cat.color}">${cat.name}</a>
          <span class="sep">/</span>
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
            <a href="${ghFolder}" target="_blank" rel="noopener" class="btn btn--outline">
              ${MCL.githubIcon} View on GitHub
            </a>
            <a href="${ghRaw}" target="_blank" rel="noopener" class="btn btn--ghost">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download .py
            </a>
          </div>
        </div>
      </div>
    `;
  }

  /* ════════════════════════
     META STRIP
  ════════════════════════ */
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
          <span class="proj-meta-key">Method</span>
          <span class="proj-meta-val">${proj.method}</span>
        </div>
        <div class="proj-meta-item" role="listitem">
          <span class="proj-meta-key">Tags</span>
          <span class="proj-meta-val">${proj.tags.slice(0, 3).join(', ')}</span>
        </div>
      </div>
    `;
  }

  /* ════════════════════════
     CONTENT AREA
     In a live deployment, this fetches the real .py file
     from GitHub raw via MCL.rawUrl(). For a static demo
     we render a representative sample.
  ════════════════════════ */
  function renderContent (cat, proj) {
    const area = document.getElementById('projectContent');
    if (!area) return;

    /* -- Try to fetch actual source from GitHub raw -- */
    const rawUrl = MCL.rawUrl(cat, proj);

    /* Fetch wrapper — falls back to demo code on error */
    fetchOrDemo(rawUrl, proj).then(source => {

      const allProjs = MCL.allProjects;
      const idx  = allProjs.findIndex(p => p.id === proj.id);
      const prev = allProjs[idx - 1];
      const next = allProjs[idx + 1];

      area.innerHTML = `
        <div class="proj-content-area">

          <div class="code-viewer reveal" aria-label="Source: ${proj.file}">
            <div class="code-viewer-header">
              <span class="code-viewer-filename">${proj.file}</span>
              <div class="code-viewer-actions">
                <button class="copy-btn btn btn--ghost" id="copyCodeBtn">copy</button>
                <a href="${rawUrl}" target="_blank" rel="noopener" class="btn btn--ghost">
                  ${MCL.githubIcon} raw
                </a>
              </div>
            </div>
            <div class="code-viewer-body">
              <pre aria-label="Python source code">${MCL.highlightPython(source)}</pre>
            </div>
          </div>

          <div class="output-block reveal" aria-label="Expected output">
            <div class="output-block-header">Expected Output</div>
            <div class="output-block-body">${proj.output}</div>
          </div>

          <div style="margin-top:var(--sp-xl);display:flex;gap:6px;flex-wrap:wrap">
            ${proj.tags.map(t => `
              <span style="font-family:var(--font-mono);font-size:.62rem;
                           color:var(--tx-02);background:var(--bg-02);
                           border:1px solid var(--bd-00);border-radius:var(--r-xs);
                           padding:3px 9px">${t}</span>
            `).join('')}
          </div>

          <nav class="proj-related" aria-label="Adjacent projects">
            ${prev ? `
              <a href="project.html?cat=${prev.categoryId}&id=${prev.id}" class="proj-related-link">
                <span class="proj-related-dir">← Previous</span>
                <span class="proj-related-name">${prev.title}</span>
              </a>` : '<span></span>'}
            ${next ? `
              <a href="project.html?cat=${next.categoryId}&id=${next.id}"
                 class="proj-related-link proj-related-link--next">
                <span class="proj-related-dir">Next →</span>
                <span class="proj-related-name">${next.title}</span>
              </a>` : '<span></span>'}
          </nav>
        </div>
      `;

      /* Wire copy-code button */
      document.getElementById('copyCodeBtn')?.addEventListener('click', function () {
        navigator.clipboard.writeText(source).then(() => {
          this.textContent = 'copied!';
          this.classList.add('--copied');
          setTimeout(() => { this.textContent = 'copy'; this.classList.remove('--copied'); }, 2000);
        });
      });

      MCL.initScrollReveal('.reveal');
    });
  }

  /* ════════════════════════
     FETCH HELPER
     Attempts GitHub raw fetch; falls back to demo code.
  ════════════════════════ */
  async function fetchOrDemo (url, proj) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        if (text && text.trim().length > 10) return text;
      }
    } catch (_) { /* network error — use demo */ }
    return buildDemoCode(proj);
  }

  /* ════════════════════════
     DEMO CODE GENERATOR
     Representative Python for when real file not yet
     uploaded to the repo.
  ════════════════════════ */
  function buildDemoCode (proj) {
    const author = MCL.getContributor(proj.author);
    const header = `"""
${proj.title}
${'─'.repeat(Math.min(proj.title.length, 60))}
Method      : ${proj.method}
Author      : ${author ? author.name : proj.author}
Institution : ${author ? author.institution : ''}
File        : ${proj.file}

Description:
    ${proj.description}

Usage:
    python ${proj.file}

Expected output:
    ${proj.output}
"""

import numpy as np
import matplotlib.pyplot as plt
`;

    const bodies = {

      'bisection': `

def bisection(f, a, b, tol=1e-10, max_iter=200):
    """
    Bisection method for root finding on [a, b].

    Parameters
    ----------
    f        : callable   Function f(x)
    a, b     : float      Bracket endpoints with f(a)*f(b) < 0
    tol      : float      Convergence tolerance
    max_iter : int        Maximum iterations

    Returns
    -------
    root     : float      Approximated root
    history  : list[dict] Iteration history
    """
    if f(a) * f(b) >= 0:
        raise ValueError("f(a) and f(b) must have opposite signs.")

    history = []
    for i in range(max_iter):
        c  = (a + b) / 2.0
        fc = f(c)
        history.append({'iter': i + 1, 'x': c, 'fx': fc})

        if abs(fc) < tol or (b - a) / 2.0 < tol:
            break
        if f(a) * fc < 0:
            b = c
        else:
            a = c

    return c, history


# ── Example: find root of f(x) = x³ − 2x − 5 ──────────
f = lambda x: x**3 - 2*x - 5

root, hist = bisection(f, a=1.0, b=3.0)

print(f"Root   : x* = {root:.10f}")
print(f"f(x*)  : {f(root):.2e}")
print(f"Iters  : {len(hist)}")

# Convergence plot
iters  = [h['iter'] for h in hist]
errors = [abs(h['fx']) for h in hist]

fig, ax = plt.subplots(figsize=(7, 4))
ax.semilogy(iters, errors, 'o-', color='#c9a84c', lw=1.5, ms=4)
ax.set_xlabel('Iteration')
ax.set_ylabel('|f(x)|')
ax.set_title('Bisection Method — Convergence')
ax.grid(True, alpha=0.2)
plt.tight_layout()
plt.savefig('bisection_convergence.png', dpi=150)
plt.show()
`,

      'newton-raphson': `

def newton_raphson(f, df, x0, tol=1e-12, max_iter=100):
    """Newton-Raphson iteration."""
    x       = float(x0)
    history = [{'iter': 0, 'x': x, 'fx': f(x)}]

    for i in range(1, max_iter + 1):
        fx  = f(x)
        dfx = df(x)
        if abs(dfx) < 1e-15:
            raise ZeroDivisionError("Derivative near zero.")
        x  -= fx / dfx
        history.append({'iter': i, 'x': x, 'fx': f(x)})
        if abs(f(x)) < tol:
            break

    return x, history


f  = lambda x: x**3 - 2*x - 5
df = lambda x: 3*x**2 - 2

root, hist = newton_raphson(f, df, x0=2.0)
print(f"Root: x* = {root:.12f}  ({len(hist)-1} iterations)")
`,

      'rk4': `

def rk4_step(f, t, y, h):
    """Single 4th-order Runge-Kutta step."""
    k1 = f(t,         y)
    k2 = f(t + h/2,   y + h*k1/2)
    k3 = f(t + h/2,   y + h*k2/2)
    k4 = f(t + h,     y + h*k3)
    return y + (h/6) * (k1 + 2*k2 + 2*k3 + k4)


def rk4_solve(f, t0, tf, y0, h=0.001):
    """Integrate dy/dt = f(t,y) from t0 to tf."""
    t    = np.arange(t0, tf + h, h)
    y    = np.zeros((len(t), len(np.atleast_1d(y0))))
    y[0] = y0
    for i in range(1, len(t)):
        y[i] = rk4_step(f, t[i-1], y[i-1], h)
    return t, y


# ── Nonlinear pendulum: θ'' + (g/l)sin(θ) = 0 ──────────
g, l = 9.81, 1.0

def pendulum(t, state):
    theta, omega = state
    return np.array([omega, -(g/l)*np.sin(theta)])

theta0     = np.radians(15)
t, sol     = rk4_solve(pendulum, 0, 20, y0=[theta0, 0.0])
energy     = 0.5 * sol[:, 1]**2 - (g/l)*np.cos(sol[:, 0])
drift      = np.max(np.abs(energy - energy[0])) / abs(energy[0])

print(f"Steps        : {len(t)}")
print(f"Energy drift : {drift:.2e}")

fig, axes = plt.subplots(1, 2, figsize=(10, 4))
axes[0].plot(t, np.degrees(sol[:, 0]), lw=1, color='#34d399')
axes[0].set_xlabel('t (s)'); axes[0].set_ylabel('θ (°)')
axes[0].set_title('Pendulum — RK4')
axes[1].plot(np.degrees(sol[:, 0]), sol[:, 1], lw=0.8, color='#34d399')
axes[1].set_xlabel('θ (°)'); axes[1].set_ylabel('ω (rad/s)')
axes[1].set_title('Phase portrait')
plt.tight_layout()
plt.savefig('rk4_pendulum.png', dpi=150)
plt.show()
`,

      'fft-analysis': `

# ── FFT Signal Analysis ──────────────────────────────────
fs   = 1000.0                          # sampling frequency (Hz)
N    = 4096                            # number of samples
t    = np.arange(N) / fs

# Synthetic signal: two sinusoids + noise
f1, f2 = 50.0, 120.0
signal = (1.5*np.sin(2*np.pi*f1*t)
        + 0.8*np.sin(2*np.pi*f2*t)
        + 0.3*np.random.randn(N))

# Apply Hann window before FFT
window   = np.hanning(N)
spectrum = np.fft.rfft(signal * window)
freqs    = np.fft.rfftfreq(N, 1/fs)
power    = 20*np.log10(np.abs(spectrum) / N + 1e-12)

# Dominant frequency
peak_idx  = np.argmax(np.abs(spectrum))
peak_freq = freqs[peak_idx]
print(f"Dominant frequency : {peak_freq:.3f} Hz")
print(f"Peak power         : {power[peak_idx]:.1f} dB")

fig, axes = plt.subplots(2, 1, figsize=(9, 6))
axes[0].plot(t[:300], signal[:300], lw=0.8, color='#f97316')
axes[0].set_xlabel('Time (s)'); axes[0].set_ylabel('Amplitude')
axes[0].set_title('Signal (first 300 samples)')
axes[1].plot(freqs, power, lw=0.9, color='#f97316')
axes[1].set_xlim(0, 300)
axes[1].set_xlabel('Frequency (Hz)'); axes[1].set_ylabel('Power (dB)')
axes[1].set_title('Power Spectrum (Hann window)')
plt.tight_layout()
plt.savefig('fft_spectrum.png', dpi=150)
plt.show()
`,

      'monte-carlo': `

# ── Monte Carlo Integration ──────────────────────────────
rng = np.random.default_rng(42)

def mc_integrate(f, a, b, N=1_000_000):
    """
    Estimate ∫_a^b f(x) dx using N random samples.
    Returns (estimate, std_error).
    """
    x        = rng.uniform(a, b, N)
    samples  = f(x)
    integral = (b - a) * samples.mean()
    std_err  = (b - a) * samples.std() / np.sqrt(N)
    return integral, std_err

# Estimate π via ∫₋₁¹ √(1−x²) dx = π/2
f       = lambda x: np.sqrt(np.maximum(1 - x**2, 0))
est, se = mc_integrate(f, -1, 1)
pi_est  = 2 * est

print(f"π estimate : {pi_est:.6f}")
print(f"True π     : {np.pi:.6f}")
print(f"Error      : {abs(pi_est - np.pi):.2e}")
print(f"Std error  : {2*se:.2e}")
`,
    };

    return header + (bodies[proj.id] || `

def compute(x, **kwargs):
    """
    ${proj.method} implementation.

    Parameters
    ----------
    x : array_like   Input values

    Returns
    -------
    result : ndarray   Computed output
    """
    x      = np.asarray(x, dtype=float)
    result = np.zeros_like(x)

    # TODO: implement ${proj.method}
    for i, xi in enumerate(x):
        result[i] = xi   # placeholder

    return result


# ── Example usage ────────────────────────────────────────
x      = np.linspace(-1, 1, 200)
result = compute(x)

print(f"Method : ${proj.method}")
print(f"Output : ${proj.output}")

plt.figure(figsize=(7, 4))
plt.plot(x, result, lw=1.5, color='#c9a84c')
plt.xlabel('x'); plt.ylabel('result')
plt.title('${proj.title}')
plt.tight_layout()
plt.show()
`);
  }

  /* ════════════════════════
     404
  ════════════════════════ */
  function renderNotFound () {
    const main = document.getElementById('pageMain');
    if (!main) return;
    main.innerHTML = `
      <div style="padding:80px 40px;text-align:center">
        <div style="font-family:var(--font-display);font-size:3rem;color:var(--tx-03);margin-bottom:16px">∅</div>
        <h1 style="font-family:var(--font-display);color:var(--tx-00);margin-bottom:12px">Project not found</h1>
        <p style="font-family:var(--font-serif);color:var(--tx-01);margin-bottom:24px">
          The requested project (cat=<code>${catId || '?'}</code>, id=<code>${projId || '?'}</code>)
          does not exist in the repository manifest.
        </p>
        <a href="library.html" class="btn btn--primary">Return to Library</a>
      </div>
    `;
  }

});
