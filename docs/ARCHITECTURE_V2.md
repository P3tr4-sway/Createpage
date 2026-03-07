# Architecture V2: 可维护、可迭代的前端架构

## 1. 目标与边界

### 目标
- 可维护：功能边界清晰，避免单文件巨石。
- 可迭代：支持按模块快速试验 UI，不影响其他区域。
- 可协作：文案、样式、状态、交互可并行开发。
- 可验证：重构后有最小自动化保障（类型、测试、构建）。

### 非目标
- 本仓库不承载音频/DSP 真实业务逻辑，仅承载 UI/UX 设计与交互原型。

## 2. 分层架构（强约束）

采用 `App Shell -> Feature -> Shared` 三层，禁止反向依赖。

1. `App Shell`（壳层）
- 职责：挂载工作台、主题、路由/模块切换、全局 Provider。
- 不放业务页面实现细节。

2. `Feature`（业务模块层）
- 每个模块自包含：页面、组件、状态、文案、mock 数据、样式。
- 只通过模块 `index.ts` 暴露公共 API（对外入口）。

3. `Shared`（共享能力层）
- 复用 UI 原子组件、hooks、工具函数、全局 token。
- 不依赖具体 Feature。

依赖方向：
- 允许：`app -> features -> shared`
- 禁止：`shared -> features`、`feature A -> feature B`（除非通过对方公开 API）

## 3. 目标目录结构

```text
src/
  app/
    App.tsx
    providers/
      ThemeProvider.tsx
    shell/
      DesignWorkbenchShell.tsx

  features/
    entrance/
      index.ts
      workspace/
        EntranceWorkspace.tsx
      pages/
        HomePage.tsx
        LooperPage.tsx
        InstantBackingTrackPage.tsx
        AgenticProducingPage.tsx
      components/
        sidebar/
        hero/
        quick-actions/
        charts/
      state/
        entrance.reducer.ts
        entrance.actions.ts
        entrance.selectors.ts
        useEntranceStore.ts
      model/
        types.ts
        constants.ts
        mock-data.ts
      i18n/
        en.ts
        zh-CN.ts
      styles/
        entrance.css

  shared/
    ui/
    hooks/
    lib/
    styles/
      tokens.css
      utilities.css

  core/
    design/
      DesignWorkbench.tsx
```

## 4. 状态架构设计

按“作用域”拆状态，避免所有状态堆在单组件里。

1. 组件局部状态（`useState`）
- 只放纯展示态：hover、展开、输入草稿等短生命周期状态。

2. Feature 级状态（`useReducer` + 自定义 hook）
- 入口模块核心状态统一放 `features/entrance/state`。
- 例如：
  - `navigationState`: `activeSection`, `activeSubView`, `fullscreenView`
  - `panelState`: `projectsOpen`, `templateOpen`, `songOpen`, `guitarOpen`, `tutorialOpen`
  - `heroPromptState`: `heroPromptValue`, `heroPromptOpen`, `suggestions`
  - `producerState`: `agentMode`, `queue`, `history`, `messages`

3. 状态组织规则
- UI 事件统一变成 action（可追踪、可测试）。
- selector 负责派生数据，组件不直接拼复杂业务逻辑。
- effect（监听、定时器、全局事件）下沉到 `useXXXEffects`。

## 5. 文案与数据架构

1. 文案（i18n）
- 每个 feature 独立文案文件：`i18n/en.ts`、`i18n/zh-CN.ts`。
- 组件只取文案键，不内嵌大块 copy。

2. mock 数据
- 静态 demo 数据集中在 `model/mock-data.ts`。
- 严禁散落在页面组件内部。

3. 类型
- 类型统一在 `model/types.ts`。
- 页面层只消费类型，不定义重复结构。

## 6. 样式架构

当前大量 `style={{...}}` 不利于长期维护。建议：

1. 保留设计 token（已在 `src/styles/theme.css`）
- 所有颜色、圆角、间距优先使用 token。

2. 样式分层
- 布局与复用样式：`shared/styles`
- feature 定制样式：`features/<name>/styles`
- 极少量动态值才保留 inline style。

3. 规则
- 单文件避免堆积大量样式常量。
- 组件样式优先 class + token，降低 JSX 体积与 diff 噪音。

## 7. 质量门禁（必加）

`package.json` 增加以下脚本并接入 CI：

- `lint`: ESLint
- `typecheck`: `tsc --noEmit`
- `test`: Vitest 单测
- `test:e2e`: Playwright 关键流程
- `build`: 现有构建

PR 最低门槛：
- lint 通过
- typecheck 通过
- 单测通过
- 构建通过

## 8. 文件规模与复杂度预算

为避免再次回到“巨石文件”，设置硬性预算：

- 页面容器文件：建议 `< 400` 行，红线 `600` 行。
- 通用组件文件：建议 `< 250` 行，红线 `350` 行。
- 单组件 `useState` 数量：建议 `< 8`，超出需拆分 state slice。
- 单文件 inline style 块：建议 `< 15` 处，超出需抽样式。

## 9. 渐进式迁移路线（不推翻重来）

### Phase 0（1-2 天）：立规矩
- 建立目录骨架（`features/entrance/{state,model,i18n,styles}`）。
- 加 lint/typecheck/test 脚本。
- 增加 import 边界约束（禁止 feature 反向依赖 app 层）。

### Phase 1（2-3 天）：拆数据与文案
- 从 `EntranceWorkspace.tsx`、`AgenticProducingPage.tsx` 抽离：
  - i18n 文案
  - mock 数据
  - type 定义
- 保持 UI 行为不变。

### Phase 2（3-5 天）：拆状态与容器
- 抽 `useEntranceStore`、`useAgenticProducerState`。
- 拆分 Home/Looper/BackingTrack/TopList/QuickActions 为独立 page/container。
- 事件改为 action dispatch + selector。

### Phase 3（2-4 天）：清理遗留与补测试
- 删除未引用旧组件。
- 为关键交互补测试：
  - subview 切换
  - sheet/dialog 打开关闭
  - timeline 播放与拖拽
  - 语言切换

### Phase 4（持续）：稳定迭代
- 新功能必须落在 feature 边界内。
- 每次 PR 进行架构检查（依赖方向 + 文件预算）。

## 10. 评审清单（每个 PR）

- 是否违反 `app -> feature -> shared` 依赖方向？
- 是否把文案、mock、类型散落回页面？
- 是否新增超大文件或超多局部状态？
- 是否包含对应测试或至少回归用例说明？
- 是否影响现有设计基线（1920x1080 工作台）？

---

这份 V2 的核心不是“重写”，而是“可回退、可验证、分阶段迁移”。先把边界和约束建立起来，再逐步拆巨石文件，风险最低、收益最大。
