document.addEventListener("DOMContentLoaded", () => {
  // Верхние кнопки
  document.getElementById("themeToggle").addEventListener("click", ()=>{ document.body.classList.toggle("dark-theme"); });
  document.getElementById("homeBtn").addEventListener("click", ()=>{ window.scrollTo({top:0, behavior:"smooth"}); });

  // Переключение языка
  let lang="en";
  document.getElementById("langToggle").addEventListener("click", ()=>{
    lang = (lang==="en")?"ru":"en";
    document.querySelectorAll("[data-lang-en]").forEach(e=>e.style.display=(lang==="en")?"inline":"none");
    document.querySelectorAll("[data-lang-ru]").forEach(e=>e.style.display=(lang==="ru")?"inline":"none");
  });

  // Карусель
  const slides=document.querySelectorAll(".slide");
  const prevBtn=document.querySelector(".prev");
  const nextBtn=document.querySelector(".next");
  let idx=0;
  function showSlide(i){ slides.forEach((s,n)=>s.classList.toggle("active", n===i)); }
  function nextSlide(){ idx=(idx+1)%slides.length; showSlide(idx); }
  function prevSlide(){ idx=(idx-1+slides.length)%slides.length; showSlide(idx); }
  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);
  showSlide(idx);

  // Паровозик постеров
  const posters=document.querySelectorAll(".poster");
  const overlay=document.getElementById("playerOverlay");
  const mainVideo=document.getElementById("mainVideo");
  const closeBtn=document.getElementById("closeOverlay");
  posters.forEach(p=>p.addEventListener("click", ()=>{
    mainVideo.src = p.dataset.video;
    overlay.classList.add("active");
    mainVideo.play();
    mainVideo.requestFullscreen?.();
  }));
  closeBtn.addEventListener("click", ()=>{
    mainVideo.pause();
    overlay.classList.remove("active");
  });

  // Свайп для постеров
  const postersRow=document.getElementById("postersRow");
  let startX=0, scrollStart=0;
  postersRow.addEventListener("touchstart", e=>{ startX=e.touches[0].clientX; scrollStart=postersRow.scrollLeft; }, {passive:true});
  postersRow.addEventListener("touchend", e=>{
    let diff = startX - e.changedTouches[0].clientX;
    const cardWidth = postersRow.querySelector(".poster").offsetWidth + 16;
    if(Math.abs(diff)>50){ postersRow.scrollTo({left: scrollStart + (diff>0?cardWidth:-cardWidth), behavior:"smooth"}); }
  });

});
