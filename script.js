/* =====================================================
   Daily — global script (loaded on every page)
   ===================================================== */

const DAILY_STORAGE_KEY = "dailyApp";

function getToday() { return new Date().toISOString().slice(0, 10); }
function daysSinceEpoch() { return Math.floor(new Date().getTime() / (1000 * 60 * 60 * 24)); }

function loadGlobalState() {
  try {
    const raw = localStorage.getItem(DAILY_STORAGE_KEY);
    if (!raw) return { vibe: 0, vibeDate: null };
    const s = JSON.parse(raw);
    if (typeof s.vibe !== "number") s.vibe = 0;
    return s;
  } catch (e) {
    return { vibe: 0, vibeDate: null };
  }
}

function saveGlobalState(state) {
  try { localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
}

let globalState = loadGlobalState();
if (globalState.vibeDate !== getToday()) {
  globalState.vibe = 0;
  globalState.vibeDate = getToday();
  saveGlobalState(globalState);
}

/* ---------- vibe bar (top strip on every page) ---------- */

const MAX_VIBE = 100;

function renderVibeBar() {
  const bar = document.getElementById("waveActiveBar");
  if (!bar) return;
  const pct = Math.min(globalState.vibe / MAX_VIBE, 1);
  bar.style.width = (pct * 100) + "%";
}

function addVibe(amount) {
  globalState.vibe = Math.min(globalState.vibe + amount, MAX_VIBE);
  saveGlobalState(globalState);
  renderVibeBar();
  if (globalState.vibe >= MAX_VIBE) burstConfetti();
}

function burstConfetti() {
  for (let i = 0; i < 14; i++) {
    const dot = document.createElement("span");
    dot.style.cssText = `
      position: fixed; top: 20px;
      left: ${20 + Math.random() * (window.innerWidth - 40)}px;
      width: 6px; height: 6px;
      background: hsl(${330 + Math.random() * 30}, 90%, ${55 + Math.random() * 20}%);
      border-radius: 50%;
      pointer-events: none; z-index: 100;
      transition: transform 1.2s ease-out, opacity 1.2s ease-out;
    `;
    document.body.appendChild(dot);
    requestAnimationFrame(() => {
      dot.style.transform = `translate(${(Math.random() - 0.5) * 200}px, ${100 + Math.random() * 200}px) rotate(${Math.random() * 360}deg)`;
      dot.style.opacity = "0";
    });
    setTimeout(() => dot.remove(), 1400);
  }
}

/* ---------- date block (shared on each page) ---------- */

function renderDateBlock() {
  const days = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
  const mos  = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  const d = new Date();
  const dd = document.getElementById("dateDay");
  const dn = document.getElementById("dateNum");
  const dm = document.getElementById("dateMo");
  if (dd) dd.textContent = days[d.getDay()];
  if (dn) dn.textContent = String(d.getDate()).padStart(2, "0");
  if (dm) dm.textContent = mos[d.getMonth()];
}

/* ---------- speech synthesis (used by Speak + Wordbook) ---------- */

function speakPhrase(text, opts = {}) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  utter.rate = opts.rate || 0.92;
  const voices = window.speechSynthesis.getVoices();
  const usVoice = voices.find(v => v.lang === "en-US");
  if (usVoice) utter.voice = usVoice;
  window.speechSynthesis.speak(utter);
  addVibe(opts.vibe || 6);
}

/* ---------- init on every page ---------- */

document.addEventListener("DOMContentLoaded", () => {
  renderDateBlock();
  renderVibeBar();
  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => {};
  }
});
