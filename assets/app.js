/* coordinationconsole.ai — page routing, the Statements and Incidents
   timelines, their contents sidebars and reading progress, theme/accent
   toggles and keyboard shortcuts. */
(function () {
  "use strict";

  const root = document.documentElement;

  // Each timeline page: its data, the labels for its entry types, the prefix
  // for entry ids, and its intro line
  const TIMELINES = {
    statements: {
      items: window.CC_STATEMENTS || [],
      types: { letter: "Open letter", declaration: "Declaration", joint: "Joint statement" },
      prefix: "statement",
      intro: (n, from, to) => `${n} statements on AI, ${from}–${to}. Newest first.`,
    },
    incidents: {
      items: window.CC_INCIDENTS || [],
      types: { control: "Loss of control", behaviour: "Unintended behaviour", cyber: "Cyberattack" },
      prefix: "incident",
      intro: (n, from, to) =>
        `${n} incidents of loss of control, unintended behaviour and AI cyberattacks, ${from}–${to}. Dated by when each became public; newest first.`,
    },
  };

  // The page currently shown (set by showPage); scroll handling works within it
  let activePage = "statements";
  const activeScope = () => document.getElementById(`page-${activePage}`);

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

  // ───────────── Timelines (newest first, grouped by year)
  function renderTimeline(key) {
    const t = TIMELINES[key];
    const sorted = t.items.slice().sort((a, b) => sortKey(b.date).localeCompare(sortKey(a.date)));
    if (!sorted.length) return;
    const years = sorted.map((s) => s.date.slice(0, 4));
    document.getElementById(`${key}-intro`).textContent = t.intro(sorted.length, years[years.length - 1], years[0]);

    const groups = [];
    for (const s of sorted) {
      const y = s.date.slice(0, 4);
      if (!groups.length || groups[groups.length - 1].year !== y) groups.push({ year: y, items: [] });
      groups[groups.length - 1].items.push(s);
    }

    document.getElementById(`${key}-timeline`).innerHTML = groups
      .map(
        (g) => `
        <section class="tl-year" aria-label="${g.year}">
          <h3 class="tl-year-label">${g.year}</h3>
          <ol class="tl-list">${g.items.map((s) => timelineItem(s, t)).join("")}</ol>
        </section>`
      )
      .join("");

    document.getElementById(`${key}-toc`).innerHTML = sorted
      .map(
        (s) => `<li><a href="#${t.prefix}-${esc(s.id)}" data-target="${t.prefix}-${esc(s.id)}">${esc(s.title)} <span class="toc-date">(${esc(formatDate(s.date))})</span></a></li>`
      )
      .join("");
  }

  function timelineItem(s, t) {
    return `
      <li class="tl-item" id="${t.prefix}-${esc(s.id)}">
        <div class="tl-meta">
          <time datetime="${esc(s.date)}">${esc(formatDate(s.date))}</time>
          <span class="tl-type">${esc(t.types[s.type] || s.type)}</span>
        </div>
        <h4 class="tl-title">${esc(s.title)}</h4>
        <p class="tl-by">${esc(s.by)}</p>
        <p class="tl-summary">${esc(s.summary)}</p>
        ${s.quote ? `<blockquote class="tl-quote">“${esc(s.quote)}”</blockquote>` : ""}
        ${s.source ? `<a class="tl-source" href="${esc(s.source.url)}" target="_blank" rel="noopener noreferrer">Source: ${esc(s.source.label)} ↗</a>` : ""}
      </li>`;
  }

  // ───────────── Contents: which entry is current, and where each link scrolls to.
  // An entry becomes current once its top passes a reading line near the top of
  // the screen. Entries near the end of the page can never scroll that far, so
  // their switch-over points are spread evenly across the last stretch of
  // scrolling, with the final entry becoming current at the very bottom.
  function tocStops() {
    const headerH = parseFloat(getComputedStyle(root).getPropertyValue("--header-h"));
    const line = headerH + 120;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const items = [...activeScope().querySelectorAll(".tl-item")].map((el) => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      return { id: el.id, at: top - line, landing: top - headerH - 24 };
    });
    const firstUnreachable = items.findIndex((it) => it.at > maxScroll);
    if (firstUnreachable === -1) return { items, maxScroll };

    const lastReachable = firstUnreachable - 1;
    const from = lastReachable >= 0 ? Math.max(0, items[lastReachable].at) : 0;
    const steps = items.length - lastReachable - 1;
    for (let i = firstUnreachable; i < items.length; i++) {
      items[i].at = from + ((maxScroll - from) * (i - lastReachable)) / steps;
      items[i].landing = items[i].at;
    }
    return { items, maxScroll };
  }

  // Contents links scroll to where their entry becomes current, without
  // touching the page hash
  document.querySelectorAll(".toc-list").forEach((list) =>
    list.addEventListener("click", (e) => {
      const a = e.target.closest("a[data-target]");
      if (!a) return;
      e.preventDefault();
      const { items, maxScroll } = tocStops();
      const stop = items.find((it) => it.id === a.dataset.target);
      if (stop) window.scrollTo({ top: Math.min(maxScroll, Math.max(0, Math.ceil(stop.landing))) });
    })
  );

  // ───────────── Scroll: reading progress, current contents entry, back-to-top
  const toTop = document.getElementById("to-top");
  const menu = document.querySelector(".menu");
  const hero = document.querySelector(".hero");
  const pageTitleFixed = document.getElementById("page-title-fixed");

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    const fill = activeScope().querySelector(".progress-fill");
    if (fill) fill.style.height = `${(progress * 100).toFixed(1)}%`;

    toTop.classList.toggle("visible", window.scrollY > 400);

    // Once scrolled to the menu bar, the contents sidebar and progress pill
    // appear (and, on narrower windows, the site title gets a backing)
    const barTop = hero.getBoundingClientRect().bottom + window.scrollY;
    root.classList.toggle("past-menu", window.scrollY > 0 && window.scrollY >= barTop - 0.5);

    // Once the page heading has scrolled up behind the header, show the page's
    // title in the top-left corner
    const heading = activeScope().querySelector(".page-head h2");
    if (heading) {
      const headerH = parseFloat(getComputedStyle(root).getPropertyValue("--header-h"));
      pageTitleFixed.textContent = heading.textContent;
      root.classList.toggle("title-past", heading.getBoundingClientRect().bottom < headerH / 2);
    }

    // Current entry: the last one whose switch-over point has been reached
    // (half-pixel tolerance for fractional scroll positions)
    let current = null;
    for (const it of tocStops().items) if (window.scrollY + 0.5 >= it.at) current = it.id;
    let currentLink = null;
    activeScope().querySelectorAll(".toc-list a").forEach((a) => {
      if (a.dataset.target === current) {
        a.setAttribute("aria-current", "true");
        currentLink = a;
      } else a.removeAttribute("aria-current");
    });

    // Long lists scroll inside the sidebar: keep the current entry in view
    const toc = activeScope().querySelector(".toc");
    if (currentLink && toc && toc.scrollHeight > toc.clientHeight) {
      const top = currentLink.getBoundingClientRect().top - toc.getBoundingClientRect().top + toc.scrollTop;
      const bottom = top + currentLink.offsetHeight;
      if (top < toc.scrollTop + 40) toc.scrollTop = Math.max(0, top - 40);
      else if (bottom > toc.scrollTop + toc.clientHeight - 40) toc.scrollTop = bottom - toc.clientHeight + 40;
    }
  }

  // Keep the contents sidebar in the vertical middle of the screen
  function placeToc() {
    const toc = activeScope().querySelector(".toc");
    const h = toc ? toc.offsetHeight : 0;
    if (h) root.style.setProperty("--toc-top", `${Math.max(0, (window.innerHeight - h) / 2)}px`);
  }

  // ───────────── Theme and accent
  // Dark is the default (set on <html>); choices last only until the page
  // is reloaded
  const currentTheme = () => root.getAttribute("data-theme") || "dark";

  function toggleTheme() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
  }

  // Accent cycles crimson (default) → blue → orange → mono (black, or white
  // in dark mode). No data-accent attribute means crimson.
  const ACCENTS = ["red", "blue", "orange", "mono"];
  function toggleAccent() {
    const current = ACCENTS.indexOf(root.getAttribute("data-accent"));
    const next = ACCENTS[(Math.max(0, current) + 1) % ACCENTS.length];
    root.setAttribute("data-accent", next);
  }

  function toTopNow() {
    window.scrollTo({ top: 0 });
  }

  // Click feedback, shared by the custom cursor and keyboard shortcuts: a
  // ripple spreading from (x, y), plus a solid accent disc when `disc` is set
  // (the disc stands in for the cursor ring snapping shut on a real click)
  const rippleLayer = document.querySelector(".cursor-ripples");
  function spawnRipple(x, y, disc = false) {
    for (const cls of disc ? ["cursor-ripple", "cursor-press"] : ["cursor-ripple"]) {
      const r = document.createElement("span");
      r.className = cls;
      r.style.translate = `${x}px ${y}px`;
      r.addEventListener("animationend", () => r.remove());
      rippleLayer.appendChild(r);
    }
  }

  // Make a button look as if it had been clicked: accent colour, a brief
  // press, and the cursor's click ripple from its centre
  function pressFeedback(el) {
    const r = el.getBoundingClientRect();
    if (!r.width) return;
    spawnRipple(r.left + r.width / 2, r.top + r.height / 2, true);
    el.classList.remove("is-pressed");
    void el.offsetWidth;   // restart the press animation on repeated presses
    el.classList.add("is-pressed");
    setTimeout(() => el.classList.remove("is-pressed"), 350);
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
      if (toTop.classList.contains("visible")) pressFeedback(toTop);
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

    document.addEventListener("mousedown", (e) => {
      root.classList.add("cursor-down");
      spawnRipple(e.clientX, e.clientY);
    });
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

  // ───────────── Hero artwork: no wider than the title's longest line
  const heroArt = document.querySelector(".hero-art");
  const heroTitle = document.querySelector(".hero h1");
  function fitHeroArt() {
    if (!heroArt || !heroTitle) return;
    const range = document.createRange();
    range.selectNodeContents(heroTitle);
    const widest = Math.max(...[...range.getClientRects()].map((r) => r.width));
    if (widest > 0) heroArt.style.width = `${Math.round(widest)}px`;
  }

  // ───────────── Arrowhead glyphs (back-to-top and the controls toggle): fonts
  // place U+1F891 off-centre in its text box, so draw it onto a canvas centred
  // on its actual ink bounds and use that as a mask (filled with the button's
  // text colour)
  async function centreArrowGlyphs() {
    const els = document.querySelectorAll(".arrow-glyph");
    if (!els.length) return;
    const ch = els[0].textContent.trim();
    const family = getComputedStyle(els[0]).fontFamily;
    try {
      await document.fonts.load(`100px ${family}`, ch);
    } catch (e) { /* draw with whatever font is available */ }

    const SIZE = 128;
    const c = document.createElement("canvas");
    c.width = c.height = SIZE;
    const ctx = c.getContext("2d");
    ctx.font = `100px ${family}`;
    const m = ctx.measureText(ch);
    const w = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
    const h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
    if (!(w > 0 && h > 0)) return;

    // Scale so the larger side of the glyph fills 90% of the canvas
    const k = (SIZE * 0.9) / Math.max(w, h);
    ctx.setTransform(k, 0, 0, k, SIZE / 2, SIZE / 2);
    ctx.fillText(ch, -(m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2, (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2);

    const url = `url(${c.toDataURL()})`;
    els.forEach((el) => {
      el.style.setProperty("--glyph", url);
      el.classList.add("is-centred");
    });
  }

  // ───────────── Theme/colour controls tuck into an arrow a second after load,
  // and the arrow opens and closes them. If the pointer or keyboard focus is on
  // the controls at that moment, wait until it leaves.
  function initControlsToggle() {
    const wrap = document.querySelector(".page-controls");
    const toggle = document.getElementById("controls-toggle");
    const set = document.getElementById("control-set");
    if (!wrap || !toggle || !set) return;

    const setState = (state) => {
      wrap.dataset.state = state;
      const open = state === "open" || state === "initial";
      toggle.setAttribute("aria-expanded", String(open));
      set.inert = !open;
    };

    const tuck = () => {
      if (wrap.dataset.state !== "initial") return;
      if (set.matches(":hover") || wrap.matches(":focus-within")) {
        set.addEventListener("mouseleave", tuck, { once: true });
        wrap.addEventListener("focusout", () => setTimeout(tuck, 0), { once: true });
        return;
      }
      setState("tucking");                       // arrow appears pointing left
      setTimeout(() => setState("closed"), 900); // …then turns to point right
    };
    setTimeout(tuck, 1000);

    toggle.addEventListener("click", () => {
      setState(wrap.dataset.state === "open" ? "closed" : "open");
    });
  }

  // ───────────── Routing: #<page>, defaulting to Statements
  const PAGES = ["statements", "incidents"];
  const DEFAULT_PAGE = "statements";

  function showPage() {
    const requested = location.hash.slice(1);
    const page = PAGES.includes(requested) ? requested : DEFAULT_PAGE;
    activePage = page;
    PAGES.forEach((p) => (document.getElementById(`page-${p}`).hidden = p !== page));
    document.querySelectorAll(".menu a[data-page]").forEach((a) => {
      if (a.dataset.page === page) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    // The newly shown page has its own sidebar and length
    onScroll();
    placeToc();
  }

  Object.keys(TIMELINES).forEach(renderTimeline);
  initCursor();
  centreArrowGlyphs();
  initControlsToggle();
  showPage();
  fitHeroArt();
  window.addEventListener("hashchange", showPage);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    onScroll();
    placeToc();
    fitHeroArt();
  });
  // Web fonts change the sidebar's height once they load
  document.fonts?.ready.then(() => {
    placeToc();
    fitHeroArt();
  });
})();
