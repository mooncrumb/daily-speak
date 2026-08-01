// Daily Speak — main logic

const STORAGE_KEY = "dailySpeak";

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
    if (!raw) return { streak: 0, lastCheckin: null, reps: {} };
    return JSON.parse(raw);
  } catch (e) {
    return { streak: 0, lastCheckin: null, reps: {} };
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

let state = loadState();

function renderDate() {
  const el = document.getElementById("todayDate");
  const opts = { weekday: "long", month: "long", day: "numeric" };
  const dateStr = new Date().toLocaleDateString("en-US", opts);
  el.textContent = "Today · " + dateStr;
}

function renderStreak() {
  document.getElementById("streakCount").textContent = state.streak;
}

function embedVideo(youtubeId) {
  const frame = document.getElementById("videoFrame");
  frame.innerHTML = `<iframe
      src="https://www.youtube.com/embed/${youtubeId}"
      title="Today's practice video"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>`;
}

// Highlight phrases inside transcript lines
function renderTranscript(transcriptLines, highlights) {
  const el = document.getElementById("transcript");
  const phrases = highlights.map(h => h.phrase);

  const highlighted = transcriptLines.map(line => {
    let out = line;
    // longest phrases first, so overlapping matches favor the longer one
    const sorted = [...phrases].sort((a, b) => b.length - a.length);
    sorted.forEach(phrase => {
      const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp("(" + escaped + ")", "gi");
      out = out.replace(re, '<span class="hl">$1</span>');
    });
    return `<p>${out}</p>`;
  }).join("");

  el.innerHTML = highlighted;
}

function renderHighlights(highlights) {
  const el = document.getElementById("highlights");
  el.innerHTML = highlights.map((h, i) => `
    <div class="highlight-card">
      <h3 class="highlight-phrase">${h.phrase}</h3>
      <p class="highlight-note">${h.note}</p>
      <div class="highlight-sound">${h.sound}</div>
      <button class="speak-btn-mini" type="button" data-phrase="${encodeURIComponent(h.phrase)}">
        🔊 Hear it
      </button>
    </div>
  `).join("");

  el.querySelectorAll(".speak-btn-mini").forEach(btn => {
    btn.addEventListener("click", () => {
      const phrase = decodeURIComponent(btn.dataset.phrase);
      speakPhrase(phrase);
    });
  });
}

function speakPhrase(text) {
  if (!("speechSynthesis" in window)) {
    alert("Your browser doesn't support text-to-speech. Try Chrome or Edge.");
    return;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  utter.rate = 0.92;
  const voices = window.speechSynthesis.getVoices();
  const usVoice = voices.find(v => v.lang === "en-US");
  if (usVoice) utter.voice = usVoice;
  window.speechSynthesis.speak(utter);
}

function renderLesson(lesson) {
  document.getElementById("sceneText").textContent = lesson.scene;
  document.getElementById("channelBadge").textContent = "@" + lesson.channel;
  embedVideo(lesson.youtubeId);
  renderTranscript(lesson.transcript, lesson.highlights);
  renderHighlights(lesson.highlights);
}

/* ---------- repeat tracker + check-in ---------- */

function renderRepeatTracker() {
  const today = getToday();
  const todayReps = state.reps[today] || [];
  document.querySelectorAll(".repeat-dot").forEach(dot => {
    if (todayReps.includes(dot.dataset.rep)) {
      dot.classList.add("done");
    } else {
      dot.classList.remove("done");
    }
  });
}

function toggleRep(rep) {
  const today = getToday();
  if (!state.reps[today]) state.reps[today] = [];
  const idx = state.reps[today].indexOf(rep);
  if (idx === -1) state.reps[today].push(rep);
  else state.reps[today].splice(idx, 1);
  saveState(state);
  renderRepeatTracker();
}

function doCheckin() {
  const today = getToday();
  if (state.lastCheckin === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().slice(0, 10);

  state.streak = (state.lastCheckin === yStr) ? state.streak + 1 : 1;
  state.lastCheckin = today;
  saveState(state);
  renderStreak();

  const btn = document.getElementById("checkinBtn");
  btn.textContent = "Nice work ✓";
  btn.disabled = true;
}

/* ---------- archive drawer ---------- */

function renderArchive() {
  const list = document.getElementById("archiveList");
  list.innerHTML = "";
  const todayIdx = getTodayLessonIndex();

  LESSONS.forEach((lesson, i) => {
    const item = document.createElement("button");
    item.className = "archive-item";
    item.type = "button";
    item.innerHTML = `
      <div class="archive-day">${i === todayIdx ? "Today" : "Lesson " + (i + 1)}</div>
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
  renderDate();
  renderStreak();

  const todayLesson = LESSONS[getTodayLessonIndex()];
  renderLesson(todayLesson);
  renderRepeatTracker();
  renderArchive();

  document.querySelectorAll(".repeat-dot").forEach(dot => {
    dot.addEventListener("click", () => toggleRep(dot.dataset.rep));
  });

  const checkinBtn = document.getElementById("checkinBtn");
  if (state.lastCheckin === getToday()) {
    checkinBtn.textContent = "Nice work ✓";
    checkinBtn.disabled = true;
  }
  checkinBtn.addEventListener("click", doCheckin);

  document.getElementById("archiveToggle").addEventListener("click", openArchive);
  document.getElementById("archiveClose").addEventListener("click", closeArchive);

  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => {};
  }
}

document.addEventListener("DOMContentLoaded", init);
