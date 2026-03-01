export const CHAPTERS = [
  { id: "1-1", world: 1, order: 1, title: "수량 인식 1~3", type: "subitize", total: 8 },
  { id: "1-2", world: 1, order: 2, title: "수량-숫자 매칭 1~5", type: "count-match", total: 8 },
  { id: "1-3", world: 1, order: 3, title: "5 만들기", type: "make-5", total: 10 },
  { id: "1-4", world: 1, order: 4, title: "덧셈 (합 5 이하)", type: "add-max-5", total: 10 },
  { id: "1-5", world: 1, order: 5, title: "덧셈 (합 10 이하)", type: "add-max-10", total: 10 },
  { id: "2-1", world: 2, order: 1, title: "10 만들기", type: "make-10", total: 10 },
  { id: "2-2", world: 2, order: 2, title: "누락수 찾기", type: "missing-addend", total: 10 },
  { id: "2-3", world: 2, order: 3, title: "뺄셈 기초 (10 이하)", type: "subtract-10", total: 10 },
  { id: "2-4", world: 2, order: 4, title: "짧은 문장제", type: "story", total: 10 },
  { id: "2-5", world: 2, order: 5, title: "혼합 복습", type: "mixed", total: 10 }
];

export function chapterIndexById(id) {
  return CHAPTERS.findIndex((c) => c.id === id);
}

export function getChapterById(id) {
  return CHAPTERS.find((c) => c.id === id) ?? null;
}
