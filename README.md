# MYCODELAB — Computational Physics Code Archive

A structured archive of numerical methods, computational physics implementations, and scientific algorithms — developed by MSc Physics students at UPES Dehradun and SPPU Pune.

---

## Live Site

> Deploy to GitHub Pages — see [Deployment](#deployment) below.

---

## Structure

```
mycodelab/
├── index.html                 ← Homepage
├── pages/
│   ├── library.html           ← Category browser
│   ├── project.html           ← Project viewer (routed by ?cat=&id=)
│   ├── contributors.html      ← Contributor profiles
│   └── docs.html              ← Documentation
├── css/
│   ├── base.css               ← Design tokens, reset, shared components
│   ├── home.css               ← Homepage styles
│   ├── library.css            ← Library & project styles
│   ├── contributors.css       ← Contributor styles
│   └── docs.css               ← Documentation styles
├── js/
│   ├── data.js                ← Repository manifest (EDIT THIS to add projects)
│   ├── render.js              ← Shared rendering helpers
│   ├── search.js              ← Global search engine
│   ├── home.js                ← Homepage controller
│   ├── library.js             ← Library page controller
│   ├── project.js             ← Project detail controller
│   ├── contributors.js        ← Contributors page controller
│   └── docs.js                ← Docs page controller
├── data/
│   └── repository.json        ← Machine-readable manifest
└── codes/                     ← Python / notebook source files
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

## Adding a Project

1. Drop your `.py` / `.ipynb` / `README.md` into the appropriate `codes/<Category>/<Method>/` folder.
2. Open `js/data.js` and add a new entry in the correct category's `projects` array:

```js
{
  id:          'my-method',
  title:       'My Method',
  folder:      'My-Method',
  file:        'My_Method.py',
  type:        'py',
  language:    'Python',
  author:      'abhineet',       // or 'agnik'
  description: 'One-line description.',
  method:      'Method Name',
  output:      'Result string shown in the UI',
  tags:        ['tag1', 'tag2'],
}
```

3. Commit and push — the site updates automatically. No HTML changes needed.

---

## Adding a Category

In `js/data.js`, push a new object to `MCL.categories`:

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

## Content Priority System

When a project page loads, content is rendered in this priority order:

| Priority | File          | Rendering                                      |
|----------|---------------|------------------------------------------------|
| 1        | `index.html`  | Embedded in content area, global nav preserved |
| 2        | `*.ipynb`     | Notebook cells, outputs, and math preserved    |
| 3        | `README.md`   | Styled Markdown with academic typography       |
| 4        | `*.py`        | Syntax-highlighted viewer, copy, download      |

---

## Deployment

### GitHub Pages

1. Push to a GitHub repository.
2. **Settings → Pages → Source**: branch `main`, folder `/ (root)`.
3. Site goes live at `https://<username>.github.io/<repo>/`.

### Local

```bash
python -m http.server 8080
# Open http://localhost:8080
```

---

## Tech Stack

- **HTML5 / CSS3 / ES6+** — zero runtime dependencies, no build step
- **IBM Plex Mono** + **DM Serif Display** + **Old Standard TT** — typography system
- **GitHub Pages** compatible — fully static

---

## Contributors

| Name | Institution | GitHub |
|------|-------------|--------|
| Abhineet Srivastava | UPES Dehradun · MSc Physics | [@sabhineet](https://github.com/sabhineet) |
| Agnik Senroy | SPPU Pune · MSc Physics | [@agniksr](https://github.com/agniksr) |

---

## License

MIT License © 2025 Abhineet Srivastava & Agnik Senroy
