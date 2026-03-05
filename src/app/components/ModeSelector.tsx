import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

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
}

export function ModeSelector({ modes }: ModeSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

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
          const Icon = mode.icon;

          return (
            <motion.button
              key={mode.id}
              onClick={() => handleSelect(mode.id)}
              animate={{
                opacity: isOther ? 0.35 : 1,
                scale: isOther ? 0.97 : 1,
              }}
              whileHover="hovered"
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative flex flex-col justify-end items-start text-left rounded-card border cursor-pointer overflow-hidden"
              style={{
                height: 300,
                borderColor: isSelected ? "var(--foreground)" : "var(--border)",
                boxShadow: isSelected
                  ? "inset 0 0 0 1px var(--foreground), 0 0 32px rgba(255,255,255,0.06)"
                  : "none",
                fontFamily: "'Lava', sans-serif",
              }}
            >
              {/* Background image — zooms on hover via variant propagation */}
              <motion.div
                variants={{ hovered: { scale: 1.06 } }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full"
                style={{
                  backgroundImage: `url(${
                    (
                      {
                        daw: "https://images.unsplash.com/photo-1601389926382-bcf545a238ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNvcmRpbmclMjBzdHVkaW8lMjBkYXJrJTIwcHJvZmVzc2lvbmFsJTIwbXVzaWMlMjBwcm9kdWN0aW9ufGVufDF8fHx8MTc3MjYxNjQ5Nnww&ixlib=rb-4.1.0&q=80&w=1080",
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
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.88) 100%)",
                }}
              />

              {/* Pill tag — top left */}
              <div className="absolute top-5 left-6">
                <span
                  style={{
                    backgroundColor: "rgba(255,255,255,0.12)",
                    color: "var(--foreground)",
                    fontSize: "var(--text-xs)",
                    fontWeight: "var(--font-weight-medium)",
                    fontFamily: "'Lava', sans-serif",
                    padding: "4px 12px",
                    borderRadius: "var(--radius-full, 9999px)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    backdropFilter: "blur(6px)",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {mode.id === "daw" ? "Studio Mode" : "Live Mode"}
                </span>
              </div>

              {/* Bottom content */}
              <div
                className="relative z-10 w-full"
                style={{ padding: "var(--spacing-8, 32px)" }}
              >
                <h3
                  style={{
                    color: "var(--foreground)",
                    fontSize: "var(--text-2xl)",
                    fontWeight: "var(--font-weight-bold)",
                    fontFamily: "'Lava', sans-serif",
                    marginBottom: "var(--spacing-2, 8px)",
                  }}
                >
                  {mode.label}
                </h3>
                <p
                  style={{
                    color: "var(--secondary)",
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-weight-normal)",
                    fontFamily: "'Lava', sans-serif",
                    lineHeight: 1.5,
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
                    bottom: "var(--spacing-8, 32px)",
                    right: "var(--spacing-8, 32px)",
                  }}
                >
                  <ChevronDown
                    size={20}
                    strokeWidth={1.5}
                    style={{ color: "var(--secondary)" }}
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
                  />
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}