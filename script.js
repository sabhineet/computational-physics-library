/* ═══════════════════════════════════════════════
   PhysicsLab · Scientific Computing Repository
   script.js — Data, Rendering, Interactivity
   ═══════════════════════════════════════════════ */

'use strict';

/* ════════════════════════════════════
   DATA LAYER
════════════════════════════════════ */

const CATEGORIES = [
  { id: 'numerical-integration', name: 'Numerical Integration', icon: '∫', glyph: 'dx', color: '#39d98a', count: 3 },
  { id: 'differential-equations', name: 'Differential Equations', icon: '∂', glyph: 'dy', color: '#58a6ff', count: 4 },
  { id: 'linear-algebra', name: 'Linear Algebra', icon: '⊗', glyph: 'Ax', color: '#bc8cff', count: 3 },
  { id: 'root-finding', name: 'Root Finding', icon: '√', glyph: 'f(x)', color: '#f0a500', count: 2 },
  { id: 'interpolation', name: 'Interpolation', icon: '≈', glyph: 'p(x)', color: '#ff7b72', count: 2 },
  { id: 'fourier-methods', name: 'Fourier Methods', icon: 'ω', glyph: 'FFT', color: '#39d98a', count: 2 },
  { id: 'data-analysis', name: 'Data Analysis', icon: 'σ', glyph: 'χ²', color: '#58a6ff', count: 3 },
  { id: 'astrophysics', name: 'Astrophysics Codes', icon: '✦', glyph: 'GM', color: '#bc8cff', count: 3 },
  { id: 'spectroscopy', name: 'Spectroscopy Tools', icon: '⚡', glyph: 'λ', color: '#f0a500', count: 2 },
];

