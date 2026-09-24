import './styles.css';

const BASE_URL = import.meta.env.BASE_URL;
const assetUrl = (path) => `${BASE_URL}${path.replace(/^\/+/, '')}`;
const FRAME_COUNT = 416;
const HERO_FRAME_START = 0;
const HERO_FRAME_END = 228;
const APPEARANCE_FRAME_END = 415;
const SEQUENCE_FRAME_LENGTH = APPEARANCE_FRAME_END - HERO_FRAME_START + 1;
const SEQUENCE_FRAME_STEP = window.innerWidth <= 720 ? 4 : 2;
const FRAME_CACHE_LIMIT = 34;
const framePath = (index) => assetUrl(`/frames/f_${String(Math.max(1, Math.min(FRAME_COUNT, index + 1))).padStart(4, '0')}.webp`);

const app = document.querySelector('#app');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let frameRaf = 0;
let pointerRaf = 0;
let controlRaf = 0;
let purchaseRaf = 0;
let dockRaf = 0;
let currentFrame = -1;
let currentBeat = '';
let currentControlPanel = -1;
let dockLanded = false;
let pointerTarget = { x: 0, y: 0 };
let pointerCurrent = { x: 0, y: 0 };
let sequenceContext = null;
let sequenceMetrics = { top: 0, range: 1, pageRange: 1 };
const frameImageCache = new Map();

