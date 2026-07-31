(function(){
  // ---- checklist state + progress ----
  const phases = {1:8, 2:4, 3:0, 4:4, 5:4}; // item counts per phase (phase3 has none, counted via itself if added later)
  const allBoxes = Array.from(document.querySelectorAll('.checklist input[type=checkbox]'));

  function updateProgress(){
    const total = allBoxes.length;
    const checked = allBoxes.filter(b => b.checked).length;
    const pct = total ? Math.round((checked/total)*100) : 0;
    document.getElementById('overallPct').textContent = pct + '%';
    document.getElementById('overallFill').style.width = pct + '%';
    document.getElementById('statusStamp').textContent = pct === 100 ? 'COMPLETE' : (pct === 0 ? 'NOT STARTED' : 'IN PROGRESS');
  }

  allBoxes.forEach(box => {
    box.addEventListener('change', () => {
      box.closest('li').classList.toggle('done', box.checked);
      updateProgress();
    });
  });
  updateProgress();

  // ---- copy buttons ----
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pre = btn.nextElementSibling;
      navigator.clipboard.writeText(pre.textContent).then(() => {
        btn.textContent = 'COPIED';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'COPY'; btn.classList.remove('copied'); }, 1400);
      });
    });
  });

  // ---- accordion ----
  document.querySelectorAll('.accordion-head').forEach(head => {
    head.addEventListener('click', () => {
      const acc = head.parentElement;
      const body = acc.querySelector('.accordion-body');
      const isOpen = acc.classList.toggle('open');
      body.style.maxHeight = isOpen ? body.scrollHeight + 'px' : '0px';
    });
  });

  // ---- tabs ----
  document.querySelectorAll('[data-tabgroup]').forEach(group => {
    const buttons = group.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const panels = group.parentElement.querySelectorAll('.tab-panel');
        panels.forEach(p => p.classList.toggle('active', p.dataset.panel === btn.dataset.tab));
      });
    });
  });

  // ---- sidebar nav + scroll spy ----
  const navItems = document.querySelectorAll('.nav-item');
  const sections = Array.from(navItems).map(n => document.getElementById(n.dataset.target));

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById(item.dataset.target).scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        navItems.forEach(n => n.classList.toggle('active', n.dataset.target === entry.target.id));
        const idx = sections.findIndex(s => s.id === entry.target.id);
        document.querySelectorAll('.node-box').forEach(nb => nb.classList.remove('active'));
        const node = document.getElementById('node-' + Math.min(idx, 4));
        if (node) node.querySelector('.node-box').classList.add('active');
      }
    });
  }, {rootMargin: '-40% 0px -50% 0px'});

  sections.forEach(s => s && observer.observe(s));
})();