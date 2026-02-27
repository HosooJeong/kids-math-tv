(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(r){if(r.ep)return;r.ep=!0;const o=t(r);fetch(r.href,o)}})();function $(s,e){return Math.floor(Math.random()*(e-s+1))+s}function P(s){const e=new Set([s]);for(;e.size<3;){const t=$(-3,3),n=Math.max(0,Math.min(18,s+t+(t===0?1:0)));e.add(n)}return[...e].sort(()=>Math.random()-.5)}function O(s=1){const e=s<=1?5:9,t=$(1,e),n=$(1,e),r=t+n;return{id:crypto.randomUUID(),prompt:`${t} + ${n} = ?`,choices:P(r),answer:r,meta:{a:t,b:n,op:"+",level:s}}}function R({total:s=5,level:e=1}={}){const t={total:s,level:e,index:0,correct:0,startedAt:performance.now(),records:[],currentQuestion:null};function n(){return t.index>=t.total?null:(t.currentQuestion=O(t.level),t.currentQuestion)}function r(a){if(!t.currentQuestion)return null;const l=Number(a)===t.currentQuestion.answer;return l&&(t.correct+=1),t.records.push({questionId:t.currentQuestion.id,answer:Number(a),correctAnswer:t.currentQuestion.answer,isCorrect:l,atMs:performance.now()-t.startedAt}),t.index+=1,{isCorrect:l,correctAnswer:t.currentQuestion.answer,done:t.index>=t.total}}function o(){const a=performance.now()-t.startedAt,l=t.records.length?a/t.records.length:0,p=t.total?t.correct/t.total:0,i=p>=.9?3:p>=.6?2:1;return{total:t.total,correct:t.correct,avgMs:Math.round(l),stars:i}}return{state:t,nextQuestion:n,submit:r,result:o}}function A({onLeft:s,onRight:e,onSelect:t}){function n(r){const o=r.key;["ArrowLeft","ArrowRight","Enter"," ","Spacebar"].includes(o)&&r.preventDefault(),o==="ArrowLeft"&&(s==null||s()),o==="ArrowRight"&&(e==null||e()),(o==="Enter"||o===" "||o==="Spacebar")&&(t==null||t())}return window.addEventListener("keydown",n),()=>window.removeEventListener("keydown",n)}function H(s,{onStart:e}){s.innerHTML=`
    <section class="screen">
      <h1 class="title">숫자 친구 게임</h1>
      <p class="subtitle">한 자리 수 더하기를 해볼까?</p>
      <div class="btn-row">
        <button class="primary-btn" data-focus="0">시작하기</button>
      </div>
      <p class="subtitle hint-text">리모컨 방향키 + 확인(Enter)로 조작해요</p>
    </section>
  `;const t=s.querySelector("button");return t.classList.add("focused"),t.addEventListener("click",e),{focusCount:1,setFocus(){},select(){e()}}}const T=["🍌","🍊","🍇","🍎"];function I(s,{question:e,progressText:t,feedback:n,onChoice:r,collectedCount:o=0,totalCount:a=5}){s.innerHTML=`
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
          <span class="basket-counter" id="basket-counter">${o}/${a}</span>
        </div>
        <div class="basket-fruits" id="basket-fruits"></div>
      </div>

      <div class="problem">${e.prompt}</div>
      <div class="btn-row choices-row" id="choices"></div>
      <p class="feedback ${(n==null?void 0:n.type)??""}">${(n==null?void 0:n.text)??""}</p>
    </section>
  `;const l=s.querySelector("#choices"),p=s.querySelector("#basket-shell"),i=s.querySelector("#basket-face"),b=s.querySelector("#basket-sparkle"),g=s.querySelector("#basket-counter"),u=s.querySelector("#basket-fruits"),h=s.querySelector("#quiz-screen");let y=!1;const v=[];let E=0,w=o;function S(d){return T[d%T.length]}function M(){g.textContent=`${w}/${a}`,u.innerHTML="";for(let d=0;d<w;d+=1){const c=document.createElement("span");c.className="basket-fruit-mini",c.textContent=S(d),u.appendChild(c)}}function F(){p.classList.remove("basket-jump"),b.classList.remove("basket-sparkle-on"),i.textContent="😆",requestAnimationFrame(()=>{p.classList.add("basket-jump"),b.classList.add("basket-sparkle-on")}),setTimeout(()=>{i.textContent="😊",b.classList.remove("basket-sparkle-on")},420)}function Q(){const c=(v[E]??l).getBoundingClientRect(),f=p.getBoundingClientRect(),m=document.createElement("span");m.className="flying-fruit",m.textContent=S(w),m.style.left=`${c.left+c.width/2-20}px`,m.style.top=`${c.top+c.height/2-20}px`,m.style.setProperty("--dx",`${f.left+f.width/2-(c.left+c.width/2)}px`),m.style.setProperty("--dy",`${f.top+f.height/2-(c.top+c.height/2)}px`),document.body.appendChild(m),m.addEventListener("animationend",()=>{m.remove(),w+=1,M(),F()},{once:!0})}function C(){h.classList.add("show-focus")}function k(d){E=d,v.forEach((c,f)=>c.classList.toggle("focused",f===d))}function q(d,c){y||(y=!0,C(),k(c),setTimeout(()=>{r(d),y=!1},90))}return e.choices.forEach((d,c)=>{const f=document.createElement("button");f.className="choice-btn",f.dataset.focus=String(c),f.textContent=String(d),f.addEventListener("pointerdown",()=>{C(),k(c)}),f.addEventListener("click",()=>q(d,c)),l.appendChild(f),v.push(f)}),M(),k(0),{focusCount:v.length,setFocus:k,onNavigate:C,addFruit:Q,select:d=>{var f;const c=Number((f=v[d])==null?void 0:f.textContent);Number.isNaN(c)||q(c,d)}}}function z(s,{result:e,onReplay:t}){const n="⭐".repeat(e.stars),r="🍎 🍌 🍊 🍇";s.innerHTML=`
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
      <p class="subtitle">${n}</p>
      <div class="btn-row">
        <button class="secondary-btn" data-focus="0">다시하기</button>
      </div>
    </section>
  `;const o=s.querySelector("button");return o.classList.add("focused"),o.addEventListener("click",t),{focusCount:1,setFocus(){},select(){t()}}}const N=["#ff8fbd","#7c8cff","#ffd87a","#7ee7c7","#8edbff"];let L=null;function B(){if(!L){const s=window.AudioContext||window.webkitAudioContext;if(!s)return null;L=new s}return L}function x(s,e,t,n,r=.12,o="sine"){const a=s.createOscillator(),l=s.createGain();a.type=o,a.frequency.setValueAtTime(e,t),l.gain.setValueAtTime(1e-4,t),l.gain.exponentialRampToValueAtTime(r,t+.02),l.gain.exponentialRampToValueAtTime(1e-4,t+n),a.connect(l).connect(s.destination),a.start(t),a.stop(t+n+.03)}function V(s=0){const e=B();if(!e)return;e.state==="suspended"&&e.resume().catch(()=>{});const t=e.currentTime,n=Math.min(s*.01,.05);x(e,660,t,.16,.12+n,"triangle"),x(e,990,t+.07,.2,.1+n,"triangle"),x(e,220,t+.02,.08,.06+n,"square"),x(e,330,t+.1,.1,.05+n,"square")}function D(s){let e=s.querySelector(".fx-layer");return e||(e=document.createElement("div"),e.className="fx-layer",s.appendChild(e)),e}function U(s,e=0){const t=D(s),n=24,r=Math.min(e*3,24),o=n+r,a=window.innerWidth/2,l=window.innerHeight/2;for(let p=0;p<o;p+=1){const i=document.createElement("span"),b=p%4===0;i.className=`fx-particle ${b?"star":"confetti"}`,i.textContent=b?"⭐":"",i.style.setProperty("--x",`${a}px`),i.style.setProperty("--y",`${l}px`),i.style.setProperty("--dx",`${(Math.random()-.5)*560}px`),i.style.setProperty("--dy",`${-120-Math.random()*320}px`),i.style.setProperty("--rot",`${(Math.random()-.5)*480}deg`),i.style.setProperty("--dur",`${700+Math.random()*450}ms`),i.style.background=N[Math.floor(Math.random()*N.length)],t.appendChild(i),i.addEventListener("animationend",()=>i.remove(),{once:!0})}}function W(){document.body.classList.remove("bg-wave"),document.body.offsetWidth,document.body.classList.add("bg-wave"),setTimeout(()=>document.body.classList.remove("bg-wave"),760)}function j(s,e=0){U(s,e),V(e),W()}function G(s){let e=null,t=0,n=null,r=null,o=0;function a(){n&&(t<0&&(t=n.focusCount-1),t>=n.focusCount&&(t=0),n.setFocus(t))}function l(){t=0,n=H(s,{onStart:p})}function p(){e=R({total:5,level:2}),r=null,o=0,i()}function i(){const u=e.nextQuestion();if(!u)return g();t=0,n=I(s,{question:u,progressText:`${e.state.index+1} / ${e.state.total}`,feedback:r,collectedCount:e.state.correct,totalCount:e.state.total,onChoice:b})}function b(u){var y;const h=e.submit(u);h&&(h.isCorrect?(o+=1,(y=n==null?void 0:n.addFruit)==null||y.call(n),j(s,o),r={type:"ok",text:`정답! 잘했어! 🎉${o>=2?` (${o}콤보!)`:""}`}):(o=0,r={type:"no",text:`아쉬워! 정답은 ${h.correctAnswer}야 🙂`}),setTimeout(()=>{h.done?g():i()},700))}function g(){const u=e.result();t=0,n=z(s,{result:u,onReplay:p})}A({onLeft:()=>{var u;(u=n==null?void 0:n.onNavigate)==null||u.call(n),t-=1,a()},onRight:()=>{var u;(u=n==null?void 0:n.onNavigate)==null||u.call(n),t+=1,a()},onSelect:()=>{var u;(u=n==null?void 0:n.select)==null||u.call(n,t)}}),l()}G(document.querySelector("#app"));
