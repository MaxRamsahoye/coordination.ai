/* coordinationconsole.ai — page routing and the statements timeline. */
(function () {
  "use strict";

  const STATEMENTS = window.CC_STATEMENTS || [];

  const TYPES = {
    letter: "Open letter",
    declaration: "Declaration",
    joint: "Joint statement",
  };

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function formatDate(d) {
    const [y, m, day] = d.split("-");
    if (!m) return y;
    if (!day) return `${MONTHS[+m - 1]} ${y}`;
    return `${+day} ${MONTHS[+m - 1]} ${y}`;
  }

  // Month-only dates sort to the start of their month
  const sortKey = (d) => {
    const [y, m = "00", day = "00"] = d.split("-");
    return `${y}-${m}-${day}`;
  };

  // ───────────── Statements timeline (newest first)
  function renderStatements() {
    const list = STATEMENTS.slice().sort((a, b) => sortKey(b.date).localeCompare(sortKey(a.date)));
    const years = list.map((s) => s.date.slice(0, 4));

    document.getElementById("statements-intro").textContent =
      `${list.length} statements on AI, ${years[years.length - 1]}–${years[0]}. Newest first.`;

    const groups = [];
    for (const s of list) {
      const y = s.date.slice(0, 4);
      if (!groups.length || groups[groups.length - 1].year !== y) groups.push({ year: y, items: [] });
      groups[groups.length - 1].items.push(s);
    }

    document.getElementById("statements-timeline").innerHTML = groups
      .map(
        (g) => `
        <section class="tl-year" aria-label="${g.year}">
          <h3 class="tl-year-label">${g.year}</h3>
          <ol class="tl-list">${g.items.map(statementItem).join("")}</ol>
        </section>`
      )
      .join("");
  }

  function statementItem(s) {
    return `
      <li class="tl-item" id="statement-${esc(s.id)}">
        <div class="tl-meta">
          <time datetime="${esc(s.date)}">${esc(formatDate(s.date))}</time>
          <span class="tl-type">${esc(TYPES[s.type] || s.type)}</span>
        </div>
        <h4 class="tl-title">${esc(s.title)}</h4>
        <p class="tl-by">${esc(s.by)}</p>
        <p class="tl-summary">${esc(s.summary)}</p>
        ${s.quote ? `<blockquote class="tl-quote">“${esc(s.quote)}”</blockquote>` : ""}
        ${s.source ? `<a class="tl-source" href="${esc(s.source.url)}" target="_blank" rel="noopener noreferrer">Source: ${esc(s.source.label)} ↗</a>` : ""}
      </li>`;
  }

  // ───────────── Routing: #<page>, defaulting to Statements
  const PAGES = ["statements"];
  const DEFAULT_PAGE = "statements";

  function showPage() {
    const requested = location.hash.slice(1);
    const page = PAGES.includes(requested) ? requested : DEFAULT_PAGE;
    PAGES.forEach((p) => (document.getElementById(`page-${p}`).hidden = p !== page));
    document.querySelectorAll(".menu a[data-page]").forEach((a) => {
      if (a.dataset.page === page) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  renderStatements();
  showPage();
  window.addEventListener("hashchange", showPage);
})();
