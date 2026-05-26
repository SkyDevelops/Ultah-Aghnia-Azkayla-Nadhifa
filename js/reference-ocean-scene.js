/* ========================================================
   Reference Ocean Scene
   Adapted from C:/Kayla B'day 2 Years/js/admin.js
   ======================================================== */
(function () {
  "use strict";

  const canvas = document.getElementById("wishTree");
  const wrapper = document.getElementById("treeWrapper");
  if (!canvas || !wrapper) return;
  const ctx = canvas.getContext("2d");
  const tooltip = document.getElementById("treeTooltip");
  const tooltipName = document.getElementById("tooltipName");
  const tooltipMsg = document.getElementById("tooltipMsg");
  const tooltipTime = document.getElementById("tooltipTime");

  let dpr = 1, cw = 1000, ch = 600, af = 0, t = 0, sceneScale = 1;
  let fishes = [], ambBub = [], wishBub = [], snails = [];
  let nextWishAt = 0;
  let submarine, diver, ships = [], birds = [];
  const SURFACE_Y = 50;

  function getWishes() {
    const cards = Array.from(document.querySelectorAll("#publicWishesGrid .wish-card"));
    return cards.map((card) => {
      const msg = card.querySelector(".wish-card-message")?.textContent?.replace(/^"|"$/g, "").trim();
      const name = card.querySelector(".sender-name")?.textContent?.trim() || "Tamu";
      const time = card.querySelector(".sender-time")?.textContent?.trim() || "";
      return msg ? { message: msg, name, created_at: time } : null;
    }).filter(Boolean);
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = wrapper.getBoundingClientRect();
    const w = Math.max(300, Math.round(rect.width || wrapper.clientWidth || 1000));
    const isMobile = w < 560;
    const isTablet = w >= 560 && w < 900;
    sceneScale = isMobile ? 0.66 : isTablet ? 0.82 : 1;
    const ratio = isMobile ? 1.15 : isTablet ? 0.82 : 0.62;
    const minH = isMobile ? 380 : isTablet ? 470 : 560;
    const maxH = isMobile ? 560 : isTablet ? 650 : 760;
    const h = Math.max(minH, Math.min(Math.round(w * ratio), maxH));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = "100%";
    canvas.style.height = h + "px";
    wrapper.style.height = h + "px";
    wrapper.style.minHeight = h + "px";
    cw = w;
    ch = h;
  }

  const FT = [
    { e: "\u{1F420}", s: 24 }, { e: "\u{1F41F}", s: 20 }, { e: "\u{1F988}", s: 34 },
    { e: "\u{1F421}", s: 18 }, { e: "\u{1F42C}", s: 30 }, { e: "\u{1F419}", s: 26 },
    { e: "\u{1F991}", s: 22 }, { e: "\u{1F433}", s: 36 }, { e: "\u{1F980}", s: 16 },
    { e: "\u{1F93F}", s: 24 }
  ];

  function mkFish() {
    const f = FT[Math.floor(Math.random() * FT.length)];
    const r = Math.random() > 0.5;
    return {
      x: r ? -60 : cw + 60,
      y: SURFACE_Y + 28 + Math.random() * Math.max(70, ch - SURFACE_Y - 118 * sceneScale),
      spd: (0.24 + Math.random() * 0.56) * (sceneScale < 0.8 ? 0.86 : 1),
      dir: r ? 1 : -1,
      e: f.e,
      sz: (f.s + Math.random() * 7) * sceneScale,
      wo: Math.random() * 6.28,
      wa: (6 + Math.random() * 12) * sceneScale,
      ws: 0.4 + Math.random() * 0.8
    };
  }

  function initFish() {
    const count = cw < 560 ? 5 : cw < 900 ? 7 : 9;
    fishes = Array.from({ length: count }, () => {
      const f = mkFish();
      f.x = Math.random() * cw;
      return f;
    });
  }

  function drawFish(c) {
    fishes.forEach((f, i) => {
      f.x += f.spd * f.dir;
      const wy = Math.sin(t * f.ws + f.wo) * f.wa;
      if ((f.dir > 0 && f.x > cw + 90) || (f.dir < 0 && f.x < -90)) {
        fishes[i] = mkFish();
        return;
      }
      c.save();
      c.translate(f.x, f.y + wy);
      if (f.dir < 0) c.scale(-1, 1);
      c.font = f.sz + "px serif";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText(f.e, 0, 0);
      c.restore();
    });
  }

  function mkAmb() {
    return { x: Math.random() * cw, y: ch - 25, sz: (1.4 + Math.random() * 3.8) * sceneScale, spd: (0.18 + Math.random() * 0.36) * Math.max(sceneScale, 0.75), wo: Math.random() * 6.28, op: 0.08 + Math.random() * 0.15 };
  }
  function initAmb() {
    const count = cw < 560 ? 18 : cw < 900 ? 24 : 30;
    ambBub = Array.from({ length: count }, () => {
      const b = mkAmb();
      b.y = SURFACE_Y + Math.random() * (ch - SURFACE_Y - 40);
      return b;
    });
  }
  function drawAmb(c) {
    ambBub.forEach((b, i) => {
      b.y -= b.spd;
      b.wo += 0.02;
      const bx = b.x + Math.sin(b.wo) * 2;
      if (b.y < SURFACE_Y - 5) { ambBub[i] = mkAmb(); return; }
      c.save();
      c.globalAlpha = b.op;
      c.beginPath(); c.arc(bx, b.y, b.sz, 0, 6.28);
      c.strokeStyle = "rgba(135,206,235,0.5)"; c.lineWidth = 0.7; c.stroke();
      c.beginPath(); c.arc(bx - b.sz * 0.3, b.y - b.sz * 0.3, b.sz * 0.18, 0, 6.28);
      c.fillStyle = "rgba(255,255,255,0.35)"; c.fill();
      c.restore();
    });
  }

  function syncSnails() {
    const ws = getWishes();
    const floorY = ch - 28;
    snails = [];
    const emitterCount = cw < 560 ? 5 : cw < 900 ? 6 : 7;
    const wishCount = cw < 560 ? 2 : 3;
    const sp = cw / (emitterCount + 1);
    for (let i = 0; i < emitterCount; i++) {
      const isWish = i < wishCount && i < ws.length;
      const baseDelay = isWish ? 90 + i * 190 : 50 + Math.random() * 180 + i * 34;
      snails.push({ x: sp * (i + 1), y: floorY, isWish, wish: isWish ? ws[i % ws.length] : null, timer: baseDelay, openT: 0 });
    }
    if (ws.length > (cw < 560 ? 2 : 3)) {
      let wi = 0;
      snails.forEach(s => { if (s.isWish) { s.wishPool = ws; s.poolIdx = wi++; } });
    }
  }

  function drawSnails(c) {
    snails.forEach(s => {
      s.timer--;
      if (s.timer <= 0) {
        if (s.isWish && Date.now() < nextWishAt) {
          s.timer = Math.max(45, Math.round((nextWishAt - Date.now()) / 16)) + Math.random() * 35;
          return;
        }
        s.openT = 25;
        if (s.isWish) {
          const w = s.wishPool ? s.wishPool[s.poolIdx % s.wishPool.length] : s.wish;
          if (w) {
            spawnWish(s.x, s.y - 12, w);
            nextWishAt = Date.now() + 5000;
          }
          if (s.wishPool) s.poolIdx++;
        } else {
          for (let j = 0; j < 3; j++) {
            const nb = mkAmb(); nb.x = s.x + (Math.random() - 0.5) * 12; nb.y = s.y - 10; nb.sz = (2 + Math.random() * 3) * sceneScale; nb.spd = (0.3 + Math.random() * 0.3) * Math.max(sceneScale, 0.75); ambBub.push(nb);
          }
        }
        s.timer = s.isWish ? 210 + Math.random() * 260 : 150 + Math.random() * 220;
      }
      if (s.openT > 0) s.openT--;
      c.save();
      c.font = Math.round((s.openT > 0 ? 22 : 18) * sceneScale) + "px serif";
      c.textAlign = "center"; c.textBaseline = "bottom";
      c.fillText("\u{1F40C}", s.x, s.y + 12);
      c.restore();
    });
  }

  function spawnWish(x, y, wish) {
    const msg = String(wish.message || "").trim();
    if (!msg) return;
    const fs = Math.max(7.5, Math.min(11, (msg.length < 30 ? 11 : 9.5) * Math.max(sceneScale, 0.78)));
    const maxW = (msg.length < 20 ? 70 : msg.length < 50 ? 90 : 120) * Math.max(sceneScale, 0.72);
    ctx.font = "600 " + fs + "px 'Nunito',sans-serif";
    const words = msg.split(" ");
    const lines = [];
    let cur = "";
    for (const w of words) {
      const test = cur ? cur + " " + w : w;
      if (ctx.measureText(test).width > maxW * 1.5 && cur) { lines.push(cur); cur = w; }
      else cur = test;
    }
    if (cur) lines.push(cur);
    const lh = fs * 1.4;
    const r = Math.max(27 * sceneScale, Math.max(lines.length * lh / 1.6 + 10 * sceneScale, ctx.measureText(msg.slice(0, 20)).width / 1.4 + 12 * sceneScale));
    const maxR = cw < 560 ? 54 : cw < 900 ? 70 : 88;
    const activeLimit = cw < 560 ? 3 : cw < 900 ? 4 : 5;
    if (wishBub.length >= activeLimit) wishBub.splice(0, wishBub.length - activeLimit + 1);
    wishBub.push({ x, y, r: Math.min(r, maxR), spd: (0.35 + Math.random() * 0.25) * Math.max(sceneScale, 0.78), wo: Math.random() * 6.28, wa: (2 + Math.random() * 3) * sceneScale, hue: 175 + Math.random() * 45, lines, fs, op: 0, phase: "rise", msg, name: wish.name || "Tamu", time: wish.created_at || "" });
  }

  function drawWishBub(c) {
    wishBub = wishBub.filter(b => b.op > 0 || b.phase === "rise");
    wishBub.forEach(b => {
      b.y -= b.spd;
      b.wo += 0.015;
      const bx = b.x + Math.sin(b.wo) * b.wa;
      if (b.phase === "rise" && b.op < 1) b.op = Math.min(1, b.op + 0.035);
      if (b.y - b.r < SURFACE_Y + 15 && b.phase === "rise") b.phase = "fade";
      if (b.phase === "fade") { b.op -= 0.03; if (b.op <= 0) return; }
      c.save(); c.globalAlpha = b.op;
      c.shadowColor = "hsla(" + b.hue + ",80%,70%,0.35)"; c.shadowBlur = 10;
      const g = c.createRadialGradient(bx - b.r * .2, b.y - b.r * .2, b.r * .08, bx, b.y, b.r);
      g.addColorStop(0, "hsla(" + b.hue + ",70%,82%,.25)"); g.addColorStop(.7, "hsla(" + b.hue + ",60%,65%,.1)"); g.addColorStop(1, "hsla(" + b.hue + ",50%,55%,.03)");
      c.beginPath(); c.arc(bx, b.y, b.r, 0, 6.28); c.fillStyle = g; c.fill();
      c.shadowBlur = 0; c.beginPath(); c.arc(bx, b.y, b.r, 0, 6.28); c.strokeStyle = "hsla(" + b.hue + ",70%,72%,.5)"; c.lineWidth = Math.max(0.9, 1.3 * sceneScale); c.stroke();
      c.beginPath(); c.arc(bx - b.r * .3, b.y - b.r * .3, b.r * .17, 0, 6.28); c.fillStyle = "rgba(255,255,255,.35)"; c.fill();
      const lh = b.fs * 1.4, totalH = b.lines.length * lh; let sy = b.y - totalH / 2 + lh * .5;
      c.font = "600 " + b.fs + "px 'Nunito',sans-serif"; c.fillStyle = "rgba(255,255,255,.85)"; c.textAlign = "center"; c.textBaseline = "middle";
      b.lines.forEach((l, li) => c.fillText(l, bx, sy + li * lh));
      c.restore();
    });
  }

  function initSubmarine() { submarine = { x: -200 * sceneScale, y: ch - 75 * sceneScale, spd: (0.32 + Math.random() * 0.14) * Math.max(sceneScale, 0.82), dir: 1 }; }
  function drawSubmarine(c) {
    const s = submarine; s.x += s.spd * s.dir;
    if (s.x > cw + 220 * sceneScale) { s.x = -220 * sceneScale; s.y = ch - (65 + Math.random() * 30) * sceneScale; s.spd = (0.28 + Math.random() * 0.18) * Math.max(sceneScale, 0.82); }
    c.save(); c.translate(s.x, s.y); c.scale(sceneScale, sceneScale);
    c.fillStyle = "#FFD700"; c.beginPath(); c.ellipse(0, 0, 55, 22, 0, 0, 6.28); c.fill(); c.strokeStyle = "#DAA520"; c.lineWidth = 2; c.stroke();
    c.fillStyle = "#87CEEB"; c.beginPath(); c.arc(18, 0, 12, 0, 6.28); c.fill(); c.strokeStyle = "#DAA520"; c.lineWidth = Math.max(1, 1.5 * sceneScale); c.stroke();
    c.font = "14px serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("\u{1F476}", 18, 0);
    c.fillStyle = "#DAA520"; c.fillRect(-5, -22, 4, 12); c.fillRect(-8, -24, 10, 4);
    const pa = t * 8; c.save(); c.translate(-55, 0); c.rotate(pa); c.fillStyle = "#B8860B"; c.fillRect(-2, -10, 4, 20); c.fillRect(-10, -2, 20, 4); c.restore();
    for (let i = 0; i < 3; i++) { c.globalAlpha = 0.2 - i * 0.05; c.beginPath(); c.arc(-65 - i * 12, -8 + Math.sin(t * 3 + i) * 4, 3 - i * 0.5, 0, 6.28); c.strokeStyle = "rgba(135,206,235,0.6)"; c.lineWidth = 0.8; c.stroke(); }
    c.restore();
  }

  function initDiver() { diver = { x: cw + 80 * sceneScale, y: ch - 110 * sceneScale, spd: (0.22 + Math.random() * 0.1) * Math.max(sceneScale, 0.82), dir: -1, wo: Math.random() * 6.28 }; }
  function drawDiver(c) {
    const d = diver; d.x += d.spd * d.dir; d.wo += 0.02;
    const dy = d.y + Math.sin(d.wo) * 8;
    if (d.x < -80 * sceneScale) { d.x = cw + 80 * sceneScale; d.y = ch - (100 + Math.random() * 40) * sceneScale; d.spd = (0.2 + Math.random() * 0.15) * Math.max(sceneScale, 0.82); }
    c.save(); c.translate(d.x, dy); c.scale(d.dir, 1); c.font = Math.round(30 * sceneScale) + "px serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("\u{1F93F}", 0, 0); c.restore();
  }

  function initShips() {
    ships = [];
    const types = ["\u{26F5}", "\u{1F6A2}", "\u{26F5}"];
    for (let i = 0; i < 3; i++) {
      const r = Math.random() > 0.5;
      ships.push({ x: r ? -60 : cw + 60, y: SURFACE_Y - 8, spd: (0.18 + Math.random() * 0.26) * Math.max(sceneScale, 0.82), dir: r ? 1 : -1, e: types[i], sz: (22 + Math.random() * 10) * sceneScale, wo: Math.random() * 6.28, delay: i * 180 });
    }
  }
  function drawShips(c) {
    ships.forEach((s) => {
      if (s.delay > 0) { s.delay--; return; }
      s.x += s.spd * s.dir; s.wo += 0.012;
      const sy = s.y + Math.sin(s.wo) * 2;
      if ((s.dir > 0 && s.x > cw + 80) || (s.dir < 0 && s.x < -80)) { s.dir *= -1; s.x = s.dir > 0 ? -70 : cw + 70; s.spd = (0.15 + Math.random() * 0.3) * Math.max(sceneScale, 0.82); }
      c.save(); c.translate(s.x, sy); if (s.dir < 0) c.scale(-1, 1); c.font = s.sz + "px serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(s.e, 0, 0); c.restore();
    });
  }

  function initBirds() {
    birds = [];
    for (let i = 0; i < 5; i++) {
      const r = Math.random() > 0.5, onWater = i < 2;
      birds.push({ x: r ? -40 : cw + 40, y: onWater ? SURFACE_Y - 14 : 5 + Math.random() * 25, spd: onWater ? 0.1 + Math.random() * 0.15 : 0.5 + Math.random() * 0.5, dir: r ? 1 : -1, onWater, wo: Math.random() * 6.28, flapPhase: Math.random() * 6.28 });
    }
  }
  function drawBirds(c) {
    birds.forEach((b) => {
      b.x += b.spd * b.dir; b.wo += 0.015; b.flapPhase += 0.08;
      if ((b.dir > 0 && b.x > cw + 50) || (b.dir < 0 && b.x < -50)) { b.dir *= -1; b.x = b.dir > 0 ? -40 : cw + 40; if (!b.onWater) b.y = 3 + Math.random() * 20; }
      c.save(); const by = b.onWater ? b.y + Math.sin(b.wo) * 1.5 : b.y + Math.sin(b.wo) * 3; c.translate(b.x, by); if (b.dir < 0) c.scale(-1, 1);
      if (b.onWater) { c.font = Math.round(14 * sceneScale) + "px serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("\u{1F426}", 0, 0); }
      else { const flap = Math.sin(b.flapPhase) * 4; c.strokeStyle = "rgba(50,50,50,0.6)"; c.lineWidth = Math.max(1, 1.5 * sceneScale); c.lineCap = "round"; c.beginPath(); c.moveTo(-8 * sceneScale, flap); c.quadraticCurveTo(-3 * sceneScale, -2 * sceneScale + flap * .3, 0, 0); c.quadraticCurveTo(3 * sceneScale, -2 * sceneScale + flap * .3, 8 * sceneScale, flap); c.stroke(); }
      c.restore();
    });
  }

  function drawBG(c) {
    const sg = c.createLinearGradient(0, 0, 0, SURFACE_Y); sg.addColorStop(0, "#6EC6FF"); sg.addColorStop(1, "#B0E0FF"); c.fillStyle = sg; c.fillRect(0, 0, cw, SURFACE_Y);
    c.save(); c.globalAlpha = .7; c.font = Math.round(26 * sceneScale) + "px serif"; c.fillText("\u{2600}\u{FE0F}", cw - 50, 22); c.restore();
    c.save(); c.globalAlpha = .4; c.font = Math.round(18 * sceneScale) + "px serif"; c.fillText("\u{2601}\u{FE0F}", cw * .15 + Math.sin(t * .1) * 10, 16); c.fillText("\u{2601}\u{FE0F}", cw * .5 + Math.sin(t * .08 + 1) * 8, 12); c.fillText("\u{2601}\u{FE0F}", cw * .78 + Math.sin(t * .12 + 2) * 6, 18); c.restore();
    c.beginPath(); c.moveTo(0, SURFACE_Y); for (let x = 0; x <= cw; x += 5) c.lineTo(x, SURFACE_Y + Math.sin(x * .025 + t * .8) * 3 + Math.sin(x * .05 + t * .5) * 1.5); c.lineTo(cw, ch); c.lineTo(0, ch); c.closePath();
    const wg = c.createLinearGradient(0, SURFACE_Y, 0, ch); wg.addColorStop(0, "#0077B6"); wg.addColorStop(.3, "#023E8A"); wg.addColorStop(.65, "#03045E"); wg.addColorStop(1, "#020024"); c.fillStyle = wg; c.fill();
    c.save(); c.globalAlpha = .04; for (let i = 0; i < 5; i++) { const rx = cw * (.12 + i * .19), sw = Math.sin(t * .25 + i * .8) * 16; c.beginPath(); c.moveTo(rx - 10 + sw * .4, SURFACE_Y); c.lineTo(rx - 35 + sw, ch * .7); c.lineTo(rx + 35 + sw, ch * .7); c.lineTo(rx + 10 + sw * .4, SURFACE_Y); c.closePath(); c.fillStyle = "#ADD8E6"; c.fill(); } c.restore();
    const fy = ch - 28; const fg = c.createLinearGradient(0, fy, 0, ch); fg.addColorStop(0, "rgba(194,178,128,.2)"); fg.addColorStop(1, "rgba(120,100,60,.35)"); c.fillStyle = fg; c.beginPath(); c.moveTo(0, fy); for (let x = 0; x <= cw; x += 25) c.lineTo(x, fy + Math.sin(x * .04 + t * .4) * 3.5); c.lineTo(cw, ch); c.lineTo(0, ch); c.closePath(); c.fill();
    for (let i = 0; i < 9; i++) { const sx = cw * .06 + i * (cw * .1), sh = 30 + (i % 3) * 10, sw = Math.sin(t * .7 + i * 1.1) * 9; c.save(); c.beginPath(); c.moveTo(sx, fy + 2); c.quadraticCurveTo(sx + sw, fy + 2 - sh * .55, sx + sw * .5, fy + 2 - sh); c.strokeStyle = "rgba(34,139,34," + (.13 + Math.sin(t * .5 + i) * .03) + ")"; c.lineWidth = 2.5; c.lineCap = "round"; c.stroke(); c.restore(); }
    c.save(); c.font = Math.round(14 * sceneScale) + "px serif"; c.textAlign = "center"; c.textBaseline = "bottom"; [[cw * .08, "\u{1FAB8}"], [cw * .3, "\u{1FAA8}"], [cw * .52, "\u{1FAB8}"], [cw * .7, "\u{1FAA8}"], [cw * .88, "\u{1FAB8}"]].forEach(([x, e]) => c.fillText(e, x, fy + 12)); c.restore();
  }

  function loop() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, cw, ch);
    drawBG(ctx); drawAmb(ctx); drawFish(ctx); drawSubmarine(ctx); drawDiver(ctx); drawWishBub(ctx); drawSnails(ctx); drawShips(ctx); drawBirds(ctx);
    t += 0.016; af = requestAnimationFrame(loop);
  }

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * canvas.width / rect.width / dpr;
    const my = (e.clientY - rect.top) * canvas.height / rect.height / dpr;
    let hovered = null;
    for (let i = wishBub.length - 1; i >= 0; i--) {
      const b = wishBub[i]; const bx = b.x + Math.sin(b.wo) * b.wa;
      if (Math.hypot(mx - bx, my - b.y) <= b.r && b.op > .12) { hovered = b; break; }
    }
    if (hovered && tooltip) {
      tooltip.style.left = (e.clientX - rect.left + 15) + "px";
      tooltip.style.top = (e.clientY - rect.top - 15) + "px";
      tooltip.classList.add("visible");
      if (tooltipName) tooltipName.textContent = "\u{1FAE7} Ucapan";
      if (tooltipMsg) tooltipMsg.textContent = hovered.msg;
      if (tooltipTime) tooltipTime.textContent = hovered.name;
    } else if (tooltip) {
      tooltip.classList.remove("visible");
    }
  });

  function init() {
    cancelAnimationFrame(af);
    resize(); initFish(); initAmb(); initSubmarine(); initDiver(); initShips(); initBirds(); syncSnails(); loop();
  }
  window.addEventListener("resize", init);
  window.addEventListener("load", () => setTimeout(init, 150));
  setTimeout(init, 500);
  setInterval(syncSnails, 7000);
})();

