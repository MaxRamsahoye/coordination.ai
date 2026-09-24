/* Companions page: other websites worth following, as cards filtered by
   category (grouped under their categories when All is chosen). */
(function () {
  "use strict";

  const items = window.CC_COMPANIONS || [];
  const list = document.getElementById("companions-list");
  if (!list) return;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const TYPES = { guides: "Guides and courses", trackers: "Trackers and data", research: "Research and discussion", newsletters: "Newsletters" };
  const INTRO = {
    All: "Other websites worth following alongside this one: guides and courses, trackers of the labs and their models, research, and newsletters.",
    guides: "Where to start: explainers, answers to common questions, and courses on AI safety and governance.",
    trackers: "Sites that track the labs, their models and incidents, and forecasts of what comes next.",
    research: "Where the research on AI risk is reviewed, published and argued over.",
    newsletters: "Regular writing to keep up with AI and its risks.",
  };
  let current = "All";
  const domain = (url) => new URL(url).hostname.replace(/^www\./, "");

  const card = (c) => `
    <li class="org-card" id="companion-${esc(c.id)}">
      <p class="org-card-meta">${esc(TYPES[c.type].replace(/ and .*$/, ""))} · ${esc(c.by)}</p>
      <h3 class="org-card-name"><a class="cp-link" href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">${esc(c.name)}</a></h3>
      <p class="org-card-summary">${esc(c.summary)}</p>
      <a class="tl-source" href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">${esc(domain(c.url))} ↗</a>
    </li>`;

  function render() {
    document.getElementById("companions-intro").textContent = INTRO[current];
    list.innerHTML = current !== "All"
      ? items.filter((c) => c.type === current).map(card).join("")
      : Object.entries(TYPES).map(([t, label]) => {
          const group = items.filter((c) => c.type === t);
          return group.length ? `<li class="ac-group-head" role="presentation">${esc(label)} <span class="filter-count">${group.length}</span></li>${group.map(card).join("")}` : "";
        }).join("");
  }

  const bar = document.getElementById("companions-filters");
  bar.innerHTML = [["All", "All", items.length], ...Object.entries(TYPES).map(([k, v]) => [k, v, items.filter((c) => c.type === k).length])]
    .map(([v, label, n]) => `<button type="button" class="filter-pill" data-value="${v}" aria-pressed="${v === current}">${esc(label)} <span class="filter-count">${n}</span></button>`)
    .join("");
  bar.addEventListener("click", (e) => {
    const b = e.target.closest(".filter-pill");
    if (!b || b.dataset.value === current) return;
    current = b.dataset.value;
    bar.querySelectorAll(".filter-pill").forEach((p) => p.setAttribute("aria-pressed", String(p === b)));
    render();
  });
  render();
})();
