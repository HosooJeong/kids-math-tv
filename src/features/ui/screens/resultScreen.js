export function renderResultScreen(root, { chapterTitle, result, recommendation, onReplay, onGoHome, onUiSelect, onInteract }) {
  const stars = "⭐".repeat(result.stars);
  const fruitRow = "🍎 🍌 🍊 🍇";

  root.innerHTML = `
    <section class="screen">
      <h1 class="title">참 잘했어요!</h1>
      <p class="subtitle">${chapterTitle}</p>
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
      <p class="subtitle">${stars}</p>
      <p class="subtitle hint-text">다음 추천: ${recommendation ?? "현재 챕터 복습"}</p>
      <div class="btn-row">
        <button class="secondary-btn" data-focus="0">같은 모드 계속</button>
        <button class="secondary-btn" data-focus="1">홈으로</button>
      </div>
    </section>
  `;

  const buttons = Array.from(root.querySelectorAll("button"));
  function setFocus(idx) {
    buttons.forEach((button, i) => button.classList.toggle("focused", i === idx));
  }

  buttons.forEach((btn, idx) => {
    btn.addEventListener("pointerdown", () => {
      onInteract?.();
      setFocus(idx);
    });
    btn.addEventListener("click", () => {
      onInteract?.();
      onUiSelect?.();
      if (idx === 0) onReplay();
      if (idx === 1) onGoHome();
    });
  });

  setFocus(0);

  return {
    focusCount: buttons.length,
    setFocus,
    select(idx) {
      const selected = buttons[idx];
      selected?.click();
    }
  };
}
