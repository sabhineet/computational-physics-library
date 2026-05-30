/* ═══════════════════════════════════════════════════════
   MYCODELAB · js/data.js  v2
   Single source of truth — all repo data lives here.
   Edit this file to add/remove categories or projects.
   ═══════════════════════════════════════════════════════ */

'use strict';

/* Attach everything to a single namespace to avoid polluting global scope */
window.MCL = window.MCL || {};
const MCL  = window.MCL;

/* ── META ──────────────────────────────────────────────── */
MCL.meta = {
  name:       'MYCODELAB',
  tagline:    'Computational Physics Code Archive',
  /* ★ UPDATE THIS to your real GitHub repo URL ★ */
  github:     'https://github.com/sabhineet/computational-physics-library',
  repoRaw:    'https://raw.githubusercontent.com/sabhineet/computational-physics-library/main',
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
];

/* ── CATEGORIES & PROJECTS ─────────────────────────────── */
MCL.categories = [
  {
    id: 'root-finding', name: 'Root Finding',
    folder: 'Root-Finding', icon: '√', symbol: 'f(x)=0', color: '#c9a84c',
    description: 'Bracketing and iterative methods for locating zeros of nonlinear equations.',
    projects: [
      { id:'bisection',      title:'Bisection Method',
        folder:'Bisection',      file:'Bisection_Method.py',  type:'py', language:'Python', author:'abhineet',
        description:'Guaranteed-convergence bracketing method. Implements adaptive step-halving with configurable tolerance and iteration bounds.',
        method:'Bisection (Bolzano)', output:'Root of f(x)=x³−2x−5: x* ≈ 2.09455  (tol=1e-10, 34 iters)', tags:['bracketing','bisection'] },
      { id:'newton-raphson', title:'Newton-Raphson Method',
        folder:'Newton-Raphson', file:'Newton_Raphson.py',    type:'py', language:'Python', author:'abhineet',
        description:'Quadratically convergent iterative root-finding using function value and first derivative. Convergence basin analysis included.',
        method:'Newton-Raphson', output:'Converged to x* = 2.09455148 in 5 iterations', tags:['iterative','quadratic-convergence'] },
      { id:'secant',         title:'Secant & Regula Falsi',
        folder:'Secant',         file:'Secant_Method.py',     type:'py', language:'Python', author:'agnik',
        description:'Derivative-free secant method and false position (regula falsi) with superlinear convergence and comparison benchmarks.',
        method:'Secant / Regula Falsi', output:'Secant: 6 iters vs Newton: 5 iters (comparable accuracy)', tags:['secant','derivative-free'] },
    ]
  },
  {
    id: 'integration', name: 'Numerical Integration',
    folder: 'Integration', icon: '∫', symbol: '∫f dx', color: '#5b9cf6',
    description: 'Quadrature rules and stochastic methods for definite integral approximation.',
    projects: [
      { id:'simpson',        title:"Simpson's Rule",
        folder:'Simpsons-Rule',       file:'Simpsons_Rule.py',          type:'py', language:'Python', author:'abhineet',
        description:"Composite Simpson's 1/3 and 3/8 rules with Richardson extrapolation for error estimation.",
        method:"Composite Simpson's Rule", output:'∫₀^π sin(x) dx ≈ 2.000000  [error < 1e-10]', tags:['newton-cotes','composite'] },
      { id:'gauss-legendre', title:'Gaussian Quadrature',
        folder:'Gaussian-Quadrature', file:'Gaussian_Quadrature.py',    type:'py', language:'Python', author:'abhineet',
        description:'Gauss-Legendre nodes and weights up to order 20. Near-machine-precision with fewer function evaluations.',
        method:'Gauss-Legendre Quadrature', output:'∫₋₁¹ eˣ dx ≈ 2.35040  (n=5 pts, exact to 15 d.p.)', tags:['gaussian','high-order'] },
      { id:'monte-carlo',    title:'Monte Carlo Integration',
        folder:'Monte-Carlo',         file:'Monte_Carlo_Integration.py',type:'py', language:'Python', author:'agnik',
        description:'Stochastic integration in 1D–3D domains using importance sampling and variance reduction.',
        method:'Monte Carlo / Importance Sampling', output:'π ≈ 3.14159  (N=10⁶ samples, σ ≈ 0.0016)', tags:['stochastic','monte-carlo'] },
    ]
  },
  {
    id: 'linear-algebra', name: 'Linear Algebra',
    folder: 'Linear-Algebra', icon: '⊗', symbol: 'Ax=b', color: '#a78bfa',
    description: 'Direct and iterative solvers, eigenvalue methods, and matrix factorisations.',
    projects: [
      { id:'lu-decomp',    title:'LU Decomposition',
        folder:'LU-Decomposition', file:'LU_Decomposition.py', type:'py', language:'Python', author:'abhineet',
        description:'Partial-pivot LU factorisation for Ax=b. Includes determinant calculation and matrix inversion.',
        method:'Crout LU + Partial Pivoting', output:'‖Ax−b‖ = 2.84e-15  (1000×1000 random system)', tags:['direct-solver','lu','pivoting'] },
      { id:'gauss-seidel', title:'Gauss-Seidel Iteration',
        folder:'Gauss-Seidel',     file:'Gauss_Seidel.py',     type:'py', language:'Python', author:'agnik',
        description:'Iterative solver for diagonally-dominant linear systems with convergence monitoring and SOR acceleration.',
        method:'Gauss-Seidel / SOR', output:'Converged in 43 iterations (ω=1.2, residual < 1e-12)', tags:['iterative','gauss-seidel'] },
      { id:'eigenvalues',  title:'Power Iteration & Eigenvalues',
        folder:'Eigenvalues',      file:'Power_Iteration.py',  type:'py', language:'Python', author:'abhineet',
        description:'Power iteration, inverse iteration, and QR algorithm for eigenvalue problems of physics Hamiltonians.',
        method:'Power Iteration / QR Algorithm', output:'λ_max = 4.0000  (5×5 tridiagonal H), error < 1e-12', tags:['eigenvalues','qr-algorithm'] },
    ]
  },
  {
    id: 'odes', name: 'Ordinary Differential Equations',
    folder: 'ODEs', icon: '∂', symbol: 'dy/dt', color: '#34d399',
    description: 'Initial and boundary value problem solvers for first- and higher-order ODE systems.',
    projects: [
      { id:'rk4',      title:'Runge-Kutta 4th Order',
        folder:'Runge-Kutta',    file:'RK4.py',             type:'py', language:'Python', author:'abhineet',
        description:'Classic RK4 integrator for systems of ODEs applied to pendulum, Lotka-Volterra, and SIR models.',
        method:'Runge-Kutta RK4', output:'Pendulum T ≈ 2.0066 s  (θ₀=15°, l=1m)', tags:['runge-kutta','ivp'] },
      { id:'euler',    title:'Euler & Improved Euler',
        folder:'Euler-Methods',  file:'Euler_Method.py',    type:'py', language:'Python', author:'agnik',
        description:"Forward Euler, backward Euler, and Heun's method with step-size convergence and stability analysis.",
        method:"Euler / Heun (RK2)", output:"Global error O(h) for Euler, O(h²) for Heun (verified)", tags:['euler','stability'] },
      { id:'shooting', title:'Shooting Method — BVP',
        folder:'Shooting-Method',file:'Shooting_Method.py', type:'py', language:'Python', author:'abhineet',
        description:'Converts boundary value problems to IVP using Newton shooting. Applied to quantum harmonic oscillator.',
        method:'Shooting + Newton Iteration', output:'Eigenvalues Eₙ = ℏω(n+½) confirmed for n=0..4', tags:['bvp','shooting'] },
    ]
  },
  {
    id: 'fourier-methods', name: 'Fourier Methods',
    folder: 'Fourier-Methods', icon: 'ω', symbol: 'F̂(ξ)', color: '#f97316',
    description: 'Discrete and fast Fourier transforms, spectral analysis, and digital filtering.',
    projects: [
      { id:'fft-analysis',    title:'FFT Signal Analysis',
        folder:'FFT-Analysis',    file:'FFT_Analysis.py',    type:'py', language:'Python', author:'agnik',
        description:'Fast Fourier Transform for spectral analysis of time-series with windowing functions (Hann, Blackman).',
        method:'FFT (Cooley-Tukey)', output:'Dominant frequency: 1.247 Hz  (SNR = 34.2 dB)', tags:['fft','spectral'] },
      { id:'dft-convolution', title:'DFT Convolution & Filters',
        folder:'DFT-Convolution',file:'DFT_Convolution.py',type:'py', language:'Python', author:'agnik',
        description:'Convolution theorem for digital filtering with low-pass, high-pass, and Gaussian smoothing kernels.',
        method:'DFT Convolution Theorem', output:'σ_noise: 0.34 → 0.02 (Gaussian kernel applied)', tags:['convolution','filtering'] },
    ]
  },
  {
    id: 'data-analysis', name: 'Data Analysis',
    folder: 'Data-Analysis', icon: 'σ', symbol: 'χ²', color: '#fb7185',
    description: 'Curve fitting, statistical methods, and data reduction for experimental physics.',
    projects: [
      { id:'least-squares', title:'Least Squares Curve Fitting',
        folder:'Least-Squares',file:'Least_Squares.py',      type:'py', language:'Python', author:'agnik',
        description:'Linear and nonlinear least-squares fitting with uncertainty propagation and residual analysis.',
        method:'Least Squares (Linear + LM)', output:'Fit R² = 0.9987, χ²/dof = 1.03 (good fit)', tags:['curve-fitting','regression'] },
      { id:'chi-squared',   title:'Chi-Squared Goodness of Fit',
        folder:'Chi-Squared',  file:'Chi_Squared_Test.py',  type:'py', language:'Python', author:'agnik',
        description:'χ² test for goodness-of-fit and parameter estimation with confidence interval contours.',
        method:'Chi-Squared Analysis', output:'χ²_min found; 1σ contours plotted for 2-param fit', tags:['chi-squared','statistics'] },
    ]
  },
  {
    id: 'numerical-simulations', name: 'Numerical Simulations',
    folder: 'Numerical-Simulations', icon: '⋯', symbol: 'Δt→0', color: '#22d3ee',
    description: 'Full physics simulations including N-body dynamics and PDE solvers.',
    projects: [
      { id:'nbody',         title:'N-Body Gravitational Simulation',
        folder:'N-Body',        file:'NBody_Simulation.py',type:'py', language:'Python', author:'agnik',
        description:'Direct N-body gravitational simulation with velocity Verlet integration and energy conservation monitoring.',
        method:'N-Body + Velocity Verlet', output:'ΔE/E₀ = 8.3×10⁻¹⁰ over 10⁵ steps (Kepler orbit)', tags:['n-body','gravity','symplectic'] },
      { id:'heat-equation', title:'Heat Equation — FD Solver',
        folder:'Heat-Equation', file:'Heat_Equation.py',   type:'py', language:'Python', author:'abhineet',
        description:'Explicit and implicit finite difference for 1D heat equation with CFL stability analysis.',
        method:'FTCS / Crank-Nicolson', output:'Stable for r = αΔt/Δx² ≤ 0.5 (explicit verified)', tags:['heat-equation','crank-nicolson'] },
    ]
  },
  {
    id: 'differentiation', name: 'Numerical Differentiation',
    folder: 'Differentiation', icon: 'd/dx', symbol: "f′(x)", color: '#e879f9',
    description: 'Finite difference approximations for derivatives with Richardson extrapolation.',
    projects: [
      { id:'finite-diff-deriv', title:'Finite Difference Derivatives',
        folder:'Finite-Differences', file:'Finite_Differences.py', type:'py', language:'Python', author:'agnik',
        description:'Forward, backward, and central difference formulas of orders 2, 4, and 6 with truncation error analysis.',
        method:'Finite Differences + Richardson', output:'6th-order central diff error: O(h⁶) confirmed', tags:['derivatives','finite-differences'] },
    ]
  },
  {
    id: 'system-linear-equations', name: 'Systems of Linear Equations',
    folder: 'System_of_Linear_Equations', icon: '∥', symbol: 'Ax=b', color: '#94a3b8',
    description: 'Direct and iterative methods for large linear systems arising in physics problems.',
    projects: [
      { id:'gaussian-elim',  title:'Gaussian Elimination',
        folder:'Gaussian-Elimination', file:'Gaussian_Elimination.py',type:'py', language:'Python', author:'abhineet',
        description:'Row-reduction with partial pivoting and back substitution. Includes condition number estimation.',
        method:'Gaussian Elimination + Pivoting', output:"Solved 500×500 system, ‖r‖ < 1e-13", tags:['gaussian','elimination'] },
      { id:'conjugate-grad', title:'Conjugate Gradient Solver',
        folder:'Conjugate-Gradient',  file:'Conjugate_Gradient.py',  type:'py', language:'Python', author:'abhineet',
        description:'Iterative CG solver for large sparse SPD systems. Applied to FEM discretisations of Poisson equation.',
        method:'Conjugate Gradient', output:'Converged in 87 iterations, residual = 3.1e-14', tags:['conjugate-gradient','sparse'] },
    ]
  },
];

