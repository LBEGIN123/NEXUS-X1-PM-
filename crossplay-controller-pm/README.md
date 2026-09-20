# NEXUS X1 跨平台竞技手柄 PM 面试方案

一个面向游戏外设产品经理面试的完整案例包，包含：

- 竞品与用户研究
- 产品方案与商业化取舍
- 可交互的高保真浏览器原型
- Axure 页面与交互还原说明
- 可编辑 PRD 与 Word 版 PRD

> Axure 说明：当前交付环境未安装 Axure RP，因此没有生成原生 `.rp` 工程文件。`prototype.html` 是可点击的高保真交互复刻，`docs/Axure原型还原指南.md` 提供页面树、全局变量、状态和交互规则，可直接据此在 Axure RP 中还原。

## 快速开始

直接打开 `index.html` 浏览案例总览。

如需完整体验原型，可启动本地静态服务器：

```powershell
python -m http.server 4173
```

然后访问：

- 案例总览：`http://localhost:4173/index.html`
- 可交互原型：`http://localhost:4173/prototype.html`

也可以直接打开 `prototype.html`，原型不依赖构建工具或外部网络资源。

## 产品定义

产品名：`NEXUS X1`

一句话定位：让玩家在 PC、Xbox、Switch、SteamOS、iOS 与 Android 之间，保留同一套操作手感。

第一版连接边界：

- PC / SteamOS：USB-C 有线、2.4G、蓝牙
- Xbox Series X|S / Xbox One：USB-C 有线
- Switch：蓝牙，支持唤醒
- iOS / iPadOS / Android：蓝牙
- 云游戏：通过移动端与 PC 模式覆盖

不承诺 PS5 原生兼容。第三方无线手柄进入 Xbox 与 PlayStation 生态涉及授权、安全芯片和认证周期，第一版通过 Xbox 有线模式控制合规风险与上市成本。

## 研究声明

当前版本属于面试演示基线：

- 竞品能力来自品牌官网公开产品页。
- 用户问题来自公开评论模式与可验证的使用场景。
- 样本量、流失率和价格弹性属于待验证目标，不应包装成已完成的一手调研结论。

面试展示时，建议明确说明“这是研究设计 + 桌面研究结论 + 待验证假设”，并携带问卷原始数据或访谈记录补充证据。

## 文件说明

- `index.html`：研究、方案、原型、PRD 的统一展示入口
- `prototype.html`：独立可点击原型
- `assets/styles.css`：案例总览与原型视觉样式
- `assets/app.js`：案例总览交互
- `assets/prototype.js`：原型状态、切换、配对、调参和测试逻辑
- `docs/竞品与用户研究.md`：研究方法和洞察
- `docs/产品方案.md`：产品定位、范围、硬件与软件方案
- `docs/PRD.md`：完整 PRD 源文档
- `docs/Axure原型还原指南.md`：Axure 页面树、组件、状态和交互说明
- `docs/跨平台竞技手柄_PRD.docx`：可直接用于面试评审的 Word 版 PRD
- `data/competitor-matrix.csv`：竞品矩阵原始表
- `data/research-plan.csv`：访谈与问卷执行计划
