/* =========================================
   BUBBLE ENGINE — Ocean Bubbles Canvas
   Replaces confetti with underwater bubbles 🫧
   ========================================= */
(function () {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let bubbles = [];
  let animationId = null;
  let running = false;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  class Bubble {
    constructor(x, y, burst) {
      this.x = x || Math.random() * canvas.width;
      this.y = y || canvas.height + 10;
      this.size = Math.random() * 16 + 6;
      this.speedY = -(Math.random() * 2.5 + 1);
      this.speedX = (Math.random() - 0.5) * 1.2;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.04 + 0.02;
      this.opacity = 0.5 + Math.random() * 0.4;
      this.decay = Math.random() * 0.003 + 0.001;
      this.hue = 180 + Math.random() * 40; // cyan-blue range
      if (burst) {
        this.speedY = -(Math.random() * 6 + 2);
        this.speedX = (Math.random() - 0.5) * 8;
        this.decay = Math.random() * 0.008 + 0.004;
      }
    }

    update() {
      this.wobble += this.wobbleSpeed;
      this.x += this.speedX + Math.sin(this.wobble) * 0.8;
      this.y += this.speedY;
      this.opacity -= this.decay;
      this.speedY *= 0.995;
      if (this.speedX > 0) this.speedX -= 0.01;
      if (this.speedX < 0) this.speedX += 0.01;
    }

    draw() {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.opacity);

      // Outer circle
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${this.hue}, 80%, 70%, 0.6)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner glow
      const grad = ctx.createRadialGradient(
        this.x - this.size * 0.25, this.y - this.size * 0.25, this.size * 0.1,
        this.x, this.y, this.size
      );
      grad.addColorStop(0, `hsla(${this.hue}, 90%, 90%, 0.35)`);
      grad.addColorStop(0.5, `hsla(${this.hue}, 70%, 70%, 0.1)`);
      grad.addColorStop(1, `hsla(${this.hue}, 60%, 60%, 0.02)`);
      ctx.fillStyle = grad;
      ctx.fill();

      // Shine highlight
      ctx.beginPath();
      ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.18, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.5 * this.opacity})`;
      ctx.fill();

      ctx.restore();
    }
  }

  function animate() {
    if (!running && bubbles.length === 0) {
      cancelAnimationFrame(animationId);
      animationId = null;
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bubbles = bubbles.filter((b) => b.opacity > 0 && b.y > -50);
    bubbles.forEach((b) => { b.update(); b.draw(); });
    animationId = requestAnimationFrame(animate);
  }

  // Burst bubbles from point (replaces confettiBurst)
  window.confettiBurst = function (x, y, count = 30) {
    for (let i = 0; i < count; i++) {
      bubbles.push(new Bubble(x, y, true));
    }
    if (!animationId) { running = true; animate(); }
  };

  // Rain bubbles from bottom (replaces confettiRain)
  window.confettiRain = function (duration = 3000, intensity = 2) {
    running = true;
    if (!animationId) animate();
    const start = Date.now();
    const interval = setInterval(() => {
      if (Date.now() - start > duration) {
        clearInterval(interval);
        running = false;
        return;
      }
      for (let i = 0; i < intensity; i++) {
        bubbles.push(new Bubble());
      }
    }, 60);
  };
})();