const siteMarkup = `
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
          <img class="sequence-frame hero-sequence-frame scene-frame" src="${framePath(HERO_FRAME_START)}" alt="Nexus 跨平台游戏手柄外观帧序列" width="1600" height="900" decoding="async" fetchpriority="high" draggable="false" />
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
        <div class="feature-visual scene" data-scene><div class="scene-halo halo-blue"></div><img class="feature-frame platform-visual scene-frame" src="${assetUrl('/platforms/connection-map.png')}" alt="Nexus 跨平台手柄全平台连接展示图" width="1600" height="900" /><canvas class="platform-morph" data-platform-morph aria-hidden="true"></canvas><div class="hero-shade"></div></div>
        <div class="feature-copy copy-right">
          <p class="eyebrow">02 / SWITCH</p>
          <h2>按一下，<br />换到下一个平台。</h2>
          <p>配对记忆和连接反馈被收进一个确定动作。你只需要决定去哪里，不需要重复设置。</p>
          <div class="switch-demo" aria-label="一键切换概念演示"><div class="platform-row" role="radiogroup" aria-label="选择连接平台"><span class="platform-thumb" aria-hidden="true"></span><button class="platform-chip" role="radio" aria-checked="false" data-platform="PC" data-platform-image="${assetUrl('/platforms/pc.png')}">PC</button><button class="platform-chip" role="radio" aria-checked="false" data-platform="Switch" data-platform-image="${assetUrl('/platforms/switch.png')}">Switch</button><button class="platform-chip" role="radio" aria-checked="false" data-platform="PS5" data-platform-image="${assetUrl('/platforms/ps5.png')}">PS5</button><button class="platform-chip" role="radio" aria-checked="false" data-platform="Xbox" data-platform-image="${assetUrl('/platforms/xbox.png')}">Xbox</button><button class="platform-chip" role="radio" aria-checked="false" data-platform="Mobile" data-platform-image="${assetUrl('/platforms/mobile.png')}">手机</button></div><p class="demo-status" aria-live="polite">等待选择 · 全平台</p></div>
          <div class="chapter-points"><span>配对记忆</span><span>三模连接</span><span>即时反馈</span></div>
        </div><span class="stage-index">02 / 06</span>
      </section>

      <section class="control-sequence" id="control" data-section="control" data-theme="violet" data-control-sequence>
        <article class="control-panel is-active" data-control-panel data-panel-index="0" aria-label="霍尔摇杆">
          <div class="control-panel-visual scene" data-scene><img class="control-detail-image control-image-stick" src="${assetUrl('/control/joystick.png')}" alt="Nexus 霍尔摇杆细节" width="1254" height="1254" /><div class="control-panel-shade"></div></div>
          <div class="control-panel-copy copy-left"><p class="eyebrow">03 / CONTROL / STICK</p><h2>霍尔摇杆：<br />把漂移留在过去。</h2><p>采用霍尔或 TMR 非接触式摇杆，不使用碳膜。方向输出保持线性，回中更稳定，长期高频操作后仍能维持清楚的控制边界。</p><div class="control-metrics"><div><strong>12 个月</strong><span>无可感知漂移</span></div><div><strong>≤ 8 ms</strong><span>2.4G 无线延迟</span></div><div><strong>1000 Hz</strong><span>PC 有线回报率</span></div></div></div><span class="stage-index">03 / 06</span>
        </article>
        <article class="control-panel" data-control-panel data-panel-index="1" aria-label="霍尔扳机">
          <div class="control-panel-visual scene" data-scene><img class="control-detail-image control-image-trigger" src="${assetUrl('/control/trigger.png')}" alt="Nexus 霍尔扳机细节" width="1254" height="1254" /><div class="control-panel-shade"></div></div>
          <div class="control-panel-copy copy-right"><p class="eyebrow">03 / CONTROL / TRIGGER</p><h2>霍尔扳机：<br />把力度调到顺手。</h2><p>通过霍尔效应检测与可调键程，在快速触发和精细控制之间切换。不少于三档，切换后手感可复现，不需要重新适应。</p><div class="control-metrics"><div><strong>≥ 3 档</strong><span>可调扳机键程</span></div><div><strong>霍尔效应</strong><span>非接触式检测</span></div><div><strong>三模连接</strong><span>有线 / 2.4G / 蓝牙</span></div></div></div><span class="stage-index">03 / 06</span>
        </article>
        <article class="control-panel" data-control-panel data-panel-index="2" aria-label="按键与方向键">
          <div class="control-panel-visual scene" data-scene><img class="control-detail-image control-image-dpad" src="${assetUrl('/control/dpad.png')}" alt="Nexus 十字方向键细节" width="1254" height="1254" /><div class="control-panel-shade"></div></div>
          <div class="control-panel-copy copy-left"><p class="eyebrow">03 / CONTROL / INPUT</p><h2>按键与方向：<br />每一次输入都算数。</h2><p>分体式十字方向键保持四向独立反馈，斜向操作边界更清楚。ABXY 与方向键围绕长期高频使用校准，目标两年内稳定触发、不断触。</p><div class="control-metrics"><div><strong>2 年</strong><span>ABXY 耐久目标</span></div><div><strong>磁吸键帽</strong><span>Switch / Xbox 互换</span></div><div><strong>4 套</strong><span>板载配置保存</span></div></div></div><span class="stage-index">03 / 06</span>
        </article>
      </section>

      <section class="dock-sequence" id="dock" data-section="dock" data-theme="violet" data-dock-sequence>
        <div class="dock-stage scene" data-scene>
          <div class="scene-backdrop"></div>
          <div class="scene-halo halo-violet"></div>
          <div class="dock-product">
            <img class="dock-layer dock-base-layer" src="${assetUrl('/dock/charging-dock.png')}" alt="" width="1863" height="1019" />
            <img class="dock-layer dock-handle-layer" src="${assetUrl('/dock/controller.png')}" alt="Nexus 跨平台游戏手柄" width="1863" height="1019" />
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

      <section class="purchase-section" id="purchase" data-section="purchase" data-theme="gold"><div class="purchase-visual scene"><img class="purchase-frame scene-frame" src="${assetUrl('/purchase/purchase-hero.png')}" alt="Nexus 手柄购买区展示图" width="1672" height="941" /><div class="hero-shade"></div></div><div class="purchase-copy"><p class="eyebrow">05 / READY WHEN YOU ARE</p><h2>掌控，<br />不设边界。</h2><div class="purchase-row"><div><span class="price-label">日常价</span><strong class="price">799 <small>元</small></strong></div><div class="purchase-actions"><button class="button button-gold" data-toast="京东入口即将开放">京东购买</button><button class="button button-outline" data-toast="天猫入口即将开放">天猫购买</button></div></div><p class="purchase-note">当前为概念模拟，电商入口暂不执行真实跳转。</p></div><span class="stage-index">05 / 06</span></section>

      <section class="spec-section" id="specifications" data-section="specifications" data-theme="gold">
        <div class="spec-copy copy-left"><p class="eyebrow">06 / SPECIFICATIONS</p><h2>决策信息，<br />保持清楚。</h2><div class="spec-grid"><div><span>连接</span><strong>2.4G / 蓝牙 / 有线</strong></div><div><span>平台</span><strong>PC / Switch / PS5 / Xbox / 手机</strong></div><div><span>操控</span><strong>霍尔或 TMR 摇杆</strong></div><div><span>配件</span><strong>充电底座概念方案</strong></div><div><span>授权</span><strong>按 SKU 提供平台授权版本</strong></div><div><span>状态</span><strong>概念模拟，不接入真实业务</strong></div></div><div class="faq-list"><button class="faq-item" aria-expanded="false"><span>是否需要重新配对？</span><span class="faq-icon">+</span><span class="faq-answer">不需要。概念方案将平台连接记忆收进手柄上的切换动作。</span></button><button class="faq-item" aria-expanded="false"><span>是否包含充电底座？</span><span class="faq-icon">+</span><span class="faq-answer">页面仅展示充电底座概念，不代表最终包装清单。</span></button><button class="faq-item" aria-expanded="false"><span>这是真实发售页面吗？</span><span class="faq-icon">+</span><span class="faq-answer">不是。当前网站为 Nexus 产品概念模拟，不接入支付、订单、留资或真实电商链接。</span></button></div></div><span class="stage-index">06 / 06</span>
      </section>
    </main>
    <footer class="site-footer"><span>NEXUS</span><span>部分界面、交互和动态画面为概念模拟，仅用于产品展示。</span></footer>
  </div>
`;

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) { toast = document.createElement('div'); toast.className = 'toast'; toast.setAttribute('role', 'status'); document.body.appendChild(toast); }
  toast.textContent = message; toast.classList.add('is-visible'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

function replayFoldText(elements) {
  const targets = [...elements].filter(Boolean);
  targets.forEach((element) => element.classList.remove('is-folded'));
  requestAnimationFrame(() => requestAnimationFrame(() => targets.forEach((element) => element.classList.add('is-folded'))));
}

function prepareFoldText(elements) {
  elements.forEach((element) => {
    if (element.dataset.foldReady === 'true') return;
    const parts = element.innerHTML.split(/(<br\s*\/?>)/i);
    const fragment = document.createDocumentFragment();
    const characterCount = element.textContent.replace(/\s/g, '').length;
    let characterIndex = 0;
    element.style.setProperty('--fold-stagger', `${Math.round(Math.max(14, Math.min(42, 520 / Math.max(1, characterCount))))}ms`);

    parts.forEach((part) => {
      if (/^<br/i.test(part)) {
        fragment.appendChild(document.createElement('br'));
        return;
      }
      [...part.replace(/<[^>]+>/g, '')].forEach((character) => {
        if (/\s/.test(character)) {
          fragment.appendChild(document.createTextNode(character));
          return;
        }
        const span = document.createElement('span');
        span.className = 'fold-char';
        span.style.setProperty('--fold-index', characterIndex);
        span.textContent = character;
        characterIndex += 1;
        fragment.appendChild(span);
      });
    });

    element.replaceChildren(fragment);
    element.dataset.foldText = 'true';
    element.dataset.foldReady = 'true';
  });
}

function bindFoldText() {
  const textSelector = 'h1, h2, .eyebrow, .hero-kicker, .hero-intro, .feature-copy > p:not(.eyebrow), .sequence-copy > p:not(.eyebrow), .spec-grid strong, .control-metrics strong, .site-menu strong';
  prepareFoldText(document.querySelectorAll(textSelector));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-folded');
    });
  }, { threshold: 0.38 });
  document.querySelectorAll('.hero-sequence-section h1, .hero-sequence-section .eyebrow, .hero-sequence-section .hero-kicker, .hero-sequence-section .hero-intro, .feature-section h2, .feature-section .eyebrow, .feature-section .feature-copy > p:not(.eyebrow), .control-panel h2, .control-panel .eyebrow, .control-panel .control-panel-copy > p:not(.eyebrow), .control-panel .control-metrics strong, .spec-section h2, .spec-section .eyebrow, .spec-section .spec-grid strong, .purchase-section h2, .purchase-section .eyebrow').forEach((element) => observer.observe(element));

  const heroTitle = document.querySelector('.hero-sequence-section h1');
  requestAnimationFrame(() => requestAnimationFrame(() => heroTitle?.classList.add('is-folded')));
}

function bindMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.site-menu');
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
    toggle.querySelector('.menu-label').textContent = open ? 'CLOSE' : 'MENU';
    const menuText = menu.querySelectorAll('.site-menu-nav strong');
    if (open) replayFoldText(menuText);
    else menuText.forEach((element) => element.classList.remove('is-folded'));
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (event) => { if (event.target.closest('[data-menu-link]')) setOpen(false); });
  document.querySelector('.nav-cta')?.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setOpen(false); });
}

function animatePointer(scene) {
  pointerRaf = 0;
  pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.12;
  pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.12;
  scene.style.setProperty('--pointer-x', pointerCurrent.x.toFixed(3)); scene.style.setProperty('--pointer-y', pointerCurrent.y.toFixed(3));
  if (Math.abs(pointerTarget.x - pointerCurrent.x) > 0.01 || Math.abs(pointerTarget.y - pointerCurrent.y) > 0.01) pointerRaf = requestAnimationFrame(() => animatePointer(scene));
}

function bindPointerScenes() {
  if (reduceMotion.matches) return;
  document.querySelectorAll('[data-scene]').forEach((scene) => {
    const setPointer = (x, y) => { pointerTarget = { x, y }; if (!pointerRaf) pointerRaf = requestAnimationFrame(() => animatePointer(scene)); };
    scene.addEventListener('pointermove', (event) => { if (event.pointerType === 'touch') return; const rect = scene.getBoundingClientRect(); setPointer((event.clientX - rect.left) / rect.width * 2 - 1, (event.clientY - rect.top) / rect.height * 2 - 1); });
    scene.addEventListener('pointerleave', () => setPointer(0, 0));
  });
}

