// Daily Speak — main logic (with YouTube sync + speak-o-meter)

const STORAGE_KEY = "dailySpeak";

/* ---------- storage ---------- */

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function daysSinceEpoch() {
  return Math.floor(new Date().getTime() / (1000 * 60 * 60 * 24));
}

function getTodayLessonIndex() {
  return daysSinceEpoch() % LESSONS.length;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { streak: 0, lastCheckin: null, said: {}, vibe: 0 };
    const s = JSON.parse(raw);
    if (typeof s.vibe !== "number") s.vibe = 0;
    if (!s.said) s.said = {};
    return s;
  } catch (e) {
    return { streak: 0, lastCheckin: null, said: {}, vibe: 0 };
  }
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
}

let state = loadState();
// reset vibe daily
if (state.vibeDate !== getToday()) {
  state.vibe = 0;
  state.vibeDate = getToday();
  saveState(state);
}

/* ---------- masthead ---------- */

function renderMasthead() {
  const d = new Date();
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const mos  = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  document.getElementById("dateDay").textContent = days[d.getDay()];
  document.getElementById("dateNum").textContent = String(d.getDate()).padStart(2, "0");
  document.getElementById("dateMo").textContent  = mos[d.getMonth()];

  const slangIdx = daysSinceEpoch() % DAILY_SLANG.length;
  document.getElementById("moodQuote").textContent = DAILY_SLANG[slangIdx];

  const issueNum = String(getTodayLessonIndex() + 1).padStart(3, "0");
  document.getElementById("issueNum").textContent = "issue #" + issueNum;
}

/* ---------- speak-o-meter ---------- */

const MAX_VIBE = 100;

function renderVibe() {
  const pct = Math.min(state.vibe / MAX_VIBE, 1);
  const total = 1200;
  const offset = total * (1 - pct);
  const wave = document.getElementById("waveActive");
  if (wave) wave.setAttribute("stroke-dashoffset", offset);
  const txt = document.getElementById("vibeText");
  if (txt) txt.textContent = "vibe: " + Math.round(pct * 100);
}

function addVibe(amount) {
  state.vibe = Math.min(state.vibe + amount, MAX_VIBE);
  saveState(state);
  renderVibe();
  if (state.vibe >= MAX_VIBE) burstConfetti();
}

