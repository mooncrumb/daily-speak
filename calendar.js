/* ================================
   CALENDAR page — events + countdown
   ================================ */

const CAL_KEY = "dailyApp.events";

function loadEvents() {
  try { return JSON.parse(localStorage.getItem(CAL_KEY) || "[]"); } catch (e) { return []; }
}
function saveEvents(evts) {
  try { localStorage.setItem(CAL_KEY, JSON.stringify(evts)); } catch (e) {}
}

let events = loadEvents();

function daysUntil(dateStr) {
  const target = new Date(dateStr + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const ms = target.getTime() - now.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function fmtEventDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const opts = { weekday: "long", month: "long", day: "numeric", year: "numeric" };
  return d.toLocaleDateString("en-US", opts);
}

function renderEvents() {
  const el = document.getElementById("eventsList");
  const pastEl = document.getElementById("pastList");
  const pastSection = document.getElementById("pastSection");
  const total = document.getElementById("totalEvents");

  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = sorted.filter(e => daysUntil(e.date) >= 0);
  const past = sorted.filter(e => daysUntil(e.date) < 0).reverse();

  total.textContent = events.length + (events.length === 1 ? " plan" : " plans");

  if (upcoming.length === 0) {
    el.innerHTML = '<div class="cal-empty"><p>no upcoming plans. add one above.</p></div>';
  } else {
    el.innerHTML = upcoming.map(evt => renderEventCard(evt, false)).join("");
    el.querySelectorAll(".cal-delete").forEach(btn => {
      btn.addEventListener("click", () => deleteEvent(btn.dataset.id));
    });
  }

  if (past.length > 0) {
    pastSection.style.display = "block";
    pastEl.innerHTML = past.map(evt => renderEventCard(evt, true)).join("");
    pastEl.querySelectorAll(".cal-delete").forEach(btn => {
      btn.addEventListener("click", () => deleteEvent(btn.dataset.id));
    });
  } else {
    pastSection.style.display = "none";
  }
}

function renderEventCard(evt, isPast) {
  const days = daysUntil(evt.date);
  let label, numDisplay;
  if (days === 0) {
    label = "today";
    numDisplay = "\u2605";
  } else if (days === 1) {
    label = "tomorrow";
    numDisplay = "1";
  } else if (days > 1) {
    label = "days to go";
    numDisplay = days;
  } else if (days === -1) {
    label = "yesterday";
    numDisplay = "1";
  } else {
    label = "days ago";
    numDisplay = Math.abs(days);
  }
  const urgent = !isPast && days >= 0 && days <= 7;
  const classes = ["cal-event"];
  if (urgent) classes.push("urgent");
  if (isPast) classes.push("past");

  return `
    <div class="${classes.join(" ")}" data-id="${evt.id}">
      <button class="cal-delete" type="button" data-id="${evt.id}" aria-label="Delete">\u2715</button>
      <div class="cal-emoji">${evt.emoji || "\u{1F338}"}</div>
      <h3 class="cal-name">${escapeHTML(evt.name)}</h3>
      <div class="cal-date">${fmtEventDate(evt.date)}</div>
      <div class="cal-countdown">
        <span class="cal-countdown-num">${numDisplay}</span>
        <span class="cal-countdown-label">${label}</span>
      </div>
    </div>
  `;
}

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function addEvent(name, date, emoji) {
  const evt = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name, date, emoji
  };
  events.push(evt);
  saveEvents(events);
  renderEvents();
  addVibe(8);
}

function deleteEvent(id) {
  events = events.filter(e => e.id !== id);
  saveEvents(events);
  renderEvents();
}

/* ---------- form handling ---------- */

document.addEventListener("DOMContentLoaded", () => {
  renderEvents();

  const form = document.getElementById("addForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("eventName").value.trim();
    const date = document.getElementById("eventDate").value;
    const emoji = document.getElementById("eventEmoji").value;
    if (!name || !date) return;
    addEvent(name, date, emoji);
    document.getElementById("eventName").value = "";
    document.getElementById("eventDate").value = "";
  });
});
