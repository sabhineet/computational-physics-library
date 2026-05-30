/* ═══════════════════════════════════════════════════════
   MYCODELAB · js/contributors.js  v2
   ═══════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  MCL.initNavbar();
  MCL.Search.init();

  const grid = document.getElementById('contribGrid');
  if (!grid) return;

  if (!MCL.contributors || !MCL.contributors.length) {
    grid.innerHTML = `<p style="font-family:var(--font-serif);color:var(--tx-02);padding:40px">
      No contributors found. Check js/data.js.
    </p>`;
    return;
  }

  grid.innerHTML = MCL.contributors.map(c => {
    const projects = MCL.allProjects.filter(p => p.author === c.id);
    const catSet   = new Set(projects.map(p => p.categoryId));
    const specTags = (c.specializations || []).map(s =>
      `<span class="contrib-spec-tag">${s}</span>`
    ).join('');

    return `
      <article class="contrib-full-card reveal" id="${c.id}" aria-labelledby="cname-${c.id}">

        <div class="contrib-full-card-top">
          <div class="contrib-full-avatar">
            <div class="contrib-avatar-large">${c.initials || '??'}</div>
            <span class="contrib-avatar-gh">github.com/${c.github}</span>
          </div>
          <div class="contrib-full-details">
            <h2 class="contrib-full-name" id="cname-${c.id}">${c.name}</h2>
            <span class="contrib-full-degree">${c.degree}</span>
            <span class="contrib-full-inst">${c.institution}</span>
            <p class="contrib-full-bio">${c.bio || ''}</p>
            <div class="contrib-full-specs">${specTags}</div>
            <div class="contrib-full-links">
              <a href="${c.github_url}" target="_blank" rel="noopener" class="btn btn--outline">
                ${MCL.githubIcon} @${c.github}
              </a>
              <a href="library.html" class="btn btn--ghost">View Implementations →</a>
            </div>
          </div>
        </div>

        <div class="contrib-stats-bar">
          <div class="contrib-stat">
            <span class="contrib-stat-num">${projects.length}</span>
            <span class="contrib-stat-label">Implementations</span>
          </div>
          <div class="contrib-stat">
            <span class="contrib-stat-num">${catSet.size}</span>
            <span class="contrib-stat-label">Categories</span>
          </div>
          <div class="contrib-stat">
            <span class="contrib-stat-num">Python</span>
            <span class="contrib-stat-label">Primary Language</span>
          </div>
          <div class="contrib-stat">
            <span class="contrib-stat-num">${c.institution.split(' ')[0]}</span>
            <span class="contrib-stat-label">Institution</span>
          </div>
        </div>

      </article>
    `;
  }).join('');

  MCL.initScrollReveal('.reveal');

  // Scroll to anchor if hash present
  const hash = location.hash.slice(1);
  if (hash) {
    setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }
});
