/* Site Map page: every page in menu order, as a card with its number, what
   it holds and the sections inside it. Each card opens its page. Figures
   come from the site's data, so they stay current. */
(function () {
  "use strict";

  const list = document.getElementById("sitemap-list");
  if (!list) return;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const n = (a) => (a || []).length;
  const W = window;
  const A = W.CC_ACTORS || {};
  const P = W.CC_POSITIONS || {};

  // What each page holds, and the sections inside it
  const PAGES = {
    positions: {
      about: "Where AI labs and legislators stand on a coordinated slowdown and existential risk from AI.",
      parts: ["Industry: an overview, then the leadership, board and departures of Anthropic, OpenAI, Google DeepMind, Meta and xAI",
        "Governments: an overview, then every member of the UK House of Commons and House of Lords and the US Senate and House"],
    },
    race: {
      about: "The race to build ever more capable AI, drawn as a track with a lane for each lab and state.",
      parts: [`Frontier AI releases (${n((W.CC_RACE || {}).events && W.CC_RACE.events.filter((e) => (W.CC_RACE.lanes[e.lane] || {}).category === "releases"))})`,
        `Inter-state competition signals (${n((W.CC_RACE || {}).events && W.CC_RACE.events.filter((e) => (W.CC_RACE.lanes[e.lane] || {}).category === "states"))})`],
    },
    incidents: {
      about: `${n(W.CC_INCIDENTS)} incidents of loss of control, unintended behaviour and AI cyberattacks, as a matrix of incidents by developer.`,
      parts: ["By category: misalignment, misuse, malfunction, misinformation and misbehaviour", "By developer"],
    },
    milestones: {
      about: `${n(W.CC_MILESTONES)} of the most significant moments in the story of AI risk, on an annotated timeline.`,
      parts: (W.CC_MILESTONES || []).slice().reverse().slice(0, 4).map((m) => m.title).concat(n(W.CC_MILESTONES) > 4 ? ["…and more, from 1951 on"] : []),
    },
    actors: {
      about: "The people and institutions shaping AI risk and its governance.",
      parts: [`Individuals (${n(A.individuals)}): governance advocates, policymakers, lab leaders, research scientists and academics`,
        `Institutions (${n(A.institutions)}): advocacy, research, government and labs, on a world map`],
    },
    statements: {
      about: `${n(W.CC_STATEMENTS)} statements, letters, declarations and treaties on AI and its risks.`,
      parts: ["Main", "Academic", "Governmental", "Religious"],
    },
    materials: {
      about: `${n(W.CC_MATERIALS)} scenarios, essays and books on how advanced AI could unfold.`,
      parts: ["Scenarios", "Essays", "Books"],
    },
    glossary: {
      about: `${n(W.CC_GLOSSARY)} terms used across the site, in plain language.`,
      parts: ["Capabilities", "Risks", "Safety research", "Governance"],
    },
    companions: {
      about: `${n(W.CC_COMPANIONS)} other websites worth following.`,
      parts: ["Guides and courses", "Trackers and data", "Research and discussion", "Newsletters"],
    },
    coordinate: {
      about: "How to take part in a coordinated slowdown: where to start, whoever you are.",
      parts: [],
    },
    contact: {
      about: "Send corrections, sources and suggestions.",
      parts: [],
    },
  };

  // Menu order and numbers, from the menu itself
  const items = [...document.querySelectorAll(".menu a[data-page]")]
    .map((a) => ({ page: a.dataset.page, num: (a.querySelector(".menu-num") || {}).textContent || "", name: a.textContent.replace(/^\s*\d+\s*/, "").trim() }))
    .filter((x) => PAGES[x.page]);

  list.innerHTML = items.map((x) => `
    <li class="sm-card">
      <a class="sm-link" href="#${esc(x.page)}" data-goto="${esc(x.page)}">
        <span class="sm-num">${esc(x.num)}</span>
        <span class="sm-name">${esc(x.name)} <span class="sm-arrow" aria-hidden="true">→</span></span>
      </a>
      <p class="sm-about">${esc(PAGES[x.page].about)}</p>
      ${PAGES[x.page].parts.length ? `<ul class="sm-parts">${PAGES[x.page].parts.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
    </li>`).join("");
})();
