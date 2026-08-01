/* ================================
   FINANCE — daily rotation
   ================================ */

function getTodayConceptIndex() {
  return daysSinceEpoch() % CONCEPTS.length;
}

function escapeHTML(s) {
  return s.replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}

function renderConcept(idx) {
  const c = CONCEPTS[idx];
  const el = document.getElementById("conceptCard");
  el.innerHTML = `
    <span class="concept-cat">${c.category}</span>
    <h2 class="concept-title">${c.title}</h2>
    <p class="concept-hook">"${escapeHTML(c.hook)}"</p>
    <p class="concept-explain">${escapeHTML(c.explain)}</p>
    <span class="concept-tag">${c.tag}</span>
  `;
  document.getElementById("dayNumber").textContent = "concept #" + (idx + 1);
}

function renderPast() {
  const el = document.getElementById("pastList");
  const todayIdx = getTodayConceptIndex();
  // show previous 6 concepts (looping around)
  const past = [];
  for (let i = 1; i <= 6; i++) {
    const idx = ((todayIdx - i) % CONCEPTS.length + CONCEPTS.length) % CONCEPTS.length;
    past.push({ idx, concept: CONCEPTS[idx] });
  }

  el.innerHTML = past.map(({ idx, concept }) => `
    <div class="past-item" data-idx="${idx}">
      <div class="past-cat">${concept.category}</div>
      <h3 class="past-title">${concept.title}</h3>
      <p class="past-hook">"${escapeHTML(concept.hook)}"</p>
    </div>
  `).join("");

  el.querySelectorAll(".past-item").forEach(item => {
    item.addEventListener("click", () => {
      const idx = parseInt(item.dataset.idx, 10);
      renderConcept(idx);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderConcept(getTodayConceptIndex());
  renderPast();
});
