// THEME TOGGLE
document.getElementById('themeToggle').addEventListener('click',()=>{
  document.body.classList.toggle('dark-theme');
  document.body.classList.toggle('light-theme');
});

// LANGUAGE TOGGLE
document.getElementById('langToggle').addEventListener('click',()=>{
  document.querySelectorAll('[data-lang-en]').forEach(e=>e.style.display=e.style.display==='none'?'block':'none');
  document.querySelectorAll('[data-lang-ru]').forEach(e=>e.style.display=e.style.display==='none'?'block':'none');
});

// CAROUSEL
let slideIndex=0;
const slides=document.querySelectorAll('.slide');
const nextSlide=()=>{slideIndex=(slideIndex+1)%slides.length;updateCarousel();}
const prevSlide=()=>{slideIndex=(slideIndex-1+slides.length)%slides.length;updateCarousel();}
document.querySelector('.next').addEventListener('click',nextSlide);
document.querySelector('.prev').addEventListener('click',prevSlide);
function updateCarousel(){slides.forEach((s,i)=>s.style.transform=`translateX(${-100*slideIndex}%)`);}
setInterval(nextSlide,2000);

// MAIN VIDEO
const mainVideo=document.getElementById('mainPlayer');
const mainPlay=document.getElementById('mainPlay');
const mainMute=document.getElementById('mainMute');
const rewindBtn=document.getElementById('rewind');
const forwardBtn=document.getElementById('forward');
const progressFilled=document.getElementById('progressFilled');
const progressBar=document.getElementById('progressBar');
const mainFS=document.getElementById('mainFS');

mainPlay.addEventListener('click',()=>{mainVideo.paused?mainVideo.play():mainVideo.pause();});
mainMute.addEventListener('click',()=>{mainVideo.muted=!mainVideo.muted;});
rewindBtn.addEventListener('click',()=>{mainVideo.currentTime=Math.max(0,mainVideo.currentTime-15);});
forwardBtn.addEventListener('click',()=>{mainVideo.currentTime=Math.min(mainVideo.duration,mainVideo.currentTime+5);});
mainVideo.addEventListener('timeupdate',()=>{progressFilled.style.width=(mainVideo.currentTime/mainVideo.duration*100)+'%';});
progressBar.addEventListener('click',(e)=>{const rect=e.currentTarget.getBoundingClientRect();mainVideo.currentTime=(e.clientX-rect.left)/rect.width*mainVideo.duration;});
mainFS.addEventListener('click',()=>{mainVideo.requestFullscreen();});

// POSTERS (ПАРОВОЗИК)
const posters=document.querySelectorAll('.poster');
const overlay=document.getElementById('playerOverlay');
const overlayVideo=document.getElementById('overlayVideo');
const closeOverlay=document.getElementById('closeOverlay');

posters.forEach(p=>{
  p.addEventListener('click',()=>{
    overlayVideo.src=p.dataset.video;
    overlay.classList.add('active');
    overlayVideo.play();
  });
});
closeOverlay.addEventListener('click',()=>{
  overlayVideo.pause();
  overlayVideo.src='';
  overlay.classList.remove('active');
});

// COUNTDOWN
const countdownDate=new Date('April 24,2026 00:00:00').getTime();
const daysEl=document.getElementById('days');
const hoursEl=document.getElementById('hours');
const minutesEl=document.getElementById('minutes');
const secondsEl=document.getElementById('seconds');

setInterval(()=>{
  const now=new Date().getTime();
  const diff=countdownDate-now;
  const days=Math.floor(diff/(1000*60*60*24));
  const hours=Math.floor((diff%(1000*60*60*24))/(1000*60*60));
  const minutes=Math.floor((diff%(1000*60*60))/(1000*60));
  const seconds=Math.floor((diff%(1000*60))/1000);
  daysEl.innerText=days.toString().padStart(2,'0');
  hoursEl.innerText=hours.toString().padStart(2,'0');
  minutesEl.innerText=minutes.toString().padStart(2,'0');
  secondsEl.innerText=seconds.toString().padStart(2,'0');
},1000);