// tiny confetti burst when vibe maxes out
function burstConfetti() {
  const meter = document.getElementById("speakOMeter");
  if (!meter) return;
  for (let i = 0; i < 14; i++) {
    const dot = document.createElement("span");
    dot.style.cssText = `
      position: fixed;
      top: 20px;
      left: ${20 + Math.random() * (window.innerWidth - 40)}px;
      width: 6px; height: 6px;
      background: hsl(${330 + Math.random() * 30}, 90%, ${55 + Math.random() * 20}%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 100;
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

/* ---------- YouTube player ---------- */

let ytPlayer = null;
let syncInterval = null;
let currentLesson = null;

function onYouTubeIframeAPIReady() {
  // called by YouTube API script
  if (currentLesson) buildPlayer(currentLesson.youtubeId);
}
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

function buildPlayer(youtubeId) {
  const frame = document.getElementById("videoFrame");
  frame.innerHTML = '<div id="ytPlayerHost"></div>';
  ytPlayer = new YT.Player("ytPlayerHost", {
    videoId: youtubeId,
    playerVars: {
      rel: 0,
      modestbranding: 1,
      playsinline: 1
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerReady() {
  // ready — nothing needed
}

function onPlayerStateChange(e) {
  if (e.data === YT.PlayerState.PLAYING) {
    startSync();
  } else {
    stopSync();
  }
}

function startSync() {
  stopSync();
  syncInterval = setInterval(updateActiveLine, 400);
}

function stopSync() {
  if (syncInterval) { clearInterval(syncInterval); syncInterval = null; }
}

function updateActiveLine() {
  if (!ytPlayer || !ytPlayer.getCurrentTime || !currentLesson) return;
  const t = ytPlayer.getCurrentTime();
  const lines = currentLesson.transcript;

  // find last line whose time <= current time
  let activeIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].t <= t) activeIdx = i;
    else break;
  }
  if (activeIdx < 0) return;

  const container = document.getElementById("transcript");
  const els = container.querySelectorAll(".tx-line");
  els.forEach((el, i) => {
    if (i === activeIdx) {
      if (!el.classList.contains("active")) {
        el.classList.add("active");
        // scroll into view within container
        const cRect = container.getBoundingClientRect();
        const eRect = el.getBoundingClientRect();
        if (eRect.top < cRect.top + 20 || eRect.bottom > cRect.bottom - 20) {
          container.scrollTop = el.offsetTop - container.offsetTop - 60;
        }
      }
    } else {
      el.classList.remove("active");
    }
  });
}

/* ---------- transcript rendering ---------- */

function fmtTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ":" + String(s).padStart(2, "0");
}

function highlightText(text, phrases) {
  let out = text;
  const sorted = [...phrases].sort((a, b) => b.length - a.length);
  sorted.forEach(phrase => {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp("(" + escaped + ")", "gi");
    out = out.replace(re, '<span class="hl">$1</span>');
  });
  return out;
}

function renderTranscript(lesson) {
  const container = document.getElementById("transcript");
  const phrases = lesson.highlights.map(h => h.phrase);

  container.innerHTML = lesson.transcript.map((line, i) => `
    <div class="tx-line" data-time="${line.t}" data-i="${i}">
      <span class="tx-time">${fmtTime(line.t)}</span>
      <span class="tx-text">${highlightText(line.text, phrases)}</span>
    </div>
  `).join("");

  container.querySelectorAll(".tx-line").forEach(el => {
    el.addEventListener("click", () => {
      const t = parseFloat(el.dataset.time);
      if (ytPlayer && ytPlayer.seekTo) {
        ytPlayer.seekTo(t, true);
        ytPlayer.playVideo();
      }
    });
  });
}

/* ---------- highlights cards ---------- */

function renderHighlights(lesson) {
  const el = document.getElementById("highlights");
  const today = getToday();
  const saidToday = state.said[today] || [];

  el.innerHTML = lesson.highlights.map((h, i) => {
    const isSaid = saidToday.includes(i);
    return `
      <div class="highlight-card" data-idx="${i}">
        <h3 class="highlight-phrase">${h.phrase}</h3>
        <p class="highlight-note">${h.note}</p>
        <div class="highlight-sound">${h.sound}</div>
        <div class="card-actions">
          <button class="speak-btn-mini" type="button" data-phrase="${encodeURIComponent(h.phrase)}">
            🔊 hear it
          </button>
          <button class="said-btn ${isSaid ? "done" : ""}" type="button" data-idx="${i}">
            ${isSaid ? "✓ said it" : "i said it"}
          </button>
        </div>
      </div>
    `;
  }).join("");

  el.querySelectorAll(".speak-btn-mini").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const phrase = decodeURIComponent(btn.dataset.phrase);
      speakPhrase(phrase);
    });
  });

  el.querySelectorAll(".said-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx, 10);
      toggleSaid(idx, btn);
    });
  });
}

function toggleSaid(idx, btnEl) {
  const today = getToday();
  if (!state.said[today]) state.said[today] = [];
  const pos = state.said[today].indexOf(idx);
  if (pos === -1) {
    state.said[today].push(idx);
    btnEl.classList.add("done");
    btnEl.innerHTML = "✓ said it";
    addVibe(30);
    triggerKiss(btnEl);
  } else {
    state.said[today].splice(pos, 1);
    btnEl.classList.remove("done");
    btnEl.innerHTML = "i said it";
  }
  saveState(state);
}

// a small pink kiss print pops out when you tap "i said it"
function triggerKiss(anchorEl) {
  const rect = anchorEl.getBoundingClientRect();
  const kiss = document.createElement("div");
  kiss.textContent = "💋";
  kiss.style.cssText = `
    position: fixed;
    left: ${rect.left + rect.width / 2 - 12}px;
    top: ${rect.top - 10}px;
    font-size: 24px;
    pointer-events: none;
    z-index: 100;
    transition: transform 1s cubic-bezier(.22,.9,.34,1), opacity 1s ease-out;
    filter: drop-shadow(0 0 8px rgba(255, 61, 139, 0.7));
  `;
  document.body.appendChild(kiss);
  requestAnimationFrame(() => {
    kiss.style.transform = `translate(${(Math.random() - 0.5) * 60}px, -80px) rotate(${(Math.random() - 0.5) * 40}deg) scale(1.4)`;
    kiss.style.opacity = "0";
  });
  setTimeout(() => kiss.remove(), 1200);
}

/* ---------- speech synthesis ---------- */

function speakPhrase(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  utter.rate = 0.92;
  const voices = window.speechSynthesis.getVoices();
  const usVoice = voices.find(v => v.lang === "en-US");
  if (usVoice) utter.voice = usVoice;
  window.speechSynthesis.speak(utter);
  addVibe(6);
}

/* ---------- lesson loading ---------- */

function renderLesson(lesson) {
  currentLesson = lesson;
  document.getElementById("sceneText").textContent = lesson.scene;
  document.getElementById("channelBadge").textContent = "@" + lesson.channel;
  renderTranscript(lesson);
  renderHighlights(lesson);

  // build player (or wait for API)
  if (window.YT && window.YT.Player) {
    buildPlayer(lesson.youtubeId);
  }
}

/* ---------- archive ---------- */

function renderArchive() {
  const list = document.getElementById("archiveList");
  list.innerHTML = "";
  const todayIdx = getTodayLessonIndex();

  LESSONS.forEach((lesson, i) => {
    const item = document.createElement("button");
    item.className = "archive-item";
    item.type = "button";
    item.innerHTML = `
      <div class="archive-day">${i === todayIdx ? "Today" : "Issue #" + String(i + 1).padStart(3, "0")}</div>
      <div class="archive-scene">${lesson.scene}</div>
    `;
    item.addEventListener("click", () => {
      renderLesson(lesson);
      closeArchive();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    list.appendChild(item);
  });
}

function openArchive() {
  document.getElementById("archiveDrawer").classList.add("open");
  document.getElementById("archiveDrawer").setAttribute("aria-hidden", "false");
}

function closeArchive() {
  document.getElementById("archiveDrawer").classList.remove("open");
  document.getElementById("archiveDrawer").setAttribute("aria-hidden", "true");
}

/* ---------- init ---------- */

function init() {
  renderMasthead();
  renderVibe();

  const todayLesson = LESSONS[getTodayLessonIndex()];
  renderLesson(todayLesson);
  renderArchive();

  document.getElementById("pastToggle").addEventListener("click", openArchive);
  document.getElementById("archiveClose").addEventListener("click", closeArchive);

  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => {};
  }
}

document.addEventListener("DOMContentLoaded", init);
