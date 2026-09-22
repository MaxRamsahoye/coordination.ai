/* Coordination Console — dashboard logic. No build step, no dependencies. */
(function () {
  "use strict";

  const META = window.CC_META || {};
  const EVENTS = (window.CC_EVENTS || []).slice();
  const ACTORS = (window.CC_ACTORS || []).slice();
  const ACTOR_BY_ID = new Map(ACTORS.map((a) => [a.id, a]));

  // ───────────────────────────── Vocabularies
  const STANCES = [
    { v: 2, key: "2", label: "Halt / prohibit", color: "var(--st-2)",
      desc: "Pause or prohibit frontier or superintelligence development until safety and public-consent conditions are met." },
    { v: 1, key: "1", label: "Coordinated pacing", color: "var(--st-1)",
      desc: "Slow or gate the frontier through coordination among labs and states, red lines, verification or conditional commitments." },
    { v: 0, key: "0", label: "Guardrails", color: "var(--st-0)",
      desc: "Binding safety rules, transparency and oversight — but no general slowdown." },
    { v: -1, key: "-1", label: "Proceed & compete", color: "var(--st-m1)",
      desc: "Prioritise speed and competitiveness; voluntary or light-touch safeguards." },
    { v: -2, key: "-2", label: "Accelerate", color: "var(--st-m2)",
      desc: "Oppose constraints on development; frame AI as a race to be won." },
    { v: null, key: "na", label: "Unclear", color: "var(--st-na)",
      desc: "No clear public position on pacing." },
  ];
  const STANCE_BY_KEY = new Map(STANCES.map((s) => [s.key, s]));
  const stanceKey = (v) => (v === null || v === undefined ? "na" : String(v));
  const stanceOf = (a) => STANCE_BY_KEY.get(stanceKey(a.stance));

  const SECTORS = {
    government: "Government",
    industry: "Industry",
    civil: "Civil society",
    academia: "Academia",
    multilateral: "Multilateral",
  };
  const CATEGORIES = {
    policy: "Policy & law",
    international: "International",
    industry: "Industry",
    advocacy: "Advocacy",
    research: "Research & reports",
    incident: "Incident",
  };
  const SIGNALS = {
    "1": { cls: "up", text: "▲ Toward coordination" },
    "0": { cls: "flat", text: "● Mixed" },
    "-1": { cls: "down", text: "▼ Toward racing" },
  };

  // ───────────────────────────── Helpers
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function fmtDate(d) {
    if (!d) return "";
    const [y, m, day] = d.split("-");
    if (!m) return y;
    if (!day) return `${MONTHS[+m - 1]} ${y}`;
    return `${+day} ${MONTHS[+m - 1]} ${y}`;
  }
  function fmtShort(d) {
    const [y, m, day] = d.split("-");
    if (!m) return y;
    if (!day) return `${MONTHS[+m - 1]} ${y}`;
    return `${+day} ${MONTHS[+m - 1]}`;
  }
  const sortKey = (d) => {
    const [y, m = "00", day = "00"] = d.split("-");
    return `${y}-${m}-${day}`;
  };
  const yearOf = (d) => d.slice(0, 4);
  const isUpcoming = (e) => META.asOf && sortKey(e.date) > META.asOf;
  const byDateDesc = (a, b) => sortKey(b.date).localeCompare(sortKey(a.date));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } },
  };

  // Events referencing each actor
  const EVENTS_BY_ACTOR = new Map();
  for (const e of EVENTS) {
    for (const id of e.actors || []) {
      if (!EVENTS_BY_ACTOR.has(id)) EVENTS_BY_ACTOR.set(id, []);
      EVENTS_BY_ACTOR.get(id).push(e);
    }
  }

  function stanceDot(a) {
    const s = stanceOf(a);
    return `<span class="dot${s.key === "na" ? " na" : ""}" style="background:${s.color}" aria-hidden="true"></span>`;
  }
  function actorChip(id) {
    const a = ACTOR_BY_ID.get(id);
    if (!a) return "";
    return `<button type="button" class="chip" data-actor="${esc(a.id)}" title="${esc(stanceOf(a).label)}">${stanceDot(a)}${esc(a.name)}</button>`;
  }

  // ───────────────────────────── Tooltip
  const tip = $("#tooltip");
  function showTip(html, x, y) {
    tip.innerHTML = html;
    tip.hidden = false;
    const r = tip.getBoundingClientRect();
    let left = x + 14;
    let top = y + 14;
    if (left + r.width > window.innerWidth - 8) left = x - r.width - 14;
    if (top + r.height > window.innerHeight - 8) top = y - r.height - 14;
    tip.style.left = Math.max(8, left) + "px";
    tip.style.top = Math.max(8, top) + "px";
  }
  function hideTip() { tip.hidden = true; }

  function bindChartHover(container) {
    const svg = container.querySelector("svg");
    if (!svg) return;
    svg.addEventListener("pointermove", (ev) => {
      const t = ev.target.closest("[data-tip]");
      $$(".hot", svg).forEach((n) => n.classList.remove("hot"));
      if (!t) { container.classList.remove("dim"); hideTip(); return; }
      const group = t.getAttribute("data-group");
      if (group) $$(`[data-group="${group}"].mark`, svg).forEach((n) => n.classList.add("hot"));
      container.classList.add("dim");
      showTip(t.getAttribute("data-tip"), ev.clientX, ev.clientY);
    });
    svg.addEventListener("pointerleave", () => { container.classList.remove("dim"); hideTip(); $$(".hot", svg).forEach((n) => n.classList.remove("hot")); });
  }

  // ───────────────────────────── Overview
  function renderKPIs() {
    const ongoing = EVENTS.filter((e) => e.status === "ongoing").length;
    const positioned = ACTORS.filter((a) => a.stance !== null && a.stance !== undefined);
    const pro = positioned.filter((a) => a.stance >= 1).length;
    const con = positioned.filter((a) => a.stance <= -1).length;
    const years = EVENTS.map((e) => +yearOf(e.date));
    const k = [
      { label: "Events tracked", value: EVENTS.length, note: `${Math.min(...years)}–${Math.max(...years)}` },
      { label: "Live processes", value: ongoing, note: "bills, talks, lawsuits, campaigns" },
      { label: "Actors mapped", value: ACTORS.length, note: `${ACTORS.filter((a) => a.kind === "individual").length} people · ${ACTORS.filter((a) => a.kind === "institution").length} institutions` },
      { label: "Back pacing or a halt", value: `${pro}`, note: `vs ${con} for proceeding or accelerating` },
    ];
    $("#kpis").innerHTML = k
      .map((x) => `<div class="kpi"><div class="kpi-label">${esc(x.label)}</div><div class="kpi-value">${esc(x.value)}</div><div class="kpi-note">${esc(x.note)}</div></div>`)
      .join("");
  }

  function renderStanceLegend() {
    $("#stance-legend").innerHTML = STANCES.filter((s) => s.key !== "na")
      .map((s) => `<span class="legend-item"><span class="swatch" style="background:${s.color}"></span>${esc(s.label)}</span>`)
      .join("");
  }

  function stanceRows() {
    const rows = [{ key: "all", label: "All actors", list: ACTORS }];
    for (const [k, label] of Object.entries(SECTORS)) rows.push({ key: k, label, list: ACTORS.filter((a) => a.sector === k) });
    return rows.map((r) => {
      const positioned = r.list.filter((a) => a.stance !== null && a.stance !== undefined);
      const counts = STANCES.filter((s) => s.key !== "na").map((s) => ({ s, n: positioned.filter((a) => stanceKey(a.stance) === s.key).length }));
      return { ...r, total: positioned.length, unclear: r.list.length - positioned.length, counts };
    });
  }

  const tableMode = { "stance-chart": false, "signal-chart": false };

  function renderStanceChart() {
    const el = $("#stance-chart");
    const rows = stanceRows();
    if (tableMode["stance-chart"]) {
      el.innerHTML = `<div class="table-scroll"><table class="data-table"><thead><tr><th>Sector</th>${STANCES.filter((s) => s.key !== "na")
        .map((s) => `<th class="num">${esc(s.label)}</th>`).join("")}<th class="num">Unclear</th></tr></thead><tbody>${rows
        .map((r) => `<tr><td>${esc(r.label)}</td>${r.counts.map((c) => `<td class="num">${c.n}</td>`).join("")}<td class="num">${r.unclear}</td></tr>`)
        .join("")}</tbody></table></div>`;
      return;
    }
    const W = Math.max(300, el.clientWidth || 520);
    const labelW = W < 420 ? 86 : 108;
    const nW = 40;
    const rowH = 26, gap = 12, top = 4;
    const barW = W - labelW - nW;
    const H = top + rows.length * (rowH + gap) - gap + 4;
    let out = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Stacked bars showing the share of actors at each position, by sector">`;
    rows.forEach((r, i) => {
      const y = top + i * (rowH + gap);
      out += `<text x="0" y="${y + rowH / 2 + 4}"${r.key === "all" ? ' font-weight="650" style="fill:var(--ink)"' : ""}>${esc(r.label)}</text>`;
      let x = labelW;
      const segs = r.counts.filter((c) => c.n > 0);
      segs.forEach((c, j) => {
        const w = r.total ? (c.n / r.total) * barW : 0;
        const pct = Math.round((c.n / r.total) * 100);
        const first = j === 0, last = j === segs.length - 1;
        const tipHtml = `<strong>${esc(r.label)}</strong><div class="row"><span><span class="swatch" style="background:${c.s.color}"></span>${esc(c.s.label)}</span><span>${c.n} of ${r.total} · ${pct}%</span></div>`;
        const gapPx = last ? 0 : 2;
        const ww = Math.max(0, w - gapPx);
        // Rounded outer ends only
        const rx = 4;
        const path = roundedRectPath(x, y, ww, rowH, first ? rx : 0, last ? rx : 0);
        out += `<path class="mark" data-group="s${c.s.key}" d="${path}" fill="${c.s.color}" data-tip="${esc(tipHtml)}"></path>`;
        x += w;
      });
      out += `<text x="${W}" y="${y + rowH / 2 + 4}" text-anchor="end" class="axis-label">n=${r.total}${r.unclear ? "*" : ""}</text>`;
    });
    out += `</svg>`;
    const anyUnclear = rows.some((r) => r.unclear);
    el.innerHTML = out + (anyUnclear ? `<p class="card-sub">* excludes actors with no clear public position.</p>` : "");
    bindChartHover(el);
  }

  function roundedRectPath(x, y, w, h, rl, rr) {
    rl = Math.min(rl, w / 2, h / 2);
    rr = Math.min(rr, w / 2, h / 2);
    return [
      `M${x + rl},${y}`, `H${x + w - rr}`,
      rr ? `A${rr},${rr} 0 0 1 ${x + w},${y + rr}` : "", `V${y + h - rr}`,
      rr ? `A${rr},${rr} 0 0 1 ${x + w - rr},${y + h}` : "", `H${x + rl}`,
      rl ? `A${rl},${rl} 0 0 1 ${x},${y + h - rl}` : "", `V${y + rl}`,
      rl ? `A${rl},${rl} 0 0 1 ${x + rl},${y}` : "", "Z",
    ].join(" ");
  }

  function signalByYear() {
    const years = EVENTS.map((e) => +yearOf(e.date));
    const min = Math.max(2017, Math.min(...years));
    const max = Math.max(...years);
    const rows = [];
    for (let y = min; y <= max; y++) {
      const evs = EVENTS.filter((e) => +yearOf(e.date) === y);
      rows.push({ year: y, up: evs.filter((e) => e.signal === 1).length, down: evs.filter((e) => e.signal === -1).length, flat: evs.filter((e) => e.signal === 0).length });
    }
    return rows;
  }

  function renderSignalLegend() {
    $("#signal-legend").innerHTML =
      `<span class="legend-item"><span class="swatch" style="background:var(--sig-up)"></span>Toward coordination</span>` +
      `<span class="legend-item"><span class="swatch" style="background:var(--sig-down)"></span>Toward racing</span>`;
  }

  function niceMax(v) {
    if (v <= 5) return 5;
    const step = v <= 10 ? 2 : v <= 25 ? 5 : 10;
    return Math.ceil(v / step) * step;
  }

  function renderSignalChart() {
    const el = $("#signal-chart");
    const rows = signalByYear();
    if (tableMode["signal-chart"]) {
      el.innerHTML = `<div class="table-scroll"><table class="data-table"><thead><tr><th>Year</th><th class="num">Toward coordination</th><th class="num">Mixed</th><th class="num">Toward racing</th></tr></thead><tbody>${rows
        .map((r) => `<tr><td>${r.year}</td><td class="num">${r.up}</td><td class="num">${r.flat}</td><td class="num">${r.down}</td></tr>`)
        .join("")}</tbody></table></div>`;
      return;
    }
    const W = Math.max(300, el.clientWidth || 520);
    const H = 240;
    const padL = 28, padR = 4, padT = 8, padB = 22;
    const plotW = W - padL - padR, plotH = H - padT - padB;
    const m = niceMax(Math.max(...rows.map((r) => Math.max(r.up, r.down)), 1));
    const mid = padT + plotH / 2;
    const scale = (plotH / 2) / m;
    const band = plotW / rows.length;
    const bw = Math.max(4, Math.min(28, band * 0.6));
    const step = m <= 5 ? 1 : m <= 10 ? 2 : 5;
    let out = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Diverging bar chart of events toward coordination and toward racing per year">`;
    for (let t = step; t <= m; t += step) {
      for (const sgn of [1, -1]) {
        const y = mid - sgn * t * scale;
        out += `<line class="grid" x1="${padL}" x2="${W - padR}" y1="${y}" y2="${y}"></line>`;
        out += `<text class="axis-label" x="${padL - 6}" y="${y + 4}" text-anchor="end">${t}</text>`;
      }
    }
    const labelEvery = band < 30 ? 2 : 1;
    rows.forEach((r, i) => {
      const cx = padL + band * i + band / 2;
      const x = cx - bw / 2;
      const tipHtml = `<strong>${r.year}</strong>` +
        `<div class="row"><span><span class="swatch" style="background:var(--sig-up)"></span>Toward coordination</span><span>${r.up}</span></div>` +
        `<div class="row"><span><span class="swatch" style="background:var(--sig-down)"></span>Toward racing</span><span>${r.down}</span></div>` +
        `<div class="row"><span><span class="swatch" style="background:var(--sig-flat)"></span>Mixed</span><span>${r.flat}</span></div>`;
      if (r.up) out += `<path class="mark" data-group="y${r.year}" d="${roundedTop(x, mid - 1, bw, r.up * scale - 1)}" fill="var(--sig-up)"></path>`;
      if (r.down) out += `<path class="mark" data-group="y${r.year}" d="${roundedBottom(x, mid + 1, bw, r.down * scale - 1)}" fill="var(--sig-down)"></path>`;
      out += `<rect class="hit" data-group="y${r.year}" x="${padL + band * i}" y="${padT}" width="${band}" height="${plotH}" data-tip="${esc(tipHtml)}"></rect>`;
      if (i % labelEvery === 0 || i === rows.length - 1)
        out += `<text class="axis-label" x="${cx}" y="${H - 6}" text-anchor="middle">${band < 44 ? "’" + String(r.year).slice(2) : r.year}</text>`;
    });
    out += `<line class="baseline" x1="${padL}" x2="${W - padR}" y1="${mid}" y2="${mid}"></line></svg>`;
    el.innerHTML = out;
    bindChartHover(el);
  }
  // Bars anchored to the baseline, rounded only at the data end
  function roundedTop(x, base, w, h) {
    if (h <= 0) return "";
    const r = Math.min(4, w / 2, h);
    return `M${x},${base} V${base - h + r} A${r},${r} 0 0 1 ${x + r},${base - h} H${x + w - r} A${r},${r} 0 0 1 ${x + w},${base - h + r} V${base} Z`;
  }
  function roundedBottom(x, base, w, h) {
    if (h <= 0) return "";
    const r = Math.min(4, w / 2, h);
    return `M${x},${base} V${base + h - r} A${r},${r} 0 0 0 ${x + r},${base + h} H${x + w - r} A${r},${r} 0 0 0 ${x + w},${base + h - r} V${base} Z`;
  }

  function miniItem(e) {
    const sig = SIGNALS[String(e.signal)];
    return `<li><span class="mini-date">${esc(fmtShort(e.date))}<br><span class="sig sig-${sig.cls}" title="${esc(sig.text.slice(2))}">${sig.text.slice(0, 1)}</span></span>
      <div><div class="mini-title"><button type="button" data-goto-event="${esc(e.id)}">${esc(e.title)}</button></div>
      <div class="card-sub">${esc(CATEGORIES[e.category] || e.category)} · ${esc(yearOf(e.date))}${isUpcoming(e) ? " · scheduled" : ""}</div></div></li>`;
  }
  function renderLists() {
    const sorted = EVENTS.slice().sort(byDateDesc);
    $("#latest").innerHTML = sorted.slice(0, 7).map(miniItem).join("");
    $("#ongoing").innerHTML = sorted.filter((e) => e.status === "ongoing").slice(0, 10).map(miniItem).join("");
  }

  // ───────────────────────────── Timeline
  const evState = { q: "", cat: "", sig: "", status: "", actor: "", asc: false };

  function initTimelineFilters() {
    $("#ev-cat").innerHTML = `<option value="">All</option>` + Object.entries(CATEGORIES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join("");
    const withEvents = ACTORS.filter((a) => EVENTS_BY_ACTOR.has(a.id)).sort((a, b) => a.name.localeCompare(b.name));
    $("#ev-actor").innerHTML = `<option value="">All</option>` + withEvents.map((a) => `<option value="${esc(a.id)}">${esc(a.name)}</option>`).join("");
    const bind = (id, key) => $(id).addEventListener("input", (e) => { evState[key] = e.target.value; renderTimeline(); });
    bind("#ev-q", "q"); bind("#ev-cat", "cat"); bind("#ev-sig", "sig"); bind("#ev-status", "status"); bind("#ev-actor", "actor");
    $("#ev-sort").addEventListener("click", (e) => {
      evState.asc = !evState.asc;
      e.currentTarget.textContent = evState.asc ? "Oldest first" : "Newest first";
      e.currentTarget.setAttribute("aria-pressed", String(evState.asc));
      renderTimeline();
    });
    $("#ev-reset").addEventListener("click", resetTimelineFilters);
  }
  function resetTimelineFilters() {
    Object.assign(evState, { q: "", cat: "", sig: "", status: "", actor: "" });
    ["#ev-q", "#ev-cat", "#ev-sig", "#ev-status", "#ev-actor"].forEach((s) => ($(s).value = ""));
    renderTimeline();
  }

  function eventMatches(e) {
    if (evState.cat && e.category !== evState.cat) return false;
    if (evState.sig !== "" && String(e.signal) !== evState.sig) return false;
    if (evState.status && e.status !== evState.status) return false;
    if (evState.actor && !(e.actors || []).includes(evState.actor)) return false;
    if (evState.q) {
      const q = evState.q.toLowerCase();
      const hay = [e.title, e.summary, CATEGORIES[e.category], ...(e.actors || []).map((id) => ACTOR_BY_ID.get(id)?.name || "")].join(" ").toLowerCase();
      if (!q.split(/\s+/).every((t) => hay.includes(t))) return false;
    }
    return true;
  }

  function renderTimeline() {
    const list = EVENTS.filter(eventMatches).sort(byDateDesc);
    if (evState.asc) list.reverse();
    $("#timeline-count").textContent = `${list.length} of ${EVENTS.length} events`;
    if (!list.length) { $("#timeline-list").innerHTML = `<div class="empty">No events match these filters.</div>`; return; }
    const groups = [];
    for (const e of list) {
      const y = yearOf(e.date);
      if (!groups.length || groups[groups.length - 1].y !== y) groups.push({ y, items: [] });
      groups[groups.length - 1].items.push(e);
    }
    $("#timeline-list").innerHTML = groups
      .map((g) => `<section class="tl-year" aria-label="${g.y}"><h3>${g.y}</h3>${g.items.map(eventCard).join("")}</section>`)
      .join("");
  }

  function eventCard(e) {
    const sig = SIGNALS[String(e.signal)];
    const actors = (e.actors || []).map(actorChip).join("");
    const sources = (e.sources || []).map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)} ↗</a>`).join("");
    return `<article class="tl-item ${sig.cls}" id="ev-${esc(e.id)}">
      <div class="tl-date">${esc(fmtDate(e.date))}</div>
      <div>
        <div class="tl-meta">
          <span class="chip">${esc(CATEGORIES[e.category] || e.category)}</span>
          <span class="sig sig-${sig.cls}">${sig.text}</span>
          ${isUpcoming(e) ? `<span class="badge">Scheduled</span>` : e.status === "ongoing" ? `<span class="badge live">Ongoing</span>` : ""}
        </div>
        <h4 class="tl-title">${esc(e.title)}</h4>
        <p class="tl-summary">${esc(e.summary)}</p>
        ${actors ? `<div class="tl-actors">${actors}</div>` : ""}
        ${sources ? `<div class="tl-sources"><span>Sources:</span>${sources}</div>` : ""}
      </div>
    </article>`;
  }

  function gotoEvent(id) {
    resetTimelineFilters();
    showTab("timeline", false);
    history.replaceState(null, "", `#event=${id}`);
    const el = document.getElementById(`ev-${id}`);
    if (el) {
      el.scrollIntoView({ block: "center" });
      el.classList.add("flash");
      setTimeout(() => el.classList.remove("flash"), 1800);
    }
  }

  // ───────────────────────────── Actors
  const acState = { q: "", kind: "", sector: "", stance: "", view: store.get("cc-actor-view") === "table" ? "table" : "board" };

  function initActorFilters() {
    $("#ac-sector").innerHTML = `<option value="">All</option>` + Object.entries(SECTORS).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join("");
    $("#ac-stance").innerHTML = `<option value="">All</option>` + STANCES.map((s) => `<option value="${s.key}">${esc(s.label)}</option>`).join("");
    const bind = (id, key) => $(id).addEventListener("input", (e) => { acState[key] = e.target.value; renderActors(); });
    bind("#ac-q", "q"); bind("#ac-kind", "kind"); bind("#ac-sector", "sector"); bind("#ac-stance", "stance");
    $$(".seg [data-view]").forEach((b) =>
      b.addEventListener("click", () => {
        acState.view = b.dataset.view;
        store.set("cc-actor-view", acState.view);
        renderActors();
      })
    );
    $("#ac-reset").addEventListener("click", () => {
      Object.assign(acState, { q: "", kind: "", sector: "", stance: "" });
      ["#ac-q", "#ac-kind", "#ac-sector", "#ac-stance"].forEach((s) => ($(s).value = ""));
      renderActors();
    });
  }

  function actorMatches(a) {
    if (acState.kind && a.kind !== acState.kind) return false;
    if (acState.sector && a.sector !== acState.sector) return false;
    if (acState.stance && stanceKey(a.stance) !== acState.stance) return false;
    if (acState.q) {
      const hay = [a.name, a.role, a.region, a.summary, SECTORS[a.sector]].join(" ").toLowerCase();
      if (!acState.q.toLowerCase().split(/\s+/).every((t) => hay.includes(t))) return false;
    }
    return true;
  }

  function renderActors() {
    $$(".seg [data-view]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === acState.view)));
    const list = ACTORS.filter(actorMatches).sort((a, b) => a.name.localeCompare(b.name));
    $("#actors-count").textContent = `${list.length} of ${ACTORS.length} actors`;
    const view = $("#actors-view");
    if (!list.length) { view.innerHTML = `<div class="empty">No actors match these filters.</div>`; return; }
    if (acState.view === "table") {
      view.innerHTML = `<div class="card table-scroll"><table class="data-table"><thead><tr>
        <th>Name</th><th>Position</th><th>Type</th><th>Sector</th><th>Region</th><th class="num">Events</th></tr></thead><tbody>${list
        .map((a) => `<tr>
          <td><button type="button" class="link-btn" data-actor="${esc(a.id)}">${esc(a.name)}</button>${a.tension ? ` <span class="actor-flag" title="Stated position and conduct diverge">tension</span>` : ""}<div class="card-sub">${esc(a.role)}</div></td>
          <td><span class="chip">${stanceDot(a)}${esc(stanceOf(a).label)}</span></td>
          <td>${a.kind === "individual" ? "Individual" : "Institution"}</td>
          <td>${esc(SECTORS[a.sector] || a.sector)}</td>
          <td>${esc(a.region)}</td>
          <td class="num">${(EVENTS_BY_ACTOR.get(a.id) || []).length}</td></tr>`)
        .join("")}</tbody></table></div>`;
      return;
    }
    view.innerHTML = `<div class="board">${STANCES.map((s) => {
      const col = list.filter((a) => stanceKey(a.stance) === s.key);
      return `<section class="col" aria-label="${esc(s.label)}">
        <div class="col-head${s.key === "na" ? " na" : ""}" style="--c:${s.color}">
          <div class="col-title"><span>${esc(s.label)}</span><span class="n">${col.length}</span></div>
          <div class="col-desc">${esc(s.desc)}</div>
        </div>
        <ul class="col-list">${col
          .map((a) => `<li><button type="button" class="actor-btn" data-actor="${esc(a.id)}">
            <span class="actor-name">${esc(a.name)}</span>
            <span class="kind-ico" title="${a.kind === "individual" ? "Individual" : "Institution"}">${a.kind === "individual" ? "person" : "org"}</span>
            <span class="actor-role">${esc(a.role)}${a.tension ? ` · <span class="actor-flag">tension</span>` : ""}</span>
          </button></li>`)
          .join("") || `<li class="card-sub" style="padding:8px">None match</li>`}</ul>
      </section>`;
    }).join("")}</div>`;
  }

  // ───────────────────────────── Actor dialog
  const dlg = $("#actor-dialog");
  let returnHash = "#actors";

  function openActor(id) {
    const a = ACTOR_BY_ID.get(id);
    if (!a) return;
    const s = stanceOf(a);
    const scale = STANCES.filter((x) => x.key !== "na");
    const evs = (EVENTS_BY_ACTOR.get(a.id) || []).slice().sort(byDateDesc);
    const evidence = (a.evidence || []).slice().sort(byDateDesc);
    $("#actor-dialog-body").innerHTML = `
      <div class="dlg-top">
        <div>
          <h2 id="ad-name">${esc(a.name)}</h2>
          <p class="dlg-role">${esc(a.role)}</p>
          <p class="card-sub">${a.kind === "individual" ? "Individual" : "Institution"} · ${esc(SECTORS[a.sector] || a.sector)} · ${esc(a.region)}</p>
        </div>
        <button class="icon-btn" type="button" data-close aria-label="Close">✕</button>
      </div>
      <div>
        <div class="dlg-h">Position</div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:4px"><span class="chip">${stanceDot(a)}<strong style="color:var(--ink)">${esc(s.label)}</strong></span></div>
        ${s.key !== "na" ? `<div class="stance-bar" aria-hidden="true">${scale.slice().reverse()
          .map((x) => `<span class="${x.key === s.key ? "on" : ""}" style="--c:${x.color}"></span>`).join("")}</div>
        <div class="stance-scale-labels" aria-hidden="true"><span>Accelerate</span><span>Guardrails</span><span>Halt</span></div>` : ""}
        <p class="card-sub" style="margin-top:6px">${esc(s.desc)}</p>
      </div>
      <p style="margin:0">${esc(a.summary)}</p>
      ${a.tension ? `<div class="tension"><strong>Tension</strong>${esc(a.tension)}</div>` : ""}
      ${evidence.length ? `<div><div class="dlg-h" style="margin-bottom:6px">Evidence</div><ul class="evidence">${evidence
        .map((ev) => `<li><span class="d">${esc(fmtDate(ev.date))}</span><span>${esc(ev.text)}${ev.url ? ` <a href="${esc(ev.url)}" target="_blank" rel="noopener noreferrer">source ↗</a>` : ""}</span></li>`)
        .join("")}</ul></div>` : ""}
      ${evs.length ? `<div><div class="dlg-h" style="margin-bottom:6px">In the timeline (${evs.length})</div><ul class="evidence">${evs
        .map((e) => `<li><span class="d">${esc(fmtDate(e.date))}</span><span><button type="button" class="link-btn" style="white-space:normal;text-align:left" data-goto-event="${esc(e.id)}">${esc(e.title)}</button></span></li>`)
        .join("")}</ul></div>` : ""}
    `;
    if (!location.hash.startsWith("#actor=")) returnHash = location.hash || "#overview";
    history.replaceState(null, "", `#actor=${a.id}`);
    if (!dlg.open) dlg.showModal();
    $("#actor-dialog-body").scrollTop = 0;
    dlg.scrollTop = 0;
  }
  function closeActor() {
    if (dlg.open) dlg.close();
  }
  dlg.addEventListener("close", () => {
    if (location.hash.startsWith("#actor=")) history.replaceState(null, "", returnHash);
  });
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg || e.target.closest("[data-close]")) closeActor();
  });

  // ───────────────────────────── Method
  function renderMethod() {
    $("#scale-defs").innerHTML = STANCES.map(
      (s) => `<div><dt><span class="swatch${s.key === "na" ? " na" : ""}" style="background:${s.color}"></span>${esc(s.label)}</dt><dd>${esc(s.desc)}</dd></div>`
    ).join("");
  }

  // ───────────────────────────── Tabs & routing
  const TABS = ["overview", "timeline", "actors", "method"];
  function showTab(name, updateHash = true) {
    if (!TABS.includes(name)) name = "overview";
    TABS.forEach((t) => ($("#panel-" + t).hidden = t !== name));
    $$(".tabs a").forEach((a) => (a.dataset.tab === name ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
    if (updateHash && location.hash !== "#" + name) history.replaceState(null, "", "#" + name);
    if (name === "overview") { renderStanceChart(); renderSignalChart(); }
    window.scrollTo(0, 0);
  }
  function route() {
    const h = decodeURIComponent(location.hash.slice(1));
    if (h.startsWith("actor=")) { showTab("actors", false); openActor(h.slice(6)); return; }
    if (h.startsWith("event=")) { gotoEvent(h.slice(6)); return; }
    closeActor();
    showTab(h || "overview", false);
  }

  // ───────────────────────────── Global events
  document.addEventListener("click", (e) => {
    const actorBtn = e.target.closest("[data-actor]");
    if (actorBtn) { e.preventDefault(); openActor(actorBtn.dataset.actor); return; }
    const evBtn = e.target.closest("[data-goto-event]");
    if (evBtn) { e.preventDefault(); closeActor(); gotoEvent(evBtn.dataset.gotoEvent); return; }
    const tbl = e.target.closest("[data-table-toggle]");
    if (tbl) {
      const id = tbl.dataset.tableToggle;
      tableMode[id] = !tableMode[id];
      tbl.textContent = tableMode[id] ? "Show chart" : "Show table";
      id === "stance-chart" ? renderStanceChart() : renderSignalChart();
      return;
    }
    const tab = e.target.closest(".tabs a, a[href^='#']");
    if (tab && TABS.includes(tab.getAttribute("href").slice(1))) {
      e.preventDefault();
      showTab(tab.getAttribute("href").slice(1));
    }
  });
  window.addEventListener("hashchange", route);

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { if (!$("#panel-overview").hidden) { renderStanceChart(); renderSignalChart(); } }, 120);
  });

  $("#theme-toggle").addEventListener("click", () => {
    const root = document.documentElement;
    const current = root.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    store.set("cc-theme", next);
  });

  // ───────────────────────────── Boot
  const asOf = META.asOf ? fmtDate(META.asOf) : "";
  $("#asof").textContent = asOf ? `Data as of ${asOf}` : "";
  $("#asof-foot").textContent = asOf;

  renderKPIs();
  renderStanceLegend();
  renderSignalLegend();
  renderLists();
  initTimelineFilters();
  renderTimeline();
  initActorFilters();
  renderActors();
  renderMethod();
  route();
})();