/* ── COMPUTED HELPERS ──────────────────────────────────── */

/* Flat list of ALL projects, each enriched with its parent category info */
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

/* Total counts (used by the stats counter in the hero) */
MCL.totalProjects     = MCL.allProjects.length;
MCL.totalCategories   = MCL.categories.length;
MCL.totalContributors = MCL.contributors.length;
MCL.totalInstitutions = [...new Set(MCL.contributors.map(c => c.institution))].length;

/* Lookup helpers */
MCL.getCategory    = id => MCL.categories.find(c => c.id === id);
MCL.getProject     = id => MCL.allProjects.find(p => p.id === id);
MCL.getContributor = id => MCL.contributors.find(c => c.id === id);

/* Language → CSS badge modifier */
MCL.langClass = lang => ({
  'Python': 'lang-badge--python',
  'Julia':  'lang-badge--julia',
  'C++':    'lang-badge--cpp',
  'MATLAB': 'lang-badge--matlab',
}[lang] || 'lang-badge--default');

/* GitHub raw URL builder */
MCL.rawUrl = (cat, proj) =>
  `${MCL.meta.repoRaw}/mycodelab/codes/${cat.folder}/${proj.folder}/${proj.file}`;

/* GitHub folder URL builder */
MCL.folderUrl = (cat, proj) =>
  `${MCL.meta.github}/tree/main/mycodelab/codes/${cat.folder}/${proj.folder}`;

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
