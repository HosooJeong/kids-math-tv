const COLORS = ["#ff8fbd", "#7c8cff", "#ffd87a", "#7ee7c7", "#8edbff"];

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
  triggerBackgroundWave();
  triggerScreenBoom();
}
