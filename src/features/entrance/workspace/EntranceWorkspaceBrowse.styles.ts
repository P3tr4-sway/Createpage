import { type CSSProperties } from "react";

export const secondaryButtonStyle: CSSProperties = {
  height: 46,
  padding: "0 18px",
  borderRadius: "var(--radius-control)",
  border: "1px solid var(--border)",
  backgroundColor: "var(--surface-glass)",
  color: "var(--foreground)",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
};

export const sectionTitleStyle: CSSProperties = {
  margin: "6px 0 0",
  color: "var(--foreground)",
  fontSize: 38,
  fontWeight: 700,
  letterSpacing: "-0.03em",
};

export const sectionDescriptionStyle: CSSProperties = {
  margin: "8px 0 0",
  color: "var(--secondary)",
  fontSize: 15,
  fontWeight: 500,
};

export const panelStyle: CSSProperties = {
  padding: 18,
  borderRadius: "var(--radius-container)",
  border: "1px solid var(--border)",
  backgroundColor: "var(--surface-glass-strong)",
  boxShadow: "var(--elevation-sm)",
};

export const templateStripStyle: CSSProperties = {
  padding: "2px 0 0",
};

export const templateStripHintStyle: CSSProperties = {
  margin: "6px 0 0",
  color: "var(--secondary)",
  fontSize: 13,
  fontWeight: 500,
};

export const miniSectionTitleStyle: CSSProperties = {
  margin: 0,
  color: "var(--foreground)",
  fontSize: 17,
  fontWeight: 700,
};

export const inlineLinkButtonStyle: CSSProperties = {
  border: "none",
  minHeight: 44,
  padding: "0 6px",
  background: "transparent",
  color: "var(--secondary)",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

export const quickActionCardStyle: CSSProperties = {
  minHeight: 104,
  padding: 14,
  borderRadius: "var(--radius-container)",
  border: "1px solid var(--border)",
  backgroundColor: "var(--surface-glass-strong)",
  boxShadow: "0 8px 20px rgba(15,23,42,0.04)",
};

export const quickActionTagStyle: CSSProperties = {
  margin: "0 0 6px",
  color: "var(--secondary)",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

export const listTitleStyle: CSSProperties = {
  margin: 0,
  color: "var(--foreground)",
  fontSize: 15,
  fontWeight: 600,
};

export const listMetaStyle: CSSProperties = {
  margin: "4px 0 0",
  color: "var(--secondary)",
  fontSize: 13,
  fontWeight: 500,
};

export const quickActionMetaStyle: CSSProperties = {
  margin: "6px 0 0",
  color: "var(--secondary)",
  fontSize: 13,
  fontWeight: 500,
  lineHeight: 1.35,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

export const imageCardTitleStyle: CSSProperties = {
  margin: 0,
  color: "var(--on-image-primary)",
  fontSize: 15,
  fontWeight: 700,
  lineHeight: 1.3,
};

export const imageCardMetaStyle: CSSProperties = {
  margin: "4px 0 0",
  color: "var(--on-image-secondary)",
  fontSize: 13,
  fontWeight: 500,
};
