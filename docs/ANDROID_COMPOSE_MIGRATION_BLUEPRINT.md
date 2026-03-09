# Android Compose Migration Blueprint

## 1. 目标

把当前 `React + Vite` 的 UI/UX 设计仓库迁移到 Android，并尽可能保持 UI/UX 一致。

迁移目标不是把 React 代码逐行翻译成 Kotlin，而是建立一条稳定链路：

`React prototype -> Pencil design system + screenshot baseline -> Jetpack Compose implementation`

核心原则：
- Web 仓库是高保真原型和规格源。
- Pencil 是结构化设计源和视觉验收基线。
- Android 用 Jetpack Compose 落地，不走 XML。
- GPT 5.4 只做受约束重构，不做自由发挥式重写。

## 2. 为什么这条路线适合当前仓库

当前仓库已经具备三项关键基础：

1. 已有明确的 HTML -> Android 交付链路文档
   - 见 `docs/WORKFLOW_HTML_FIGMA_ANDROID.md`
2. 已有可迁移的 token 体系
   - 见 `src/styles/theme.css`
3. 已有 feature 化架构约束
   - 见 `docs/ARCHITECTURE_V2.md`

但也有两个直接影响迁移质量的风险：

1. 页面容器过大，不适合直接喂给 GPT
   - `src/features/entrance/workspace/EntranceWorkspace.tsx`: 817 行
   - `src/features/entrance/pages/AgenticProducingPage.tsx`: 1590 行
2. 如果直接从 JSX 生成 Compose，视觉、状态和布局语义会耦合在一起，后续很难维护

结论：
- 先抽 token、状态、组件契约，再迁移。
- 先用 Pencil 固化设计结构，再写 Android。

## 3. 最佳实践总览

推荐采用四层真相源：

1. `Design Tokens`
   - 颜色、字号、圆角、阴影、间距、触控尺寸
2. `Component Contract`
   - Button/Card/Input/Sheet/Dialog/Hero/ListItem 的结构、状态和插槽
3. `Screen Contract`
   - 页面区域划分、滚动规则、交互层级、状态切换
4. `Platform Implementation`
   - Compose Theme、Composable、ViewModel、Navigation

迁移时的优先级始终是：

`token 一致性 > 组件结构一致性 > 页面布局一致性 > 动画细节一致性`

原因很简单：
- token 和组件契约稳定后，页面可以批量重建
- 如果一开始就盯着整页像素复刻，后续维护成本会非常高

## 4. Phase 0: 先把 React 仓库变成“规格源”

在开始 Android 迁移前，先做一次最小必要整理。

### 4.1 抽离 token

以 `src/styles/theme.css` 为主来源，整理为平台无关的 token 表。

建议先只保留 Android 需要的语义级 token：
- Color
- Typography
- Radius
- Elevation
- Spacing
- Touch target

建议优先映射的 token：

| Web token | Android token 建议 |
| --- | --- |
| `--background` | `AppBackground` |
| `--foreground` | `AppForeground` |
| `--card` | `SurfaceCard` |
| `--border` | `BorderDefault` |
| `--primary` | `ActionPrimary` |
| `--muted-foreground` | `TextSecondary` |
| `--radius-control` | `ShapeControl` |
| `--radius-card` | `ShapeCard` |
| `--radius-pill` | `ShapePill` |
| `--elevation-sm` | `ElevationSmall` |
| `--touch-target-min` | `TouchTargetMin` |

### 4.2 抽离页面状态

每个页面至少补齐以下状态：
- default
- hover 或 pressed 的视觉反馈说明
- selected
- disabled
- loading
- empty
- modal/sheet open
- progress/processing
- error

这些状态必须落在 `specs/` 文档里，而不是只存在于组件逻辑中。

### 4.3 抽离组件契约

每个核心组件输出一份契约，固定以下字段：
- component name
- purpose
- layout structure
- supported states
- token dependencies
- content slots
- interaction rules
- accessibility notes

