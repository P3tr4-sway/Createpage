import { type LucideIcon } from "lucide-react";
import { type CSSProperties } from "react";
import type { SidebarProject } from "@/features/entrance/workspace/EntranceWorkspace.types";

interface LoopLaunchPanelProps {
  title: string;
  description: string;
  onLaunch: () => void;
}

interface SidebarStartActionProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}

interface SidebarProjectListItemProps {
  project: SidebarProject;
}

export function LoopLaunchPanel({
  onLaunch,
  title,
  description,
}: LoopLaunchPanelProps) {
  return (
    <button
      type="button"
      onClick={onLaunch}
      className="tablet-touch-target tablet-pressable tablet-hover-soft relative flex h-full w-full flex-col overflow-hidden rounded-card border border-border p-6 text-left"
      style={loopLaunchPanelStyle}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 style={loopLaunchTitleStyle}>{title}</h3>
        </div>
      </div>

      <p style={loopLaunchDescriptionStyle}>{description}</p>

      <div className="flex flex-1 items-center justify-center py-6">
        <div style={loopGraphicWrapStyle}>
          <div style={loopOuterDiscStyle} />
          <div style={loopOuterGuideStyle} />
          <div style={loopMidDiscStyle} />
          <div style={loopInnerRingStyle} />
          <div style={loopStemStyle} />
          <div style={loopMarkerStyle} />
          <div style={loopHubStyle} />
        </div>
      </div>
    </button>
  );
}

export function SidebarStartAction({
  label,
  icon: Icon,
  onClick,
}: SidebarStartActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="tablet-touch-target tablet-pressable tablet-hover-soft flex w-full items-center text-left"
      style={sidebarStartActionStyle}
    >
      <span
        className="flex shrink-0 items-center justify-center"
        style={sidebarActionIconStyle}
        aria-hidden="true"
      >
        <Icon size={18} strokeWidth={1.95} />
      </span>
      <span className="min-w-0 flex-1">
        <span style={sidebarStartLabelStyle}>{label}</span>
      </span>
    </button>
  );
}

export function SidebarProjectListItem({
  project,
}: SidebarProjectListItemProps) {
  return (
    <button
      type="button"
      onClick={project.onClick}
      className="tablet-touch-target tablet-pressable tablet-hover-soft flex w-full items-start text-left"
      style={sidebarProjectItemStyle}
    >
      <span className="min-w-0">
        <span style={sidebarProjectTitleStyle}>{project.title}</span>
      </span>
    </button>
  );
}

const sidebarStartActionStyle: CSSProperties = {
  width: "100%",
  minHeight: 50,
  padding: "5px 12px 5px 14px",
  borderRadius: 16,
  border: "1px solid transparent",
  backgroundColor: "transparent",
  color: "var(--foreground)",
  fontSize: 16,
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  gap: 13,
  cursor: "pointer",
  boxShadow: "none",
};

const sidebarStartLabelStyle: CSSProperties = {
  display: "block",
  color: "inherit",
  fontSize: 16,
  fontWeight: 650,
  lineHeight: 1.25,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const sidebarActionIconStyle: CSSProperties = {
  color: "var(--foreground)",
  width: 21,
  height: 21,
  borderRadius: 0,
  border: "none",
  boxShadow: "none",
};

const sidebarProjectItemStyle: CSSProperties = {
  width: "100%",
  minHeight: 42,
  padding: "5px 12px 5px 14px",
  borderRadius: 16,
  border: "1px solid transparent",
  backgroundColor: "transparent",
  color: "var(--foreground)",
  cursor: "pointer",
};

const sidebarProjectTitleStyle: CSSProperties = {
  display: "block",
  color: "var(--foreground)",
  fontSize: 15,
  fontWeight: 600,
  lineHeight: 1.3,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const loopLaunchPanelStyle: CSSProperties = {
  backgroundColor: "var(--card)",
};

const loopLaunchTitleStyle: CSSProperties = {
  margin: 0,
  color: "var(--foreground)",
  fontSize: "var(--text-xl)",
  fontWeight: 700,
  fontFamily: "var(--app-font-family)",
};

const loopLaunchDescriptionStyle: CSSProperties = {
  margin: 0,
  color: "var(--secondary)",
  fontSize: "var(--text-sm)",
  fontWeight: "var(--font-weight-normal)",
  fontFamily: "var(--app-font-family)",
};

const loopGraphicWrapStyle: CSSProperties = {
  position: "relative",
  width: "min(100%, 260px)",
  aspectRatio: "1 / 1",
};

const loopOuterDiscStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  borderRadius: "50%",
  background:
    "linear-gradient(90deg, color-mix(in srgb, var(--foreground) 12%, var(--card) 88%) 0%, color-mix(in srgb, var(--foreground) 8%, var(--card) 92%) 49.5%, color-mix(in srgb, var(--foreground) 3%, var(--card) 97%) 50.5%, color-mix(in srgb, var(--foreground) 5%, var(--card) 95%) 100%)",
};

const loopOuterGuideStyle: CSSProperties = {
  position: "absolute",
  inset: 28,
  borderRadius: "50%",
  border: "3px solid color-mix(in srgb, var(--foreground) 10%, transparent)",
};

const loopMidDiscStyle: CSSProperties = {
  position: "absolute",
  inset: 72,
  borderRadius: "50%",
  background:
    "linear-gradient(90deg, color-mix(in srgb, var(--foreground) 26%, var(--card) 74%) 0%, color-mix(in srgb, var(--foreground) 20%, var(--card) 80%) 49.6%, color-mix(in srgb, var(--foreground) 6%, var(--card) 94%) 50.4%, color-mix(in srgb, var(--foreground) 10%, var(--card) 90%) 100%)",
  boxShadow: "0 0 0 3px color-mix(in srgb, var(--foreground) 10%, transparent)",
};

const loopInnerRingStyle: CSSProperties = {
  position: "absolute",
  inset: 110,
  borderRadius: "50%",
  border: "3px solid color-mix(in srgb, var(--foreground) 12%, transparent)",
};

const loopStemStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  top: 42,
  width: 3,
  height: 100,
  marginLeft: -1.5,
  borderRadius: 999,
  backgroundColor: "color-mix(in srgb, var(--foreground) 36%, var(--card) 64%)",
};

const loopMarkerStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  top: 80,
  width: 10,
  height: 36,
  marginLeft: -5,
  borderRadius: 999,
  borderTop: "5px solid color-mix(in srgb, var(--foreground) 36%, var(--card) 64%)",
  borderBottom: "5px solid color-mix(in srgb, var(--foreground) 36%, var(--card) 64%)",
  backgroundColor: "transparent",
};

const loopHubStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  top: "50%",
  width: 34,
  height: 34,
  marginLeft: -17,
  marginTop: -17,
  borderRadius: "50%",
  backgroundColor: "color-mix(in srgb, var(--foreground) 18%, var(--card) 82%)",
  boxShadow: "0 0 0 6px color-mix(in srgb, var(--foreground) 3%, transparent)",
};
