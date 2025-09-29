function startCountdown() {
  const targetDate = new Date("2026-04-24T00:00:00").getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      document.querySelectorAll("#countdown .cd-days").forEach(e => e.textContent = "00");
      document.querySelectorAll("#countdown .cd-hours").forEach(e => e.textContent = "00");
      document.querySelectorAll("#countdown .cd-minutes").forEach(e => e.textContent = "00");
      document.querySelectorAll("#countdown .cd-seconds").forEach(e => e.textContent = "00");
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.querySelectorAll("#countdown .cd-days").forEach(e => e.textContent = days.toString().padStart(2, "0"));
    document.querySelectorAll("#countdown .cd-hours").forEach(e => e.textContent = hours.toString().padStart(2, "0"));
    document.querySelectorAll("#countdown .cd-minutes").forEach(e => e.textContent = minutes.toString().padStart(2, "0"));
    document.querySelectorAll("#countdown .cd-seconds").forEach(e => e.textContent = seconds.toString().padStart(2, "0"));
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

document.addEventListener("DOMContentLoaded", startCountdown);
