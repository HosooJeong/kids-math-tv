function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function makeChoices(answer, { min = 1, max = 20 } = {}) {
  const pool = new Set([answer]);
  while (pool.size < 3) {
    const offset = randomInt(-3, 3) || 1;
    pool.add(Math.max(min, Math.min(max, answer + offset)));
  }
  return shuffle([...pool]);
}

function fruitRow(n) {
  return "🍎 ".repeat(n).trim();
}

function createQuestion(prompt, answer, meta = {}, options = {}) {
  const choices = makeChoices(answer, options);
  return {
    id: crypto.randomUUID(),
    prompt,
    choices,
    answer,
    meta
  };
}

function generateSubitize() {
  const n = randomInt(1, 3);
  return createQuestion(`${fruitRow(n)}\n몇 개일까?`, n, { type: "subitize" }, { min: 1, max: 5 });
}

function generateCountMatch() {
  const n = randomInt(1, 5);
  return createQuestion(`${fruitRow(n)}\n숫자를 골라봐!`, n, { type: "count-match" }, { min: 1, max: 7 });
}

function generateMake5() {
  const a = randomInt(1, 4);
  const answer = 5 - a;
  return createQuestion(`${a} + □ = 5`, answer, { type: "make-5", a }, { min: 1, max: 5 });
}

function generateAddMax(maxSum) {
  const a = randomInt(1, Math.min(9, maxSum - 1));
  const b = randomInt(1, Math.min(9, maxSum - a));
  const answer = a + b;
  return createQuestion(`${a} + ${b} = ?`, answer, { type: "add", a, b }, { min: 1, max: 18 });
}

function generateMake10() {
  const a = randomInt(1, 9);
  const answer = 10 - a;
  return createQuestion(`${a} + □ = 10`, answer, { type: "make-10", a }, { min: 1, max: 10 });
}

function generateMissingAddend() {
  const total = randomInt(4, 10);
  const add = randomInt(1, total - 1);
  const answer = total - add;
  return createQuestion(`□ + ${add} = ${total}`, answer, { type: "missing-addend", total, add }, { min: 1, max: 10 });
}

function generateSubtract10() {
  const a = randomInt(2, 10);
  const b = randomInt(1, a - 1);
  const answer = a - b;
  return createQuestion(`${a} - ${b} = ?`, answer, { type: "subtract", a, b }, { min: 1, max: 10 });
}

function generateStory() {
  const scenarios = [
    () => {
      const a = randomInt(1, 6);
      const b = randomInt(1, 4);
      return {
        prompt: `사과가 ${a}개 있어.\n${b}개 더 받았어.\n모두 몇 개일까?`,
        answer: a + b,
        meta: { kind: "add", a, b }
      };
    },
    () => {
      const a = randomInt(4, 10);
      const b = randomInt(1, Math.min(4, a - 1));
      return {
        prompt: `바구니에 귤이 ${a}개 있어.\n${b}개를 먹었어.\n남은 건 몇 개일까?`,
        answer: a - b,
        meta: { kind: "subtract", a, b }
      };
    },
    () => {
      const total = randomInt(5, 10);
      const a = randomInt(1, total - 1);
      return {
        prompt: `포도 ${a}송이가 있어.\n모두 ${total}송이가 되려면\n몇 송이가 더 필요할까?`,
        answer: total - a,
        meta: { kind: "missing", total, a }
      };
    }
  ];

  const scenario = scenarios[randomInt(0, scenarios.length - 1)]();
  return createQuestion(scenario.prompt, scenario.answer, { type: "story", ...scenario.meta }, { min: 1, max: 12 });
}

export function generateChapterQuestion(chapterType) {
  switch (chapterType) {
    case "subitize":
      return generateSubitize();
    case "count-match":
      return generateCountMatch();
    case "make-5":
      return generateMake5();
    case "add-max-5":
      return generateAddMax(5);
    case "add-max-10":
      return generateAddMax(10);
    case "make-10":
      return generateMake10();
    case "missing-addend":
      return generateMissingAddend();
    case "subtract-10":
      return generateSubtract10();
    case "story":
      return generateStory();
    case "mixed": {
      const types = ["add-max-10", "make-10", "missing-addend", "subtract-10", "story"];
      return generateChapterQuestion(types[randomInt(0, types.length - 1)]);
    }
    default:
      return generateAddMax(10);
  }
}
