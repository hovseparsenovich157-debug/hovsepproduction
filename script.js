/**
 * script.js
 * Верхний плеер + Горизонтальные видео-карточки
 * - Верхний плеер автозапускается и повторяет видео
 * - Карточки: постер берём кадр из видео
 * - При наведении/касании/центре прокрутки — мини-видео играет (muted, loop)
 * - При уходе — мини-видео останавливается и возвращается постер
 * - Центр прокрутки автоматически запускает ближайшую карточку
 * - Стрелки работают на ПК; свайп — на мобилках
 */

document.addEventListener('DOMContentLoaded', () => {
  /* === ВЕРХНИЙ ПЛЕЕР === */
  // Найдём первый <video> на странице (верхний плеер)
  const mainPlayer = document.querySelector('video');
  if (mainPlayer) {
    // Автозапуск с mute, чтобы не блокировал браузер
    mainPlayer.muted = true;
    mainPlayer.play().catch(() => {});

    // После окончания — заново запуск
    mainPlayer.addEventListener('ended', () => {
      mainPlayer.currentTime = 0;
      mainPlayer.play().catch(() => {});
    });
  }


  
  /* === КАРТОЧКИ === */
  const vcTrack = document.getElementById('vc-track');
  if (!vcTrack) return;

  const SCROLL_STEP = 400;
  const POSTER_TIME = 2;
  const CENTER_SCALE = 1.18;
  const SCALE_FALLOFF = 350;

  const videos = [
    { title: "Навсегда", sub: "Трейлер. Смотрите 24 апреля", src: "video1.mp4" },
    { title: "Трейлер 2", sub: "История продолжается", src: "chto budet.mp4" },
    { title: "Трейлер 3", sub: "Что будет дальше?", src: "grustno.mp4" },
    { title: "Премьера", sub: "Скоро на экранах", src: "skoro.mp4" }
  ];

  function safePlay(videoEl) {
    if (!videoEl) return;
    videoEl.muted = true;
    const p = videoEl.play();
    if (p && p.catch) p.catch(()=>{});
  }
  function safePause(videoEl) {
    if (!videoEl) return;
    try { videoEl.pause(); videoEl.currentTime = 0; } catch(e) {}
  }

  const cards = [];
  videos.forEach((item, idx) => {
    const c = document.createElement('div');
    c.className = 'vc-card';
    c.dataset.index = idx;

    const posterImg = document.createElement('img');
    posterImg.className = 'vc-thumb vc-poster';
    posterImg.alt = item.title;

    const v = document.createElement('video');
    v.className = 'vc-thumb vc-video';
    v.src = item.src;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.preload = 'metadata';
    v.style.display = 'none';

    const meta = document.createElement('div');
    meta.className = 'vc-meta';
    meta.innerHTML = `<div class="vc-title">${item.title}</div><div class="vc-sub">${item.sub}</div>`;

    c.appendChild(posterImg);
    c.appendChild(v);
    c.appendChild(meta);
    vcTrack.appendChild(c);

    // Постер из кадра
    (function preparePoster(videoEl, imgEl) {
      let done = false;
      function setPoster() {
        try {
          const w = videoEl.videoWidth || 320;
          const h = videoEl.videoHeight || 180;
          if (w === 0 || h === 0) return;
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(videoEl, 0, 0, w, h);
          imgEl.src = canvas.toDataURL('image/jpeg', 0.8);
          done = true;
        } catch(e) {}
      }
      videoEl.addEventListener('loadedmetadata', () => {
        const dur = videoEl.duration || 0;
        let target = Math.min(POSTER_TIME, dur - 0.1);
        if (!isFinite(target) || target <= 0) target = 0.5;
        function onSeeked() {
          if (done) return;
          setPoster();
          videoEl.removeEventListener('seeked', onSeeked);
          try { videoEl.currentTime = 0; } catch(e){}
        }
        try {
          videoEl.addEventListener('seeked', onSeeked, { once: true });
          videoEl.currentTime = target;
        } catch(e) {
          videoEl.addEventListener('canplay', () => { if (!done) setPoster(); }, { once: true });
        }
      });
    })(v, posterImg);

    function playMini() {
      posterImg.style.display = 'none';
      v.style.display = 'block';
      safePlay(v);
    }
    function stopMini() {
      safePause(v);
      v.style.display = 'none';
      posterImg.style.display = 'block';
    }

    c.addEventListener('mouseenter', playMini);
    c.addEventListener('mouseleave', stopMini);
    c.addEventListener('touchstart', playMini, { passive: true });
    c.addEventListener('touchend', () => setTimeout(stopMini, 400), { passive: true });

    c.addEventListener('click', () => openOverlayVideo(item.src));

    cards.push({container: c, video: v, poster: posterImg});
  });

  function openOverlayVideo(src) {
    const existing = document.querySelector('.vc-overlay');
    if (existing) existing.remove();
    const o = document.createElement('div');
    o.className = 'vc-overlay';
    o.innerHTML = `
      <video class="vc-opened" src="${src}" controls autoplay playsinline></video>
      <button class="vc-close">✕</button>`;
    document.body.appendChild(o);
    const ov = o.querySelector('video');
    ov.play().catch(()=>{});
    setTimeout(()=> {
      ov.requestFullscreen?.();
      ov.webkitEnterFullscreen?.();
    }, 200);
    o.querySelector('.vc-close').onclick = () => { 
      if (document.fullscreenElement) document.exitFullscreen(); 
      o.remove(); 
    };
  }

  const leftBtn = document.querySelector('.vc-left');
  const rightBtn = document.querySelector('.vc-right');
  if (leftBtn) leftBtn.onclick = ()=> vcTrack.scrollBy({left: -SCROLL_STEP, behavior:'smooth'});
  if (rightBtn) rightBtn.onclick = ()=> vcTrack.scrollBy({left: SCROLL_STEP, behavior:'smooth'});

  let lastActive = -1;
  function updateCenterState() {
    const trackRect = vcTrack.getBoundingClientRect();
    const centerX = trackRect.left + trackRect.width / 2;
    let minDist = Infinity, bestIdx = -1;
    cards.forEach((entry, idx) => {
      const r = entry.container.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const dist = Math.abs(centerX - cx);
      const scale = Math.max(1, CENTER_SCALE - dist / SCALE_FALLOFF);
      entry.container.style.transform = `scale(${scale})`;
      entry.container.style.zIndex = scale > 1.01 ? 2 : 1;
      if (dist < minDist) { minDist = dist; bestIdx = idx; }
    });
    if (bestIdx !== lastActive) {
      if (lastActive >= 0) {
        const prev = cards[lastActive];
        safePause(prev.video);
        prev.video.style.display = 'none';
        prev.poster.style.display = 'block';
      }
      if (bestIdx >= 0) {
        const cur = cards[bestIdx];
        cur.poster.style.display = 'none';
        cur.video.style.display = 'block';
        safePlay(cur.video);
      }
      lastActive = bestIdx;
    }
  }

  vcTrack.addEventListener('scroll', updateCenterState, { passive: true });
  vcTrack.addEventListener('pointermove', (e) => {
    const cursorX = e.clientX;
    cards.forEach((entry) => {
      const r = entry.container.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const dist = Math.abs(cursorX - cx);
      const scale = Math.max(1, CENTER_SCALE - dist / SCALE_FALLOFF);
      entry.container.style.transform = `scale(${scale})`;
      entry.container.style.zIndex = scale > 1.01 ? 2 : 1;
    });
  });
  vcTrack.addEventListener('pointerleave', updateCenterState);

  let touchStartX = 0;
  vcTrack.addEventListener('touchstart', (e)=> {
    if (e.touches[0]) touchStartX = e.touches[0].clientX;
  }, { passive: true });
  vcTrack.addEventListener('touchend', (e)=> {
    const endX = e.changedTouches[0]?.clientX || 0;
    const dx = endX - touchStartX;
    if (Math.abs(dx) > 60) {
      vcTrack.scrollBy({ left: dx > 0 ? -SCROLL_STEP : SCROLL_STEP, behavior: 'smooth' });
    } else {
      updateCenterState();
      setTimeout(updateCenterState, 300);
    }
  }, { passive: true });

  vcTrack.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      vcTrack.scrollBy({ left: e.deltaX, behavior:'auto' });
      e.preventDefault();
    }
  }, { passive: false });

  setTimeout(updateCenterState, 150);
  window.addEventListener('resize', updateCenterState);
});

