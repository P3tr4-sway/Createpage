import { AnimatePresence, motion } from "motion/react";
import { type CSSProperties, type RefObject } from "react";
import { AgenticProducingPage } from "@/features/entrance/pages/AgenticProducingPage";
import type { HeroPromptSuggestion } from "@/features/entrance/model/entrance.types";
import { workspaceSectionStyle } from "@/features/entrance/workspace/EntranceWorkspace.styles";
import { ScaledPreviewCanvas } from "@/shared/ui/ScaledPreviewCanvas";

interface EntranceWorkspaceHeroTone {
  heroFrameBg: string;
  railBorder: string;
  heroScrim: string;
  heroHintBg: string;
  heroHintBorder: string;
  heroBridge: string;
}

interface EntranceWorkspaceHeroProps {
  sectionRef: RefObject<HTMLDivElement | null>;
  height: CSSProperties["height"];
  contentInset: number;
  previewCanvasWidth: number;
  previewZoom: number;
  previewFocusX: number;
  tone: EntranceWorkspaceHeroTone;
  openFullWorkspaceAriaLabel: string;
  previewEyebrow: string;
  previewLabel: string;
  sloganTitle: string;
  promptPlaceholder: string;
  promptStartLabel: string;
  promptShowMoreLabel: string;
  promptEmptyLabel: string;
  promptValue: string;
  promptOpen: boolean;
  filteredSuggestions: HeroPromptSuggestion[];
  visibleSuggestions: HeroPromptSuggestion[];
  fieldRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  onOpenWorkspace: () => void;
  onPromptOpen: () => void;
  onPromptChange: (value: string) => void;
  onPromptSelect: (prompt: string) => void;
}

