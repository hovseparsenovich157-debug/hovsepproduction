document.addEventListener("DOMContentLoaded", () => {
  // THEME TOGGLE
  const themeBtn = document.getElementById("themeToggle");
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    document.body.classList.toggle("light-theme");
  });

  // LANGUAGE TOGGLE
  let lang="en";
  const langBtn = document.getElementById("langToggle");
  langBtn.addEventListener("click", () => {
    lang = lang==="en"?"ru":"en";
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
  showSlide(idx);

  // POSTERS + OVERLAY VIDEO
  const posters=document.querySelectorAll(".poster");
  const overlay=document.getElementById("playerOverlay");
  const mainVideo=document.getElementById("mainVideo");
  const closeBtn=document.getElementById("closeOverlay");
  posters.forEach(p=>p.addEventListener("click",()=>{
    mainVideo.src=p.dataset.video;
    overlay.classList.add("active");
    mainVideo.play();
    if(mainVideo.requestFullscreen) mainVideo.requestFullscreen();
  }));
  closeBtn.addEventListener("click",()=>{
    mainVideo.pause();
    overlay.classList.remove("active");
    mainVideo.src="";
  });

  // POSTERS SWIPE
  const postersRow=document.getElementById("postersRow");
  let startX=0, scrollStart=0, isDown=false;
  postersRow.addEventListener("mousedown",e=>{ isDown=true; startX=e.pageX-postersRow.offsetLeft; scrollStart=postersRow.scrollLeft; postersRow.classList.add("dragging"); });
  postersRow.addEventListener("mouseleave",()=>{ isDown=false; postersRow.classList.remove("dragging"); });
  postersRow.addEventListener("mouseup",()=>{ isDown=false; postersRow.classList.remove("dragging"); });
  postersRow.addEventListener("mousemove",e=>{ if(!isDown)return; e.preventDefault(); const x=e.pageX-postersRow.offsetLeft; postersRow.scrollLeft=scrollStart+startX-x; });
  postersRow.addEventListener("touchstart",e=>{ startX=e.touches[0].clientX; scrollStart=postersRow.scrollLeft; }, {passive:true});
  postersRow.addEventListener("touchend",e=>{ const diff=startX-e.changedTouches[0].clientX; const cardWidth=postersRow.querySelector(".poster").offsetWidth+16; if(Math.abs(diff)>50) postersRow.scrollTo({left:scrollStart+(diff>0?cardWidth:-cardWidth), behavior:"smooth"}); });

  // AUTOSCROLL POSTERS
  function autoScroll(){ postersRow.scrollBy({left:1, behavior:"smooth"}); if(postersRow.scrollLeft>=postersRow.scrollWidth-postersRow.clientWidth) postersRow.scrollTo({left:0, behavior:"smooth"}); }
  setInterval(autoScroll,30);

  // VIDEO BUTTONS
  const playBtn=document.getElementById("playBtn");
  const muteBtn=document.getElementById("muteBtn");
  const fsBtn=document.getElementById("fsBtn");
  const iconVolume=document.getElementById("iconVolume");

  playBtn.addEventListener("click",()=>{ mainVideo.paused?mainVideo.play():mainVideo.pause(); });
  muteBtn.addEventListener("click",()=>{
    mainVideo.muted=!mainVideo.muted;
    if(mainVideo.muted){ iconVolume.innerHTML='<path d="M3 9v6h4l5 5V4L7 9H3z" fill="#0ff"/><line x1="1" y1="1" x2="23" y2="23" stroke="#0ff" stroke-width="2"/>'; }
    else{ iconVolume.innerHTML='<path d="M3 9v6h4l5 5V4L7 9H3z" fill="#0ff"/>'; }
  });
  fsBtn.addEventListener("click",()=>{ if(mainVideo.requestFullscreen) mainVideo.requestFullscreen(); });

  // COUNTDOWN
  function countdown(){
    const target=new Date("2026-04-24T00:00:00");
    const now=new Date();
    const diff=target-now;
    if(diff<0) return;
    const days=Math.floor(diff/1000/60/60/24);
    const hours=Math.floor(diff/1000/60/60)%24;
    const minutes=Math.floor(diff/1000/60)%60;
    const seconds=Math.floor(diff/1000)%60;
    document.querySelector(".cd-days").textContent=String(days).padStart(2,"0");
    document.querySelector(".cd-hours").textContent=String(hours).padStart(2,"0");
    document.querySelector(".cd-minutes").textContent=String(minutes).padStart(2,"0");
    document.querySelector(".cd-seconds").textContent=String(seconds).padStart(2,"0");
  }
  setInterval(countdown,1000);
  countdown();
});
