function q(sel){ return document.querySelector(sel); }
function qa(sel){ return Array.from(document.querySelectorAll(sel)); }

/* === Карусель === */
const prevBtn = document.getElementById('arrowLeft');
const nextBtn = document.getElementById('arrowRight');
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
      if (idx===i) { 
        try{ inner.muted = true; inner.play().catch(()=>{});}catch(e){} 
      }
      else { 
        try{ inner.pause(); inner.currentTime = 0;}catch(e){} 
      }
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

function startTimer(){ 
  if (timer) clearInterval(timer); 
  timer = setInterval(()=> goTo(index+1), autoplayInterval); 
}
function stopTimer(){ 
  if (timer){ clearInterval(timer); timer=null; } 
}
function resetTimer(){ stopTimer(); startTimer(); }

if (carouselEl){
  carouselEl.addEventListener('pointerenter', ()=> stopTimer());
  carouselEl.addEventListener('pointerleave', ()=> { if (!timer) startTimer(); });
}

activate(0);
startTimer();

/* === Переключение темы === */
const themeBtn = document.getElementById('themeBtn');
const themeRoot = document.body;
const savedTheme = localStorage.getItem('site-theme');
if (savedTheme) {
  themeRoot.setAttribute('data-theme', savedTheme);
} else {
  const darkPref = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  themeRoot.setAttribute('data-theme', darkPref ? 'dark' : 'light');
}
if (themeBtn) themeBtn.addEventListener('click', ()=>{
  const now = themeRoot.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  themeRoot.setAttribute('data-theme', now);
  localStorage.setItem('site-theme', now);
});

/* === Кнопка Home === */
const homeBtn = document.getElementById('homeBtn');
if (homeBtn) homeBtn.addEventListener('click', (e)=>{
  e.preventDefault(); 
  window.scrollTo({top:0, behavior:'smooth'});
});

/* === Языки === */
const langBtn = document.getElementById('langToggle');
function setLanguage(lang){
  qa('*').forEach(el=>{
    Array.from(el.attributes).forEach(attr=>{
      if (/^data-i.*n-lang$/.test(attr.name)){
        el.style.display = (attr.value===lang)? '' : 'none';
      }
    });
  });
  localStorage.setItem('site-lang', lang);
}
let currentLang = localStorage.getItem('site-lang') || 
  ((navigator.language && navigator.language.startsWith('ru'))? 'ru':'en');
setLanguage(currentLang);
if (langBtn) langBtn.addEventListener('click', (e)=>{
  e.preventDefault(); 
  currentLang = currentLang==='en' ? 'ru' : 'en'; 
  setLanguage(currentLang); 
});

/* === Плеер === */
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

if (video){
  video.addEventListener('timeupdate', ()=>{
    if (!isFinite(video.duration)) return;
    const pct = (video.currentTime/video.duration)*100;
    if (progressFilled) progressFilled.style.width = pct+'%';
    if (curTimeEl) curTimeEl.textContent = formatTime(video.currentTime);
  });
  video.addEventListener('progress', ()=>{
    try{
      if (video.buffered.length>0 && isFinite(video.duration)){
        const bufferedEnd = video.buffered.end(video.buffered.length-1);
        const pct = (bufferedEnd/video.duration)*100;
        if (progressBuffer) progressBuffer.style.width = pct+'%';
      }
    }catch(e){}
  });
  video.addEventListener('loadedmetadata', ()=>{
    if (durTimeEl) durTimeEl.textContent = formatTime(video.duration);
  });
}

if (playBtn && video){
  playBtn.addEventListener('click', ()=>{
    if (video.paused){
      video.play();
      playBtn.innerHTML = '<img src="pause.png" alt="Pause">';
    } else {
      video.pause();
      playBtn.innerHTML = '<img src="play.png" alt="Play">';
    }
  });
}

if (muteBtn && video){
  muteBtn.addEventListener('click', ()=>{
    video.muted = !video.muted;
    muteBtn.innerHTML = video.muted 
      ? '<img src="volume-off.png" alt="Muted">' 
      : '<img src="volume-on.png" alt="Volume">';
  });
}

if (volSlider && video){
  volSlider.value = video.volume;
  volSlider.addEventListener('input', ()=>{
    video.volume = parseFloat(volSlider.value);
    video.muted = (video.volume === 0);
    muteBtn.innerHTML = video.muted 
      ? '<img src="volume-off.png" alt="Muted">' 
      : '<img src="volume-on.png" alt="Volume">';
  });
}

if (progress && video){
  progress.addEventListener('click', (e)=>{
    const rect = progress.getBoundingClientRect();
    const pct = (e.clientX - rect.left)/rect.width;
    if (isFinite(video.duration)) video.currentTime = pct*video.duration;
  });
}

if (fsBtn && video){
  fsBtn.addEventListener('click', ()=>{
    if (video.requestFullscreen) video.requestFullscreen();
    else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
  });
}

/* === Управление клавишами === */
document.addEventListener('keyup', (e)=>{
  if (e.key==='ArrowRight') goTo(index+1);
  if (e.key==='ArrowLeft') goTo(index-1);
});

/* === Формат времени === */
function formatTime(sec){
  if (isNaN(sec) || !isFinite(sec)) return '0:00';
  const m=Math.floor(sec/60);
  const s=Math.floor(sec%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

/* === Lightbox для картинок === */
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.style.cssText = `
  position: fixed; inset:0; background:rgba(0,0,0,0.9);
  display:none; align-items:center; justify-content:center;
  z-index:9999; transition: opacity 0.4s ease;
  opacity:0;
`;
document.body.appendChild(lightbox);

const imgBox = document.createElement('img');
imgBox.style.maxWidth = '90%';
imgBox.style.maxHeight = '90%';
imgBox.style.borderRadius = '10px';
imgBox.style.boxShadow = '0 0 20px rgba(255,255,255,0.3)';
lightbox.appendChild(imgBox);

function showLightbox(src){
  imgBox.src = src;
  lightbox.style.display = 'flex';
  requestAnimationFrame(()=>{ lightbox.style.opacity = '1'; });
}
function hideLightbox(){
  lightbox.style.opacity = '0';
  setTimeout(()=>{ lightbox.style.display = 'none'; }, 400);
}

qa('.carousel img, .poster-card img').forEach(img=>{
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', ()=> showLightbox(img.src));
});
lightbox.addEventListener('click', hideLightbox);
