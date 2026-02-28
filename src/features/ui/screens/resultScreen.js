export function renderResultScreen(root, { result, onReplay, onUiSelect, onInteract }) {
  const stars = "⭐".repeat(result.stars);
  const fruitRow = "🍎 🍌 🍊 🍇";

  root.innerHTML = `
    <section class="screen">
      <h1 class="title">참 잘했어요!</h1>
      <p class="score">${result.correct} / ${result.total}</p>
      <div class="result-basket-wrap">
        <div class="basket-character result-basket-character">
          <div class="basket-handle"></div>
          <div class="basket-body">
            <span class="basket-face">🥳</span>
          </div>
          <div class="result-fruits">${fruitRow}</div>
        </div>
      </div>
      <p class="subtitle">평균 ${Math.round(result.avgMs / 1000)}초</p>
      <p class="subtitle">${stars}</p>
      <div class="btn-row">
        <button class="secondary-btn" data-focus="0">다시하기</button>
      </div>
    </section>
  `;

  const btn = root.querySelector("button");
  btn.classList.add("focused");
  btn.addEventListener("pointerdown", () => {
    onInteract?.();
  });
  btn.addEventListener("click", () => {
    onInteract?.();
    onUiSelect?.();
    onReplay();
  });

  return {
    focusCount: 1,
    setFocus() {},
    select() { onReplay(); }
  };
}
