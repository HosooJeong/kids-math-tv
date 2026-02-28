const FRUITS = ["🍌", "🍊", "🍇", "🍎"];

export function renderQuizScreen(root, {
  question,
  progressText,
  feedback,
  onChoice,
  onUiNavigate,
  onUiSelect,
  onInteract,
  collectedCount = 0,
  totalCount = 10
}) {
  root.innerHTML = `
    <section class="screen quiz-screen" id="quiz-screen">
      <p class="progress">${progressText}</p>

      <div class="basket-hud">
        <div class="basket-shell" id="basket-shell">
          <div class="basket-sparkle" id="basket-sparkle">✨</div>
          <div class="basket-character" id="basket-character">
            <div class="basket-handle"></div>
            <div class="basket-body">
              <span class="basket-face" id="basket-face">😊</span>
            </div>
          </div>
          <span class="basket-counter" id="basket-counter">${collectedCount}/${totalCount}</span>
        </div>
        <div class="basket-fruits" id="basket-fruits"></div>
      </div>

      <div class="problem">${question.prompt}</div>
      <div class="btn-row choices-row" id="choices"></div>
      <p class="feedback ${feedback?.type ?? ""}">${feedback?.text ?? ""}</p>
    </section>
  `;

  const choicesEl = root.querySelector("#choices");
  const basketShellEl = root.querySelector("#basket-shell");
  const basketFaceEl = root.querySelector("#basket-face");
  const basketSparkleEl = root.querySelector("#basket-sparkle");
  const basketCounterEl = root.querySelector("#basket-counter");
  const basketFruitsEl = root.querySelector("#basket-fruits");
  const quizScreenEl = root.querySelector("#quiz-screen");

  let isSubmitting = false;
  const buttons = [];
  let currentFocusIdx = 0;
  let collected = collectedCount;

  function fruitFor(index) {
    return FRUITS[index % FRUITS.length];
  }

  function renderCollectedFruits() {
    basketCounterEl.textContent = `${collected}/${totalCount}`;
    basketFruitsEl.innerHTML = "";

    for (let i = 0; i < collected; i += 1) {
      const fruit = document.createElement("span");
      fruit.className = "basket-fruit-mini";
      fruit.textContent = fruitFor(i);
      basketFruitsEl.appendChild(fruit);
    }
  }

  function popBasket() {
    basketShellEl.classList.remove("basket-jump");
    basketSparkleEl.classList.remove("basket-sparkle-on");
    basketFaceEl.textContent = "😆";

    requestAnimationFrame(() => {
      basketShellEl.classList.add("basket-jump");
      basketSparkleEl.classList.add("basket-sparkle-on");
    });

    setTimeout(() => {
      basketFaceEl.textContent = "😊";
      basketSparkleEl.classList.remove("basket-sparkle-on");
    }, 420);
  }

  function addFruit() {
    const fromEl = buttons[currentFocusIdx] ?? choicesEl;
    const from = fromEl.getBoundingClientRect();
    const to = basketShellEl.getBoundingClientRect();

    const fly = document.createElement("span");
    fly.className = "flying-fruit";
    fly.textContent = fruitFor(collected);
    fly.style.left = `${from.left + from.width / 2 - 20}px`;
    fly.style.top = `${from.top + from.height / 2 - 20}px`;
    fly.style.setProperty("--dx", `${to.left + to.width / 2 - (from.left + from.width / 2)}px`);
    fly.style.setProperty("--dy", `${to.top + to.height / 2 - (from.top + from.height / 2)}px`);
    document.body.appendChild(fly);

    fly.addEventListener("animationend", () => {
      fly.remove();
      collected += 1;
      renderCollectedFruits();
      popBasket();
    }, { once: true });
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

  renderCollectedFruits();
  setFocus(0);

  return {
    focusCount: buttons.length,
    setFocus,
    onNavigate: revealFocus,
    addFruit,
    select: (idx) => {
      const value = Number(buttons[idx]?.textContent);
      if (!Number.isNaN(value)) submitChoice(value, idx);
    }
  };
}
