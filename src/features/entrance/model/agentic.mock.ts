import type { Locale } from "@/features/entrance/EntranceLocaleContext";
import { agenticCopyByLocale } from "../i18n/agentic.copy";
import type {
  MusicianTarget,
  ArrangementTrack,
} from "./agentic.types";

export const initialTracks: ArrangementTrack[] = [
  {
    id: "drums",
    name: "Drums",
    role: "Pocket",
    level: "-4.5 dB",
    clips: [
      {
        id: "drums-a",
        label: "Intro groove",
        startBeat: 0,
        durationBeats: 12,
        fill: "linear-gradient(135deg, rgba(69, 132, 255, 0.94), rgba(40, 87, 214, 0.94))",
        accent: "#DCE7FF",
      },
      {
        id: "drums-b",
        label: "Main pocket",
        startBeat: 16,
        durationBeats: 28,
        fill: "linear-gradient(135deg, rgba(46, 109, 239, 0.96), rgba(30, 74, 189, 0.96))",
        accent: "#F7FBFF",
      },
      {
        id: "drums-c",
        label: "Fill + lift",
        startBeat: 52,
        durationBeats: 8,
        fill: "linear-gradient(135deg, rgba(98, 146, 255, 0.96), rgba(46, 109, 239, 0.94))",
        accent: "#F7FBFF",
      },
    ],
  },
  {
    id: "bass",
    name: "Bass",
    role: "Low end",
    level: "-6.0 dB",
    clips: [
      {
        id: "bass-a",
        label: "Verse line",
        startBeat: 4,
        durationBeats: 20,
        fill: "linear-gradient(135deg, rgba(41, 185, 133, 0.94), rgba(24, 128, 92, 0.94))",
        accent: "#E7FFF6",
      },
      {
        id: "bass-b",
        label: "Hook sustain",
        startBeat: 28,
        durationBeats: 24,
        fill: "linear-gradient(135deg, rgba(58, 204, 148, 0.94), rgba(30, 145, 106, 0.96))",
        accent: "#F2FFF9",
      },
    ],
  },
  {
    id: "guitar",
    name: "Guitar",
    role: "Texture",
    level: "-8.2 dB",
    clips: [
      {
        id: "guitar-a",
        label: "Muted comp",
        startBeat: 8,
        durationBeats: 12,
        fill: "linear-gradient(135deg, rgba(249, 161, 71, 0.96), rgba(233, 119, 14, 0.94))",
        accent: "#FFF4E6",
      },
      {
        id: "guitar-b",
        label: "Open chorus",
        startBeat: 24,
        durationBeats: 20,
        fill: "linear-gradient(135deg, rgba(251, 186, 88, 0.96), rgba(242, 136, 26, 0.96))",
        accent: "#FFF6EA",
      },
      {
        id: "guitar-c",
        label: "Lift voicing",
        startBeat: 48,
        durationBeats: 12,
        fill: "linear-gradient(135deg, rgba(255, 194, 107, 0.96), rgba(244, 146, 37, 0.96))",
        accent: "#FFF9EF",
      },
    ],
  },
  {
    id: "vocal",
    name: "Vocal",
    role: "Lead",
    level: "-3.0 dB",
    clips: [
      {
        id: "vocal-a",
        label: "Guide vocal",
        startBeat: 12,
        durationBeats: 16,
        fill: "linear-gradient(135deg, rgba(216, 106, 156, 0.96), rgba(176, 65, 115, 0.94))",
        accent: "#FFF0F6",
      },
      {
        id: "vocal-b",
        label: "Hook doubles",
        startBeat: 32,
        durationBeats: 16,
        fill: "linear-gradient(135deg, rgba(230, 128, 174, 0.96), rgba(190, 79, 127, 0.95))",
        accent: "#FFF3F8",
      },
      {
        id: "vocal-c",
        label: "Outro adlibs",
        startBeat: 56,
        durationBeats: 8,
        fill: "linear-gradient(135deg, rgba(237, 145, 188, 0.96), rgba(198, 87, 137, 0.96))",
        accent: "#FFF6FA",
      },
    ],
  },
];

export const musicianTargets: MusicianTarget[] = [
  {
    id: "ai-drummer",
    label: "AI Drummer",
    helper: "Pocket, fills, and momentum",
    showsLyrics: false,
    trackMatch: "drums",
  },
  {
    id: "ai-bassist",
    label: "AI Bassist",
    helper: "Low-end pulse and movement",
    showsLyrics: false,
    trackMatch: "bass",
  },
  {
    id: "ai-guitarist",
    label: "AI Guitarist",
    helper: "Comping, voicings, and texture",
    showsLyrics: false,
    trackMatch: "guitar",
  },
  {
    id: "ai-keyboardist",
    label: "AI Keyboardist",
    helper: "Keys, harmony pads, and glue",
    showsLyrics: false,
    trackMatch: "keys",
  },
  {
    id: "ai-percussionist",
    label: "AI Percussionist",
    helper: "Perc layers and groove detail",
    showsLyrics: false,
    trackMatch: "perc",
  },
  {
    id: "ai-vocalist",
    label: "AI Vocalist",
    helper: "Topline, phrasing, and hooks",
    showsLyrics: true,
    trackMatch: "vocal",
  },
];

