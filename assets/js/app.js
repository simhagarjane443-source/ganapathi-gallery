// ===== AOS animations =====
if (window.AOS) AOS.init({ once: true, duration: 700, easing: 'ease-out-cubic' });

// ===== Progress bar =====
(function () {
  const bar = document.getElementById("progressBar");
  if (!bar) return;
  const onScroll = () => {
    const st = document.documentElement.scrollTop || document.body.scrollTop;
    const sh = (document.documentElement.scrollHeight || document.body.scrollHeight) - document.documentElement.clientHeight;
    const pct = Math.max(0, Math.min(100, (st / sh) * 100));
    bar.style.width = pct + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

// ===== Active nav highlighting =====
(function(){
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar .nav-link').forEach(a=>{
    const href = a.getAttribute('href');
    if (href === here || (here === '' && href === 'index.html')) a.classList.add('active');
  });
})();

// ===== Gallery filters and lightbox (only on gallery page) =====
(function () {
  if (!document.getElementById('grid')) return;

  // Filter chips
  const chips = document.querySelectorAll(".chip");
  const items = document.querySelectorAll(".grid-item");
  function setActive(btn) {
    chips.forEach(c => { c.classList.remove("active"); c.setAttribute('aria-selected', 'false'); });
    btn.classList.add("active");
    btn.setAttribute('aria-selected', 'true');
  }
  function applyFilter(year) {
    items.forEach(it => {
      const show = (year === "all") ? true : (it.dataset.year === year);
      it.style.display = show ? "" : "none";
    });
  }
  chips.forEach(chip => chip.addEventListener("click", () => { setActive(chip); applyFilter(chip.dataset.year); }));

  // Lightbox with next/prev + keyboard
  const modalEl = document.getElementById('lightbox');
  const modal = new bootstrap.Modal(modalEl, { backdrop: true, keyboard: false });
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCap');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  const buttons = Array.from(document.querySelectorAll('.view-btn'));
  const views = buttons.map(btn => ({ src: btn.dataset.src, caption: btn.dataset.caption || '' }));
  let currentIndex = 0;

  function openAt(index) {
    currentIndex = (index + views.length) % views.length;
    const { src, caption } = views[currentIndex];
    img.src = src;
    img.alt = `Preview ${caption}`;
    cap.textContent = `Year: ${caption}`;
    modal.show();
  }
  function go(delta) { openAt(currentIndex + delta); }

  buttons.forEach((btn, idx) => btn.addEventListener('click', () => openAt(idx)));
  prevBtn?.addEventListener('click', () => go(-1));
  nextBtn?.addEventListener('click', () => go(1));
  document.addEventListener('keydown', (e) => {
    if (!modalEl.classList.contains('show')) return;
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'Escape') modal.hide();
  });
  modalEl.addEventListener('hidden.bs.modal', () => { img.src = ''; });
})();
// ===== Reveal grid with stagger (adds .revealed when in view) =====
(function(){
  const grid = document.getElementById('grid');
  if (!grid) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting){ grid.classList.add('revealed'); io.disconnect(); }
    });
  }, { threshold: .12 });
  io.observe(grid);
})();

// ===== Auto-assign AOS delays for each card (progressive) =====
(function(){
  const items = document.querySelectorAll('#grid .grid-item');
  if (!items.length) return;
  items.forEach((el, i)=> el.setAttribute('data-aos', 'zoom-in'));
  items.forEach((el, i)=> el.setAttribute('data-aos-delay', String(40 * (i % 10))));
})();

// ===== Parallax drift for header orbs =====
(function(){
  const orbs = document.querySelectorAll('.gallery-hero .orb');
  if (!orbs.length) return;
  const damp = 1/40;
  window.addEventListener('mousemove', (e)=>{
    const cx = window.innerWidth/2, cy = 200;
    const dx = (e.clientX - cx) * damp;
    const dy = (e.clientY - cy) * damp;
    orbs.forEach((o, idx)=> o.style.transform = `translate(${dx*(idx+1)}px, ${dy*(idx+1)}px)`);
  }, { passive:true });
})();

// ===== Chip ripple position (for pretty click wave) =====
(function(){
  document.querySelectorAll('.chip.ripple').forEach(btn=>{
    btn.addEventListener('pointerdown', (e)=>{
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      btn.style.setProperty('--rx', x+'px');
      btn.style.setProperty('--ry', y+'px');
    });
  });
})();

// Init AOS (once) if available
if (window.AOS) AOS.init({ once: true, duration: 800, easing: 'ease-out-cubic' });

// Parallax orbs on hero
(function(){
  const hero = document.querySelector('.home-hero');
  const orbs = document.querySelectorAll('.home-hero .orb');
  if (!hero || !orbs.length) return;
  const damp = 1/40;
  hero.addEventListener('mousemove', (e)=>{
    const rect = hero.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    const dx = (e.clientX - cx) * damp;
    const dy = (e.clientY - cy) * damp;
    orbs.forEach((o, i)=> o.style.transform = `translate(${dx*(i+1)}px, ${dy*(i+1)}px)`);
  }, { passive:true });
})();


