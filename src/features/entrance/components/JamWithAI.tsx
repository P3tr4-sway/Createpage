import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEntranceLocale } from "@/features/entrance/EntranceLocaleContext";
import { useHasCoarsePointer } from "@/shared/hooks/use-mobile";

const jamCopyByLocale = {
  en: {
    title: "Jamy",
    subtitle: "Open a stripped-back DAW and jam against a backing track.",
    action: "Open Jamy",
  },
  "zh-CN": {
    title: "Jamy",
    subtitle: "打开一个更轻量的 DAW，直接对着 backing track 开始 jam。",
    action: "打开 Jamy",
  },
} as const;

interface JamWithAIProps {
  onLaunch?: () => void;
}

export function JamWithAI({ onLaunch }: JamWithAIProps) {
  const locale = useEntranceLocale();
  const copy = jamCopyByLocale[locale];
  const shouldReduceMotion = useReducedMotion();
  const hasCoarsePointer = useHasCoarsePointer();

  return (
    <motion.button
      type="button"
      onClick={onLaunch}
      whileHover={hasCoarsePointer ? undefined : { scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="tablet-touch-target tablet-pressable relative flex h-full w-full flex-col overflow-hidden rounded-card border border-border p-6 text-left"
      style={{ backgroundColor: "var(--card)" }}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3
            style={{
              color: "var(--foreground)",
              fontSize: "var(--text-xl)",
              fontWeight: "var(--font-weight-bold)",
              fontFamily: "var(--app-font-family)",
            }}
          >
            {copy.title}
          </h3>
        </div>
      </div>

      <p
        className="mb-5"
        style={{
          color: "var(--secondary)",
          fontSize: "var(--text-sm)",
          fontWeight: "var(--font-weight-normal)",
          fontFamily: "var(--app-font-family)",
        }}
      >
        {copy.subtitle}
      </p>

      <div className="flex flex-1 items-center justify-center py-5">
        <div
          className="relative flex w-full max-w-[360px] items-center justify-center overflow-hidden"
          style={{
            minHeight: 250,
          }}
        >
          <div
            className="absolute inset-[6%_8%_8%_8%]"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(146, 191, 255, 0.18) 0%, rgba(146, 191, 255, 0.1) 36%, rgba(146, 191, 255, 0.04) 60%, rgba(146, 191, 255, 0) 82%)",
              filter: "blur(18px)",
              borderRadius: "41% 59% 48% 52% / 44% 38% 62% 56%",
            }}
          />

          <motion.div
            className="absolute left-[10%] top-[23%] h-[132px] w-[184px]"
            style={{
              background:
                "radial-gradient(circle at 34% 38%, rgba(168, 210, 255, 0.38) 0%, rgba(168, 210, 255, 0.18) 44%, rgba(168, 210, 255, 0) 82%)",
              filter: "blur(22px)",
              borderRadius: "58% 42% 46% 54% / 40% 57% 43% 60%",
              transform: "rotate(-14deg)",
            }}
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    x: [0, 10, -4, 0],
                    y: [0, -8, 5, 0],
                    scale: [1, 1.07, 0.98, 1],
                    opacity: [0.82, 1, 0.74, 0.82],
                    rotate: [-14, -10, -16, -14],
                  }
            }
            transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute left-[30%] top-[12%] h-[170px] w-[206px]"
            style={{
              background:
                "radial-gradient(circle at 50% 44%, rgba(132, 183, 255, 0.32) 0%, rgba(132, 183, 255, 0.15) 48%, rgba(132, 183, 255, 0) 84%)",
              filter: "blur(24px)",
              borderRadius: "45% 55% 53% 47% / 57% 39% 61% 43%",
              transform: "rotate(10deg)",
            }}
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    x: [0, -12, 6, 0],
                    y: [0, 7, -5, 0],
                    scale: [1, 1.08, 0.99, 1],
                    opacity: [0.72, 0.92, 0.8, 0.72],
                    rotate: [10, 14, 8, 10],
                  }
            }
            transition={{ duration: 14, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.8 }}
          />

          <motion.div
            className="absolute left-[20%] top-[40%] h-[136px] w-[230px]"
            style={{
              background:
                "radial-gradient(circle at 50% 48%, rgba(184, 218, 255, 0.22) 0%, rgba(184, 218, 255, 0.12) 46%, rgba(184, 218, 255, 0) 86%)",
              filter: "blur(28px)",
              borderRadius: "62% 38% 57% 43% / 45% 60% 40% 55%",
              transform: "rotate(4deg)",
            }}
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    x: [0, 8, -6, 0],
                    y: [0, 10, -4, 0],
                    scale: [1, 1.06, 1.01, 1],
                    opacity: [0.64, 0.82, 0.7, 0.64],
                    rotate: [4, 8, 2, 4],
                  }
            }
            transition={{ duration: 16, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1.4 }}
          />
        </div>
      </div>

      <div
        className="mt-auto inline-flex items-center gap-2 self-start rounded-[var(--radius-control)] border px-4 py-3"
        style={{
          minHeight: "var(--touch-target-comfortable)",
          borderColor: "var(--border)",
          backgroundColor: "var(--soft-surface)",
          color: "var(--foreground)",
          fontSize: "var(--text-sm)",
          fontWeight: "var(--font-weight-bold)",
          fontFamily: "var(--app-font-family)",
        }}
      >
        {copy.action}
        <ArrowUpRight size={14} strokeWidth={1.8} />
      </div>
    </motion.button>
  );
}