function frameIndexForProgress(progress) {
  const step = window.innerWidth <= 720 ? 4 : SEQUENCE_FRAME_STEP;
  const sampledFrame = Math.round((HERO_FRAME_START + progress * (SEQUENCE_FRAME_LENGTH - 1)) / step) * step;
  return Math.max(HERO_FRAME_START, Math.min(APPEARANCE_FRAME_END, sampledFrame));
}

function trimFrameCache(center) {
  if (frameImageCache.size <= FRAME_CACHE_LIMIT) return;
  const removeCount = frameImageCache.size - FRAME_CACHE_LIMIT;
  [...frameImageCache.keys()]
    .sort((a, b) => Math.abs(b - center) - Math.abs(a - center))
    .slice(0, removeCount)
    .forEach((frame) => frameImageCache.delete(frame));
}

function preloadFrame(index, priority = 'low') {
  const frame = Math.max(HERO_FRAME_START, Math.min(APPEARANCE_FRAME_END, index));
  const cached = frameImageCache.get(frame);
  if (cached) {
    frameImageCache.delete(frame);
    frameImageCache.set(frame, cached);
    return cached;
  }
  const image = new Image();
  image.decoding = 'async';
  image.fetchPriority = priority;
  image.src = framePath(frame);
  frameImageCache.set(frame, image);
  trimFrameCache(frame);
  return image;
}

function preloadFramesAround(index, direction) {
  const step = window.innerWidth <= 720 ? 4 : SEQUENCE_FRAME_STEP;
  const compact = window.innerWidth <= 720;
  const behind = compact ? 4 : 6;
  const ahead = compact ? 9 : 15;
  for (let offset = -behind; offset <= ahead; offset += 1) {
    const weightedOffset = direction < 0 && offset < 0 ? offset * 2 : offset;
    preloadFrame(index + weightedOffset * step, offset <= 2 ? 'high' : 'low');
  }
}

