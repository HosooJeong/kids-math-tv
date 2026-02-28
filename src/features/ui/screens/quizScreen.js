function stageStateFromRecord(record) {
  return record?.isCorrect ? "correct" : "wrong";
}

function buildStageSlots(totalCount) {
  return Array.from({ length: totalCount }, (_, idx) => (
    `<span class="stage-slot state-pending" data-stage-idx="${idx}" role="listitem">☆</span>`
  )).join("");
}

function applyStageState(slot, state) {
  slot.classList.remove("state-pending", "state-correct", "state-wrong");
  slot.classList.add(`state-${state}`);
  slot.textContent = state === "pending" ? "☆" : "★";

  const index = Number(slot.dataset.stageIdx) + 1;
  const labelByState = {
    pending: "대기",
    correct: "정답",
    wrong: "오답"
  };
  slot.setAttribute("aria-label", `${index}번 단계 ${labelByState[state]}`);
}

export function renderQuizScreen(root, {
  question,
  progressText,
  feedback,
  onChoice,
  onUiNavigate,
  onUiSelect,
  onInteract,
  stageRecords = [],
  currentStageIndex = 0,
  totalCount = 10
}) {
  root.innerHTML = `
    <section class="screen quiz-screen" id="quiz-screen">
      <p class="progress">${progressText}</p>
      <div class="stage-map" id="stage-map" role="list" aria-label="라운드 진행 상태">
        ${buildStageSlots(totalCount)}
      </div>

      <div class="problem">${question.prompt}</div>
      <div class="btn-row choices-row" id="choices"></div>
      <p class="feedback ${feedback?.type ?? ""}">${feedback?.text ?? ""}</p>
    </section>
  `;

  const choicesEl = root.querySelector("#choices");
  const quizScreenEl = root.querySelector("#quiz-screen");
  const stageSlots = Array.from(root.querySelectorAll("[data-stage-idx]"));

  let isSubmitting = false;
  const buttons = [];
  let currentFocusIdx = 0;

  function renderStageMap() {
    stageSlots.forEach((slot, idx) => {
      const record = stageRecords[idx];
      const state = record ? stageStateFromRecord(record) : "pending";
      applyStageState(slot, state);
      slot.classList.toggle("is-current", idx === currentStageIndex);
    });
  }

  function markCurrentStage(isCorrect) {
    const slot = stageSlots[currentStageIndex];
    if (!slot) return;
    applyStageState(slot, isCorrect ? "correct" : "wrong");
    slot.classList.add("is-current");
  }

  function revealFocus() {
    quizScreenEl.classList.add("show-focus");
  }

  function setFocus(idx) {
    currentFocusIdx = idx;
    buttons.forEach((b, i) => b.classList.toggle("focused", i === idx));
  }

  function submitChoice(choice, idx) {
    if (isSubmitting) return;
    isSubmitting = true;
    revealFocus();
    setFocus(idx);
    setTimeout(() => {
      onChoice(choice);
      isSubmitting = false;
    }, 90);
  }

  question.choices.forEach((choice, idx) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.dataset.focus = String(idx);
    btn.textContent = String(choice);
    btn.addEventListener("pointerdown", () => {
      onInteract?.();
      onUiNavigate?.();
      revealFocus();
      setFocus(idx);
    });
    btn.addEventListener("click", () => {
      onInteract?.();
      onUiSelect?.();
      submitChoice(choice, idx);
    });
    choicesEl.appendChild(btn);
    buttons.push(btn);
  });

  renderStageMap();
  setFocus(0);

  return {
    focusCount: buttons.length,
    setFocus,
    onNavigate: revealFocus,
    markCurrentStage,
    select: (idx) => {
      const value = Number(buttons[idx]?.textContent);
      if (!Number.isNaN(value)) submitChoice(value, idx);
    }
  };
}
