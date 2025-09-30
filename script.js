document.addEventListener("DOMContentLoaded",()=>{

// THEME TOGGLE
const themeBtn=document.getElementById("themeToggle");
themeBtn.addEventListener("click",()=>{ document.body.classList.toggle("dark-theme"); document.body.classList.toggle("light-theme"); });

// LANGUAGE TOGGLE
let lang="en";
const langBtn=document.getElementById("langToggle");
langBtn.addEventListener("click",()=>{
  lang=lang==="en"?"ru":"en";
  document.querySelectorAll("[data-lang-en]").forEach(e=>e.style.display=lang==="en"?"inline":"none");
  document.querySelectorAll("[data-lang-ru]").forEach(e=>e.style.display=lang==="ru"?"inline":"none");
});

// CAROUSEL
const slides=document.querySelectorAll(".slide");
let idx=0;
const prev=document.querySelector(".prev");
const next=document.querySelector(".next");
function showSlide(i){ slides.forEach((s,n)=>s.style.transform=`translateX(${-i*100}%)`); }
prev.addEventListener("click",()=>{ idx=(idx-1+slides.length)%slides.length; showSlide(idx); });
next.addEventListener("click",()=>{ idx=(idx+1)%slides.length; showSlide(idx); });
setInterval(()=>{ idx=(idx+1)%slides.length; showSlide(idx); },2000);
showSlide(idx);

// MAIN PLAYER WITH VIDEO SEQUENCE
const mainPlayer=document.getElementById("mainPlayer");
const videoList=["video1.mp4","grustno.mp4","chto budet.mp4","skoro.mp4"];
let videoIdx=videoList.indexOf("skoro.mp4");
document.getElementById("mainPlay").addEventListener("click",()=>{ mainPlayer.paused?mainPlayer.play():mainPlayer.pause(); });
document.getElementById("mainMute").addEventListener("click",()=>{ mainPlayer.muted=!mainPlayer.muted; });
document.getElementById("mainFs").addEventListener("click",()=>{ mainPlayer.requestFullscreen(); });
mainPlayer.addEventListener("ended",()=>{
  videoIdx=(videoIdx+1)%videoList.length;
  mainPlayer.src=videoList[videoIdx];
  mainPlayer.play();
});

// POSTER OVERLAY VIDEO
const posters=document.querySelectorAll(".poster");
const overlay=document.getElementById("playerOverlay");
const overlayVideo=document.getElementById("overlayVideo");
const closeBtn=document.getElementById("closeOverlay");
posters.forEach(p=>p.addEventListener("click",()=>{
  overlayVideo.src=p.dataset.video;
  overlay.classList.add("active");
  overlayVideo.play();
}));
closeBtn.addEventListener("click",()=>{
  overlayVideo.pause();
  overlay.classList.remove("active");
  overlayVideo.src="";
});

// OVERLAY BUTTONS
document.getElementById("playBtn").addEventListener("click",()=>{ overlayVideo.paused?overlayVideo.play():overlayVideo.pause(); });
document.getElementById("muteBtn").addEventListener("click",()=>{ overlayVideo.muted=!overlayVideo.muted; });
document.getElementById("fsBtn").addEventListener("click",()=>{ overlayVideo.requestFullscreen(); });

// POSTERS SWIPE + AUTO SCROLL
const posterTrack=document.getElementById("posterTrack");
let startX=0, scrollStart=0, isDown=false;
posterTrack.addEventListener("mousedown",e=>{ isDown=true; startX=e.pageX-posterTrack.offsetLeft; scrollStart=posterTrack.scrollLeft; });
posterTrack.addEventListener("mouseleave",()=>{ isDown=false; });
posterTrack.addEventListener("mouseup",()=>{ isDown=false; });
posterTrack.addEventListener("mousemove",e=>{ if(!isDown) return; e.preventDefault(); const x=e.pageX-posterTrack.offsetLeft; posterTrack.scrollLeft=scrollStart+startX-x; });
posterTrack.addEventListener("touchstart",e=>{ startX=e.touches[0].clientX; scrollStart=posterTrack.scrollLeft; },{passive:true});
posterTrack.addEventListener("touchmove",e=>{ const x=e.touches[0].clientX; posterTrack.scrollLeft=scrollStart+startX-x; },{passive:true});
function autoScroll(){ posterTrack.scrollLeft+=0.8; if(posterTrack.scrollLeft>=posterTrack.scrollWidth-posterTrack.clientWidth) posterTrack.scrollLeft=0; }
setInterval(autoScroll,20);

// COUNTDOWN
function updateCountdown(){
  const target=new Date("April 24, 2026 00:00:00").getTime();
  const now=new Date().getTime();
  const diff=target-now;
  document.getElementById("days").innerText=Math.floor(diff/(1000*60*60*24));
  document.getElementById("hours").innerText=Math.floor((diff%(1000*60*60*24))/(1000*60*60));
  document.getElementById("minutes").innerText=Math.floor((diff%(1000*60*60))/(1000*60));
  document.getElementById("seconds").innerText=Math.floor((diff%(1000*60))/1000);
}
setInterval(updateCountdown,1000);
updateCountdown();

});
