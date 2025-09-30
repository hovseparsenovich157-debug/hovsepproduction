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

// VIDEO LIST
const videoList=['chto budet.mp4','video1.mp4','skoro.mp4','grustno.mp4'];
let videoIndex=0;
const mainVideo=document.getElementById('mainPlayer');
mainVideo.src=videoList[videoIndex];

// MAIN VIDEO CONTROLS
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
progressBar
