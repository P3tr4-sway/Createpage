export interface EntranceWorkspaceTone {
  appBg: string;
  homeBg: string;
  railBorder: string;
  mainHeaderBg: string;
  heroScrim: string;
  heroBridge: string;
  heroFrameBg: string;
  heroHintBg: string;
  heroHintBorder: string;
  sidebarBackground: string;
  sidebarShadow: string;
  homeContentBackground: string;
}

export function getEntranceWorkspaceTone(isDark: boolean): EntranceWorkspaceTone {
  return {
    appBg: isDark ? "#171717" : "#f7f7f5",
    homeBg: isDark
      ? "radial-gradient(circle at 22% 0%, rgba(255,255,255,0.04), transparent 24%), linear-gradient(180deg, #171717 0%, #121212 34%, #171717 100%)"
      : "radial-gradient(circle at 18% 0%, rgba(255,255,255,0.62), transparent 24%), linear-gradient(180deg, #fbfbfa 0%, #f2f2ef 34%, #f7f7f5 100%)",
    railBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(23,23,23,0.08)",
    mainHeaderBg: isDark ? "#1c1c1c" : "#fafaf8",
    heroScrim: isDark
      ? "linear-gradient(180deg, rgba(6,8,12,0.18) 0%, rgba(6,8,12,0.36) 48%, rgba(6,8,12,0.6) 100%)"
      : "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.28) 48%, rgba(248,250,252,0.68) 100%)",
    heroBridge: isDark
      ? "linear-gradient(180deg, rgba(23,23,23,0) 0%, rgba(23,23,23,0.18) 36%, rgba(23,23,23,0.82) 100%)"
      : "linear-gradient(180deg, rgba(247,247,245,0) 0%, rgba(247,247,245,0.42) 36%, rgba(247,247,245,0.95) 100%)",
    heroFrameBg: isDark ? "rgba(12,12,12,0.96)" : "rgba(255,255,255,0.92)",
    heroHintBg: isDark ? "rgba(17,17,17,0.76)" : "rgba(255,255,255,0.8)",
    heroHintBorder: isDark ? "rgba(255,255,255,0.12)" : "rgba(23,23,23,0.08)",
    sidebarBackground: isDark
      ? "radial-gradient(circle at top left, rgba(255,255,255,0.04), transparent 28%), linear-gradient(180deg, #1a1a1a 0%, #131313 100%)"
      : "radial-gradient(circle at top left, rgba(255,255,255,0.7), transparent 30%), linear-gradient(180deg, #fbfbfa 0%, #f1f1ee 100%)",
    sidebarShadow: isDark
      ? "24px 0 80px rgba(0,0,0,0.24)"
      : "24px 0 64px rgba(0,0,0,0.05)",
    homeContentBackground: isDark
      ? "linear-gradient(180deg, rgba(17,19,21,0) 0%, rgba(17,19,21,0.82) 64px, rgba(17,19,21,0.96) 100%)"
      : "linear-gradient(180deg, rgba(243,244,246,0) 0%, rgba(243,244,246,0.92) 64px, rgba(243,244,246,0.96) 100%)",
  };
}
