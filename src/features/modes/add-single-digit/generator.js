function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeChoices(answer) {
  const pool = new Set([answer]);
  while (pool.size < 3) {
    const offset = randomInt(-3, 3);
    const n = Math.max(0, Math.min(18, answer + offset + (offset === 0 ? 1 : 0)));
    pool.add(n);
  }
  return [...pool].sort(() => Math.random() - 0.5);
}

export function generateAddSingleDigitQuestion(level = 1) {
  const max = level <= 1 ? 5 : 9;
  // 유아 모드: 0 더하기는 제외 (1~max)
  const a = randomInt(1, max);
  const b = randomInt(1, max);
  const answer = a + b;

  return {
    id: crypto.randomUUID(),
    prompt: `${a} + ${b} = ?`,
    choices: makeChoices(answer),
    answer,
    meta: { a, b, op: "+", level }
  };
}
