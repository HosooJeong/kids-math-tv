import { createSession } from "../features/game-engine/createSession.js";
import { bindRemote } from "../features/input/remote.js";
import { renderHomeScreen } from "../features/ui/screens/homeScreen.js";
import { renderQuizScreen } from "../features/ui/screens/quizScreen.js";
import { renderResultScreen } from "../features/ui/screens/resultScreen.js";
import { playCorrectEffects } from "../features/ui/components/celebrationEffects.js";
import { createAudioManager } from "../features/audio/createAudioManager.js";
import { mountMuteToggle } from "../features/ui/components/muteToggle.js";

export function createApp(root) {
  let session = null;
  let focusIndex = 0;
  let screenApi = null;
  let feedback = null;
  let combo = 0;
  const audio = createAudioManager();
  const muteToggle = mountMuteToggle({
    isMuted: () => audio.isMuted(),
    onToggle: () => audio.toggleMute(),
    onInteract: () => audio.registerInteraction()
  });

  audio.onMuteChange(() => muteToggle.render());

  function clampFocus() {
    if (!screenApi) return;
    if (focusIndex < 0) focusIndex = screenApi.focusCount - 1;
    if (focusIndex >= screenApi.focusCount) focusIndex = 0;
    screenApi.setFocus(focusIndex);
  }

  function showHome() {
    focusIndex = 0;
    audio.setBgmScene("home");
    screenApi = renderHomeScreen(root, {
      onStart: startGame,
      onUiSelect: () => audio.playUiSelect(),
      onInteract: () => audio.registerInteraction()
    });
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
    audio.setBgmScene("quiz");
    screenApi = renderQuizScreen(root, {
      question,
      progressText: `${session.state.index + 1} / ${session.state.total}`,
      feedback,
      stageRecords: session.state.records,
      currentStageIndex: session.state.index,
      totalCount: session.state.total,
      onChoice: handleAnswer,
      onUiNavigate: () => audio.playUiNavigate(),
      onUiSelect: () => audio.playUiSelect(),
      onInteract: () => audio.registerInteraction()
    });
  }

  function handleAnswer(answer) {
    const result = session.submit(answer);
    if (!result) return;

    if (result.isCorrect) {
      combo += 1;
      screenApi?.markCurrentStage?.(true);
      audio.playCorrectSfx(combo);
      playCorrectEffects(root, combo);
      const comboText = combo >= 2 ? ` (${combo}콤보!)` : "";
      feedback = { type: "ok", text: `정답! 잘했어! 🎉${comboText}` };
    } else {
      combo = 0;
      screenApi?.markCurrentStage?.(false);
      audio.playWrongSfx();
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
    audio.setBgmScene("result");
    screenApi = renderResultScreen(root, {
      result,
      onReplay: startGame,
      onUiSelect: () => audio.playUiSelect(),
      onInteract: () => audio.registerInteraction()
    });
  }

  bindRemote({
    onLeft: () => {
      audio.registerInteraction();
      if ((screenApi?.focusCount ?? 0) > 1) {
        audio.playUiNavigate();
      }
      screenApi?.onNavigate?.();
      focusIndex -= 1;
      clampFocus();
    },
    onRight: () => {
      audio.registerInteraction();
      if ((screenApi?.focusCount ?? 0) > 1) {
        audio.playUiNavigate();
      }
      screenApi?.onNavigate?.();
      focusIndex += 1;
      clampFocus();
    },
    onSelect: () => {
      audio.registerInteraction();
      audio.playUiSelect();
      screenApi?.select?.(focusIndex);
    }
  });

  showHome();
}
