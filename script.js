(function(){
  const USER = 'NebulaJapanese-1221';
  const grid = document.getElementById('projects-grid');
  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();

  /* ---- theme ---- */
  const THEME_KEY = 'nebula-theme';
  const htmlEl = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');

  function applyTheme(theme){
    if(theme === 'light'){
      htmlEl.setAttribute('data-theme','light');
      if(toggleBtn) toggleBtn.textContent = 'Light mode';
    }else{
      htmlEl.removeAttribute('data-theme');
      if(toggleBtn) toggleBtn.textContent = 'Dark mode';
    }
  }
  function getSavedTheme(){return localStorage.getItem(THEME_KEY)}
  function saveTheme(t){localStorage.setItem(THEME_KEY,t)}
  function toggleTheme(){
    const current = htmlEl.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    saveTheme(next);
  }
  const saved = getSavedTheme();
  if(saved) applyTheme(saved);
  else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) applyTheme('light');
  if(toggleBtn) toggleBtn.addEventListener('click',toggleTheme);

  /* ---- utils ---- */
  function esc(t){return String(t).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;" }[c]))}

  /* ---- projects ---- */
  let allRepos = [];

  async function load(){
    try{
      const res = await fetch(`https://api.github.com/users/${USER}/repos?sort=updated&per_page=100`,{
        headers:{'Accept':'application/vnd.github+json'}
      });
      if(!res.ok) throw new Error('github api');
      const repos = await res.json();
      allRepos = repos.filter(r=>!r.fork && !r.archived && r.name !== USER + '.github.io');
      render(allRepos);
    }catch(e){
      grid.innerHTML = '<div class="load-state">Could not load projects. <a href="https://github.com/NebulaJapanese-1221" target="_blank" rel="noopener" style="color:var(--accent)">Visit GitHub profile &rarr;</a></div>';
    }
  }

  function render(repos){
    if(!repos.length){
      grid.innerHTML = '<div class="no-results">No projects found.</div>';
      return;
    }
    grid.innerHTML = repos.map(r => {
      const lang = r.language ? `<span class="tech">${esc(r.language)}</span>` : '';
      const tags = (r.topics || []).map(t=>`<span class="tag">${esc(t)}</span>`).join('');
      const desc = r.description || 'No description provided.';
      return `
        <a href="${esc(r.html_url)}" class="card" target="_blank" rel="noopener">
          ${lang}
          <h3>${esc(r.name)}</h3>
          <p>${esc(desc)}</p>
          <div class="tags">${tags}</div>
        </a>
      `;
    }).join('');
  }

  function matchesFilter(repo, query){
    if(!query) return true;
    const q = query.toLowerCase();
    const haystack = [
      repo.name || '',
      repo.description || '',
      repo.language || '',
      ...(repo.topics || [])
    ].join(' ').toLowerCase();
    return haystack.includes(q);
  }

  function setupFilters(){
    const input = document.getElementById('filter-input');
    const clearBtn = document.getElementById('filter-clear');
    const chips = document.querySelectorAll('.filter-chip');
    if(!input) return;

    function apply(){
      const q = input.value.trim();
      render(allRepos.filter(r=>matchesFilter(r,q)));
    }

    input.addEventListener('input', apply);
    if(clearBtn){
      clearBtn.addEventListener('click',()=>{
        input.value = '';
        apply();
      });
    }
    chips.forEach(chip=>{
      chip.addEventListener('click',()=>{
        chips.forEach(c=>c.classList.remove('active'));
        chip.classList.add('active');
        const val = chip.dataset.filter;
        if(val === 'all'){
          render(allRepos);
        }else{
          render(allRepos.filter(r=>(r.topics||[]).includes(val) || r.language === val));
        }
      });
    });
  }

  load();
  setupFilters();
})();
