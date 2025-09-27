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