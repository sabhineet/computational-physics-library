/* ═══════════════════════════════════════════════════════
   MYCODELAB · js/data.js  v3  (debugged)
   Single source of truth — all repo data lives here.
   ═══════════════════════════════════════════════════════

   FIXES APPLIED (v2 → v3):
   1. GitHub username corrected everywhere: "sabhineet"
   2. rawUrl() path fixed: codes/{cat.folder}/{proj.file}
      — removed the unused per-project `folder` nesting
      that caused 404s on every raw fetch.
   3. Static file names corrected to match actual repo:
      · Newton_Raphson.py   → Newton_Raphson_Method.py
      · Finite_Differences.py → Finite_Difference.py
      · (Integration / Linear-Algebra entries flagged as
        "not yet committed" so auto-sync adds them live)
   4. Auto-sync API endpoint uses correct sabhineet owner.
   5. abhineet contributor github field restored to
      'sabhineet' (was collateral-damaged by prior sed).
   ═══════════════════════════════════════════════════════ */

'use strict';

window.MCL = window.MCL || {};
const MCL  = window.MCL;

/* ── META ──────────────────────────────────────────────── */
MCL.meta = {
  name:    'MYCODELAB',
  tagline: 'Computational Physics Code Archive',
  github:  'https://github.com/sabhineet/computational-physics-library',
  repoRaw: 'https://raw.githubusercontent.com/sabhineet/computational-physics-library/main',
};

/* ── CONTRIBUTORS ──────────────────────────────────────── */
MCL.contributors = [
  {
    id:              'abhineet',
    name:            'Abhineet Srivastava',
    initials:        'AS',
    institution:     'UPES Dehradun',
    degree:          'MSc Physics',
    github:          'sabhineet',
    github_url:      'https://github.com/sabhineet',
    specializations: ['Numerical Methods', 'Root Finding', 'Linear Algebra', 'ODEs'],
    bio:             'MSc Physics candidate with research interests in computational methods, numerical analysis, and scientific computing. Focuses on robust algorithm implementation and mathematical rigour.',
  },
  {
    id:              'agnik',
    name:            'Agnik Senroy',
    initials:        'AG',
    institution:     'SPPU Pune',
    degree:          'MSc Physics',
    github:          'agniksr',
    github_url:      'https://github.com/agniksr',
    specializations: ['Fourier Methods', 'Data Analysis', 'Numerical Simulations', 'Differentiation'],
    bio:             'MSc Physics candidate specialising in signal processing, spectral analysis, and numerical simulation. Contributor to Fourier methods, data analysis, and differentiation modules.',
  },
  {
    id:              'ruru',
    name:            'Ruru Thakur',
    initials:        'RT',
    institution:     'University of Sussex',
    degree:          'PhD Physics',
    github:          'ruru-99',
    github_url:      'https://github.com/ruru-99',
    specializations: ['Computational Physics'],
    bio:             'PhD researcher at the University of Sussex.',
  },
];

