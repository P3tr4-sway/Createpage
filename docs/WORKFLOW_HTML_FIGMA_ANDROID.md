# Workflow: HTML -> Figma -> Android (LavaStudio/LavaDAW)

## A. HTML design phase (this repo)

1. 在 `src/features/<feature>/` 完成视觉和交互状态稿。
2. 保持画布为 `1920x1080` 基线。
3. 在模块 `specs/` 中写清楚状态：默认/选中/禁用/加载/进度/弹窗。

## B. HTML to Figma phase

推荐用 Figma MCP 的页面捕获能力，把本地页面导入 Figma：

1. 启动本地页面
   - `npm run dev`
2. 确认页面 URL（例如 `http://localhost:5173`）
3. 使用 Figma MCP capture（`generate_figma_design`）将页面导入 Figma
4. 在 Figma 中整理图层、组件、变量和注释

建议：
- 一个业务模块一个 Figma Page
- 一个核心组件一个 Figma Component Set
- 变量命名与仓库 token 命名保持一致

## C. Figma to Android phase

输出 Android 落地清单（UI-only）：

1. Foundation tokens
   - 颜色 -> `colors.xml`
   - 字号/间距/圆角 -> `dimens.xml`
2. 组件样式
   - Button/Card/Input 等 -> `styles.xml` / Compose theme
3. 状态映射
   - default/selected/disabled/loading/progress/modal
4. 屏幕布局
   - 区域尺寸、对齐、间距节奏

## D. Boundary (important)

本流程仅覆盖 UI/UX 与视图层，不改动：
- DSP/音频处理链路
- 编解码与 PCM 处理逻辑
- 音轨混音核心逻辑

## E. Handoff package

每次模块交付建议固定输出：
1. Figma 链接（目标节点）
2. 模块状态清单
3. Token 映射表（Figma -> Android）
4. UI 验收 checklist
