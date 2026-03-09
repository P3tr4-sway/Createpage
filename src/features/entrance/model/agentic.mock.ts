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
    icon: "drums",
    role: "Pocket",
    level: "-4.5 dB",
    defaultVolume: 78,
    volume: 78,
    pan: 0,
    clips: [
      {
        id: "drums-a",
        label: "Full groove",
        startBeat: 0,
        durationBeats: 96,
        fill: "linear-gradient(135deg, rgba(69, 132, 255, 0.94), rgba(40, 87, 214, 0.94))",
        accent: "#DCE7FF",
      },
    ],
  },
];

const jamyTracks: ArrangementTrack[] = [
  {
    id: "audio",
    name: "Audio",
    icon: "default",
    role: "Capture",
    level: "-6.0 dB",
    defaultVolume: 74,
    volume: 74,
    pan: -4,
    clips: [
      {
        id: "audio-take-a",
        label: "Take 01",
        startBeat: 8,
        durationBeats: 48,
        fill: "linear-gradient(135deg, rgba(248, 113, 113, 0.96), rgba(185, 28, 28, 0.92))",
        accent: "#FFF1F2",
      },
    ],
  },
  {
    id: "backing-track",
    name: "Backing Track",
    icon: "default",
    role: "Guide",
    level: "-3.0 dB",
    defaultVolume: 82,
    volume: 82,
    pan: 4,
    clips: [
      {
        id: "backing-track-a",
        label: "Midnight Neo-Soul",
        startBeat: 0,
        durationBeats: 96,
        fill: "linear-gradient(135deg, rgba(96, 165, 250, 0.96), rgba(37, 99, 235, 0.92))",
        accent: "#EFF6FF",
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
        }
      : null;
  const clipLabelMap =
    locale === "zh-CN"
      ? {
          "drums-a": "完整 Groove",
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

export function getJamyTracksForLocale(locale: Locale) {
  const trackNameMap =
    locale === "zh-CN"
      ? {
          audio: { name: "Audio", role: "录音" },
          "backing-track": { name: "Backing Track", role: "伴奏" },
        }
      : null;
  const clipLabelMap =
    locale === "zh-CN"
      ? {
          "audio-take-a": "Take 01",
          "backing-track-a": "午夜 Neo-Soul",
        }
      : null;

  return jamyTracks.map((track) => ({
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