const PROJECTS = [
  /* ── Numerical Integration ── */
  {
    id: 'simpson',
    title: "Simpson's Rule Integration",
    topic: 'Numerical Integration',
    description: "Composite Simpson's 1/3 rule for definite integral approximation. Includes error estimation via Richardson extrapolation and comparison with exact analytic results.",
    method: "Composite Simpson's Rule",
    language: 'Python',
    author: 'Arjun Kapoor',
    github: 'https://github.com',
    output: "∫₀^π sin(x) dx ≈ 2.000000  [error < 1e-10]",
  },
  {
    id: 'gauss-quad',
    title: 'Gaussian Quadrature',
    topic: 'Numerical Integration',
    description: 'Gauss-Legendre quadrature nodes and weights up to order 20. Achieves near-machine-precision on smooth functions with far fewer evaluations than Newton-Cotes methods.',
    method: 'Gauss-Legendre Quadrature',
    language: 'Python',
    author: 'Arjun Kapoor',
    github: 'https://github.com',
    output: "∫₋₁¹ e^x dx ≈ 2.35040  (n=5 points, exact to 15 d.p.)",
  },
  {
    id: 'monte-carlo',
    title: 'Monte Carlo Integration',
    topic: 'Numerical Integration',
    description: 'Stochastic integration in 1D, 2D and 3D domains using importance sampling. Includes variance reduction techniques and convergence plots.',
    method: 'Monte Carlo / Importance Sampling',
    language: 'Julia',
    author: 'Priya Sharma',
    github: 'https://github.com',
    output: "π ≈ 3.14159  (N=10⁶ samples, σ ≈ 0.0016)",
  },

  /* ── Differential Equations ── */
  {
    id: 'rk4',
    title: 'Runge-Kutta 4th Order',
    topic: 'Differential Equations',
    description: "Classic RK4 integrator for systems of first-order ODEs. Applied to the pendulum, Lotka-Volterra predator-prey model, and SIR epidemiological model.",
    method: 'Runge-Kutta RK4',
    language: 'Python',
    author: 'Arjun Kapoor',
    github: 'https://github.com',
    output: "Pendulum period: T ≈ 2.0066 s  (θ₀=15°, l=1m)",
  },
  {
    id: 'finite-diff',
    title: 'Finite Difference PDE Solver',
    topic: 'Differential Equations',
    description: 'Explicit and implicit finite difference schemes for 1D heat equation and wave equation. Includes stability analysis (CFL condition) and animated output.',
    method: 'Finite Differences (FTCS, Crank-Nicolson)',
    language: 'Julia',
    author: 'Arjun Kapoor',
    github: 'https://github.com',
    output: "Heat diffusion stable for r = αΔt/Δx² ≤ 0.5",
  },
  {
    id: 'shooting',
    title: 'Shooting Method — BVP',
    topic: 'Differential Equations',
    description: 'Converts boundary value problems to IVP using Newton shooting. Solves quantum harmonic oscillator and buckling beam problems.',
    method: 'Shooting Method + Newton Iteration',
    language: 'Python',
    author: 'Priya Sharma',
    github: 'https://github.com',
    output: "Eigenvalues E_n = ℏω(n+½), n=0,1,2,... ✓",
  },
  {
    id: 'verlet',
    title: 'Velocity Verlet Integrator',
    topic: 'Differential Equations',
    description: "Symplectic integrator preserving phase-space volume for Hamiltonian systems. Applied to planetary orbits and molecular dynamics. Energy drift < 10⁻⁹ over 10⁵ steps.",
    method: 'Velocity Verlet (Symplectic)',
    language: 'C++',
    author: 'Arjun Kapoor',
    github: 'https://github.com',
    output: "Total energy drift: ΔE/E₀ = 8.3×10⁻¹⁰ (kepler orbit)",
  },

  /* ── Linear Algebra ── */
  {
    id: 'lu-decomp',
    title: 'LU Decomposition',
    topic: 'Linear Algebra',
    description: 'Partial-pivot LU factorisation with forward/back substitution for solving Ax=b. Includes determinant calculation and matrix inversion via LU.',
    method: 'LU Decomposition (Crout + Pivoting)',
    language: 'Python',
    author: 'Arjun Kapoor',
    github: 'https://github.com',
    output: "||Ax - b|| = 2.84e-15  (1000×1000 random system)",
  },
  {
    id: 'power-iter',
    title: 'Power Iteration & Eigenvalues',
    topic: 'Linear Algebra',
    description: 'Power iteration, inverse iteration and QR algorithm for eigenvalue problems. Applied to quantum Hamiltonian matrices and coupled-oscillator systems.',
    method: 'Power Iteration / QR Algorithm',
    language: 'Python',
    author: 'Priya Sharma',
    github: 'https://github.com',
    output: "λ_max = 4.0000 (5×5 tridiagonal H), error < 1e-12",
  },
  {
    id: 'conjugate-grad',
    title: 'Conjugate Gradient Solver',
    topic: 'Linear Algebra',
    description: 'Iterative CG solver for large sparse symmetric positive-definite systems. Used for finite-element discretisations of Poisson equation.',
    method: 'Conjugate Gradient',
    language: 'Julia',
    author: 'Arjun Kapoor',
    github: 'https://github.com',
    output: "Converged in 87 iterations, residual = 3.1e-14",
  },

  /* ── Root Finding ── */
  {
    id: 'newton-raphson',
    title: 'Newton-Raphson Method',
    topic: 'Root Finding',
    description: 'Classic and modified Newton-Raphson for single-variable and multivariate root finding. Includes convergence basin visualisation (fractal boundary plots).',
    method: 'Newton-Raphson',
    language: 'Python',
    author: 'Priya Sharma',
    github: 'https://github.com',
    output: "Root of f(x)=x³-2x-5: x* = 2.09455148  (5 iters)",
  },
  {
    id: 'bisection',
    title: 'Bisection & Brent Method',
    topic: 'Root Finding',
    description: 'Guaranteed-convergence bisection combined with secant/inverse quadratic interpolation (Brent). Applied to resonance frequencies and Fermi energy calculation.',
    method: "Bisection + Brent's Method",
    language: 'MATLAB',
    author: 'Priya Sharma',
    github: 'https://github.com',
    output: "Fermi energy of Na: E_F ≈ 3.23 eV  (converged, tol=1e-10)",
  },

  /* ── Interpolation ── */
  {
    id: 'cubic-spline',
    title: 'Cubic Spline Interpolation',
    topic: 'Interpolation',
    description: 'Natural and clamped cubic spline interpolation with tridiagonal system solving. Demonstrates Runge phenomenon avoidance vs. polynomial interpolation.',
    method: 'Cubic Splines',
    language: 'Python',
    author: 'Priya Sharma',
    github: 'https://github.com',
    output: "Max error (20 nodes): 3.4e-7  vs polynomial 1.8e+2",
  },
  {
    id: 'lagrange',
    title: 'Lagrange & Newton Interpolation',
    topic: 'Interpolation',
    description: "Barycentric Lagrange formula and Newton's divided difference table. Chebyshev node placement for optimal polynomial interpolation.",
    method: "Lagrange / Newton's Divided Differences",
    language: 'MATLAB',
    author: 'Arjun Kapoor',
    github: 'https://github.com',
    output: "Chebyshev nodes reduce max error by factor of ~600",
  },

  /* ── Fourier Methods ── */
  {
    id: 'fft',
    title: 'FFT Signal Analysis',
    topic: 'Fourier Methods',
    description: "Fast Fourier Transform for spectral analysis of astrophysical time-series data. Identifies periodic signals, power spectra, and applies windowing functions (Hann, Blackman).",
    method: 'FFT (Cooley-Tukey)',
    language: 'Python',
    author: 'Priya Sharma',
    github: 'https://github.com',
    output: "Dominant frequency: 1.247 Hz  (SNR = 34.2 dB)",
  },
  {
    id: 'dft-convolution',
    title: 'DFT Convolution & Filters',
    topic: 'Fourier Methods',
    description: 'Convolution theorem implementation for fast polynomial multiplication and digital filtering. Includes low-pass, high-pass and Gaussian smoothing kernels.',
    method: 'DFT Convolution Theorem',
    language: 'Julia',
    author: 'Priya Sharma',
    github: 'https://github.com',
    output: "Filter reduces noise σ from 0.34 → 0.02 (Gaussian kernel)",
  },

  /* ── Data Analysis ── */
  {
    id: 'least-squares',
    title: 'Least Squares Curve Fitting',
    topic: 'Data Analysis',
    description: 'Linear and nonlinear least squares with uncertainty propagation. Fits Planck blackbody curve to stellar spectral data to extract temperature.',
    method: 'Least Squares (SVD + Levenberg-Marquardt)',
    language: 'Python',
    author: 'Priya Sharma',
    github: 'https://github.com',
    output: "T* = 5778 ± 12 K  (reduced χ² = 1.03)",
  },
  {
    id: 'bootstrap',
    title: 'Bootstrap Error Analysis',
    topic: 'Data Analysis',
    description: 'Non-parametric bootstrap resampling for uncertainty estimation in small experimental datasets. Constructs confidence intervals without Gaussian assumptions.',
    method: 'Bootstrap Resampling',
    language: 'Python',
    author: 'Priya Sharma',
    github: 'https://github.com',
    output: "95% CI: [2.41, 2.49]  (N=10000 bootstrap samples)",
  },
  {
    id: 'histogram',
    title: 'Statistical Distribution Fitting',
    topic: 'Data Analysis',
    description: 'KDE and parametric distribution fitting (Gaussian, Poisson, Maxwell-Boltzmann) to experimental data. Includes Kolmogorov-Smirnov goodness-of-fit test.',
    method: 'KDE + Maximum Likelihood Estimation',
    language: 'Python',
    author: 'Arjun Kapoor',
    github: 'https://github.com',
    output: "KS test p-value = 0.41 (fail to reject Gaussian H₀)",
  },

  /* ── Astrophysics ── */
  {
    id: 'nbody',
    title: 'N-Body Gravitational Simulation',
    topic: 'Astrophysics',
    description: 'Direct N-body code with Barnes-Hut tree (O(N log N)) for gravitational simulations. Simulates star cluster evolution, planetary systems, and Kepler validation.',
    method: 'Barnes-Hut Tree + Leapfrog',
    language: 'C++',
    author: 'Arjun Kapoor',
    github: 'https://github.com',
    output: "1000-body cluster: 10⁴ steps in 2.1s  (single core)",
  },
  {
    id: 'stellar-structure',
    title: 'Stellar Structure Equations',
    topic: 'Astrophysics',
    description: "Numerical integration of Lane-Emden equation for polytropic stellar models. Computes stellar radii, central densities, and mass-radius relations for polytropic indices n=0..5.",
    method: 'Runge-Kutta + Shooting Method',
    language: 'Python',
    author: 'Arjun Kapoor',
    github: 'https://github.com',
    output: "n=3 polytrope: ξ₁ = 6.897, θ'(ξ₁) = -0.04243",
  },
  {
    id: 'orbital-mechanics',
    title: 'Orbital Mechanics & Kepler',
    topic: 'Astrophysics',
    description: "Solves Kepler's equation via Newton iteration. Computes orbital elements from state vectors, propagates two-body orbits, and implements patched-conic interplanetary transfers.",
    method: "Kepler's Equation + Orbital Mechanics",
    language: 'Python',
    author: 'Arjun Kapoor',
    github: 'https://github.com',
    output: "Earth→Mars Hohmann: Δv₁=2.94 km/s, Δv₂=2.65 km/s",
  },

  /* ── Spectroscopy ── */
  {
    id: 'spectral-analysis',
    title: 'Stellar Spectral Analysis',
    topic: 'Spectroscopy',
    description: 'Pipeline for stellar spectral analysis: continuum normalisation, radial velocity measurement via cross-correlation, equivalent width measurement, and spectral type classification.',
    method: 'Cross-Correlation + Gaussian Fitting',
    language: 'Python',
    author: 'Priya Sharma',
    github: 'https://github.com',
    output: "RV = -21.3 ± 0.4 km/s  (Hα, Hβ, CaII K)",
  },
  {
    id: 'peak-finder',
    title: 'Spectral Peak Identification',
    topic: 'Spectroscopy',
    description: "Automated spectral line detection using wavelet transforms and matched filtering. Identifies atomic/molecular lines in noisy spectra and matches to NIST database.",
    method: 'Wavelet Transform + Matched Filter',
    language: 'Python',
    author: 'Priya Sharma',
    github: 'https://github.com',
    output: "Detected 47/52 lines at SNR>3  (false pos. rate < 2%)",
  },
];


