import { CHAPTERS } from "../../chapters/curriculum.js";
import { calcMastery } from "../../chapters/progressStore.js";

export function renderProgressScreen(root, { progress, onBack, onUiSelect, onInteract }) {
  const items = CHAPTERS.map((chapter) => {
    const cp = progress.chapters[chapter.id];
    const mastery = Math.round(calcMastery(cp) * 100);
    const status = cp.completed ? "완료" : cp.unlocked ? "학습중" : "잠김";
    return `<li class="progress-item">${chapter.id} ${chapter.title} · ${status} · 숙련도 ${mastery}%</li>`;
  }).join("");

  root.innerHTML = `
    <section class="screen">
      <h1 class="title">진도 보기</h1>
      <p class="subtitle">챕터별 진행 상태야</p>
      <ul class="progress-list">${items}</ul>
      <div class="btn-row">
        <button class="secondary-btn" data-focus="0">뒤로가기</button>
      </div>
    </section>
  `;

  const btn = root.querySelector("button");
  btn.classList.add("focused");
  btn.addEventListener("pointerdown", () => onInteract?.());
  btn.addEventListener("click", () => {
    onInteract?.();
    onUiSelect?.();
    onBack();
  });

  return {
    focusCount: 1,
    setFocus() {},
    select() { onBack(); }
  };
}
