/* ═══════════════════════════════════════════════════════
   MYCODELAB · js/render.js  v2
   Shared rendering helpers — cards, terminal, utilities
   ═══════════════════════════════════════════════════════ */

'use strict';

window.MCL = window.MCL || {};
const MCL  = window.MCL;

/* ══════════════════════════════════════
   CATEGORY CARD
══════════════════════════════════════ */
MCL.renderCategoryCard = function (cat) {
  return `
    <a href="pages/library.html#${cat.id}"
       class="cat-card"
       style="--cat-color: ${cat.color}"
       data-cat-id="${cat.id}">
      <div class="cat-icon" aria-hidden="true">${cat.icon}</div>
      <span class="cat-symbol" aria-hidden="true">${cat.symbol}</span>
      <div class="cat-name">${cat.name}</div>
      <p class="cat-desc">${cat.description}</p>
      <div class="cat-count">
        <span class="cat-count-num">${cat.projects.length}</span>
        implementation${cat.projects.length !== 1 ? 's' : ''}
      </div>
    </a>`;
};

/* ══════════════════════════════════════
   PROJECT CARD (homepage / library)
══════════════════════════════════════ */
MCL.renderProjectCard = function (p) {
  const catId    = p.categoryId    || '';
  const catName  = p.categoryName  || '';
  const catColor = p.categoryColor || '#c9a84c';
  const author   = MCL.getContributor(p.author);
  const authorDisplay = author
    ? author.name.split(' ').map((w, i) => i === 0 ? w : w[0] + '.').join(' ')
    : (p.author || 'Unknown');

  return `
    <a href="pages/project.html?cat=${catId}&id=${p.id}" class="proj-card">
      <div class="proj-card-top">
        <span class="proj-category-tag" style="color:${catColor}">${catName}</span>
        <span class="lang-badge ${MCL.langClass(p.language)}">${p.language}</span>
      </div>
      <div class="proj-title">${p.title}</div>
      <p class="proj-desc">${p.description}</p>
      <div class="proj-method"><span>${p.method}</span></div>
      <div class="proj-output">${p.output}</div>
      <div class="proj-footer">
        <span class="proj-author">${authorDisplay}</span>
        <span class="proj-gh-link">${MCL.githubIcon} source</span>
      </div>
    </a>`;
};

/* ══════════════════════════════════════
   CONTRIBUTOR CARD (homepage compact)
══════════════════════════════════════ */
MCL.renderContributorCard = function (c) {
  if (!c) return '';
  const specTags = (c.specializations || []).map(s =>
    `<span class="contrib-spec">${s}</span>`
  ).join('');

  return `
    <div class="contrib-card">
      <div class="contrib-avatar">
        <div class="contrib-avatar-ring"></div>
        <div class="contrib-avatar-inner">${c.initials || '??'}</div>
      </div>
      <div class="contrib-body">
        <h3 class="contrib-name">${c.name}</h3>
        <span class="contrib-degree">${c.degree}</span>
        <span class="contrib-institution">${c.institution}</span>
        <p class="contrib-bio">${c.bio || ''}</p>
        <div class="contrib-specs">${specTags}</div>
        <a href="${c.github_url}" target="_blank" rel="noopener" class="contrib-gh">
          ${MCL.githubIcon} github.com/${c.github}
        </a>
      </div>
    </div>`;
};

/* ══════════════════════════════════════
   TERMINAL ANIMATION
══════════════════════════════════════ */
MCL.buildTerminal = function (containerId) {
  const body = document.getElementById(containerId || 'terminalBody');
  if (!body) return;

  const lines = [
    { type:'prompt', text:'~/mycodelab $ ', cmd:'python3 Bisection_Method.py', delay:0 },
    { type:'out',    text:'Initialising bisection solver…',                     delay:500 },
    { type:'ok',     text:'✓  f(a)·f(b) < 0  →  root bracketed in [1, 3]',    delay:900 },
    { type:'out',    text:'  iter 01  │  x = 2.000000   f(x) = -1.000000',     delay:1200 },
    { type:'out',    text:'  iter 10  │  x = 2.093750   f(x) = -0.004610',     delay:1500 },
    { type:'out',    text:'  iter 25  │  x = 2.094551   f(x) = +0.000001',     delay:1800 },
    { type:'ok',     text:'✓  Converged   x* = 2.09455148   (34 iters)',        delay:2100 },
    { type:'blank',  text:'',                                                    delay:2500 },
    { type:'prompt', text:'~/mycodelab $ ', cmd:'python3 RK4.py',               delay:2800 },
    { type:'out',    text:'ODE Solver — Runge-Kutta 4th Order',                 delay:3200 },
    { type:'accent', text:'Δt = 0.001 s  │  t_end = 10.0 s  │  n = 10 000',   delay:3500 },
    { type:'ok',     text:'✓  Integration complete.  ΔE/E₀ < 1e-9',            delay:3900 },
    { type:'blank',  text:'',                                                    delay:4200 },
    { type:'prompt', text:'~/mycodelab $ ', cmd:'',                             delay:4500 },
    { type:'cursor', delay:4600 },
  ];

  const typeMap = {
    prompt: l => `<span class="t-line"><span class="t-prompt">${l.text}</span><span class="t-cmd">${l.cmd || ''}</span></span>`,
    out:    l => `<span class="t-line t-out">${l.text}</span>`,
    ok:     l => `<span class="t-line t-ok">${l.text}</span>`,
    accent: l => `<span class="t-line t-accent">${l.text}</span>`,
    blank:  ()=> `<span class="t-line">&nbsp;</span>`,
    cursor: ()=> `<span class="t-line"><span class="t-cursor" aria-hidden="true"></span></span>`,
  };

  let content = '';
  lines.forEach(line => {
    setTimeout(() => {
      content += (typeMap[line.type] || typeMap.out)(line);
      body.innerHTML = content;
      body.scrollTop = body.scrollHeight;
    }, line.delay);
  });
};

