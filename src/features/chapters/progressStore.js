import { CHAPTERS, chapterIndexById } from "./curriculum.js";

const STORAGE_KEY = "kids-math-tv.chapter-progress.v1";

function createDefaultProgress() {
  return {
    mode: "sequential",
    chapters: CHAPTERS.reduce((acc, chapter, idx) => {
      acc[chapter.id] = {
        unlocked: idx === 0,
        attempts: 0,
        correct: 0,
        hintUsed: 0,
        retries: 0,
        completed: false
      };
      return acc;
    }, {})
  };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultProgress();
    const parsed = JSON.parse(raw);
    const base = createDefaultProgress();
    for (const chapter of CHAPTERS) {
      base.chapters[chapter.id] = {
        ...base.chapters[chapter.id],
        ...(parsed?.chapters?.[chapter.id] ?? {})
      };
    }
    base.mode = parsed?.mode === "adaptive" ? "adaptive" : "sequential";
    return base;
  } catch {
    return createDefaultProgress();
  }
}

export function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function calcMastery(chapterProgress) {
  if (!chapterProgress || chapterProgress.attempts <= 0) return 0;
  const accuracy = chapterProgress.correct / chapterProgress.attempts;
  const penalty = Math.min(0.25, chapterProgress.hintUsed * 0.02 + chapterProgress.retries * 0.01);
  return Math.max(0, Math.min(1, accuracy - penalty));
}

export function applySessionResult(progress, chapterId, sessionResult) {
  const next = structuredClone(progress);
  const cp = next.chapters[chapterId];
  if (!cp) return next;

  cp.attempts += sessionResult.total;
  cp.correct += sessionResult.correct;
  cp.hintUsed += sessionResult.hintUsed ?? 0;
  cp.retries += sessionResult.retries ?? 0;

  const accuracy = sessionResult.total ? sessionResult.correct / sessionResult.total : 0;
  if (accuracy >= 0.8 && (sessionResult.hintUsed ?? 0) <= Math.floor(sessionResult.total * 0.4)) {
    cp.completed = true;
  }

  if (cp.completed) {
    const currentIdx = chapterIndexById(chapterId);
    const nextChapter = CHAPTERS[currentIdx + 1];
    if (nextChapter) next.chapters[nextChapter.id].unlocked = true;
  }

  saveProgress(next);
  return next;
}

export function pickSequentialChapter(progress) {
  return CHAPTERS.find((chapter) => progress.chapters[chapter.id]?.unlocked && !progress.chapters[chapter.id]?.completed)
    ?? CHAPTERS[CHAPTERS.length - 1];
}

export function pickAdaptiveChapter(progress) {
  const unlocked = CHAPTERS.filter((chapter) => progress.chapters[chapter.id]?.unlocked);
  if (!unlocked.length) return CHAPTERS[0];

  const weights = unlocked.map((chapter, idx) => {
    const cp = progress.chapters[chapter.id];
    const mastery = calcMastery(cp);
    const weakness = 1 - mastery;
    const novelty = cp.attempts === 0 ? 0.2 : 0;
    const explore = idx === unlocked.length - 1 ? 0.1 : 0;
    const w = weakness * 0.7 + novelty + explore;
    return { chapter, weight: Math.max(0.05, w) };
  });

  const totalWeight = weights.reduce((sum, item) => sum + item.weight, 0);
  let r = Math.random() * totalWeight;
  for (const item of weights) {
    r -= item.weight;
    if (r <= 0) return item.chapter;
  }
  return weights[weights.length - 1].chapter;
}

export function nextRecommendedChapter(progress, currentChapterId) {
  const currentIdx = chapterIndexById(currentChapterId);
  for (let i = currentIdx + 1; i < CHAPTERS.length; i += 1) {
    const chapter = CHAPTERS[i];
    if (progress.chapters[chapter.id]?.unlocked) return chapter;
  }
  return null;
}
