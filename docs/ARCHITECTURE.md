# Architecture for Iterative UI/UX Design

## 1. Core principle

- 单一设计基线：所有页面在 `1920x1080` 画布上设计。
- 模块化迭代：每个业务模块独立在 `src/features/<feature-name>/`。
- 设计先行：先做视觉与交互，再映射到 Android 资源。
- UI-only 边界：本仓库只定义 UI/UX，不包含音频/DSP 逻辑。

## 2. Runtime shell

- `src/core/design/DesignWorkbench.tsx`
  - 固定画布尺寸：`1920x1080`
  - 视口内自适应缩放（保持比例，不改设计坐标）
  - 作为所有设计模块的统一容器

- `src/app/App.tsx`
  - 只负责挂载工作台与当前模块

## 3. Module convention

每个新模块按以下组织：

```text
src/features/<feature-name>/
├── index.ts                        # 模块公共入口
├── workspace/                      # 模块主画布
├── pages/                          # 模块页面
├── components/                     # 模块私有组件
├── state/                          # 模块状态
├── model/                          # 类型与 mock 数据
├── i18n/                           # 模块文案
├── specs/                          # 交互说明、状态定义、标注
└── styles/                         # 模块样式
```

## 4. Style convention

- 全局 token：`src/styles/theme.css`
- 工作台样式：`src/styles/workbench.css`
- 字体与全局入口：`src/styles/index.css`

建议规则：
- 颜色、圆角、间距优先使用 token 变量。
- 避免在组件中散落硬编码值（尤其颜色、字号、间距）。

## 5. Extension strategy

新增模块时：
1. 创建 `src/features/<name>/` 目录
2. 实现模块 `workspace/` 与 `index.ts`
3. 在 `src/app/App.tsx` 切换挂载模块
4. 为该模块补充 `specs/` 下的状态与交互文档

这样可保持：
- 每次只迭代一个模块
- 历史模块可并行维护
- 方便与 Figma 节点逐模块对齐
