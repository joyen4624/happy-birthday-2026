// ==========================================================
// HIỆU ỨNG PHÁO HOA & TRÁI TIM TỐI ƯU CỰC MƯỢT (ON-DEMAND CANVAS FX)
// ==========================================================
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById("fxCanvas");
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.animationId = null;
    this.isRunning = false;

    this.resize();
    window.addEventListener("resize", () => this.resize(), { passive: true });
  }

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  // Khởi động vòng lặp vẽ CHỈ KHI có particle (tiết kiệm 100% CPU khi đứng yên)
  startLoop() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
  }

  stopLoop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  // Pháo hoa & Confetti khi thổi nến
  fireConfetti(x = this.width / 2, y = this.height / 2, count = 75) {
    const colors = ["#ff758c", "#ff7eb3", "#ffd1dc", "#ffb6c1", "#ffe4e1", "#ffd700", "#ffffff"];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 8 - 4,
        alpha: 1,
        decay: Math.random() * 0.018 + 0.01,
        gravity: 0.16,
        shape: Math.random() > 0.4 ? "rect" : "circle"
      });
    }
    this.startLoop();
  }

  // Bắn chùm tim bay lên từ dưới
  burstHearts(count = 20, originX = this.width / 2, originY = this.height * 0.8) {
    const emojis = ["💖", "💕", "✨", "💓", "🥰"];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: originX + (Math.random() * 60 - 30),
        y: originY,
        vx: (Math.random() - 0.5) * 4,
        vy: -(Math.random() * 7 + 5),
        size: Math.random() * 12 + 16,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        alpha: 1,
        decay: Math.random() * 0.016 + 0.01,
        gravity: -0.04,
        shape: "emoji"
      });
    }
    this.startLoop();
  }

  // Bắn chùm nụ hôn bay lên
  burstKisses(count = 20, originX = this.width / 2, originY = this.height * 0.8) {
    const kisses = ["💋", "❤️", "🌹", "💖"];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: originX + (Math.random() * 60 - 30),
        y: originY,
        vx: (Math.random() - 0.5) * 5,
        vy: -(Math.random() * 8 + 5),
        size: Math.random() * 14 + 18,
        emoji: kisses[Math.floor(Math.random() * kisses.length)],
        alpha: 1,
        decay: Math.random() * 0.016 + 0.01,
        gravity: -0.035,
        shape: "emoji"
      });
    }
    this.startLoop();
  }

  loop() {
    if (!this.isRunning) return;

    if (this.particles.length === 0) {
      this.stopLoop();
      return;
    }

    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);

      if (p.shape === "emoji") {
        this.ctx.font = `${p.size}px sans-serif`;
        this.ctx.textAlign = "center";
        this.ctx.fillText(p.emoji, p.x, p.y);
      } else if (p.shape === "circle") {
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      }
      this.ctx.restore();
    }

    this.animationId = requestAnimationFrame(() => this.loop());
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.particleSystem = new ParticleSystem();
});
