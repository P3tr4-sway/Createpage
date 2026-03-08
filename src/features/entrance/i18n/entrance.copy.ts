import type { Locale } from "@/features/entrance/EntranceLocaleContext";
import type { HeroPromptSuggestion } from "../model/entrance.types";
import type {
  CreateActionCopy,
  QuickActionCopy,
  SidebarProjectCopy,
} from "../workspace/EntranceWorkspace.types";

export const LOCALE_STORAGE_KEY = "lavadaw-locale";

export const localeOptions: Array<{ value: Locale; label: string }> = [
  { value: "en", label: "English" },
  { value: "zh-CN", label: "简体中文" },
];

export const getInitialLocale = (): Locale => {
  if (typeof window === "undefined") {
    return "en";
  }

  const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (storedLocale === "en" || storedLocale === "zh-CN") {
    return storedLocale;
  }

  const browserLocale = (window.navigator.languages?.[0] ?? window.navigator.language ?? "").toLowerCase();
  return browserLocale.startsWith("zh") ? "zh-CN" : "en";
};

export type EntranceWorkspaceCopy = {
  contentTitles: Record<
    | "home"
    | "looper"
    | "backingTrack"
    | "quickActions"
    | "topSongs"
    | "topTemplates"
    | "tutorials",
    string
  >;
  back: string;
  seeAll: string;
  viewAll: string;
  start: string;
  myProjects: string;
  switchToLightMode: string;
  switchToDarkMode: string;
  languageSelectorAriaLabel: string;
  openFullWorkspaceAriaLabel: string;
  sidebarHeroTitle: string;
  sidebarHeroCopy: string;
  heroPreviewEyebrow: string;
  heroPreviewLabel: string;
  heroPromptPlaceholder: string;
  heroPromptStart: string;
  heroPromptShowMore: string;
  heroPromptEmpty: string;
  heroPromptSuggestions: HeroPromptSuggestion[];
  launchTitle: string;
  launchDescription: string;
  browseEyebrow: string;
  browseTitle: string;
  tutorialTitle: string;
  tutorialPartUnit: string;
  createActions: CreateActionCopy[];
  sidebarProjects: SidebarProjectCopy[];
  quickActions: QuickActionCopy[];
  quickActionsHeading: string;
  quickActionsHint: string;
  quickActionsPageDescription: string;
  looperLaunchTitle: string;
  looperLaunchDescription: string;
};

