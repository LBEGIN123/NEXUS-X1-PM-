const platforms = {
  pc: {
    label: "WINDOWS",
    connection: "2.4G",
    profile: "FPS_NEON / 2.4G",
    shortProfile: "FPS_NEON",
    polling: "1000Hz",
    latency: "3.2ms",
    battery: 86,
    color: "#24d8ff",
    rgb: "36, 216, 255",
    message: "Windows 已通过 Nexus Link 底座进入 2.4G 模式。"
  },
  xbox: {
    label: "XBOX SERIES X",
    connection: "USB-C",
    profile: "XBOX_COMPAT / USB-C",
    shortProfile: "XBOX_COMPAT",
    polling: "250Hz",
    latency: "5.8ms",
    battery: 100,
    color: "#4ee58f",
    rgb: "78, 229, 143",
    message: "Xbox 第一版使用有线兼容，不承诺无线与高级反馈。"
  },
  switch: {
    label: "NINTENDO SWITCH",
    connection: "BLUETOOTH",
    profile: "SWITCH_PRO / BT",
    shortProfile: "SWITCH_PRO",
    polling: "125Hz",
    latency: "7.4ms",
    battery: 79,
    color: "#ff4d6d",
    rgb: "255, 77, 109",
    message: "Switch 平台已恢复 Nintendo 按键布局与体感开关。"
  },
  steamos: {
    label: "STEAMOS",
    connection: "2.4G",
    profile: "STEAM_DECK / 2.4G",
    shortProfile: "STEAM_DECK",
    polling: "1000Hz",
    latency: "3.6ms",
    battery: 83,
    color: "#9c7dff",
    rgb: "156, 125, 255",
    message: "SteamOS 可见背键，并恢复到最近一次 Steam Input 配置。"
  },
  mobile: {
    label: "MOBILE / CLOUD",
    connection: "BLUETOOTH",
    profile: "CLOUD_READY / BT",
    shortProfile: "CLOUD_READY",
    polling: "250Hz",
    latency: "6.1ms",
    battery: 81,
    color: "#ffd34d",
    rgb: "255, 211, 77",
    message: "移动端进入云游戏预设，宏配置同步但不在移动设备执行。"
  }
};

const controllerTemplate = document.querySelector("#controller-template");
const pairingOverlay = document.querySelector("#pairing-overlay");
const pairingSteps = Array.from(document.querySelectorAll(".pairing-step"));
let activePlatform = "pc";
let activeTab = "device";
let toastTimer;
let pairingTimer;
let testTimer;

function mountControllers() {
  if (!controllerTemplate) return;

  document.querySelectorAll("[data-controller-mount]").forEach((mount) => {
    const clone = controllerTemplate.content.cloneNode(true);
    const controller = clone.querySelector(".controller-device");
    if (mount.closest(".phone")) {
      controller.classList.remove("proto-controller");
      controller.classList.add("phone-device");
    }
    mount.appendChild(clone);
  });
}

function setPlatform(platformKey, notify = true) {
  const platform = platforms[platformKey] || platforms.pc;
  activePlatform = platformKey;

  document.documentElement.style.setProperty("--platform", platform.color);
  document.documentElement.style.setProperty("--platform-rgb", platform.rgb);

  document.querySelectorAll("[data-platform-label]").forEach((element) => {
    element.textContent = platform.label;
  });

  document.querySelectorAll("[data-profile-label]").forEach((element) => {
    element.textContent = platform.profile;
  });

  document.querySelectorAll("[data-profile-short]").forEach((element) => {
    element.textContent = platform.shortProfile;
  });

  document.querySelectorAll("[data-connection]").forEach((element) => {
    element.textContent = platform.connection;
  });

  document.querySelectorAll("[data-polling]").forEach((element) => {
    element.textContent = platform.polling;
  });

  document.querySelectorAll("[data-latency]").forEach((element) => {
    element.textContent = platform.latency;
  });

  document.querySelectorAll("[data-battery-text]").forEach((element) => {
    element.textContent = `${platform.battery}%`;
  });

  document.querySelectorAll("[data-battery-bar]").forEach((element) => {
    element.style.width = `${platform.battery}%`;
  });

  document.querySelectorAll("[data-platform]").forEach((button) => {
    const isActive = button.dataset.platform === platformKey;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  const health = document.querySelector(".health-score");
  if (health && activeTab === "device") {
    health.textContent = platform.connection === "USB-C" ? "100" : "98";
  }

  if (notify) {
    showToast(`${platform.label}：${platform.message}`);
  }
}

function setTab(tabKey) {
  activeTab = tabKey;

  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === tabKey);
  });

  document.querySelectorAll(".rail-button[data-tab]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === tabKey);
  });

  document.querySelectorAll("[data-panel]").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === tabKey);
  });

  document.querySelectorAll("[data-stage]").forEach((stage) => {
    stage.classList.toggle("is-active", stage.dataset.stage === tabKey);
  });

  const health = document.querySelector(".health-score");
  if (health) {
    health.textContent = tabKey === "device" ? (platforms[activePlatform].connection === "USB-C" ? "100" : "98") : tabKey === "mobile" ? "SYNC" : tabKey === "test" ? "98" : tabKey === "mapping" ? "5" : "LIVE";
  }
}