### 4.4 先拆巨石文件再迁移

建议沿用 `docs/ARCHITECTURE_V2.md` 的预算：
- 页面容器文件控制在 400 行以内
- 通用组件控制在 250 行以内
- 复杂状态下沉到 feature state hooks

目的不是“为了代码好看”，而是为了让 GPT 5.4 每次只处理可控上下文。

## 5. Phase 1: 用 Pencil MCP 建立结构化设计基线

Pencil 在这条链路里不只是画图工具，而是 Android 实现前的结构化设计源。

### 5.1 Pencil 负责什么

Pencil 负责：
- 组件树和页面布局结构
- 可复用组件定义
- 间距、对齐、层级关系
- 截图验收基线

Pencil 不负责：
- Android 业务逻辑
- ViewModel 设计
- 导航业务编排

### 5.2 推荐工作流

1. 先从设计系统开始，不要先画整页
   - Button
   - Card
   - Input
   - Sheet
   - Dialog
   - Navigation item
   - Hero block
   - Media tile

2. 再拼页面骨架
   - Sidebar
   - Main content
   - Overlay / bottom sheet
   - Dialog layer

3. 最后补状态和截图基线

### 5.3 推荐 MCP 操作顺序

如果需要用 Pencil MCP 系统化推进，建议顺序如下：

1. `get_editor_state`
   - 看当前文档、选择和 schema
2. `get_guidelines("design-system")`
   - 按设计系统方式组织 reusable component
3. `batch_get`
   - 先列已有组件，避免重复造轮子
4. `batch_design`
   - 小批次绘制，优先做 screen structure 和 component slots
5. `get_screenshot`
   - 每完成一块就截图校验
6. `snapshot_layout`
   - 检查重叠、裁切和间距问题

### 5.4 Pencil 产物要求

每个页面必须至少产出：
- 一个结构化 screen frame
- 一组可复用组件
- 一组状态变体
- 一张验收截图

每个组件必须至少定义：
- 默认态
- 激活态或选中态
- 禁用态
- 加载态或骨架态

## 6. Phase 2: Android 端只用 Jetpack Compose

### 6.1 为什么必须是 Compose

Compose 更适合你现在这类高保真、状态多、组件多、需要快速对齐设计的项目：
- token 映射自然
- 组件复用成本低
- Preview 适合逐组件验收
- 状态驱动 UI，和你当前 React 模型接近

不建议路线：
- React WebView 封装
- XML 复刻 React 页面
- 直接把 CSS 思维搬到 Android

### 6.2 Compose 落地结构

建议 Android 目录也对齐当前前端分层：

```text
android-app/
  ui/
    theme/
      Color.kt
      Type.kt
      Shape.kt
      Spacing.kt
      Theme.kt
    components/
      button/
      card/
      input/
      sheet/
      dialog/
      nav/
    screens/
      entrance/
        EntranceScreen.kt
        EntranceSections.kt
        EntranceUiState.kt
        EntranceUiAction.kt
        EntranceViewModel.kt
    navigation/
      Route.kt
      NavEvents.kt
```

### 6.3 Compose 侧硬约束

- 所有视觉值来自 theme token，禁止硬编码
- 所有 screen 拆成 section，再拆成 component
- 导航事件走 event-based navigation
- route 使用 typed/sealed class
- UI 组件优先无状态，状态由 screen 或 ViewModel 驱动

## 7. Phase 3: GPT 5.4 的正确职责

GPT 5.4 应该做“受约束重构器”，不是“自由生成器”。

### 7.1 GPT 5.4 的输入

每次只给一个组件或一个 section，输入固定为：
- Pencil 截图
- 组件契约
- token 映射表
- 状态表
- 交互说明
- Compose 代码风格约束

### 7.2 GPT 5.4 的输出

每次输出只允许包含：
- `@Composable`
- 对应 `UiState`
- 对应 `UiAction`
- Preview
- 必要的 theme 接入代码

