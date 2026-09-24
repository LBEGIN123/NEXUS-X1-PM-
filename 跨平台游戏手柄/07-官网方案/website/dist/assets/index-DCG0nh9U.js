(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function e(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(o){if(o.ep)return;o.ep=!0;const n=e(o);fetch(o.href,n)}})();const ee=416,A=0,te=228,K=415,P=K-A+1,ae=200,q=t=>`/frames/f_${String(Math.max(1,Math.min(ee,t+1))).padStart(4,"0")}.webp`,se=document.querySelector("#app"),x=window.matchMedia("(prefers-reduced-motion: reduce)");let U=0,R=0,N=0,I=0,O=0,X=-1,B="",G=-1,S=!1,E={x:0,y:0},g={x:0,y:0};const _=new Set,oe=`
  <div class="site-shell" data-theme="blue">
    <header class="site-nav">
      <a class="brand-button" href="#hero" aria-label="返回 Nexus 首屏">NEXUS</a>
      <div class="nav-actions">
        <button class="nav-cta" data-toast="预约通道即将开放">立即预约</button>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-menu">
          <span class="menu-label">MENU</span>
          <span class="menu-glyph" aria-hidden="true"><i></i><i></i></span>
        </button>
      </div>
    </header>

    <div class="site-menu" id="site-menu" aria-hidden="true">
      <nav class="site-menu-nav" aria-label="页面章节">
        <a href="#hero" data-menu-link><span>01</span><strong>外观</strong><small>DESIGN</small></a>
        <a href="#switch" data-menu-link><span>02</span><strong>切换</strong><small>SWITCH</small></a>
        <a href="#control" data-menu-link><span>03</span><strong>操控</strong><small>CONTROL</small></a>
        <a href="#dock" data-menu-link><span>04</span><strong>底座</strong><small>WIRELESS DOCK</small></a>
        <a href="#purchase" data-menu-link><span>05</span><strong>购买</strong><small>PURCHASE</small></a>
        <a href="#specifications" data-menu-link><span>06</span><strong>规格</strong><small>SPECIFICATIONS</small></a>
      </nav>
      <p class="site-menu-note">NEXUS / CROSS-PLATFORM CONTROLLER</p>
    </div>

    <div class="scroll-rail" aria-hidden="true"><span></span></div>

    <main>
      <section class="hero-sequence-section sequence-section" id="hero" data-sequence>
        <div class="sequence-stage hero-sequence-stage scene" data-scene>
          <div class="scene-backdrop"></div>
          <div class="scene-halo halo-orange" data-depth="ambient"></div>
          <div class="scene-halo halo-blue" data-depth="light"></div>
          <div class="particle-field" data-depth="particles" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
          <img class="sequence-frame hero-sequence-frame scene-frame" src="${q(A)}" alt="Nexus 跨平台游戏手柄外观帧序列" width="1600" height="900" />
          <div class="hero-shade"></div>
          <div class="sequence-copy hero-copy copy-left" data-beat="hero">
            <p class="eyebrow">NEXUS / CROSS-PLATFORM CONTROLLER</p>
            <p class="hero-kicker">掌控，不设边界</p>
            <h1>一按切换，<br />继续游戏。</h1>
            <p class="hero-intro">跨平台游戏手柄，按一下换平台，不需要重新配对。</p>
            <div class="hero-rule"></div>
            <div class="hero-meta"><span>三模连接</span><span>配对记忆</span><span>799 元</span></div>
            <button class="button button-gold" data-toast="预约通道即将开放">立即预约</button>
          </div>
          <div class="sequence-copy copy-left" data-beat="detail">
            <p class="eyebrow">01 / APPEARANCE</p>
            <h2>先看见它，<br />再理解它。</h2>
            <p>材质、轮廓光和握持姿态随着滚动慢慢展开。产品始终是画面主体。</p>
          </div>
          <div class="sequence-copy copy-right" data-beat="hero-end">
            <p class="eyebrow">MATERIAL / FORM</p>
            <h2>光线先于参数<br />说明手感。</h2>
            <p>白色细纹壳体、深蓝底壳与金色摇杆环，在同一束光里保持边界。</p>
          </div>
          <div class="sequence-copy copy-left" data-beat="appearance">
            <p class="eyebrow">APPEARANCE / DETAIL</p>
            <h2>细节，<br />不止一面。</h2>
            <p>从机身轮廓到摇杆环，外观帧序列持续展开，直到正面完整定格。</p>
          </div>
          <span class="stage-index">01 / 06</span>
        </div>
      </section>

      <section class="feature-section feature-switch" id="switch" data-section="switch" data-theme="blue">
        <div class="feature-visual scene" data-scene><div class="scene-halo halo-blue"></div><img class="feature-frame platform-visual scene-frame" src="/platforms/connection-map.png" alt="Nexus 跨平台手柄全平台连接展示图" width="1600" height="900" /><canvas class="platform-morph" data-platform-morph aria-hidden="true"></canvas><div class="hero-shade"></div></div>
        <div class="feature-copy copy-right">
          <p class="eyebrow">02 / SWITCH</p>
          <h2>按一下，<br />换到下一个平台。</h2>
          <p>配对记忆和连接反馈被收进一个确定动作。你只需要决定去哪里，不需要重复设置。</p>
          <div class="switch-demo" aria-label="一键切换概念演示"><div class="platform-row" role="radiogroup" aria-label="选择连接平台"><span class="platform-thumb" aria-hidden="true"></span><button class="platform-chip" role="radio" aria-checked="false" data-platform="PC" data-platform-image="/platforms/pc.png">PC</button><button class="platform-chip" role="radio" aria-checked="false" data-platform="Switch" data-platform-image="/platforms/switch.png">Switch</button><button class="platform-chip" role="radio" aria-checked="false" data-platform="PS5" data-platform-image="/platforms/ps5.png">PS5</button><button class="platform-chip" role="radio" aria-checked="false" data-platform="Xbox" data-platform-image="/platforms/xbox.png">Xbox</button><button class="platform-chip" role="radio" aria-checked="false" data-platform="Mobile" data-platform-image="/platforms/mobile.png">手机</button></div><p class="demo-status" aria-live="polite">等待选择 · 全平台</p></div>
          <div class="chapter-points"><span>配对记忆</span><span>三模连接</span><span>即时反馈</span></div>
        </div><span class="stage-index">02 / 06</span>
      </section>

      <section class="control-sequence" id="control" data-section="control" data-theme="violet" data-control-sequence>
        <article class="control-panel is-active" data-control-panel data-panel-index="0" aria-label="霍尔摇杆">
          <div class="control-panel-visual scene" data-scene><img class="control-detail-image control-image-stick" src="/control/joystick.png" alt="Nexus 霍尔摇杆细节" width="1254" height="1254" /><div class="control-panel-shade"></div></div>
          <div class="control-panel-copy copy-left"><p class="eyebrow">03 / CONTROL / STICK</p><h2>霍尔摇杆：<br />把漂移留在过去。</h2><p>采用霍尔或 TMR 非接触式摇杆，不使用碳膜。方向输出保持线性，回中更稳定，长期高频操作后仍能维持清楚的控制边界。</p><div class="control-metrics"><div><strong>12 个月</strong><span>无可感知漂移</span></div><div><strong>≤ 8 ms</strong><span>2.4G 无线延迟</span></div><div><strong>1000 Hz</strong><span>PC 有线回报率</span></div></div></div><span class="stage-index">03 / 06</span>
        </article>
        <article class="control-panel" data-control-panel data-panel-index="1" aria-label="霍尔扳机">
          <div class="control-panel-visual scene" data-scene><img class="control-detail-image control-image-trigger" src="/control/trigger.png" alt="Nexus 霍尔扳机细节" width="1254" height="1254" /><div class="control-panel-shade"></div></div>
          <div class="control-panel-copy copy-right"><p class="eyebrow">03 / CONTROL / TRIGGER</p><h2>霍尔扳机：<br />把力度调到顺手。</h2><p>通过霍尔效应检测与可调键程，在快速触发和精细控制之间切换。不少于三档，切换后手感可复现，不需要重新适应。</p><div class="control-metrics"><div><strong>≥ 3 档</strong><span>可调扳机键程</span></div><div><strong>霍尔效应</strong><span>非接触式检测</span></div><div><strong>三模连接</strong><span>有线 / 2.4G / 蓝牙</span></div></div></div><span class="stage-index">03 / 06</span>
        </article>
        <article class="control-panel" data-control-panel data-panel-index="2" aria-label="按键与方向键">
          <div class="control-panel-visual scene" data-scene><img class="control-detail-image control-image-dpad" src="/control/dpad.png" alt="Nexus 十字方向键细节" width="1254" height="1254" /><div class="control-panel-shade"></div></div>
          <div class="control-panel-copy copy-left"><p class="eyebrow">03 / CONTROL / INPUT</p><h2>按键与方向：<br />每一次输入都算数。</h2><p>分体式十字方向键保持四向独立反馈，斜向操作边界更清楚。ABXY 与方向键围绕长期高频使用校准，目标两年内稳定触发、不断触。</p><div class="control-metrics"><div><strong>2 年</strong><span>ABXY 耐久目标</span></div><div><strong>磁吸键帽</strong><span>Switch / Xbox 互换</span></div><div><strong>4 套</strong><span>板载配置保存</span></div></div></div><span class="stage-index">03 / 06</span>
        </article>
      </section>

      <section class="dock-sequence" id="dock" data-section="dock" data-theme="violet" data-dock-sequence>
        <div class="dock-stage scene" data-scene>
          <div class="scene-backdrop"></div>
          <div class="scene-halo halo-violet"></div>
          <div class="dock-product">
            <img class="dock-layer dock-base-layer" src="/dock/charging-dock.png" alt="" width="1863" height="1019" />
            <img class="dock-layer dock-handle-layer" src="/dock/controller.png" alt="Nexus 跨平台游戏手柄" width="1863" height="1019" />
          </div>
          <div class="hero-shade"></div>
          <div class="dock-contact-flash" aria-hidden="true"></div>
          <div class="dock-copy copy-left">
            <p class="eyebrow">04 / WIRELESS DOCK</p>
            <h2>无线充电底座</h2>
            <p>放下即充，拿起即用。采用无触点设计，减少插拔损耗，让连接更从容稳定。</p>
            <div class="chapter-points"><span>放下即充</span><span>拿起即用</span><span>无触点设计</span></div>
          </div>
          <span class="stage-index">04 / 06</span>
        </div>
      </section>

      <section class="purchase-section" id="purchase" data-section="purchase" data-theme="gold"><div class="purchase-visual scene"><img class="purchase-frame scene-frame" src="/purchase/purchase-hero.png" alt="Nexus 手柄购买区展示图" width="1672" height="941" /><div class="hero-shade"></div></div><div class="purchase-copy"><p class="eyebrow">05 / READY WHEN YOU ARE</p><h2>掌控，<br />不设边界。</h2><div class="purchase-row"><div><span class="price-label">日常价</span><strong class="price">799 <small>元</small></strong></div><div class="purchase-actions"><button class="button button-gold" data-toast="京东入口即将开放">京东购买</button><button class="button button-outline" data-toast="天猫入口即将开放">天猫购买</button></div></div><p class="purchase-note">当前为概念模拟，电商入口暂不执行真实跳转。</p></div><span class="stage-index">05 / 06</span></section>

      <section class="spec-section" id="specifications" data-section="specifications" data-theme="gold">
        <div class="spec-copy copy-left"><p class="eyebrow">06 / SPECIFICATIONS</p><h2>决策信息，<br />保持清楚。</h2><div class="spec-grid"><div><span>连接</span><strong>2.4G / 蓝牙 / 有线</strong></div><div><span>平台</span><strong>PC / Switch / PS5 / Xbox / 手机</strong></div><div><span>操控</span><strong>霍尔或 TMR 摇杆</strong></div><div><span>配件</span><strong>充电底座概念方案</strong></div><div><span>授权</span><strong>按 SKU 提供平台授权版本</strong></div><div><span>状态</span><strong>概念模拟，不接入真实业务</strong></div></div><div class="faq-list"><button class="faq-item" aria-expanded="false"><span>是否需要重新配对？</span><span class="faq-icon">+</span><span class="faq-answer">不需要。概念方案将平台连接记忆收进手柄上的切换动作。</span></button><button class="faq-item" aria-expanded="false"><span>是否包含充电底座？</span><span class="faq-icon">+</span><span class="faq-answer">页面仅展示充电底座概念，不代表最终包装清单。</span></button><button class="faq-item" aria-expanded="false"><span>这是真实发售页面吗？</span><span class="faq-icon">+</span><span class="faq-answer">不是。当前网站为 Nexus 产品概念模拟，不接入支付、订单、留资或真实电商链接。</span></button></div></div><span class="stage-index">06 / 06</span>
      </section>
    </main>
    <footer class="site-footer"><span>NEXUS</span><span>部分界面、交互和动态画面为概念模拟，仅用于产品展示。</span></footer>
  </div>
`;function D(t){let a=document.querySelector(".toast");a||(a=document.createElement("div"),a.className="toast",a.setAttribute("role","status"),document.body.appendChild(a)),a.textContent=t,a.classList.add("is-visible"),clearTimeout(D.timer),D.timer=setTimeout(()=>a.classList.remove("is-visible"),2600)}function L(t){const a=[...t].filter(Boolean);a.forEach(e=>e.classList.remove("is-folded")),requestAnimationFrame(()=>requestAnimationFrame(()=>a.forEach(e=>e.classList.add("is-folded"))))}function V(t){t.forEach(a=>{if(a.dataset.foldReady==="true")return;const e=a.innerHTML.split(/(<br\s*\/?>)/i),s=document.createDocumentFragment(),o=a.textContent.replace(/\s/g,"").length;let n=0;a.style.setProperty("--fold-stagger",`${Math.round(Math.max(14,Math.min(42,520/Math.max(1,o))))}ms`),e.forEach(r=>{if(/^<br/i.test(r)){s.appendChild(document.createElement("br"));return}[...r.replace(/<[^>]+>/g,"")].forEach(l=>{if(/\s/.test(l)){s.appendChild(document.createTextNode(l));return}const c=document.createElement("span");c.className="fold-char",c.style.setProperty("--fold-index",n),c.textContent=l,n+=1,s.appendChild(c)})}),a.replaceChildren(s),a.dataset.foldText="true",a.dataset.foldReady="true"})}function ne(){V(document.querySelectorAll("h1, h2, .eyebrow, .hero-kicker, .hero-intro, .feature-copy > p:not(.eyebrow), .sequence-copy > p:not(.eyebrow), .spec-grid strong, .control-metrics strong, .site-menu strong"));const a=new IntersectionObserver(s=>{s.forEach(o=>{o.isIntersecting&&o.target.classList.add("is-folded")})},{threshold:.38});document.querySelectorAll(".hero-sequence-section h1, .hero-sequence-section .eyebrow, .hero-sequence-section .hero-kicker, .hero-sequence-section .hero-intro, .feature-section h2, .feature-section .eyebrow, .feature-section .feature-copy > p:not(.eyebrow), .control-panel h2, .control-panel .eyebrow, .control-panel .control-panel-copy > p:not(.eyebrow), .control-panel .control-metrics strong, .spec-section h2, .spec-section .eyebrow, .spec-section .spec-grid strong, .purchase-section h2, .purchase-section .eyebrow").forEach(s=>a.observe(s));const e=document.querySelector(".hero-sequence-section h1");requestAnimationFrame(()=>requestAnimationFrame(()=>e?.classList.add("is-folded")))}function re(){const t=document.querySelector(".menu-toggle"),a=document.querySelector(".site-menu");if(!t||!a)return;const e=s=>{t.setAttribute("aria-expanded",String(s)),a.setAttribute("aria-hidden",String(!s)),document.body.classList.toggle("menu-open",s),t.querySelector(".menu-label").textContent=s?"CLOSE":"MENU";const o=a.querySelectorAll(".site-menu-nav strong");s?L(o):o.forEach(n=>n.classList.remove("is-folded"))};t.addEventListener("click",()=>e(t.getAttribute("aria-expanded")!=="true")),a.addEventListener("click",s=>{s.target.closest("[data-menu-link]")&&e(!1)}),document.querySelector(".nav-cta")?.addEventListener("click",()=>e(!1)),document.addEventListener("keydown",s=>{s.key==="Escape"&&e(!1)})}function j(t){R=0,g.x+=(E.x-g.x)*.12,g.y+=(E.y-g.y)*.12,t.style.setProperty("--pointer-x",g.x.toFixed(3)),t.style.setProperty("--pointer-y",g.y.toFixed(3)),(Math.abs(E.x-g.x)>.01||Math.abs(E.y-g.y)>.01)&&(R=requestAnimationFrame(()=>j(t)))}function ie(){x.matches||document.querySelectorAll("[data-scene]").forEach(t=>{const a=(e,s)=>{E={x:e,y:s},R||(R=requestAnimationFrame(()=>j(t)))};t.addEventListener("pointermove",e=>{if(e.pointerType==="touch")return;const s=t.getBoundingClientRect();a((e.clientX-s.left)/s.width*2-1,(e.clientY-s.top)/s.height*2-1)}),t.addEventListener("pointerleave",()=>a(0,0))})}function ce(t){const a=Math.min(window.innerWidth<=720?ae:P,P),e=Math.round(t*(a-1));return A+Math.round(e/(a-1)*(P-1))}function le(t){const a=Math.max(A,t-4),e=Math.min(K,t+10);for(let s=a;s<=e;s+=1){const o=q(s);if(_.has(o))continue;_.add(o);const n=new Image;n.src=o}}function Y(){U=0;const t=document.querySelector("[data-sequence]"),a=document.querySelector(".sequence-frame");if(!t||!a)return;const e=Math.max(1,t.offsetHeight-window.innerHeight),s=Math.max(0,Math.min(1,(window.scrollY-t.offsetTop)/e)),o=ce(s);X!==o&&(X=o,a.src=q(o)),le(o);const n=te/(P-1),r=s<.16?"hero":s<.34?"detail":s<n?"hero-end":s<n+.05?"end":s<.82?"appearance":"end";B!==r&&(B=r,L(t.querySelectorAll(`[data-beat="${r}"] h2, [data-beat="${r}"] .eyebrow, [data-beat="${r}"] .hero-kicker, [data-beat="${r}"] .hero-intro, [data-beat="${r}"] p:not(.eyebrow)`))),t.dataset.beat=r;const l=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);document.querySelector(".scroll-rail span")?.style.setProperty("height",`${Math.max(0,Math.min(100,window.scrollY/l*100))}%`)}function de(){[0,57,114,171,228,285,342,415].map(q).forEach(a=>{_.add(a);const e=new Image;e.src=a});const t=()=>{U||(U=requestAnimationFrame(Y))};window.addEventListener("scroll",t,{passive:!0}),window.addEventListener("resize",t,{passive:!0}),Y()}function W(){N=0;const t=[...document.querySelectorAll("[data-control-panel]")];if(!t.length)return;const a=Math.max(1,window.innerHeight);let e=0;if(t.forEach((s,o)=>{const n=s.getBoundingClientRect(),r=Math.max(0,Math.min(1,(a-n.top)/a));s.style.setProperty("--panel-enter",r.toFixed(3)),s.style.setProperty("--panel-shift",`${((1-r)*46).toFixed(1)}px`),s.style.setProperty("--panel-scale",(1.095-r*.055).toFixed(3)),s.style.setProperty("--panel-opacity",(.28+r*.72).toFixed(3)),n.top<=a*.52&&(e=o)}),e!==G){G=e,t.forEach((o,n)=>o.classList.toggle("is-active",n===e));const s=t[e];L(s.querySelectorAll("h2, .eyebrow, .control-panel-copy > p:not(.eyebrow), .control-metrics strong"))}}function pe(){const t=()=>{N||(N=requestAnimationFrame(W))};window.addEventListener("scroll",t,{passive:!0}),window.addEventListener("resize",t,{passive:!0}),W()}function M(){I=0;const t=document.querySelector("#purchase"),a=document.querySelector("#specifications"),e=t?.querySelector(".purchase-copy"),s=a?.querySelector(".spec-copy");if(!t||!a||!e||!s)return;if(x.matches){e.style.setProperty("--purchase-shift","0vh"),s.style.setProperty("--spec-shift","0vh");return}const o=Math.max(1,window.innerHeight),n=a.getBoundingClientRect(),r=o*.9,l=Math.max(0,Math.min(1,(o-n.top)/r));e.style.setProperty("--purchase-shift",`${(l*-34).toFixed(2)}vh`),s.style.setProperty("--spec-shift",`${((1-l)*10).toFixed(2)}vh`)}function ue(){const t=()=>{I||(I=requestAnimationFrame(M))};window.addEventListener("scroll",t,{passive:!0}),window.addEventListener("resize",t,{passive:!0}),x.addEventListener("change",M),M()}function C(){O=0;const t=document.querySelector("[data-dock-sequence]"),a=t?.querySelector(".dock-handle-layer"),e=t?.querySelector(".dock-base-layer"),s=t?.querySelector(".dock-copy");if(!t||!a||!e||!s)return;const o=window.matchMedia("(max-width: 880px)").matches,n=o?5.1:12,r=o?-.62:-1.42,l=.9585;if(x.matches){a.style.setProperty("--handle-y",`${n}%`),a.style.setProperty("--handle-rot","0deg"),a.style.setProperty("--handle-scale",l),e.style.setProperty("--base-y",`${r}%`),e.style.setProperty("--base-scale",l),t.style.setProperty("--contact-opacity","0"),t.style.setProperty("--contact-scale","0.82"),s.style.setProperty("--dock-copy-opacity","1"),s.style.setProperty("--dock-copy-y","0px"),s.classList.add("is-landed");return}const c=u=>Math.max(0,Math.min(1,u)),w=u=>{const v=c(u);return v*v*(3-2*v)},i=Math.max(1,t.offsetHeight-window.innerHeight),d=c((window.scrollY-t.offsetTop)/i),m=.44,b=c(d/m),f=1-Math.pow(1-b,3),y=c((d-(m-.012))/.042),F=1-c((d-(m+.045))/.08),h=Math.min(y,F),p=w((d-.5)/.14);a.style.setProperty("--handle-y",`${(-88+f*(88+n)).toFixed(2)}%`),a.style.setProperty("--handle-rot",`${(-6+f*6).toFixed(2)}deg`),a.style.setProperty("--handle-scale",(.9+f*(l-.9)).toFixed(3)),e.style.setProperty("--base-y",`${r}%`),e.style.setProperty("--base-scale",(l+h*.014).toFixed(4)),t.style.setProperty("--contact-opacity",h.toFixed(3)),t.style.setProperty("--contact-scale",(.82+h*.28).toFixed(3)),s.style.setProperty("--dock-copy-opacity",p.toFixed(3)),s.style.setProperty("--dock-copy-y",`${((1-p)*28).toFixed(2)}px`),d>=.5&&!S?(S=!0,s.classList.add("is-landed"),L(s.querySelectorAll("h2, .eyebrow, p:not(.eyebrow), .chapter-points span"))):d<.47&&S&&(S=!1,s.classList.remove("is-landed"))}function he(){const t=document.querySelector(".dock-copy");if(!t)return;V(t.querySelectorAll("h2, .eyebrow, p:not(.eyebrow), .chapter-points span"));const a=()=>{O||(O=requestAnimationFrame(C))};window.addEventListener("scroll",a,{passive:!0}),window.addEventListener("resize",a,{passive:!0}),x.addEventListener("change",C),C()}const k=new Map,me=1120;function T(t){return k.has(t)||k.set(t,new Promise((a,e)=>{const s=new Image;s.decoding="async",s.onload=()=>a(s),s.onerror=()=>e(new Error(`Unable to load platform image: ${t}`)),s.src=t})),k.get(t)}function fe(t,a){if(!t||!a||x.matches)return null;const e=t.getContext("webgl",{alpha:!1,antialias:!1,powerPreference:"high-performance"});if(!e)return null;const s=`
    attribute vec2 aPosition;
    varying vec2 vUv;
    void main() {
      vUv = aPosition * 0.5 + 0.5;
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `,o=`
    precision highp float;
    uniform sampler2D uFrom;
    uniform sampler2D uTo;
    uniform float uProgress;
    uniform vec2 uResolution;
    uniform vec2 uFromSize;
    uniform vec2 uToSize;
    varying vec2 vUv;

    vec2 coverUv(vec2 uv, vec2 canvasSize, vec2 imageSize) {
      float canvasRatio = canvasSize.x / canvasSize.y;
      float imageRatio = imageSize.x / imageSize.y;
      vec2 scale = vec2(1.0);
      if (canvasRatio > imageRatio) scale.y = imageRatio / canvasRatio;
      else scale.x = canvasRatio / imageRatio;
      return (uv - 0.5) * scale + 0.5;
    }

    float hash(vec2 point) {
      return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453);
    }

    float noise(vec2 point) {
      vec2 cell = floor(point);
      vec2 local = fract(point);
      local = local * local * (3.0 - 2.0 * local);
      return mix(
        mix(hash(cell), hash(cell + vec2(1.0, 0.0)), local.x),
        mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), local.x),
        local.y
      );
    }

    float fbm(vec2 point) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int index = 0; index < 4; index++) {
        value += noise(point) * amplitude;
        point = point * 2.03 + 3.17;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      float progress = clamp(uProgress, 0.0, 1.0);
      float grain = fbm(vUv * 7.0 + vec2(1.6, -1.1));
      float melt = clamp((progress - grain * 0.28) / 0.72, 0.0, 1.0);
      melt = smoothstep(0.0, 1.0, melt);
      float wave = sin(3.14159265 * progress);
      vec2 flow = vec2(
        fbm(vUv * 4.0 + 5.2) - 0.5,
        fbm(vUv * 5.0 - 1.7) - 0.5
      ) * 0.042 * wave;
      float edge = 1.0 - abs(melt * 2.0 - 1.0);
      vec2 chroma = flow * edge * 0.38;

      vec2 fromUv = coverUv(clamp(vUv + flow, 0.0, 1.0), uResolution, uFromSize);
      vec2 toUv = coverUv(clamp(vUv - flow * 0.65, 0.0, 1.0), uResolution, uToSize);
      vec3 fromColor = vec3(
        texture2D(uFrom, clamp(fromUv + chroma, 0.0, 1.0)).r,
        texture2D(uFrom, fromUv).g,
        texture2D(uFrom, clamp(fromUv - chroma, 0.0, 1.0)).b
      );
      vec3 toColor = vec3(
        texture2D(uTo, clamp(toUv + chroma, 0.0, 1.0)).r,
        texture2D(uTo, toUv).g,
        texture2D(uTo, clamp(toUv - chroma, 0.0, 1.0)).b
      );
      vec3 color = mix(fromColor, toColor, melt);
      color += (hash(vUv * uResolution + progress * 91.7) - 0.5) * 0.014 * edge;
      gl_FragColor = vec4(color, 1.0);
    }
  `,n=(h,p)=>{const u=e.createShader(h);return e.shaderSource(u,p),e.compileShader(u),e.getShaderParameter(u,e.COMPILE_STATUS)?u:(e.deleteShader(u),null)},r=n(e.VERTEX_SHADER,s),l=n(e.FRAGMENT_SHADER,o);if(!r||!l)return null;const c=e.createProgram();if(e.attachShader(c,r),e.attachShader(c,l),e.linkProgram(c),e.deleteShader(r),e.deleteShader(l),!e.getProgramParameter(c,e.LINK_STATUS))return null;const w=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,w),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),e.STATIC_DRAW),e.useProgram(c);const i=e.getAttribLocation(c,"aPosition");e.enableVertexAttribArray(i),e.vertexAttribPointer(i,2,e.FLOAT,!1,0,0);const d={from:e.getUniformLocation(c,"uFrom"),to:e.getUniformLocation(c,"uTo"),progress:e.getUniformLocation(c,"uProgress"),resolution:e.getUniformLocation(c,"uResolution"),fromSize:e.getUniformLocation(c,"uFromSize"),toSize:e.getUniformLocation(c,"uToSize")},m=[e.createTexture(),e.createTexture()];let b=0;const f=()=>{const h=Math.min(window.devicePixelRatio||1,1.5),p=Math.max(1,Math.round(t.clientWidth*h)),u=Math.max(1,Math.round(t.clientHeight*h));(t.width!==p||t.height!==u)&&(t.width=p,t.height=u),e.viewport(0,0,t.width,t.height),e.uniform2f(d.resolution,t.width,t.height)},y=(h,p,u,v)=>{e.activeTexture(e.TEXTURE0+v),e.bindTexture(e.TEXTURE_2D,h),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,p),e.uniform1i(v===0?d.from:d.to,v),e.uniform2f(u,p.naturalWidth,p.naturalHeight)},F=async(h,p)=>{if(!h||!p)return!1;const[u,v]=await Promise.all([T(h),T(p)]);if(h===p)return!1;const Q=++b;f(),y(m[0],u,d.fromSize,0),y(m[1],v,d.toSize,1),a.src=p,t.classList.add("is-active");const J=performance.now();return new Promise(z=>{const H=Z=>{if(Q!==b){z(!1);return}const $=Math.min(1,(Z-J)/me);if(e.uniform1f(d.progress,$),e.drawArrays(e.TRIANGLES,0,6),$<1){requestAnimationFrame(H);return}t.classList.remove("is-active"),z(!0)};requestAnimationFrame(H)})};return window.addEventListener("resize",f,{passive:!0}),{transition:F}}function ve(){document.querySelectorAll("[data-toast]").forEach(i=>i.addEventListener("click",()=>D(i.dataset.toast)));const t=[...document.querySelectorAll(".platform-chip")],a=document.querySelector(".platform-row"),e=document.querySelector(".platform-thumb"),s=document.querySelector("[data-platform-morph]"),o=document.querySelector(".demo-status"),n=document.querySelector(".platform-visual"),r=fe(s,n);let l=0;const c=i=>{if(!a||!e||!i)return;const d=a.getBoundingClientRect(),m=i.getBoundingClientRect();a.style.setProperty("--thumb-x",`${m.left-d.left}px`),a.style.setProperty("--thumb-width",`${m.width}px`),a.classList.add("has-selection")},w=async i=>{if(!i||!n)return;const d=i.dataset.platformImage,m=n.getAttribute("src"),b=++l;t.forEach(f=>{const y=f===i;f.classList.toggle("is-active",y),f.setAttribute("aria-checked",String(y))}),c(i),a?.classList.remove("is-rubbering"),a?.offsetWidth,a?.classList.add("is-rubbering"),window.setTimeout(()=>a?.classList.remove("is-rubbering"),680),o.textContent=`正在连接 · ${i.dataset.platform}`,n.alt=`Nexus ${i.dataset.platform} 平台连接展示图`,m!==d&&(r?await r.transition(m,d):(await T(d).catch(()=>null),n.src=d)),b===l&&(o.textContent=`已连接 · ${i.dataset.platform}`)};t.forEach(i=>{i.addEventListener("click",()=>w(i)),T(i.dataset.platformImage).catch(()=>null)}),window.addEventListener("resize",()=>{c(t.find(i=>i.classList.contains("is-active")))}),document.querySelectorAll(".faq-item").forEach(i=>i.addEventListener("click",()=>i.setAttribute("aria-expanded",String(i.getAttribute("aria-expanded")!=="true"))))}function ge(){const t=[...document.querySelectorAll("[data-section-link]")],a=new IntersectionObserver(e=>e.forEach(s=>{if(!s.isIntersecting)return;const o=s.target.dataset.section;t.forEach(n=>n.classList.toggle("is-active",n.dataset.sectionLink===o)),document.querySelector(".site-shell")?.setAttribute("data-theme",s.target.dataset.theme||"blue")}),{threshold:.46});document.querySelectorAll("[data-section]").forEach(e=>a.observe(e))}se.innerHTML=oe;ie();ne();re();de();pe();ue();he();ve();ge();
