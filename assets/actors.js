/* Actors page: two subpages, Individuals and Institutions, each filtered by
   category. Institutions also appear on a world map, one pin per place
   (with a count where several share it); choosing a pin narrows the cards
   to that place. Where someone's position is recorded on the Positions
   page, their card shows it. */
(function () {
  "use strict";

  const A = window.CC_ACTORS;
  if (!A || !document.getElementById("actors-list")) return;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const KINDS = {
    individuals: {
      label: "Individuals",
      types: { scientist: "Research scientists", academic: "Academics", leader: "Lab leaders", campaigner: "Governance advocates", policymaker: "Policymakers" },
      one: { scientist: "Research scientist", academic: "Academic", leader: "Lab leader", campaigner: "Governance advocate", policymaker: "Policymaker" },
      intro: {
        All: "The people shaping the debate on AI risk: research scientists, academics, the leaders of the frontier labs, governance advocates and policymakers.",
        scientist: "Research scientists warning about the risks of advanced AI or studying them.",
        academic: "Academics whose work frames the risks of advanced AI, from superintelligence to existential risk.",
        leader: "The leaders of the frontier labs racing to build more capable AI, and what they have said about pacing it.",
        campaigner: "Advocates pressing for governance of advanced AI: a pause, a slowdown or a prohibition on superintelligence.",
        policymaker: "Legislators who have proposed or backed binding limits on advanced AI.",
      },
    },
    institutions: {
      label: "Institutions",
      types: { lab: "Frontier labs", government: "Government", research: "Research", advocacy: "Advocacy" },
      one: { lab: "Frontier lab", government: "Government", research: "Research", advocacy: "Advocacy" },
      intro: {
        All: "The labs building frontier AI, and the government bodies, researchers and campaigners working on its safety, evaluation and coordination.",
        lab: "The companies building the most capable AI models.",
        government: "Government and intergovernmental bodies that test AI models, set standards or enforce rules.",
        research: "Independent researchers who evaluate frontier models, study their risks and forecast where AI is heading.",
        advocacy: "Campaigns and non-profits pressing for a slowdown, a pause or a prohibition on superintelligence.",
      },
    },
  };
  const state = { kind: "individuals", type: "All", place: null };

  // Recorded positions, by name, from the Positions page's data
  const STANCES = { ban: "Stated support for a ban or pause", pace: "Stated support for pacing or binding rules", oppose: "Stated opposition to a slowdown or new rules" };
  const recorded = new Map();
  (function () {
    const P = window.CC_POSITIONS;
    if (!P) return;
    const walk = (n) => { if (n.stance) recorded.set(n.name, n.stance); (n.children || []).forEach(walk); };
    Object.values(P.industry || {}).forEach((l) => walk(l.chart));
    Object.values(P.chambers || {}).forEach((list) => (list || []).forEach((m) => { if (m.stance) recorded.set(m.name, m.stance); }));
  })();

  const items = () => A[state.kind];
  const typed = () => items().filter((x) => state.type === "All" || x.type === state.type);
  const shown = () => typed().filter((x) => !state.place || placeKey(x) === state.place);

  // ───────────── Pills
  function pills(el, options, current, onPick) {
    el.innerHTML = options
      .map(([v, label, n]) => `<button type="button" class="filter-pill" data-value="${esc(v)}" aria-pressed="${v === current}">${esc(label)}${n != null ? ` <span class="filter-count">${n}</span>` : ""}</button>`)
      .join("");
    el.onclick = (e) => {
      const b = e.target.closest(".filter-pill");
      if (b && b.dataset.value !== current) onPick(b.dataset.value);
    };
  }
  function renderFilters() {
    pills($("actors-kinds"), Object.entries(KINDS).map(([k, K]) => [k, K.label, A[k].length]), state.kind, (v) => {
      state.kind = v; state.type = "All"; state.place = null; render();
    });
    const K = KINDS[state.kind];
    pills($("actors-filters"), [["All", "All", items().length], ...Object.entries(K.types).map(([k, label]) => [k, label, items().filter((x) => x.type === k).length])], state.type, (v) => {
      state.type = v; state.place = null; render();
    });
  }

  // ───────────── Cards
  const domain = (url) => new URL(url).hostname.replace(/^www\./, "");
  function card(x) {
    const K = KINDS[state.kind];
    const meta = state.kind === "institutions"
      ? `${K.one[x.type]} · ${x.based} · since ${x.founded}`
      : `${K.one[x.type]} · ${x.based}`;
    const st = recorded.get(x.name);
    return `
      <li class="org-card" id="actor-${esc(x.id)}">
        <p class="org-card-meta">${esc(meta)}</p>
        <h3 class="org-card-name">${esc(x.name)}</h3>
        ${x.role ? `<p class="org-card-role">${esc(x.role)}</p>` : ""}
        <p class="org-card-summary">${esc(x.summary)}</p>
        ${st ? `<p class="pd-stance org-card-stance" data-s="${st}"><span class="pd-dot"></span>${esc(STANCES[st])}</p>` : ""}
        ${x.url ? `<a class="tl-source" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.site || domain(x.url))} ↗</a>` : ""}
      </li>`;
  }

  // ───────────── The map (institutions): pins grouped by place
  const W = window.CC_WORLD;
  const k = W ? W.width / 360 : 1;
  const project = ([lat, lon]) => [(lon + 180) * k, (W.top - lat) * k];
  // Places closer than this on the map share a pin
  const NEAR = 9;
  const placeKey = (x) => x._place;
  function groupPlaces(list) {
    const places = [];
    list.forEach((x) => {
      const [px, py] = project(x.at);
      let p = places.find((q) => Math.hypot(q.x - px, q.y - py) < NEAR);
      if (!p) places.push((p = { key: `p${places.length}`, x: px, y: py, items: [] }));
      p.items.push(x);
    });
    places.forEach((p) => {
      p.items.forEach((x) => (x._place = p.key));
      // The place's name: its towns, most institutions first (a pin can
      // cover neighbouring towns, such as those around San Francisco Bay)
      const towns = p.items.map((x) => x.based.replace(/\s*\(.*\)$/, ""));
      const count = (t) => towns.filter((n) => n === t).length;
      const distinct = [...new Set(towns)].sort((a, b) => count(b) - count(a));
      const country = distinct[0].split(", ").slice(1).join(", ");
      const short = distinct.map((t) => (country && t.endsWith(`, ${country}`) ? t.slice(0, -country.length - 2) : t));
      p.name = distinct.length === 1 ? distinct[0]
        : `${short.slice(0, 2).join(", ")}${distinct.length > 2 ? " and nearby" : ""}${country ? `, ${country}` : ""}`;
    });
    // Nudge pins that would overlap apart, keeping each near its place
    const r = (p) => (p.items.length > 1 ? 10 : 5.5);
    for (let round = 0; round < 20; round++) {
      places.forEach((a, i) => places.slice(i + 1).forEach((b) => {
        const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 0.01, min = r(a) + r(b) + 2;
        if (d >= min) return;
        const push = (min - d) / 2;
        a.x -= (dx / d) * push; a.y -= (dy / d) * push;
        b.x += (dx / d) * push; b.y += (dy / d) * push;
      }));
    }
    return places;
  }
  let places = [];
  function renderMap() {
    const map = $("actors-map");
    map.hidden = state.kind !== "institutions" || !W;
    if (map.hidden) { $("actors-place").hidden = true; return; }
    places = groupPlaces(typed());
    map.innerHTML = `
      <svg viewBox="0 0 ${W.width} ${W.height}" role="img" aria-label="World map of the institutions' locations: ${places.length} places. Choose a pin to see the institutions there.">
        <path class="am-land" d="${W.land}"/>
        <path class="am-borders" d="${W.borders}"/>
        ${places.map((p) => `
          <g class="am-pin${state.place === p.key ? " is-active" : ""}" data-place="${p.key}" transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})" tabindex="0" role="button"
             aria-label="${esc(p.name)}: ${p.items.length} institution${p.items.length === 1 ? "" : "s"}">
            <title>${esc(p.name)}: ${esc(p.items.map((x) => x.name).join(", "))}</title>
            <circle class="am-halo" r="${p.items.length > 1 ? 15 : 10}"/>
            <circle class="am-dot" r="${p.items.length > 1 ? 10 : 5.5}"/>
            ${p.items.length > 1 ? `<text class="am-count" dy="0.35em">${p.items.length}</text>` : ""}
          </g>`).join("")}
      </svg>`;
    map.querySelectorAll(".am-pin").forEach((g) => {
      const pick = () => {
        state.place = state.place === g.dataset.place ? null : g.dataset.place;
        render();
        if (state.place) $("actors-place").scrollIntoView({ behavior: "smooth", block: "nearest" });
      };
      g.addEventListener("click", pick);
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
    });
    // The place chosen, with a way back to everywhere
    const place = places.find((p) => p.key === state.place);
    $("actors-place").hidden = !place;
    if (place) {
      $("actors-place").innerHTML = `<p><strong>${esc(place.name)}</strong> · ${place.items.length} institution${place.items.length === 1 ? "" : "s"} <button type="button" class="im-reset" id="actors-everywhere">Show everywhere</button></p>`;
      $("actors-everywhere").onclick = () => { state.place = null; render(); };
    }
  }

  function render() {
    renderFilters();
    const K = KINDS[state.kind];
    $("actors-intro").textContent = K.intro[state.type];
    renderMap();
    // With All chosen, group the cards under their categories, in order
    const list = shown();
    $("actors-list").innerHTML = state.type !== "All"
      ? list.map(card).join("")
      : Object.entries(K.types).map(([t, label]) => {
          const group = list.filter((x) => x.type === t);
          return group.length
            ? `<li class="ac-group-head" role="presentation">${esc(label)} <span class="filter-count">${group.length}</span></li>${group.map(card).join("")}`
            : "";
        }).join("");
  }

  render();
})();