function updateSequenceFrame() {
  frameRaf = 0;
  const { section, image, railFill } = sequenceContext || {};
  if (!section || !image) return;
  const progress = Math.max(0, Math.min(1, (window.scrollY - sequenceMetrics.top) / sequenceMetrics.range));
  const nextFrame = frameIndexForProgress(progress);
  const direction = nextFrame >= currentFrame ? 1 : -1;
  if (currentFrame !== nextFrame) {
    currentFrame = nextFrame;
    preloadFramesAround(nextFrame, direction);
    image.src = framePath(nextFrame);
  }
  const heroEndProgress = HERO_FRAME_END / (SEQUENCE_FRAME_LENGTH - 1);
  const nextBeat = progress < 0.16 ? 'hero' : progress < 0.34 ? 'detail' : progress < heroEndProgress ? 'hero-end' : progress < heroEndProgress + 0.05 ? 'end' : progress < 0.82 ? 'appearance' : 'end';
  if (currentBeat !== nextBeat) {
    currentBeat = nextBeat;
    replayFoldText(section.querySelectorAll(`[data-beat="${nextBeat}"] h2, [data-beat="${nextBeat}"] .eyebrow, [data-beat="${nextBeat}"] .hero-kicker, [data-beat="${nextBeat}"] .hero-intro, [data-beat="${nextBeat}"] p:not(.eyebrow)`));
  }
  section.dataset.beat = nextBeat;
  if (railFill) {
    railFill.style.transform = `scaleY(${Math.max(0, Math.min(1, window.scrollY / sequenceMetrics.pageRange))})`;
  }
}

function refreshSequenceMetrics() {
  const { section } = sequenceContext || {};
  if (!section) return;
  sequenceMetrics = {
    top: section.offsetTop,
    range: Math.max(1, section.offsetHeight - window.innerHeight),
    pageRange: Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
  };
}

function bindSequence() {
  const section = document.querySelector('[data-sequence]');
  const image = section?.querySelector('.sequence-frame');
  const railFill = document.querySelector('.scroll-rail span');
  if (!section || !image) return;
  sequenceContext = { section, image, railFill };
  refreshSequenceMetrics();
  preloadFrame(HERO_FRAME_START, 'high');
  const warmAnchors = () => [HERO_FRAME_END, APPEARANCE_FRAME_END].forEach((frame) => preloadFrame(frame));
  if ('requestIdleCallback' in window) window.requestIdleCallback(warmAnchors, { timeout: 1600 });
  else window.setTimeout(warmAnchors, 600);
  const handler = () => { if (!frameRaf) frameRaf = requestAnimationFrame(updateSequenceFrame); };
  const resizeHandler = () => { refreshSequenceMetrics(); handler(); };
  window.addEventListener('scroll', handler, { passive: true });
  window.addEventListener('resize', resizeHandler, { passive: true });
  updateSequenceFrame();
}

function updateControlSequence() {
  controlRaf = 0;
  const section = document.querySelector('[data-control-sequence]');
  if (!section) return;
  const sectionRect = section.getBoundingClientRect();
  if (sectionRect.bottom < -80 || sectionRect.top > window.innerHeight + 80) return;
  const panels = [...document.querySelectorAll('[data-control-panel]')];
  if (!panels.length) return;
  const viewport = Math.max(1, window.innerHeight);
  let activeIndex = 0;

  panels.forEach((panel, index) => {
    const rect = panel.getBoundingClientRect();
    const enter = Math.max(0, Math.min(1, (viewport - rect.top) / viewport));
    panel.style.setProperty('--panel-enter', enter.toFixed(3));
    panel.style.setProperty('--panel-shift', `${((1 - enter) * 46).toFixed(1)}px`);
    panel.style.setProperty('--panel-scale', (1.095 - enter * 0.055).toFixed(3));
    panel.style.setProperty('--panel-opacity', (0.28 + enter * 0.72).toFixed(3));
    if (rect.top <= viewport * 0.52) activeIndex = index;
  });

  if (activeIndex !== currentControlPanel) {
    currentControlPanel = activeIndex;
    panels.forEach((panel, index) => panel.classList.toggle('is-active', index === activeIndex));
    const activePanel = panels[activeIndex];
    replayFoldText(activePanel.querySelectorAll('h2, .eyebrow, .control-panel-copy > p:not(.eyebrow), .control-metrics strong'));
  }
}