function showToast(message) {
  const toast = document.querySelector(".toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function resetPairingSteps() {
  pairingSteps.forEach((step) => {
    step.classList.remove("is-running", "is-done");
    const status = step.querySelector("em");
    status.textContent = "WAITING";
  });
}

function openPairing() {
  window.clearInterval(pairingTimer);
  resetPairingSteps();
  pairingOverlay.classList.add("is-open");
}

function closePairing() {
  window.clearInterval(pairingTimer);
  pairingOverlay.classList.remove("is-open");
}

function startPairing() {
  window.clearInterval(pairingTimer);
  resetPairingSteps();
  let stepIndex = 0;

  const advance = () => {
    pairingSteps.forEach((step, index) => {
      step.classList.toggle("is-running", index === stepIndex);
      step.classList.toggle("is-done", index < stepIndex);
      const status = step.querySelector("em");
      if (index < stepIndex) status.textContent = "DONE";
      if (index === stepIndex) status.textContent = "RUNNING";
      if (index > stepIndex) {
        status.textContent = "WAITING";
        step.classList.remove("is-running", "is-done");
      }
    });

    if (stepIndex >= pairingSteps.length) {
      window.clearInterval(pairingTimer);
      showToast(`${platforms[activePlatform].label} 已连接，配置与输入检查均通过。`);
      window.setTimeout(closePairing, 650);
      return;
    }

    stepIndex += 1;
  };

  advance();
  pairingTimer = window.setInterval(advance, 560);
}

function runInputTest() {
  const button = document.querySelector("#run-test");
  const score = document.querySelector("#test-score");
  const result = document.querySelector("#test-result");
  const platform = platforms[activePlatform];
  const values = [8, 26, 48, 71, 89, 98];
  let index = 0;

  window.clearInterval(testTimer);
  button.disabled = true;
  button.textContent = "测试中...";
  result.textContent = "正在检查连接通道、回报稳定性、抖动与丢包...";

  testTimer = window.setInterval(() => {
    score.textContent = values[index];
    index += 1;

    if (index >= values.length) {
      window.clearInterval(testTimer);
      button.disabled = false;
      button.textContent = "再次运行测试";
      if (platform.connection === "USB-C" || platform.connection === "2.4G") {
        score.textContent = "98";
        result.innerHTML = `<strong style="color:var(--lime)">竞技级连接</strong><br>${platform.polling} 目标回报，平均延迟 ${platform.latency}，抖动与丢包处于建议阈值内。`;
      } else {
        score.textContent = "86";
        result.innerHTML = `<strong style="color:var(--yellow)">稳定连接</strong><br>蓝牙通道适用于动作、竞速和云游戏。若进行竞技射击，建议切换 2.4G 或 USB-C。`;
      }
    }
  }, 300);
}

function bindControls() {
  document.addEventListener("click", (event) => {
    const platformButton = event.target.closest("[data-platform]");
    if (platformButton) {
      setPlatform(platformButton.dataset.platform);
      return;
    }

    const tabButton = event.target.closest("[data-tab]");
    if (tabButton) {
      setTab(tabButton.dataset.tab);
      return;
    }

    const hotspot = event.target.closest("[data-hotspot]");
    if (hotspot) {
      document.querySelectorAll("[data-hotspot].is-active").forEach((item) => item.classList.remove("is-active"));
      hotspot.classList.add("is-active");
      const label = document.querySelector("#hotspot-label");
      if (label) {
        label.innerHTML = `<strong>${hotspot.dataset.hotspot}</strong><br>点击热区可进入对应模块。正式原型中，模块以右侧检查器或动态面板呈现，并保留返回状态。`;
      }
      showToast(`已选中 ${hotspot.dataset.hotspot}`);
    }
  });
}

function bindPairing() {
  document.querySelector("#pair-button").addEventListener("click", openPairing);
  document.querySelector("#close-pairing").addEventListener("click", closePairing);
  document.querySelector("#confirm-pairing").addEventListener("click", startPairing);

  pairingOverlay.addEventListener("click", (event) => {
    if (event.target === pairingOverlay) closePairing();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && pairingOverlay.classList.contains("is-open")) {
      closePairing();
    }
  });
}

function bindSliders() {
  const bindings = [
    ["#deadzone", "#deadzone-output", "%"],
    ["#outer", "#outer-output", "%"],
    ["#trigger", "#trigger-output", "%"],
    ["#vibration", "#vibration-output", "%"],
    ["#gyro-level", "#gyro-output", "%"]
  ];

  bindings.forEach(([inputSelector, outputSelector, suffix]) => {
    const input = document.querySelector(inputSelector);
    const output = document.querySelector(outputSelector);
    if (!input || !output) return;
    input.addEventListener("input", () => {
      output.textContent = `${input.value}${suffix}`;
    });
  });

  document.querySelectorAll(".switch input").forEach((input) => {
    input.addEventListener("change", () => {
      const row = input.closest(".toggle-row");
      showToast(`${row?.querySelector("span")?.textContent || "设置"}已${input.checked ? "开启" : "关闭"}。`);
    });
  });
}

function bindActions() {
  const saveButton = document.querySelector("#save-profile");
  if (saveButton) {
    saveButton.addEventListener("click", () => {
      showToast("配置已保存到机身配置 3，并标记为待账号同步。");
    });
  }

  const testButton = document.querySelector("#run-test");
  if (testButton) {
    testButton.addEventListener("click", runInputTest);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  mountControllers();
  bindControls();
  bindPairing();
  bindSliders();
  bindActions();
  setPlatform("pc", false);
  setTab("device");
});

