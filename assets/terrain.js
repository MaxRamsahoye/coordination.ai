/* Live wireframe terrain for the hero: a jittered, triangulated heightfield
   drawn on a canvas that slowly sways and ripples. Lines use the page's ink
   colour, so it follows the light/dark theme.

   If assets/hero.gif exists it is shown instead of the canvas. */
(function () {
  "use strict";

  const wrap = document.querySelector(".hero-art");
  if (!wrap) return;
  const canvas = wrap.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Prefer the original GIF when it has been added to the repo
  const gif = new Image();
  gif.onload = () => {
    gif.alt = "";
    gif.className = "hero-gif";
    wrap.replaceChild(gif, canvas);
    running = false;
  };
  gif.src = "assets/hero.gif";

  // ───────────── Mesh: a regular grid with jittered vertices, each cell split
  // into two triangles along alternating diagonals
  const COLS = 70;
  const ROWS = 18;
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  const verts = [];
  for (let j = 0; j <= ROWS; j++) {
    for (let i = 0; i <= COLS; i++) {
      const jitter = i > 0 && i < COLS && j > 0 && j < ROWS ? 0.38 : 0;
      verts.push({
        x: -1 + (2 * (i + (rand() - 0.5) * jitter)) / COLS,
        y: -0.32 + (0.64 * (j + (rand() - 0.5) * jitter)) / ROWS,
      });
    }
  }
  const idx = (i, j) => j * (COLS + 1) + i;

  const edges = [];
  for (let j = 0; j <= ROWS; j++) {
    for (let i = 0; i <= COLS; i++) {
      if (i < COLS) edges.push(idx(i, j), idx(i + 1, j));
      if (j < ROWS) edges.push(idx(i, j), idx(i, j + 1));
      if (i < COLS && j < ROWS) {
        if ((i + j) % 2) edges.push(idx(i, j), idx(i + 1, j + 1));
        else edges.push(idx(i + 1, j), idx(i, j + 1));
      }
    }
  }

  const g = (x, y, cx, cy, sx, sy) => Math.exp(-((x - cx) ** 2) / sx - ((y - cy) ** 2) / sy);

  // Height: a broad hill on the left, a peak on the right and a deep fold
  // between them, flattening into thin tails at both ends
  function height(x, y, t) {
    const taper = Math.exp(-((x / 0.82) ** 6));
    const h =
      0.34 * g(x, y, -0.38, 0.02, 0.07, 0.6) +
      0.3 * g(x, y, 0.26 + 0.03 * Math.sin(t * 0.4), -0.08, 0.025, 0.05) -
      0.42 * g(x, y, 0.0 + 0.04 * Math.sin(t * 0.3), 0.06, 0.012, 0.09) +
      0.05 * Math.sin(7 * x + 4 * y + t * 0.9) +
      0.03 * Math.sin(13 * x - 9 * y - t * 1.3);
    return h * taper + 0.06 * (1 - taper) * Math.sin(3 * x + t * 0.5);
  }

  // ───────────── Rendering
  let width = 0;
  let heightPx = 0;
  const pts = new Float32Array(verts.length * 2);

  // Match the artwork to the rendered length of the title's longest line
  const title = document.querySelector(".hero h1");
  function fitToTitle() {
    if (!title) return;
    const range = document.createRange();
    range.selectNodeContents(title);
    const widest = Math.max(...[...range.getClientRects()].map((r) => r.width));
    if (widest > 0) wrap.style.width = `${Math.round(widest)}px`;
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    heightPx = canvas.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(heightPx * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(t) {
    const yaw = -0.42 + 0.22 * Math.sin(t * 0.12);
    const pitch = 0.5;
    const cy = Math.cos(yaw), sy = Math.sin(yaw);
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    const scale = width * 0.43;
    const depth = 3.2;

    for (let k = 0; k < verts.length; k++) {
      const v = verts[k];
      const X = v.x, Y = height(v.x, v.y, t), Z = v.y;
      const x1 = X * cy - Z * sy;
      const z1 = X * sy + Z * cy;
      const y2 = Y * cp - z1 * sp;
      const z2 = Y * sp + z1 * cp;
      const s = depth / (depth + z2);
      pts[2 * k] = width / 2 + x1 * s * scale;
      pts[2 * k + 1] = heightPx * 0.52 - y2 * s * scale;
    }

    ctx.clearRect(0, 0, width, heightPx);
    ctx.strokeStyle = getComputedStyle(canvas).color;
    ctx.globalAlpha = 0.7;
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    for (let e = 0; e < edges.length; e += 2) {
      const a = edges[e] * 2, b = edges[e + 1] * 2;
      ctx.moveTo(pts[a], pts[a + 1]);
      ctx.lineTo(pts[b], pts[b + 1]);
    }
    ctx.stroke();
  }

  let running = true;
  let visible = true;
  const start = performance.now();

  function frame(now) {
    if (!running) return;
    if (visible && !document.hidden) draw(reduceMotion.matches ? 8 : 8 + (now - start) / 1000);
    requestAnimationFrame(frame);
  }

  new ResizeObserver(() => {
    resize();
    draw(8);
  }).observe(canvas);
  window.addEventListener("resize", fitToTitle);
  document.fonts?.ready.then(fitToTitle);

  // Pause while the hero is off screen
  new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(canvas);

  fitToTitle();
  resize();
  requestAnimationFrame(frame);
})();
