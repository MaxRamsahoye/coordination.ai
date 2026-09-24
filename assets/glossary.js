/* Glossary page: terms A–Z under letter headings, filtered by area with a
   row of pills (All, Capabilities, Risks, Safety research, Governance). */
(function () {
  "use strict";

  const items = (window.CC_GLOSSARY || []).slice().sort((a, b) => a.term.localeCompare(b.term, "en", { sensitivity: "base" }));
  const AREAS = { capabilities: "Capabilities", risks: "Risks", safety: "Safety research", governance: "Governance" };
  const INTRO = {
    All: "The terms used across the site, in plain language.",
    capabilities: "What frontier AI systems are and what drives their progress.",
    risks: "The ways advanced AI could go wrong, from misuse to loss of control.",
    safety: "The research and testing meant to make AI systems safe.",
    governance: "Proposals and institutions for slowing, overseeing or limiting AI development.",
  };
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Letter heading: the first letter, ignoring punctuation (P(doom) → P)
  const letter = (t) => (t.match(/[A-Za-z]/) || ["#"])[0].toUpperCase();
  let current = "All";

  function render() {
    const shown = current === "All" ? items : items.filter((g) => g.area === current);
    document.getElementById("glossary-intro").textContent = INTRO[current];
    const groups = [];
    shown.forEach((g) => {
      const l = letter(g.term);
      if (!groups.length || groups[groups.length - 1][0] !== l) groups.push([l, []]);
      groups[groups.length - 1][1].push(g);
    });
    document.getElementById("glossary-list").innerHTML = groups
      .map(([l, terms]) => `
        <section class="gl-group">
          <h3 class="gl-letter">${esc(l)}</h3>
          <dl class="gl-terms">${terms.map((g) => `
            <div class="gl-item">
              <dt class="gl-term"><span class="gl-area">${esc(AREAS[g.area])}</span>${esc(g.term)}${g.also ? ` <span class="gl-also">(${esc(g.also)})</span>` : ""}</dt>
              <dd class="gl-def">${esc(g.def)}</dd>
            </div>`).join("")}
          </dl>
        </section>`)
      .join("");
  }

  function renderFilters() {
    const bar = document.getElementById("glossary-filters");
    if (!bar) return;
    const options = [["All", "All", items.length], ...Object.entries(AREAS).map(([k, label]) => [k, label, items.filter((g) => g.area === k).length])];
    bar.innerHTML = options
      .map(([v, label, n]) => `<button type="button" class="filter-pill" data-value="${v}" aria-pressed="${v === current}">${esc(label)} <span class="filter-count">${n}</span></button>`)
      .join("");
    bar.addEventListener("click", (e) => {
      const b = e.target.closest(".filter-pill");
      if (!b || b.dataset.value === current) return;
      current = b.dataset.value;
      bar.querySelectorAll(".filter-pill").forEach((p) => p.setAttribute("aria-pressed", String(p === b)));
      render();
    });
  }

  if (document.getElementById("glossary-list")) {
    renderFilters();
    render();
  }
})();