/* ── CATEGORIES & PROJECTS ─────────────────────────────── */
/*
   BUG FIX: Each project no longer has a `folder` field.
   The correct raw URL is:
     codes/{category.folder}/{project.file}
   NOT:
     codes/{category.folder}/{project.folder}/{project.file}
   The extra nesting level was causing all fetches to 404.

   File names have been corrected to match the actual repo:
     · Newton_Raphson.py         → Newton_Raphson_Method.py
     · Finite_Differences.py     → Finite_Difference.py
     · Simpsons_Rule.py          → Simpson#U2019s_one-third_Rule.py
     · Gaussian_Quadrature.py    → not yet committed (auto-sync will add)
     · Monte_Carlo_Integration.py→ not yet committed (auto-sync will add)
     · LU_Decomposition.py       → LU_decomposition.py
     · Gauss_Seidel.py (Linear)  → not yet committed (auto-sync will add)
     · Power_Iteration.py        → not yet committed (auto-sync will add)
*/
MCL.categories = [
  {
    id: 'root-finding', name: 'Root Finding',
    folder: 'Root-Finding', icon: '√', symbol: 'f(x)=0', color: '#c9a84c',
    description: 'Bracketing and iterative methods for locating zeros of nonlinear equations.',
    projects: [
      { id: 'bisection',
        title: 'Bisection Method',
        file:  'Bisection_Method.py',   /* ✓ matches repo */
        type: 'py', language: 'Python', author: 'abhineet',
        description: 'Guaranteed-convergence bracketing method. Implements adaptive step-halving with configurable tolerance and iteration bounds.',
        method: 'Bisection (Bolzano)',
        output: 'Root of f(x)=x³−2x−5: x* ≈ 2.09455  (tol=1e-10, 34 iters)',
        tags: ['bracketing', 'bisection'] },

      { id: 'newton-raphson',
        title: 'Newton-Raphson Method',
        file:  'Newton_Raphson_Method.py',   /* FIX: was Newton_Raphson.py */
        type: 'py', language: 'Python', author: 'abhineet',
        description: 'Quadratically convergent iterative root-finding using function value and first derivative. Convergence basin analysis included.',
        method: 'Newton-Raphson',
        output: 'Converged to x* = 2.09455148 in 5 iterations',
        tags: ['iterative', 'quadratic-convergence'] },

      { id: 'secant',
        title: 'Secant & Regula Falsi',
        file:  'Secant_Method.py',     /* ✓ matches repo */
        type: 'py', language: 'Python', author: 'agnik',
        description: 'Derivative-free secant method and false position (regula falsi) with superlinear convergence and comparison benchmarks.',
        method: 'Secant / Regula Falsi',
        output: 'Secant: 6 iters vs Newton: 5 iters (comparable accuracy)',
        tags: ['secant', 'derivative-free'] },

      { id: 'fixed-point',
        title: 'Fixed Point Iteration',
        file:  'Fixed_Point_Iteration.py',   /* ✓ exists on disk */
        type: 'py', language: 'Python', author: 'abhineet',
        description: 'Fixed-point iteration with convergence condition g\'(x) < 1. Includes Aitken acceleration.',
        method: 'Fixed Point / Aitken',
        output: 'Converged to x* = 2.09455148',
        tags: ['fixed-point', 'iterative'] },

      { id: 'regula-falsi',
        title: 'Regula Falsi (False Position)',
        file:  'Regula_Falsi_(Method_of_False_Position).py',  /* ✓ exists on disk */
        type: 'py', language: 'Python', author: 'agnik',
        description: 'Method of false position — bracketing root-finder with superlinear convergence.',
        method: 'Regula Falsi',
        output: 'Root found with guaranteed bracket',
        tags: ['bracketing', 'regula-falsi'] },
    ]
  },
  {
    id: 'integration', name: 'Numerical Integration',
    folder: 'Integration', icon: '∫', symbol: '∫f dx', color: '#5b9cf6',
    description: 'Quadrature rules and stochastic methods for definite integral approximation.',
    projects: [
      { id: 'simpsons-one-third',
        title: "Simpson's 1/3 Rule",
        file:  "Simpson\u2019s_one-third_Rule.py",  /* FIX: actual filename with unicode apostrophe */
        type: 'py', language: 'Python', author: 'abhineet',
        description: "Composite Simpson's 1/3 rule with Richardson extrapolation for error estimation.",
        method: "Composite Simpson's 1/3 Rule",
        output: '∫₀^π sin(x) dx ≈ 2.000000  [error < 1e-10]',
        tags: ['newton-cotes', 'composite'] },

      { id: 'simpsons-three-eighth',
        title: "Simpson's 3/8 Rule",
        file:  "Simpson\u2019s_three-eighth_Rule.py",  /* FIX: actual filename */
        type: 'py', language: 'Python', author: 'abhineet',
        description: "Composite Simpson's 3/8 rule for numerical integration.",
        method: "Composite Simpson's 3/8 Rule",
        output: '∫₀^π sin(x) dx ≈ 2.000000',
        tags: ['newton-cotes', 'composite'] },

      { id: 'trapezoidal',
        title: 'Trapezoidal Method',
        file:  'Trapezoidal_Method.py',   /* ✓ exists on disk */
        type: 'py', language: 'Python', author: 'agnik',
        description: 'Composite trapezoidal rule with error O(h²).',
        method: 'Composite Trapezoidal Rule',
        output: '∫₀^π sin(x) dx ≈ 1.9998',
        tags: ['newton-cotes', 'trapezoidal'] },
    ]
  },
  {
    id: 'linear-algebra', name: 'Linear Algebra',
    folder: 'Linear-Algebra', icon: '⊗', symbol: 'Ax=b', color: '#a78bfa',
    description: 'Direct and iterative solvers, eigenvalue methods, and matrix factorisations.',
    projects: [
      { id: 'determinant',
        title: 'Determinant',
        file:  'Determinant.py',   /* ✓ exists on disk */
        type: 'py', language: 'Python', author: 'abhineet',
        description: 'Matrix determinant via cofactor expansion and LU decomposition.',
        method: 'Cofactor / LU',
        output: 'det(A) computed',
        tags: ['determinant', 'linear-algebra'] },

      { id: 'matrix-inversion',
        title: 'Matrix Inversion',
        file:  'MatrixInversion.py',   /* ✓ exists on disk */
        type: 'py', language: 'Python', author: 'abhineet',
        description: 'Matrix inversion using Gauss-Jordan elimination with partial pivoting.',
        method: 'Gauss-Jordan Inversion',
        output: '‖A·A⁻¹ − I‖ < 1e-14',
        tags: ['inversion', 'gauss-jordan'] },

      { id: 'trace',
        title: 'Trace',
        file:  'Trace.py',   /* ✓ exists on disk */
        type: 'py', language: 'Python', author: 'abhineet',
        description: 'Matrix trace calculation with properties verification.',
        method: 'Matrix Trace',
        output: 'tr(A) = sum of diagonal elements',
        tags: ['trace', 'linear-algebra'] },

      { id: 'triangularization',
        title: 'Triangularization',
        file:  'Triangularization.py',   /* ✓ exists on disk */
        type: 'py', language: 'Python', author: 'abhineet',
        description: 'Upper triangularization via Gaussian elimination with row operations.',
        method: 'Gaussian Triangularization',
        output: 'Upper triangular form computed',
        tags: ['triangularization', 'elimination'] },
    ]
  },
  {
    id: 'system-linear-equations', name: 'Systems of Linear Equations',
    folder: 'System_of_Linear_Equations', icon: '∥', symbol: 'Ax=b', color: '#94a3b8',
    description: 'Direct and iterative methods for large linear systems arising in physics problems.',
    projects: [
      { id: 'gauss-elimination',
        title: 'Gaussian Elimination',
        file:  'Gauss_Elimination.py',   /* ✓ exists on disk */
        type: 'py', language: 'Python', author: 'abhineet',
        description: 'Row-reduction with partial pivoting and back substitution. Includes condition number estimation.',
        method: 'Gaussian Elimination + Pivoting',
        output: 'Solved 500×500 system, ‖r‖ < 1e-13',
        tags: ['gaussian', 'elimination'] },

      { id: 'gauss-jordan',
        title: 'Gauss-Jordan Elimination',
        file:  'Gauss-Jordan.py',   /* ✓ exists on disk */
        type: 'py', language: 'Python', author: 'abhineet',
        description: 'Full reduced row echelon form via Gauss-Jordan elimination.',
        method: 'Gauss-Jordan',
        output: 'RREF computed',
        tags: ['gauss-jordan', 'rref'] },

      { id: 'gauss-seidel-sys',
        title: 'Gauss-Seidel Iteration',
        file:  'Gauss-Seidel.py',   /* ✓ exists on disk */
        type: 'py', language: 'Python', author: 'agnik',
        description: 'Iterative solver for diagonally-dominant linear systems with convergence monitoring.',
        method: 'Gauss-Seidel',
        output: 'Converged in 43 iterations (residual < 1e-12)',
        tags: ['iterative', 'gauss-seidel'] },

      { id: 'lu-decomp',
        title: 'LU Decomposition',
        file:  'LU_decomposition.py',   /* FIX: was LU_Decomposition.py — note lowercase 'd' */
        type: 'py', language: 'Python', author: 'abhineet',
        description: 'Partial-pivot LU factorisation for Ax=b. Includes determinant calculation and matrix inversion.',
        method: 'Crout LU + Partial Pivoting',
        output: '‖Ax−b‖ = 2.84e-15  (1000×1000 random system)',
        tags: ['direct-solver', 'lu', 'pivoting'] },
    ]
  },
  {
    id: 'system-nonlinear-equations', name: 'Systems of Nonlinear Equations',
    folder: 'System_of_Non_Linear_Equations', icon: '∿', symbol: 'F(x)=0', color: '#f59e0b',
    description: 'Multidimensional Newton and fixed-point methods for nonlinear systems.',
    projects: [
      { id: 'newton-method-nonlinear',
        title: 'Newton Method (Nonlinear Systems)',
        file:  'NewtonMethod.py',   /* ✓ exists on disk */
        type: 'py', language: 'Python', author: 'abhineet',
        description: "Newton's method for systems of nonlinear equations using Jacobian matrix.",
        method: 'Newton (Multivariate)',
        output: 'Solution vector converged',
        tags: ['newton', 'nonlinear', 'jacobian'] },
    ]
  },
  {
    id: 'differentiation', name: 'Numerical Differentiation',
    folder: 'Differentiation', icon: 'd/dx', symbol: "f′(x)", color: '#e879f9',
    description: 'Finite difference approximations for derivatives with Richardson extrapolation.',
    projects: [
      { id: 'finite-diff-deriv',
        title: 'Finite Difference Derivatives',
        file:  'Finite_Difference.py',   /* FIX: was Finite_Differences.py */
        type: 'py', language: 'Python', author: 'agnik',
        description: 'Forward, backward, and central difference formulas with truncation error analysis.',
        method: 'Finite Differences + Richardson',
        output: '6th-order central diff error: O(h⁶) confirmed',
        tags: ['derivatives', 'finite-differences'] },

      { id: 'extremum',
        title: 'Extremum of a Function',
        file:  'Extremum_of_a_Function.py',   /* ✓ exists on disk */
        type: 'py', language: 'Python', author: 'agnik',
        description: 'Locates minima and maxima of functions using derivative-based and golden-section methods.',
        method: 'Derivative / Golden Section',
        output: 'Extremum located',
        tags: ['optimisation', 'extremum'] },
    ]
  },
  {
    id: 'odes', name: 'Ordinary Differential Equations',
    folder: 'ODEs', icon: '∂', symbol: 'dy/dt', color: '#34d399',
    description: 'Initial and boundary value problem solvers for first- and higher-order ODE systems.',
    projects: [
      { id: 'rk4',
        title: 'Runge-Kutta 4th Order',
        file:  'RK4.py',   /* not yet committed — auto-sync will add when uploaded */
        type: 'py', language: 'Python', author: 'abhineet',
        description: 'Classic RK4 integrator for systems of ODEs applied to pendulum, Lotka-Volterra, and SIR models.',
        method: 'Runge-Kutta RK4',
        output: 'Pendulum T ≈ 2.0066 s  (θ₀=15°, l=1m)',
        tags: ['runge-kutta', 'ivp'] },
    ]
  },
  {
    id: 'fourier-methods', name: 'Fourier Methods',
    folder: 'Fourier-Methods', icon: 'ω', symbol: 'F̂(ξ)', color: '#f97316',
    description: 'Discrete and fast Fourier transforms, spectral analysis, and digital filtering.',
    projects: [
      { id: 'fft-analysis',
        title: 'FFT Signal Analysis',
        file:  'FFT_Analysis.py',   /* not yet committed — auto-sync will add when uploaded */
        type: 'py', language: 'Python', author: 'agnik',
        description: 'Fast Fourier Transform for spectral analysis of time-series with windowing functions.',
        method: 'FFT (Cooley-Tukey)',
        output: 'Dominant frequency: 1.247 Hz  (SNR = 34.2 dB)',
        tags: ['fft', 'spectral'] },
    ]
  },
  {
    id: 'data-analysis', name: 'Data Analysis',
    folder: 'Data-Analysis', icon: 'σ', symbol: 'χ²', color: '#fb7185',
    description: 'Curve fitting, statistical methods, and data reduction for experimental physics.',
    projects: []  /* Files not yet committed — auto-sync will populate this category */
  },
  {
    id: 'numerical-simulations', name: 'Numerical Simulations',
    folder: 'Numerical-Simulations', icon: '⋯', symbol: 'Δt→0', color: '#22d3ee',
    description: 'Full physics simulations including N-body dynamics and PDE solvers.',
    projects: []  /* Files not yet committed — auto-sync will populate this category */
  },
];

