# UI Alignment Checklist (Figma vs Android)

## P0/P1/P2/P3 priority rule

- P0: 阻断核心流程或不可用
- P1: 主要视觉/交互偏差
- P2: 明显一致性问题
- P3: 细节优化项

## PM acceptance checklist

- 导航结构与信息层级一致
- 字体层级（字号/字重/行高）一致
- 颜色 token 使用一致
- 组件状态完整（default/selected/disabled/loading）
- 弹窗层级和遮罩行为一致
- 空态、加载态、处理进度态覆盖完整

## Developer handoff checklist

- Token 映射：`token_name -> value -> Android resource`
- 组件映射：`component -> states -> style refs`
- 布局规则：基线尺寸、间距节奏、区域尺寸
- 交互规则：点击反馈、禁用逻辑、过渡/动画
- 复用策略：优先复用已有组件，避免样式复制

## Issue row template

每条对齐问题统一记录：
- `Component/Screen`
- `Expected (Figma)`
- `Observed`
- `Impact`
- `Fix suggestion`
