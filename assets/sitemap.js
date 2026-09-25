/* Site Map page: every page in menu order as a tile in a bento grid, each
   with a small drawing in the manner of the page it opens (a hemicycle and
   chart for Positions, the lanes of the Race, the Incidents matrix, the
   Milestones ribbon, the Actors map…), drawn from the site's own data so
   they stay current. Each tile opens its page. */
(function () {
  "use strict";

  const list = document.getElementById("sitemap-list");
  if (!list) return;
  const W = window;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const n = (a) => (a || []).length;
  const A = W.CC_ACTORS || {};
  const f1 = (x) => (Math.round(x * 10) / 10).toString();
  const svg = (w, h, body, label) => `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"${label ? "" : ""}>${body}</svg>`;
  const year = (d) => { const [y, m = 7, day = 1] = String(d).split("-").map(Number); return y + (m - 1) / 12 + (day - 1) / 365; };

  // ───────────── A drawing for each page
  const DRAW = {
    // A hemicycle of seats (a few with a recorded position) beside a small
    // leadership chart
    positions() {
      let seats = "";
      const cx = 150, cy = 150, rows = 6;
      for (let r = 0; r < rows; r++) {
        const rad = 60 + r * 15, count = 14 + r * 4;
        for (let i = 0; i < count; i++) {
          const a = Math.PI - (i / (count - 1)) * Math.PI;
          const lit = (r * 7 + i * 3) % 23 === 0 ? "v-acc" : (r + i) % 17 === 0 ? "v-ink" : "v-seat";
          seats += `<circle class="${lit}" cx="${f1(cx + rad * Math.cos(a))}" cy="${f1(cy - rad * Math.sin(a))}" r="4"/>`;
        }
      }
      const box = (x, y, cls) => `<rect class="${cls}" x="${x - 26}" y="${y - 11}" width="52" height="22" rx="5"/>`;
      const tree = `
        <path class="v-line" d="M470 36 V56 M400 56 H540 M400 56 V70 M470 56 V70 M540 56 V70 M470 92 V106 M440 106 H500 M440 106 V118 M500 106 V118" fill="none"/>
        ${box(470, 25, "v-box-acc")}${box(400, 81, "v-box")}${box(470, 81, "v-box-acc")}${box(540, 81, "v-box")}${box(440, 129, "v-box")}${box(500, 129, "v-box-acc")}`;
      return svg(600, 160, seats + tree);
    },
    // Lanes, with the releases (circles) and states' moves (diamonds) of the
    // Race, fading into the future at the right
    race() {
      const R = W.CC_RACE || { lanes: {}, events: [] };
      const lanes = Object.keys(R.lanes);
      const t0 = year(R.start || "2022-09"), t1 = year(R.now || "2026-09");
      const w = 600, h = 160, top = 14, lh = (h - 2 * top) / Math.max(1, lanes.length), x0 = 10, x1 = 520;
      let out = `<defs><linearGradient id="sm-fade" x1="0" x2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity="0.25"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
        <rect x="${x1}" y="${top}" width="${w - x1}" height="${h - 2 * top}" fill="url(#sm-fade)"/>
        <line class="v-acc-line" x1="${x1}" y1="${top}" x2="${x1}" y2="${h - top}"/>`;
      lanes.forEach((k, i) => { const y = top + lh * (i + 0.5); out += `<line class="v-line" x1="${x0}" y1="${f1(y)}" x2="${w}" y2="${f1(y)}"/>`; });
      R.events.forEach((e) => {
        const i = lanes.indexOf(e.lane), y = top + lh * (i + 0.5), x = x0 + ((year(e.date) - t0) / (t1 - t0)) * (x1 - x0);
        out += R.lanes[e.lane].category === "states"
          ? `<rect class="v-ink" x="${f1(x - 4)}" y="${f1(y - 4)}" width="8" height="8" transform="rotate(45 ${f1(x)} ${f1(y)})"/>`
          : `<circle class="v-acc" cx="${f1(x)}" cy="${f1(y)}" r="4.5"/>`;
      });
      return svg(w, h, out);
    },
    // The Incidents matrix: a column per incident, a row per developer, the
    // involved developers joined by a line
    incidents() {
      const items = (W.CC_INCIDENTS || []).slice().sort((a, b) => String(a.date).localeCompare(String(b.date)));
      const count = new Map();
      items.forEach((i) => i.orgs.forEach((o) => count.set(o, (count.get(o) || 0) + 1)));
      const orgs = [...count].sort((a, b) => (a[0] === "Other") - (b[0] === "Other") || b[1] - a[1]).map(([o]) => o);
      const w = 600, h = 160, cw = w / Math.max(1, items.length), rh = (h - 16) / Math.max(1, orgs.length);
      let out = orgs.map((o, r) => `<line class="v-line" x1="0" y1="${f1(8 + rh * r)}" x2="${w}" y2="${f1(8 + rh * r)}"/>`).join("");
      items.forEach((i, k) => {
        const x = cw * (k + 0.5), ys = i.orgs.map((o) => 8 + rh * (orgs.indexOf(o) + 0.5)).sort((a, b) => a - b);
        const cls = i.category === "misalignment" ? "v-acc" : i.category === "misuse" ? "v-ink" : "v-mute";
        if (ys.length > 1) out += `<line class="${cls}-line" x1="${f1(x)}" y1="${f1(ys[0])}" x2="${f1(x)}" y2="${f1(ys[ys.length - 1])}"/>`;
        ys.forEach((y) => {
          out += i.type === "control" ? `<rect class="${cls}" x="${f1(x - 4)}" y="${f1(y - 4)}" width="8" height="8" rx="1"/>`
            : i.type === "cyber" ? `<rect class="${cls}" x="${f1(x - 3.5)}" y="${f1(y - 3.5)}" width="7" height="7" transform="rotate(45 ${f1(x)} ${f1(y)})"/>`
            : `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="4"/>`;
        });
      });
      return svg(w, h, out);
    },
    // The Milestones ribbon: early warnings, a break, the 2020s; dots
    // stacking on stems where they crowd
    milestones() {
      const M = W.CC_MILESTONES || [];
      const w = 600, h = 160, ly = 112, ew = 90, gap = 30;
      const at = (d) => { const y = year(d); return y < 2000 ? 12 + ((y - 1945) / 20) * ew : 12 + ew + gap + ((y - 2020) / 7) * (w - 24 - ew - gap); };
      let out = `<line class="v-line" x1="12" y1="${ly}" x2="${12 + ew}" y2="${ly}"/><line class="v-dots" x1="${16 + ew}" y1="${ly}" x2="${8 + ew + gap}" y2="${ly}"/><line class="v-line" x1="${12 + ew + gap}" y1="${ly}" x2="${w - 12}" y2="${ly}"/>`;
      const levels = [];
      M.forEach((m, i) => {
        const x = at(m.date);
        let lv = levels.findIndex((l) => x - l >= 20);
        if (lv < 0) lv = levels.length;
        levels[lv] = x;
        const y = ly - lv * 24;
        if (lv) out += `<line class="v-acc-line" x1="${f1(x)}" y1="${f1(y)}" x2="${f1(x)}" y2="${ly}"/>`;
        out += `<circle class="v-acc" cx="${f1(x)}" cy="${f1(y)}" r="9"/><text class="v-num" x="${f1(x)}" y="${f1(y + 3)}">${String(i + 1).padStart(2, "0")}</text>`;
        out += `<line class="v-lead" x1="${f1(x)}" y1="${ly + 6}" x2="${f1(x)}" y2="${ly + 22 + (i % 3) * 8}"/>`;
      });
      return svg(w, h, out);
    },
    // The world map with a pin for each institution
    actors() {
      const G = W.CC_WORLD;
      if (!G) return "";
      const k = G.width / 360;
      const pins = (A.institutions || []).map((x) => `<circle class="v-pin" cx="${f1((x.at[1] + 180) * k)}" cy="${f1((G.top - x.at[0]) * k)}" r="9"/>`).join("");
      return `<svg viewBox="0 0 ${G.width} ${G.height}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"><path class="v-land" d="${G.land}"/>${pins}</svg>`;
    },
    // A timeline: a spine, dated dots and lines of text
    statements() {
      let out = `<line class="v-line" x1="40" y1="10" x2="40" y2="150"/>`;
      [0, 1, 2, 3, 4].forEach((i) => {
        const y = 22 + i * 28;
        out += `<circle class="${i === 0 ? "v-acc" : "v-ink"}" cx="40" cy="${y}" r="5"/><rect class="v-mute" x="60" y="${y - 7}" width="${[150, 190, 120, 170, 140][i]}" height="5" rx="2.5"/><rect class="v-seat" x="60" y="${y + 2}" width="${[220, 160, 200, 120, 180][i]}" height="4" rx="2"/>`;
      });
      return svg(300, 160, out);
    },
    // A shelf: book spines, then two leaves of paper
    materials() {
      const books = Math.max(4, n((W.CC_MATERIALS || []).filter((m) => m.category === "book")));
      let out = `<line class="v-line" x1="14" y1="146" x2="286" y2="146"/>`;
      let x = 20;
      for (let i = 0; i < books; i++) {
        const h = 70 + ((i * 37) % 45), wdt = 14 + ((i * 7) % 8);
        out += `<rect class="${i === 1 ? "v-acc" : i % 2 ? "v-box" : "v-box-acc"}" x="${x}" y="${146 - h}" width="${wdt}" height="${h}" rx="2"/>`;
        x += wdt + 4;
      }
      out += `<rect class="v-box" x="${x + 24}" y="36" width="70" height="110" rx="4" transform="rotate(-6 ${x + 59} 91)"/><rect class="v-paper" x="${x + 30}" y="30" width="70" height="116" rx="4"/>`;
      [0, 1, 2, 3, 4, 5].forEach((i) => { out += `<rect class="v-seat" x="${x + 40}" y="${46 + i * 14}" width="${[50, 40, 46, 30, 44, 36][i]}" height="4" rx="2"/>`; });
      return svg(300, 160, out);
    },
    // Letters, each with its definitions
    glossary() {
      let out = "";
      ["A", "B", "C"].forEach((l, i) => {
        const y = 22 + i * 46;
        out += `<text class="v-letter" x="20" y="${y + 26}">${l}</text><line class="v-line" x1="70" y1="${y - 4}" x2="286" y2="${y - 4}"/><rect class="v-mute" x="70" y="${y + 6}" width="${[90, 120, 70][i]}" height="6" rx="3"/><rect class="v-seat" x="70" y="${y + 18}" width="${[200, 170, 190][i]}" height="4" rx="2"/>`;
      });
      return svg(300, 160, out);
    },
    // A cluster of sites, each pointing out
    companions() {
      let out = "";
      for (let i = 0; i < 6; i++) {
        const x = 18 + (i % 3) * 92, y = 18 + Math.floor(i / 3) * 66;
        out += `<rect class="${i === 0 ? "v-box-acc" : "v-box"}" x="${x}" y="${y}" width="80" height="52" rx="8"/><rect class="v-mute" x="${x + 10}" y="${y + 12}" width="${[44, 36, 50, 30, 40, 46][i]}" height="5" rx="2.5"/><path class="v-arrow" d="M${x + 56} ${y + 38} l10 -10 m-7 0 h7 v7" fill="none"/>`;
      }
      return svg(300, 160, out);
    },
    // Numbered steps along a path
    coordinate() {
      let out = `<path class="v-line" d="M40 40 C120 40 110 120 190 120 S260 60 270 60" fill="none"/>`;
      [[40, 40], [150, 96], [270, 60]].forEach(([x, y], i) => {
        out += `<circle class="${i === 0 ? "v-acc" : "v-box"}" cx="${x}" cy="${y}" r="16"/><text class="v-step${i === 0 ? " is-on" : ""}" x="${x}" y="${y + 5}">${i + 1}</text>`;
      });
      return svg(300, 160, out);
    },
    // A form: fields and a send button
    contact() {
      return svg(300, 160, `
        <rect class="v-box" x="20" y="20" width="124" height="26" rx="6"/><rect class="v-box" x="156" y="20" width="124" height="26" rx="6"/>
        <rect class="v-box" x="20" y="58" width="260" height="56" rx="6"/>
        <rect class="v-seat" x="32" y="72" width="150" height="4" rx="2"/><rect class="v-seat" x="32" y="84" width="110" height="4" rx="2"/>
        <rect class="v-acc" x="20" y="126" width="84" height="24" rx="12"/><path class="v-send" d="M52 138 h20 m-6 -6 l6 6 l-6 6" fill="none"/>`);
    },
  };

  // What each page holds, the sections inside it, and its tile's size
  const PAGES = {
    positions: { size: "lg", about: "Where AI labs and legislators stand on a coordinated slowdown and existential risk from AI.",
      parts: ["Industry: the leadership, boards and departures of five labs", "Governments: every member of four chambers, UK and US"] },
    race: { size: "lg", about: "The race to build ever more capable AI, drawn as a track with a lane for each lab and state.",
      parts: [`${n((W.CC_RACE || {}).events)} frontier releases and inter-state competition signals`] },
    incidents: { size: "lg", about: `${n(W.CC_INCIDENTS)} incidents of loss of control, unintended behaviour and AI cyberattacks, by developer.`,
      parts: ["By category and by developer"] },
    milestones: { size: "lg", about: `${n(W.CC_MILESTONES)} of the most significant moments in the story of AI risk.`,
      parts: ["From Turing's warnings to the push to ban superintelligence"] },
    actors: { size: "md", about: "The people and institutions shaping AI risk and its governance.",
      parts: [`${n(A.individuals)} individuals`, `${n(A.institutions)} institutions, on a world map`] },
    statements: { size: "md", about: `${n(W.CC_STATEMENTS)} statements, letters, declarations and treaties on AI and its risks.`,
      parts: ["Main, academic, governmental and religious"] },
    materials: { size: "md", about: `${n(W.CC_MATERIALS)} scenarios, essays and books on how advanced AI could unfold.`,
      parts: ["Scenarios, essays and books"] },
    glossary: { size: "md", about: `${n(W.CC_GLOSSARY)} terms used across the site, in plain language.`,
      parts: ["Capabilities, risks, safety research and governance"] },
    companions: { size: "md", about: `${n(W.CC_COMPANIONS)} other websites worth following.`,
      parts: ["Guides, trackers, research and newsletters"] },
    coordinate: { size: "md", about: "How to take part in a coordinated slowdown, whoever you are.", parts: [] },
    contact: { size: "wide", about: "Corrections, sources and suggestions are welcome.", parts: [] },
  };

  // Menu order and numbers, from the menu itself
  const items = [...document.querySelectorAll(".menu a[data-page]")]
    .map((a) => ({ page: a.dataset.page, num: (a.querySelector(".menu-num") || {}).textContent || "", name: a.textContent.replace(/^\s*\d+\s*/, "").trim() }))
    .filter((x) => PAGES[x.page]);

  list.innerHTML = items.map((x) => {
    const p = PAGES[x.page];
    return `
    <li class="sm-tile sm-${p.size}" data-page="${esc(x.page)}">
      <a class="sm-link" href="#${esc(x.page)}" data-goto="${esc(x.page)}" aria-label="${esc(x.name)}: ${esc(p.about)}">
        <span class="sm-art">${DRAW[x.page] ? DRAW[x.page]() : ""}</span>
        <span class="sm-text">
          <span class="sm-head"><span class="sm-num">${esc(x.num)}</span><span class="sm-name">${esc(x.name)}</span><span class="sm-arrow" aria-hidden="true">→</span></span>
          <span class="sm-about">${esc(p.about)}</span>
          ${p.parts.length ? `<span class="sm-parts">${p.parts.map((t) => `<span>${esc(t)}</span>`).join("")}</span>` : ""}
        </span>
      </a>
    </li>`;
  }).join("");
})();
