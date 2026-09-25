/* Coordinate page: three sections chosen by pills (Next steps,
   International coordination, Collective action), each with its own intro.
   Links marked data-entry open an entry elsewhere on the site. */
(function () {
  "use strict";

  const bar = document.getElementById("coordinate-subs");
  if (!bar) return;
  const INTRO = {
    next: "A coordinated slowdown needs people across government, industry and the public to act together. Here is where to start.",
    international: "How countries could agree to slow the race together: what exists, what's been proposed, and what it would take.",
    collective: "How people, labs and countries can act together when no one wants to slow down alone.",
  };
  function show(sub) {
    bar.querySelectorAll("[data-sub]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.sub === sub)));
    document.querySelectorAll("#page-coordinate .co-panel").forEach((p) => (p.hidden = p.dataset.sub !== sub));
    document.getElementById("coordinate-intro").textContent = INTRO[sub];
  }
  bar.addEventListener("click", (e) => {
    const b = e.target.closest("[data-sub]");
    if (b) show(b.dataset.sub);
  });
  document.getElementById("page-coordinate").addEventListener("click", (e) => {
    const go = e.target.closest("[data-sub-go]");
    if (go) {
      e.preventDefault();
      show(go.dataset.subGo);
      const head = document.querySelector("#page-coordinate .page-head");
      window.scrollTo({ top: head.getBoundingClientRect().top + window.scrollY - 140, behavior: "smooth" });
      return;
    }
    const a = e.target.closest("[data-entry]");
    if (a) {
      e.preventDefault();
      const [page, id] = a.dataset.entry.split(":");
      if (window.CC_openEntry) window.CC_openEntry(page, id);
    }
  });
})();
