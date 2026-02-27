import basketFullImg from "../../../assets/fruit/basket_full_banana.jpg";

export function renderResultScreen(root, { result, onReplay }) {
  const stars = "⭐".repeat(result.stars);
  root.innerHTML = `
    <section class="screen">
      <h1 class="title">참 잘했어요!</h1>
      <p class="score">${result.correct} / ${result.total}</p>
      <div class="result-basket-wrap">
        <img class="result-basket" src="${basketFullImg}" alt="가득 찬 바구니" />
      </div>
      <p class="subtitle">평균 ${Math.round(result.avgMs / 1000)}초</p>
      <p class="subtitle">${stars}</p>
      <div class="btn-row">
        <button class="secondary-btn" data-focus="0">다시하기</button>
      </div>
    </section>
  `;

  const btn = root.querySelector("button");
  btn.classList.add("focused");
  btn.addEventListener("click", onReplay);

  return {
    focusCount: 1,
    setFocus() {},
    select() { onReplay(); }
  };
}
