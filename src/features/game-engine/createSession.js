import { generateChapterQuestion } from "../modes/chapter/generator.js";

export function createSession({ total = 10, chapterId = "1-1", chapterType = "add-max-10" } = {}) {
  const state = {
    total,
    chapterId,
    chapterType,
    index: 0,
    correct: 0,
    records: [],
    currentQuestion: null,
    hintUsed: 0,
    retries: 0
  };

  function nextQuestion() {
    if (state.index >= state.total) return null;
    state.currentQuestion = generateChapterQuestion(state.chapterType);
    return state.currentQuestion;
  }

  function submit(answer) {
    if (!state.currentQuestion) return null;
    const isCorrect = Number(answer) === state.currentQuestion.answer;
    if (isCorrect) state.correct += 1;

    state.records.push({
      chapterId: state.chapterId,
      questionId: state.currentQuestion.id,
      answer: Number(answer),
      correctAnswer: state.currentQuestion.answer,
      isCorrect
    });

    state.index += 1;
    return {
      isCorrect,
      correctAnswer: state.currentQuestion.answer,
      done: state.index >= state.total
    };
  }

  function result() {
    const ratio = state.total ? state.correct / state.total : 0;
    const stars = ratio >= 0.9 ? 3 : ratio >= 0.6 ? 2 : 1;
    return {
      chapterId: state.chapterId,
      total: state.total,
      correct: state.correct,
      stars,
      hintUsed: state.hintUsed,
      retries: state.retries
    };
  }

  return { state, nextQuestion, submit, result };
}
