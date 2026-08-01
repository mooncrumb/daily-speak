/* ================================
   WORDBOOK page — daily rotation logic
   ================================ */

const WB_STASH_KEY = "dailyApp.wordStash";
const WB_TODAY_KEY = "dailyApp.wordToday";
const WORDS_PER_DAY = 5;

function loadStash() {
  try { return JSON.parse(localStorage.getItem(WB_STASH_KEY) || "[]"); } catch (e) { return []; }
}
function saveStash(s) {
  try { localStorage.setItem(WB_STASH_KEY, JSON.stringify(s)); } catch (e) {}
}

let stash = loadStash();

/* pick today's 5 words based on date, skipping ones already in stash */
function pickTodayWords() {
  const dse = daysSinceEpoch();
  const stashSet = new Set(stash);
  const available = WORDS.filter(w => !stashSet.has(w.word));

  if (available.length === 0) {
    // ran out — recycle stash starting from oldest
    return WORDS.slice((dse * WORDS_PER_DAY) % WORDS.length, ((dse * WORDS_PER_DAY) % WORDS.length) + WORDS_PER_DAY);
  }

  // deterministic pick: start from an index based on today's date
  const startIdx = (dse * WORDS_PER_DAY) % available.length;
  const picked = [];
  for (let i = 0; i < WORDS_PER_DAY && i < available.length; i++) {
    picked.push(available[(startIdx + i) % available.length]);
  }
  return picked;
}

/* ---------- weekly dots ---------- */

function renderWeekDots() {
  const el = document.getElementById("weekDots");
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sun
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const stashSize = stash.length;

  // Assume: user has been collecting sequentially. Fill dots for days that have contributed.
  // Simpler: show 7 dots for this week, mark today.
  el.innerHTML = days.map((letter, i) => {
    const classes = ["wb-dot"];
    if (i < dayOfWeek) classes.push("filled");
    if (i === dayOfWeek) classes.push("today");
    return `<span class="${classes.join(" ")}">${letter}</span>`;
  }).join("");
}

/* ---------- word cards ---------- */

function renderWordCards() {
  const el = document.getElementById("wordCards");
  const words = pickTodayWords();
  const stashSet = new Set(stash);

  el.innerHTML = words.map((w, i) => {
    const isGot = stashSet.has(w.word);
    return `
      <article class="wb-card" data-word="${w.word}">
        <span class="wb-index">${String(i + 1).padStart(2, "0")}</span>
        <h2 class="wb-word">${w.word}</h2>
        <span class="wb-pos">${w.pos}</span>
        <p class="wb-meaning">${w.meaning}</p>
        <div class="wb-example">"${w.example}"</div>
        <div class="wb-actions">
          <button class="wb-btn wb-btn-hear" type="button" data-say="${encodeURIComponent(w.word)}">
            \u{1F509} hear it
          </button>
          <button class="wb-btn wb-btn-got ${isGot ? "done" : ""}" type="button" data-word="${w.word}">
            ${isGot ? "\u2713 got it" : "got it"}
          </button>
          <span class="wb-level">${w.level}</span>
        </div>
      </article>
    `;
  }).join("");

  el.querySelectorAll(".wb-btn-hear").forEach(btn => {
    btn.addEventListener("click", () => {
      speakPhrase(decodeURIComponent(btn.dataset.say), { rate: 0.85, vibe: 4 });
    });
  });

  el.querySelectorAll(".wb-btn-got").forEach(btn => {
    btn.addEventListener("click", () => {
      toggleStash(btn.dataset.word, btn);
    });
  });
}

function toggleStash(word, btnEl) {
  const idx = stash.indexOf(word);
  if (idx === -1) {
    stash.push(word);
    btnEl.classList.add("done");
    btnEl.innerHTML = "\u2713 got it";
    addVibe(15);
    triggerSparkle(btnEl);
  } else {
    stash.splice(idx, 1);
    btnEl.classList.remove("done");
    btnEl.innerHTML = "got it";
  }
  saveStash(stash);
  renderStash();
}

function triggerSparkle(anchorEl) {
  const rect = anchorEl.getBoundingClientRect();
  for (let i = 0; i < 6; i++) {
    const s = document.createElement("span");
    s.textContent = "\u2727";
    s.style.cssText = `
      position: fixed;
      left: ${rect.left + rect.width / 2}px;
      top: ${rect.top + rect.height / 2}px;
      color: hsl(${290 + Math.random() * 40}, 90%, 65%);
      font-size: ${12 + Math.random() * 10}px;
      pointer-events: none;
      z-index: 100;
      transition: transform 0.9s cubic-bezier(.22,.9,.34,1), opacity 0.9s ease-out;
      filter: drop-shadow(0 0 6px currentColor);
    `;
    document.body.appendChild(s);
    const angle = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 40;
    requestAnimationFrame(() => {
      s.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) rotate(${Math.random() * 360}deg) scale(0.3)`;
      s.style.opacity = "0";
    });
    setTimeout(() => s.remove(), 1000);
  }
}

/* ---------- stash rendering ---------- */

function renderStash() {
  const el = document.getElementById("stashList");
  const count = document.getElementById("stashCount");
  count.textContent = stash.length + (stash.length === 1 ? " word learned" : " words learned");

  if (stash.length === 0) {
    el.innerHTML = '<p class="wb-stash-empty">no words in your stash yet. tap "got it" on any word above to add it.</p>';
    return;
  }

  el.innerHTML = stash.map(w => `<span class="wb-stash-tag">${w}</span>`).join("");
}

/* ---------- init ---------- */

document.addEventListener("DOMContentLoaded", () => {
  renderWeekDots();
  renderWordCards();
  renderStash();
});
