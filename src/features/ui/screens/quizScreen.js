export function renderQuizScreen(root, { question, progressText, feedback, onChoice }) {
  root.innerHTML = `
    <section class="screen">
      <p class="progress">${progressText}</p>
      <div class="problem">${question.prompt}</div>
      <div class="btn-row" id="choices"></div>
      <p class="feedback ${feedback?.type ?? ""}">${feedback?.text ?? ""}</p>
    </section>
  `;

  const choicesEl = root.querySelector("#choices");
  question.choices.forEach((choice, idx) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.dataset.focus = String(idx);
    btn.textContent = String(choice);
    btn.addEventListener("click", () => onChoice(choice));
    choicesEl.appendChild(btn);
  });

  const buttons = [...root.querySelectorAll(".choice-btn")];

  function setFocus(idx) {
    buttons.forEach((b, i) => b.classList.toggle("focused", i === idx));
  }

  setFocus(0);

  return {
    focusCount: buttons.length,
    setFocus,
    select: (idx) => {
      const value = Number(buttons[idx]?.textContent);
      if (!Number.isNaN(value)) onChoice(value);
    }
  };
}
