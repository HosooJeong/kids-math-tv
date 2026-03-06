function ensureLayer(root) {
  let layer = root.querySelector(".fx-layer");
  if (!layer) {
    layer = document.createElement("div");
    layer.className = "fx-layer";
    root.appendChild(layer);
  }
  return layer;
}

function clearMarks(layer) {
  layer.querySelectorAll(".answer-mark").forEach((el) => el.remove());
}

export function showAnswerMark(root, isCorrect) {
  const layer = ensureLayer(root);
  clearMarks(layer);

  const mark = document.createElement("div");
  mark.className = `answer-mark ${isCorrect ? "correct" : "wrong"}`;
  mark.setAttribute("aria-hidden", "true");

  if (isCorrect) {
    mark.innerHTML = `<div class="answer-circle">정답!</div>`;
  } else {
    mark.innerHTML = `<div class="answer-cross">✕</div>`;
  }

  layer.appendChild(mark);
  mark.addEventListener("animationend", () => mark.remove(), { once: true });
}