/* ════════════════════════════════════
   TERMINAL ANIMATION
════════════════════════════════════ */

const TERMINAL_SCRIPT = [
  { type: 'cmd',     text: 'ls physicslab/' },
  { type: 'out',     text: 'numerical_integration/  differential_equations/' },
  { type: 'out',     text: 'linear_algebra/  root_finding/  fourier_methods/' },
  { type: 'out',     text: 'astrophysics/  spectroscopy/  data_analysis/' },
  { type: 'cmd',     text: 'python astrophysics/nbody_sim.py --n 1000' },
  { type: 'success', text: '✓ Loaded 1000 particles' },
  { type: 'success', text: '✓ Barnes-Hut tree built  θ=0.5' },
  { type: 'warn',    text: '⚡ Running 10000 steps...' },
  { type: 'success', text: '✓ Done in 2.1s  |  ΔE/E₀ = 8.3e-10' },
  { type: 'cmd',     text: 'python spectroscopy/spectral_analysis.py' },
  { type: 'success', text: '✓ Continuum normalised' },
  { type: 'success', text: '✓ RV = -21.3 ± 0.4 km/s' },
  { type: 'cmd',     text: '' },   // cursor line
];

function buildTerminal () {
  const body = document.getElementById('terminalBody');
  if (!body) return;

  let lineIndex = 0;
  let charIndex = 0;
  let isTyping = false;

  function nextStep () {
    if (lineIndex >= TERMINAL_SCRIPT.length) {
      // restart after pause
      setTimeout(() => {
        body.innerHTML = '';
        lineIndex = 0;
        charIndex = 0;
        nextStep();
      }, 4000);
      return;
    }

    const entry = TERMINAL_SCRIPT[lineIndex];

    if (entry.type === 'cmd') {
      // type out command character by character
      if (charIndex === 0) {
        const el = document.createElement('span');
        el.className = 't-line';
        el.innerHTML = `<span class="t-prompt">$ </span><span class="t-cmd" id="typing-${lineIndex}"></span><span class="cursor"></span>`;
        body.appendChild(el);
        body.scrollTop = body.scrollHeight;
      }
      const target = document.getElementById(`typing-${lineIndex}`);
      const cursor = body.querySelector('.cursor');

      if (charIndex < entry.text.length) {
        if (target) target.textContent += entry.text[charIndex];
        charIndex++;
        setTimeout(nextStep, 50 + Math.random() * 40);
      } else {
        if (cursor) cursor.remove();
        lineIndex++;
        charIndex = 0;
        setTimeout(nextStep, entry.text === '' ? 0 : 400);
      }
    } else {
      // instant output
      const cssClass = entry.type === 'success' ? 't-success' : entry.type === 'warn' ? 't-warn' : 't-out';
      const el = document.createElement('span');
      el.className = `t-line ${cssClass}`;
      el.textContent = entry.text;
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;
      lineIndex++;
      charIndex = 0;
      setTimeout(nextStep, 80);
    }
  }

  setTimeout(nextStep, 800);
}