/* ══════════════════════════════════════
   COUNTER ANIMATION
   Reads data-target on each el.
   Falls back to MCL totals if target="auto".
══════════════════════════════════════ */
MCL.animateCounters = function () {
  const autoMap = {
    'implementations': MCL.totalProjects,
    'categories':      MCL.totalCategories,
    'contributors':    MCL.totalContributors,
    'institutions':    MCL.totalInstitutions,
  };

  document.querySelectorAll('[data-target]').forEach(el => {
    const raw    = el.dataset.target;
    const target = raw === 'auto'
      ? (autoMap[el.dataset.key] || 0)
      : parseInt(raw, 10);

    if (isNaN(target) || target === 0) { el.textContent = target || 0; return; }

    const dur  = 1100;
    const step = 16;
    const inc  = target / (dur / step);
    let   cur  = 0;

    const tick = () => {
      cur = Math.min(cur + inc, target);
      el.textContent = Math.floor(cur);
      if (cur < target) setTimeout(tick, step);
    };
    tick();
  });
};

/* ══════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════ */
MCL.initScrollReveal = function (selector) {
  const targets = document.querySelectorAll(selector || '.reveal');
  if (!targets.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('--visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.06 });

  targets.forEach(el => obs.observe(el));
};

/* ══════════════════════════════════════
   COPY BUTTONS
══════════════════════════════════════ */
MCL.initCopyButtons = function () {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const block = btn.closest('.code-block, .code-viewer');
      const code  = block ? (block.querySelector('code') || block.querySelector('pre')) : null;
      const text  = code ? code.innerText : '';

      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        const orig = btn.textContent;
        btn.textContent = 'copied!';
        btn.classList.add('--copied');
        setTimeout(() => { btn.textContent = orig; btn.classList.remove('--copied'); }, 2000);
      }).catch(() => {
        btn.textContent = 'error';
        setTimeout(() => { btn.textContent = 'copy'; }, 2000);
      });
    });
  });
};

/* ══════════════════════════════════════
   NAVBAR (scroll shadow + mobile toggle)
══════════════════════════════════════ */
MCL.initNavbar = function () {
  const navbar   = document.getElementById('navbar');
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('--scrolled', window.scrollY > 20);
  }, { passive: true });

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('--open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        navLinks.classList.remove('--open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }
};

/* ══════════════════════════════════════
   PYTHON SYNTAX HIGHLIGHTER (lightweight)
══════════════════════════════════════ */
MCL.highlightPython = function (raw) {
  const esc = s => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return raw.split('\n').map((line, i) => {
    let hl = esc(line);

    /* Order matters: protect comments first, then strings, then keywords */
    hl = hl.replace(/(#.*)$/, '<span class="tok-cmt">$1</span>');
    hl = hl.replace(/(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;)/g, '<span class="tok-str">$1</span>');
    hl = hl.replace(/(@\w+)/g, '<span class="tok-dec">$1</span>');

    ['def','class','import','from','return','if','elif','else','for','while',
     'in','not','and','or','True','False','None','pass','break','continue',
     'raise','try','except','finally','with','as','lambda','yield','global',
     'nonlocal','assert','del','is'].forEach(kw => {
      hl = hl.replace(new RegExp(`\\b(${kw})\\b`, 'g'), '<span class="tok-kw">$1</span>');
    });

    ['print','len','range','enumerate','zip','map','filter','sorted','list',
     'dict','set','tuple','int','float','str','bool','type','isinstance',
     'hasattr','getattr','open','sum','max','min','abs','round','super',
     'property','np','plt','scipy'].forEach(bi => {
      hl = hl.replace(new RegExp(`\\b(${bi})\\b`, 'g'), '<span class="tok-bi">$1</span>');
    });

    hl = hl.replace(/\b([a-zA-Z_]\w*)(\s*\()/g, '<span class="tok-fn">$1</span>$2');
    hl = hl.replace(/\b(\d+\.?\d*(?:[eE][+-]?\d+)?)\b/g, '<span class="tok-num">$1</span>');

    const num = String(i + 1).padStart(3, ' ');
    return `<div class="code-line"><span class="code-line-num">${num}</span><span class="code-line-content">${hl}</span></div>`;
  }).join('');
};
