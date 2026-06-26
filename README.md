# Iter ad Astra
### *The Journey to the Stars*

A personal archive of computational physics code — numerical methods, algorithms, and simulations worked through during an MSc in Physics. Started small, growing steadily.

The name is a nod to *per aspera ad astra* — through hardship to the stars. Every method in here was at some point confusing, then clicked, then got written down. This is that collection.

---

## What's here

The code is organised by topic. Each folder is a domain of computational physics, from foundational root-finding methods to numerical simulations.

| Category | Description |
|----------|-------------|
| `Root-Finding/` | Bisection, Newton-Raphson, Secant, Regula Falsi, Fixed-Point Iteration |
| `System_of_Linear_Equations/` | Gauss Elimination, Gauss-Jordan, Gauss-Seidel, LU Decomposition |
| `Integration/` | Quadrature methods — coming soon |
| `Differentiation/` | Finite difference methods — coming soon |
| `Linear-Algebra/` | Eigenvalue problems, matrix operations — coming soon |
| `ODEs/` | Euler, Runge-Kutta, initial and boundary value problems — coming soon |
| `Fourier-Methods/` | DFT, FFT, spectral analysis — coming soon |
| `Data-Analysis/` | Curve fitting, regression, error analysis — coming soon |
| `Numerical-Simulations/` | N-body, Monte Carlo, molecular dynamics — coming soon |

---

## The code

Everything is written to be **readable first**. These aren't optimised production implementations — they're clean, documented, and meant to be understood. Most scripts can be read top to bottom and followed without any external reference.

- Language: **Python 3.10+**
- Dependencies: `numpy`, `scipy`, `matplotlib`, `sympy`
- No build system, no package to install — just clone and run

```bash
git clone https://github.com/sabhineet/computational-physics-library.git
cd computational-physics-library
pip install numpy scipy matplotlib sympy
```

Then navigate to any folder and run a script:

```bash
cd codes/Root-Finding
python Bisection_Method.py
```

---

## The website

There's a companion website that lets you browse and read every file in the repository directly in the browser — with syntax highlighting, search, and navigation between methods.

🔗 **[iter-ad-astra.github.io](https://sabhineet.github.io/computational-physics-library/)** *(update with your actual URL)*

---

## Who made this

**Abhineet Srivastava** — MSc Physics, UPES Dehradun  
**Agnik Senroy** — MSc Physics, SPPU Pune  
**Ruru Thakur** — PhD Scholar, University of Sussex

This is a personal project, not affiliated with any institution or organisation.

---

*Per aspera ad astra.*