/* ════════════════════════════════════
   COUNTER ANIMATION
════════════════════════════════════ */

function animateCounters () {
  const els = document.querySelectorAll('.stat-num[data-target]');
  els.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1200;
    const start = performance.now();
    function frame (now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
}


/* ════════════════════════════════════
   RENDER CATEGORIES
════════════════════════════════════ */

function renderCategories () {
  const grid = document.querySelector('.categories-grid');
  if (!grid) return;

  grid.innerHTML = CATEGORIES.map(cat => `
    <div class="cat-card" data-cat="${cat.id}" style="--cat-color: ${cat.color}"
         role="button" tabindex="0" aria-label="Filter by ${cat.name}">
      <div class="cat-icon">${cat.icon}</div>
      <div class="cat-name">${cat.name}</div>
      <div class="cat-count">${cat.count} project${cat.count !== 1 ? 's' : ''}</div>
      <span class="cat-glyph">${cat.glyph}</span>
    </div>
  `).join('');

  // click → filter projects by topic
  grid.querySelectorAll('.cat-card').forEach(card => {
    const activate = () => {
      const catId = card.dataset.cat;
      const catObj = CATEGORIES.find(c => c.id === catId);
      if (!catObj) return;

      // scroll to projects
      document.getElementById('projects').scrollIntoView({ behavior: 'smooth', block: 'start' });

      // set topic filter
      state.filters.topic = catObj.name;
      updateTopicChips(catObj.name);
      applyFilters();
    };
    card.addEventListener('click', activate);
    card.addEventListener('keydown', e => e.key === 'Enter' && activate());
  });
}


/* ════════════════════════════════════
   RENDER PROJECTS
════════════════════════════════════ */

function langClass (lang) {
  const map = { Python: 'lang-python', Julia: 'lang-julia', 'C++': 'lang-cpp', MATLAB: 'lang-matlab' };
  return map[lang] || 'lang-python';
}

function renderProjects (list) {
  const grid = document.getElementById('projectsGrid');
  const noRes = document.getElementById('noResults');
  const count = document.getElementById('resultsCount');
  if (!grid) return;

  if (list.length === 0) {
    grid.innerHTML = '';
    noRes.classList.remove('hidden');
    count.textContent = 'No results';
    return;
  }

  noRes.classList.add('hidden');
  count.textContent = `Showing ${list.length} project${list.length !== 1 ? 's' : ''}`;

  grid.innerHTML = list.map((p, i) => `
    <article class="project-card" style="animation-delay:${i * 40}ms"
             data-lang="${p.language}" data-topic="${p.topic}">
      <div class="card-top">
        <span class="card-topic-badge">${p.topic}</span>
        <span class="card-lang-badge ${langClass(p.language)}">${p.language}</span>
      </div>
      <h3 class="card-title">${p.title}</h3>
      <p class="card-desc">${p.description}</p>
      <div class="card-meta">
        <div class="card-meta-row">
          <span class="meta-key">method</span>
          <span class="meta-val">${p.method}</span>
        </div>
        <div class="card-meta-row">
          <span class="meta-key">language</span>
          <span class="meta-val">${p.language}</span>
        </div>
      </div>
      <div class="card-output">${p.output}</div>
      <div class="card-footer">
        <span class="card-author">by ${p.author}</span>
        <a href="${p.github}" target="_blank" rel="noopener" class="card-gh-link">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          View Source
        </a>
      </div>
    </article>
  `).join('');
}


/* ════════════════════════════════════
   FILTER & SEARCH STATE
════════════════════════════════════ */

const state = {
  query: '',
  filters: { lang: 'all', topic: 'all' },
};

function applyFilters () {
  const q = state.query.toLowerCase().trim();
  const { lang, topic } = state.filters;

  const result = PROJECTS.filter(p => {
    const matchLang  = lang  === 'all' || p.language === lang;
    const matchTopic = topic === 'all' || p.topic === topic;
    const matchQuery = !q || [p.title, p.description, p.method, p.language, p.topic, p.author]
      .some(field => field.toLowerCase().includes(q));
    return matchLang && matchTopic && matchQuery;
  });

  renderProjects(result);
}

function updateTopicChips (val) {
  document.querySelectorAll('[data-filter="topic"]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === val || (val === 'all' && btn.dataset.value === 'all'));
  });
}

