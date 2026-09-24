/* Race page: the race drawn as a track. Each lab and each state has a lane,
   time runs left to right from the start line to a chequered finish line at
   today, and each event is a marker in its lane, with year lines across the
   track like laps. Selecting a marker (or a row in the list below) shows its
   details. Filters show one category's lanes. */
(function () {
  "use strict";

  const R = window.CC_RACE;
  if (!R || !document.getElementById("race-track")) return;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = (d) => new Date(`${d}T00:00:00Z`).getTime();
  const formatDate = (d) => { const [y, m, dd] = d.split("-"); return `${+dd} ${MONTHS[+m - 1]} ${y}`; };
  const t0 = day(R.start), t1 = day(R.now);
  const at = (d) => ((day(d) - t0) / (t1 - t0)) * 100;   // % along the track
  const PX_PER_MONTH = 20;   // the track's least width; it stretches to fill wider screens
  const trackPx = Math.round(((t1 - t0) / (30.44 * 864e5)) * PX_PER_MONTH);

  const events = R.events.slice().sort((a, b) => a.date.localeCompare(b.date));
  const byId = Object.fromEntries(events.map((e) => [e.id, e]));
  let current = "All";
  let selected = events[events.length - 1].id;

  // Year lines ("laps") across the track
  const years = [];
  for (let y = +R.start.slice(0, 4) + 1; y <= +R.now.slice(0, 4); y++) years.push(y);

  function renderTrack() {
    const lanes = Object.entries(R.lanes).filter(([, l]) => current === "All" || l.category === current);
    const lane = ([key, l]) => {
      const mine = events.filter((e) => e.lane === key);
      // Each label goes above the line if there's room, else below; if
      // neither has room it shows only on hover. (Widths are estimated from
      // the text, as the page may be hidden while this is drawn.)
      const ends = { above: -Infinity, below: -Infinity };
      const marks = mine.map((e) => {
        const px = (at(e.date) / 100) * trackPx;
        const half = (e.title.length * 7 + 12) / 2;
        const row = ends.above <= px - half ? "above" : ends.below <= px - half ? "below" : null;
        if (row) ends[row] = px + half;
        const place = row === "below" ? " is-below" : row ? "" : " is-hidden-label";
        // Near either end of the track, the label runs inwards from its marker
        const edge = px + half > trackPx ? " is-end" : px - half < 0 ? " is-start" : "";
        return `<button type="button" class="rt-mark${place}${edge}" data-id="${esc(e.id)}" data-cat="${l.category}" style="left:${at(e.date).toFixed(3)}%"
            aria-label="${esc(e.title)}, ${esc(l.name)}, ${esc(formatDate(e.date))}">
          <span class="rt-dot"></span><span class="rt-label">${esc(e.title)}</span>
        </button>`;
      }).join("");
      return `<div class="rt-lane" data-cat="${l.category}">
          <span class="rt-lane-name">${esc(l.name)}</span>
          <div class="rt-lane-track">${marks}</div>
        </div>`;
    };
    document.getElementById("race-track").innerHTML = `
      <div class="rt-inner" style="--track-w:${trackPx}px">
        <div class="rt-axis" aria-hidden="true">
          <span class="rt-lane-name"></span>
          <div class="rt-lane-track">
            <span class="rt-start-label">Start</span>
            ${years.map((y) => `<span class="rt-year" style="left:${at(`${y}-01-01`).toFixed(3)}%">${y}</span>`).join("")}
            <span class="rt-finish-label">Now · ${esc(formatDate(R.now))}</span>
          </div>
        </div>
        <div class="rt-lanes">
          <div class="rt-grid" aria-hidden="true">
            <span class="rt-start"></span>
            ${years.map((y) => `<span class="rt-lap" style="left:${at(`${y}-01-01`).toFixed(3)}%"></span>`).join("")}
            <span class="rt-finish"></span>
          </div>
          ${lanes.map(lane).join("")}
        </div>
      </div>`;
    document.querySelectorAll("#race-track .rt-mark").forEach((b) => {
      b.addEventListener("mouseenter", () => show(b.dataset.id));
      b.addEventListener("focus", () => show(b.dataset.id));
      b.addEventListener("click", () => select(b.dataset.id));
    });
    document.querySelector("#race-track .rt-lanes").addEventListener("mouseleave", () => show(selected));
  }

  function renderList() {
    const shown = events.filter((e) => current === "All" || R.lanes[e.lane].category === current).reverse();
    const groups = [];
    shown.forEach((e) => {
      const y = e.date.slice(0, 4);
      if (!groups.length || groups[groups.length - 1][0] !== y) groups.push([y, []]);
      groups[groups.length - 1][1].push(e);
    });
    document.getElementById("race-list").innerHTML = groups.map(([y, list]) => `
      <section class="rl-year">
        <h3 class="rl-year-label">${esc(y)}</h3>
        <ol class="rl-items">${list.map((e) => `
          <li class="rl-item" data-cat="${R.lanes[e.lane].category}">
            <button type="button" class="rl-row" data-id="${esc(e.id)}">
              <time class="rl-date" datetime="${esc(e.date)}">${esc(formatDate(e.date))}</time>
              <span class="rl-lane"><span class="rt-dot"></span>${esc(R.lanes[e.lane].name)}</span>
              <span class="rl-title">${esc(e.title)}</span>
            </button>
          </li>`).join("")}
        </ol>
      </section>`).join("");
    document.querySelectorAll("#race-list .rl-row").forEach((b) =>
      b.addEventListener("click", () => {
        select(b.dataset.id);
        // Bring the track's marker into view, and the details with it
        const mark = document.querySelector(`#race-track .rt-mark[data-id="${CSS.escape(b.dataset.id)}"]`);
        if (mark) mark.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      })
    );
  }

  function show(id) {
    const e = byId[id];
    const l = R.lanes[e.lane];
    document.getElementById("race-detail").innerHTML = `
      <div class="pd-card rd-card" data-cat="${l.category}">
        <p class="pd-date"><time datetime="${esc(e.date)}">${esc(formatDate(e.date))}</time> · ${esc(R.categories[l.category])}</p>
        <p class="pd-name">${esc(e.title)}</p>
        <p class="pd-meta">${esc(l.name)}</p>
        <p class="pd-note">${esc(e.summary)}</p>
        <a class="tl-source" href="${esc(e.source.url)}" target="_blank" rel="noopener noreferrer">Source: ${esc(e.source.label)} ↗</a>
      </div>`;
  }

  function select(id) {
    selected = id;
    document.querySelectorAll("#race-track .rt-mark, #race-list .rl-row").forEach((b) => b.classList.toggle("is-active", b.dataset.id === id));
    show(id);
  }

  function render() {
    if (current !== "All" && R.lanes[byId[selected].lane].category !== current) {
      selected = events.filter((e) => R.lanes[e.lane].category === current).pop().id;
    }
    renderTrack();
    renderList();
    select(selected);
    // Start at the finish line: the latest events
    const scroller = document.querySelector(".race-scroll");
    scroller.scrollLeft = scroller.scrollWidth;
  }

  function renderFilters() {
    const bar = document.getElementById("race-filters");
    const count = (c) => events.filter((e) => R.lanes[e.lane].category === c).length;
    const options = [["All", "All", events.length], ...Object.entries(R.categories).map(([k, label]) => [k, label, count(k)])];
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

  renderFilters();
  render();
  // The track is laid out while the page is hidden; scroll it to the finish
  // line again when the page is first shown
  document.addEventListener("cc:pageshow", () => {
    const scroller = document.querySelector(".race-scroll");
    if (scroller && scroller.offsetParent) scroller.scrollLeft = scroller.scrollWidth;
  });
})();
