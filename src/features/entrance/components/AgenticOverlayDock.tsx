import {
  AudioWaveform,
  ChevronDown,
  Sparkles,
  X,
} from "lucide-react";
import { type CSSProperties, type RefObject } from "react";
import { useEntranceLocale } from "@/features/entrance/EntranceLocaleContext";
import { agenticCopyByLocale } from "@/features/entrance/i18n/agentic.copy";
import { getAgentModeOptionsForLocale } from "@/features/entrance/model/agentic.mock";
import type {
  AgenticExperience,
  AgentMode,
  AudioQueueItem,
  GenerationHistoryItem,
  MusicianTarget,
  MusicianTargetId,
  OverlayMenu,
  ProducerMessage,
  QueueStatus,
} from "@/features/entrance/model/agentic.types";

interface AgenticOverlayDockProps {
  bottomTransportHeight: number;
  experience?: AgenticExperience;
  producerWorkspaceVisible: boolean;
  producerMessages: ProducerMessage[];
  audioQueue: AudioQueueItem[];
  generationHistory: GenerationHistoryItem[];
  onCloseProducerWorkspace: () => void;
  overlayDockRef: RefObject<HTMLDivElement | null>;
  agentMode: AgentMode;
  openOverlayMenu: OverlayMenu;
  targets: MusicianTarget[];
  selectedTarget: MusicianTarget;
  styleDraft: string;
  lyricsDraft: string;
  producerDraft: string;
  producerWorkspaceOpen: boolean;
  producerSuggestions?: readonly string[];
  onTargetToggle: () => void;
  onModeToggle: () => void;
  onSelectTarget: (targetId: MusicianTargetId) => void;
  onStyleChange: (value: string) => void;
  onLyricsChange: (value: string) => void;
  onGenerate: () => void;
  onSelectMode: (mode: AgentMode) => void;
  onDraftChange: (value: string) => void;
  onDraftSubmit: (text?: string) => void;
  onOpenWorkspace: () => void;
}

export function AgenticOverlayDock({
  bottomTransportHeight,
  experience = "default",
  producerWorkspaceVisible,
  producerMessages,
  audioQueue,
  generationHistory,
  onCloseProducerWorkspace,
  overlayDockRef,
  agentMode,
  openOverlayMenu,
  targets,
  selectedTarget,
  styleDraft,
  lyricsDraft,
  producerDraft,
  producerWorkspaceOpen,
  producerSuggestions,
  onTargetToggle,
  onModeToggle,
  onSelectTarget,
  onStyleChange,
  onLyricsChange,
  onGenerate,
  onSelectMode,
  onDraftChange,
  onDraftSubmit,
  onOpenWorkspace,
}: AgenticOverlayDockProps) {
  return (
    <div style={overlayDockShellStyle(bottomTransportHeight, experience)}>
      {producerWorkspaceVisible ? (
        <div style={producerWorkspacePopoverStyle}>
          <div style={{ height: "100%", pointerEvents: "auto" }}>
            <ProducerWorkspacePanel
              messages={producerMessages}
              audioQueue={audioQueue}
              generationHistory={generationHistory}
              onClose={onCloseProducerWorkspace}
            />
          </div>
        </div>
      ) : null}

      <div
        ref={overlayDockRef}
        className="flex items-end"
        style={{ gap: 14, pointerEvents: "auto", position: "relative" }}
      >
        {agentMode === "musician" ? (
          <MusicianComposerBar
            openMenu={openOverlayMenu}
            targets={targets}
            selectedTarget={selectedTarget}
            styleDraft={styleDraft}
            lyricsDraft={lyricsDraft}
            onTargetToggle={onTargetToggle}
            onModeToggle={onModeToggle}
            onSelectTarget={onSelectTarget}
            onStyleChange={onStyleChange}
            onLyricsChange={onLyricsChange}
            onGenerate={onGenerate}
            onSelectMode={onSelectMode}
            currentMode={agentMode}
          />
        ) : (
          <ProducerComposerBar
            draft={producerDraft}
            experience={experience}
            workspaceOpen={producerWorkspaceOpen}
            openMenu={openOverlayMenu}
            suggestions={producerSuggestions}
            onDraftChange={onDraftChange}
            onDraftSubmit={onDraftSubmit}
            onOpenWorkspace={onOpenWorkspace}
            onModeToggle={onModeToggle}
            onSelectMode={onSelectMode}
            currentMode={agentMode}
          />
        )}
      </div>
    </div>
  );
}

