/* ================================
   SPEAK page — YouTube sync + phrases
   ================================ */

function getTodayLessonIndex() { return daysSinceEpoch() % LESSONS.length; }

/* ---------- mood quote ---------- */
(function() {
  const q = document.getElementById("moodQuote");
  if (q && typeof DAILY_SLANG !== "undefined") {
    q.textContent = DAILY_SLANG[daysSinceEpoch() % DAILY_SLANG.length];
  }
})();

/* ---------- said-state (local, per-day) ---------- */

const SAID_KEY = "dailyApp.said";
function loadSaid() {
  try { return JSON.parse(localStorage.getItem(SAID_KEY) || "{}"); } catch (e) { return {}; }
}
function saveSaid(s) {
  try { localStorage.setItem(SAID_KEY, JSON.stringify(s)); } catch (e) {}
}
let saidState = loadSaid();

/* ---------- YouTube player ---------- */

let ytPlayer = null;
let syncInterval = null;
let currentLesson = null;

function onYouTubeIframeAPIReady() {
  if (currentLesson) buildPlayer(currentLesson.youtubeId);
}
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

function buildPlayer(youtubeId) {
  const frame = document.getElementById("videoFrame");
  frame.innerHTML = '<div id="ytPlayerHost"></div>';
  ytPlayer = new YT.Player("ytPlayerHost", {
    videoId: youtubeId,
    playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
    events: {
      onReady: () => {},
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.PLAYING) startSync();
        else stopSync();
      }
    }
  });
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
  let activeIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].t <= t) activeIdx = i;
    else break;
  }
  if (activeIdx < 0) return;
  const container = document.getElementById("transcript");
  if (!container) return;
  const els = container.querySelectorAll(".tx-line");
  els.forEach((el, i) => {
    if (i === activeIdx) {
      if (!el.classList.contains("active")) {
        el.classList.add("active");
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

/* ---------- transcript ---------- */

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

/* ---------- phrases (magazine layout) ---------- */

const PHRASE_LAYOUT = ["feature", "regular", "regular", "wide", "narrow", "narrow"];

function renderHighlights(lesson) {
  const el = document.getElementById("highlights");
  const today = getToday();
  const saidToday = saidState[today] || [];

  el.innerHTML = lesson.highlights.map((h, i) => {
    const isSaid = saidToday.includes(i);
    const size = PHRASE_LAYOUT[i % PHRASE_LAYOUT.length];
    return `
      <div class="phrase-item ${size}" data-idx="${i}">
        <button class="said-badge ${isSaid ? "done" : ""}" type="button" data-idx="${i}" aria-label="Mark as said">
          ${isSaid ? "\u2713" : "+"}
        </button>
        <span class="phrase-eyebrow">phrase no. ${String(i + 1).padStart(2, "0")}</span>
        <div class="phrase-text">"${h.phrase}"</div>
        <p class="phrase-note">${h.note}</p>
        <div class="phrase-sound">${h.sound}</div>
      </div>
    `;
  }).join("");

  el.querySelectorAll(".said-badge").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx, 10);
      toggleSaid(idx, btn);
    });
  });
}

function toggleSaid(idx, btnEl) {
  const today = getToday();
  if (!saidState[today]) saidState[today] = [];
  const pos = saidState[today].indexOf(idx);
  if (pos === -1) {
    saidState[today].push(idx);
    btnEl.classList.add("done");
    btnEl.innerHTML = "\u2713";
    addVibe(30);
    triggerKiss(btnEl);
  } else {
    saidState[today].splice(pos, 1);
    btnEl.classList.remove("done");
    btnEl.innerHTML = "+";
  }
  saveSaid(saidState);
}

function triggerKiss(anchorEl) {
  const rect = anchorEl.getBoundingClientRect();
  const kiss = document.createElement("div");
  kiss.textContent = "\ud83d\udc8b";
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

/* ---------- render lesson ---------- */

function renderLesson(lesson) {
  currentLesson = lesson;
  document.getElementById("sceneText").textContent = lesson.scene;
  document.getElementById("channelBadge").textContent = "@" + lesson.channel;
  renderTranscript(lesson);
  renderHighlights(lesson);
  if (window.YT && window.YT.Player) {
    buildPlayer(lesson.youtubeId);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderLesson(LESSONS[getTodayLessonIndex()]);
});