function bindControlSequence() {
  const handler = () => { if (!controlRaf) controlRaf = requestAnimationFrame(updateControlSequence); };
  window.addEventListener('scroll', handler, { passive: true });
  window.addEventListener('resize', handler, { passive: true });
  updateControlSequence();
}

function updatePurchaseTransition() {
  purchaseRaf = 0;
  const purchase = document.querySelector('#purchase');
  const specifications = document.querySelector('#specifications');
  const purchaseCopy = purchase?.querySelector('.purchase-copy');
  const specCopy = specifications?.querySelector('.spec-copy');
  if (!purchase || !specifications || !purchaseCopy || !specCopy) return;

  if (reduceMotion.matches) {
    purchaseCopy.style.setProperty('--purchase-shift', '0vh');
    specCopy.style.setProperty('--spec-shift', '0vh');
    return;
  }

  const viewport = Math.max(1, window.innerHeight);
  const rect = specifications.getBoundingClientRect();
  const travel = viewport * 0.9;
  const progress = Math.max(0, Math.min(1, (viewport - rect.top) / travel));
  purchaseCopy.style.setProperty('--purchase-shift', `${(progress * -34).toFixed(2)}vh`);
  specCopy.style.setProperty('--spec-shift', `${((1 - progress) * 10).toFixed(2)}vh`);
}

function bindPurchaseTransition() {
  const handler = () => { if (!purchaseRaf) purchaseRaf = requestAnimationFrame(updatePurchaseTransition); };
  window.addEventListener('scroll', handler, { passive: true });
  window.addEventListener('resize', handler, { passive: true });
  reduceMotion.addEventListener('change', updatePurchaseTransition);
  updatePurchaseTransition();
}

function updateDockSequence() {
  dockRaf = 0;
  const section = document.querySelector('[data-dock-sequence]');
  if (!section) return;
  const sectionRect = section.getBoundingClientRect();
  if (sectionRect.bottom < -80 || sectionRect.top > window.innerHeight + 80) return;
  const handle = section?.querySelector('.dock-handle-layer');
  const base = section?.querySelector('.dock-base-layer');
  const copy = section?.querySelector('.dock-copy');
  if (!handle || !base || !copy) return;
  const compactDock = window.matchMedia('(max-width: 880px)').matches;
  const landingHandleY = compactDock ? 5.1 : 12;
  const landingBaseY = compactDock ? -0.62 : -1.42;
  const landingScale = 0.9585;

  if (reduceMotion.matches) {
    handle.style.setProperty('--handle-y', `${landingHandleY}%`);
    handle.style.setProperty('--handle-rot', '0deg');
    handle.style.setProperty('--handle-scale', landingScale);
    base.style.setProperty('--base-y', `${landingBaseY}%`);
    base.style.setProperty('--base-scale', landingScale);
    section.style.setProperty('--contact-opacity', '0');
    section.style.setProperty('--contact-scale', '0.82');
    copy.style.setProperty('--dock-copy-opacity', '1');
    copy.style.setProperty('--dock-copy-y', '0px');
    copy.classList.add('is-landed');
    return;
  }

  const clamp01 = (value) => Math.max(0, Math.min(1, value));
  const smoothstep = (value) => {
    const next = clamp01(value);
    return next * next * (3 - 2 * next);
  };
  const max = Math.max(1, section.offsetHeight - window.innerHeight);
  const progress = clamp01((window.scrollY - section.offsetTop) / max);
  const landingProgress = 0.44;
  const fallProgress = clamp01(progress / landingProgress);
  const fallEase = 1 - Math.pow(1 - fallProgress, 3);
  const contactIn = clamp01((progress - (landingProgress - 0.012)) / 0.042);
  const contactOut = 1 - clamp01((progress - (landingProgress + 0.045)) / 0.08);
  const contactOpacity = Math.min(contactIn, contactOut);
  const copyProgress = smoothstep((progress - 0.5) / 0.14);

  handle.style.setProperty('--handle-y', `${(-88 + fallEase * (88 + landingHandleY)).toFixed(2)}%`);
  handle.style.setProperty('--handle-rot', `${(-6 + fallEase * 6).toFixed(2)}deg`);
  handle.style.setProperty('--handle-scale', (0.9 + fallEase * (landingScale - 0.9)).toFixed(3));
  base.style.setProperty('--base-y', `${landingBaseY}%`);
  base.style.setProperty('--base-scale', (landingScale + contactOpacity * 0.014).toFixed(4));
  section.style.setProperty('--contact-opacity', contactOpacity.toFixed(3));
  section.style.setProperty('--contact-scale', (0.82 + contactOpacity * 0.28).toFixed(3));
  copy.style.setProperty('--dock-copy-opacity', copyProgress.toFixed(3));
  copy.style.setProperty('--dock-copy-y', `${((1 - copyProgress) * 28).toFixed(2)}px`);

  if (progress >= 0.5 && !dockLanded) {
    dockLanded = true;
    copy.classList.add('is-landed');
    replayFoldText(copy.querySelectorAll('h2, .eyebrow, p:not(.eyebrow), .chapter-points span'));
  } else if (progress < 0.47 && dockLanded) {
    dockLanded = false;
    copy.classList.remove('is-landed');
  }
}

