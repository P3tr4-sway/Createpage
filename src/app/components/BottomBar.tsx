import { motion } from "motion/react";
import {
  Speaker,
  Users,
  Guitar,
  GraduationCap,
  LayoutGrid,
  Sparkles,
} from "lucide-react";

const tabs = [
  { id: "sounds", label: "Sounds", icon: Speaker },
  { id: "community", label: "Community", icon: Users },
  { id: "create", label: "Create", icon: Guitar, active: true },
  { id: "learn", label: "Learn & Practice", icon: GraduationCap },
  { id: "more", label: "More", icon: LayoutGrid },
];

interface BottomBarProps {
  visible: boolean;
}

export function BottomBar({ visible }: BottomBarProps) {
  return (
    <div
      className="absolute left-1/2 flex items-center justify-center transition-all"
      style={{
        bottom: visible ? 28 : -100,
        transform: "translateX(-50%)",
        opacity: visible ? 1 : 0,
        transitionDuration: "350ms",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: 50,
        fontFamily: "'Lava', sans-serif",
      }}
    >
      <div className="flex items-stretch gap-3" style={{ width: "calc(100vw * 2 / 3)" }}>
        {/* Main tab group pill */}
        <nav
          className="flex items-center gap-1 border border-border flex-1"
          style={{
            backgroundColor: "rgba(32, 32, 34, 0.55)",
            borderRadius: "9999px",
            padding: "10px",
            boxShadow: "var(--elevation-sm), 0 0 0 1px rgba(255,255,255,0.06)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className="flex items-center justify-center gap-3 cursor-pointer transition-all flex-1"
              style={{
                borderRadius: "9999px",
                padding: "14px 0",
                backgroundColor: tab.active ? "var(--muted)" : "transparent",
                color: tab.active
                  ? "var(--foreground)"
                  : "var(--secondary)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-bold)",
                fontFamily: "'Lava', sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              <tab.icon size={24} strokeWidth={1.8} />
              {tab.active && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>

        {/* AI Magic Button - separate pill */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
          className="relative flex items-center justify-center border border-border cursor-pointer overflow-hidden"
          style={{
            backgroundColor: "rgba(32, 32, 34, 0.55)",
            borderRadius: "50%",
            width: 72,
            height: 72,
            minWidth: 72,
            minHeight: 72,
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
            style={{ borderRadius: "50%" }}
            animate={{
              boxShadow: [
                "0 0 0 0px rgba(0,0,0,0.08)",
                "0 0 0 10px rgba(0,0,0,0)",
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
            style={{ borderRadius: "50%" }}
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

          {/* Icon */}
          <motion.span
            animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.12, 1] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 1.5,
            }}
            className="relative z-10 flex items-center justify-center"
            style={{ color: "var(--foreground)" }}
          >
            <Sparkles size={22} strokeWidth={1.6} />
          </motion.span>
        </motion.button>
      </div>
    </div>
  );
}