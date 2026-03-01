export function renderHomeScreen(root, { onStartSequential, onStartAdaptive, onShowProgress, onUiSelect, onInteract }) {
  root.innerHTML = `
    <section class="screen">
      <h1 class="title">숫자 친구 게임</h1>
      <p class="subtitle">챕터를 골라서 재밌게 수학하자!</p>
      <div class="btn-row home-actions" id="home-actions">
        <button class="primary-btn" data-focus="0">순차 학습</button>
        <button class="secondary-btn" data-focus="1">맞춤 랜덤</button>
        <button class="secondary-btn" data-focus="2">진도 보기</button>
      </div>
      <p class="subtitle hint-text">리모컨 방향키 + 확인(Enter)로 조작해요</p>
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
      if (idx === 0) onStartSequential();
      if (idx === 1) onStartAdaptive();
      if (idx === 2) onShowProgress();
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
