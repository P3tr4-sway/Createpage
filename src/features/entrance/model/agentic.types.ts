import type { Locale } from "@/features/entrance/EntranceLocaleContext";

export type ArrangementClip = {
  id: string;
  label: string;
  startBeat: number;
  durationBeats: number;
  fill: string;
  accent: string;
};

export type ArrangementTrack = {
  id: string;
  name: string;
  icon: "drums" | "default";
  role: string;
  level: string;
  defaultVolume: number;
  volume: number;
  pan: number;
  clips: ArrangementClip[];
};

export type AgentMode = "musician" | "producer";
export type AgenticExperience = "default" | "jam";
export type JamSuggestionStage = "pre-record" | "post-record" | "second-track";

export type MusicianTargetId =
  | "ai-drummer"
  | "ai-bassist"
  | "ai-guitarist"
  | "ai-keyboardist"
  | "ai-percussionist"
  | "ai-vocalist";

export type MusicianTarget = {
  id: MusicianTargetId;
  label: string;
  helper: string;
  showsLyrics: boolean;
  trackMatch: string;
};

export type OverlayMenu = "target" | "mode" | null;

export type ProducerMessage = {
  id: string;
  role: "user" | "agent";
  text: string;
  timestamp: string;
};

export type QueueStatus = "Generating" | "Queued" | "Ready";

export type AudioQueueItem = {
  id: string;
  title: string;
  owner: string;
  status: QueueStatus;
  detail: string;
  progress: string;
};

export type GenerationHistoryItem = {
  id: string;
  title: string;
  owner: string;
  meta: string;
  timestamp: string;
};

export type AgenticCopy = (typeof import("../i18n/agentic.copy").agenticCopyByLocale)[Locale];
