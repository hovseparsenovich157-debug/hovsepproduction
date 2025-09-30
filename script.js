const videoList=["skoro.mp4","video1.mp4","chto budet.mp4","grustno.mp4"];
let mainPlayer=document.getElementById("mainPlayer");
let currentVideoIndex=0;
mainPlayer.src=videoList[currentVideoIndex];
document.getElementById("mainPlay").addEventListener("click",()=>{mainPlayer.paused?mainPlayer.play():mainPlayer.pause();});
document.getElementById("mainMute").addEventListener("click",()=>{
  mainPlayer.muted=!mainPlayer.muted;
  document.getElementById("mainMute").querySelector("img").src=mainPlayer.muted?"volume-off.png":"volume-on.png";
});
document.getElementById("rewind").addEventListener("click",()=>{mainPlayer.currentTime-=15;});
document.getElementById("forward").addEventListener("click",()=>{mainPlayer.currentTime+=5;});
document.getElementById("mainFS").addEventListener("click",()=>{mainPlayer.requestFullscreen();});
let progressBar=document.getElementById("progressBar");
let progressFilled=document.getElementById("progressFilled");
mainPlayer.addEventListener("timeupdate",()=>{progressFilled.style.width=(mainPlayer.currentTime/mainPlayer.duration*100)+"%";});
progressBar.addEventListener("click",e=>{let pos=e.offsetX/progressBar.offsetWidth;mainPlayer.currentTime=pos*mainPlayer.duration;});
mainPlayer.addEventListener("ended",()=>{currentVideoIndex=(currentVideoIndex+1)%videoList.length;mainPlayer.src=videoList[currentVideoIndex];mainPlayer.play();});
let slides=document.querySelectorAll(".slide");
let currentSlide=0;
function showSlide(index){slides.forEach((s,i)=>s.style.transform=`translateX(${(i-index)*100}%)`);}
document.querySelector(".next").addEventListener("click",()=>{currentSlide=(currentSlide+1)%slides.length;showSlide(currentSlide);});
document.querySelector(".prev").addEventListener("click",()=>{currentSlide=(currentSlide-1+slides.length)%slides.length;showSlide(currentSlide);});
setInterval(()=>{currentSlide=(currentSlide+1)%slides.length;showSlide(currentSlide);},2000);
showSlide(currentSlide);
document.querySelectorAll(".poster").forEach(p=>{p.addEventListener("click",()=>{
  let overlay=document.getElementById("playerOverlay");
  let overlayVideo=document.getElementById("overlayVideo");
  overlayVideo.src=p.dataset.video;
  overlay.classList.add("active");
  overlayVideo.play();
});});
document.getElementById("closeOverlay").addEventListener("click",()=>{
  let overlay=document.getElementById("playerOverlay");
  let overlayVideo=document.getElementById("overlayVideo");
  overlayVideo.pause();
  overlay.classList.remove("active");
});
// Countdown
let countdownDate=new Date("Apr 24, 2026 00:00:00").getTime();
setInterval(()=>{
  let now=new Date().getTime();
  let distance=countdownDate-now;
  document.getElementById("days").innerText=Math.floor(distance/(1000*60*60*24));
  document.getElementById("hours").innerText=Math.floor((distance%(1000*60*60*24))/(1000*60*60));
  document.getElementById("minutes").innerText=Math.floor((distance%(1000*60*60))/(1000*60));
  document.getElementById("seconds").innerText=Math.floor((distance%(1000*60))/1000);
},1000);
// Theme toggle
document.getElementById("themeToggle").addEventListener("click",()=>{
  document.body.classList.toggle("dark-theme");
  document.body.classList.toggle("light-theme");
});
// Language toggle
document.getElementById("langToggle").addEventListener("click",()=>{
  document.querySelectorAll("[data-lang-en]").forEach(e=>e.style.display=e.style.display==="none"?"block":"none");
  document.querySelectorAll("[data-lang-ru]").forEach(e=>e.style.display=e.style.display==="none"?"block":"none");
});
