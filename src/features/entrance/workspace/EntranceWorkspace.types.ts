import { type LucideIcon } from "lucide-react";

export type ActionId = "looper";

export type CreateActionId =
  | "start-song"
  | "open-looper"
  | "try-guitar-riff"
  | "jam-vibe";

export type SidebarProjectId =
  | "late-night-arrangement"
  | "neo-soul-pocket-loop"
  | "dream-guitar-bed"
  | "house-drum-starter"
  | "blues-club-backing-kit"
  | "indie-pop-writer-room"
  | "ambient-swells-notes";

export type QuickActionId =
  | "make-song"
  | "jam-right-now"
  | "start-rock-loop"
  | "start-blues-jam"
  | "make-hip-hop-idea"
  | "solo-guitar-take";

export type CreateActionCopy = {
  id: CreateActionId;
  label: string;
  meta: string;
};

export type SidebarProjectCopy = {
  id: SidebarProjectId;
  title: string;
  meta: string;
  status: string;
  typeLabel: string;
};

export type QuickActionCopy = {
  id: QuickActionId;
  title: string;
  meta: string;
  tag: string;
};

export type SidebarAction = {
  id: CreateActionId;
  label: string;
  meta?: string;
  icon: LucideIcon;
  accent: string;
  onClick: () => void;
};

export type SidebarProject = {
  id: SidebarProjectId;
  title: string;
  meta: string;
  status: string;
  typeLabel: string;
  onClick: () => void;
};

export type QuickAction = {
  id: QuickActionId;
  title: string;
  meta: string;
  tag: string;
  imageUrl: string;
  onClick: () => void;
};
