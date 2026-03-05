import { motion } from "motion/react";
import {
  Guitar,
  GraduationCap,
  LayoutGrid,
  Speaker,
  Users,
} from "lucide-react";
import { TutorialNote } from "./TutorialNote";

type TabDefinition = {
  id: "sounds" | "community" | "create" | "learn" | "more";
  label: string;
  icon: typeof Guitar;
  sectionId: "create" | "loop" | "improvs";
};

const tabs: TabDefinition[] = [
  { id: "sounds", label: "Sounds", icon: Speaker, sectionId: "create" },
  { id: "community", label: "Community", icon: Users, sectionId: "create" },
  { id: "create", label: "Create", icon: Guitar, sectionId: "create" },
  { id: "learn", label: "Practice", icon: GraduationCap, sectionId: "loop" },
  { id: "more", label: "More", icon: LayoutGrid, sectionId: "improvs" },
];

interface BottomBarProps {
  visible: boolean;
  activeSection?: "create" | "loop" | "improvs";
  onNavigate?: (id: "create" | "loop" | "improvs") => void;
  onOpenAiChat?: () => void;
}

export function BottomBar({
  visible,
  activeSection = "create",
  onNavigate,
  onOpenAiChat,
}: BottomBarProps) {
  void activeSection;

  const inverseScale = "var(--workbench-inverse-scale, 1)";
  const barWidth = "min(1024px, calc(100vw - 128px))";
  const navPillHeight = 70;
  const aiButtonWidth = 172;
  const activeTabId: TabDefinition["id"] = "create";

  const handleTabSelect = (tab: TabDefinition) => {
    if (!onNavigate) {
      return;
    }

    onNavigate(tab.sectionId);
  };

  return (
    <div
      className="absolute left-1/2 flex items-center justify-center transition-all"
      style={{
        bottom: visible
          ? `calc(28px * ${inverseScale})`
          : `calc(-100px * ${inverseScale})`,
        transform: "translateX(-50%)",
        opacity: visible ? 1 : 0,
        transitionDuration: "350ms",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: 30,
        fontFamily: "var(--app-font-family)",
      }}
    >
      <TutorialNote
        title="底部导航的产品职责"
        points={[
          "底部导航负责全局快速切换，不抢主视觉，但要保证随时可达。",
          "滚动到底会自动隐藏减少遮挡，按钮尺寸固定确保不同屏幕下操作一致。",
        ]}
        style={{ top: -24, right: -24 }}
        panelWidth={320}
        panelSide="left"
      />

      <div
        style={{
          transform: `scale(${inverseScale})`,
          transformOrigin: "center bottom",
          width: barWidth,
        }}
      >
        <div
          className="flex items-center gap-2.5"
          style={{ width: "100%" }}
        >
          {/* Main tab group pill */}
          <nav
            className="flex items-center gap-1.5 border border-border flex-1"
            style={{
              backgroundColor: "var(--surface-glass)",
              borderRadius: "9999px",
              height: navPillHeight,
              padding: "8px",
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTabId === tab.id;

              return (
                <button
                  key={tab.id}
                  className="flex items-center justify-center gap-2 cursor-pointer transition-all flex-1"
                  type="button"
                  onClick={() => handleTabSelect(tab)}
                  style={{
                    borderRadius: "9999px",
                    minHeight: 54,
                    padding: isActive ? "0 18px" : "0 10px",
                    backgroundColor: isActive ? "var(--chip-active-bg)" : "transparent",
                    color: isActive ? "var(--chip-active-text)" : "var(--secondary)",
                    fontSize: isActive ? "16px" : "14px",
                    fontWeight: isActive ? 700 : 600,
                    fontFamily: "var(--app-font-family)",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                  }}
                >
                  {isActive ? (
                    <span style={{ letterSpacing: "0.01em" }}>{tab.label}</span>
                  ) : (
                    <tab.icon size={20} strokeWidth={1.9} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* AI Agent Button - same height as nav pill */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className="relative flex items-center justify-center border border-border cursor-pointer overflow-hidden"
            type="button"
            onClick={onOpenAiChat}
            style={{
              backgroundColor: "var(--float-surface-muted)",
              borderRadius: "9999px",
              width: aiButtonWidth,
              height: navPillHeight,
              minWidth: aiButtonWidth,
              minHeight: navPillHeight,
              boxShadow: "var(--elevation-sm)",
              borderColor: "var(--border)",
              borderWidth: 1,
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            <span
              className="relative z-10"
              style={{
                color: "var(--foreground)",
                fontSize: 16,
                fontWeight: "var(--font-weight-bold)",
                letterSpacing: "0.01em",
                fontFamily: "var(--app-font-family)",
              }}
            >
              AI Agent
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
