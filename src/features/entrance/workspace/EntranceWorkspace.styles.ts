import { type CSSProperties } from "react";

export const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: "var(--secondary)",
  fontSize: 12,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  fontWeight: 700,
};

export const railHeadingStyle: CSSProperties = {
  margin: "3px 0 0",
  color: "var(--foreground)",
  fontSize: 26,
  lineHeight: 1.02,
  letterSpacing: "-0.03em",
  fontWeight: 700,
};

export const iconButtonStyle: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: "var(--radius-control)",
  border: "none",
  backgroundColor: "transparent",
  color: "var(--foreground)",
  cursor: "pointer",
};

export const languageSelectWrapStyle: CSSProperties = {
  position: "relative",
  minWidth: 118,
};

export const languageSelectStyle: CSSProperties = {
  width: "100%",
  height: 44,
  padding: "0 34px 0 14px",
  borderRadius: "var(--radius-control)",
  border: "1px solid color-mix(in srgb, var(--border) 78%, transparent)",
  backgroundColor: "color-mix(in srgb, var(--card) 78%, transparent)",
  color: "var(--foreground)",
  fontSize: 13,
  fontWeight: 600,
  appearance: "none",
  outline: "none",
  cursor: "pointer",
};

export const languageSelectIconStyle: CSSProperties = {
  position: "absolute",
  top: "50%",
  right: 13,
  transform: "translateY(-50%)",
  color: "var(--secondary)",
  pointerEvents: "none",
};

export const sidebarSectionStyle: CSSProperties = {
  paddingTop: 22,
  borderTop: "1px solid color-mix(in srgb, var(--border) 76%, transparent)",
};

export const sidebarSectionLabelStyle: CSSProperties = {
  margin: 0,
  color: "var(--foreground)",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

export const sidebarProjectListStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  paddingRight: 2,
};

export const topTitleStyle: CSSProperties = {
  margin: "4px 0 0",
  color: "var(--foreground)",
  fontSize: 26,
  fontWeight: 700,
  letterSpacing: "-0.02em",
};

export const workspaceSectionStyle: CSSProperties = {
  paddingBottom: 28,
};
