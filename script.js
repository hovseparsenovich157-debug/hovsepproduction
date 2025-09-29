document.addEventListener("DOMContentLoaded", () => {
  // ------------------------------
  // 🔘 Верхние кнопки (домой/тема/язык)
  // ------------------------------
  const themeBtn = document.getElementById("themeToggle");
  const langBtn = document.getElementById("langToggle");

  // Переключение темы
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme");
    });
  }

  // Переключение языка
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      alert("Функция смены языка пока в разработке 🙂");
    });
  }

  // ------------------------------
  // ▶️ Видео плеер
  // ------------------------------
  const posters = document.querySelectorAll(".poster");
  posters.forEach(poster => {
    poster.addEventListener("click", () => {
      const videoUrl = poster.dataset.video;
      if (videoUrl) {
        const video = document.createElement("video");
        video.src = videoUrl;
        video.controls = true;
        video.autoplay = true;
        video.style.position = "fixed";
        video.style.top = "0";
        video.style.left = "0";
        video.style.width = "100%";
        video.style.height = "100%";
        video.style.zIndex = "9999";
        video.style.backgroundColor = "black";

        // Закрытие по клику
        video.addEventListener("click", () => video.remove());

        document.body.appendChild(video);
        video.requestFullscreen?.();
      }
    });
  });

  // ------------------------------
  // 🎠 Старая карусель
  // ------------------------------
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  let idx = 0;

  function showSlide(i) {
    slides.forEach((s, n) => s.classList.toggle("active", n === i));
  }

  function nextSlide() {
    idx = (idx + 1) % slides.length;
    showSlide(idx);
  }

  function prevSlide() {
    idx = (idx - 1 + slides.length) % slides.length;
    showSlide(idx);
  }

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);
  }

  showSlide(idx);

  // ------------------------------
  // 🚂 Паровозик (горизонтальный скролл + свайп)
  // ------------------------------
  const postersRow = document.getElementById("postersRow");
  if (postersRow) {
    let startX = 0;
    let scrollStart = 0;

    postersRow.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      scrollStart = postersRow.scrollLeft;
    }, { passive: true });

    postersRow.addEventListener("touchend", (e) => {
      let endX = e.changedTouches[0].clientX;
      let diff = startX - endX;
      const cardWidth = postersRow.querySelector(".poster").offsetWidth + 16;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          postersRow.scrollTo({ left: scrollStart + cardWidth, behavior: "smooth" });
        } else {
          postersRow.scrollTo({ left: scrollStart - cardWidth, behavior: "smooth" });
        }
      }
    });
  }
});
