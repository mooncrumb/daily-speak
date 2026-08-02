/* ================================
   CALENDAR — month grid + hero countdown
   ================================ */

const CAL_KEY = "dailyApp.events";

function loadEvents() {
  try { return JSON.parse(localStorage.getItem(CAL_KEY) || "[]"); } catch (e) { return []; }
}
function saveEvents(evts) {
  try { localStorage.setItem(CAL_KEY, JSON.stringify(evts)); } catch (e) {}
}

let events = loadEvents();
let viewYear, viewMonth; // month being displayed (0-indexed)

function daysUntil(dateStr) {
  const target = new Date(dateStr + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function fmtEventDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" });
}

function escapeHTML(s) {
  return s.replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}

/* ---------- HERO countdown (nearest future event) ---------- */

function renderHero() {
  const el = document.getElementById("heroCountdown");
  const upcoming = events
    .filter(e => daysUntil(e.date) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (upcoming.length === 0) {
    el.innerHTML = `<div class="hero-empty">
      no plans on the horizon. drop one below and start the countdown.
    </div>`;
    return;
  }

  const evt = upcoming[0];
  const days = daysUntil(evt.date);
  let dayNum, dayLabel;

  if (days === 0) { dayNum = "★"; dayLabel = "today"; }
  else if (days === 1) { dayNum = "1"; dayLabel = "day to go"; }
  else { dayNum = String(days); dayLabel = "days to go"; }

  el.innerHTML = `
    <div class="hero-countdown-inner">
      <div class="hero-emoji">${evt.emoji || "🌸"}</div>
      <div class="hero-info">
        <div class="hero-label">next up</div>
        <h2 class="hero-name">${escapeHTML(evt.name)}</h2>
        <p class="hero-date">${fmtEventDate(evt.date)}</p>
      </div>
      <div class="hero-days">
        <div class="hero-days-num">${dayNum}</div>
        <div class="hero-days-label">${dayLabel}</div>
      </div>
    </div>
  `;
}

/* ---------- month grid ---------- */

function renderMonth() {
  const el = document.getElementById("monthGrid");
  const titleEl = document.getElementById("monthTitle");
  const monthNames = ["january","february","march","april","may","june","july","august","september","october","november","december"];

  titleEl.textContent = monthNames[viewMonth] + " " + viewYear;

  const firstDay = new Date(viewYear, viewMonth, 1);
  const startWeekday = firstDay.getDay(); // 0=Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const today = new Date();
  today.setHours(0,0,0,0);

  // group events by date string
  const byDate = {};
  events.forEach(e => {
    if (!byDate[e.date]) byDate[e.date] = [];
    byDate[e.date].push(e);
  });

  let html = "";
  // leading blanks
  for (let i = 0; i < startWeekday; i++) {
    html += '<div class="day-cell empty"></div>';
  }
  // real days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = viewYear + "-" + String(viewMonth + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
    const cellDate = new Date(viewYear, viewMonth, d);
    const isToday = cellDate.getTime() === today.getTime();
    const isPast = cellDate.getTime() < today.getTime();
    const dayEvents = byDate[dateStr] || [];

    const classes = ["day-cell"];
    if (isToday) classes.push("today");
    else if (isPast) classes.push("past");
    if (dayEvents.length > 0) classes.push("has-events");

    let eventsHTML = "";
    if (dayEvents.length > 0) {
      const shown = dayEvents.slice(0, 2);
      eventsHTML = `<div class="day-events">`;
      shown.forEach(e => {
        eventsHTML += `<div class="day-event-dot">${e.emoji || "🌸"}</div>`;
        eventsHTML += `<div class="day-event-name">${escapeHTML(e.name)}</div>`;
      });
      if (dayEvents.length > 2) {
        eventsHTML += `<div class="day-event-name">+${dayEvents.length - 2}</div>`;
      }
      eventsHTML += `</div>`;
    }

    html += `
      <div class="${classes.join(' ')}" data-date="${dateStr}">
        <span class="day-num">${d}</span>
        ${eventsHTML}
      </div>
    `;
  }

  el.innerHTML = html;

  // click a day → prefill the form
  // click a day → if has events, ask which to delete; else prefill form
  el.querySelectorAll(".day-cell:not(.empty)").forEach(cell => {
    cell.addEventListener("click", () => {
      const dateStr = cell.dataset.date;
      const dayEvents = events.filter(e => e.date === dateStr);
      if (dayEvents.length > 0) {
        // show delete prompt
        const names = dayEvents.map((e, i) => (i + 1) + ". " + e.name + (e.time ? " (" + e.time + ")" : "")).join("\n");
        const choice = prompt("events on " + dateStr + ":\n\n" + names + "\n\ntype the number to delete, or cancel:");
        if (choice) {
          const idx = parseInt(choice, 10) - 1;
          if (dayEvents[idx]) {
            deleteEvent(dayEvents[idx].id);
          }
        }
      } else {
        // prefill form
        document.getElementById("eventDate").value = dateStr;
        document.getElementById("eventName").focus();
      }
    });
  });
}

/* ---------- upcoming list ---------- */

function renderUpcomingList() {
  const el = document.getElementById("eventsList");
  const total = document.getElementById("totalEvents");
  total.textContent = events.length + (events.length === 1 ? " plan" : " plans");

  const upcoming = events
    .filter(e => daysUntil(e.date) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(1); // skip #1 (already in hero)

  if (upcoming.length === 0) {
    el.innerHTML = '<div class="cal-empty">no other upcoming plans yet.</div>';
    return;
  }

  el.innerHTML = upcoming.map(evt => {
    const days = daysUntil(evt.date);
    const urgent = days <= 7;
    const label = days === 0 ? "today" : (days === 1 ? "day" : "days");
    return `
      <div class="cal-event-row ${urgent ? 'urgent' : ''}">
        <div class="cal-event-emoji">${evt.emoji || "🌸"}</div>
        <div class="cal-event-info">
          <p class="cal-event-name">${escapeHTML(evt.name)}</p>
          <span class="cal-event-date">${fmtEventDate(evt.date)}</span>
        </div>
        <div class="cal-event-days">
          ${days === 0 ? "★" : days}
          <span class="small">${label}</span>
        </div>
        <button class="cal-delete" type="button" data-id="${evt.id}" aria-label="Delete">✕</button>
      </div>
    `;
  }).join("");

  el.querySelectorAll(".cal-delete").forEach(btn => {
    btn.addEventListener("click", () => deleteEvent(btn.dataset.id));
  });
}

/* ---------- add / delete ---------- */

function addEvent(name, date, time, emoji) {
  events.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name, date, time, emoji
  });
  saveEvents(events);
  renderAll();
  if (typeof addVibe === "function") addVibe(8);
}

function deleteEvent(id) {
  events = events.filter(e => e.id !== id);
  saveEvents(events);
  renderAll();
}

function renderAll() {
  renderHero();
  renderMonth();
  renderUpcomingList();
}

/* ---------- init ---------- */

document.addEventListener("DOMContentLoaded", () => {
  const now = new Date();
  viewYear = now.getFullYear();
  viewMonth = now.getMonth();

  renderAll();

  document.getElementById("prevMonth").addEventListener("click", () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderMonth();
  });

  document.getElementById("nextMonth").addEventListener("click", () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderMonth();
  });

  const form = document.getElementById("addForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("eventName").value.trim();
    const date = document.getElementById("eventDate").value;
    const time = document.getElementById("eventTime").value;
    const emoji = document.getElementById("eventEmoji").value;
    if (!name || !date) return;
    addEvent(name, date, time, emoji);
    document.getElementById("eventName").value = "";
    document.getElementById("eventDate").value = "";
    document.getElementById("eventTime").value = "";
  });
});
