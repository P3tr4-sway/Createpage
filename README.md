# LavaDAW UI/UX Design Lab

本仓库用于 LavaDAW / LavaStudio 新模块的纯 UI/UX 设计与迭代。
当前已提供固定 `1920x1080` 设计画布基座，适合先做 HTML 视觉稿，再同步到 Figma，最后实现到 Android。

## Quick Start

```bash
npm i
npm run dev
```

## 目标流程

1. 在固定画布中完成 UI 设计迭代（HTML/CSS/React）
2. 从本地页面导入 Figma 进行协作与标注
3. 输出 Android UI 实现规格（仅 UI 层，不改 DSP/音频链路）

详细流程见：
- `docs/ARCHITECTURE.md`
- `docs/ARCHITECTURE_V2.md`
- `docs/WORKFLOW_HTML_FIGMA_ANDROID.md`
- `docs/UI_ALIGNMENT_CHECKLIST.md`

## 目录结构

```text
.
├── docs/                        # 规范与流程文档
├── src/
│   ├── app/                     # 应用入口
│   ├── core/design/             # 设计工作台（固定画布壳层）
│   ├── modules/                 # 按业务模块组织设计页面
│   │   └── entrance/            # 当前入口模块设计
│   └── styles/                  # 全局样式与 token
└── guidelines/                  # 既有设计资料
```
