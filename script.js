document.addEventListener("DOMContentLoaded",()=>{

  // THEME TOGGLE
  const themeBtn=document.getElementById("themeToggle");
  themeBtn.addEventListener("click",()=>{
    document.body.classList.toggle("dark-theme");
    document.body.classList.toggle("light-theme");
  });

  // LANGUAGE TOGGLE
  const langBtn=document.getElementById("langToggle");
  langBtn.addEventListener("click",()=>{
    document.querySelectorAll("[data-lang-en]").forEach(el=>el.style.display=el.style.display==="none"?"block":"none");
    document.querySelectorAll("[data-lang-ru]").forEach(el=>el.style.display=el.style.display==="none"?"block":"none");
  });

  // MAIN VIDEO PLAYER
  const mainPlayer=document.getElementById("mainPlayer");
  const mainPlay=document.getElementById("mainPlay");
  const mainMute=document.getElementById("mainMute");
  const mainFS=document.getElementById("mainFS");
  const progressFilled=document.getElementById("progressFilled");
  const progressBar=document.getElementById("progressBar");

  mainPlay.addEventListener("click",()=>{mainPlayer.paused?mainPlayer.play():mainPlayer.pause();});
  mainMute.addEventListener("click",()=>{mainPlayer.muted=!mainPlayer.muted;});
  mainFS.addEventListener("click",()=>{mainPlayer.requestFullscreen();});

  mainPlayer.addEventListener("timeupdate",()=>{
    const percent=(mainPlayer.currentTime/mainPlayer.duration)*100;
    progressFilled.style.width=percent+"%";
  });

  progressBar.addEventListener("click",(e)=>{
    const rect=progressBar.getBoundingClientRect();
    const pos=(e.clientX-rect.left)/rect.width;
    mainPlayer.currentTime=pos*mainPlayer.duration;
  });

  // SEEK BY CLICK (5 sec forward / 15 sec back)
  mainPlayer.addEventListener("click",(e)=>{
    const w=mainPlayer.clientWidth;
    const x=e.offsetX;
    if(x<w/2) mainPlayer.currentTime=Math.max(mainPlayer.currentTime-15,0);
    else mainPlayer.currentTime=Math.min(mainPlayer.currentTime+5,mainPlayer.duration);
  });

  // COUNTDOWN
  const daysEl=document.getElementById("days");
  const hoursEl=document.getElementById("hours");
  const minutesEl=document.getElementById("minutes");
  const secondsEl=document.getElementById("seconds");
  const targetDate=new Date("2026-04-24T00:00:00");

  function updateCountdown(){
    const now=new Date();
    let diff=(targetDate-now)/1000;
    if(diff<0) diff=0;
    const d=Math.floor(diff/86400); diff%=86400;
    const h=Math.floor(diff/3600); diff%=3600;
    const m=Math.floor(diff/60); const s=Math.floor(diff%60);
    daysEl.textContent=d.toString().padStart(2,"0");
    hoursEl.textContent=h.toString().padStart(2,"0");
    minutesEl.textContent=m.toString().padStart(2,"0");
    secondsEl.textContent=s.toString().padStart(2,"0");
  }
  setInterval(updateCountdown,1000);
  updateCountdown();

  // CAROUSEL AUTO SLIDE
  const slides=document.querySelectorAll(".carousel .slide");
  let idx=0;
  function showSlide(i){slides.forEach((s,n)=>s.style.display=n===i?"block":"none");}
  showSlide(idx);
  setInterval(()=>{idx=(idx+1)%slides.length;showSlide(idx);},2000);

  // POSTERS OVERLAY
  const posters=document.querySelectorAll(".poster");
  const overlay=document.getElementById("playerOverlay");
  const overlayVideo=document.getElementById("overlayVideo");
  const closeOverlay=document.getElementById("closeOverlay");

  posters.forEach(p=>{
    p.addEventListener("click",()=>{
      overlay.style.display="flex";
      overlayVideo.src=p.dataset.video;
      overlayVideo.play();
    });
  });

  closeOverlay.addEventListener("click",()=>{
    overlay.style.display="none";
    overlayVideo.pause();
    overlayVideo.src="";
  });

});
