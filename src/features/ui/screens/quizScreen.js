export function renderQuizScreen(root, { question, progressText, feedback, onChoice }) {
  root.innerHTML = `
    <section class="screen quiz-screen" id="quiz-screen">
      <p class="progress">${progressText}</p>
      <div class="problem">${question.prompt}</div>
      <div class="btn-row choices-row" id="choices"></div>
      <p class="feedback ${feedback?.type ?? ""}">${feedback?.text ?? ""}</p>
    </section>
  `;

  const choicesEl = root.querySelector("#choices");
  let isSubmitting = false;

  const quizScreenEl = root.querySelector("#quiz-screen");
  const buttons = [];

  function revealFocus() {
    quizScreenEl.classList.add("show-focus");
  }

  function setFocus(idx) {
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
      revealFocus();
      setFocus(idx);
    });
    btn.addEventListener("click", () => submitChoice(choice, idx));
    choicesEl.appendChild(btn);
    buttons.push(btn);
  });

  setFocus(0);

  return {
    focusCount: buttons.length,
    setFocus,
    onNavigate: revealFocus,
    select: (idx) => {
      const value = Number(buttons[idx]?.textContent);
      if (!Number.isNaN(value)) submitChoice(value, idx);
    }
  };
}
