(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function t(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=t(r);fetch(r.href,o)}})();function $(n,e){return Math.floor(Math.random()*(e-n+1))+n}function Q(n){const e=new Set([n]);for(;e.size<3;){const t=$(-3,3),s=Math.max(0,Math.min(18,n+t+(t===0?1:0)));e.add(s)}return[...e].sort(()=>Math.random()-.5)}function O(n=1){const e=n<=1?5:9,t=$(1,e),s=$(1,e),r=t+s;return{id:crypto.randomUUID(),prompt:`${t} + ${s} = ?`,choices:Q(r),answer:r,meta:{a:t,b:s,op:"+",level:n}}}function R({total:n=10,level:e=1}={}){const t={total:n,level:e,index:0,correct:0,startedAt:performance.now(),records:[],currentQuestion:null};function s(){return t.index>=t.total?null:(t.currentQuestion=O(t.level),t.currentQuestion)}function r(c){if(!t.currentQuestion)return null;const f=Number(c)===t.currentQuestion.answer;return f&&(t.correct+=1),t.records.push({questionId:t.currentQuestion.id,answer:Number(c),correctAnswer:t.currentQuestion.answer,isCorrect:f,atMs:performance.now()-t.startedAt}),t.index+=1,{isCorrect:f,correctAnswer:t.currentQuestion.answer,done:t.index>=t.total}}function o(){const c=performance.now()-t.startedAt,f=t.records.length?c/t.records.length:0,m=t.total?t.correct/t.total:0,p=m>=.9?3:m>=.6?2:1;return{total:t.total,correct:t.correct,avgMs:Math.round(f),stars:p}}return{state:t,nextQuestion:s,submit:r,result:o}}function A({onLeft:n,onRight:e,onSelect:t}){function s(r){const o=r.key;["ArrowLeft","ArrowRight","Enter"," ","Spacebar"].includes(o)&&r.preventDefault(),o==="ArrowLeft"&&(n==null||n()),o==="ArrowRight"&&(e==null||e()),(o==="Enter"||o===" "||o==="Spacebar")&&(t==null||t())}return window.addEventListener("keydown",s),()=>window.removeEventListener("keydown",s)}function H(n,{onStart:e}){n.innerHTML=`
    <section class="screen">
      <h1 class="title">숫자 친구 게임</h1>
      <p class="subtitle">한 자리 수 더하기를 해볼까?</p>
      <div class="btn-row">
        <button class="primary-btn" data-focus="0">시작하기</button>
      </div>
      <p class="subtitle hint-text">리모컨 방향키 + 확인(Enter)로 조작해요</p>
    </section>
  `;const t=n.querySelector("button");return t.classList.add("focused"),t.addEventListener("click",e),{focusCount:1,setFocus(){},select(){e()}}}const T=["🍌","🍊","🍇","🍎"];function I(n,{question:e,progressText:t,feedback:s,onChoice:r,collectedCount:o=0,totalCount:c=10}){n.innerHTML=`
    <section class="screen quiz-screen" id="quiz-screen">
      <p class="progress">${t}</p>

      <div class="basket-hud">
        <div class="basket-shell" id="basket-shell">
          <div class="basket-sparkle" id="basket-sparkle">✨</div>
          <div class="basket-character" id="basket-character">
            <div class="basket-handle"></div>
            <div class="basket-body">
              <span class="basket-face" id="basket-face">😊</span>
            </div>
          </div>
          <span class="basket-counter" id="basket-counter">${o}/${c}</span>
        </div>
        <div class="basket-fruits" id="basket-fruits"></div>
      </div>

      <div class="problem">${e.prompt}</div>
      <div class="btn-row choices-row" id="choices"></div>
      <p class="feedback ${(s==null?void 0:s.type)??""}">${(s==null?void 0:s.text)??""}</p>
    </section>
  `;const f=n.querySelector("#choices"),m=n.querySelector("#basket-shell"),p=n.querySelector("#basket-face"),y=n.querySelector("#basket-sparkle"),v=n.querySelector("#basket-counter"),i=n.querySelector("#basket-fruits"),u=n.querySelector("#quiz-screen");let b=!1;const g=[];let S=0,w=o;function E(l){return T[l%T.length]}function M(){v.textContent=`${w}/${c}`,i.innerHTML="";for(let l=0;l<w;l+=1){const a=document.createElement("span");a.className="basket-fruit-mini",a.textContent=E(l),i.appendChild(a)}}function F(){m.classList.remove("basket-jump"),y.classList.remove("basket-sparkle-on"),p.textContent="😆",requestAnimationFrame(()=>{m.classList.add("basket-jump"),y.classList.add("basket-sparkle-on")}),setTimeout(()=>{p.textContent="😊",y.classList.remove("basket-sparkle-on")},420)}function P(){const a=(g[S]??f).getBoundingClientRect(),d=m.getBoundingClientRect(),h=document.createElement("span");h.className="flying-fruit",h.textContent=E(w),h.style.left=`${a.left+a.width/2-20}px`,h.style.top=`${a.top+a.height/2-20}px`,h.style.setProperty("--dx",`${d.left+d.width/2-(a.left+a.width/2)}px`),h.style.setProperty("--dy",`${d.top+d.height/2-(a.top+a.height/2)}px`),document.body.appendChild(h),h.addEventListener("animationend",()=>{h.remove(),w+=1,M(),F()},{once:!0})}function C(){u.classList.add("show-focus")}function x(l){S=l,g.forEach((a,d)=>a.classList.toggle("focused",d===l))}function q(l,a){b||(b=!0,C(),x(a),setTimeout(()=>{r(l),b=!1},90))}return e.choices.forEach((l,a)=>{const d=document.createElement("button");d.className="choice-btn",d.dataset.focus=String(a),d.textContent=String(l),d.addEventListener("pointerdown",()=>{C(),x(a)}),d.addEventListener("click",()=>q(l,a)),f.appendChild(d),g.push(d)}),M(),x(0),{focusCount:g.length,setFocus:x,onNavigate:C,addFruit:P,select:l=>{var d;const a=Number((d=g[l])==null?void 0:d.textContent);Number.isNaN(a)||q(a,l)}}}function z(n,{result:e,onReplay:t}){const s="⭐".repeat(e.stars),r="🍎 🍌 🍊 🍇";n.innerHTML=`
    <section class="screen">
      <h1 class="title">참 잘했어요!</h1>
      <p class="score">${e.correct} / ${e.total}</p>
      <div class="result-basket-wrap">
        <div class="basket-character result-basket-character">
          <div class="basket-handle"></div>
          <div class="basket-body">
            <span class="basket-face">🥳</span>
          </div>
          <div class="result-fruits">${r}</div>
        </div>
      </div>
      <p class="subtitle">평균 ${Math.round(e.avgMs/1e3)}초</p>
      <p class="subtitle">${s}</p>
      <div class="btn-row">
        <button class="secondary-btn" data-focus="0">다시하기</button>
      </div>
    </section>
  `;const o=n.querySelector("button");return o.classList.add("focused"),o.addEventListener("click",t),{focusCount:1,setFocus(){},select(){t()}}}const N=["#ff8fbd","#7c8cff","#ffd87a","#7ee7c7","#8edbff"];let L=null;function B(){if(!L){const n=window.AudioContext||window.webkitAudioContext;if(!n)return null;L=new n}return L}function k(n,e,t,s,r=.12,o="sine"){const c=n.createOscillator(),f=n.createGain();c.type=o,c.frequency.setValueAtTime(e,t),f.gain.setValueAtTime(1e-4,t),f.gain.exponentialRampToValueAtTime(r,t+.02),f.gain.exponentialRampToValueAtTime(1e-4,t+s),c.connect(f).connect(n.destination),c.start(t),c.stop(t+s+.03)}function V(n=0){const e=B();if(!e)return;e.state==="suspended"&&e.resume().catch(()=>{});const t=e.currentTime,s=Math.min(n*.01,.05);k(e,660,t,.16,.12+s,"triangle"),k(e,990,t+.07,.2,.1+s,"triangle"),k(e,220,t+.02,.08,.06+s,"square"),k(e,330,t+.1,.1,.05+s,"square")}function W(n){let e=n.querySelector(".fx-layer");return e||(e=document.createElement("div"),e.className="fx-layer",n.appendChild(e)),e}function D(n,e=0){const t=W(n),s=window.innerWidth/2,r=window.innerHeight/2,o=2;for(let c=0;c<o;c+=1){const p=34+Math.min(e*5,40),y=640+c*140,v=c*110;for(let i=0;i<p;i+=1){const u=document.createElement("span"),b=i%3===0;u.className=`fx-particle ${b?"star":"confetti"}`,u.textContent=b?"⭐":"",u.style.setProperty("--x",`${s}px`),u.style.setProperty("--y",`${r}px`),u.style.setProperty("--dx",`${(Math.random()-.5)*y}px`),u.style.setProperty("--dy",`${-150-Math.random()*(340+c*80)}px`),u.style.setProperty("--rot",`${(Math.random()-.5)*760}deg`),u.style.setProperty("--dur",`${760+Math.random()*580}ms`),u.style.setProperty("--delay",`${v}ms`),u.style.background=N[Math.floor(Math.random()*N.length)],t.appendChild(u),u.addEventListener("animationend",()=>u.remove(),{once:!0})}}}function U(){document.body.classList.remove("bg-wave"),document.body.offsetWidth,document.body.classList.add("bg-wave"),setTimeout(()=>document.body.classList.remove("bg-wave"),760)}function j(){document.body.classList.remove("fx-boom"),document.body.offsetWidth,document.body.classList.add("fx-boom"),setTimeout(()=>document.body.classList.remove("fx-boom"),380)}function G(n,e=0){D(n,e),V(e),U(),j()}function K(n){let e=null,t=0,s=null,r=null,o=0;function c(){s&&(t<0&&(t=s.focusCount-1),t>=s.focusCount&&(t=0),s.setFocus(t))}function f(){t=0,s=H(n,{onStart:m})}function m(){e=R({total:10,level:2}),r=null,o=0,p()}function p(){const i=e.nextQuestion();if(!i)return v();t=0,s=I(n,{question:i,progressText:`${e.state.index+1} / ${e.state.total}`,feedback:r,collectedCount:e.state.correct,totalCount:e.state.total,onChoice:y})}function y(i){var b;const u=e.submit(i);u&&(u.isCorrect?(o+=1,(b=s==null?void 0:s.addFruit)==null||b.call(s),G(n,o),r={type:"ok",text:`정답! 잘했어! 🎉${o>=2?` (${o}콤보!)`:""}`}):(o=0,r={type:"no",text:`아쉬워! 정답은 ${u.correctAnswer}야 🙂`}),setTimeout(()=>{u.done?v():p()},700))}function v(){const i=e.result();t=0,s=z(n,{result:i,onReplay:m})}A({onLeft:()=>{var i;(i=s==null?void 0:s.onNavigate)==null||i.call(s),t-=1,c()},onRight:()=>{var i;(i=s==null?void 0:s.onNavigate)==null||i.call(s),t+=1,c()},onSelect:()=>{var i;(i=s==null?void 0:s.select)==null||i.call(s,t)}}),f()}K(document.querySelector("#app"));
