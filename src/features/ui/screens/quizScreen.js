import basketEmptyImg from "../../../assets/fruit/basket_empty_new_cut.png";
import basketFrame1 from "../../../assets/fruit/basket_frame_1.png";
import basketFrame2 from "../../../assets/fruit/basket_frame_2.png";
import basketFrame3 from "../../../assets/fruit/basket_frame_3.png";
import basketFrame4 from "../../../assets/fruit/basket_frame_4.png";
import basketFrame5 from "../../../assets/fruit/basket_frame_5.png";
import basketFrame6 from "../../../assets/fruit/basket_frame_6.png";
import fxSheetImg from "../../../assets/fruit/fx_stars_sheet_cut.png";
import bananaImg from "../../../assets/fruit/banana.jpg";
import orangeImg from "../../../assets/fruit/orange.jpg";
import grapeImg from "../../../assets/fruit/grape.jpg";

const FRUITS = [bananaImg, orangeImg, grapeImg];
const BASKET_FRAMES = [basketFrame1, basketFrame2, basketFrame3, basketFrame4, basketFrame5, basketFrame6];

export function renderQuizScreen(root, {
  question,
  progressText,
  feedback,
  onChoice,
  collectedCount = 0,
  totalCount = 5
}) {
  root.innerHTML = `
    <section class="screen quiz-screen" id="quiz-screen">
      <p class="progress">${progressText}</p>

      <div class="basket-hud">
        <div class="basket-shell" id="basket-shell">
          <img class="basket-image" id="basket-image" src="${basketEmptyImg}" alt="바구니" />
          <img class="basket-sparkle" id="basket-sparkle" src="${fxSheetImg}" alt="반짝 효과" />
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
  const basketImageEl = root.querySelector("#basket-image");
  const basketSparkleEl = root.querySelector("#basket-sparkle");
  const basketCounterEl = root.querySelector("#basket-counter");
  const basketFruitsEl = root.querySelector("#basket-fruits");
  let isSubmitting = false;

  const quizScreenEl = root.querySelector("#quiz-screen");
  const buttons = [];
  let currentFocusIdx = 0;
  let collected = collectedCount;

  function fruitSrcFor(index) {
    return FRUITS[index % FRUITS.length];
  }

  function renderCollectedFruits() {
    basketCounterEl.textContent = `${collected}/${totalCount}`;
    basketFruitsEl.innerHTML = "";

    for (let i = 0; i < collected; i += 1) {
      const fruit = document.createElement("img");
      fruit.className = "basket-fruit-mini";
      fruit.src = fruitSrcFor(i);
      fruit.alt = "과일";
      basketFruitsEl.appendChild(fruit);
    }
  }

  let frameTimer = null;

  function popBasket() {
    basketShellEl.classList.remove("basket-jump");
    basketSparkleEl.classList.remove("basket-sparkle-on");

    if (frameTimer) {
      clearInterval(frameTimer);
      frameTimer = null;
    }

    let idx = 0;
    basketImageEl.src = BASKET_FRAMES[idx];

    requestAnimationFrame(() => {
      basketShellEl.classList.add("basket-jump");
      basketSparkleEl.classList.add("basket-sparkle-on");
    });

    frameTimer = setInterval(() => {
      idx += 1;
      if (idx >= BASKET_FRAMES.length) {
        clearInterval(frameTimer);
        frameTimer = null;
        basketImageEl.src = basketEmptyImg;
        basketSparkleEl.classList.remove("basket-sparkle-on");
        return;
      }
      basketImageEl.src = BASKET_FRAMES[idx];
    }, 70);
  }

  function addFruit() {
    const fromEl = buttons[currentFocusIdx] ?? choicesEl;
    const from = fromEl.getBoundingClientRect();
    const to = basketShellEl.getBoundingClientRect();

    const fly = document.createElement("img");
    fly.src = fruitSrcFor(collected);
    fly.alt = "날아가는 과일";
    fly.className = "flying-fruit";
    fly.style.left = `${from.left + from.width / 2 - 22}px`;
    fly.style.top = `${from.top + from.height / 2 - 22}px`;
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
      revealFocus();
      setFocus(idx);
    });
    btn.addEventListener("click", () => submitChoice(choice, idx));
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
