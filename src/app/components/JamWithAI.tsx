import { useState } from "react";
import { Send } from "lucide-react";
import { motion } from "motion/react";

const promptSuggestions = [
  "Lo-fi piano chords, rainy mood, 75 bpm",
  "Funky slap bass groove in E, 110 bpm",
  "Ambient pads, wide stereo, C major",
  "Trap hi-hats with swing, 140 bpm",
];

export function JamWithAI() {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <div
      className="rounded-card border border-border p-6 overflow-hidden relative"
      style={{ backgroundColor: "var(--card)" }}
    >
      {/* Header row with title + wave */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <h3
            style={{
              color: "var(--foreground)",
              fontSize: "var(--text-xl)",
              fontWeight: "var(--font-weight-bold)",
              fontFamily: "var(--app-font-family)",
            }}
          >
            Jam with AI
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
        Type a vibe. Generate and play.
      </p>

      {/* Input area */}
      <div className="flex gap-3 mb-4">
        <div
          className="flex-1 flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors"
          style={{
            backgroundColor: "var(--input-background)",
            borderColor: isFocused
              ? "var(--secondary)"
              : "var(--border)",
          }}
        >
          
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="What do you want to hear?"
            className="flex-1 bg-transparent outline-none"
            style={{
              color: "var(--foreground)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-normal)",
              fontFamily: "var(--app-font-family)",
            }}
          />
        </div>
        <motion.button
          className="flex items-center gap-2 cursor-pointer"
          style={{
            backgroundColor: "var(--foreground)",
            color: "var(--background)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-bold)",
            fontFamily: "var(--app-font-family)",
            padding: "6px 16px",
            borderRadius: "var(--radius-tooltip)",
            border: "none",
            whiteSpace: "nowrap",
            letterSpacing: "0.04em",
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Generate
          <Send size={14} strokeWidth={1.5} />
        </motion.button>
      </div>

      {/* Suggestion chips */}
      <div className="flex flex-wrap gap-2">
        <span
          style={{
            color: "var(--secondary)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-normal)",
            fontFamily: "var(--app-font-family)",
            opacity: 0.5,
          }}
          className="flex items-center mr-1"
        >
          Try:
        </span>
        {promptSuggestions.map((suggestion) => (
          <motion.button
            key={suggestion}
            onClick={() => handleSuggestionClick(suggestion)}
            className="px-3 py-1 rounded-full border cursor-pointer"
            style={{
              borderColor: "var(--border)",
              color: "var(--secondary)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-normal)",
              fontFamily: "var(--app-font-family)",
              backgroundColor: "transparent",
              opacity: 0.7,
            }}
            whileHover={{
              backgroundColor: "var(--soft-surface-strong)",
              color: "var(--foreground)",
              opacity: 1,
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {suggestion}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
