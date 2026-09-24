/* Positions page: chamber seating diagrams (UK Commons and Lords, US Senate
   and House) with every current member, and leadership charts for the AI
   labs, each coloured by documented position on a coordinated slowdown.
   Data: data/positions.js (recorded positions and lab charts) and the member
   lists in data/members-*.js, loaded the first time the page opens. */
(function () {
  "use strict";

  const P = window.CC_POSITIONS;
  if (!P) return;

  const GROUPS = {
    industry: { label: "Industry", bodyLabel: "Lab", bodies: [["anthropic", "Anthropic"], ["openai", "OpenAI"], ["deepmind", "Google DeepMind"], ["meta", "Meta"], ["xai", "xAI"]] },
    uk: { label: "UK", bodyLabel: "Chamber", bodies: [["commons", "House of Commons"], ["lords", "House of Lords"]] },
    us: { label: "US", bodyLabel: "Chamber", bodies: [["senate", "Senate"], ["house", "House of Representatives"]] },
  };

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

  const state = { group: "industry", body: "anthropic", mode: "position", selected: null, loaded: false };
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
    showHint();
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
  }
  function showHint() {
    $("positions-detail").innerHTML = `<p class="pd-hint">Hover over or tap a seat to see who sits there.</p>`;
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
        .join("")}</ul>` : `<p class="pl-empty">None recorded yet.</p>`}`;
    $("positions-list").querySelectorAll(".pl-name").forEach((b) =>
      b.addEventListener("click", () => {
        state.selected = +b.dataset.i;
        showMember(seats[state.selected], state.selected);
        $("positions-view").scrollIntoView({ block: "center" });
      })
    );
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

  // ───────────── Industry: leadership chart as a nested tree
  function renderIndustry() {
    const lab = P.industry[state.body];
    const nodes = [];
    const node = (n) => {
      const i = nodes.push(n) - 1;
      return `<li>
        <button type="button" class="org-node" data-i="${i}" data-s="${n.stance || "none"}">
          <span class="org-name"><span class="pd-dot"></span>${esc(n.name)}</span>
          <span class="org-role">${esc(n.role)}</span>
        </button>
        ${n.children && n.children.length ? `<ul>${n.children.map(node).join("")}</ul>` : ""}
      </li>`;
    };
    $("positions-view").classList.remove("is-chamber");
    $("positions-view").innerHTML = `
      <div class="org-company" data-s="${lab.stance}">
        <p class="org-company-label">Company position</p>
        <p class="pd-stance" data-s="${lab.stance}"><span class="pd-dot"></span>${esc(stanceLabel(lab.stance))}</p>
        <p class="pd-note">${esc(lab.note)} ${lab.source ? `<a class="tl-source" href="${esc(lab.source.url)}" target="_blank" rel="noopener noreferrer">${esc(lab.source.label)} ↗</a>` : ""}</p>
      </div>
      <div class="org-scroll"><ul class="org-tree">${node(lab.chart)}</ul></div>`;
    const show = (n) => {
      $("positions-detail").innerHTML = `
        <div class="pd-card">
          <p class="pd-name">${esc(n.name)}</p>
          <p class="pd-meta">${esc(n.role)}, ${esc(lab.name)}</p>
          <p class="pd-stance" data-s="${n.stance || "none"}"><span class="pd-dot"></span>${esc(stanceLabel(n.stance))}</p>
          ${n.note ? `<p class="pd-note">${esc(n.note)}</p>` : ""}
          ${n.source ? `<a class="tl-source" href="${esc(n.source.url)}" target="_blank" rel="noopener noreferrer">Source: ${esc(n.source.label)} ↗</a>` : ""}
        </div>`;
    };
    // The person at the top of the chart is selected to begin with;
    // hovering previews someone else, clicking selects them
    let selected = 0;
    const buttons = [...$("positions-view").querySelectorAll(".org-node")];
    const select = (i) => {
      selected = i;
      buttons.forEach((b) => b.classList.toggle("is-active", +b.dataset.i === i));
      show(nodes[i]);
    };
    buttons.forEach((b) => {
      const i = +b.dataset.i;
      b.addEventListener("mouseenter", () => show(nodes[i]));
      b.addEventListener("focus", () => show(nodes[i]));
      b.addEventListener("click", () => select(i));
    });
    $("positions-view").querySelector(".org-tree").addEventListener("mouseleave", () => show(nodes[selected]));
    const recorded = nodes.filter((n) => n.stance);
    $("positions-legend").innerHTML = ["ban", "pace", "oppose", "none"]
      .map((s) => [s, nodes.filter((n) => (n.stance || "none") === s).length])
      .filter(([, c]) => c)
      .map(([s, c]) => `<span class="lg-item" data-s="${s}"><span class="lg-swatch"></span>${esc(stanceLabel(s))} <span class="filter-count">${c}</span></span>`)
      .join("");
    select(0);
    $("positions-notes").innerHTML = `<p>Public leadership only, grouped by area; reporting lines are approximate and roles may have changed. Staff below leadership aren't listed.</p>`;
    $("positions-list").innerHTML = `
      <h3 class="pl-title">Recorded positions <span class="filter-count">${recorded.length} of ${nodes.length} people</span></h3>
      <ul class="pl-items">${recorded.map((n) => `
        <li class="pl-item" data-s="${n.stance}">
          <span class="pl-name is-static"><span class="pd-dot"></span>${esc(n.name)}</span>
          <span class="pl-meta">${esc(n.role)} · ${esc(stanceLabel(n.stance))}</span>
          <p class="pl-note">${esc(n.note || "")} ${n.source ? `<a class="tl-source" href="${esc(n.source.url)}" target="_blank" rel="noopener noreferrer">${esc(n.source.label)} ↗</a>` : ""}</p>
        </li>`).join("")}</ul>`;
    applySearch();
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
    pills($("positions-groups"), Object.entries(GROUPS).map(([k, v]) => [k, v.label]), state.group, (v) => {
      state.group = v;
      state.body = GROUPS[v].bodies[0][0];
      state.selected = null;
      render();
    });
    $("positions-body-label").textContent = g.bodyLabel;
    pills($("positions-bodies"), g.bodies, state.body, (v) => {
      state.body = v;
      state.selected = null;
      render();
    });
    const industry = state.group === "industry";
    $("positions-tools").querySelector(".positions-mode").hidden = industry;
    $("positions-search").placeholder = industry ? "Find a person" : "Find a member or seat";
    if (industry) return renderIndustry();
    if (!members) {
      $("positions-view").innerHTML = `<p class="pd-hint">Loading members…</p>`;
      return loadMembers().then(render, (err) => {
        $("positions-view").innerHTML = `<p class="pd-hint">${esc(err.message)}</p>`;
      });
    }
    renderChamber();
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
    render();
    // Load the member lists in the background so the chambers open instantly
    loadMembers().catch(() => {});
  }

  document.addEventListener("cc:pageshow", (e) => {
    if (e.detail.page === "positions") init();
  });
})();
