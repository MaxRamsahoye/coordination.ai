/* Incidents page: a matrix. Each column is an incident, oldest to newest,
   grouped into years; each row is a developer. A marker sits in the row of
   every developer whose models were involved, joined by a vertical line, so
   a test across several labs shows as one tall stroke. The marker's shape
   gives the incident's type and its colour the category. Selecting a
   column (or a row in the list below) shows the incident's details;
   filters narrow the columns by category or developer. */
(function () {
  "use strict";

  const items = (window.CC_INCIDENTS || []).slice();
  if (!document.getElementById("incidents-matrix")) return;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formatDate = (d) => {
    const [y, m, day] = d.split("-");
    return !m ? y : !day ? `${MONTHS[+m - 1]} ${y}` : `${+day} ${MONTHS[+m - 1]} ${y}`;
  };
  const sortKey = (d) => { const [y, m = "00", day = "00"] = d.split("-"); return `${y}-${m}-${day}`; };
  const $ = (id) => document.getElementById(id);

  const CATEGORIES = { misalignment: "Misalignment", misuse: "Misuse", malfunction: "Malfunction", misinformation: "Misinformation", ethics: "Ethics" };
  const TYPES = { control: "Loss of control", behaviour: "Unintended behaviour", cyber: "Cyberattack" };
  // Developers, most incidents first, with "Other" last
  const orgCount = new Map();
  items.forEach((i) => i.orgs.forEach((o) => orgCount.set(o, (orgCount.get(o) || 0) + 1)));
  const ORGS = [...orgCount].sort((a, b) => (a[0] === "Other") - (b[0] === "Other") || b[1] - a[1] || a[0].localeCompare(b[0])).map(([o]) => o);

  const byDate = items.sort((a, b) => sortKey(a.date).localeCompare(sortKey(b.date)));   // oldest first
  const byId = Object.fromEntries(items.map((i) => [i.id, i]));
  const filter = { category: "All", orgs: "All" };
  const shownItems = () => byDate.filter((i) => (filter.category === "All" || i.category === filter.category) && (filter.orgs === "All" || i.orgs.includes(filter.orgs)));
  let selected = byDate[byDate.length - 1].id;

  // ───────────── The matrix: a CSS grid. Column 1 holds the developers'
  // names, then one column per incident, then each row's total; row 1
  // holds the years.
  function renderMatrix() {
    const shown = shownItems();
    const rows = ORGS;
    const col = (k) => k + 2;   // grid column of the k-th incident
    const row = (o) => rows.indexOf(o) + 2;
    // Years, as bands over their incidents' columns
    const years = [];
    shown.forEach((i, k) => {
      const y = i.date.slice(0, 4);
      if (!years.length || years[years.length - 1].y !== y) years.push({ y, from: k, to: k });
      else years[years.length - 1].to = k;
    });
    const totals = rows.map((o) => shown.filter((i) => i.orgs.includes(o)).length);
    const maxTotal = Math.max(1, ...totals);
    $("incidents-matrix").style.setProperty("--cols", shown.length);
    $("incidents-matrix").style.setProperty("--rows", rows.length);
    $("incidents-matrix").innerHTML = `
      ${years.map((g) => `<span class="im-year" style="grid-column:${col(g.from)} / ${col(g.to) + 1}">${esc(g.y)}</span>
        <span class="im-yearline" style="grid-column:${col(g.from)};grid-row:1 / ${rows.length + 2}" aria-hidden="true"></span>`).join("")}
      ${rows.map((o, r) => `
        <span class="im-rowline" style="grid-row:${r + 2}" aria-hidden="true"></span>
        <span class="im-org${filter.orgs === o ? " is-current" : ""}" style="grid-row:${r + 2}">${esc(o)}</span>
        <span class="im-total" style="grid-row:${r + 2}" title="${totals[r]} incident${totals[r] === 1 ? "" : "s"}">
          <span class="im-total-bar" style="width:${(totals[r] / maxTotal) * 100}%"></span><span class="im-total-num">${totals[r]}</span>
        </span>`).join("")}
      ${shown.map((i, k) => {
        const rs = i.orgs.map(row).sort((a, b) => a - b);
        return `
        <button type="button" class="im-col" data-id="${esc(i.id)}" style="grid-column:${col(k)};grid-row:2 / ${rows.length + 2}"
          aria-label="${esc(i.title)}, ${esc(formatDate(i.date))}: ${esc(i.orgs.join(", "))}"></button>
        ${rs.length > 1 ? `<span class="im-link" data-cat="${i.category}" style="grid-column:${col(k)};grid-row:${rs[0]} / ${rs[rs.length - 1] + 1}" aria-hidden="true"></span>` : ""}
        ${rs.map((r) => `<span class="im-mark" data-cat="${i.category}" data-type="${i.type}" data-id="${esc(i.id)}" style="grid-column:${col(k)};grid-row:${r}" aria-hidden="true"></span>`).join("")}`;
      }).join("")}`;
    const matrix = $("incidents-matrix");
    matrix.querySelectorAll(".im-col").forEach((b) => {
      b.addEventListener("mouseenter", () => show(b.dataset.id));
      b.addEventListener("focus", () => show(b.dataset.id));
      b.addEventListener("click", (e) => {
        select(b.dataset.id);
        if (e.isTrusted) toDetail();
      });
    });
    matrix.addEventListener("mouseleave", () => show(selected));
  }

  function renderLegend() {
    $("incidents-legend").innerHTML = `
      <span class="il-group"><span class="il-title">Category</span>${Object.entries(CATEGORIES).map(([k, v]) =>
        `<span class="il-item"><span class="im-mark" data-cat="${k}" data-type="behaviour"></span>${esc(v)}</span>`).join("")}</span>
      <span class="il-group"><span class="il-title">Type</span>${Object.entries(TYPES).map(([k, v]) =>
        `<span class="il-item"><span class="im-mark" data-cat="neutral" data-type="${k}"></span>${esc(v)}</span>`).join("")}</span>
      <span class="il-group"><span class="il-item"><span class="il-link"></span>Several developers' models involved</span></span>`;
  }

  function renderList() {
    const shown = shownItems().slice().reverse();
    $("incidents-list").innerHTML = shown.map((i) => `
      <li id="incident-${esc(i.id)}">
        <button type="button" class="il-row" data-id="${esc(i.id)}">
          <time class="rl-date" datetime="${esc(i.date)}">${esc(formatDate(i.date))}</time>
          <span class="il-mark"><span class="im-mark" data-cat="${i.category}" data-type="${i.type}"></span></span>
          <span class="il-title-text">${esc(i.title)}</span>
          <span class="il-orgs">${esc(i.orgs.join(", "))}</span>
        </button>
      </li>`).join("");
    $("incidents-list").querySelectorAll(".il-row").forEach((b) =>
      b.addEventListener("click", () => {
        select(b.dataset.id);
        toDetail(true);
      })
    );
  }

  function renderIntro() {
    const shown = shownItems();
    if (!shown.length) {
      $("incidents-intro").textContent = "No incidents match both filters.";
      return;
    }
    const n = shown.length, s = n === 1 ? "" : "s";
    const span = shown[0].date.slice(0, 4) === shown[n - 1].date.slice(0, 4) ? shown[0].date.slice(0, 4) : `${shown[0].date.slice(0, 4)}–${shown[n - 1].date.slice(0, 4)}`;
    const what = filter.category === "All" ? `incident${s} of loss of control, unintended behaviour and AI cyberattacks` : `${CATEGORIES[filter.category].toLowerCase()} incident${s}`;
    const who = filter.orgs === "All" ? "" : filter.orgs === "Other" ? " involving other developers' models" : ` involving ${filter.orgs} models`;
    $("incidents-intro").textContent = `${n} ${what}${who}, ${span}. Each column is an incident, oldest to newest, dated by when it became public; each row a developer whose models were involved.`;
  }

  function show(id) {
    const i = byId[id];
    if (!i || !shownItems().includes(i)) return;
    $("incidents-detail").innerHTML = `
      <div class="pd-card id-card">
        <p class="pd-date"><time datetime="${esc(i.date)}">${esc(formatDate(i.date))}</time> · ${esc(TYPES[i.type] || i.type)} · ${esc(CATEGORIES[i.category] || i.category)}</p>
        <p class="pd-name">${esc(i.title)}</p>
        <p class="pd-meta">${esc(i.by || i.orgs.join(", "))}</p>
        <p class="pd-note">${esc(i.summary)}</p>
        ${i.source ? `<a class="tl-source" href="${esc(i.source.url)}" target="_blank" rel="noopener noreferrer">Source: ${esc(i.source.label)} ↗</a>` : ""}
      </div>`;
    document.querySelectorAll("#incidents-matrix .im-col").forEach((b) => b.classList.toggle("is-preview", b.dataset.id === id && id !== selected));
  }

  function select(id) {
    selected = id;
    document.querySelectorAll("#incidents-matrix .im-col, #incidents-list .il-row").forEach((b) => b.classList.toggle("is-active", b.dataset.id === id));
    show(id);
    const col = document.querySelector(`#incidents-matrix .im-col[data-id="${CSS.escape(id)}"]`);
    const frame = document.querySelector(".inc-scroll");
    if (col && frame.scrollWidth > frame.clientWidth) {
      const r = col.getBoundingClientRect(), f = frame.getBoundingClientRect();
      if (r.left < f.left + 150 || r.right > f.right) frame.scrollTo({ left: frame.scrollLeft + r.left - f.left - f.width / 2, behavior: "smooth" });
    }
  }

  // Bring the details into view (from the list, the matrix too)
  function toDetail(withMatrix) {
    const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0;
    const target = withMatrix ? document.querySelector(".inc-scroll") : $("incidents-detail");
    const r = target.getBoundingClientRect();
    const bottom = $("incidents-detail").getBoundingClientRect().bottom;
    if (r.top >= headerH && bottom <= window.innerHeight) return;
    window.scrollTo({ top: window.scrollY + r.top - headerH - 24, behavior: "smooth" });
  }

  // Each pill's count is how many incidents it would show alongside the
  // other row's current choice; pills that would show none are dimmed
  function updateCounts() {
    const matches = (i, by, v) => v === "All" || (by === "orgs" ? i.orgs.includes(v) : i.category === v);
    ["category", "orgs"].forEach((by) => {
      const other = by === "orgs" ? "category" : "orgs";
      const pool = items.filter((i) => matches(i, other, filter[other]));
      document.querySelectorAll(`#incidents-filters-${by} .filter-pill`).forEach((p) => {
        const n = pool.filter((i) => matches(i, by, p.dataset.value)).length;
        p.querySelector(".filter-count").textContent = n;
        p.classList.toggle("is-empty", n === 0);
      });
    });
  }

  function render() {
    const shown = shownItems();
    updateCounts();
    renderIntro();
    renderList();
    // No matches: an empty state in place of the matrix, and no legend or
    // details
    const empty = !shown.length;
    $("incidents-legend").hidden = empty;
    document.querySelector("#page-incidents .race-list-title").hidden = empty;
    $("incidents-list").hidden = empty;
    if (empty) {
      $("incidents-matrix").style.removeProperty("--cols");
      $("incidents-matrix").innerHTML = `<p class="im-empty">No ${esc(CATEGORIES[filter.category].toLowerCase())} incidents on record involving ${filter.orgs === "Other" ? "other developers'" : esc(filter.orgs)} models.<br>
        <button type="button" class="im-reset" data-by="category">Show all categories</button>
        <button type="button" class="im-reset" data-by="orgs">Show all developers</button></p>`;
      $("incidents-matrix").querySelectorAll(".im-reset").forEach((b) =>
        b.addEventListener("click", () => document.querySelector(`#incidents-filters-${b.dataset.by} .filter-pill[data-value="All"]`).click())
      );
      $("incidents-detail").innerHTML = "";
      return;
    }
    renderMatrix();
    if (!shown.some((i) => i.id === selected)) selected = shown[shown.length - 1].id;
    select(selected);
    const frame = document.querySelector(".inc-scroll");
    frame.scrollLeft = frame.scrollWidth;   // newest at hand
  }

  function renderFilterRow(by, options) {
    const bar = $(`incidents-filters-${by}`);
    bar.innerHTML = [["All", "All", items.length], ...options]
      .map(([v, label, n]) => `<button type="button" class="filter-pill" data-value="${esc(v)}" aria-pressed="${v === filter[by]}">${esc(label)} <span class="filter-count">${n}</span></button>`)
      .join("");
    bar.addEventListener("click", (e) => {
      const b = e.target.closest(".filter-pill");
      if (!b || b.dataset.value === filter[by]) return;
      filter[by] = b.dataset.value;
      bar.querySelectorAll(".filter-pill").forEach((p) => p.setAttribute("aria-pressed", String(p === b)));
      render();
    });
    const edge = () => bar.classList.toggle("at-end", bar.scrollLeft + bar.clientWidth >= bar.scrollWidth - 2);
    bar.addEventListener("scroll", edge, { passive: true });
    window.addEventListener("resize", edge);
    edge();
  }

  renderFilterRow("category", Object.entries(CATEGORIES).map(([k, v]) => [k, v, items.filter((i) => i.category === k).length]).filter(([, , n]) => n));
  renderFilterRow("orgs", ORGS.map((o) => [o, o, orgCount.get(o)]));
  renderLegend();
  render();

  // From elsewhere on the site (the ticker, a lab's incident list): open an
  // incident, widening the filters if they'd hide it
  window.CC_showIncident = (id) => {
    const i = byId[id];
    if (!i) return;
    ["category", "orgs"].forEach((by) => {
      const ok = filter[by] === "All" || (by === "orgs" ? i.orgs.includes(filter.orgs) : i.category === filter.category);
      if (!ok) document.querySelector(`#incidents-filters-${by} .filter-pill[data-value="All"]`).click();
    });
    select(id);
    requestAnimationFrame(() => {
      const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0;
      const top = document.querySelector(".inc-scroll").getBoundingClientRect().top + window.scrollY - headerH - 24;
      window.scrollTo({ top: Math.max(0, top) });
      const frame = document.querySelector(".inc-scroll");
      const col = document.querySelector(`#incidents-matrix .im-col[data-id="${CSS.escape(id)}"]`);
      if (col) frame.scrollLeft += col.getBoundingClientRect().left - frame.getBoundingClientRect().left - frame.clientWidth / 2;
    });
  };
  // The matrix is drawn while the page is hidden; show the newest end when
  // the page first opens
  document.addEventListener("cc:pageshow", (e) => {
    if (e.detail.page !== "incidents") return;
    const frame = document.querySelector(".inc-scroll");
    if (frame && !frame.dataset.shown) { frame.dataset.shown = "1"; frame.scrollLeft = frame.scrollWidth; }
  });
})();
