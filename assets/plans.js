/* Plans page: proposals for handling advanced AI, as cards filtered by
   source (grouped under their sources when All is chosen), each marked with
   what it asks of the race. The legend doubles as a second filter. */
(function () {
  "use strict";

  const items = (window.CC_PLANS || []).slice().sort((a, b) => b.date.localeCompare(a.date));
  const list = document.getElementById("plans-list");
  if (!list) return;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const TYPES = { proposals: "Researchers and campaigns", labs: "The labs", governments: "Governments" };
  const STANCES = { halt: "Calls for a halt or prohibition", pace: "Calls for pacing or conditional limits", accelerate: "Calls to speed up" };
  const DOT = { halt: "ban", pace: "pace", accelerate: "oppose" };   // the colours used on Positions
  const PAGE_NAME = { materials: "Materials", statements: "Statements" };
  const INTRO = {
    All: "Plans for how the arrival of advanced AI should be handled, from researchers and campaigns, the labs and governments, and what each asks of the race.",
    proposals: "Plans from researchers and campaigns, from a halt on superintelligence to a race to build it first.",
    labs: "What the frontier labs say they plan to do as their systems grow more capable.",
    governments: "National and international plans for AI, most of them for speeding up rather than slowing down.",
  };
  let type = "All", stance = null;
  const domain = (url) => new URL(url).hostname.replace(/^www\./, "");

  const card = (c) => {
    const [page, id] = (c.entry || "").split(":");
    return `
    <li class="org-card" id="plan-${esc(c.id)}">
      <p class="org-card-meta">${esc(c.date.slice(0, 4))} · ${esc(c.by)}</p>
      <h3 class="org-card-name"><a class="cp-link" href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">${esc(c.name)}</a></h3>
      <p class="org-card-summary">${esc(c.summary)}</p>
      ${c.stance ? `<p class="pd-stance org-card-stance" data-s="${DOT[c.stance]}"><span class="pd-dot"></span>${esc(STANCES[c.stance])}</p>` : ""}
      <p class="pl-links">
        <a class="tl-source" href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">${esc(domain(c.url))} ↗</a>
        ${page ? `<a class="co-link" href="#${esc(page)}" data-entry="${esc(c.entry)}">In ${esc(PAGE_NAME[page])} →</a>` : ""}
      </p>
    </li>`;
  };

  function render() {
    document.getElementById("plans-intro").textContent = INTRO[type];
    const shown = items.filter((c) => !stance || c.stance === stance);
    list.innerHTML = type !== "All"
      ? shown.filter((c) => c.type === type).map(card).join("") || `<li class="pl-empty">None of these plans ${esc(STANCES[stance].replace(/^Calls/, "call").toLowerCase())}.</li>`
      : Object.entries(TYPES).map(([t, label]) => {
          const group = shown.filter((c) => c.type === t);
          return group.length ? `<li class="ac-group-head" role="presentation">${esc(label)} <span class="filter-count">${group.length}</span></li>${group.map(card).join("")}` : "";
        }).join("");
    legend.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.stance === stance)));
  }

  const bar = document.getElementById("plans-filters");
  bar.innerHTML = [["All", "All", items.length], ...Object.entries(TYPES).map(([k, v]) => [k, v, items.filter((c) => c.type === k).length])]
    .map(([v, label, n]) => `<button type="button" class="filter-pill" data-value="${v}" aria-pressed="${v === type}">${esc(label)} <span class="filter-count">${n}</span></button>`)
    .join("");
  bar.addEventListener("click", (e) => {
    const b = e.target.closest(".filter-pill");
    if (!b || b.dataset.value === type) return;
    type = b.dataset.value;
    bar.querySelectorAll(".filter-pill").forEach((p) => p.setAttribute("aria-pressed", String(p === b)));
    render();
  });

  const legend = document.getElementById("plans-legend");
  legend.innerHTML = Object.entries(STANCES).map(([k, label]) =>
    `<li><button type="button" class="pl-key" data-s="${DOT[k]}" data-stance="${k}" aria-pressed="false"><span class="pd-dot"></span>${esc(label)} <span class="filter-count">${items.filter((c) => c.stance === k).length}</span></button></li>`).join("");
  legend.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    stance = stance === b.dataset.stance ? null : b.dataset.stance;
    render();
  });

  list.addEventListener("click", (e) => {
    const a = e.target.closest("[data-entry]");
    if (!a) return;
    e.preventDefault();
    const [page, id] = a.dataset.entry.split(":");
    if (window.CC_openEntry) window.CC_openEntry(page, id);
  });
  render();
})();