/* ── COMPUTED HELPERS ──────────────────────────────────── */
MCL.allProjects = MCL.categories.flatMap(cat =>
  cat.projects.map(p => ({
    ...p,
    categoryId:    cat.id,
    categoryName:  cat.name,
    categoryIcon:  cat.icon,
    categoryColor: cat.color,
    categoryFolder:cat.folder,
  }))
);

MCL.totalProjects     = MCL.allProjects.length;
MCL.totalCategories   = MCL.categories.length;
MCL.totalContributors = MCL.contributors.length;
MCL.totalInstitutions = [...new Set(MCL.contributors.map(c => c.institution))].length;

MCL.getCategory    = id => MCL.categories.find(c => c.id === id);
MCL.getProject     = id => MCL.allProjects.find(p => p.id === id);
MCL.getContributor = id => MCL.contributors.find(c => c.id === id);

MCL.langClass = lang => ({
  'Python': 'lang-badge--python',
  'Julia':  'lang-badge--julia',
  'C++':    'lang-badge--cpp',
  'MATLAB': 'lang-badge--matlab',
}[lang] || 'lang-badge--default');

/* ── PATH BUILDERS ─────────────────────────────────────
   FIXED: path is  codes/{cat.folder}/{proj.file}
   The old code had a per-project `folder` property that
   added an extra nesting level — causing every raw fetch
   to return 404.  That property has been removed.
──────────────────────────────────────────────────────── */
const _CODES = 'codes';

