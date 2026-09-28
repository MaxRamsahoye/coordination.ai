/* Timelines page: forecasts of when AGI or superintelligence will arrive
   (data/forecasts.js). A chart with a row per forecast, a dot for its
   central year and a line for its range, coloured by who made it; then a
   card for each; then how forecasts have moved. Filtered by who made them. */
(function () {
  "use strict";

  const items = window.CC_FORECASTS || [];
  const view = document.getElementById("ft-view");
  if (!view) return;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fmtDate = (d) => { const [y, m, day] = d.split("-"); return !m ? y : !day ? `${MONTHS[+m - 1]} ${y}` : `${+day} ${MONTHS[+m - 1]} ${y}`; };
  const KINDS = { leaders: "Lab leaders", forecasters: "Researchers and forecasters", surveys: "Surveys and forecasting platforms" };
  const INTRO = {
    All: "When will AI match or surpass people at almost everything? What lab leaders, researchers and forecasters expect, and how their expectations have moved.",
    leaders: "What the people building frontier AI expect: most of them within the decade.",
    forecasters: "Forecasts and scenarios from researchers who study where AI is heading.",
    surveys: "What surveys of AI researchers and forecasting platforms put the odds at.",
  };
  const PAGE_NAME = { materials: "Materials", statements: "Statements" };
  let kind = "All";
  const mid = (f) => f.year ?? (f.low + f.high) / 2;
  // "2031 (2027–2044)", "2030–2035", "2026 or later", "2028"
  const range = (f) => {
    const span = f.low && f.high && f.low !== f.high ? `${f.low}–${f.high}` : "";
    if (!f.year) return span;
    return `${f.year}${f.open ? " or later" : ""}${span && f.year !== f.low ? ` (${span})` : ""}`;
  };

  // The chart: years along the top and bottom, a row per forecast, today marked
  function chart(list) {
    const Y0 = 2024, Y1 = 2062, W = 1000, left = 290, right = 20, rowH = 30, top = 34;
    const H = top + list.length * rowH + 30;
    const x = (y) => left + ((y - Y0) / (Y1 - Y0)) * (W - left - right);
    const now = new Date(), today = now.getFullYear() + now.getMonth() / 12;
    let out = "";
    for (let y = Y0 + 1; y <= Y1; y += y < 2040 ? 5 : 10) {
      if (y === 2045 || y === 2055) continue;
      out += `<line class="ft-grid" x1="${x(y)}" y1="${top - 10}" x2="${x(y)}" y2="${H - 22}"/><text class="ft-year" x="${x(y)}" y="${H - 6}">${y}</text><text class="ft-year" x="${x(y)}" y="${top - 16}">${y}</text>`;
    }
    out += `<line class="ft-today" x1="${x(today)}" y1="${top - 10}" x2="${x(today)}" y2="${H - 22}"/><text class="ft-today-label" x="${x(today) + 5}" y="${top - 2}">Today</text>`;
    list.forEach((f, i) => {
      const cy = top + i * rowH + rowH / 2;
      const lo = f.low ?? f.year, hi = f.high ?? f.year;
      out += `<g class="ft-row" data-k="${f.kind}" data-id="${esc(f.id)}">
        <rect class="ft-hit" x="0" y="${cy - rowH / 2}" width="${W}" height="${rowH}"/>
        <text class="ft-who" x="0" y="${cy + 4}">${esc(f.who.length > 38 ? f.who.slice(0, 36) + "…" : f.who)}</text>
        <line class="ft-track" x1="${left}" y1="${cy}" x2="${W - right}" y2="${cy}"/>
        ${hi > lo ? `<line class="ft-range" x1="${x(lo)}" y1="${cy}" x2="${x(hi)}" y2="${cy}"/>` : ""}
        ${f.open ? `<line class="ft-open" x1="${x(f.year)}" y1="${cy}" x2="${x(f.year + 6)}" y2="${cy}"/>` : ""}
        ${f.year ? `<circle class="ft-dot" cx="${x(f.year)}" cy="${cy}" r="6.5"/>` : ""}
        <title>${esc(f.who)}: ${esc(f.what)}, ${esc(range(f))} (${esc(fmtDate(f.made))})</title>
      </g>`;
    });
    return `<div class="ft-chart-scroll"><svg class="ft-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Forecasts of when AGI or superintelligence will arrive">${out}</svg></div>`;
  }

  const card = (f) => {
    const [page, id] = (f.entry || "").split(":");
    return `
    <li class="org-card ft-card" id="forecast-${esc(f.id)}" data-k="${f.kind}">
      <p class="org-card-meta">${esc(KINDS[f.kind].replace(/ and .*$/, ""))} · ${esc(fmtDate(f.made))}</p>
      <p class="ft-when">${esc(range(f))}</p>
      <h3 class="org-card-name">${esc(f.who)}</h3>
      <p class="ft-what">${esc(f.what)}</p>
      <p class="org-card-summary">${esc(f.note)}</p>
      <p class="pl-links">
        <a class="tl-source" href="${esc(f.source.url)}" target="_blank" rel="noopener noreferrer">${esc(f.source.label)} ↗</a>
        ${page ? `<a class="co-link" href="#${esc(page)}" data-entry="${esc(f.entry)}">In ${esc(PAGE_NAME[page])} →</a>` : ""}
      </p>
    </li>`;
  };

  const MOVED = `
    <h3 class="ft-sub">How forecasts have moved</h3>
    <ul class="ft-moved">
      <li><strong>2060 → 2047</strong><span>In one year, from 2022 to 2023, AI researchers surveyed by AI Impacts brought their 50% date for machines outperforming humans at every task forward by 13 years.</span></li>
      <li><strong>20–50 → 5–20 years</strong><span>Geoffrey Hinton shortened his own estimate in 2023, the year he left Google to speak about the risks.</span></li>
      <li><strong>2027 → 2030</strong><span>Not every revision is sooner: the authors of AI 2027 have since pushed their median for a superhuman coder back, citing bottlenecks their model had missed.</span></li>
      <li><strong>20 years at 2028</strong><span>Shane Legg has put a 50% chance on AGI by 2028 since the late 2000s, long before most of the field took the question seriously.</span></li>
    </ul>`;

  function render() {
    document.getElementById("ft-intro").textContent = INTRO[kind];
    const list = items.filter((f) => kind === "All" || f.kind === kind).slice().sort((a, b) => mid(a) - mid(b) || a.made.localeCompare(b.made));
    view.innerHTML = `
      ${chart(list)}
      <div class="positions-legend ft-legend">${Object.entries(KINDS).map(([k, l]) => `<span class="lg-item" data-k="${k}"><span class="lg-swatch"></span>${esc(l)}</span>`).join("")}
        <span class="lg-item ft-lg-range"><span class="ft-lg-line"></span>Range given</span></div>
      <ul class="org-grid ft-cards">${list.map(card).join("")}</ul>
      ${kind === "All" ? MOVED : ""}`;
  }

  const bar = document.getElementById("ft-filters");
  bar.innerHTML = [["All", "All", items.length], ...Object.entries(KINDS).map(([k, v]) => [k, v, items.filter((f) => f.kind === k).length])]
    .map(([v, label, n]) => `<button type="button" class="filter-pill" data-value="${v}" aria-pressed="${v === kind}">${esc(label)} <span class="filter-count">${n}</span></button>`).join("");
  bar.addEventListener("click", (e) => {
    const b = e.target.closest(".filter-pill");
    if (!b || b.dataset.value === kind) return;
    kind = b.dataset.value;
    bar.querySelectorAll(".filter-pill").forEach((p) => p.setAttribute("aria-pressed", String(p === b)));
    render();
  });
  // A row in the chart scrolls to its card; site links open the entry
  view.addEventListener("click", (e) => {
    const row = e.target.closest(".ft-row");
    if (row) {
      const c = document.getElementById(`forecast-${row.dataset.id}`);
      if (c) { c.scrollIntoView({ block: "center" }); c.classList.remove("is-flash"); void c.offsetWidth; c.classList.add("is-flash"); }
      return;
    }
    const a = e.target.closest("[data-entry]");
    if (a) {
      e.preventDefault();
      const [page, id] = a.dataset.entry.split(":");
      if (window.CC_openEntry) window.CC_openEntry(page, id);
    }
  });
  render();
})();
