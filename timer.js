function startCountdown(){
  const targetDate = new Date("2026-04-24T00:00:00").getTime();
  function updateCountdown(){
    const now = new Date().getTime();
    const distance = targetDate - now;
    if(distance<=0){
      document.querySelectorAll("#countdown .cd-days, #countdown .cd-hours, #countdown .cd-minutes, #countdown .cd-seconds").forEach(e=>e.textContent="00");
      return;
    }
    const days=Math.floor(distance/(1000*60*60*24));
    const hours=Math.floor((distance%(1000*60*60*24))/(1000*60*60));
    const minutes=Math.floor((distance%(1000*60*60))/(1000*60));
    const seconds=Math.floor((distance%(1000*60))/1000);
    document.querySelector("#countdown .cd-days").textContent = String(days).padStart(2,"0");
    document.querySelector("#countdown .cd-hours").textContent = String(hours).padStart(2,"0");
    document.querySelector("#countdown .cd-minutes").textContent = String(minutes).padStart(2,"0");
    document.querySelector("#countdown .cd-seconds").textContent = String(seconds).padStart(2,"0");
  }
  updateCountdown();
  setInterval(updateCountdown,1000);
}
document.addEventListener("DOMContentLoaded",startCountdown);