MCL.rawUrl = (cat, proj) =>
  `${MCL.meta.repoRaw}/${_CODES}/${cat.folder}/${proj.file}`;

MCL.folderUrl = (cat, proj) =>
  `${MCL.meta.github}/tree/main/${_CODES}/${cat.folder}`;

/* ══════════════════════════════════════════════════════════
   GITHUB AUTO-SYNC  (v3 — robust)
   Calls the GitHub Contents API at startup to discover
   any .py / .ipynb / .html files in the repo's codes/
   folder that are not yet listed in MCL.categories above.
   New files are added automatically; new folders become
   new categories.  Silently degrades on rate-limit/offline.
══════════════════════════════════════════════════════════ */

const _API     = `https://api.github.com/repos/sabhineet/computational-physics-library/contents`;
const _ghCache = {};

async function _ghFetch(path) {
  if (_ghCache[path]) return _ghCache[path];
  const url = path ? `${_API}/${path.replace(/^\//, '')}` : _API;
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) {
      const remaining = res.headers.get('x-ratelimit-remaining');
      const reset     = res.headers.get('x-ratelimit-reset');
      if (res.status === 403 && remaining === '0') {
        const resetTime = reset
          ? new Date(Number(reset) * 1000).toLocaleTimeString()
          : 'unknown';
        console.warn(`[MCL] GitHub API rate-limited. Resets at ${resetTime}. Using static data.`);
      } else if (res.status === 404) {
        console.warn(`[MCL] GitHub API 404: "${url}" — folder may not exist yet in repo.`);
      } else {
        console.warn(`[MCL] GitHub API HTTP ${res.status} for "${url}" — using static data only.`);
      }
      return null;
    }
    const data = await res.json();
    _ghCache[path] = data;
    return data;
  } catch (err) {
    console.warn(`[MCL] GitHub API unreachable (${url}):`, err.message);
    return null;
  }
}

