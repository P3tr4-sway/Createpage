import { type LucideIcon } from "lucide-react";

export type ActionId = "looper";

export type SidebarAction = {
  label: string;
  meta?: string;
  icon: LucideIcon;
  accent: string;
  onClick: () => void;
};

export type SidebarProject = {
  id: string;
  title: string;
  meta: string;
  status: string;
  onClick: () => void;
};

export type QuickAction = {
  id: string;
  title: string;
  meta: string;
  tag: string;
  imageUrl: string;
  onClick: () => void;
};