export function getInitialTracksForLocale(locale: Locale) {
  const trackNameMap =
    locale === "zh-CN"
      ? {
          drums: { name: "鼓组", role: "律动" },
          bass: { name: "贝斯", role: "低频" },
          guitar: { name: "吉他", role: "质感" },
          vocal: { name: "人声", role: "主线" },
        }
      : null;
  const clipLabelMap =
    locale === "zh-CN"
      ? {
          "drums-a": "前奏 Groove",
          "drums-b": "主段律动",
          "drums-c": "Fill + 提升",
          "bass-a": "主歌线条",
          "bass-b": "Hook 延音",
          "guitar-a": "闷音伴奏",
          "guitar-b": "开放副歌",
          "guitar-c": "抬升和弦",
          "vocal-a": "导唱",
          "vocal-b": "Hook 叠唱",
          "vocal-c": "尾段 Adlib",
        }
      : null;

  return initialTracks.map((track) => ({
    ...track,
    name: trackNameMap?.[track.id as keyof typeof trackNameMap]?.name ?? track.name,
    role: trackNameMap?.[track.id as keyof typeof trackNameMap]?.role ?? track.role,
    clips: track.clips.map((clip) => ({
      ...clip,
      label: clipLabelMap?.[clip.id as keyof typeof clipLabelMap] ?? clip.label,
    })),
  }));
}

export function getMusicianTargetsForLocale(locale: Locale) {
  const labelMap =
    locale === "zh-CN"
      ? {
          "ai-drummer": { label: "AI 鼓手", helper: "律动、fill 和推进感" },
          "ai-bassist": { label: "AI 贝斯手", helper: "低频脉冲和推动感" },
          "ai-guitarist": { label: "AI 吉他手", helper: "伴奏、和弦和纹理" },
          "ai-keyboardist": { label: "AI 键盘手", helper: "键盘、和声铺底和粘合感" },
          "ai-percussionist": { label: "AI 打击乐手", helper: "打击层次和 groove 细节" },
          "ai-vocalist": { label: "AI 主唱", helper: "Topline、咬字和 hook" },
        }
      : null;

  return musicianTargets.map((target) => ({
    ...target,
    label: labelMap?.[target.id as keyof typeof labelMap]?.label ?? target.label,
    helper: labelMap?.[target.id as keyof typeof labelMap]?.helper ?? target.helper,
  }));
}

export function getAgentModeOptionsForLocale(locale: Locale) {
  const copy = agenticCopyByLocale[locale];
  return [
    { id: "musician" as const, label: copy.aiMusician },
    { id: "producer" as const, label: copy.aiProducer },
  ];
}

export function getInitialProducerMessagesForLocale(locale: Locale) {
  const copy = agenticCopyByLocale[locale];
  return [
    {
      id: "producer-intro",
      role: "agent" as const,
      text:
        locale === "zh-CN"
          ? "告诉我段落、情绪或下一步动作。我会把它整理成明确的 pass，并路由给合适的 AI 乐手。"
          : "Tell me the section, mood, or next move. I will turn it into a concrete pass and route it to the right AI musician.",
      timestamp: copy.ready,
    },
  ];
}

export function getInitialAudioQueueForLocale(locale: Locale) {
  const copy = agenticCopyByLocale[locale];
  const targets = getMusicianTargetsForLocale(locale);
  const vocalist = targets.find((item) => item.id === "ai-vocalist")?.label ?? "AI Vocalist";
  const bassist = targets.find((item) => item.id === "ai-bassist")?.label ?? "AI Bassist";
  const drummer = targets.find((item) => item.id === "ai-drummer")?.label ?? "AI Drummer";
  return [
    {
      id: "queue-vocal-hook",
      title: locale === "zh-CN" ? "Hook 叠唱" : "Hook doubles",
      owner: vocalist,
      status: copy.statusGenerating,
      detail: locale === "zh-CN" ? "Neo Soul · 第 9-16 小节" : "Neo Soul • Bars 9-16",
      progress: copy.lyricProgress,
    },
    {
      id: "queue-bass-pocket",
      title: locale === "zh-CN" ? "主歌律动" : "Verse pocket",
      owner: bassist,
      status: copy.statusQueued,
      detail: locale === "zh-CN" ? "Neo Soul · 第 1-8 小节" : "Neo Soul • Bars 1-8",
      progress: locale === "zh-CN" ? "等待轨道路由交接" : "Waiting for lane handoff",
    },
    {
      id: "queue-drum-variation",
      title: locale === "zh-CN" ? "提升 Fill" : "Lift fill",
      owner: drummer,
      status: copy.statusReady,
      detail: locale === "zh-CN" ? "House · 第 17-20 小节" : "House • Bars 17-20",
      progress: locale === "zh-CN" ? "可以开始试听" : "Ready to audition",
    },
  ];
}

export function getInitialGenerationHistoryForLocale(locale: Locale) {
  const copy = agenticCopyByLocale[locale];
  const targets = getMusicianTargetsForLocale(locale);
  const drummer = targets.find((item) => item.id === "ai-drummer")?.label ?? "AI Drummer";
  const guitarist = targets.find((item) => item.id === "ai-guitarist")?.label ?? "AI Guitarist";
  return [
    {
      id: "history-drum-pocket",
      title: locale === "zh-CN" ? "主段律动" : "Main pocket",
      owner: drummer,
      meta: locale === "zh-CN" ? "Neo Soul · 鼓组" : "Neo Soul • Drums",
      timestamp: locale === "zh-CN" ? "2 分钟前" : "2 min ago",
    },
    {
      id: "history-guitar-comp",
      title: locale === "zh-CN" ? "闷音伴奏" : "Muted comp",
      owner: guitarist,
      meta: locale === "zh-CN" ? "Indie Pop · 吉他" : "Indie Pop • Guitar",
      timestamp: locale === "zh-CN" ? "12 分钟前" : "12 min ago",
    },
    {
      id: "history-producer-brief",
      title: copy.producerBrief,
      owner: copy.aiProducer,
      meta: locale === "zh-CN" ? "结构 + 提示单" : "Structure + cue sheet",
      timestamp: locale === "zh-CN" ? "18 分钟前" : "18 min ago",
    },
  ];
}
