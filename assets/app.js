/* coordinationconsole.ai — page routing, statements timeline, contents,
   reading progress, theme/accent toggles and keyboard shortcuts. */
(function () {
  "use strict";

  const STATEMENTS = window.CC_STATEMENTS || [];
  const root = document.documentElement;

  const TYPES = {
    letter: "Open letter",
    declaration: "Declaration",
    joint: "Joint statement",
  };

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } },
  };

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

  const sorted = STATEMENTS.slice().sort((a, b) => sortKey(b.date).localeCompare(sortKey(a.date)));

  // ───────────── Statements timeline (newest first)
  function renderStatements() {
    const years = sorted.map((s) => s.date.slice(0, 4));
    document.getElementById("statements-intro").textContent =
      `${sorted.length} statements on AI, ${years[years.length - 1]}–${years[0]}. Newest first.`;

    const groups = [];
    for (const s of sorted) {
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

    document.getElementById("statements-toc").innerHTML = sorted
      .map(
        (s) => `<li><a href="#statement-${esc(s.id)}" data-target="statement-${esc(s.id)}">${esc(s.title)} <span class="toc-date">(${esc(formatDate(s.date))})</span></a></li>`
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

  // Contents links scroll to the entry without touching the page hash
  document.getElementById("statements-toc").addEventListener("click", (e) => {
    const a = e.target.closest("a[data-target]");
    if (!a) return;
    e.preventDefault();
    document.getElementById(a.dataset.target)?.scrollIntoView({ block: "start" });
  });

  // ───────────── Scroll: reading progress, current contents entry, back-to-top
  const fill = document.getElementById("progress-fill");
  const toTop = document.getElementById("to-top");

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    fill.style.height = `${(progress * 100).toFixed(1)}%`;

    toTop.classList.toggle("visible", window.scrollY > 400);

    // Current entry: the last one whose top has passed the reading line
    const line = parseFloat(getComputedStyle(root).getPropertyValue("--header-h")) + 120;
    let current = null;
    document.querySelectorAll(".tl-item").forEach((el) => {
      if (el.getBoundingClientRect().top <= line) current = el.id;
    });
    document.querySelectorAll(".toc-list a").forEach((a) => {
      if (a.dataset.target === current) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }

  // Keep the contents sidebar in the vertical middle of the screen
  const toc = document.querySelector(".toc");
  function placeToc() {
    const h = toc.offsetHeight;
    if (h) root.style.setProperty("--toc-top", `${Math.max(0, (window.innerHeight - h) / 2)}px`);
  }

  // ───────────── Theme and accent
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  const currentTheme = () => root.getAttribute("data-theme") || (prefersDark.matches ? "dark" : "light");

  function toggleTheme() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    store.set("cc-theme", next);
  }

  function toggleAccent() {
    const next = root.getAttribute("data-accent") === "orange" ? "blue" : "orange";
    root.setAttribute("data-accent", next);
    store.set("cc-accent", next);
  }

  function toTopNow() {
    window.scrollTo({ top: 0 });
  }

  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
  document.getElementById("accent-toggle").addEventListener("click", toggleAccent);
  toTop.addEventListener("click", toTopNow);

  // Shortcuts: T theme, C accent, Backspace back to top
  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (e.key === "t" || e.key === "T") toggleTheme();
    else if (e.key === "c" || e.key === "C") toggleAccent();
    else if (e.key === "Backspace") {
      e.preventDefault();
      toTopNow();
    }
  });

  // ───────────── Custom cursor: a dot that tracks the pointer exactly and a
  // ring that eases after it. Only for fine pointers (mouse, trackpad).
  function initCursor() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(forced-colors: active)").matches) return;

    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const CLICKABLE = "a, button, [role='button'], label, select, summary";

    let x = -100, y = -100, rx = -100, ry = -100, started = false;

    root.classList.add("has-custom-cursor", "cursor-away");

    document.addEventListener("mousemove", (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!started) {
        rx = x;
        ry = y;
        started = true;
      }
      root.classList.remove("cursor-away");
      dot.style.translate = `${x}px ${y}px`;
      root.classList.toggle("cursor-hover", !!e.target.closest?.(CLICKABLE));
    });

    document.addEventListener("mousedown", () => root.classList.add("cursor-down"));
    document.addEventListener("mouseup", () => root.classList.remove("cursor-down"));
    document.documentElement.addEventListener("mouseleave", () => root.classList.add("cursor-away"));
    window.addEventListener("blur", () => root.classList.remove("cursor-down"));

    (function follow() {
      const ease = reduceMotion.matches ? 1 : 0.2;
      rx += (x - rx) * ease;
      ry += (y - ry) * ease;
      ring.style.translate = `${rx.toFixed(2)}px ${ry.toFixed(2)}px`;
      requestAnimationFrame(follow);
    })();
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
  initCursor();
  showPage();
  onScroll();
  placeToc();
  window.addEventListener("hashchange", showPage);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    onScroll();
    placeToc();
  });
  // Web fonts change the sidebar's height once they load
  document.fonts?.ready.then(placeToc);
})();
