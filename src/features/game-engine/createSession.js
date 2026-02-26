import { generateAddSingleDigitQuestion } from "../modes/add-single-digit/generator.js";

export function createSession({ total = 5, level = 1 } = {}) {
  const state = {
    total,
    level,
    index: 0,
    correct: 0,
    startedAt: performance.now(),
    records: [],
    currentQuestion: null
  };

  function nextQuestion() {
    if (state.index >= state.total) return null;
    state.currentQuestion = generateAddSingleDigitQuestion(state.level);
    return state.currentQuestion;
  }

  function submit(answer) {
    if (!state.currentQuestion) return null;
    const isCorrect = Number(answer) === state.currentQuestion.answer;
    if (isCorrect) state.correct += 1;

    state.records.push({
      questionId: state.currentQuestion.id,
      answer: Number(answer),
      correctAnswer: state.currentQuestion.answer,
      isCorrect,
      atMs: performance.now() - state.startedAt
    });

    state.index += 1;
    return {
      isCorrect,
      correctAnswer: state.currentQuestion.answer,
      done: state.index >= state.total
    };
  }

  function result() {
    const elapsedMs = performance.now() - state.startedAt;
    const avgMs = state.records.length ? elapsedMs / state.records.length : 0;
    const ratio = state.total ? state.correct / state.total : 0;
    const stars = ratio >= 0.9 ? 3 : ratio >= 0.6 ? 2 : 1;
    return {
      total: state.total,
      correct: state.correct,
      avgMs: Math.round(avgMs),
      stars
    };
  }

  return { state, nextQuestion, submit, result };
}