function bindDockSequence() {
  const copy = document.querySelector('.dock-copy');
  if (!copy) return;
  prepareFoldText(copy.querySelectorAll('h2, .eyebrow, p:not(.eyebrow), .chapter-points span'));
  const handler = () => { if (!dockRaf) dockRaf = requestAnimationFrame(updateDockSequence); };
  window.addEventListener('scroll', handler, { passive: true });
  window.addEventListener('resize', handler, { passive: true });
  reduceMotion.addEventListener('change', updateDockSequence);
  updateDockSequence();
}

const platformImageCache = new Map();
const PLATFORM_MORPH_DURATION = 1120;

function loadPlatformImage(src) {
  if (!platformImageCache.has(src)) {
    platformImageCache.set(src, new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Unable to load platform image: ${src}`));
      image.src = src;
    }));
  }
  return platformImageCache.get(src);
}

function createPlatformMorph(canvas, visual) {
  if (!canvas || !visual || reduceMotion.matches) return null;
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'high-performance' });
  if (!gl) return null;

  const vertexSource = `
    attribute vec2 aPosition;
    varying vec2 vUv;
    void main() {
      vUv = aPosition * 0.5 + 0.5;
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;
  const fragmentSource = `
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
  `;

  const compileShader = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };
  const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  gl.useProgram(program);
  const position = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uniforms = {
    from: gl.getUniformLocation(program, 'uFrom'),
    to: gl.getUniformLocation(program, 'uTo'),
    progress: gl.getUniformLocation(program, 'uProgress'),
    resolution: gl.getUniformLocation(program, 'uResolution'),
    fromSize: gl.getUniformLocation(program, 'uFromSize'),
    toSize: gl.getUniformLocation(program, 'uToSize')
  };
  const textures = [gl.createTexture(), gl.createTexture()];
  let runId = 0;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
    const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
  };

  const uploadTexture = (texture, image, sizeUniform, unit) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(unit === 0 ? uniforms.from : uniforms.to, unit);
    gl.uniform2f(sizeUniform, image.naturalWidth, image.naturalHeight);
  };

  const transition = async (fromSrc, toSrc) => {
    if (!fromSrc || !toSrc) return false;
    const [fromImage, toImage] = await Promise.all([loadPlatformImage(fromSrc), loadPlatformImage(toSrc)]);
    if (fromSrc === toSrc) return false;
    const activeRun = ++runId;
    resize();
    uploadTexture(textures[0], fromImage, uniforms.fromSize, 0);
    uploadTexture(textures[1], toImage, uniforms.toSize, 1);
    visual.src = toSrc;
    canvas.classList.add('is-active');
    const startedAt = performance.now();

    return new Promise((resolve) => {
      const render = (now) => {
        if (activeRun !== runId) {
          resolve(false);
          return;
        }
        const progress = Math.min(1, (now - startedAt) / PLATFORM_MORPH_DURATION);
        gl.uniform1f(uniforms.progress, progress);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        if (progress < 1) {
          requestAnimationFrame(render);
          return;
        }
        canvas.classList.remove('is-active');
        resolve(true);
      };
      requestAnimationFrame(render);
    });
  };

  window.addEventListener('resize', resize, { passive: true });
  return { transition };
}

