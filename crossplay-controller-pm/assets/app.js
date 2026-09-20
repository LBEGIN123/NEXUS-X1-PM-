const platformRegistry = {
  pc: {
    label: "WINDOWS",
    profile: "FPS_NEON / 2.4G",
    color: "#24d8ff",
    rgb: "36, 216, 255",
    note: "2.4G 底座中继已启用，1000Hz 目标采样。"
  },
  xbox: {
    label: "XBOX SERIES X",
    profile: "XBOX_COMPAT / USB-C",
    color: "#4ee58f",
    rgb: "78, 229, 143",
    note: "第一版 Xbox 使用有线兼容，不承诺无线与高级反馈。"
  },
  switch: {
    label: "NINTENDO SWITCH",
    profile: "SWITCH_PRO / BLUETOOTH",
    color: "#ff4d6d",
    rgb: "255, 77, 109",
    note: "平台按键布局已恢复为 Nintendo 映射，支持唤醒。"
  },
  steamos: {
    label: "STEAMOS",
    profile: "STEAM_DECK / 2.4G",
    color: "#9c7dff",
    rgb: "156, 125, 255",
    note: "Steam Input 可见，背键映射与桌面配置同步。"
  },
  mobile: {
    label: "MOBILE / CLOUD",
    profile: "CLOUD_READY / BLUETOOTH",
    color: "#ffd34d",
    rgb: "255, 211, 77",
    note: "移动端使用蓝牙与云游戏预设，后台宏受系统限制。"
  }
};

const controllerTemplate = document.querySelector("#controller-template");

function mountControllers() {
  if (!controllerTemplate) return;

  document.querySelectorAll("[data-controller-mount]").forEach((mount, index) => {
    const clone = controllerTemplate.content.cloneNode(true);
    const controller = clone.querySelector(".controller-device");
    if (mount.closest(".prototype-frame")) {
      controller.classList.add("mini-controller");
    }
    mount.appendChild(clone);
  });
}

function setPlatform(platformKey) {
  const platform = platformRegistry[platformKey] || platformRegistry.pc;
  document.documentElement.style.setProperty("--platform", platform.color);
  document.documentElement.style.setProperty("--platform-rgb", platform.rgb);

  document.querySelectorAll("[data-platform-label]").forEach((element) => {
    element.textContent = platform.label;
  });

  document.querySelectorAll("[data-profile-label]").forEach((element) => {
    element.textContent = platform.profile;
  });

  document.querySelectorAll("[data-platform]").forEach((button) => {
    const isActive = button.dataset.platform === platformKey;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  document.querySelectorAll("[data-controller]").forEach((controller) => {
    controller.dataset.activePlatform = platformKey;
  });
}

let toastTimer;

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2800);
}

function bindPlatformControls() {
  document.addEventListener("click", (event) => {
    const platformButton = event.target.closest("[data-platform]");
    if (platformButton) {
      const platformKey = platformButton.dataset.platform;
      setPlatform(platformKey);
      showToast(`${platformRegistry[platformKey].label}：${platformRegistry[platformKey].note}`);
      return;
    }

    const hotspot = event.target.closest("[data-hotspot]");
    if (hotspot) {
      document.querySelectorAll("[data-hotspot].is-active").forEach((item) => item.classList.remove("is-active"));
      hotspot.classList.add("is-active");
      showToast(`${hotspot.dataset.hotspot}：原型中可打开对应模块；正式 PRD 要求映射、曲线、扳机和宏均可回滚。`);
    }
  });
}

function bindScrollProgress() {
  const progress = document.querySelector(".scroll-progress");
  if (!progress) return;

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, value))}%`;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function bindSectionNavigation() {
  const links = Array.from(document.querySelectorAll(".nav a[href^='#']"));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    links.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
    });

    const sequenceItems = Array.from(document.querySelectorAll(".sequence-item"));
    sequenceItems.forEach((item) => {
      item.classList.toggle("is-active", item.getAttribute("href") === `#${visible.target.id}`);
    });
  }, {
    rootMargin: "-18% 0px -58% 0px",
    threshold: [0.05, 0.2, 0.45]
  });

  sections.forEach((section) => observer.observe(section));
}

function bindReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, localObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      localObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px" });

  elements.forEach((element) => observer.observe(element));
}

function bindPointerTilt() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.querySelectorAll(".product-stage").forEach((stage) => {
    const controller = stage.querySelector(".controller-device");
    if (!controller) return;

    stage.addEventListener("pointermove", (event) => {
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      controller.style.transform = `perspective(1100px) rotateX(${7 - y * 8}deg) rotateY(${-7 + x * 9}deg) rotateZ(-3deg)`;
    });

    stage.addEventListener("pointerleave", () => {
      controller.style.transform = "";
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  mountControllers();
  bindPlatformControls();
  bindScrollProgress();
  bindSectionNavigation();
  bindReveal();
  bindPointerTilt();
  setPlatform("pc");
});

