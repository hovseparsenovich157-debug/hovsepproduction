// VIDEO LIST
const videoList = ["skoro.mp4","video1.mp4","chto budet.mp4","grustno.mp4"];
let mainPlayer = document.getElementById("mainPlayer");
let currentVideoIndex = 0;
mainPlayer.src = videoList[currentVideoIndex];

// MAIN PLAYER CONTROLS
document.getElementById("mainPlay").addEventListener("click",()=>{
  mainPlayer.paused ? mainPlayer.play() : mainPlayer.pause();
});
document.getElementById("mainMute").addEventListener("click",()=>{
  mainPlayer.muted = !mainPlayer.muted;
  document.getElementById("mainMute").querySelector("img").src = mainPlayer.muted ? "volume-off.png":"volume-on.png";
});
document.getElementById("rewind").addEventListener("click",()=>{mainPlayer.currentTime-=15;});
document.getElementById("forward").addEventListener("click",()=>{mainPlayer.currentTime+=5;});
document.getElementById("mainFS").addEventListener("click",()=>{
  if(mainPlayer.requestFullscreen) mainPlayer.requestFullscreen();
});

// PROGRESS BAR
let progressBar = document.getElementById("progressBar");
let progressFilled = document.getElementById("progressFilled");
mainPlayer.addEventListener("timeupdate",()=>{
  let percent = (mainPlayer.currentTime / mainPlayer.duration) * 100;
  progressFilled.style.width = percent+"%";
});
progressBar.addEventListener("click",(e)=>{
  let pos = e.offsetX / progressBar.offsetWidth;
  mainPlayer.currentTime = pos * mainPlayer.duration;
});

// NEXT VIDEO AUTOMATIC
mainPlayer.addEventListener("ended",()=>{
  currentVideoIndex = (currentVideoIndex +1) % videoList.length;
  mainPlayer.src = videoList[currentVideoIndex];
  mainPlayer.play();
});

// CAROUSEL
let slides = document.querySelectorAll(".slide");
let currentSlide = 0;
function showSlide(index){
  slides.forEach((s,i)=> s.style.transform = `translateX(${(i-index)*100}%)`);
}
document.querySelector(".next").addEventListener("click",()=>{currentSlide = (currentSlide+1)%slides.length;showSlide(currentSlide);});
document.querySelector(".prev").addEventListener("click",()=>{currentSlide = (currentSlide-1+slides.length)%slides.length;showSlide(currentSlide);});
setInterval(()=>{currentSlide = (currentSlide+1)%slides.length;showSlide(currentSlide);},2000);
showSlide(currentSlide);

// POSTERS (ПАРОВОЗИК)
document.querySelectorAll(".poster").forEach(p=>{
  p.addEventListener("click",()=>{
    let overlay = document.getElementById("playerOverlay");
    let overlayVideo = document.getElementById("overlayVideo");
    overlayVideo.src = p.dataset.video;
    overlay.classList.add("active");
    overlayVideo.play();
  });
});
document.getElementById("closeOverlay").addEventListener("click",()=>{
  let overlay = document.getElementById("playerOverlay");
  let overlayVideo = document.getElementById("overlayVideo");
  overlayVideo.pause();
  overlayVideo.src="";
  overlay.classList.remove("active");
});

// COUNTDOWN
function countdown(){
  let now = new Date();
  let eventDate = new Date("April 24, 2026 00:00:00");
  let total = eventDate-now;
  let days = Math.floor(total/(1000*60*60*24));
  let hours = Math.floor((total/(1000*60*60))%24);
  let minutes = Math.floor((total/1000/60)%60);
  let seconds = Math.floor((total/1000)%60);
  document.getElementById("days").innerText=days.toString().padStart(2,"0");
  document.getElementById("hours").innerText=hours.toString().padStart(2,"0");
  document.getElementById("minutes").innerText=minutes.toString().padStart(2,"0");
  document.getElementById("seconds").innerText=seconds.toString().padStart(2,"0");
}
setInterval(countdown,1000);
countdown();

// THEME TOGGLE
document.getElementById("themeToggle").addEventListener("click",()=>{
  document.body.classList.toggle("dark-theme");
  document.body.classList.toggle("light-theme");
});

// LANGUAGE TOGGLE
document.getElementById("langToggle").addEventListener("click",()=>{
  document.querySelectorAll("[data-lang-en]").forEach(el=>el.style.display=el.style.display==="none"?"inline":"none");
  document.querySelectorAll("[data-lang-ru]").forEach(el=>el.style.display=el.style.display==="none"?"inline":"none");
});
