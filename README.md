# MYCODELAB — Computational Physics Code Archive

> **Abhineet Srivastava** (UPES Dehradun) · **Agnik Senroy** (SPPU Pune)

---

## ⚠️ GitHub Pages — Fix the 404

Your 404 happens because GitHub Pages serves from the **repository root**, but your
`index.html` is inside `mycodelab/`. You have two options:

### Option A — Move files to repo root (recommended, simplest)

Copy the contents of the `mycodelab/` folder **directly into the root** of your repository:

```
computational-physics-library/       ← repo root
├── index.html                       ← was mycodelab/index.html
├── .nojekyll
├── _config.yml
├── README.md
├── css/
├── js/
├── pages/
├── data/
└── codes/
```

Then in **Settings → Pages → Source**: branch `main`, folder `/ (root)`.

Your site will be live at:
`https://sabhineet.github.io/computational-physics-library/`

### Option B — Keep the subfolder, change Pages root

In **Settings → Pages → Source**: branch `main`, folder `/mycodelab`.

GitHub Pages will then serve from the `mycodelab/` subdirectory.

---

## Structure (once deployed at root)

```
computational-physics-library/
├── index.html                 ← Homepage
├── .nojekyll                  ← Prevents Jekyll processing
├── _config.yml
├── pages/
│   ├── library.html           ← Category browser
│   ├── project.html           ← Project viewer (?cat=&id=)
│   ├── contributors.html      ← Contributor profiles
│   └── docs.html              ← Documentation
├── css/
│   ├── base.css
│   ├── home.css
│   ├── library.css
│   ├── contributors.css
│   └── docs.css
├── js/
│   ├── data.js                ← ★ Edit this to add projects
│   ├── render.js
│   ├── search.js
│   ├── home.js
│   ├── library.js
│   ├── project.js
│   ├── contributors.js
│   └── docs.js
└── codes/
    ├── Root-Finding/
    ├── Integration/
    ├── Linear-Algebra/
    ├── ODEs/
    ├── Fourier-Methods/
    ├── Data-Analysis/
    ├── Numerical-Simulations/
    ├── Differentiation/
    └── System_of_Linear_Equations/
```

---

## Adding a Project (30 seconds)

Open `js/data.js`, find the right category, add one entry:

```js
{
  id:          'false-position',
  title:       'False Position Method',
  folder:      'False-Position',        // subfolder inside codes/<Category>/
  file:        'False_Position.py',     // actual filename
  type:        'py',
  language:    'Python',
  author:      'abhineet',              // 'abhineet' or 'agnik'
  description: 'Regula falsi bracketing with guaranteed convergence.',
  method:      'False Position (Regula Falsi)',
  output:      'Root: x* = 1.8393  (12 iterations)',
  tags:        ['bracketing', 'regula-falsi'],
}
```

Save and push — the library page, sidebar, search, and project pages update automatically.

---

## Adding a Category

In `js/data.js`, add to `MCL.categories`:

```js
{
  id:          'pdes',
  name:        'Partial Differential Equations',
  folder:      'PDEs',
  icon:        '∇',
  symbol:      '∇²u=f',
  color:       '#6ee7b7',
  description: 'FD, FEM, and spectral PDE solvers.',
  projects:    [],
}
```

---

## Local Development

```bash
# Python simple server (avoids CORS issues)
python -m http.server 8080
# Open http://localhost:8080
```

---

## Contributors

| Name | Institution | GitHub |
|------|-------------|--------|
| Abhineet Srivastava | UPES Dehradun · MSc Physics | [@sabhineet](https://github.com/sabhineet) |
| Agnik Senroy | SPPU Pune · MSc Physics | [@agniksr](https://github.com/agniksr) |

---

MIT License © 2025 Abhineet Srivastava & Agnik Senroy
