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

  // Rough width of a label in the ribbon's annotation font, in px
  const labelW = (t) => (t.length + 3) * 6.6 + 16;   // with its number
  const LINE_Y = 150;      // px from the ribbon's top to its line
  const ROW_H = 24;        // px between rows of annotations

  function renderRibbon() {
    const ribbon = document.getElementById("milestones-ribbon");
    // The track's width, inside its margins (on phones it's at least 760px
    // and scrolls sideways)
    const W = Math.max((ribbon.clientWidth || 1160) - 32, window.innerWidth <= 700 ? 760 : 0);
    const ticks = [1950, 1960, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027];
    const px = (d) => (at(d) / 100) * W;
    // Dots sit on the line if there's room, else raised a level (on a stem)
    const minGap = 32;
    const dotLevels = [];
    // Annotations run below the line in rows, each under its dot where it
    // fits, joined to it by a leader line
    const rowEnds = [];
    const placed = items.map((m, i) => {
      const x = px(m.date);
      let lv = dotLevels.findIndex((l) => x - l >= minGap);
      if (lv < 0) lv = dotLevels.length;
      dotLevels[lv] = x;
      const w = labelW(m.short || m.title);
      const left = Math.max(0, Math.min(W - w, x - w / 2));
      let row = rowEnds.findIndex((end) => left >= end + 10);
      if (row < 0) row = rowEnds.length;
      rowEnds[row] = left + w;
      return { m, i, x, lv, left, w, row };
    });
    const rows = rowEnds.length;
    ribbon.style.height = `${LINE_Y + 56 + rows * ROW_H + 8}px`;
    ribbon.innerHTML = `
      <div class="ms-track">
        <span class="ms-era" style="left:0">The first warnings</span>
        <span class="ms-era" style="left:${EARLY_W + GAP}%">The race to the frontier</span>
        <span class="ms-line" style="left:0;width:${EARLY_W}%"></span>
        <span class="ms-break" style="left:${EARLY_W}%;width:${GAP}%" aria-hidden="true"></span>
        <span class="ms-line" style="left:${EARLY_W + GAP}%;right:0"></span>
        ${ticks.map((t) => `<span class="ms-tick" style="left:${at(`${t}-01-01`).toFixed(2)}%">${t}</span>`).join("")}
        ${placed.map((p) => `
          <span class="ms-lead" style="left:${p.x.toFixed(1)}px;height:${48 + p.row * ROW_H}px" aria-hidden="true"></span>
          <a class="ms-note" href="#milestone-${esc(p.m.id)}" data-id="${esc(p.m.id)}" style="left:${p.left.toFixed(1)}px;top:${LINE_Y + 48 + p.row * ROW_H}px"><span class="ms-note-num">${num(p.i)}</span>${esc(p.m.short || p.m.title)}</a>
          <a class="ms-dot" href="#milestone-${esc(p.m.id)}" data-id="${esc(p.m.id)}" style="left:${p.x.toFixed(1)}px;--lv:${p.lv}" title="${esc(p.m.when)}: ${esc(p.m.title)}">${num(p.i)}</a>`).join("")}
      </div>`;
    ribbon.querySelectorAll(".ms-dot, .ms-note").forEach((a) => {
      // Hovering a dot or its note lights up the pair
      const pair = () => ribbon.querySelectorAll(`[data-id="${CSS.escape(a.dataset.id)}"]`);
      a.addEventListener("mouseenter", () => pair().forEach((x) => x.classList.add("is-hover")));
      a.addEventListener("mouseleave", () => pair().forEach((x) => x.classList.remove("is-hover")));
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const el = document.getElementById(`milestone-${a.dataset.id}`);
        const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0;
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - headerH - 24, behavior: "smooth" });
        el.classList.remove("is-flash"); void el.offsetWidth; el.classList.add("is-flash");
      });
    });
  }
  // The ribbon is laid out from its width: again when the page is shown
  // (it's hidden at first) and when the window changes size
  document.addEventListener("cc:pageshow", (e) => { if (e.detail.page === "milestones") renderRibbon(); });
  window.addEventListener("resize", () => { if (!document.getElementById("page-milestones").hidden) renderRibbon(); });

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
