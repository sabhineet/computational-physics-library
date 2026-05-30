/* ═══════════════════════════════════════════════════════
   MYCODELAB · js/render.js
   Shared rendering helpers — cards, terminal, utilities
   ═══════════════════════════════════════════════════════ */

'use strict';

const MCL = window.MCL || {};
window.MCL = MCL;

/* ══════════════════════════════════════
   CATEGORY CARD
══════════════════════════════════════ */
MCL.renderCategoryCard = function (cat) {
  return `
    <a href="pages/library.html#${cat.id}"
       class="cat-card"
       style="--cat-color: ${cat.color}"
       data-cat-id="${cat.id}"
       aria-label="${cat.name} — ${cat.projects.length} implementations">
      <div class="cat-icon" aria-hidden="true">${cat.icon}</div>
      <span class="cat-symbol" aria-hidden="true">${cat.symbol}</span>
      <div class="cat-name">${cat.name}</div>
      <p class="cat-desc">${cat.description}</p>
      <div class="cat-count">
        <span class="cat-count-num">${cat.projects.length}</span>
        implementation${cat.projects.length !== 1 ? 's' : ''}
      </div>
    </a>
  `;
};

/* ══════════════════════════════════════
   PROJECT CARD (homepage)
══════════════════════════════════════ */
MCL.renderProjectCard = function (p) {
  const cat      = MCL.getCategory(p.categoryId || MCL.allProjects.find(x => x.id === p.id)?.categoryId);
  const catId    = cat ? cat.id : (p.categoryId || '');
  const catName  = cat ? cat.name : (p.categoryName || '');
  const catColor = cat ? cat.color : '#c9a84c';
  const author   = MCL.getContributor(p.author);
  const authorName = author ? author.name.split(' ')[0] + ' ' + author.name.split(' ')[1][0] + '.' : p.author;

  return `
    <a href="pages/project.html?cat=${catId}&id=${p.id}"
       class="proj-card"
       aria-label="${p.title}">
      <div class="proj-card-top">
        <span class="proj-category-tag" style="color:${catColor}">${catName}</span>
        <span class="lang-badge ${MCL.langClass(p.language)}">${p.language}</span>
      </div>
      <div class="proj-title">${p.title}</div>
      <p class="proj-desc">${p.description}</p>
      <div class="proj-method"><span>${p.method}</span></div>
      <div class="proj-output">${p.output}</div>
      <div class="proj-footer">
        <span class="proj-author">${authorName}</span>
        <span class="proj-gh-link">${MCL.githubIcon} source</span>
      </div>
    </a>
  `;
};

/* ══════════════════════════════════════
   CONTRIBUTOR CARD
══════════════════════════════════════ */
MCL.renderContributorCard = function (c) {
  const specTags = c.specializations.map(s =>
    `<span class="contrib-spec">${s}</span>`
  ).join('');

  return `
    <div class="contrib-card">
      <div class="contrib-avatar">
        <div class="contrib-avatar-ring"></div>
        <div class="contrib-avatar-inner">${c.initials}</div>
      </div>
      <div class="contrib-body">
        <h3 class="contrib-name">${c.name}</h3>
        <span class="contrib-degree">${c.degree}</span>
        <span class="contrib-institution">${c.institution}</span>
        <p class="contrib-bio">${c.bio}</p>
        <div class="contrib-specs">${specTags}</div>
        <a href="${c.github_url}" target="_blank" rel="noopener" class="contrib-gh">
          ${MCL.githubIcon}
          github.com/${c.github}
        </a>
      </div>
    </div>
  `;
};