如果一次让 GPT 生成整页内容，通常会出现：
- token 漏用
- spacing 漂移
- 状态不完整
- 组件不可复用
- 导航和 UI 耦合

### 7.3 GPT 5.4 使用边界

让 GPT 做：
- JSX 结构归纳
- 组件切分
- token 对齐
- Compose 组件重写
- Preview 生成
- state contract 补全

不要让 GPT 做：
- 自己重定义视觉风格
- 擅自修改信息架构
- 一次性改完整个 feature
- 把状态和导航塞进组件内部

## 8. 推荐的 GPT 5.4 Prompt 模板

下面这个模板适合逐组件迁移：

```text
You are migrating a React/Vite UI prototype to Android Jetpack Compose.

Target:
- Keep UI/UX visually almost identical
- Use only the provided design tokens
- Preserve layout hierarchy, spacing rhythm, and component states
- Do not redesign the screen

Input artifacts:
- Screenshot baseline from Pencil
- Component contract
- Token mapping table
- State table

Implementation constraints:
- Jetpack Compose only
- Material 3 theme integration
- No hardcoded colors, radii, spacing, or typography values
- Stateless composable first
- ViewModel navigation must stay outside the composable

Output exactly:
1. Kotlin composable
2. UiState
3. UiAction if needed
4. Preview
5. Notes on any unresolved platform differences
```

## 9. 推荐的迁移顺序

不要按页面迁移，按设计系统成熟度迁移。

建议顺序：

1. Foundation tokens
2. Typography scale
3. Shape and elevation
4. Primitive components
   - Button
   - Chip
   - Card
   - Input
   - Badge
   - Divider
5. Complex containers
   - Sheet
   - Dialog
   - Sidebar item
   - Hero panel
6. Repeated page sections
   - Quick actions
   - Browse rows
   - Project list
7. Full screens
   - Entrance home
   - Looper
   - Backing track
   - Agentic producing

## 10. 验收机制

### 10.1 三层对齐

每个 screen 都做三层对齐：
- React 原型截图
- Pencil 基线截图
- Android Compose 截图

### 10.2 验收项

至少检查以下项目：
- 颜色 token 是否一致
- 字体层级是否一致
- 圆角和阴影是否一致
- 组件状态是否完整
- 弹层位置和遮罩行为是否一致
- 列表、卡片、sheet 的间距节奏是否一致
- 点击反馈、禁用反馈、加载反馈是否一致
- 触控区域是否达到最小尺寸

### 10.3 差异优先级

- P0: 核心流程不可用
- P1: 主要视觉或交互偏差
- P2: 一致性问题
- P3: 细节优化

## 11. 你这个项目的第一批迁移清单

针对当前仓库，建议第一批只做这些：

1. `theme.css` token -> Android theme token
2. Entrance 首页的 sidebar 和 hero
3. Quick action card
4. Project list item
5. Template / project sheet
6. Tutorial dialog

先不要一上来做：
- `AgenticProducingPage` 全量迁移
- 所有页面并行迁移
- 复杂动效的精细复刻

原因：
- 当前 `AgenticProducingPage` 规模过大，先迁它风险最高
- 先把基础组件和骨架打稳，后面的页面会快很多

## 12. 反模式

以下做法会明显增加失败率：

- 直接把 React JSX 粘给 GPT 要求“转 Android”
- 不建立 token map 就开始写 Compose
- 不做截图基线，靠肉眼回忆对齐
- 页面优先而不是组件优先
- 视觉稿、状态表、实现代码三套真相源彼此不一致
- 在 Compose 中大量硬编码 dp、sp、Color

## 13. 最终交付包

每个模块交付时固定输出：
- Pencil 页面或组件链接
- 截图基线
- token 映射表
- 组件映射表
- screen 状态表
- Compose 实现代码
- 验收差异清单

## 14. 一句话执行策略

先把 React 仓库整理成规格源，用 Pencil 把设计结构和截图基线固定，再让 GPT 5.4 按组件批次生成 Jetpack Compose，并通过截图对比做验收。