export const copyByLocale = {
  en: {
    contentTitles: {
      home: "Create",
      looper: "Looper",
      backingTrack: "Backing Track",
      quickActions: "Quick Actions",
      topSongs: "Top Songs",
      topTemplates: "Top Jam Tracks",
      tutorials: "Tutorials",
    },
    back: "Back",
    seeAll: "See all",
    viewAll: "View all",
    start: "Start",
    myProjects: "My Projects",
    switchToLightMode: "Switch to light mode",
    switchToDarkMode: "Switch to dark mode",
    languageSelectorAriaLabel: "Select language",
    openFullWorkspaceAriaLabel: "Open full workspace",
    sidebarHeroTitle: "Start with the idea.",
    sidebarHeroCopy: "Start a song, sketch a loop, jam a vibe, or catch a riff. No DAW map first. Just pick your flow and go.",
    heroPreviewEyebrow: "Full DAW",
    heroPreviewLabel: "Tap anywhere to start.",
    heroPromptPlaceholder: "Start with your AI Music Producer.",
    heroPromptStart: "Start",
    heroPromptShowMore: "Show more",
    heroPromptEmpty: "No matching starter prompt yet. Try words like jazz, trap, ambient, or neo-soul.",
    heroPromptSuggestions: [
      {
        tag: "Jazz Fusion",
        title: "Late-night jazz fusion",
        prompt: "Make a late-night jazz fusion groove.",
      },
      {
        tag: "Neo Soul",
        title: "Loose neo-soul pocket",
        prompt: "Start a loose neo-soul jam.",
      },
      {
        tag: "Indie Pop",
        title: "Hopeful indie pop chorus",
        prompt: "Write a bright indie pop hook.",
      },
      {
        tag: "Trap",
        title: "Dark minimal trap beat",
        prompt: "Create a dark minimal trap beat.",
      },
      {
        tag: "Ambient",
        title: "Weightless ambient scene",
        prompt: "Make a weightless ambient sketch.",
      },
    ] as HeroPromptSuggestion[],
    launchTitle: "Choose how to start.",
    launchDescription: "Pick one path. You can switch later.",
    browseEyebrow: "Charts",
    browseTitle: "What's moving right now.",
    tutorialTitle: "Tutorial",
    tutorialPartUnit: "parts",
    createActions: [
      {
        id: "start-song",
        label: "Start a song",
        meta: "Build a full idea fast.",
      },
      {
        id: "open-looper",
        label: "Open Looper",
        meta: "Build a loop and lock the groove fast.",
      },
      {
        id: "try-guitar-riff",
        label: "Try a guitar riff",
        meta: "Open a playable guitar idea and start from it.",
      },
      {
        id: "jam-vibe",
        label: "Jam a vibe",
        meta: "Start loose and explore a feeling.",
      },
    ],
    sidebarProjects: [
      {
        id: "late-night-arrangement",
        title: "Late Night Arrangement",
        meta: "Edited 2h ago",
        status: "Song draft",
        typeLabel: "Song",
      },
      {
        id: "neo-soul-pocket-loop",
        title: "Neo Soul Pocket Loop",
        meta: "Edited yesterday",
        status: "Looper",
        typeLabel: "Looper",
      },
      {
        id: "dream-guitar-bed",
        title: "Dream Guitar Bed",
        meta: "Edited yesterday",
        status: "Guitar idea",
        typeLabel: "Jamy",
      },
      {
        id: "house-drum-starter",
        title: "House Drum Starter",
        meta: "Edited 3d ago",
        status: "Template",
        typeLabel: "Jamy",
      },
      {
        id: "blues-club-backing-kit",
        title: "Blues Club Backing Kit",
        meta: "Edited 4d ago",
        status: "Backing track",
        typeLabel: "Jamy",
      },
      {
        id: "indie-pop-writer-room",
        title: "Indie Pop Writer Room",
        meta: "Edited 5d ago",
        status: "Template",
        typeLabel: "Jamy",
      },
      {
        id: "ambient-swells-notes",
        title: "Ambient Swells Notes",
        meta: "Edited last week",
        status: "Guitar idea",
        typeLabel: "Jamy",
      },
    ],
    quickActions: [
      {
        id: "make-song",
        title: "Make a Song",
        meta: "Open the full workspace and start arranging immediately.",
        tag: "Song",
      },
      {
        id: "jam-right-now",
        title: "Jam Right Now",
        meta: "Jump to the AI jam prompt and start with a vibe.",
        tag: "Jam",
      },
      {
        id: "start-rock-loop",
        title: "Start a Rock Loop",
        meta: "Open Looper with a rock-ready filter and browse fast riffs.",
        tag: "Rock",
      },
      {
        id: "start-blues-jam",
        title: "Start a Blues Jam",
        meta: "Open backing tracks already pointed at blues-friendly grooves.",
        tag: "Blues",
      },
      {
        id: "make-hip-hop-idea",
        title: "Make a Hip-Hop Idea",
        meta: "Launch a trap and hip-hop leaning starter session.",
        tag: "Hip-Hop",
      },
      {
        id: "solo-guitar-take",
        title: "Solo a Guitar Take",
        meta: "Open a featured guitar clip and jump into a lead-focused flow.",
        tag: "Guitar",
      },
    ],
    quickActionsHeading: "Quick Actions",
    quickActionsHint: "Swipe horizontally to jump into a concrete session, loop, jam, or guitar flow.",
    quickActionsPageDescription: "Pick a concrete starting point and jump directly into the right flow.",
    looperLaunchTitle: "Looper",
    looperLaunchDescription: "Play fast.",
  },
  "zh-CN": {
    contentTitles: {
      home: "创作",
      looper: "循环器",
      backingTrack: "伴奏",
      quickActions: "快捷开始",
      topSongs: "热门歌曲",
      topTemplates: "热门 Jam Tracks",
      tutorials: "教程",
    },
    back: "返回",
    seeAll: "查看全部",
    viewAll: "全部查看",
    start: "开始",
    myProjects: "我的项目",
    switchToLightMode: "切换到浅色模式",
    switchToDarkMode: "切换到深色模式",
    languageSelectorAriaLabel: "选择语言",
    openFullWorkspaceAriaLabel: "打开完整工作区",
    sidebarHeroTitle: "先从想法开始。",
    sidebarHeroCopy: "起一个 song、做一个 loop、jam 一个 vibe，或抓住一个 riff。不用先理解 DAW 结构，选一个入口就开做。",
    heroPreviewEyebrow: "完整 DAW",
    heroPreviewLabel: "点击任意位置开始。",
    heroPromptPlaceholder: "从你的 AI 音乐制作人开始。",
    heroPromptStart: "开始",
    heroPromptShowMore: "显示更多",
    heroPromptEmpty: "还没有匹配的起始提示词。试试 jazz、trap、ambient 或 neo-soul 之类的关键词。",
    heroPromptSuggestions: [
      {
        tag: "爵士融合",
        title: "深夜爵士融合",
        prompt: "做一个深夜感的爵士融合 groove。",
      },
      {
        tag: "新灵魂",
        title: "松弛的新灵魂律动",
        prompt: "开始一段松弛的新灵魂 jam。",
      },
      {
        tag: "独立流行",
        title: "有希望感的独立流行副歌",
        prompt: "写一个明亮的独立流行 hook。",
      },
      {
        tag: "陷阱",
        title: "极简暗黑 Trap Beat",
        prompt: "做一个暗黑极简的 trap beat。",
      },
      {
        tag: "氛围",
        title: "失重感氛围场景",
        prompt: "做一个有失重感的 ambient 草图。",
      },
    ] as HeroPromptSuggestion[],
    launchTitle: "选择你的开始方式。",
    launchDescription: "先选一条路径，之后仍然可以切换。",
    browseEyebrow: "榜单",
    browseTitle: "看看大家现在在听什么、用什么、学什么。",
    tutorialTitle: "教程",
    tutorialPartUnit: "节",
    createActions: [
      {
        id: "start-song",
        label: "开始一首歌",
        meta: "快速搭起一个完整想法。",
      },
      {
        id: "open-looper",
        label: "打开循环器",
        meta: "快速做一个 loop，把 groove 锁住。",
      },
      {
        id: "try-guitar-riff",
        label: "试试吉他 riff",
        meta: "打开一个可演奏的吉他灵感直接开始。",
      },
      {
        id: "jam-vibe",
        label: "来段即兴 vibe",
        meta: "轻松起步，先探索一种感觉。",
      },
    ],
    sidebarProjects: [
      {
        id: "late-night-arrangement",
        title: "深夜编曲",
        meta: "2 小时前编辑",
        status: "歌曲草稿",
        typeLabel: "Song",
      },
      {
        id: "neo-soul-pocket-loop",
        title: "Neo Soul 律动 Loop",
        meta: "昨天编辑",
        status: "循环器",
        typeLabel: "Looper",
      },
      {
        id: "dream-guitar-bed",
        title: "梦境吉他铺底",
        meta: "昨天编辑",
        status: "吉他灵感",
        typeLabel: "Jamy",
      },
      {
        id: "house-drum-starter",
        title: "House 鼓组起步模板",
        meta: "3 天前编辑",
        status: "模板",
        typeLabel: "Jamy",
      },
      {
        id: "blues-club-backing-kit",
        title: "布鲁斯俱乐部伴奏包",
        meta: "4 天前编辑",
        status: "伴奏",
        typeLabel: "Jamy",
      },
      {
        id: "indie-pop-writer-room",
        title: "独立流行写作房",
        meta: "5 天前编辑",
        status: "模板",
        typeLabel: "Jamy",
      },
      {
        id: "ambient-swells-notes",
        title: "环境音 Swells 记录",
        meta: "上周编辑",
        status: "吉他灵感",
        typeLabel: "Jamy",
      },
    ],
    quickActions: [
      {
        id: "make-song",
        title: "做一首歌",
        meta: "直接打开完整工作区，立刻开始编排。",
        tag: "歌曲",
      },
      {
        id: "jam-right-now",
        title: "立刻 Jam",
        meta: "跳到 AI Jam 提示词，从一种 vibe 开始。",
        tag: "即兴",
      },
      {
        id: "start-rock-loop",
        title: "开始一个摇滚 Loop",
        meta: "用摇滚筛选直接打开 Looper，快速浏览 riff。",
        tag: "摇滚",
      },
      {
        id: "start-blues-jam",
        title: "开始一段蓝调 Jam",
        meta: "打开已定位到蓝调 groove 的伴奏页面。",
        tag: "蓝调",
      },
      {
        id: "make-hip-hop-idea",
        title: "做一个 Hip-Hop 灵感",
        meta: "启动偏 trap / hip-hop 的起始 session。",
        tag: "Hip-Hop",
      },
      {
        id: "solo-guitar-take",
        title: "弹一段吉他 Solo",
        meta: "打开精选吉他片段，直接进入 lead 流程。",
        tag: "吉他",
      },
    ],
    quickActionsHeading: "快捷开始",
    quickActionsHint: "横向滑动，直接进入具体的 session、loop、jam 或吉他流程。",
    quickActionsPageDescription: "挑一个明确的起点，直接跳进对应工作流。",
    looperLaunchTitle: "循环器",
    looperLaunchDescription: "马上开弹。",
  },
} as const satisfies Record<Locale, EntranceWorkspaceCopy>;