/* ══════════════════════════════════════
   TERMINAL ANIMATION
══════════════════════════════════════ */
MCL.buildTerminal = function (containerId) {
  const body = document.getElementById(containerId || 'terminalBody');
  if (!body) return;

  const lines = [
    { type: 'prompt', text: '~/mycodelab $ ', cmd: 'python3 Bisection_Method.py' },
    { type: 'out',    text: 'Initialising solver...', delay: 600 },
    { type: 'ok',     text: '✓  root bracketed in [1.0, 3.0]', delay: 900 },
    { type: 'out',    text: '  iter 01 │ x = 2.000000  f(x) = -1.00000', delay: 1200 },
    { type: 'out',    text: '  iter 07 │ x = 2.093750  f(x) = -0.00461', delay: 1500 },
    { type: 'out',    text: '  iter 18 │ x = 2.094551  f(x) = +0.00001', delay: 1800 },
    { type: 'ok',     text: '✓  Converged   x* = 2.09455148  (34 iters)', delay: 2200 },
    { type: 'prompt', text: '~/mycodelab $ ', cmd: 'python3 RK4.py', delay: 2800 },
    { type: 'out',    text: 'ODE Solver — Runge-Kutta 4th Order', delay: 3200 },
    { type: 'accent', text: 'Δt = 0.001 s  │  t_end = 10.0 s  │  n=10000', delay: 3500 },
    { type: 'ok',     text: '✓  Integration complete.  Energy drift < 1e-9', delay: 3900 },
    { type: 'prompt', text: '~/mycodelab $ ', cmd: '', delay: 4400 },
    { type: 'cursor', delay: 4500 },
  ];

  let content = '';
  const typeMap = {
    prompt: (l) => `<span class="t-line"><span class="t-prompt">${l.text}</span><span class="t-cmd">${l.cmd || ''}</span></span>`,
    out:    (l) => `<span class="t-line t-out">${l.text}</span>`,
    ok:     (l) => `<span class="t-line t-ok">${l.text}</span>`,
    accent: (l) => `<span class="t-line t-accent">${l.text}</span>`,
    warn:   (l) => `<span class="t-line t-warn">${l.text}</span>`,
    cursor: ()  => `<span class="t-line"><span class="t-cursor" aria-hidden="true"></span></span>`,
  };

  lines.forEach(line => {
    setTimeout(() => {
      content += (typeMap[line.type] || typeMap.out)(line);
      body.innerHTML = content;
      body.scrollTop = body.scrollHeight;
    }, line.delay || 0);
  });
};

/* ══════════════════════════════════════
   COUNTER ANIMATION
══════════════════════════════════════ */
MCL.animateCounters = function () {
  document.querySelectorAll('[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const dur    = 1200;
    const step   = 16;
    const inc    = target / (dur / step);
    let cur      = 0;

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
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('--visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(selector || '.reveal').forEach(el => obs.observe(el));
};

/* ══════════════════════════════════════
   COPY BUTTONS
══════════════════════════════════════ */
MCL.initCopyButtons = function () {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const block = btn.closest('.code-block, .code-viewer');
      const code  = block ? block.querySelector('code, pre') : null;
      const text  = code ? code.innerText : (btn.dataset.code || '');

      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = 'copied!';
        btn.classList.add('--copied');
        setTimeout(() => {
          btn.textContent = 'copy';
          btn.classList.remove('--copied');
        }, 2000);
      }).catch(() => {
        btn.textContent = 'error';
        setTimeout(() => { btn.textContent = 'copy'; }, 2000);
      });
    });
  });
};

/* ══════════════════════════════════════
   NAVBAR
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
      toggle.setAttribute('aria-expanded', open);
    });

    // Close on link click (mobile)
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        navLinks.classList.remove('--open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }
};

/* ══════════════════════════════════════
   SIMPLE PYTHON SYNTAX HIGHLIGHTER
══════════════════════════════════════ */
MCL.highlightPython = function (raw) {
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  const lines = raw.split('\n');
  return lines.map((line, i) => {
    let hl = esc(line);

    // Order matters: comments first (protect), then strings, then tokens
    // Comments
    hl = hl.replace(/(#.*)$/, '<span class="tok-cmt">$1</span>');

    // Strings (triple-quoted already escaped, just double/single)
    hl = hl.replace(/(&quot;.*?&quot;|&#39;.*?&#39;)/g, '<span class="tok-str">$1</span>');

    // Decorators
    hl = hl.replace(/(@\w+)/g, '<span class="tok-dec">$1</span>');

    // Keywords
    const kws = ['def','class','import','from','return','if','elif','else','for',
                  'while','in','not','and','or','True','False','None','pass',
                  'break','continue','raise','try','except','finally','with','as',
                  'lambda','yield','global','nonlocal','assert','del','is'];
    kws.forEach(kw => {
      hl = hl.replace(new RegExp(`\\b(${kw})\\b`, 'g'), '<span class="tok-kw">$1</span>');
    });

    // Built-ins
    const bis = ['print','len','range','enumerate','zip','map','filter','sorted',
                  'list','dict','set','tuple','int','float','str','bool','type',
                  'isinstance','hasattr','getattr','setattr','open','sum','max','min',
                  'abs','round','format','super','property','staticmethod','classmethod'];
    bis.forEach(b => {
      hl = hl.replace(new RegExp(`\\b(${b})\\b`, 'g'), '<span class="tok-bi">$1</span>');
    });

    // Function calls (word followed by open paren)
    hl = hl.replace(/\b([a-zA-Z_]\w*)(\s*)\(/g, '<span class="tok-fn">$1</span>$2(');

    // Numbers
    hl = hl.replace(/\b(\d+\.?\d*(?:[eE][+-]?\d+)?)\b/g, '<span class="tok-num">$1</span>');

    const num = String(i + 1).padStart(3, ' ');
    return `<div class="code-line"><span class="code-line-num">${num}</span><span class="code-line-content">${hl}</span></div>`;
  }).join('');
};
