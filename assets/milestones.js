/* Milestones page: a curated set of the most significant moments, shown
   as a ribbon across time (with a break between the first warnings and the
   2020s) and then as large numbered panels, newest first (or oldest first,
   by the Order pills). Each dot on the
   ribbon jumps to its panel; panels link to fuller entries elsewhere on
   the site. */
(function () {
  "use strict";

  const items = window.CC_MILESTONES || [];
  const list = document.getElementById("milestones-list");
  if (!items.length || !list) return;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const PAGE_NAMES = { statements: "Statements", materials: "Materials", incidents: "Incidents" };
  const num = (i) => String(i + 1).padStart(2, "0");

  // A date as a fractional year
  const year = (d) => { const [y, m = 7, day = 1] = d.split("-").map(Number); return y + (m - 1) / 12 + (day - 1) / 365; };
  // The ribbon: an early stretch (1945–1965) and the recent one (2020 to
  // now), with a break between them
  const EARLY = [1945, 1965], RECENT = [2020, 2027];
  const EARLY_W = 16, GAP = 4;   // % of the ribbon
  const at = (d) => {
    const y = year(d);
    if (y < 2000) return ((y - EARLY[0]) / (EARLY[1] - EARLY[0])) * EARLY_W;
    return EARLY_W + GAP + ((y - RECENT[0]) / (RECENT[1] - RECENT[0])) * (100 - EARLY_W - GAP);
  };

  function renderRibbon() {
    const ticks = [1950, 1960, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027];
    // Each dot sits on the line if there's room, else raised a level (on a
    // stem) above any dot it would overlap
    const ribbonW = document.getElementById("milestones-ribbon").clientWidth || 1100;
    const minGap = (32 / ribbonW) * 100;   // % between dot centres
    const levels = [];                     // the last x used at each level
    document.getElementById("milestones-ribbon").innerHTML = `
      <div class="ms-track">
        <span class="ms-line" style="left:0;width:${EARLY_W}%"></span>
        <span class="ms-break" style="left:${EARLY_W}%;width:${GAP}%" aria-hidden="true"></span>
        <span class="ms-line" style="left:${EARLY_W + GAP}%;right:0"></span>
        ${ticks.map((t) => `<span class="ms-tick" style="left:${at(String(t)).toFixed(2)}%">${t}</span>`).join("")}
        ${items.map((m, i) => {
          const x = at(m.date);
          let lv = levels.findIndex((l) => x - l >= minGap);
          if (lv < 0) lv = levels.length;
          levels[lv] = x;
          return `<a class="ms-dot" href="#milestone-${esc(m.id)}" data-id="${esc(m.id)}" style="left:${x.toFixed(2)}%;--lv:${lv}" title="${esc(m.when)}: ${esc(m.title)}">${num(i)}</a>`;
        }).join("")}
      </div>`;
    document.querySelectorAll("#milestones-ribbon .ms-dot").forEach((a) =>
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const el = document.getElementById(`milestone-${a.dataset.id}`);
        const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0;
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - headerH - 24, behavior: "smooth" });
        el.classList.remove("is-flash"); void el.offsetWidth; el.classList.add("is-flash");
      })
    );
  }

  // Newest first to begin with; the numbers keep to time order (01 is the
  // oldest) whichever way round the panels run
  let order = "newest";
  function renderList() {
    const shown = items.map((m, i) => [m, i]);
    if (order === "newest") shown.reverse();
    list.innerHTML = shown.map(([m, i]) => `
      <li class="ms-item" id="milestone-${esc(m.id)}">
        <span class="ms-num" aria-hidden="true">${num(i)}</span>
        <div class="ms-body">
          <p class="ms-meta"><time datetime="${esc(m.date)}">${esc(m.when)}</time><span class="ms-kind">${esc(m.kind)}</span></p>
          <h3 class="ms-title">${esc(m.title)}</h3>
          <p class="ms-summary">${esc(m.summary)}</p>
          <p class="ms-why"><span class="ms-why-label">Why it matters</span>${esc(m.why)}</p>
          <p class="ms-links">
            ${m.sources.map((s) => `<a class="tl-source" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)} ↗</a>`).join("")}
            ${m.entry ? `<a class="ms-entry" href="#${esc(m.entry[0])}" data-page="${esc(m.entry[0])}" data-id="${esc(m.entry[1])}">See in ${esc(PAGE_NAMES[m.entry[0]])} →</a>` : ""}
          </p>
        </div>
      </li>`).join("");
    list.querySelectorAll(".ms-entry").forEach((a) =>
      a.addEventListener("click", (e) => {
        e.preventDefault();
        if (window.CC_openEntry) window.CC_openEntry(a.dataset.page, a.dataset.id);
      })
    );
  }

  const intro = () => {
    document.getElementById("milestones-intro").textContent =
      `${items.length} of the most significant moments in the story of AI risk, from the first warnings to the race and the push to slow it. ${order === "newest" ? "Newest" : "Oldest"} first.`;
  };
  document.querySelectorAll("#milestones-sort [data-order]").forEach((b) =>
    b.addEventListener("click", () => {
      if (b.dataset.order === order) return;
      order = b.dataset.order;
      document.querySelectorAll("#milestones-sort [data-order]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      intro();
      renderList();
    })
  );
  intro();
  renderRibbon();
  renderList();
})();
