// ============================================
// DAILY SPEAK — main logic
// Content lives in lessons.js (LESSONS array)
// ============================================

const STORAGE_KEY = "dailySpeak";

function getToday() {
  const d = new Date();
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function daysSinceEpoch() {
  const d = new Date();
  return Math.floor(d.getTime() / (1000 * 60 * 60 * 24));
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
  } catch (e) {
    // storage unavailable, fail silently
  }
}

let state = loadState();

function renderDate() {
  const el = document.getElementById("todayDate");
  const opts = { weekday: "long", month: "long", day: "numeric" };
  el.textContent = new Date().toLocaleDateString("en-US", opts);
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

function renderLesson(lesson) {
  document.getElementById("lessonTag").textContent = lesson.tag + (lesson.channel ? " · " + lesson.channel : "");
  document.getElementById("lessonPhrase").textContent = lesson.phrase;
  document.getElementById("lessonMeaning").textContent = lesson.meaning;
  document.getElementById("lessonExample").textContent = lesson.example;
  embedVideo(lesson.youtubeId);
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

function renderRepeatTracker() {
  const today = getToday();
  const todayReps = state.reps[today] || [];
  document.querySelectorAll(".repeat-dot").forEach(dot => {
    const rep = dot.dataset.rep;
    if (todayReps.includes(rep)) {
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
  if (idx === -1) {
    state.reps[today].push(rep);
  } else {
    state.reps[today].splice(idx, 1);
  }
  saveState(state);
  renderRepeatTracker();
}

function doCheckin() {
  const today = getToday();
  if (state.lastCheckin === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().slice(0, 10);

  if (state.lastCheckin === yStr) {
    state.streak += 1;
  } else {
    state.streak = 1;
  }
  state.lastCheckin = today;
  saveState(state);
  renderStreak();

  const btn = document.getElementById("checkinBtn");
  btn.textContent = "Nice work today! ✓";
  btn.disabled = true;

  const msg = document.getElementById("checkinMsg");
  msg.textContent = state.streak === 1
    ? "Day 1 in the books. See you tomorrow!"
    : `${state.streak} days in a row. Keep it going!`;
}

function renderArchive() {
  const grid = document.getElementById("archiveGrid");
  grid.innerHTML = "";
  const todayIdx = getTodayLessonIndex();

  LESSONS.forEach((lesson, i) => {
    const item = document.createElement("button");
    item.className = "archive-item";
    item.type = "button";
    item.innerHTML = `
      <div class="archive-day">${i === todayIdx ? "Today" : "Lesson " + (i + 1)}</div>
      <div class="archive-phrase">${lesson.phrase}</div>
    `;
    item.addEventListener("click", () => {
      renderLesson(lesson);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    grid.appendChild(item);
  });
}

function init() {
  renderDate();
  renderStreak();

  const todayIdx = getTodayLessonIndex();
  const todayLesson = LESSONS[todayIdx];
  renderLesson(todayLesson);
  renderRepeatTracker();
  renderArchive();

  document.getElementById("speakBtn").addEventListener("click", () => {
    const phrase = document.getElementById("lessonPhrase").textContent;
    speakPhrase(phrase);
  });

  document.querySelectorAll(".repeat-dot").forEach(dot => {
    dot.addEventListener("click", () => toggleRep(dot.dataset.rep));
  });

  const checkinBtn = document.getElementById("checkinBtn");
  if (state.lastCheckin === getToday()) {
    checkinBtn.textContent = "Nice work today! ✓";
    checkinBtn.disabled = true;
  }
  checkinBtn.addEventListener("click", doCheckin);

  // voices load async in some browsers
  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => {};
  }
}

document.addEventListener("DOMContentLoaded", init);
