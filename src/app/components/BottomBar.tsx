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
  { id: "learn", label: "Practice", icon: GraduationCap, sectionId: "loop" },
  { id: "create", label: "Create", icon: Guitar, sectionId: "create" },
  { id: "more", label: "More", icon: LayoutGrid, sectionId: "improvs" },
];

interface BottomBarProps {
  visible: boolean;
  activeSection?: "create" | "loop" | "improvs";
  onNavigate?: (id: "create" | "loop" | "improvs") => void;
}

export function BottomBar({ visible, activeSection = "create", onNavigate }: BottomBarProps) {
  void activeSection;

  const inverseScale = "var(--workbench-inverse-scale, 1)";
  const barWidth = "min(1024px, calc(100vw - 128px))";
  const navPillHeight = 70;
  const aiButtonWidth = 172;
  const activeTabId: TabDefinition["id"] = "learn";

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
        fontFamily: "'Lava', sans-serif",
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
              boxShadow: "var(--elevation-sm), 0 0 0 1px var(--border)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
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
                    fontSize: isActive ? "18px" : "15px",
                    fontWeight: "var(--font-weight-bold)",
                    fontFamily: "'Lava', sans-serif",
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
            style={{
              backgroundColor: "var(--surface-glass)",
              borderRadius: "9999px",
              width: aiButtonWidth,
              height: navPillHeight,
              minWidth: aiButtonWidth,
              minHeight: navPillHeight,
              boxShadow: "var(--elevation-sm)",
              borderColor: "var(--border)",
              borderWidth: 1,
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }}
          >
            {/* Pulse ring */}
            <motion.span
              className="absolute inset-0"
              style={{ borderRadius: "9999px" }}
              animate={{
                boxShadow: [
                  "0 0 0 0px rgba(43,154,252,0.24)",
                  "0 0 0 8px rgba(43,154,252,0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />

            {/* Shimmer sweep */}
            <motion.span
              className="absolute inset-0 pointer-events-none overflow-hidden"
              style={{ borderRadius: "9999px" }}
            >
              <motion.span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 30%, var(--muted) 50%, transparent 70%)",
                }}
                animate={{ x: ["100%", "-100%"] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
              />
            </motion.span>

            <span
              className="relative z-10"
              style={{
                color: "var(--foreground)",
                fontSize: 18,
                fontWeight: "var(--font-weight-bold)",
                letterSpacing: "0.01em",
                fontFamily: "'Lava', sans-serif",
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
