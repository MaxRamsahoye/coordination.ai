/* coordination.ai — page routing, the Statements and Incidents
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
      // One category at a time, Main by default (no "All" pill); the chosen
      // category is implied, so it isn't repeated in each entry's label
      filters: [
        { by: "category", value: "main", all: false, tag: false, order: ["main", "academic", "governmental", "religious"],
          labels: { main: "Main", academic: "Academic", governmental: "Governmental", religious: "Religious" } },
      ],
      types: {
        letter: "Open letter", declaration: "Declaration", joint: "Joint statement", principles: "Principles",
        paper: "Paper", consensus: "Consensus statement", report: "Report", resolution: "Resolution",
        treaty: "Treaty", order: "Executive order", code: "Code of conduct", address: "Address",
        note: "Doctrinal note", encyclical: "Encyclical",
      },
      prefix: "statement",
      intro: (n, span, [category]) =>
        `${n} ${category === "Main" ? "" : `${category.toLowerCase()} `}statement${n === 1 ? "" : "s"} on AI, ${span}. Newest first.`,
    },
    materials: {
      items: window.CC_MATERIALS || [],
      filters: [
        { by: "category", value: "scenario", all: false, tag: false, order: ["scenario", "essay"],
          labels: { scenario: "Scenarios", essay: "Essays" } },
      ],
      types: { forecast: "Forecast", plan: "Plan", essay: "Essay" },
      prefix: "material",
      intro: (n, span, [category]) =>
        category === "Scenarios"
          ? `${n} scenario${n === 1 ? "" : "s"} for how advanced AI could unfold and plans for steering it, ${span}. Newest first.`
          : `${n} essay${n === 1 ? "" : "s"} on the future of AI, ${span}. Newest first.`,
    },
    incidents: {
      items: window.CC_INCIDENTS || [],
      // Filter rows: one pill per value of the field, plus "All" (unless
      // `all: false`); they combine.
      // `order` fixes the pill order (otherwise most common first, with any
      // `last` value, such as "Other", at the end) and
      // `labels` gives display names.
      filters: [
        { by: "category", value: "All", order: ["misalignment", "misuse", "malfunction", "misinformation", "ethics"],
          labels: { misalignment: "Misalignment", misuse: "Misuse", malfunction: "Malfunction", misinformation: "Misinformation", ethics: "Ethics" } },
        { by: "orgs", value: "All", last: "Other" },
      ],
      types: { control: "Loss of control", behaviour: "Unintended behaviour", cyber: "Cyberattack" },
      prefix: "incident",
      intro: (n, span, [category, org]) => {
        const s = n === 1 ? "" : "s";
        const what = category === "All" ? `incident${s} of loss of control, unintended behaviour and AI cyberattacks` : `${category.toLowerCase()} incident${s}`;
        return `${n} ${what}${org === "All" ? "" : org === "Other" ? " involving other developers' models" : ` involving ${org} models`}, ${span}. Dated by when each became public; newest first.`;
      },
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
    const filters = t.filters || [];
    const shown = t.items.filter((s) => filters.every((f) => f.value === "All" || fieldValues(s, f.by).includes(f.value)));
    const sorted = shown.slice().sort((a, b) => sortKey(b.date).localeCompare(sortKey(a.date)));
    const intro = document.getElementById(`${key}-intro`);
    if (!sorted.length) {
      intro.textContent = "No incidents match both filters. Choose All in either row to widen the list.";
      document.getElementById(`${key}-timeline`).innerHTML = "";
      document.getElementById(`${key}-toc`).innerHTML = "";
      return;
    }
    const years = sorted.map((s) => s.date.slice(0, 4));
    const span = years[0] === years[years.length - 1] ? years[0] : `${years[years.length - 1]}–${years[0]}`;
    intro.textContent = t.intro(sorted.length, span, filters.map((f) => (f.value === "All" ? "All" : filterLabel(f, f.value))));

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

  // A field may hold one value or a list of them
  const fieldValues = (s, by) => [].concat(s[by] ?? []);
  const filterLabel = (f, v) => (f.labels && f.labels[v]) || v;

  // ───────────── Filter bars: "All" plus each value of the filter field, with
  // counts. Choosing one re-renders the timeline.
  function renderFilters(key) {
    (TIMELINES[key].filters || []).forEach((f) => renderFilterRow(key, f));
  }

  function renderFilterRow(key, f) {
    const t = TIMELINES[key];
    const bar = document.getElementById(`${key}-filters-${f.by}`);
    if (!bar) return;
    const counts = new Map();
    t.items.forEach((s) => fieldValues(s, f.by).forEach((v) => counts.set(v, (counts.get(v) || 0) + 1)));
    const values = f.order
      ? f.order.filter((v) => counts.has(v)).map((v) => [v, counts.get(v)])
      : [...counts].sort((a, b) => (a[0] === f.last) - (b[0] === f.last) || b[1] - a[1] || a[0].localeCompare(b[0]));
    const options = f.all === false ? values : [["All", t.items.length], ...values];
    bar.innerHTML = options
      .map(
        ([v, n]) =>
          `<button type="button" class="filter-pill" data-value="${esc(v)}" aria-pressed="${v === f.value}">${esc(filterLabel(f, v))} <span class="filter-count">${n}</span></button>`
      )
      .join("");

    bar.addEventListener("click", (e) => {
      const b = e.target.closest(".filter-pill");
      if (!b || b.dataset.value === f.value) return;
      f.value = b.dataset.value;
      bar.querySelectorAll(".filter-pill").forEach((p) => p.setAttribute("aria-pressed", String(p === b)));
      b.scrollIntoView({ block: "nearest", inline: "nearest" });
      renderTimeline(key);
      // If the list now ends above the reader, bring its top back into view
      const head = document.getElementById(`page-${key}`).querySelector(".page-head");
      if (head.getBoundingClientRect().top < 0) window.scrollTo({ top: head.getBoundingClientRect().top + window.scrollY - 140 });
      onScroll();
      placeToc();
    });

    // Fade the right edge only while there is more to scroll to
    const edge = () => bar.classList.toggle("at-end", bar.scrollLeft + bar.clientWidth >= bar.scrollWidth - 2);
    bar.addEventListener("scroll", edge, { passive: true });
    window.addEventListener("resize", edge);
    edge();
  }

  function timelineItem(s, t) {
    const catFilter = s.category && (t.filters || []).find((f) => f.by === "category" && f.tag !== false);
    const kind = [t.types[s.type] || s.type, catFilter && filterLabel(catFilter, s.category)].filter(Boolean).join(" · ");
    return `
      <li class="tl-item" id="${t.prefix}-${esc(s.id)}">
        <div class="tl-meta">
          <time datetime="${esc(s.date)}">${esc(formatDate(s.date))}</time>
          <span class="tl-type">${esc(kind)}</span>
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

  // ───────────── Latest developments: the newest entries across all the
  // timelines, as a looping ticker, each shown by its short news-style
  // headline. Each links to its entry, switching page
  // and widening that page's filters if they would hide it.
  const NEWS_COUNT = 10;
  function renderNews() {
    const track = document.getElementById("news-track");
    if (!track) return;
    const latest = Object.entries(TIMELINES)
      .flatMap(([key, t]) => t.items.map((item) => ({ key, item })))
      .sort((a, b) => sortKey(b.item.date).localeCompare(sortKey(a.item.date)))
      .slice(0, NEWS_COUNT);
    const html = latest
      .map(
        ({ key, item }) =>
          `<a class="news-item" href="#${key}" data-key="${key}" data-id="${esc(item.id)}"><span class="news-date">${esc(formatDate(item.date))}</span>${esc(item.headline || item.title)}</a>`
      )
      .join("");
    // Two copies so the loop is seamless; the second is for looks only
    track.innerHTML = `<div class="news-set" style="display:flex">${html}</div><div class="news-set" style="display:flex" aria-hidden="true" inert>${html}</div>`;
    track.style.setProperty("--news-dur", `${Math.max(20, track.scrollWidth / 2 / 70)}s`);   // about 70px a second

    track.addEventListener("click", (e) => {
      const a = e.target.closest(".news-item");
      if (!a) return;
      e.preventDefault();
      openEntry(a.dataset.key, a.dataset.id);
    });
  }

  window.CC_openEntry = (key, id) => openEntry(key, id);   // for positions.js
  function openEntry(key, id) {
    const t = TIMELINES[key];
    const item = t.items.find((s) => s.id === id);
    if (!item) return;
    if (location.hash.slice(1) !== key) history.pushState(null, "", `#${key}`);
    showPage();
    // Choose a filter pill that shows the entry, if the current one hides it
    for (const f of t.filters || []) {
      const values = fieldValues(item, f.by);
      if (f.value === "All" || values.includes(f.value)) continue;
      const want = f.all === false ? values[0] : "All";
      const pill = document.querySelector(`#${key}-filters-${f.by} .filter-pill[data-value="${CSS.escape(want)}"]`);
      if (pill) pill.click();
    }
    requestAnimationFrame(() => {
      const { items, maxScroll } = tocStops();
      const stop = items.find((it) => it.id === `${t.prefix}-${id}`);
      if (stop) window.scrollTo({ top: Math.min(maxScroll, Math.max(0, Math.ceil(stop.landing))) });
    });
  }

  // ───────────── Scroll: reading progress, current contents entry, back-to-top
  const toTop = document.getElementById("to-top");
  const menu = document.querySelector(".menu");
  const hero = document.querySelector(".hero");
  const pageTitleFixed = document.getElementById("page-title-fixed");
  const footerEl = document.querySelector(".site-footer");
  const siteTitle = document.querySelector(".site-title");
  const heroNote = document.querySelector(".hero-note");
  const heroDescription = document.querySelector(".hero-description");
  // Hiding the address: the brackets close, then fade away; showing it, they
  // fade back in closed, then open. Each step waits for the one before
  let addressHidden = false, addressTimer;
  let lastScrollY = window.scrollY, scrollDir = "down";
  function setAddress(hide) {
    if (hide === addressHidden) return;
    addressHidden = hide;
    clearTimeout(addressTimer);
    if (hide) {
      siteTitle.classList.add("st-closed");
      addressTimer = setTimeout(() => siteTitle.classList.add("st-gone"), 420);
    } else {
      siteTitle.classList.remove("st-gone");
      addressTimer = setTimeout(() => siteTitle.classList.remove("st-closed"), siteTitle.classList.contains("st-closed") ? 280 : 0);
    }
  }

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
    root.classList.toggle("at-footer", footerEl.getBoundingClientRect().top < window.innerHeight);
    // Which way the page last moved
    const y = window.scrollY;
    if (y > lastScrollY) scrollDir = "down";
    else if (y < lastScrollY) scrollDir = "up";
    lastScrollY = y;
    root.classList.toggle("scrolling-down", scrollDir === "down" && y > 0);
    // The site address hides as soon as the page scrolls down from the top,
    // until it reaches the point the menu glides to (its line at the top of
    // the screen). Scrolling back up, it hides again below that point, and
    // shows once the top of the hero description is back under it
    const lineAbs = menu.getBoundingClientRect().top + window.scrollY + (parseFloat(menu.style.getPropertyValue("--menu-line-y")) || menu.offsetHeight);
    const st = siteTitle.getBoundingClientRect();
    // (short windows hide the note, leaving the cycling line in its place)
    const descTop = (heroNote.offsetHeight ? heroNote : heroDescription).getBoundingClientRect().top + window.scrollY;
    const hideFrom = Math.max(1, descTop - (st.top + st.height / 2));
    setAddress(y > 0 && y < lineAbs - 1 && (y > hideFrom || scrollDir === "down"));

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

    // The sidebar is sticky within its page, so near the end of the page the
    // page's bottom padding and the footer would push it up under the corner
    // page title. Instead it shrinks (scrolling inside) to end where the page
    // content ends, keeping its top edge clear of the header.
    const toc = activeScope().querySelector(".toc");
    if (toc) {
      const headerH = parseFloat(getComputedStyle(root).getPropertyValue("--header-h"));
      const tocTop = Math.max(headerH, parseFloat(getComputedStyle(toc).top) || 0);
      const room = toc.parentElement.getBoundingClientRect().bottom - tocTop;
      const normal = window.innerHeight - 2 * headerH;
      toc.style.maxHeight = room < normal ? `${Math.max(96, room)}px` : "";
    }

    // Long lists scroll inside the sidebar: keep the current entry in view
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
    if (!toc) return;
    // Centre on its full height (capped as in the CSS), not a height it has
    // shrunk to near the end of the page
    const headerH = parseFloat(getComputedStyle(root).getPropertyValue("--header-h"));
    const h = Math.min(toc.scrollHeight, window.innerHeight - 2 * headerH);
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
    updateFavicon(next);
  }

  // Favicon: a circle outline in the accent colour. The browser's
  // tab strip doesn't follow the site's theme, so colours use their stronger
  // light-theme values, and mono is black or white to suit the browser.
  const FAVICON_C = document.getElementById("favicon") && fetch(document.getElementById("favicon").href).then((r) => r.text()).catch(() => null);
  const FAVICON_FILLS = { red: "#c8102e", blue: "#1d4ed8", orange: "#c2410c" };
  async function updateFavicon(accent) {
    const link = document.getElementById("favicon");
    const svg = link && (await FAVICON_C);
    if (!svg) return;
    const colour = FAVICON_FILLS[accent];
    const out = colour
      ? svg.replace(/stroke="#[0-9a-f]+"/i, `stroke="${colour}"`)
      : svg.replace(/stroke="#[0-9a-f]+"/i, 'class="c"').replace(/<circle/, "<style>.c{stroke:#000}@media (prefers-color-scheme:dark){.c{stroke:#fff}}</style><circle");
    link.href = `data:image/svg+xml,${encodeURIComponent(out)}`;
  }

  // Font cycles hybrid (the default: Bembo text, Plex details) → all ET
  // Bembo → all IBM Plex Sans Arabic; not remembered
  const FONTS = ["hybrid", "bembo", "plex"];
  function toggleFont() {
    const i = FONTS.indexOf(root.getAttribute("data-font"));
    root.setAttribute("data-font", FONTS[(Math.max(0, i) + 1) % FONTS.length]);
    // Text heights change with the font, so re-measure what depends on them
    document.fonts.ready.then(() => {
      fitHeroArt();
      placeToc();
      onScroll();
      placeMenuIndicator(false);
    });
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
  document.getElementById("font-toggle").addEventListener("click", toggleFont);
  toTop.addEventListener("click", toTopNow);

  // Shortcuts: T theme, C accent, F font, H hudless, 1–8 pages, Backspace back to top
  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (e.key === "t" || e.key === "T") toggleTheme();
    else if (e.key === "c" || e.key === "C") toggleAccent();
    else if (e.key === "f" || e.key === "F") toggleFont();
    else if (e.key === "h" || e.key === "H") root.classList.toggle("hudless");   // hide the dividing lines
    else if (/^[1-9]$/.test(e.key)) {   // 1–8: the menu's pages, in order
      const item = document.querySelectorAll(".menu a[data-page]")[+e.key - 1];
      if (item) item.click();
    }
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

  // ───────────── Loading screen: lifts once everything has loaded (fonts,
  // images), shown for at least 1.2s so it doesn't just flash, and at most
  // 8s in case something stalls. Resolves once it has started to fade.
  const revealed = new Promise((resolve) => {
    const MIN = 1200, MAX = 8000;
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      root.classList.add("loaded");
      resolve();
    };
    const whenLoaded = () => setTimeout(reveal, Math.max(0, MIN - performance.now()));
    if (document.readyState === "complete") whenLoaded();
    else window.addEventListener("load", whenLoaded, { once: true });
    setTimeout(reveal, MAX);
  });

  // ───────────── Hero title: "AI Risk" fills with the accent colour as the
  // loading screen lifts (over 2s), and stays filled
  function initTitleFill() {
    const el = document.querySelector(".title-fill");
    if (el) revealed.then(() => el.classList.add("is-filled"));
  }

  // ───────────── Hero subtitle: cycle through its sentences on one line
  function initHeroCycle() {
    const lines = [...document.querySelectorAll(".hero-cycle > span")];
    if (lines.length < 2) return;
    let i = 0;
    revealed.then(() => setInterval(() => {
      if (document.hidden) return;
      const prev = lines[i];
      i = (i + 1) % lines.length;
      prev.classList.replace("is-current", "is-leaving");
      setTimeout(() => prev.classList.remove("is-leaving"), 700);
      lines[i].classList.add("is-current");
    }, 3500));
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
    levelControls();
  }

  // Keep the design controls level with the hero title's middle (used on
  // wide screens, where they sit at the page's left edge)
  function levelControls() {
    const hero = heroTitle && heroTitle.closest(".hero");
    if (!hero) return;
    const t = heroTitle.getBoundingClientRect(), h = hero.getBoundingClientRect();
    hero.style.setProperty("--ctl-top", `${Math.round(t.top - h.top + t.height / 2)}px`);
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
    revealed.then(() => setTimeout(tuck, 2000));   // two seconds after the loading screen lifts

    toggle.addEventListener("click", () => {
      setState(wrap.dataset.state === "open" ? "closed" : "open");
    });
  }

  // ───────────── Routing: #<page>, defaulting to Positions
  const PAGES = ["statements", "materials", "incidents", "race", "positions", "organisations", "coordinate", "contact"];
  const DEFAULT_PAGE = "positions";

  let indicatorReady = false;   // the first placement doesn't animate
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
    placeMenuIndicator(indicatorReady);
    indicatorReady = true;
    document.dispatchEvent(new CustomEvent("cc:pageshow", { detail: { page } }));
  }

  Object.keys(TIMELINES).forEach((key) => {
    renderTimeline(key);
    renderFilters(key);
  });
  renderNews();
  initCursor();
  centreArrowGlyphs();
  initControlsToggle();
  // Every visit starts afresh on the default page at the top: a page named
  // in the address (from an earlier visit or a refresh) isn't reopened, and
  // the browser doesn't restore the old scroll position
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo({ top: 0, behavior: "instant" });
  showPage();
  fitHeroArt();
  initHeroCycle();
  initTitleFill();
  // A slow, eased scroll (about 1.4s, longer for longer distances), used by
  // the menu; any wheel, touch or key input takes over at once
  let glide = 0;
  function glideTo(target) {
    cancelAnimationFrame(glide);
    const start = window.scrollY, dist = target - start;
    if (!dist) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return window.scrollTo({ top: target, behavior: "instant" });
    const duration = Math.min(2000, 1100 + Math.abs(dist) * 0.3);
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);   // ease in and out
    const t0 = performance.now();
    const stop = () => cancelAnimationFrame(glide);
    // Listen for input only after the event that started the glide (a click
    // or a number key) has finished, so it doesn't stop its own glide
    setTimeout(() => ["wheel", "touchstart", "keydown"].forEach((ev) => window.addEventListener(ev, stop, { once: true, passive: true })));
    const step = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      window.scrollTo({ top: start + dist * ease(t), behavior: "instant" });
      if (t < 1) glide = requestAnimationFrame(step);
    };
    glide = requestAnimationFrame(step);
  }

  // Menu indicator: the accent bar under the current page's item
  function placeMenuIndicator(animate = true) {
    const indicator = document.querySelector(".menu-indicator");
    const a = document.querySelector(".menu a[aria-current='page']");
    if (!indicator || !a) return;
    indicator.classList.toggle("no-anim", !animate);
    indicator.style.width = `${a.offsetWidth}px`;
    indicator.style.transform = `translate(${a.offsetLeft}px, ${a.offsetTop + a.offsetHeight - 4}px)`;
    // The menu's dividing line runs level with the bar's lower edge
    document.querySelector(".menu").style.setProperty("--menu-line-y", `${a.offsetTop + a.offsetHeight - 3}px`);
  }
  // The site address keeps its open width while the brackets close, so they
  // meet in the middle; measured with the name showing
  function sizeSiteTitle() {
    const wasClosed = siteTitle.classList.contains("st-closed");
    siteTitle.classList.remove("st-closed");
    siteTitle.style.removeProperty("--st-w");
    siteTitle.style.setProperty("--st-w", `${Math.ceil(siteTitle.getBoundingClientRect().width)}px`);
    siteTitle.classList.toggle("st-closed", wasClosed);
  }
  document.fonts.ready.then(sizeSiteTitle);
  document.fonts.addEventListener("loadingdone", sizeSiteTitle);
  window.addEventListener("resize", sizeSiteTitle);
  window.addEventListener("resize", () => placeMenuIndicator(false));
  document.fonts.ready.then(() => placeMenuIndicator(false));
  document.fonts.addEventListener("loadingdone", () => placeMenuIndicator(false));   // a late font changes the items' widths

  // Menu: switch page, then glide down from the hero until the menu's
  // dividing line reaches the top of the screen
  const menuEl = document.querySelector(".menu");
  document.querySelectorAll(".menu a[data-page]").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const page = a.dataset.page;
      if (location.hash.slice(1) !== page) history.pushState(null, "", `#${page}`);
      showPage();
      const lineY = menuEl.getBoundingClientRect().top + window.scrollY + (parseFloat(menuEl.style.getPropertyValue("--menu-line-y")) || menuEl.offsetHeight);
      glideTo(Math.round(lineY));
    })
  );

  // ───────────── Footer: live figures from the site's data
  function renderFooter() {
    const stats = document.getElementById("footer-stats");
    const P = window.CC_POSITIONS;
    let positions = 0;
    if (P) {
      positions += Object.values(P.chambers).reduce((n, list) => n + list.length, 0);
      const walk = (node) => (node.stance ? 1 : 0) + (node.children || []).reduce((n, c) => n + walk(c), 0);
      positions += Object.values(P.industry).reduce((n, lab) => n + walk(lab.chart), 0);
    }
    const figures = [
      [positions, "recorded positions"],
      [TIMELINES.statements.items.length, "statements"],
      [TIMELINES.materials.items.length, "scenarios and essays"],
      [TIMELINES.incidents.items.length, "incidents"],
      [(window.CC_ORGANISATIONS || []).length, "organisations"],
    ].filter(([n]) => n);
    if (stats) stats.innerHTML = figures.map(([n, label]) => `<li><strong>${n}</strong><span>${label}</span></li>`).join("");
  }
  renderFooter();

  // Menu overflow: mark when the pills scroll sideways, and when scrolled
  // to the end, so the edge fade shows only while there's more
  const menuInner = document.querySelector(".menu-inner");
  function menuEdges() {
    const over = menuInner.scrollWidth > menuInner.clientWidth + 1;
    menuInner.classList.toggle("overflows", over);
    menuInner.classList.toggle("at-end", menuInner.scrollLeft + menuInner.clientWidth >= menuInner.scrollWidth - 2);
  }
  menuInner.addEventListener("scroll", menuEdges, { passive: true });
  window.addEventListener("resize", menuEdges);
  document.fonts.ready.then(menuEdges);
  menuEdges();

  // ───────────── Contact form: checks the fields, then posts them as JSON
  // to the form's data-endpoint (e.g. Formspree). With no endpoint set yet,
  // it says so rather than pretending to send.
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const status = document.getElementById("contact-status");
    const say = (text, error = false) => {
      status.textContent = text;
      status.classList.toggle("is-error", error);
    };
    contactForm.addEventListener("input", (e) => e.target.classList.remove("is-invalid"));
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fields = [...contactForm.querySelectorAll("[required]")];
      fields.forEach((f) => f.classList.toggle("is-invalid", !f.checkValidity()));
      const bad = fields.find((f) => !f.checkValidity());
      if (bad) {
        bad.focus();
        return say(bad.type === "email" && bad.value ? "Please check the email address." : "Please fill in your name, email and message.", true);
      }
      const endpoint = contactForm.dataset.endpoint;
      if (!endpoint) return say("Sorry, this form isn't connected yet, so messages can't be sent. Please try again soon.", true);
      const button = contactForm.querySelector(".cf-send");
      button.disabled = true;
      say("Sending…");
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
        });
        if (!res.ok) throw new Error(res.status);
        contactForm.reset();
        say("Thank you — your message has been sent.");
      } catch {
        say("Sorry, your message couldn't be sent. Please try again.", true);
      } finally {
        button.disabled = false;
      }
    });
  }

  // In-page links to another page (data-goto) behave like the menu
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-goto]");
    if (!a) return;
    e.preventDefault();
    document.querySelector(`.menu a[data-page="${a.dataset.goto}"]`)?.click();
  });

  window.addEventListener("hashchange", showPage);
  window.addEventListener("popstate", showPage);   // back and forward after the ticker changes page
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