function bindInteractions() {
  document.querySelectorAll('[data-toast]').forEach((button) => button.addEventListener('click', () => showToast(button.dataset.toast)));
  const platforms = [...document.querySelectorAll('.platform-chip')];
  const platformTrack = document.querySelector('.platform-row');
  const platformThumb = document.querySelector('.platform-thumb');
  const platformCanvas = document.querySelector('[data-platform-morph]');
  const status = document.querySelector('.demo-status');
  const platformVisual = document.querySelector('.platform-visual');
  const morph = createPlatformMorph(platformCanvas, platformVisual);
  let selectionRun = 0;

  const placePlatformThumb = (platform) => {
    if (!platformTrack || !platformThumb || !platform) return;
    const trackRect = platformTrack.getBoundingClientRect();
    const platformRect = platform.getBoundingClientRect();
    platformTrack.style.setProperty('--thumb-x', `${platformRect.left - trackRect.left}px`);
    platformTrack.style.setProperty('--thumb-width', `${platformRect.width}px`);
    platformTrack.classList.add('has-selection');
  };

  const selectPlatform = async (platform) => {
    if (!platform || !platformVisual) return;
    const nextSrc = platform.dataset.platformImage;
    const currentSrc = platformVisual.getAttribute('src');
    const activeRun = ++selectionRun;

    platforms.forEach((item) => {
      const isActive = item === platform;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-checked', String(isActive));
    });
    placePlatformThumb(platform);
    platformTrack?.classList.remove('is-rubbering');
    void platformTrack?.offsetWidth;
    platformTrack?.classList.add('is-rubbering');
    window.setTimeout(() => platformTrack?.classList.remove('is-rubbering'), 680);
    status.textContent = `正在连接 · ${platform.dataset.platform}`;
    platformVisual.alt = `Nexus ${platform.dataset.platform} 平台连接展示图`;

    if (currentSrc !== nextSrc) {
      if (morph) await morph.transition(currentSrc, nextSrc);
      else {
        await loadPlatformImage(nextSrc).catch(() => null);
        platformVisual.src = nextSrc;
      }
    }
    if (activeRun === selectionRun) {
      status.textContent = `已连接 · ${platform.dataset.platform}`;
    }
  };

  platforms.forEach((platform) => {
    platform.addEventListener('click', () => selectPlatform(platform));
    loadPlatformImage(platform.dataset.platformImage).catch(() => null);
  });
  window.addEventListener('resize', () => {
    placePlatformThumb(platforms.find((platform) => platform.classList.contains('is-active')));
  });
  document.querySelectorAll('.faq-item').forEach((item) => item.addEventListener('click', () => item.setAttribute('aria-expanded', String(item.getAttribute('aria-expanded') !== 'true'))));
}

function bindSectionObserver() {
  const navLinks = [...document.querySelectorAll('[data-section-link]')];
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (!entry.isIntersecting) return; const id = entry.target.dataset.section; navLinks.forEach((link) => link.classList.toggle('is-active', link.dataset.sectionLink === id)); document.querySelector('.site-shell')?.setAttribute('data-theme', entry.target.dataset.theme || 'blue'); }), { threshold: 0.46 });
  document.querySelectorAll('[data-section]').forEach((section) => observer.observe(section));
}

app.innerHTML = siteMarkup;
bindPointerScenes(); bindFoldText(); bindMenu(); bindSequence(); bindControlSequence(); bindPurchaseTransition(); bindDockSequence(); bindInteractions(); bindSectionObserver();
