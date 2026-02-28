const COLORS = ["#ff8fbd", "#7c8cff", "#ffd87a", "#7ee7c7", "#8edbff"];

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  return audioCtx;
}

function tone(ctx, freq, start, duration, gainValue = 0.12, type = "sine") {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.03);
}

function playLayeredSuccessSound(combo = 0) {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume().catch(() => {});

  const now = ctx.currentTime;
  const boost = Math.min(combo * 0.01, 0.05);

  // Layer 1: bright ding
  tone(ctx, 660, now, 0.16, 0.12 + boost, "triangle");
  tone(ctx, 990, now + 0.07, 0.2, 0.1 + boost, "triangle");

  // Layer 2: soft clap-like pulse
  tone(ctx, 220, now + 0.02, 0.08, 0.06 + boost, "square");
  tone(ctx, 330, now + 0.1, 0.1, 0.05 + boost, "square");
}

function ensureLayer(root) {
  let layer = root.querySelector(".fx-layer");
  if (!layer) {
    layer = document.createElement("div");
    layer.className = "fx-layer";
    root.appendChild(layer);
  }
  return layer;
}

function spawnConfettiAndStars(root, combo = 0) {
  const layer = ensureLayer(root);
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const waves = 2;

  for (let wave = 0; wave < waves; wave += 1) {
    const baseCount = 34;
    const extra = Math.min(combo * 5, 40);
    const total = baseCount + extra;
    const spread = 640 + wave * 140;
    const delay = wave * 110;

    for (let i = 0; i < total; i += 1) {
      const p = document.createElement("span");
      const isStar = i % 3 === 0;
      p.className = `fx-particle ${isStar ? "star" : "confetti"}`;
      p.textContent = isStar ? "⭐" : "";
      p.style.setProperty("--x", `${centerX}px`);
      p.style.setProperty("--y", `${centerY}px`);
      p.style.setProperty("--dx", `${(Math.random() - 0.5) * spread}px`);
      p.style.setProperty("--dy", `${-150 - Math.random() * (340 + wave * 80)}px`);
      p.style.setProperty("--rot", `${(Math.random() - 0.5) * 760}deg`);
      p.style.setProperty("--dur", `${760 + Math.random() * 580}ms`);
      p.style.setProperty("--delay", `${delay}ms`);
      p.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
      layer.appendChild(p);
      p.addEventListener("animationend", () => p.remove(), { once: true });
    }
  }
}

function triggerBackgroundWave() {
  document.body.classList.remove("bg-wave");
  void document.body.offsetWidth;
  document.body.classList.add("bg-wave");
  setTimeout(() => document.body.classList.remove("bg-wave"), 760);
}

function triggerScreenBoom() {
  document.body.classList.remove("fx-boom");
  void document.body.offsetWidth;
  document.body.classList.add("fx-boom");
  setTimeout(() => document.body.classList.remove("fx-boom"), 380);
}

export function playCorrectEffects(root, combo = 0) {
  spawnConfettiAndStars(root, combo);
  playLayeredSuccessSound(combo);
  triggerBackgroundWave();
  triggerScreenBoom();
}
