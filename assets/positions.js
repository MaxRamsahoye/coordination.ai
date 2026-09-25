/* Positions page: chamber seating diagrams (UK Commons and Lords, US Senate
   and House) with every current member, and leadership charts for the AI
   labs, each coloured by documented position on a coordinated slowdown.
   Data: data/positions.js (recorded positions and lab charts) and the member
   lists in data/members-*.js, loaded the first time the page opens. */
(function () {
  "use strict";

  const P = window.CC_POSITIONS;
  if (!P) return;

  // Groups and their bodies. The menu has up to three tiers: Industry or
  // Governments; then a lab (Industry) or Overview, UK or US (Governments);
  // then, for UK or US, a chamber. Industry and Governments each open on an
  // overview. Internally the chosen country is the group (uk / us), and
  // "gov" is the all-governments overview.
  const GROUPS = {
    industry: { label: "Industry", bodyLabel: "Lab", bodies: [["overview", "Overview"], ["anthropic", "Anthropic"], ["openai", "OpenAI"], ["deepmind", "Google DeepMind"], ["meta", "Meta"], ["xai", "xAI"]] },
    gov: { label: "Governments", bodyLabel: "", bodies: [["overview", "Overview"]] },
    uk: { label: "UK", bodyLabel: "Chamber", bodies: [["commons", "House of Commons"], ["lords", "House of Lords"]] },
    us: { label: "US", bodyLabel: "Chamber", bodies: [["senate", "Senate"], ["house", "House of Representatives"]] },
    leaders: { label: "World leaders", bodyLabel: "", bodies: [["overview", "World leaders"]] },
    actors: { label: "Major actors", bodyLabel: "", bodies: [["overview", "Major actors"]] },
  };
  const PEOPLE = { leaders: "World leaders", actors: "Major actors" };   // the groups that are a single table of people

  // Party names and colours (seats use these in "Party" mode)
  const PARTIES = {
    labour: ["Labour", "#e4003b"], "labourco-operative": ["Labour Co-op", "#e4003b"], conservative: ["Conservative", "#0087dc"],
    "liberal-democrat": ["Liberal Democrat", "#faa61a"], reform: ["Reform UK", "#12b6cf"], "scottish-national-party": ["SNP", "#fdf38e"],
    green: ["Green", "#02a95b"], "plaid-cymru": ["Plaid Cymru", "#005b54"], dup: ["DUP", "#d46a4c"], "sinn-fein": ["Sinn Féin", "#326760"],
    "social-democratic-and-labour-party": ["SDLP", "#2aa82c"], alliance: ["Alliance", "#f6cb2f"], uup: ["UUP", "#48a5ee"],
    "traditional-unionist-voice": ["TUV", "#0c3a6a"], "your-party": ["Your Party", "#b0005a"], "restore-britain": ["Restore Britain", "#1b2a4a"],
    independent: ["Independent", "#9a9a9a"], speaker: ["Speaker", "#6f6f6f"], crossbench: ["Crossbench", "#b8b8b8"],
    "non-affiliated": ["Non-affiliated", "#8a8a8a"], bishop: ["Lords Spiritual", "#8e5ea2"], judge: ["Judge", "#7d7d7d"],
    "independent-ulster-unionist": ["Independent Ulster Unionist", "#8fb3d9"], "independent-labour": ["Independent Labour", "#e88a9c"],
    "conservative-independent": ["Conservative Independent", "#7fb3e0"],
    Democrat: ["Democrat", "#3b6fe0"], Republican: ["Republican", "#e0393e"], Independent: ["Independent", "#9a9a9a"],
  };
  const partyName = (p) => (PARTIES[p] || [p])[0];
  const partyColour = (p) => (PARTIES[p] || [null, "#9a9a9a"])[1];

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fmtDate = (d) => {
    if (!d) return "";
    const [y, m, day] = d.split("-");
    return !m ? y : !day ? `${MONTHS[+m - 1]} ${y}` : `${+day} ${MONTHS[+m - 1]} ${y}`;
  };
  const stanceLabel = (s) => P.stances[s || "none"];

  const state = { group: "industry", body: "overview", mode: "position", selected: null, loaded: false };
  const CHAMBERS = [
    ["uk", "commons", "UK", "House of Commons"],
    ["uk", "lords", "UK", "House of Lords"],
    ["us", "senate", "US", "Senate"],
    ["us", "house", "US", "House of Representatives"],
  ];
  let members = null;   // { commons, lords, senate, house } once loaded
  let seats = [];       // the current chamber's members, in seat order

  // ───────────── Loading the member lists (once)
  function loadMembers() {
    if (members) return Promise.resolve(members);
    const srcs = ($("page-positions").dataset.members || "").split(/\s+/).filter(Boolean);
    return Promise.all(
      srcs.map((src) => new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.onload = resolve;
        s.onerror = () => reject(new Error(`Couldn't load ${src}`));
        document.head.appendChild(s);
      }))
    ).then(() => {
      const uk = window.CC_MEMBERS_UK || {}, us = window.CC_MEMBERS_US || {};
      members = {
        commons: (uk.commons || []).map(([id, name, party, area]) => ({ id, name, party, area })),
        lords: (uk.lords || []).map(([id, name, party]) => ({ id, name, party, area: "" })),
        senate: (us.senate || []).map(([id, name, party, st, cls, since]) => ({ id, name, party, area: st, since })),
        house: (us.house || []).map(([id, name, party, st, dist, since]) => ({ id, name, party, area: dist === 0 || dist === "" ? `${st} (at large)` : `${st}-${dist}`, since })),
      };
      // Attach recorded positions by id; warn about any that don't match
      for (const [chamber, list] of Object.entries(P.chambers)) {
        const byId = new Map(members[chamber].map((m) => [m.id, m]));
        for (const pos of list) {
          const m = byId.get(pos.id);
          if (m) m.position = pos;
          else console.warn(`Positions: no current member ${pos.id} (${pos.name}) in ${chamber}`);
        }
      }
      return members;
    });
  }

  // ───────────── Seat layouts. Each returns [{x, y}] in SVG units (in the
  // order members are assigned to them) plus the drawing's size and extras.

  // Hemicycle (US): rows of seats on concentric arcs, seats taken left to
  // right by angle so each party forms a wedge
  function hemicycle(n, rows, width) {
    const R = width / 2 - (rows <= 4 ? 26 : 14), r0 = R * 0.38;   // leave room for the outer seats' radius
    const radii = Array.from({ length: rows }, (_, i) => r0 + ((R - r0) * i) / (rows - 1));
    const total = radii.reduce((a, b) => a + b, 0);
    let counts = radii.map((r) => Math.round((n * r) / total));
    counts[rows - 1] += n - counts.reduce((a, b) => a + b, 0);
    const pts = [];
    radii.forEach((r, i) => {
      const k = counts[i];
      for (let j = 0; j < k; j++) {
        const a = Math.PI - (Math.PI * (j + 0.5)) / k;
        pts.push({ x: width / 2 + r * Math.cos(a), y: R + 16 - r * Math.sin(a), a, row: i });
      }
    });
    pts.sort((p, q) => q.a - p.a || p.row - q.row);
    const step = (R - r0) / (rows - 1);
    const dot = Math.min(step * 0.42, (Math.PI * r0) / counts[0] * 0.42);
    return { pts, w: width, h: R + 32, dot };
  }

  // Westminster (UK): two sets of benches facing across the floor, the
  // Speaker's chair (or the Throne and Woolsack) at the left end, and an
  // optional block of cross benches at the right end facing the chair.
  // blocks: { gov: [...members], opp: [...], cross: [...], apart: [...] }
  function westminster(blocks, width) {
    const ROWS = 5, gap = 11, top = 34, floorH = 5 * gap;
    const left = 92;
    const crossRows = ROWS * 2 + Math.round(floorH / gap);
    const crossCols = blocks.cross.length ? Math.ceil(blocks.cross.length / crossRows) : 0;
    const crossW = crossCols ? crossCols * gap + 28 : 0;
    const benchCols = Math.max(Math.ceil(blocks.gov.length / ROWS), Math.ceil(blocks.opp.length / ROWS));
    const spacing = Math.min(gap, (width - left - crossW - 16) / benchCols);
    const oppY = (r) => top + (ROWS - 1 - r) * gap;              // front row nearest the floor
    const floorTop = top + ROWS * gap - gap / 2 + 4, floorBottom = floorTop + floorH - 8;
    const govY = (r) => floorBottom + gap / 2 + 4 + r * gap;
    const place = (list, yOf) =>
      list.map((m, i) => ({ m, x: left + Math.floor(i / ROWS) * spacing, y: yOf(i % ROWS) }));
    const out = [...place(blocks.opp, oppY), ...place(blocks.gov, govY)];
    const crossX0 = width - crossW + 20;
    blocks.cross.forEach((m, i) => out.push({ m, x: crossX0 + Math.floor(i / crossRows) * gap, y: top + (i % crossRows) * gap }));
    const h = govY(ROWS - 1) + 28;
    return { placed: out, w: width, h, dot: Math.min(spacing, gap) * 0.4, floorTop, floorBottom, left, crossX0, top };
  }

  // ───────────── Chamber rendering
  const byPartyOrder = (order) => (a, b) =>
    (order.indexOf(a.party) === -1 ? 99 : order.indexOf(a.party)) - (order.indexOf(b.party) === -1 ? 99 : order.indexOf(b.party)) ||
    (b.position ? 1 : 0) - (a.position ? 1 : 0) || a.name.localeCompare(b.name);

  function chamberLayout(body) {
    const list = members[body];
    if (body === "senate" || body === "house") {
      // Democrats (and the independents who caucus with them) sit to the
      // presiding officer's right: the left of the diagram
      const ordered = list.slice().sort((a, b) => byPartyOrder(["Democrat", "Independent", "Republican"])(a, b) || (a.since || 0) - (b.since || 0));
      const lay = hemicycle(ordered.length, body === "senate" ? 4 : 9, 820);
      const placed = ordered.map((m, i) => ({ m, x: lay.pts[i].x, y: lay.pts[i].y }));
      const extras = `
        <text class="ch-label" x="${lay.w / 2}" y="${lay.h - 6}" text-anchor="middle">${body === "senate" ? "Presiding officer" : "Speaker"}</text>
        <rect class="ch-furniture" x="${lay.w / 2 - 22}" y="${lay.h - 30}" width="44" height="10" rx="2"></rect>`;
      return { placed, w: lay.w, h: lay.h, dot: lay.dot, extras };
    }

    // UK
    let blocks;
    if (body === "commons") {
      const gov = list.filter((m) => m.party === "labour" || m.party === "labourco-operative");
      const apart = list.filter((m) => m.party === "sinn-fein" || m.party === "speaker");
      const opp = list.filter((m) => !gov.includes(m) && !apart.includes(m));
      blocks = {
        gov: gov.sort(byPartyOrder(["labour", "labourco-operative"])),
        opp: opp.sort(byPartyOrder(["conservative", "liberal-democrat", "reform", "scottish-national-party", "green", "plaid-cymru", "dup", "uup", "traditional-unionist-voice", "social-democratic-and-labour-party", "alliance", "your-party", "restore-britain", "independent"])),
        cross: [],
        apart,
      };
    } else {
      const gov = list.filter((m) => m.party === "bishop" || m.party === "labour");
      const crossParties = ["crossbench", "judge", "non-affiliated"];
      const cross = list.filter((m) => crossParties.includes(m.party));
      const opp = list.filter((m) => !gov.includes(m) && !cross.includes(m));
      blocks = {
        gov: gov.sort(byPartyOrder(["bishop", "labour"])),
        opp: opp.sort(byPartyOrder(["conservative", "liberal-democrat", "dup", "uup", "plaid-cymru", "green", "independent-ulster-unionist", "independent-labour", "conservative-independent"])),
        cross: cross.sort(byPartyOrder(crossParties)),
        apart: [],
      };
    }
    const lay = westminster(blocks, 820);
    const placed = lay.placed.slice();
    const chairX = 28, midY = (lay.floorTop + lay.floorBottom) / 2;
    const speaker = blocks.apart.find((m) => m.party === "speaker");
    if (speaker) placed.push({ m: speaker, x: chairX + 16, y: midY });
    const sf = blocks.apart.filter((m) => m.party === "sinn-fein");
    const sfX = lay.w - 12 - sf.length * 11;
    sf.forEach((m, i) => placed.push({ m, x: sfX + i * 11, y: lay.h + 18 }));
    const h = lay.h + (sf.length ? 34 : 0);
    const benchEnd = (lay.crossX0 || lay.w) - 24;
    const tableX = lay.left + 40;
    const extras = `
      <rect class="ch-floor" x="${lay.left - 12}" y="${lay.floorTop}" width="${benchEnd - lay.left + 12}" height="${lay.floorBottom - lay.floorTop}" rx="3"></rect>
      <rect class="ch-furniture" x="${tableX}" y="${midY - 7}" width="120" height="14" rx="2"></rect>
      <text class="ch-label" x="${tableX + 130}" y="${midY + 4}">${body === "commons" ? "Table and despatch boxes" : "Table"}</text>
      ${body === "commons"
        ? `<rect class="ch-furniture" x="${chairX}" y="${midY - 12}" width="14" height="24" rx="2"></rect>
           <text class="ch-label" x="${chairX - 4}" y="${lay.floorTop - 10}" text-anchor="start">Speaker</text>`
        : `<rect class="ch-furniture" x="${chairX - 8}" y="${midY - 16}" width="10" height="32" rx="2"></rect>
           <rect class="ch-furniture" x="${chairX + 14}" y="${midY - 8}" width="18" height="16" rx="3"></rect>
           <text class="ch-label" x="${chairX - 8}" y="${midY - 24}" text-anchor="start">Throne</text>
           <text class="ch-label" x="${chairX - 8}" y="${midY + 32}" text-anchor="start">Woolsack</text>`}
      <text class="ch-label ch-side" x="${lay.left}" y="${lay.top - 14}">Opposition</text>
      <text class="ch-label ch-side" x="${lay.left}" y="${lay.h - 4}">Government${body === "lords" ? " (and Lords Spiritual)" : ""}</text>
      ${blocks.cross.length ? `<text class="ch-label ch-side" x="${lay.crossX0}" y="${lay.top - 14}">Cross benches</text>` : ""}
      ${sf.length ? `<text class="ch-label" x="${sfX - 8}" y="${lay.h + 22}" text-anchor="end">Sinn Féin (do not take their seats)</text>` : ""}`;
    return { placed, w: lay.w, h, dot: lay.dot, extras };
  }

  function renderChamber() {
    const view = $("positions-view");
    view.classList.add("is-chamber");
    const { placed, w, h, dot, extras } = chamberLayout(state.body);
    seats = placed.map((p) => p.m);
    const circles = placed
      .map(({ m, x, y }, i) => {
        const s = m.position ? m.position.stance : "none";
        return `<circle class="seat" data-i="${i}" data-s="${s}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${dot.toFixed(2)}" style="--pc:${partyColour(m.party)}"></circle>`;
      })
      .join("");
    const title = GROUPS[state.group].bodies.find(([k]) => k === state.body)[1];
    // The UK chambers are long and shallow, so they break out of the text
    // column to show their seats larger
    view.innerHTML = `
      <div class="chamber-frame${state.group === "uk" ? " is-wide" : ""}">
      <svg class="chamber by-${state.mode}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Seating diagram of the ${esc(title)}: ${seats.length} members. Hover over or tap a seat to see who sits there; the list below gives every recorded position.">
        ${extras}
        <g class="seats">${circles}</g>
      </svg>
      </div>`;
    const svg = view.querySelector("svg");
    const pick = (e, stick) => {
      const c = e.target.closest(".seat");
      if (!c) return;
      if (stick) state.selected = +c.dataset.i;
      showMember(seats[+c.dataset.i], +c.dataset.i);
      if (stick && e.isTrusted) scrollToDetail();
    };
    svg.addEventListener("pointerover", (e) => pick(e, false));
    svg.addEventListener("click", (e) => pick(e, true));
    svg.addEventListener("pointerleave", () => {
      if (state.selected != null) showMember(seats[state.selected], state.selected);
      else showHint();
    });
    applySearch();
    renderLegend();
    renderList();
    renderNotes();
    stepNav = {
      count: seats.length,
      index: () => (state.selected == null ? -1 : state.selected),
      el: (i) => $("positions-view").querySelector(`.seat[data-i="${i}"]`),
      go: (i) => {
        state.selected = i;
        showMember(seats[i], i);
        revealInFrame($("positions-view").querySelector(`.seat[data-i="${i}"]`));
      },
    };
    // Open on the chamber's featured member (see data/positions.js)
    if (state.selected == null) {
      const i = seats.findIndex((m) => m.id === (P.featured || {})[state.body]);
      if (i >= 0) state.selected = i;
    }
    if (state.selected != null) showMember(seats[state.selected], state.selected);
    else showHint();
  }

  function showMember(m, i) {
    $("positions-view").querySelectorAll(".seat.is-active").forEach((c) => c.classList.remove("is-active"));
    const c = $("positions-view").querySelector(`.seat[data-i="${i}"]`);
    if (c) c.classList.add("is-active");
    const pos = m.position;
    const where = state.group === "us" ? (state.body === "senate" ? `Senator for ${m.area}` : `Representative, ${m.area}`) : m.area;
    $("positions-detail").innerHTML = `
      <div class="pd-card">
        <p class="pd-name">${esc(m.name)}</p>
        <p class="pd-meta"><span class="pd-party" style="--pc:${partyColour(m.party)}"></span>${esc(partyName(m.party))}${where ? ` · ${esc(where)}` : ""}</p>
        <p class="pd-stance" data-s="${pos ? pos.stance : "none"}"><span class="pd-dot"></span>${esc(stanceLabel(pos && pos.stance))}${pos && pos.date ? ` <span class="pd-date">(${esc(fmtDate(pos.date))})</span>` : ""}</p>
        ${pos ? `<p class="pd-note">${esc(pos.note)}</p>` : ""}
        ${pos && pos.source ? `<a class="tl-source" href="${esc(pos.source.url)}" target="_blank" rel="noopener noreferrer">Source: ${esc(pos.source.label)} ↗</a>` : ""}
      </div>`;
    renderStepper();
  }
  function showHint() {
    $("positions-detail").innerHTML = `<p class="pd-hint">Hover over or tap a seat to see who sits there.</p>`;
    renderStepper();
  }

  function renderLegend() {
    const counts = new Map();
    if (state.mode === "position") {
      for (const m of seats) {
        const s = m.position ? m.position.stance : "none";
        counts.set(s, (counts.get(s) || 0) + 1);
      }
      $("positions-legend").innerHTML = ["ban", "pace", "oppose", "none"]
        .filter((s) => counts.has(s))
        .map((s) => `<span class="lg-item" data-s="${s}"><span class="lg-swatch"></span>${esc(stanceLabel(s))} <span class="filter-count">${counts.get(s)}</span></span>`)
        .join("");
    } else {
      for (const m of seats) counts.set(m.party, (counts.get(m.party) || 0) + 1);
      $("positions-legend").innerHTML = [...counts]
        .sort((a, b) => b[1] - a[1])
        .map(([p, n]) => `<span class="lg-item"><span class="lg-swatch" style="background:${partyColour(p)}"></span>${esc(partyName(p))} <span class="filter-count">${n}</span></span>`)
        .join("");
    }
  }

  function renderList() {
    const recorded = seats.map((m, i) => ({ m, i })).filter(({ m }) => m.position);
    const order = { ban: 0, pace: 1, oppose: 2 };
    recorded.sort((a, b) => order[a.m.position.stance] - order[b.m.position.stance] || a.m.name.localeCompare(b.m.name));
    $("positions-list").innerHTML = `
      <h3 class="pl-title">Recorded positions <span class="filter-count">${recorded.length} of ${seats.length} members</span></h3>
      ${recorded.length ? `<ul class="pl-items">${recorded
        .map(({ m, i }) => `
          <li class="pl-item" data-s="${m.position.stance}">
            <button type="button" class="pl-name" data-i="${i}"><span class="pd-dot"></span>${esc(m.name)}</button>
            <span class="pl-meta">${esc(partyName(m.party))}${m.area ? ` · ${esc(m.area)}` : ""} · ${esc(stanceLabel(m.position.stance))}</span>
            <p class="pl-note">${esc(m.position.note)} ${m.position.source ? `<a class="tl-source" href="${esc(m.position.source.url)}" target="_blank" rel="noopener noreferrer">${esc(m.position.source.label)} ↗</a>` : ""}</p>
          </li>`)
        .join("")}</ul>` : `<p class="pl-empty">None recorded yet.</p>`}
      ${unrecordedChamber()}`;
    $("positions-list").querySelectorAll(".pl-name, .pu-name").forEach((b) =>
      b.addEventListener("click", () => {
        state.selected = +b.dataset.i;
        showMember(seats[state.selected], state.selected);
        $("positions-view").scrollIntoView({ block: "center" });
      })
    );
  }

  // Everyone without a recorded position, by party (largest first), each
  // name opening their seat
  function unrecordedChamber() {
    const none = seats.map((m, i) => ({ m, i })).filter(({ m }) => !m.position);
    if (!none.length) return "";
    const parties = new Map();
    none.forEach((x) => { if (!parties.has(x.m.party)) parties.set(x.m.party, []); parties.get(x.m.party).push(x); });
    return `
      <h3 class="pl-title">No recorded position <span class="filter-count">${none.length.toLocaleString()} of ${seats.length.toLocaleString()} members</span></h3>
      <p class="pu-intro">None has been found yet for these members, which doesn't mean they have none.</p>
      ${[...parties].sort((a, b) => b[1].length - a[1].length).map(([party, list]) => `
        <section class="pu-group">
          <h4 class="pu-party"><span class="pd-party" style="--pc:${partyColour(party)}"></span>${esc(partyName(party))} <span class="filter-count">${list.length}</span></h4>
          <ul class="pu-items">${list.slice().sort((a, b) => a.m.name.localeCompare(b.m.name)).map(({ m, i }) => `
            <li><button type="button" class="pu-name" data-i="${i}">${esc(m.name)}${m.area ? `<span class="pu-area">${esc(m.area)}</span>` : ""}</button></li>`).join("")}
          </ul>
        </section>`).join("")}`;
  }

  function renderNotes() {
    const notes = {
      commons: "Seats in the Commons aren't assigned: the governing party sits to the Speaker's right, the other parties opposite. Members are grouped here by party on the benches where they sit; there are fewer seats than MPs, so the benches are drawn to fit everyone.",
      lords: "The Lords Spiritual and the governing party sit to the right of the Throne, the other parties opposite, and crossbenchers and non-affiliated members on the cross benches facing the Throne. Seats aren't assigned within each side.",
      senate: "Senators have assigned desks, but this diagram groups them by party (Democrats to the presiding officer's right) rather than showing individual desk numbers.",
      house: "House members don't have assigned seats: Democrats sit to the Speaker's right and Republicans to the left, as shown here. Includes non-voting delegates.",
    };
    const src = state.group === "uk" ? "Members: mySociety Parliament data, as of 24 Sep 2026." : "Members: unitedstates/congress-legislators, as of 24 Sep 2026.";
    $("positions-notes").innerHTML = `<p>${esc(notes[state.body] || "")} ${esc(src)} Everyone without a recorded position is shown as “No recorded position”: it means none has been found yet, not that they have none.</p>`;
  }

  // ───────────── Search: highlight members whose name or seat matches
  function applySearch() {
    const q = $("positions-search").value.trim().toLowerCase();
    const view = $("positions-view");
    view.classList.toggle("is-searching", !!q);
    if (state.group === "industry") {
      view.querySelectorAll(".org-node").forEach((n) => n.classList.toggle("is-match", !!q && n.textContent.toLowerCase().includes(q)));
      return;
    }
    let first = null;
    view.querySelectorAll(".seat").forEach((c) => {
      const m = seats[+c.dataset.i];
      const hit = !!q && (m.name.toLowerCase().includes(q) || (m.area || "").toLowerCase().includes(q));
      c.classList.toggle("is-match", hit);
      if (hit && first == null) first = +c.dataset.i;
    });
    if (first != null) showMember(seats[first], first);
  }

  // ───────────── Stepping through a diagram: the arrow buttons (and ← →)
  // move to the previous or next box or seat, wrapping at the ends. Each
  // diagram sets `stepNav` to { count, index(), go(k) }; overviews clear it.
  let stepNav = null;
  function renderStepper() {
    const el = $("positions-step");
    el.hidden = !stepNav;
    if (!stepNav) return;
    const k = stepNav.index();
    el.querySelector(".step-count").textContent = `${k >= 0 ? (k + 1).toLocaleString() : "–"} / ${stepNav.count.toLocaleString()}`;
  }
  function step(d) {
    if (!stepNav || !stepNav.count) return;
    const k = stepNav.index();
    stepNav.go(k < 0 ? (d > 0 ? 0 : stepNav.count - 1) : (k + d + stepNav.count) % stepNav.count);
  }
  // Keep a box or seat in view inside its sideways-scrolling frame, without
  // moving the page up or down
  function revealInFrame(el) {
    const frame = el && el.closest(".org-scroll, .chamber-frame");
    if (!frame || frame.scrollWidth <= frame.clientWidth) return;
    const r = el.getBoundingClientRect(), f = frame.getBoundingClientRect();
    frame.scrollTo({ left: frame.scrollLeft + (r.left + r.width / 2) - (f.left + f.width / 2), behavior: "smooth" });
  }
  // After a click in a diagram, glide down to the details (with the arrows
  // above them) unless they're already in full view
  function scrollToDetail() {
    const top = $("positions-step").getBoundingClientRect().top;
    const bottom = $("positions-detail").getBoundingClientRect().bottom;
    const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0;
    if (top >= headerH && bottom <= window.innerHeight) return;
    window.scrollTo({ top: window.scrollY + top - headerH - 24, behavior: "smooth" });
  }

  // ───────────── Industry: leadership chart as a nested tree
  const flatten = (n) => [n, ...(n.children || []).flatMap(flatten)];
  const byName = (chart) => new Map(flatten(chart).map((n) => [n.name, n]));
  const uniquePeople = (list) => {
    const seen = new Map();
    list.forEach((n) => { if (!seen.has(n.name)) seen.set(n.name, n); });
    return [...seen.values()];
  };
  // Everyone tracked at a lab: its leadership, then its board (and Trust),
  // once each, with positions recorded in the chart
  const labPeople = (lab) => {
    const chart = flatten(lab.chart);
    const inChart = byName(lab.chart);
    const others = [lab.trust, lab.board].filter(Boolean).flatMap((g) => g.members)
      .filter((m) => !inChart.has(m.name));
    return uniquePeople([...chart, ...others]);
  };

  function renderIndustry() {
    const lab = P.industry[state.body];
    const nodes = [];
    const node = (n, depth = 0) => {
      const i = nodes.push(n) - 1;
      const kids = n.children || [];
      // Below the top of the chart, three or more people with no reports of
      // their own are stacked in one box beside any who do, which keeps the
      // chart narrow
      const leaves = kids.filter((c) => !(c.children || []).length);
      const stack = depth > 0 && leaves.length >= 3;
      const branches = stack ? kids.filter((c) => (c.children || []).length) : kids;
      const stackHtml = stack ? `<li><div class="org-group org-stack"><div class="org-members">${leaves.map(member).join("")}</div></div></li>` : "";
      return `<li>
        <button type="button" class="org-node${n.company ? " org-node-company" : ""}" data-i="${i}" data-s="${n.stance || "none"}">
          <span class="org-name"><span class="pd-dot"></span>${esc(n.name)}</span>
          <span class="org-role">${esc(n.role)}</span>
        </button>
        ${kids.length ? `<ul>${stackHtml}${branches.map((c) => node(c, depth + 1)).join("")}</ul>` : ""}
      </li>`;
    };
    const member = (n) => {
      const i = nodes.push(n) - 1;
      return `<button type="button" class="org-node org-member" data-i="${i}" data-s="${n.stance || "none"}">
          <span class="org-name"><span class="pd-dot"></span>${esc(n.name)}</span>
          <span class="org-role">${esc(n.role)}</span>
        </button>`;
    };
    // Board members are listed in a box of their own; anyone who also sits in
    // the leadership chart keeps their recorded position there
    const inChart = byName(lab.chart);
    const group = (g, below) => {
      const where = /^board/i.test(g.label) ? `${lab.name} ${g.label.toLowerCase()}` : g.label;
      const members = g.members.map((m) => {
        const p = inChart.get(m.name) || {};
        return member({ name: m.name, role: m.role, where, stance: p.stance, note: p.note, source: m.source || p.source || g.source });
      }).join("");
      return `<li>
        <div class="org-group${g.members.length <= 4 ? " is-small" : ""}">
          <p class="org-group-label">${esc(g.label)} <span class="filter-count">${g.members.length}</span></p>
          <div class="org-members">${members}</div>
        </div>
        ${below ? `<ul>${below}</ul>` : ""}
      </li>`;
    };
    // The company itself heads the chart, then its board (under Anthropic's
    // Trust, which appoints most of it), then its leadership
    const companyNode = { company: true, name: lab.name, role: "Company", stance: lab.stance };
    const companyI = nodes.push(companyNode) - 1;
    const topI = nodes.length;
    const chartHtml = node(lab.chart);
    const boardHtml = lab.board ? group(lab.board, chartHtml) : chartHtml;
    const branches = lab.trust ? group(lab.trust, boardHtml) : boardHtml;
    const tree = `<li>
        <button type="button" class="org-node org-node-company" data-i="${companyI}" data-s="${lab.stance || "none"}">
          <span class="org-name"><span class="pd-dot"></span>${esc(lab.name)}</span>
          <span class="org-role">Company</span>
        </button>
        <ul>${branches}</ul>
      </li>`;
    $("positions-view").classList.remove("is-chamber");
    // The company's position, behaviour and evaluation live in its box at
    // the top of the chart (shown in the detail card when it's selected)
    // People who left over safety or risk concerns sit apart from the tree,
    // in their own area below it
    const departed = lab.departed && lab.departed.length
      ? `<div class="org-departed">
          <div class="org-group org-group-departed">
            <p class="org-group-label">Left over safety or risk concerns <span class="filter-count">${lab.departed.length}</span></p>
            <div class="org-members">${lab.departed.map((d) => member({ ...d, departed: true, where: `left ${d.left}` })).join("")}</div>
          </div>
        </div>`
      : "";
    $("positions-view").innerHTML = `<div class="org-scroll"><ul class="org-tree">${tree}</ul>${departed}</div>`;
    const show = (n) => {
      if (n.company) return showCompany();
      $("positions-detail").innerHTML = `
        <div class="pd-card">
          <p class="pd-name">${esc(n.name)}</p>
          <p class="pd-meta">${esc(n.role)}${n.where ? ` · ${esc(n.where)}` : `, ${esc(lab.name)}`}</p>
          ${n.departed && !n.stance ? `<p class="pd-stance pd-left">Left ${esc(lab.name)} over safety or risk concerns</p>`
            : `<p class="pd-stance" data-s="${n.stance || "none"}"><span class="pd-dot"></span>${esc(stanceLabel(n.stance))}</p>`}
          ${n.note ? `<p class="pd-note">${esc(n.note)}</p>` : ""}
          ${n.source ? `<a class="tl-source" href="${esc(n.source.url)}" target="_blank" rel="noopener noreferrer">Source: ${esc(n.source.label)} ↗</a>` : ""}
        </div>`;
    };
    // The company's own card: its position, behaviour and evaluation
    const showCompany = () => {
      $("positions-detail").innerHTML = `
        <div class="pd-card pd-company">
          <p class="pd-name">${esc(lab.name)}</p>
          <p class="pd-meta">Company</p>
          ${positionBlock(lab)}
          ${behaviourBlock(lab)}
          ${evaluationBlock(lab)}
        </div>`;
      $("positions-detail").querySelectorAll("[data-incident]").forEach((a) =>
        a.addEventListener("click", (e) => {
          e.preventDefault();
          if (window.CC_openEntry) window.CC_openEntry("incidents", a.dataset.incident);
        })
      );
    };
    // The person at the top of the leadership chart is selected to begin
    // with; hovering previews someone else, clicking selects them
    let selected = topI;
    const buttons = [...$("positions-view").querySelectorAll(".org-node")];
    const select = (i) => {
      selected = i;
      buttons.forEach((b) => b.classList.toggle("is-active", +b.dataset.i === i));
      show(nodes[i]);
      renderStepper();
    };
    // The arrows step through the boxes in reading order: the company, its
    // Trust and board, the leadership chart, then those who left
    stepNav = {
      count: buttons.length,
      index: () => buttons.findIndex((b) => +b.dataset.i === selected),
      el: (k) => buttons[k],
      go: (k) => {
        select(+buttons[k].dataset.i);
        revealInFrame(buttons[k]);
      },
    };
    buttons.forEach((b) => {
      const i = +b.dataset.i;
      b.addEventListener("mouseenter", () => show(nodes[i]));
      b.addEventListener("focus", () => show(nodes[i]));
      b.addEventListener("click", (e) => {
        select(i);
        if (e.isTrusted) scrollToDetail();
      });
    });
    $("positions-view").querySelector(".org-tree").addEventListener("mouseleave", () => show(nodes[selected]));
    // Each person counts once, though some sit on the board and lead too
    const people = uniquePeople(nodes.filter((n) => !n.company && !n.departed));
    const recorded = people.filter((n) => n.stance);
    $("positions-legend").innerHTML = ["ban", "pace", "oppose", "none"]
      .map((s) => [s, people.filter((n) => (n.stance || "none") === s).length])
      .filter(([, c]) => c)
      .map(([s, c]) => `<span class="lg-item" data-s="${s}"><span class="lg-swatch"></span>${esc(stanceLabel(s))} <span class="filter-count">${c}</span></span>`)
      .join("");
    select(topI);
    $("positions-notes").innerHTML = `<p>Public leadership only, grouped by area; boards as publicly listed. Reporting lines are approximate and roles may have changed; staff below leadership aren't listed.</p>`;
    $("positions-list").innerHTML = `
      <h3 class="pl-title">Recorded positions <span class="filter-count">${recorded.length} of ${people.length} ${people.length === 1 ? "person" : "people"}</span></h3>
      <ul class="pl-items">${recorded.map((n) => `
        <li class="pl-item" data-s="${n.stance}">
          <span class="pl-name is-static"><span class="pd-dot"></span>${esc(n.name)}</span>
          <span class="pl-meta">${esc(n.role)} · ${esc(stanceLabel(n.stance))}</span>
          <p class="pl-note">${esc(n.note || "")} ${n.source ? `<a class="tl-source" href="${esc(n.source.url)}" target="_blank" rel="noopener noreferrer">${esc(n.source.label)} ↗</a>` : ""}</p>
        </li>`).join("")}</ul>
      ${unrecordedIndustry(people.filter((n) => !n.stance), people.length)}`;
    applySearch();
  }
  // Everyone in the chart without a recorded position, in chart order
  function unrecordedIndustry(none, total) {
    if (!none.length) return "";
    return `
      <h3 class="pl-title">No recorded position <span class="filter-count">${none.length} of ${total} ${total === 1 ? "person" : "people"}</span></h3>
      <p class="pu-intro">None has been found yet for these people, which doesn't mean they have none.</p>
      <ul class="pu-items">${none.map((n) => `
        <li><span class="pu-name is-static">${esc(n.name)}<span class="pu-area">${esc(n.role)}${n.where ? ` · ${esc(n.where)}` : ""}</span></span></li>`).join("")}
      </ul>`;
  }

  // Company behaviour: notes from the data, then the incidents on this site
  // involving the lab's models — counted by category, with the latest few
  const CATEGORY_NAMES = { misalignment: "misalignment", misuse: "misuse", malfunction: "malfunction", misinformation: "misinformation", misbehaviour: "misbehaviour" };
  function positionBlock(lab) {
    return `
      <div class="org-company" data-s="${lab.stance}">
        <p class="org-company-label">Company position</p>
        <p class="pd-stance" data-s="${lab.stance}"><span class="pd-dot"></span>${esc(stanceLabel(lab.stance))}</p>
        <p class="pd-note">${esc(lab.note)} ${lab.source ? `<a class="tl-source" href="${esc(lab.source.url)}" target="_blank" rel="noopener noreferrer">${esc(lab.source.label)} ↗</a>` : ""}</p>
      </div>`;
  }
  const labIncidents = (lab) =>
    (window.CC_INCIDENTS || []).filter((i) => (i.orgs || []).includes(lab.org)).sort((a, b) => b.date.localeCompare(a.date));
  function behaviourBlock(lab) {
    const incidents = labIncidents(lab);
    const counts = {};
    incidents.forEach((i) => (counts[i.category] = (counts[i.category] || 0) + 1));
    const breakdown = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([c, n]) => `${n} ${CATEGORY_NAMES[c] || c}`)
      .join(", ");
    const notes = (lab.behaviour || [])
      .map((b) => `<li>${esc(b.note)} ${b.source ? `<a class="tl-source" href="${esc(b.source.url)}" target="_blank" rel="noopener noreferrer">${esc(b.source.label)} ↗</a>` : ""}</li>`)
      .join("");
    const latest = incidents.slice(0, 4)
      .map((i) => `<li><a href="#incidents" data-incident="${esc(i.id)}"><span class="cb-date">${esc(fmtDate(i.date))}</span>${esc(i.headline || i.title)}</a></li>`)
      .join("");
    return `
      <div class="org-company org-behaviour" data-s="${lab.stance}">
        <p class="org-company-label">Company behaviour</p>
        <p class="pd-stance" data-s="${lab.stance}"><span class="pd-dot"></span>${incidents.length} incident${incidents.length === 1 ? "" : "s"} on record</p>
        ${notes ? `<ul class="cb-notes">${notes}</ul>` : ""}
        <p class="pd-note">${incidents.length
          ? `Involving ${esc(lab.name)} models on this site: ${esc(breakdown)}. ${incidents.length === 1 ? "It is:" : "The latest:"}`
          : `No incidents on this site involve ${esc(lab.name)} models.`}</p>
        ${latest ? `<ul class="cb-incidents">${latest}</ul>` : ""}
      </div>`;
  }

  // Company evaluation: this site's cross-analysis of the lab's position
  // against its behaviour — a short verdict, then why
  function evaluationBlock(lab) {
    const e = lab.evaluation;
    if (!e) return "";
    return `
      <div class="org-company org-evaluation" data-s="${lab.stance}">
        <p class="org-company-label">Company evaluation</p>
        <p class="pd-stance ce-verdict" data-s="${lab.stance}"><span class="pd-dot"></span>${esc(e.verdict)}</p>
        <p class="pd-note">${esc(e.summary)}</p>
        <p class="ce-basis">Our assessment, comparing the company's position with its behaviour.</p>
      </div>`;
  }

  // ───────────── Pills and view switching
  function pills(el, options, current, onPick) {
    el.innerHTML = options
      .map(([v, label]) => `<button type="button" class="filter-pill" data-value="${esc(v)}" aria-pressed="${v === current}">${esc(label)}</button>`)
      .join("");
    el.onclick = (e) => {
      const b = e.target.closest(".filter-pill");
      if (b && b.dataset.value !== current) onPick(b.dataset.value);
    };
  }

  function render() {
    const g = GROUPS[state.group];
    const go = (group, body) => {
      state.group = group;
      state.body = body || GROUPS[group].bodies[0][0];
      state.selected = null;
      render();
    };
    const industry0 = state.group === "industry";
    const people = PEOPLE[state.group];
    // Tier 1: Industry, Governments, World leaders or Major actors
    pills($("positions-groups"), [["industry", "Industry"], ["gov", "Governments"], ["leaders", "World leaders"], ["actors", "Major actors"]],
      industry0 || people ? state.group : "gov", (v) => go(v));
    // Tier 2: a lab, or Overview / UK / US (none for the tables of people)
    $("positions-bodies").closest(".filter-row").hidden = !!people;
    $("positions-body-label").textContent = industry0 ? "Lab" : "Country";
    if (people) $("positions-bodies").innerHTML = "";
    else if (industry0) pills($("positions-bodies"), g.bodies, state.body, (v) => go("industry", v));
    else pills($("positions-bodies"), [["gov", "Overview"], ["uk", "UK"], ["us", "US"]], state.group, (v) => go(v));
    // Tier 3: the chamber, for UK or US
    const chamberRow = $("positions-chambers").closest(".filter-row");
    chamberRow.hidden = !(state.group === "uk" || state.group === "us");
    if (!chamberRow.hidden) pills($("positions-chambers"), g.bodies, state.body, (v) => go(state.group, v));
    // Heading for the chosen lab or chamber
    const bodyName = g.bodies.find(([k]) => k === state.body)[1];
    const overview = state.body === "overview";
    $("positions-title").textContent =
      people ? people
      : state.group === "gov" ? "Governments: all chambers"
      : state.group === "industry" ? (overview ? "Industry: all companies" : bodyName)
      : `${g.label} Government: ${bodyName}`;
    const industry = state.group === "industry";
    $("positions-tools").hidden = overview;
    $("positions-view").closest(".positions-main").classList.toggle("is-overview", overview);
    $("positions-tools").querySelector(".positions-mode").hidden = industry;
    $("positions-search").placeholder = industry ? "Find a person" : "Find a member or seat";
    stepNav = null;
    renderStepper();
    $("positions-desc").innerHTML = $("positions-notes").innerHTML = "";
    if (overview) clearBelow();
    if (people) return renderPeople(state.group);
    if (industry && overview) return renderIndustryOverview();
    if (industry) return renderIndustry();
    if (state.group === "gov" && members) return renderGovOverview();
    if (!members) {
      $("positions-view").innerHTML = `<p class="pd-hint">Loading members…</p>`;
      return loadMembers().then(render, (err) => {
        $("positions-view").innerHTML = `<p class="pd-hint">${esc(err.message)}</p>`;
      });
    }
    if (state.group === "gov") return renderGovOverview();
    renderChamber();
  }

  // ───────────── Overviews: a card per lab or chamber; each opens it
  function clearBelow() {
    ["positions-legend", "positions-detail", "positions-list"].forEach((id) => ($(id).innerHTML = ""));
  }
  const stanceLine = (s, text) => `<p class="pd-stance" data-s="${s}"><span class="pd-dot"></span>${esc(text)}</p>`;
  function bindOverview() {
    $("positions-view").querySelectorAll("[data-open]").forEach((c) =>
      c.addEventListener("click", () => {
        const [group, body] = c.dataset.open.split(":");
        state.group = group;
        state.body = body;
        state.selected = null;
        render();
        $("positions-title").scrollIntoView({ block: "start" });
        window.scrollBy(0, -120);
      })
    );
  }

  // Headline figures across the top of an overview
  // A proportion bar with its count, e.g. 3 / 9
  const shareBar = (n, total) =>
    `<span class="ov-share" title="${n} of ${total}"><span class="ov-track"><span class="ov-fill" style="width:${total ? Math.max(n ? 2 : 0, (n / total) * 100) : 0}%"></span></span><span class="ov-num">${n}<span class="ov-muted"> / ${total.toLocaleString()}</span></span></span>`;
  const findPerson = (n, name) => (n.name === name ? n : (n.children || []).map((c) => findPerson(c, name)).find(Boolean));

  const statStrip = (items) =>
    `<ul class="ov-stats">${items.map(([n, label, st]) => `<li${st ? ` data-s="${st}"` : ""}><strong>${n}</strong><span>${st ? '<span class="pd-dot"></span>' : ""}${esc(label)}</span></li>`).join("")}</ul>`;

  // Industry overview: a comparison table, one row per lab
  function renderIndustryOverview() {
    const labs = GROUPS.industry.bodies.filter(([k]) => k !== "overview").map(([k]) => [k, P.industry[k]]);
    const count = (st) => labs.filter(([, l]) => l.stance === st).length;
    const incidentsOf = labs.map(([, l]) => labIncidents(l).length);
    const maxIncidents = Math.max(1, ...incidentsOf);
    const anyLab = new Set(labs.map(([, l]) => l.org));
    const totalIncidents = (window.CC_INCIDENTS || []).filter((i) => (i.orgs || []).some((o) => anyLab.has(o))).length;
    // The executives in the labs' leadership charts, and their positions
    const executives = labs.flatMap(([, l]) => labPeople(l));
    const execCount = (st) => executives.filter((x) => x.stance === st).length;
    $("positions-view").classList.remove("is-chamber");
    $("positions-view").innerHTML = `
      ${statStrip([
        [labs.length, "frontier labs tracked"],
        [count("pace") + count("ban"), "with stated support for pacing or binding rules", "pace"],
        [count("oppose"), "with stated opposition to a slowdown", "oppose"],
        [totalIncidents, "incidents involving their models"],
      ])}
      ${statStrip([
        [executives.length, "leaders and board members tracked"],
        [execCount("pace") + execCount("ban"), "with stated support for pacing or binding rules", "pace"],
        [execCount("oppose"), "with stated opposition to a slowdown", "oppose"],
        [uniquePeople(labs.flatMap(([, l]) => l.departed || [])).length, "former staff who left over safety or risk concerns"],
      ])}
      <div class="ov-table ov-industry" role="table" aria-label="Frontier labs compared">
        <div class="ov-head" role="row">
          <span role="columnheader">Company</span><span role="columnheader">CEO</span><span role="columnheader">Position</span><span role="columnheader">Evaluation</span><span role="columnheader">Recorded positions</span><span role="columnheader">Incidents</span>
        </div>
        ${labs.map(([k, lab], idx) => {
          const n = incidentsOf[idx];
          const everyone = labPeople(lab);
          const ceo = findPerson(lab.chart, lab.ceo);
          return `
          <button type="button" class="ov-row" role="row" data-open="industry:${k}" data-s="${lab.stance}">
            <span class="ov-cell ov-name" role="cell">${labLogo(k)}${esc(lab.name)}</span>
            <span class="ov-cell ov-pos" role="cell">${ceo ? `<span class="pd-dot" data-s="${ceo.stance || "none"}"></span><span>${esc(ceo.name)}</span>` : "—"}</span>
            <span class="ov-cell ov-pos" role="cell"><span class="pd-dot"></span><span>${esc(stanceLabel(lab.stance))}</span></span>
            <span class="ov-cell ov-verdict" role="cell">${lab.evaluation ? esc(lab.evaluation.verdict) : "—"}</span>
            <span class="ov-cell" role="cell">${shareBar(everyone.filter((x) => x.stance).length, everyone.length)}</span>
            <span class="ov-cell ov-bar" role="cell" title="${n} incident${n === 1 ? "" : "s"} on record"><span class="ov-bar-fill" style="width:${(n / maxIncidents) * 100}%"></span><span class="ov-num">${n}</span></span>
            <span class="ov-arrow" aria-hidden="true">→</span>
          </button>`;
        }).join("")}
      </div>`;
    bindOverview();
    $("positions-notes").innerHTML = `<p>CEO: the lab's own chief executive (at Google DeepMind, its head), coloured by their recorded position. Recorded positions: how many of the people in its chart (leadership and board) have one. Incidents: those on this site involving each lab's models (the bar is scaled to the most). Select a company to see its chart.</p>`;
  }

  // A lab's mark, in the text colour (data/lab-logos.js)
  const labLogo = (k) => {
    const paths = (window.CC_LAB_LOGOS || {})[k];
    return paths ? `<svg class="ov-logo" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" fill-rule="evenodd">${paths.map((d) => `<path d="${d}"/>`).join("")}</svg>` : "";
  };

  // World leaders and major actors: a table of people, grouped by position
  // (support for a ban, then pacing, then neither, then opposition), each
  // with what they said and its source
  function renderPeople(kind) {
    const list = P[kind] || [];
    const ORDER = ["ban", "pace", "none", "oppose"];
    const LABEL = { ...P.stances, none: "No stated position on a slowdown" };
    const st = (x) => x.stance || "none";
    const sorted = list.slice().sort((a, b) => ORDER.indexOf(st(a)) - ORDER.indexOf(st(b)) || (b.date || "").localeCompare(a.date || ""));
    const n = (s) => list.filter((x) => st(x) === s).length;
    const sources = (x) => [].concat(x.source || []).map((s) => `<a class="tl-source" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)} ↗</a>`).join("");
    $("positions-view").classList.remove("is-chamber");
    $("positions-view").innerHTML = `
      ${statStrip([
        [list.length, kind === "leaders" ? "leaders tracked" : "actors tracked"],
        [n("ban"), "with stated support for a ban or pause", "ban"],
        [n("pace"), "with stated support for pacing or binding rules", "pace"],
        [n("oppose"), "with stated opposition to a slowdown or new rules", "oppose"],
      ])}
      <div class="ov-table ov-people" role="table" aria-label="${esc(PEOPLE[kind])} and their positions">
        <div class="ov-head" role="row">
          <span role="columnheader">${kind === "leaders" ? "Leader" : "Actor"}</span><span role="columnheader">Position</span><span role="columnheader">What they said or did</span>
        </div>
        ${sorted.map((x) => `
          <div class="ov-row" role="row" data-s="${st(x)}">
            <span class="ov-cell ov-name" role="cell"><span>${esc(x.name)}<span class="ov-role">${esc(x.role)}</span></span></span>
            <span class="ov-cell ov-pos" role="cell"><span class="pd-dot"></span><span>${esc(LABEL[st(x)])}</span></span>
            <span class="ov-cell ov-said" role="cell"><span class="pd-date">${esc(fmtDate(x.date))}</span> ${esc(x.note)}<span class="ov-sources">${sources(x)}</span></span>
          </div>`).join("")}
      </div>`;
    $("positions-desc").innerHTML = kind === "leaders"
      ? `<p>Heads of state and government, and the leaders of the UN and the European Commission, by what they have said or signed about slowing or governing frontier AI. Positions are as recorded on the date shown.</p>`
      : `<p>Influential people outside the labs' leadership and the legislatures: the heads of other technology companies, scientists, investors and public figures. People who lead the frontier labs are under Industry.</p>`;
  }

  // Governments overview: a table, one row per chamber
  function renderGovOverview() {
    $("positions-view").classList.remove("is-chamber");
    const total = { members: 0, ban: 0, pace: 0, oppose: 0 };
    const order = { ban: 0, pace: 1, oppose: 2 };
    const rows = CHAMBERS.map(([group, key, country, name]) => {
      const list = members[key];
      const recorded = list.filter((m) => m.position).sort((a, b) => order[a.position.stance] - order[b.position.stance]);
      total.members += list.length;
      recorded.forEach((m) => total[m.position.stance]++);
      const featured = list.find((m) => m.id === (P.featured || {})[key]);
      const lead = recorded[0] ? recorded[0].position.stance : "none";
      return `
        <button type="button" class="ov-row" role="row" data-open="${group}:${key}" data-s="${lead}">
          <span class="ov-cell ov-name" role="cell"><span class="ov-country">${esc(country)}</span>${esc(name)}</span>
          <span class="ov-cell" role="cell">${shareBar(recorded.length, list.length)}</span>
          <span class="ov-cell" role="cell">${featured ? esc(featured.name) : '<span class="ov-muted">—</span>'}</span>
          <span class="ov-arrow" aria-hidden="true">→</span>
        </button>`;
    }).join("");
    $("positions-view").innerHTML = `
      ${statStrip([
        [total.members.toLocaleString(), "legislators in four chambers"],
        [total.ban + total.pace + total.oppose, "with a recorded position"],
        [total.ban, "with stated support for a ban or pause", "ban"],
        [total.pace, "with stated support for pacing or binding rules", "pace"],
      ])}
      <div class="ov-table ov-gov" role="table" aria-label="Chambers compared">
        <div class="ov-head" role="row">
          <span role="columnheader">Chamber</span><span role="columnheader">Recorded positions</span><span role="columnheader">Leading advocate</span>
        </div>
        ${rows}
      </div>`;
    bindOverview();
    $("positions-notes").innerHTML = `<p>Recorded positions: how many of each chamber's members have one, out of all its members. “No recorded position” means none has been found yet, not that a member has none. Select a chamber to see every member's seat.</p>`;
  }

  function init() {
    if (state.loaded) return;
    state.loaded = true;
    $("positions-search").addEventListener("input", applySearch);
    $("positions-search").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const hit = $("positions-view").querySelector(".seat.is-match, .org-node.is-match");
        if (hit) {
          if (hit.classList.contains("seat")) state.selected = +hit.dataset.i;
          hit.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        }
      }
    });
    $("positions-tools").querySelectorAll("[data-mode]").forEach((b) =>
      b.addEventListener("click", () => {
        state.mode = b.dataset.mode;
        $("positions-tools").querySelectorAll("[data-mode]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        const svg = $("positions-view").querySelector("svg.chamber");
        if (svg) svg.setAttribute("class", `chamber by-${state.mode}`);
        if (state.group !== "industry") renderLegend();
      })
    );
    $("positions-step").querySelectorAll("[data-step]").forEach((b) => b.addEventListener("click", () => step(+b.dataset.step)));
    // Arrow keys move through the diagram by position: to the nearest box or
    // seat in that direction (← and →, where there's none, step on in
    // order). ↑ and ↓ only do so while the diagram is on screen, so they
    // still scroll the page otherwise.
    const DIRS = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    document.addEventListener("keydown", (e) => {
      const d = DIRS[e.key];
      if (!d || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || !stepNav || $("page-positions").hidden) return;
      const t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (d[1]) {
        const v = $("positions-view").getBoundingClientRect();
        if (v.bottom < 80 || v.top > window.innerHeight - 80) return;
      }
      e.preventDefault();
      const k = stepNav.index();
      const next = k < 0 ? -1 : nearest(k, d);
      if (next >= 0) stepNav.go(next);
      else if (!d[1]) step(d[0]);
    });
    // The index of the nearest box or seat from item k in direction d:
    // closest along that direction, with sideways drift counting extra
    function nearest(k, [dx, dy]) {
      const centre = (el) => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
      const from = stepNav.el(k);
      if (!from) return -1;
      const [x0, y0] = centre(from);
      let best = -1, bestScore = Infinity;
      for (let j = 0; j < stepNav.count; j++) {
        if (j === k) continue;
        const el = stepNav.el(j);
        if (!el) continue;
        const [x, y] = centre(el);
        const along = (x - x0) * dx + (y - y0) * dy;
        if (along < 2) continue;
        const across = Math.abs((x - x0) * dy) + Math.abs((y - y0) * dx);
        const score = along + across * 2.5;
        if (score < bestScore) { bestScore = score; best = j; }
      }
      return best;
    }
    render();
    // Load the member lists in the background so the chambers open instantly
    loadMembers().catch(() => {});
  }

  document.addEventListener("cc:pageshow", (e) => {
    if (e.detail.page === "positions") init();
  });
})();
