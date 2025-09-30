document.addEventListener("DOMContentLoaded", () => {
  // ===== Theme toggle =====
  const themeBtn = document.getElementById("themeToggle");
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    document.body.classList.toggle("light-theme");
  });

  // ===== Language toggle =====
  let lang = "en";
  const langBtn = document.getElementById("langToggle");
  langBtn.addEventListener("click", () => {
    lang = (lang === "en") ? "ru" : "en";
    document.querySelectorAll("[data-lang-en]").forEach(e => e.style.display = (lang === "en") ? "inline" : "none");
    document.querySelectorAll("[data-lang-ru]").forEach(e => e.style.display = (lang === "ru") ? "inline" : "none");
  });

  // ===== Carousel =====
  const slides = document.querySelectorAll(".slide");
  const prev = document.querySelector(".prev");
  const next = document.querySelector(".next");
  let idx = 0;
  function show(i){ slides.forEach((s,n)=> s.classList.toggle("active", n===i)); }
  function nextSlide(){ idx = (idx+1)%slides.length; show(idx); }
  function prevSlide(){ idx = (idx-1+slides.length)%slides.length; show(idx); }
  next.addEventListener("click", nextSlide);
  prev.addEventListener("click", prevSlide);
  show(idx);

  // ===== Poster click -> video overlay =====
  const posters = document.querySelectorAll(".poster");
  const overlay = document.getElementById("playerOverlay");
  const mainVideo = document.getElementById("mainVideo");
  const closeBtn = document.getElementById("closeOverlay");
  posters.forEach(p => {
    p.addEventListener("click", () => {
      mainVideo.src = p.dataset.video;
      overlay.classList.add("active");
      mainVideo.play();
      mainVideo.requestFullscreen?.();
    });
  });
  closeBtn.addEventListener("click", () => {
    mainVideo.pause();
    overlay.classList.remove("active");
  });

  // ===== Swipe posters =====
  const postersRow = document.getElementById("postersRow");
  let startX = 0, scrollStart = 0;
  postersRow.addEventListener("touchstart", e => { startX = e.touches[0].clientX; scrollStart = postersRow.scrollLeft; }, {passive:true});
  postersRow.addEventListener("touchend", e => {
    let diff = startX - e.changedTouches[0].clientX;
    const cardWidth = postersRow.querySelector(".poster").offsetWidth + 16;
    if(Math.abs(diff) > 50){ postersRow.scrollTo({left: scrollStart + (diff > 0 ? cardWidth : -cardWidth), behavior: "smooth"}); }
  });

  // ===== Optional: mouse drag =====
  let isDown = false;
  postersRow.addEventListener("mousedown", e => { isDown = true; postersRow.classList.add("dragging"); startX = e.pageX - postersRow.offsetLeft; scrollStart = postersRow.scrollLeft; });
  postersRow.addEventListener("mouseleave", () => { isDown = false; postersRow.classList.remove("dragging"); });
  postersRow.addEventListener("mouseup", () => { isDown = false; postersRow.classList.remove("dragging"); });
  postersRow.addEventListener("mousemove", e => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - postersRow.offsetLeft;
    const walk = (startX - x);
    postersRow.scrollLeft = scrollStart + walk;
  });
});
