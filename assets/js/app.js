// Init AOS animations
AOS.init({ duration: 700, once: true });

// Scroll progress bar
(function(){
  const bar = document.getElementById('progressBar');
  function onScroll(){
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
    bar.style.width = (scrolled * 100) + '%';
  }
  document.addEventListener('scroll', onScroll, {passive:true}); onScroll();
})();

// Filter chips
const grid = document.getElementById('grid');
document.querySelectorAll('.chip').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const year = btn.dataset.year;
    grid.querySelectorAll('.grid-item').forEach(item => {
      item.style.display = (year === 'all' || item.dataset.year === year) ? '' : 'none';
    });
    // Refresh AOS visibility after filtering
    AOS.refresh();
  });
});

// Build current list for lightbox navigation
let visibleItems = [];
function refreshVisible(){
  visibleItems = Array.from(document.querySelectorAll('.grid-item'))
    .filter(el => el.style.display !== 'none')
    .map(el => ({
      src: el.querySelector('img').getAttribute('src'),
      cap: el.getAttribute('data-year')
    }));
}
refreshVisible();
document.querySelectorAll('.chip').forEach(c=>c.addEventListener('click', refreshVisible));

// Lightbox with next/prev
const modal = new bootstrap.Modal('#lightbox');
let currentIndex = 0;
function showAt(idx){
  if (idx < 0) idx = visibleItems.length - 1;
  if (idx >= visibleItems.length) idx = 0;
  currentIndex = idx;
  const {src, cap} = visibleItems[currentIndex];
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightboxCap').textContent = 'Year ' + cap;
  modal.show();
}
document.getElementById('prevBtn').addEventListener('click', ()=>showAt(currentIndex-1));
document.getElementById('nextBtn').addEventListener('click', ()=>showAt(currentIndex+1));
document.addEventListener('keydown', (e)=>{
  if (document.getElementById('lightbox').classList.contains('show')){
    if (e.key === 'ArrowLeft') showAt(currentIndex-1);
    if (e.key === 'ArrowRight') showAt(currentIndex+1);
  }
});
Array.from(document.querySelectorAll('.photo-card img, .view-btn')).forEach((el, i) => {
  el.addEventListener('click', (e) => {
    refreshVisible();
    const src = e.currentTarget.dataset.src || e.currentTarget.getAttribute('src');
    const idx = visibleItems.findIndex(v => v.src === src);
    showAt(idx === -1 ? 0 : idx);
  });
});

// Tilt: slightly react to mouse movement
document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('mousemove', (e)=>{
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `rotateX(${(-y*4).toFixed(2)}deg) rotateY(${(x*4).toFixed(2)}deg) scale(1.01)`;
  });
  card.addEventListener('mouseleave', ()=>{ card.style.transform=''; });
});

// Visitor counter: global (CountAPI) + unique-per-device increment
(async function(){
  const el = document.getElementById('visitorCount');
  const hint = document.getElementById('visitorHint');
  const NS = 'sggb_ganeshotsava_gallery';
  const KEY = 'unique_visitors';
  try {
    const firstTime = !localStorage.getItem('sggb-uv-incremented');
    const url = firstTime
      ? `https://api.countapi.xyz/hit/${NS}/${KEY}`
      : `https://api.countapi.xyz/get/${NS}/${KEY}`;
    const res = await fetch(url);
    if(!res.ok) throw new Error('CountAPI unavailable');
    const data = await res.json();
    el.textContent = data.value.toLocaleString('en-IN');
    if (firstTime) {
      localStorage.setItem('sggb-uv-incremented','1');
      hint.textContent = ' (counted as unique visit)';
    } else {
      hint.textContent = '';
    }
  } catch (e){
    el.textContent = '—';
    hint.textContent = ' (counter service unavailable)';
  }
})();