/* Unified script for carousel, player, theme, language, navigation, countdown, counter, player */

function q(sel){ return document.querySelector(sel); }
function qa(sel){ return Array.from(document.querySelectorAll(sel)); }

function formatTime(sec) {
  if (isNaN(sec) || !isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

window.addEventListener('DOMContentLoaded', () => {

  /* ---------- Carousel ---------- */
  const prevBtn = document.getElementById('arrowLeft') || q('.carousel-btn.left');
  const nextBtn = document.getElementById('arrowRight') || q('.carousel-btn.right');
  const slides = qa('.slide');
  const carouselEl = q('.carousel');

  let index = 0;
  let autoplayInterval = 3500;
  let timer = null;

  function activate(i){
    slides.forEach((s,idx)=>{
      s.classList.toggle('active', idx===i);
      const inner = s.querySelector('video');
      if (inner) {
        if (idx===i) { try{ inner.muted = true; inner.play().catch(()=>{});}catch(e){} }
        else { try{ inner.pause(); inner.currentTime = 0;}catch(e){} }
      }
    });
  }

  function goTo(i){
    if (!slides.length) return;
    index = (i + slides.length) % slides.length;
    activate(index);
    resetTimer();
  }

  if (nextBtn) nextBtn.addEventListener('click', ()=> goTo(index+1));
  if (prevBtn) prevBtn.addEventListener('click', ()=> goTo(index-1));

  function startTimer(){ if (timer) clearInterval(timer); timer = setInterval(()=> goTo(index+1), autoplayInterval); }
  function stopTimer(){ if (timer){ clearInterval(timer); timer=null; } }
  function resetTimer(){ stopTimer(); startTimer(); }

  if (carouselEl){
    carouselEl.addEventListener('pointerenter', ()=> stopTimer());
    carouselEl.addEventListener('pointerleave', ()=> { if (!timer) startTimer(); });
  }

  if (slides.length){
    activate(0);
    startTimer();
  }

  /* ---------- Theme toggle ---------- */
  const themeBtn = document.getElementById('themeBtn');
  const themeRoot = document.body;
  const savedTheme = localStorage.getItem('site-theme');
  if (savedTheme) themeRoot.setAttribute('data-theme', savedTheme);
  else {
    const darkPref = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    themeRoot.setAttribute('data-theme', darkPref ? 'dark' : 'light');
  }
  if (themeBtn) themeBtn.addEventListener('click', ()=>{
    const now = themeRoot.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    themeRoot.setAttribute('data-theme', now);
    localStorage.setItem('site-theme', now);
  });

  /* ---------- Home button ---------- */
  const homeBtn = document.getElementById('homeBtn');
  if (homeBtn) homeBtn.addEventListener('click', (e)=>{ e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'}); });

  /* ---------- Language toggle ---------- */
  const langBtn = document.getElementById('langToggle');
  function setLanguage(lang){
    qa('*').forEach(el=>{
      Array.from(el.attributes).forEach(attr=>{
        if (/^data-i(.*n)?-lang$/.test(attr.name) || attr.name === 'data-i30-lang'){
          el.style.display = (attr.value===lang)? '':'none';
        }
      });
    });
    localStorage.setItem('site-lang', lang);
  }
  let currentLang = localStorage.getItem('site-lang') || ((navigator.language && navigator.language.startsWith('ru'))? 'ru':'en');
  setLanguage(currentLang);
  if (langBtn) langBtn.addEventListener('click', (e)=>{ e.preventDefault(); currentLang = currentLang==='en' ? 'ru' : 'en'; setLanguage(currentLang); });

  /* ---------- Countdown Timer ---------- */
  function updateCountdown(){
    const targetDate = new Date('2025-12-31T23:59:59'); // поставь дату премьеры
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      document.querySelectorAll('.cd-days, .cd-hours, .cd-minutes, .cd-seconds')
        .forEach(el => el.textContent = '00');
      return;
    }

    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const minutes = Math.floor((diff / (1000*60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.querySelectorAll('.cd-days').forEach(el => el.textContent = String(days).padStart(2,'0'));
    document.querySelectorAll('.cd-hours').forEach(el => el.textContent = String(hours).padStart(2,'0'));
    document.querySelectorAll('.cd-minutes').forEach(el => el.textContent = String(minutes).padStart(2,'0'));
    document.querySelectorAll('.cd-seconds').forEach(el => el.textContent = String(seconds).padStart(2,'0'));
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------- Visitor Counter ---------- */
  function updateCounters(){
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('counter-date');

    let daily = parseInt(localStorage.getItem('counter-daily')) || 0;
    let monthly = parseInt(localStorage.getItem('counter-monthly')) || 0;
    let yearly = parseInt(localStorage.getItem('counter-yearly')) || 0;
    let total = parseInt(localStorage.getItem('counter-total')) || 0;

    if (savedDate !== today){
      const d = new Date();
      if (!savedDate || new Date(savedDate).getMonth() !== d.getMonth()) monthly = 0;
      if (!savedDate || new Date(savedDate).getFullYear() !== d.getFullYear()) yearly = 0;
      daily = 0;
      localStorage.setItem('counter-date', today);
    }

    daily++;
    monthly++;
    yearly++;
    total++;

    localStorage.setItem('counter-daily', daily);
    localStorage.setItem('counter-monthly', monthly);
    localStorage.setItem('counter-yearly', yearly);
    localStorage.setItem('counter-total', total);

    document.querySelectorAll('#dailyCounter').forEach(el => el.textContent = daily);

    document.querySelectorAll('#monthlyCounter').forEach(el => {
      const lang = el.getAttribute('data-i18n-lang');
      const label = (lang === 'en') ? ' (Month)' : ' (Месяц)';
      el.textContent = `${monthly}${label}`;
    });
    document.querySelectorAll('#yearlyCounter').forEach(el => {
      const lang = el.getAttribute('data-i18n-lang');
      const label = (lang === 'en') ? ' (Year)' : ' (Год)';
      el.textContent = `${yearly}${label}`;
    });
    document.querySelectorAll('#totalCounter').forEach(el => {
      const lang = el.getAttribute('data-i18n-lang');
      const label = (lang === 'en') ? ' (Total)' : ' (Всего)';
      el.textContent = `${total}${label}`;
    });
  }

  updateCounters();

  /* ---------- Player controls (автовоспроизведение) ---------- */
  const video = document.getElementById('playerVideo');
  const playBtn = document.getElementById('playBtn');
  const muteBtn = document.getElementById('muteBtn');
  const volSlider = document.getElementById('vol');
  const progress = document.getElementById('progress');
  const progressFilled = document.getElementById('progressFilled');
  const progressBuffer = document.getElementById('progressBuffer');
  const curTimeEl = document.getElementById('curTime');
  const durTimeEl = document.getElementById('durTime');
  const fsBtn = document.getElementById('fsBtn');

  if (video) {
    try {
      video.muted = true;
      video.play().catch(()=>{});
      if (playBtn) playBtn.innerHTML = '<img src="pause.png" alt="Pause">';
    } catch(e){}

    video.addEventListener('timeupdate', () => {
      if (!isFinite(video.duration)) return;
      if (progressFilled) progressFilled.style.width = (video.currentTime / video.duration) * 100 + '%';
      if (curTimeEl) curTimeEl.textContent = formatTime(video.currentTime);
    });

    video.addEventListener('progress', () => {
      try {
        if (video.buffered.length > 0 && isFinite(video.duration)) {
          const bufferedEnd = video.buffered.end(video.buffered.length - 1);
          if (progressBuffer) progressBuffer.style.width = (bufferedEnd / video.duration) * 100 + '%';
        }
      } catch(e){}
    });

    video.addEventListener('loadedmetadata', () => {
      if (durTimeEl) durTimeEl.textContent = formatTime(video.duration);
    });
  }

  if (playBtn && video) {
    playBtn.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        playBtn.innerHTML = '<img src="pause.png" alt="Pause">';
      } else {
        video.pause();
        playBtn.innerHTML = '<img src="play.png" alt="Play">';
      }
    });
  }

  if (muteBtn && video) {
    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      if (muteBtn) {
        muteBtn.innerHTML = video.muted ? '<img src="volume-off.png" alt="Muted">' : '<img src="volume-on.png" alt="Volume">';
      }
    });
  }

  if (volSlider && video) {
    try { volSlider.value = (typeof video.volume === 'number') ? video.volume : 1; } catch(e){}
    volSlider.addEventListener('input', () => {
      try{
        video.volume = parseFloat(volSlider.value);
        video.muted = (video.volume === 0);
        if (muteBtn) muteBtn.innerHTML = video.muted ? '<img src="volume-off.png" alt="Muted">' : '<img src="volume-on.png" alt="Volume">';
      }catch(e){}
    });
  }

  if (progress && video) {
    progress.addEventListener('click', (e) => {
      const rect = progress.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      if (isFinite(video.duration)) video.currentTime = pct * video.duration;
    });
  }

  if (fsBtn && video) {
    fsBtn.addEventListener('click', () => {
      try {
        if (video.requestFullscreen) video.requestFullscreen();
        else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
        else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
      } catch(e){}
    });
  }

  /* ---------- Keyboard (carousel) ---------- */
  document.addEventListener('keyup', (e)=>{
    if (e.key==='ArrowRight') goTo(index+1);
    if (e.key==='ArrowLeft') goTo(index-1);
  });

}); // end DOMContentLoaded

 (function(){
    const rail = document.querySelector('#parovoz-posters .poster-rail');
    const prev = document.querySelector('#parovoz-posters .prev');
    const next = document.querySelector('#parovoz-posters .next');
    if(!rail) return;
    const scrollAmount = 360; 
    prev.addEventListener('click', ()=> rail.scrollBy({left: -scrollAmount, behavior:'smooth'}));
    next.addEventListener('click', ()=> rail.scrollBy({left: scrollAmount, behavior:'smooth'}));
  })();
