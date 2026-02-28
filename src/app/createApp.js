import { createSession } from "../features/game-engine/createSession.js";
import { bindRemote } from "../features/input/remote.js";
import { renderHomeScreen } from "../features/ui/screens/homeScreen.js";
import { renderQuizScreen } from "../features/ui/screens/quizScreen.js";
import { renderResultScreen } from "../features/ui/screens/resultScreen.js";
import { playCorrectEffects } from "../features/ui/components/celebrationEffects.js";

export function createApp(root) {
  let session = null;
  let focusIndex = 0;
  let screenApi = null;
  let feedback = null;
  let combo = 0;

  function clampFocus() {
    if (!screenApi) return;
    if (focusIndex < 0) focusIndex = screenApi.focusCount - 1;
    if (focusIndex >= screenApi.focusCount) focusIndex = 0;
    screenApi.setFocus(focusIndex);
  }

  function showHome() {
    focusIndex = 0;
    screenApi = renderHomeScreen(root, { onStart: startGame });
  }

  function startGame() {
    session = createSession({ total: 10, level: 2 });
    feedback = null;
    combo = 0;
    showQuestion();
  }

  function showQuestion() {
    const question = session.nextQuestion();
    if (!question) return showResult();

    focusIndex = 0;
    screenApi = renderQuizScreen(root, {
      question,
      progressText: `${session.state.index + 1} / ${session.state.total}`,
      feedback,
      collectedCount: session.state.correct,
      totalCount: session.state.total,
      onChoice: handleAnswer
    });
  }

  function handleAnswer(answer) {
    const result = session.submit(answer);
    if (!result) return;

    if (result.isCorrect) {
      combo += 1;
      screenApi?.addFruit?.();
      playCorrectEffects(root, combo);
      const comboText = combo >= 2 ? ` (${combo}콤보!)` : "";
      feedback = { type: "ok", text: `정답! 잘했어! 🎉${comboText}` };
    } else {
      combo = 0;
      feedback = { type: "no", text: `아쉬워! 정답은 ${result.correctAnswer}야 🙂` };
    }

    setTimeout(() => {
      if (result.done) {
        showResult();
      } else {
        showQuestion();
      }
    }, 700);
  }

  function showResult() {
    const result = session.result();
    focusIndex = 0;
    screenApi = renderResultScreen(root, { result, onReplay: startGame });
  }

  bindRemote({
    onLeft: () => {
      screenApi?.onNavigate?.();
      focusIndex -= 1;
      clampFocus();
    },
    onRight: () => {
      screenApi?.onNavigate?.();
      focusIndex += 1;
      clampFocus();
    },
    onSelect: () => {
      screenApi?.select?.(focusIndex);
    }
  });

  showHome();
}
