// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Конфигурация твоего проекта Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCADt2OLPtbl9mQaIL7VwWynRDfpejrZj8",
  authDomain: "mysite-counter-958fb.firebaseapp.com",
  projectId: "mysite-counter-958fb",
  storageBucket: "mysite-counter-958fb.firebasestorage.app",
  messagingSenderId: "490039474707",
  appId: "1:490039474707:web:cc2d252206e7a3e2141de6",
  measurementId: "G-GPJX8TR15Y"
};

// Инициализация
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Обновляем счётчики
async function updateCounter() {
  const today = new Date();
  const dayKey = today.toISOString().split('T')[0];
  const monthKey = today.getFullYear() + "-" + (today.getMonth() + 1);
  const yearKey = today.getFullYear();

  const globalRef = doc(db, "counters", "global");
  const dailyRef = doc(db, "counters", "day_" + dayKey);
  const monthlyRef = doc(db, "counters", "month_" + monthKey);
  const yearlyRef = doc(db, "counters", "year_" + yearKey);

  await Promise.all([
    updateOrCreate(globalRef),
    updateOrCreate(dailyRef),
    updateOrCreate(monthlyRef),
    updateOrCreate(yearlyRef)
  ]);

  renderCounters(globalRef, dailyRef, monthlyRef, yearlyRef);
}

// Функция для обновления документа
async function updateOrCreate(ref) {
  const snap = await getDoc(ref);
  if (snap.exists()) {
    await updateDoc(ref, { value: increment(1) });
  } else {
    await setDoc(ref, { value: 1 });
  }
}

// Рендерим значения на странице
async function renderCounters(globalRef, dailyRef, monthlyRef, yearlyRef) {
  const [globalSnap, dailySnap, monthlySnap, yearlySnap] = await Promise.all([
    getDoc(globalRef),
    getDoc(dailyRef),
    getDoc(monthlyRef),
    getDoc(yearlyRef)
  ]);

  document.getElementById("dailyCounter").innerText = dailySnap.exists() ? dailySnap.data().value : 0;
  document.getElementById("monthlyCounter").innerText = monthlySnap.exists() ? monthlySnap.data().value : 0;
  document.getElementById("yearlyCounter").innerText = yearlySnap.exists() ? yearlySnap.data().value : 0;
  document.getElementById("totalCounter").innerText = globalSnap.exists() ? globalSnap.data().value : 0;
}

updateCounter();
