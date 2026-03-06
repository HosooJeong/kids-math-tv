import { CHAPTERS } from "../../chapters/curriculum.js";
import { calcMastery } from "../../chapters/progressStore.js";

function chapterNodeClass(cp) {
  if (cp.completed) return "is-done";
  if (cp.unlocked) return "is-open";
  return "is-locked";
}

function chapterNodeIcon(cp) {
  if (cp.completed) return "🏅";
  if (cp.unlocked) return "📘";
  return "🔒";
}

export function renderProgressScreen(root, { progress, onBack, onStartChapter, onUiSelect, onInteract }) {
  const worlds = [1, 2].map((worldNo) => {
    const chapters = CHAPTERS.filter((chapter) => chapter.world === worldNo);
    const nodes = chapters.map((chapter, idx) => {
      const cp = progress.chapters[chapter.id];
      const mastery = Math.round(calcMastery(cp) * 100);
      const status = cp.completed ? "완료" : cp.unlocked ? "학습중" : "잠김";
      const withConnector = idx < chapters.length - 1;

      return `
        <li class="chapter-node-wrap ${withConnector ? "has-connector" : ""}">
          <button
            class="chapter-node chapter-node-btn ${chapterNodeClass(cp)}"
            data-chapter-id="${chapter.id}"
            ${cp.unlocked ? "" : "disabled"}
            aria-label="${chapter.id} ${chapter.title} ${status}"
          >
            <div class="chapter-node-icon">${chapterNodeIcon(cp)}</div>
            <div class="chapter-node-title">${chapter.id}</div>
            <div class="chapter-node-name">${chapter.title}</div>
            <div class="chapter-node-objective">${chapter.objective}</div>
            <div class="chapter-node-status">${status}</div>
            <div class="chapter-node-meter" aria-hidden="true"><span style="width:${mastery}%"></span></div>
            <div class="chapter-node-meta">숙련도 ${mastery}%</div>
          </button>
        </li>
      `;
    }).join("");

    return `
      <section class="chapter-world" aria-label="월드 ${worldNo}">
        <h2 class="chapter-world-title">WORLD ${worldNo}</h2>
        <ul class="chapter-map">${nodes}</ul>
      </section>
    `;
  }).join("");

  root.innerHTML = `
    <section class="screen progress-screen">
      <div class="mascot-badge" aria-hidden="true">🧸</div>
      <h1 class="title">모험 지도</h1>
      <p class="subtitle">별을 모으며 차근차근 도전해요!</p>
      <div class="worlds-wrap">${worlds}</div>
      <div class="btn-row">
        <button class="secondary-btn" data-focus="0">뒤로가기</button>
      </div>
    </section>
  `;

  const chapterButtons = Array.from(root.querySelectorAll(".chapter-node-btn"));
  const backBtn = root.querySelector(".btn-row button");
  const buttons = [...chapterButtons, backBtn];

  function setFocus(idx) {
    buttons.forEach((button, i) => button.classList.toggle("focused", i === idx));
  }

  chapterButtons.forEach((button, idx) => {
    button.dataset.focus = String(idx);
    button.addEventListener("pointerdown", () => {
      onInteract?.();
      setFocus(idx);
    });
    button.addEventListener("click", () => {
      onInteract?.();
      onUiSelect?.();
      if (button.disabled) return;
      onStartChapter?.(button.dataset.chapterId);
    });
  });

  const backIdx = buttons.length - 1;
  backBtn.dataset.focus = String(backIdx);
  backBtn.addEventListener("pointerdown", () => {
    onInteract?.();
    setFocus(backIdx);
  });
  backBtn.addEventListener("click", () => {
    onInteract?.();
    onUiSelect?.();
    onBack();
  });

  setFocus(0);

  return {
    focusCount: buttons.length,
    setFocus,
    select(idx) {
      buttons[idx]?.click();
    }
  };
}
