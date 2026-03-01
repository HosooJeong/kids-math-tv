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

export function renderProgressScreen(root, { progress, onBack, onUiSelect, onInteract }) {
  const worlds = [1, 2].map((worldNo) => {
    const chapters = CHAPTERS.filter((chapter) => chapter.world === worldNo);
    const nodes = chapters.map((chapter, idx) => {
      const cp = progress.chapters[chapter.id];
      const mastery = Math.round(calcMastery(cp) * 100);
      const status = cp.completed ? "완료" : cp.unlocked ? "학습중" : "잠김";
      const withConnector = idx < chapters.length - 1;

      return `
        <li class="chapter-node-wrap ${withConnector ? "has-connector" : ""}">
          <div class="chapter-node ${chapterNodeClass(cp)}">
            <div class="chapter-node-icon">${chapterNodeIcon(cp)}</div>
            <div class="chapter-node-title">${chapter.id}</div>
            <div class="chapter-node-name">${chapter.title}</div>
            <div class="chapter-node-status">${status}</div>
            <div class="chapter-node-meter" aria-hidden="true"><span style="width:${mastery}%"></span></div>
            <div class="chapter-node-meta">숙련도 ${mastery}%</div>
          </div>
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
    <section class="screen">
      <h1 class="title">진도 지도</h1>
      <p class="subtitle">월드 순서대로 챕터를 진행해보자</p>
      <div class="worlds-wrap">${worlds}</div>
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