export function EntranceWorkspaceHero({
  sectionRef,
  height,
  contentInset,
  previewCanvasWidth,
  previewZoom,
  previewFocusX,
  tone,
  openFullWorkspaceAriaLabel,
  previewEyebrow,
  previewLabel,
  sloganTitle,
  promptPlaceholder,
  promptStartLabel,
  promptShowMoreLabel,
  promptEmptyLabel,
  promptValue,
  promptOpen,
  filteredSuggestions,
  visibleSuggestions,
  fieldRef,
  inputRef,
  onOpenWorkspace,
  onPromptOpen,
  onPromptChange,
  onPromptSelect,
}: EntranceWorkspaceHeroProps) {
  return (
    <section
      ref={sectionRef}
      style={{
        ...workspaceSectionStyle,
        position: "relative",
        zIndex: 3,
        minHeight: height,
        marginLeft: -contentInset,
        marginRight: -contentInset,
      }}
    >
      <div
        role="button"
        tabIndex={0}
        data-touch-target="true"
        onClick={onOpenWorkspace}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpenWorkspace();
          }
        }}
        aria-label={openFullWorkspaceAriaLabel}
        className="tablet-pressable relative block w-full overflow-visible text-left"
        style={{
          height,
          backgroundColor: tone.heroFrameBg,
          borderBottom: `1px solid ${tone.railBorder}`,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
          }}
        >
          <ScaledPreviewCanvas
            designWidth={previewCanvasWidth}
            zoom={previewZoom}
            focusX={previewFocusX}
          >
            <AgenticProducingPage previewMode />
          </ScaledPreviewCanvas>
        </div>
        <div className="absolute inset-0" style={{ background: tone.heroScrim }} />
        <div
          aria-hidden="true"
          className="absolute rounded-[22px]"
          style={{
            top: 28,
            right: 28,
            padding: "10px 14px 11px",
            background: tone.heroHintBg,
            border: `1px solid ${tone.heroHintBorder}`,
            backdropFilter: "blur(18px)",
            boxShadow: "0 18px 38px rgba(15,23,42,0.14)",
          }}
        >
          <span style={heroPreviewHintEyebrowStyle}>{previewEyebrow}</span>
          <span style={heroPreviewHintLabelStyle}>{previewLabel}</span>
        </div>
        <div aria-hidden="true" className="absolute" style={heroSloganOverlayStyle}>
          <h2 style={heroSloganTitleStyle}>{sloganTitle}</h2>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0"
          style={{
            height: 180,
            background: tone.heroBridge,
            pointerEvents: "none",
          }}
        />
        <div
          className="absolute flex items-center gap-5"
          style={{
            ...heroBottomDockStyle,
            left: "50%",
            bottom: 0,
            width: "62%",
            maxWidth: 860,
            transform: "translate(-50%, 50%)",
            zIndex: 4,
          }}
        >
          <div
            ref={fieldRef}
            className="relative flex w-full"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex w-full items-center rounded-full" style={heroChatFieldStyle}>
              <input
                ref={inputRef}
                type="text"
                value={promptValue}
                onClick={(event) => {
                  event.stopPropagation();
                  onPromptOpen();
                }}
                onFocus={onPromptOpen}
                onChange={(event) => onPromptChange(event.target.value)}
                placeholder={promptPlaceholder}
                className="tablet-touch-target min-w-0 flex-1 bg-transparent text-left outline-none placeholder:text-[var(--secondary)]"
                style={heroChatInputStyle}
              />
              <button
                type="button"
                onClick={(event) => event.stopPropagation()}
                className="tablet-touch-target tablet-pressable inline-flex items-center gap-2 rounded-full"
                style={heroChatSendStyle}
              >
                {promptStartLabel}
              </button>
            </div>
            <AnimatePresence>
              {promptOpen ? (
                <motion.div
                  className="absolute"
                  style={heroPromptPanelStyle}
                  onClick={(event) => event.stopPropagation()}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <div style={heroPromptListStyle}>
                    <div
                      className="relative flex max-h-[320px] flex-col overflow-y-auto"
                      style={heroPromptListContentStyle}
                    >
                      {visibleSuggestions.length ? (
                        <>
                          {filteredSuggestions.length > 3 ? (
                            <div aria-hidden="true" style={heroPromptOverflowHintStyle}>
                              {promptShowMoreLabel}
                            </div>
                          ) : null}
                          {visibleSuggestions.map((suggestion, index) => (
                            <motion.button
                              key={suggestion.prompt}
                              type="button"
                              className="w-full text-left"
                              style={heroPromptSuggestionStyle}
                              onClick={() => onPromptSelect(suggestion.prompt)}
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 8 }}
                              transition={{
                                duration: 0.18,
                                delay: index * 0.025,
                                ease: "easeOut",
                              }}
                            >
                              <div style={heroPromptSuggestionContentStyle}>
                                <span aria-hidden="true" style={heroPromptSuggestionBulletStyle}>
                                  •
                                </span>
                                <p style={heroPromptSuggestionPromptStyle}>{suggestion.prompt}</p>
                              </div>
                            </motion.button>
                          ))}
                        </>
                      ) : (
                        <div style={heroPromptEmptyStyle}>
                          <p style={heroPromptEmptyTextStyle}>{promptEmptyLabel}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

const heroBottomDockStyle: CSSProperties = {
  padding: "0 0 0 0",
  minHeight: 88,
};

const heroPreviewHintEyebrowStyle: CSSProperties = {
  display: "block",
  color: "var(--secondary)",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  lineHeight: 1.2,
};

const heroPreviewHintLabelStyle: CSSProperties = {
  display: "block",
  marginTop: 4,
  color: "var(--foreground)",
  fontSize: 14,
  fontWeight: 700,
  lineHeight: 1.2,
};

const heroSloganOverlayStyle: CSSProperties = {
  top: "33.333vh",
  left: "50%",
  width: "auto",
  maxWidth: "none",
  transform: "translateX(-50%)",
  zIndex: 4,
  pointerEvents: "none",
};

const heroSloganTitleStyle: CSSProperties = {
  margin: 0,
  color: "#171717",
  fontSize: 38,
  fontWeight: 700,
  lineHeight: 0.95,
  letterSpacing: "-0.03em",
  textAlign: "center",
  whiteSpace: "nowrap",
};

const heroChatFieldStyle: CSSProperties = {
  minHeight: 80,
  padding: "0 12px 0 20px",
  border: "1px solid var(--border)",
  backgroundColor: "var(--card)",
  boxShadow: "0 10px 28px rgba(15,23,42,0.08)",
};

const heroChatInputStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  border: "none",
  padding: 0,
  background: "transparent",
  color: "var(--foreground)",
  fontSize: 18,
  fontWeight: 500,
};

const heroChatSendStyle: CSSProperties = {
  height: 56,
  padding: "0 24px",
  border: "1px solid var(--border)",
  backgroundColor: "var(--foreground)",
  color: "var(--background)",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
};

const heroPromptPanelStyle: CSSProperties = {
  left: 0,
  right: 0,
  bottom: "calc(100% + 14px)",
  zIndex: 8,
  padding: "0 2px 12px",
};

const heroPromptListStyle: CSSProperties = {
  position: "relative",
};

const heroPromptListContentStyle: CSSProperties = {
  gap: 6,
};

const heroPromptOverflowHintStyle: CSSProperties = {
  padding: "0 0 4px 17px",
  color: "var(--secondary)",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.04em",
  lineHeight: 1.2,
  textTransform: "uppercase",
  opacity: 0.74,
};

const heroPromptSuggestionStyle: CSSProperties = {
  padding: 0,
  border: "none",
  background: "transparent",
  cursor: "pointer",
};

const heroPromptSuggestionContentStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  padding: "6px 0",
};

const heroPromptSuggestionBulletStyle: CSSProperties = {
  display: "inline-flex",
  minWidth: 10,
  color: "var(--secondary)",
  fontSize: 17,
  fontWeight: 600,
  lineHeight: 1.2,
  transform: "translateY(1px)",
};

const heroPromptSuggestionPromptStyle: CSSProperties = {
  margin: 0,
  color: "var(--secondary)",
  fontSize: 15,
  fontWeight: 500,
  lineHeight: 1.45,
  textShadow: "0 1px 10px rgba(15,23,42,0.12)",
};

const heroPromptEmptyStyle: CSSProperties = {
  padding: "6px 0",
};

const heroPromptEmptyTextStyle: CSSProperties = {
  margin: 0,
  padding: "6px 0",
  color: "var(--secondary)",
  fontSize: 14,
  fontWeight: 500,
  lineHeight: 1.5,
};
