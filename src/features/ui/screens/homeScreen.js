export function renderHomeScreen(root, { onStart, onUiSelect, onInteract }) {
  root.innerHTML = `
    <section class="screen">
      <h1 class="title">숫자 친구 게임</h1>
      <p class="subtitle">한 자리 수 더하기를 해볼까?</p>
      <div class="btn-row">
        <button class="primary-btn" data-focus="0">시작하기</button>
      </div>
      <p class="subtitle hint-text">리모컨 방향키 + 확인(Enter)로 조작해요</p>
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
    onStart();
  });

  return {
    focusCount: 1,
    setFocus() {},
    select() { onStart(); }
  };
}
