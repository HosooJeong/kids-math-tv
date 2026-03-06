import { createSession } from "../features/game-engine/createSession.js";
import { bindRemote } from "../features/input/remote.js";
import { renderHomeScreen } from "../features/ui/screens/homeScreen.js";
import { renderQuizScreen } from "../features/ui/screens/quizScreen.js";
import { renderResultScreen } from "../features/ui/screens/resultScreen.js";
import { renderProgressScreen } from "../features/ui/screens/progressScreen.js";
import { showAnswerMark } from "../features/ui/components/celebrationEffects.js";
import { createAudioManager } from "../features/audio/createAudioManager.js";
import { mountMuteToggle } from "../features/ui/components/muteToggle.js";
import { getChapterById } from "../features/chapters/curriculum.js";
import {
  applySessionResult,
  loadProgress,
  nextRecommendedChapter,
  pickAdaptiveChapter,
  pickSequentialChapter
} from "../features/chapters/progressStore.js";

export function createApp(root) {
  let session = null;
  let focusIndex = 0;
  let screenApi = null;
  let feedback = null;
  let combo = 0;
  let progress = loadProgress();
  let activeMode = "sequential";
  let activeChapter = null;

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
      onStartSequential: () => startGame("sequential"),
      onStartAdaptive: () => startGame("adaptive"),
      onShowProgress: showProgress,
      onUiSelect: () => audio.playUiSelect(),
      onInteract: () => audio.registerInteraction()
    });
  }

  function showProgress() {
    focusIndex = 0;
    audio.setBgmScene("home");
    screenApi = renderProgressScreen(root, {
      progress,
      onBack: showHome,
      onStartChapter: startChapterById,
      onUiSelect: () => audio.playUiSelect(),
      onInteract: () => audio.registerInteraction()
    });
  }

  function pickChapter(mode) {
    if (mode === "adaptive") return pickAdaptiveChapter(progress);
    return pickSequentialChapter(progress);
  }

  function startWithChapter(chapter, mode = activeMode) {
    activeMode = mode;
    activeChapter = chapter;

    session = createSession({
      total: activeChapter.total,
      chapterId: activeChapter.id,
      chapterType: activeChapter.type
    });

    feedback = null;
    combo = 0;
    showQuestion();
  }

  function startGame(mode = activeMode) {
    const chapter = pickChapter(mode);
    startWithChapter(chapter, mode);
  }

  function startChapterById(chapterId) {
    const chapter = getChapterById(chapterId);
    if (!chapter) return;
    if (!progress.chapters[chapterId]?.unlocked) return;
    startWithChapter(chapter, "sequential");
  }


  function showQuestion() {
    const question = session.nextQuestion();
    if (!question) return showResult();

    focusIndex = 0;
    audio.setBgmScene("quiz");
    screenApi = renderQuizScreen(root, {
      question,
      progressText: `${activeChapter.id} · ${activeChapter.title} · ${session.state.index + 1} / ${session.state.total}`,
      feedback,
      stageRecords: session.state.records,
      currentStageIndex: session.state.index,
      totalCount: session.state.total,
      onChoice: handleAnswer,
      onHint: handleHint,
      onUiNavigate: () => audio.playUiNavigate(),
      onUiSelect: () => audio.playUiSelect(),
      onInteract: () => audio.registerInteraction()
    });
  }

  function handleHint() {
    const hint = session.useHint();
    if (!hint) return null;
    feedback = { type: "ok", text: "힌트: 틀린 답 하나를 지웠어!" };
    return hint;
  }

  function handleAnswer(answer) {
    const result = session.submit(answer);
    if (!result) return;

    if (result.isCorrect) {
      combo += 1;
      screenApi?.markCurrentStage?.(true);
      audio.playCorrectSfx(combo);
      showAnswerMark(root, true);
      const comboText = combo >= 2 ? ` (${combo}콤보!)` : "";
      feedback = { type: "ok", text: `정답! 잘했어!${comboText}` };
    } else {
      combo = 0;
      screenApi?.markCurrentStage?.(false);
      audio.playWrongSfx();
      showAnswerMark(root, false);
      feedback = { type: "no", text: `아쉬워! 정답은 ${result.correctAnswer}야` };
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

    const beforeUnlocked = Object.entries(progress.chapters)
      .filter(([, cp]) => cp.unlocked)
      .map(([id]) => id);

    progress = applySessionResult(progress, activeChapter.id, result);

    const afterUnlocked = Object.entries(progress.chapters)
      .filter(([, cp]) => cp.unlocked)
      .map(([id]) => id);

    const newlyUnlockedId = afterUnlocked.find((id) => !beforeUnlocked.includes(id));
    const newlyUnlocked = newlyUnlockedId ? getChapterById(newlyUnlockedId) : null;

    const recommendation = nextRecommendedChapter(progress, activeChapter.id);
    focusIndex = 0;
    audio.setBgmScene("result");
    screenApi = renderResultScreen(root, {
      chapterTitle: `${activeChapter.id} ${activeChapter.title}`,
      chapterObjective: activeChapter.objective,
      unlockMessage: newlyUnlocked ? `${newlyUnlocked.id} ${newlyUnlocked.title} 챕터가 열렸어!` : null,
      result,
      recommendation: recommendation ? `${recommendation.id} ${recommendation.title}` : null,
      onReplay: () => startGame(activeMode),
      onGoHome: showHome,
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
