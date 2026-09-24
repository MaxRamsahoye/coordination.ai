/* Organisations page: cards for each organisation, filtered by type with a
   row of pills (All, Government, Research, Advocacy). */
(function () {
  "use strict";

  const items = window.CC_ORGANISATIONS || [];
  const TYPES = { government: "Government", research: "Research", advocacy: "Advocacy" };
  const INTRO = {
    All: "Government bodies, researchers and campaigners working on AI safety, evaluation and coordination.",
    government: "Government and intergovernmental bodies that test AI models, set standards or enforce rules.",
    research: "Independent researchers who evaluate frontier models, study their risks and forecast where AI is heading.",
    advocacy: "Campaigns and non-profits pressing for a slowdown, a pause or a prohibition on superintelligence.",
  };
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  let current = "All";

  function render() {
    const shown = current === "All" ? items : items.filter((o) => o.type === current);
    document.getElementById("organisations-intro").textContent = INTRO[current];
    document.getElementById("organisations-list").innerHTML = shown
      .map(
        (o) => `
        <li class="org-card">
          <p class="org-card-meta">${esc(TYPES[o.type])} · ${esc(o.based)} · since ${esc(o.founded)}</p>
          <h3 class="org-card-name">${esc(o.name)}</h3>
          <p class="org-card-summary">${esc(o.summary)}</p>
          <a class="tl-source" href="${esc(o.url)}" target="_blank" rel="noopener noreferrer">${esc(o.site || new URL(o.url).hostname.replace(/^www\./, ""))} ↗</a>
        </li>`
      )
      .join("");
  }

  function renderFilters() {
    const bar = document.getElementById("organisations-filters");
    if (!bar) return;
    const options = [["All", "All", items.length], ...Object.entries(TYPES).map(([k, label]) => [k, label, items.filter((o) => o.type === k).length])];
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

  if (document.getElementById("organisations-list")) {
    renderFilters();
    render();
  }
})();