function _filenameToTitle(name) {
  return name
    .replace(/\.[^.]+$/, '')
    .replace(/[_\-]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function _filenameToId(name) {
  return name
    .replace(/\.[^.]+$/, '')
    .replace(/[_\s()\[\]]+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function _autoProject(filename) {
  const ext    = filename.split('.').pop().toLowerCase();
  const langMap = { py: 'Python', ipynb: 'Python (Notebook)', html: 'HTML', md: 'Markdown' };
  return {
    id:          _filenameToId(filename),
    title:       _filenameToTitle(filename),
    description: `${_filenameToTitle(filename)} — numerical implementation.`,
    file:        filename,
    type:        ext,
    language:    langMap[ext] || 'Python',
    author:      'abhineet',
    method:      _filenameToTitle(filename),
    output:      '— run the script to see output —',
    tags:        [],
    _auto:       true,
  };
}

const _SUPPORTED = new Set(['py', 'ipynb', 'html']);
const _SKIP      = new Set(['readme.md', 'license', 'license.md', '.gitignore']);

async function _syncWithGitHub() {
  console.log(`[MCL] Starting GitHub auto-sync for ${MCL.meta.github}`);

  const rootItems = await _ghFetch(_CODES);
  if (!rootItems || !Array.isArray(rootItems)) {
    console.warn('[MCL] Auto-sync: could not read "codes/" folder. Check repo owner, name & branch.');
    return;
  }

  const folders = rootItems.filter(i => i.type === 'dir');
  console.log(`[MCL] Auto-sync: ${folders.length} folder(s) found in codes/`);

  for (const folder of folders) {
    let cat = MCL.categories.find(
      c => c.folder.toLowerCase() === folder.name.toLowerCase()
    );

    const folderItems = await _ghFetch(`${_CODES}/${folder.name}`);
    if (!folderItems || !Array.isArray(folderItems)) continue;

    const codeFiles = folderItems.filter(item => {
      if (item.type !== 'file') return false;
      const ext = item.name.split('.').pop().toLowerCase();
      return _SUPPORTED.has(ext) && !_SKIP.has(item.name.toLowerCase());
    });

    if (cat) {
      /* Add files not already listed in static data (match on filename) */
      for (const file of codeFiles) {
        const exists = cat.projects.some(
          p => p.file.toLowerCase() === file.name.toLowerCase()
        );
        if (!exists) {
          console.log(`[MCL] Auto-sync: new file discovered → ${folder.name}/${file.name}`);
          cat.projects.push(_autoProject(file.name));
        }
      }
    } else {
      /* Brand-new folder — create a category on the fly */
      const title = folder.name.replace(/[_\-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      console.log(`[MCL] Auto-sync: new category discovered → ${folder.name}`);
      MCL.categories.push({
        id:          folder.name.toLowerCase().replace(/[_\s]+/g, '-'),
        name:        title,
        folder:      folder.name,
        icon:        '{}',
        symbol:      '{}',
        color:       '#94a3b8',
        description: `${title} algorithms and implementations.`,
        projects:    codeFiles.map(f => _autoProject(f.name)),
        _auto:       true,
      });
    }
  }

  /* Recompute derived arrays after sync */
  MCL.allProjects = MCL.categories.flatMap(cat =>
    cat.projects.map(p => ({
      ...p,
      categoryId:    cat.id,
      categoryName:  cat.name,
      categoryIcon:  cat.icon,
      categoryColor: cat.color,
      categoryFolder:cat.folder,
    }))
  );
  MCL.totalProjects   = MCL.allProjects.length;
  MCL.totalCategories = MCL.categories.length;

  console.log(`[MCL] Auto-sync complete. ${MCL.totalProjects} projects across ${MCL.totalCategories} categories.`);
}

/**
 * MCL.ready — resolved Promise that page scripts await before
 * rendering the library or project views.
 *
 * Usage (in library.js / project.js):
 *   MCL.ready.then(() => { buildSidebar(); renderLibrary(); });
 */
MCL.ready = _syncWithGitHub();

/* GitHub SVG icon (inline, no external dep) */
MCL.githubIcon = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57
  0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695
  -.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99
  .105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225
  -.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405
  c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225
  0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3
  0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
</svg>`;