function initFilters () {
  // search input
  const input = document.getElementById('searchInput');
  if (input) {
    input.addEventListener('input', () => {
      state.query = input.value;
      applyFilters();
    });
    // keyboard shortcut ⌘K / ctrl+K
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        input.focus();
        input.select();
      }
    });
  }

  // filter chips
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const filterKey = chip.dataset.filter;
      const val = chip.dataset.value;

      // update active chip in group
      chip.closest('.filter-chips').querySelectorAll('.chip')
        .forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      state.filters[filterKey] = val;
      applyFilters();
    });
  });
}


/* ════════════════════════════════════
   COPY BUTTONS
════════════════════════════════════ */

function initCopyButtons () {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.dataset.code || btn.closest('.code-block').querySelector('code').textContent;
      navigator.clipboard.writeText(code).then(() => {
        btn.textContent = 'copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'copy';
          btn.classList.remove('copied');
        }, 2000);
      }).catch(() => {
        btn.textContent = 'err';
        setTimeout(() => { btn.textContent = 'copy'; }, 2000);
      });
    });
  });
}


/* ════════════════════════════════════
   NAVIGATION
════════════════════════════════════ */

function initNav () {
  const navbar  = document.getElementById('navbar');
  const toggle  = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  const allLinks = document.querySelectorAll('.nav-link');

  // scroll shadow
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveLink();
  }, { passive: true });

  // mobile menu
  if (toggle) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // close mobile menu on link click
  allLinks.forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // active link on scroll
  function updateActiveLink () {
    const sections = ['home', 'categories', 'projects', 'contributors', 'docs'];
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 100) current = id;
    });
    allLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }
}


/* ════════════════════════════════════
   INTERSECTION OBSERVER — Animate in
════════════════════════════════════ */

function initScrollReveal () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.cat-card, .contributor-card, .doc-block').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    observer.observe(el);
  });
}


/* ════════════════════════════════════
   COUNTER OBSERVER
════════════════════════════════════ */

function initCounterObserver () {
  const target = document.querySelector('.hero-stats');
  if (!target) return;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCounters();
      obs.unobserve(target);
    }
  }, { threshold: .5 });
  obs.observe(target);
}


/* ════════════════════════════════════
   BOOT
════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderProjects(PROJECTS);
  buildTerminal();
  initFilters();
  initCopyButtons();
  initNav();
  initScrollReveal();
  initCounterObserver();
});
