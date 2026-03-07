import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { FeatureCard } from "./FeatureCard";
import { useHasCoarsePointer } from "@/shared/hooks/use-mobile";

interface FeatureCardData {
  title: string;
  description: string;
  subDescription?: string;
  icon: LucideIcon;
}

interface ModeOption {
  id: string;
  label: string;
  tagline: string;
  icon: LucideIcon;
  cards: FeatureCardData[];
}

interface ModeSelectorProps {
  modes: ModeOption[];
  onCardClick?: (modeId: string, card: FeatureCardData) => void;
}

export function ModeSelector({ modes, onCardClick }: ModeSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const hasCoarsePointer = useHasCoarsePointer();

  const handleSelect = (id: string) => {
    setSelectedMode((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col" style={{ gap: "var(--spacing-4, 16px)" }}>
      {/* Mode selection cards */}
      <div className="grid grid-cols-2" style={{ gap: "var(--spacing-4, 16px)" }}>
        {modes.map((mode) => {
          const isSelected = selectedMode === mode.id;
          const isOther = selectedMode !== null && !isSelected;

          return (
            <motion.button
              key={mode.id}
              type="button"
              onClick={() => handleSelect(mode.id)}
              animate={{
                opacity: isOther ? 0.35 : 1,
                scale: isOther ? 0.97 : 1,
              }}
              whileHover={hasCoarsePointer ? undefined : "hovered"}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="tablet-touch-target tablet-pressable relative flex flex-col items-start justify-end overflow-hidden rounded-card border text-left"
              style={{
                height: hasCoarsePointer ? 408 : 390,
                borderColor: isSelected ? "var(--on-image-primary)" : "var(--border)",
                boxShadow: isSelected
                  ? "inset 0 0 0 1px var(--on-image-primary), 0 0 32px rgba(0,0,0,0.18)"
                  : "none",
                fontFamily: "var(--app-font-family)",
              }}
            >
              {/* Background image — zooms on hover via variant propagation */}
              <motion.div
                variants={hasCoarsePointer ? undefined : { hovered: { scale: 1.06 } }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full"
                style={{
                  backgroundImage: `url(${
                    (
                      {
                        daw: "https://images.unsplash.com/photo-1700166269606-b5ea327d0540?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaXhpbmclMjBjb25zb2xlJTIwYXVkaW8lMjBmYWRlcnMlMjBzdHVkaW98ZW58MXx8fHwxNzcyNjE3MzM5fDA&ixlib=rb-4.1.0&q=80&w=1080",
                        loop: "https://images.unsplash.com/photo-1768885514740-d64d25ac9a64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwbG9vcCUyMHBlcmZvcm1hbmNlJTIwZWxlY3Ryb25pYyUyMG11c2ljJTIwZGFyayUyMHN0YWdlfGVufDF8fHx8MTc3MjYxNjQ5Nnww&ixlib=rb-4.1.0&q=80&w=1080",
                      } as Record<string, string>
                    )[mode.id]
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              {/* Dark gradient scrim */}
              <div
                className="absolute inset-0"
                style={{
                  background: "var(--image-overlay-card)",
                }}
              />

              {/* Bottom content */}
              <div
                className="relative z-10 w-full"
                style={{ padding: "var(--spacing-10, 40px)" }}
              >
                <h3
                  style={{
                    color: "var(--on-image-primary)",
                    fontSize: "clamp(34px, 2.2vw, 44px)",
                    fontWeight: "var(--font-weight-bold)",
                    fontFamily: "var(--app-font-family)",
                    marginBottom: "var(--spacing-3, 12px)",
                    lineHeight: 1.1,
                  }}
                >
                  {mode.label}
                </h3>
                <p
                  style={{
                    color: "var(--on-image-secondary)",
                    fontSize: "var(--text-base)",
                    fontWeight: "var(--font-weight-normal)",
                    fontFamily: "var(--app-font-family)",
                    lineHeight: 1.45,
                    maxWidth: "85%",
                  }}
                >
                  {mode.tagline}
                </p>

                {/* Chevron — absolutely pinned to bottom-left of card */}
                <motion.div
                  animate={{ rotate: isSelected ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="absolute"
                  style={{
                    bottom: "var(--spacing-10, 40px)",
                    right: "var(--spacing-10, 40px)",
                  }}
                >
                  <ChevronDown
                    size={20}
                    strokeWidth={1.5}
                    style={{ color: "var(--on-image-secondary)" }}
                  />
                </motion.div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Expanded feature cards */}
      <AnimatePresence mode="wait">
        {selectedMode && (
          <motion.div
            key={selectedMode}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ overflow: "hidden" }}
          >
            <div
              className={`grid ${
                (modes.find((m) => m.id === selectedMode)?.cards.length ?? 3) <= 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
              }`}
              style={{ gap: "var(--spacing-4, 16px)" }}
            >
              {modes
                .find((m) => m.id === selectedMode)
                ?.cards.map((card) => (
                  <FeatureCard
                    key={card.title}
                    title={card.title}
                    description={card.description}
                    subDescription={card.subDescription}
                    icon={card.icon}
                    onClick={() => {
                      if (selectedMode) {
                        onCardClick?.(selectedMode, card);
                      }
                    }}
                  />
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