interface MusicianComposerBarProps {
  openMenu: OverlayMenu;
  targets: MusicianTarget[];
  selectedTarget: MusicianTarget;
  styleDraft: string;
  lyricsDraft: string;
  currentMode: AgentMode;
  onTargetToggle: () => void;
  onModeToggle: () => void;
  onSelectTarget: (targetId: MusicianTargetId) => void;
  onStyleChange: (value: string) => void;
  onLyricsChange: (value: string) => void;
  onGenerate: () => void;
  onSelectMode: (mode: AgentMode) => void;
}

function MusicianComposerBar({
  openMenu,
  targets,
  selectedTarget,
  styleDraft,
  lyricsDraft,
  currentMode,
  onTargetToggle,
  onModeToggle,
  onSelectTarget,
  onStyleChange,
  onLyricsChange,
  onGenerate,
  onSelectMode,
}: MusicianComposerBarProps) {
  const locale = useEntranceLocale();
  const copy = agenticCopyByLocale[locale];

  return (
    <div className="flex-1" style={overlayBarStyle("default")}>
      <div className="flex items-center" style={{ gap: 14 }}>
        <div
          className="flex items-center"
          style={{ flex: "1 1 auto", gap: 14, minWidth: 0 }}
        >
          <div
            style={{
              ...overlayFieldWrapStyle,
              flex: selectedTarget.showsLyrics ? "0 0 220px" : "1 1 0",
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={onTargetToggle}
              className="flex items-center justify-between"
              style={overlayFieldButtonStyle}
            >
              <span>
                <span style={overlayFieldLabelStyle}>{copy.aiMusician}</span>
                <span style={overlayFieldValueStyle}>{selectedTarget.label}</span>
              </span>
              <ChevronDown size={18} strokeWidth={2} />
            </button>

            {openMenu === "target" ? (
              <div style={overlayMenuStyle}>
                <div style={overlayMenuTitleStyle}>{copy.chooseAiMusician}</div>
                {targets.map((target) => {
                  const isActive = target.id === selectedTarget.id;
                  return (
                    <button
                      key={target.id}
                      type="button"
                      onClick={() => onSelectTarget(target.id)}
                      className="flex w-full items-center justify-between text-left"
                      style={{
                        ...overlayMenuItemStyle,
                        backgroundColor: isActive
                          ? "var(--soft-surface-strong)"
                          : "transparent",
                        color: "var(--foreground)",
                      }}
                    >
                      <span>{target.label}</span>
                      {isActive ? <span style={overlayMenuDotStyle} /> : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div
            style={{
              ...overlayFieldWrapStyle,
              flex: selectedTarget.showsLyrics ? "0 0 220px" : "1 1 0",
            }}
          >
            <label
              style={{
                ...overlayLyricsFieldStyle,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <span style={overlayFieldLabelStyle}>{copy.style}</span>
              <input
                type="text"
                value={styleDraft}
                onChange={(event) => onStyleChange(event.target.value)}
                placeholder={copy.enterStyle}
                className="min-w-0 bg-transparent outline-none"
                style={overlayTextFieldInputStyle}
              />
            </label>
          </div>

          {selectedTarget.showsLyrics ? (
            <label
              style={{
                ...overlayFieldWrapStyle,
                ...overlayLyricsFieldStyle,
                flex: "1 1 320px",
              }}
            >
              <span style={overlayFieldLabelStyle}>{copy.lyrics}</span>
              <textarea
                value={lyricsDraft}
                onChange={(event) => onLyricsChange(event.target.value)}
                rows={1}
                placeholder={copy.lyricsPlaceholder}
                style={overlayLyricsInputStyle}
              />
            </label>
          ) : null}
        </div>

        <div className="flex items-center" style={{ gap: 10, flex: "0 0 auto" }}>
          <button type="button" onClick={onGenerate} style={generateButtonStyle}>
            {copy.generate}
          </button>
          <ModeToggleButton
            open={openMenu === "mode"}
            currentMode={currentMode}
            onToggle={onModeToggle}
            onSelectMode={onSelectMode}
          />
        </div>
      </div>
    </div>
  );
}

interface ProducerComposerBarProps {
  draft: string;
  experience: AgenticExperience;
  workspaceOpen: boolean;
  openMenu: OverlayMenu;
  suggestions?: readonly string[];
  currentMode: AgentMode;
  onDraftChange: (value: string) => void;
  onDraftSubmit: (text?: string) => void;
  onOpenWorkspace: () => void;
  onModeToggle: () => void;
  onSelectMode: (mode: AgentMode) => void;
}

function ProducerComposerBar({
  draft,
  experience,
  workspaceOpen,
  openMenu,
  suggestions = [],
  currentMode,
  onDraftChange,
  onDraftSubmit,
  onOpenWorkspace,
  onModeToggle,
  onSelectMode,
}: ProducerComposerBarProps) {
  const locale = useEntranceLocale();
  const copy = agenticCopyByLocale[locale];
  const isJamExperience = experience === "jam";

  return (
    <div className="flex-1" style={overlayBarStyle(experience)}>
      {isJamExperience && suggestions.length > 0 ? (
        <div className="mb-3 flex flex-wrap" style={{ gap: 8 }}>
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onDraftSubmit(suggestion)}
              style={suggestionChipStyle}
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}

      <div
        className="flex items-center"
        style={{ gap: 12, flexWrap: isJamExperience ? "wrap" : "nowrap" }}
      >
        {isJamExperience ? (
          <div style={producerBadgeStyle}>
            <Sparkles size={15} strokeWidth={2} />
            {copy.jamAiProducerBadge}
          </div>
        ) : null}

        <div className="flex-1" style={producerInputShellStyle(experience)}>
          <input
            type="text"
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onDraftSubmit();
              }
            }}
            placeholder={copy.aiProducerPlaceholder}
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[var(--secondary)]"
            style={producerInputStyle(experience)}
          />
        </div>

        {!isJamExperience ? (
          <button
            type="button"
            onClick={onOpenWorkspace}
            style={producerWorkspaceButtonStyle}
            aria-label={copy.openProducerWorkspace}
          >
            <AudioWaveform size={18} strokeWidth={2} />
          </button>
        ) : null}

        <button type="button" onClick={() => onDraftSubmit()} style={generateButtonStyle}>
          {workspaceOpen ? copy.send : copy.start}
        </button>

        {!isJamExperience ? (
          <ModeToggleButton
            open={openMenu === "mode"}
            currentMode={currentMode}
            onToggle={onModeToggle}
            onSelectMode={onSelectMode}
          />
        ) : null}
      </div>
    </div>
  );
}

interface ModeToggleButtonProps {
  open: boolean;
  currentMode: AgentMode;
  onToggle: () => void;
  onSelectMode: (mode: AgentMode) => void;
}

function ModeToggleButton({
  open,
  currentMode,
  onToggle,
  onSelectMode,
}: ModeToggleButtonProps) {
  const locale = useEntranceLocale();
  const copy = agenticCopyByLocale[locale];
  const agentModeOptions = getAgentModeOptionsForLocale(locale);
  const currentModeLabel =
    agentModeOptions.find((mode) => mode.id === currentMode)?.label ??
    copy.aiMusician;
  const nextMode = currentMode === "musician" ? "producer" : "musician";
  const nextModeLabel =
    agentModeOptions.find((mode) => mode.id === nextMode)?.label ??
    copy.aiProducer;

  return (
    <div style={{ position: "relative", flex: "0 0 auto" }}>
      <button
        type="button"
        onClick={onToggle}
        style={modeToggleButtonStyle}
        aria-label={copy.currentModeAria(currentModeLabel)}
      >
        {currentModeLabel}
      </button>

      {open ? (
        <div
          style={{
            ...overlayMenuStyle,
            left: 0,
            right: 0,
            width: "100%",
            minWidth: 0,
          }}
        >
          <button
            type="button"
            onClick={() => onSelectMode(nextMode)}
            className="flex w-full items-center justify-between text-left"
            style={{
              ...overlayMenuItemStyle,
              backgroundColor: "transparent",
              color: "var(--foreground)",
            }}
          >
            <span>{nextModeLabel}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

interface ProducerWorkspacePanelProps {
  messages: ProducerMessage[];
  audioQueue: AudioQueueItem[];
  generationHistory: GenerationHistoryItem[];
  onClose: () => void;
}

function ProducerWorkspacePanel({
  messages,
  audioQueue,
  generationHistory,
  onClose,
}: ProducerWorkspacePanelProps) {
  const locale = useEntranceLocale();
  const copy = agenticCopyByLocale[locale];

  return (
    <div style={producerPanelStyle}>
      <div
        className="flex items-center justify-between"
        style={producerPanelHeaderStyle}
      >
        <div>
          <div style={producerPanelEyebrowStyle}>{copy.aiProducer}</div>
          <div style={producerPanelTitleStyle}>{copy.producerTitle}</div>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={producerPanelCloseStyle}
          aria-label={copy.closeProducerWorkspace}
        >
          <X size={18} strokeWidth={2} />
        </button>
      </div>

      <div
        className="flex min-h-0 flex-1"
        style={{ gap: 16, padding: 16, flexWrap: "nowrap", overflow: "hidden" }}
      >
        <div style={producerChatCardStyle}>
          <div style={producerSectionHeaderStyle}>
            <div style={producerSectionEyebrowStyle}>{copy.conversation}</div>
            <div style={producerSectionMetaStyle}>{copy.conversationMeta}</div>
          </div>

          <div
            className="min-h-0 flex-1 overflow-y-auto"
            style={producerMessagesWrapStyle}
          >
            <div className="flex flex-col" style={{ gap: 10 }}>
              {messages.map((message) => {
                const isUser = message.role === "user";

                return (
                  <div
                    key={message.id}
                    className="flex"
                    style={{ justifyContent: isUser ? "flex-end" : "flex-start" }}
                  >
                    <div
                      style={{
                        ...(isUser
                          ? producerUserBubbleStyle
                          : producerAgentBubbleStyle),
                        maxWidth: "82%",
                      }}
                    >
                      <div>{message.text}</div>
                      <div style={producerMessageTimestampStyle}>
                        {message.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className="flex min-h-0 flex-col"
          style={{
            flex: "0 0 320px",
            width: "min(320px, 100%)",
            gap: 16,
            overflowY: "auto",
          }}
        >
          <QueueRailCard
            title={copy.renderQueue}
            meta={copy.renderQueueMeta}
            items={audioQueue}
          />
          <HistoryRailCard
            title={copy.recentPasses}
            meta={copy.recentPassesMeta}
            items={generationHistory}
          />
        </div>
      </div>
    </div>
  );
}

function QueueRailCard({
  title,
  meta,
  items,
}: {
  title: string;
  meta: string;
  items: AudioQueueItem[];
}) {
  const locale = useEntranceLocale();
  const copy = agenticCopyByLocale[locale];

  return (
    <div style={producerRailCardStyle}>
      <div style={producerSectionHeaderStyle}>
        <div style={producerSectionEyebrowStyle}>{title}</div>
        <div style={producerSectionMetaStyle}>{meta}</div>
      </div>

      <div className="flex flex-col overflow-y-auto" style={{ gap: 10 }}>
        {items.map((item) => (
          <div key={item.id} style={producerListItemStyle}>
            <div className="flex items-start justify-between" style={{ gap: 12 }}>
              <div style={{ minWidth: 0 }}>
                <div style={producerListItemTitleStyle}>{item.title}</div>
                <div style={producerListItemMetaStyle}>
                  {item.owner} • {item.detail}
                </div>
              </div>
              <span style={queueStatusBadgeStyle(item.status)}>
                {copy.statusLabels[item.status]}
              </span>
            </div>
            <div style={producerListItemSubtleStyle}>{item.progress}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoryRailCard({
  title,
  meta,
  items,
}: {
  title: string;
  meta: string;
  items: GenerationHistoryItem[];
}) {
  return (
    <div style={producerRailCardStyle}>
      <div style={producerSectionHeaderStyle}>
        <div style={producerSectionEyebrowStyle}>{title}</div>
        <div style={producerSectionMetaStyle}>{meta}</div>
      </div>

      <div className="flex flex-col overflow-y-auto" style={{ gap: 10 }}>
        {items.map((item) => (
          <div key={item.id} style={producerListItemStyle}>
            <div className="flex items-start justify-between" style={{ gap: 12 }}>
              <div style={{ minWidth: 0 }}>
                <div style={producerListItemTitleStyle}>{item.title}</div>
                <div style={producerListItemMetaStyle}>
                  {item.owner} • {item.meta}
                </div>
              </div>
              <span style={producerHistoryTimestampStyle}>{item.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const overlayDockShellStyle = (
  bottomTransportHeight: number,
  experience: AgenticExperience,
): CSSProperties => ({
  position: "absolute",
  left: "50%",
  bottom: bottomTransportHeight + (experience === "jam" ? 26 : 18),
  transform: "translateX(-50%)",
  width:
    experience === "jam"
      ? "min(980px, calc(100% - 40px))"
      : "min(1120px, calc(100% - 56px))",
  zIndex: 30,
  pointerEvents: "none",
});

const producerWorkspacePopoverStyle: CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: "calc(100% + 14px)",
  width: "100%",
  height: "min(40vh, 360px)",
  maxHeight: "calc(100vh - 196px)",
  zIndex: 1,
  pointerEvents: "none",
};

const overlayBarStyle = (experience: AgenticExperience): CSSProperties => ({
  minHeight: experience === "jam" ? 112 : 80,
  borderRadius: experience === "jam" ? 28 : "var(--radius-pill)",
  border: "1px solid var(--border)",
  backgroundColor: "var(--card)",
  boxShadow:
    experience === "jam"
      ? "0 18px 42px rgba(15,23,42,0.12)"
      : "0 10px 28px rgba(15,23,42,0.08)",
  padding: experience === "jam" ? "14px" : "12px",
});

const overlayFieldWrapStyle: CSSProperties = {
  minWidth: 0,
};

const overlayFieldButtonStyle: CSSProperties = {
  width: "100%",
  minHeight: 56,
  padding: "0 18px",
  borderRadius: "var(--radius-pill)",
  border: "none",
  backgroundColor: "var(--soft-surface)",
  color: "var(--foreground)",
  textAlign: "left",
  cursor: "pointer",
};

const overlayFieldLabelStyle: CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--muted-foreground)",
  marginBottom: 4,
};

const overlayFieldValueStyle: CSSProperties = {
  display: "block",
  fontSize: 16,
  fontWeight: 600,
  color: "var(--foreground)",
  lineHeight: 1.2,
};

const overlayLyricsFieldStyle: CSSProperties = {
  minHeight: 56,
  padding: "10px 18px",
  borderRadius: "var(--radius-pill)",
  border: "none",
  backgroundColor: "var(--soft-surface)",
  display: "block",
};

const overlayLyricsInputStyle: CSSProperties = {
  width: "100%",
  border: "none",
  background: "transparent",
  color: "var(--foreground)",
  fontSize: 16,
  fontWeight: 500,
  lineHeight: 1.25,
  resize: "none",
  outline: "none",
  fontFamily: "var(--app-font-family)",
  padding: 0,
  minHeight: 20,
};

const overlayTextFieldInputStyle: CSSProperties = {
  width: "100%",
  border: "none",
  background: "transparent",
  color: "var(--foreground)",
  fontSize: 16,
  fontWeight: 600,
  lineHeight: 1.25,
  outline: "none",
  fontFamily: "var(--app-font-family)",
  padding: 0,
  minHeight: 20,
};

const producerInputShellStyle = (experience: AgenticExperience): CSSProperties => ({
  minHeight: 56,
  display: "flex",
  alignItems: "center",
  padding: experience === "jam" ? "0 14px" : "0 12px 0 10px",
  borderRadius: experience === "jam" ? 22 : 0,
  backgroundColor: experience === "jam" ? "var(--soft-surface)" : "transparent",
});

const producerInputStyle = (experience: AgenticExperience): CSSProperties => ({
  flex: 1,
  minWidth: 0,
  border: "none",
  padding: 0,
  background: "transparent",
  color: "var(--foreground)",
  fontSize: experience === "jam" ? 17 : 18,
  fontWeight: 500,
});

const generateButtonStyle: CSSProperties = {
  height: 56,
  minWidth: 164,
  padding: "0 30px",
  border: "none",
  backgroundColor: "var(--foreground)",
  color: "var(--background)",
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: "0",
  borderRadius: "var(--radius-pill)",
  cursor: "pointer",
};

const producerWorkspaceButtonStyle: CSSProperties = {
  width: 56,
  height: 56,
  border: "1px solid var(--border)",
  backgroundColor: "var(--soft-surface)",
  color: "var(--foreground)",
  borderRadius: "var(--radius-control)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flex: "0 0 auto",
};

const modeToggleButtonStyle: CSSProperties = {
  height: 56,
  minWidth: 176,
  padding: "0 26px",
  border: "1px solid var(--border)",
  backgroundColor: "var(--soft-surface)",
  color: "var(--foreground)",
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: "0",
  borderRadius: "var(--radius-pill)",
  cursor: "pointer",
};

const suggestionChipStyle: CSSProperties = {
  minHeight: 40,
  padding: "0 16px",
  borderRadius: 999,
  border: "1px solid rgba(15,23,42,0.1)",
  backgroundColor: "var(--soft-surface)",
  color: "var(--foreground)",
  fontSize: 14,
  fontWeight: 600,
  lineHeight: 1.2,
  cursor: "pointer",
};

const producerBadgeStyle: CSSProperties = {
  height: 40,
  padding: "0 14px",
  borderRadius: 999,
  border: "1px solid rgba(15,23,42,0.08)",
  backgroundColor: "rgba(255,255,255,0.88)",
  color: "var(--foreground)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontSize: 13,
  fontWeight: 700,
  flex: "0 0 auto",
};

const overlayMenuStyle: CSSProperties = {
  position: "absolute",
  left: 0,
  bottom: "calc(100% + 12px)",
  width: "100%",
  minWidth: 220,
  borderRadius: "var(--radius-container)",
  border: "1px solid var(--border)",
  backgroundColor: "var(--float-surface)",
  boxShadow: "var(--float-shadow)",
  padding: 8,
  overflow: "hidden",
};

const overlayMenuTitleStyle: CSSProperties = {
  padding: "10px 12px 8px",
  color: "var(--muted-foreground)",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const overlayMenuItemStyle: CSSProperties = {
  minHeight: 48,
  padding: "0 14px",
  border: "none",
  borderRadius: "var(--radius-control)",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
};

const overlayMenuDotStyle: CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: 999,
  backgroundColor: "var(--sidebar-accent-teal)",
};

const producerPanelStyle: CSSProperties = {
  height: "100%",
  borderRadius: 24,
  border: "1px solid var(--border)",
  backgroundColor: "var(--float-surface)",
  boxShadow: "var(--float-shadow)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const producerPanelHeaderStyle: CSSProperties = {
  padding: "18px 22px",
  borderBottom: "1px solid var(--border)",
  backgroundColor: "var(--float-surface-muted)",
};

const producerPanelEyebrowStyle: CSSProperties = {
  color: "var(--muted-foreground)",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const producerPanelTitleStyle: CSSProperties = {
  marginTop: 6,
  color: "var(--foreground)",
  fontSize: 20,
  fontWeight: 700,
  letterSpacing: "-0.01em",
  lineHeight: 1.2,
};

const producerPanelCloseStyle: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: "var(--radius-control)",
  border: "1px solid var(--border)",
  backgroundColor: "var(--float-surface)",
  color: "var(--secondary)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const producerChatCardStyle: CSSProperties = {
  flex: "1 1 560px",
  minWidth: 0,
  minHeight: 0,
  borderRadius: 22,
  border: "1px solid var(--border)",
  backgroundColor: "var(--float-surface-soft)",
  padding: 18,
  display: "flex",
  flexDirection: "column",
};

const producerRailCardStyle: CSSProperties = {
  minHeight: 0,
  borderRadius: 22,
  border: "1px solid var(--border)",
  backgroundColor: "var(--float-surface-soft)",
  padding: 16,
  display: "flex",
  flexDirection: "column",
};

const producerSectionHeaderStyle: CSSProperties = {
  marginBottom: 14,
};

const producerSectionEyebrowStyle: CSSProperties = {
  color: "var(--muted-foreground)",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const producerSectionMetaStyle: CSSProperties = {
  marginTop: 5,
  color: "var(--foreground)",
  fontSize: 15,
  fontWeight: 600,
  lineHeight: 1.35,
};

const producerMessagesWrapStyle: CSSProperties = {
  paddingRight: 4,
};

const producerAgentBubbleStyle: CSSProperties = {
  borderRadius: 14,
  padding: "13px 16px",
  backgroundColor: "var(--chat-agent-bg)",
  color: "var(--chat-agent-fg)",
  border: "1px solid var(--chat-agent-border)",
  fontSize: 15,
  lineHeight: 1.55,
};

const producerUserBubbleStyle: CSSProperties = {
  borderRadius: 16,
  padding: "13px 16px",
  backgroundColor: "var(--chat-user-bg)",
  color: "var(--chat-user-fg)",
  border: "1px solid var(--chat-user-border)",
  fontSize: 15,
  lineHeight: 1.55,
};

const producerMessageTimestampStyle: CSSProperties = {
  marginTop: 8,
  color: "var(--muted-foreground)",
  fontSize: 12,
  fontWeight: 600,
};

const producerListItemStyle: CSSProperties = {
  borderRadius: 16,
  border: "1px solid var(--border)",
  backgroundColor: "var(--float-surface)",
  padding: "13px 14px 14px",
};

const producerListItemTitleStyle: CSSProperties = {
  color: "var(--foreground)",
  fontSize: 15,
  fontWeight: 700,
  lineHeight: 1.3,
};

const producerListItemMetaStyle: CSSProperties = {
  marginTop: 4,
  color: "var(--muted-foreground)",
  fontSize: 13,
  fontWeight: 500,
  lineHeight: 1.45,
};

const producerListItemSubtleStyle: CSSProperties = {
  marginTop: 10,
  color: "var(--foreground)",
  fontSize: 13,
  fontWeight: 500,
  lineHeight: 1.35,
  opacity: 0.78,
};

const producerHistoryTimestampStyle: CSSProperties = {
  color: "var(--muted-foreground)",
  fontSize: 12,
  fontWeight: 700,
  whiteSpace: "nowrap",
};

function queueStatusBadgeStyle(status: QueueStatus): CSSProperties {
  const tones: Record<QueueStatus, { background: string; color: string }> = {
    Generating: {
      background: "rgba(59, 130, 246, 0.14)",
      color: "#2563EB",
    },
    Queued: {
      background: "rgba(148, 163, 184, 0.18)",
      color: "var(--foreground)",
    },
    Ready: {
      background: "rgba(34, 197, 94, 0.16)",
      color: "#15803D",
    },
  };

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 76,
    height: 28,
    padding: "0 10px",
    borderRadius: 9999,
    backgroundColor: tones[status].background,
    color: tones[status].color,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  };
}
