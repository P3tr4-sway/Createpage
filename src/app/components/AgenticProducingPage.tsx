import { useState } from "react";
import {
  X,
  Undo2,
  Upload,
  Save,
  Plus,
  MoreVertical,
  SkipBack,
  Play,
  Circle,
  Repeat,
  MicOff,
  SlidersHorizontal,
  AudioWaveform,
  Bot,
  SendHorizontal,
  Sparkles,
  WandSparkles,
} from "lucide-react";

interface AgenticProducingPageProps {
  onBack?: () => void;
  previewMode?: boolean;
}

const barNumbers = Array.from({ length: 20 }, (_, i) => i + 1);

type AgentMessage = {
  id: number;
  role: "agent" | "user";
  text: string;
};

const initialAgentMessages: AgentMessage[] = [
  {
    id: 1,
    role: "agent",
    text: "I am watching your arrangement. Tell me what to change and I can plan the next edit.",
  },
  {
    id: 2,
    role: "agent",
    text: "Current suggestion: add a drum fill before bar 9 and automate the filter in bars 13-16.",
  },
];

const quickPrompts = [
  "Build intro -> drop transition",
  "Thicken low-end without mud",
  "Give me a 16-bar arrangement plan",
];

export function AgenticProducingPage({
  onBack,
  previewMode = false,
}: AgenticProducingPageProps) {
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>(
    initialAgentMessages,
  );
  const [agentDraft, setAgentDraft] = useState("");
  const showAgentPanel = !previewMode;
  const showProjectTitle = !previewMode;
  const showBackButton = !previewMode && typeof onBack === "function";
  const trackPanelWidth = previewMode ? 320 : 460;
  const topTrackAreaHeight = previewMode ? 146 : 196;
  const addTrackRowHeight = previewMode ? 50 : 62;
  const timelineRulerHeight = previewMode ? 38 : 52;
  const bottomTransportHeight = previewMode ? 72 : 94;
  const barCellWidth = previewMode ? 40 : 62;
  const trackHeaderActionGap = previewMode ? 12 : 32;
  const trackToggleWidth = previewMode ? 42 : 52;
  const trackToggleHeight = previewMode ? 34 : 44;
  const trackMoreButtonSize = previewMode ? 38 : 44;
  const trackFaderMaxWidth = previewMode ? 156 : 270;
  const trackKnobSize = previewMode ? 34 : 56;

  const sendMessage = (rawText?: string) => {
    const nextText = (rawText ?? agentDraft).trim();
    if (!nextText) return;

    setAgentMessages((prev) => {
      const nextId = prev.length + 1;
      const userMsg: AgentMessage = { id: nextId, role: "user", text: nextText };
      const agentMsg: AgentMessage = {
        id: nextId + 1,
        role: "agent",
        text: "Noted. I can apply this as: 1) section edit 2) automation move 3) mix tweak. Pick one and I will detail exact bars.",
      };
      return [...prev, userMsg, agentMsg];
    });
    setAgentDraft("");
  };

  return (
    <section
      className="h-full w-full overflow-hidden flex flex-col"
      style={{
        backgroundColor: "var(--agentic-bg)",
        fontFamily: "var(--app-font-family)",
      }}
    >
      {!previewMode ? (
        <div
          className="flex items-center justify-between"
          style={{
            height: 72,
            padding: "0 18px",
            backgroundColor: "var(--agentic-topbar)",
            borderBottom: "1px solid var(--agentic-border)",
          }}
        >
          {showBackButton ? (
            <button
              type="button"
              onClick={onBack}
              className="tablet-icon-target tablet-pressable inline-flex items-center justify-center"
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                color: "var(--agentic-foreground)",
                backgroundColor: "transparent",
                border: "none",
              }}
            >
              <X size={22} strokeWidth={2} />
            </button>
          ) : (
            <div style={{ width: 36, height: 36 }} />
          )}

          {showProjectTitle ? (
            <h2
              style={{
                color: "var(--agentic-foreground)",
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: "0.01em",
              }}
            >
              New Project 20250408
            </h2>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button type="button" className="tablet-icon-target tablet-pressable inline-flex items-center justify-center" style={toolbarIconStyle}>
              <Undo2 size={16} strokeWidth={1.8} />
            </button>
            <button type="button" className="tablet-icon-target tablet-pressable inline-flex items-center justify-center" style={toolbarIconStyle}>
              <Upload size={16} strokeWidth={1.8} />
            </button>
            <button
              type="button"
              className="tablet-touch-target tablet-pressable inline-flex items-center gap-2"
              style={{
                height: 42,
                padding: "0 14px",
                borderRadius: 9999,
                border: "1px solid var(--agentic-border)",
                color: "var(--background)",
                backgroundColor: "var(--foreground)",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              <Save size={14} strokeWidth={1.9} />
              Save
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-1 min-h-0 min-w-0" style={{ backgroundColor: "var(--agentic-bg)" }}>
        <div
          className="flex flex-col flex-1 min-h-0 min-w-0"
          style={{ minHeight: 0, backgroundColor: "var(--agentic-bg)" }}
        >
          <div className="flex" style={{ height: topTrackAreaHeight }}>
            <div
              style={{
                width: trackPanelWidth,
                borderRight: "1px solid var(--agentic-border-strong)",
                borderBottom: "1px solid var(--agentic-border-strong)",
              }}
            >
              <button
                type="button"
                className="tablet-touch-target tablet-pressable inline-flex items-center gap-2"
                style={{
                width: "100%",
                height: addTrackRowHeight,
                padding: "0 18px",
                color: "var(--agentic-foreground)",
                backgroundColor: "var(--agentic-bg)",
                border: "none",
                borderBottom: "1px solid var(--agentic-border)",
                fontSize: previewMode ? 20 : 28,
                fontWeight: 700,
                letterSpacing: "0",
              }}
            >
                <Plus size={24} strokeWidth={2.2} />
                Add Track
              </button>

              <div
                className="relative flex flex-col justify-between"
                style={{
                  height: topTrackAreaHeight - addTrackRowHeight,
                  padding: "12px 14px 10px",
                  background: "var(--agentic-track-gradient)",
                }}
              >
                <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 8,
                  backgroundColor: "#F44343",
                }}
              />

                <div className="flex items-center justify-between gap-3">
                  <span
                    style={{
                      minWidth: 0,
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: "var(--agentic-track-title)",
                      fontSize: previewMode ? 16 : 24,
                      fontWeight: 700,
                      lineHeight: 1.15,
                      letterSpacing: "0",
                    }}
                  >
                    Track 1
                  </span>
                  <div className="flex items-center" style={{ gap: trackHeaderActionGap, flexShrink: 0 }}>
                    <div
                      className="flex items-center overflow-hidden"
                      style={{
                        borderRadius: 12,
                        border: "1px solid rgba(255,255,255,0.08)",
                        backgroundColor: "var(--agentic-control-bg)",
                      }}
                    >
                      <button
                        type="button"
                        style={{
                          ...trackTogglePillStyle,
                          width: trackToggleWidth,
                          height: trackToggleHeight,
                          fontSize: previewMode ? 15 : 18,
                        }}
                      >
                        M
                      </button>
                      <button
                        type="button"
                        style={{
                          ...trackTogglePillStyle,
                          width: trackToggleWidth,
                          height: trackToggleHeight,
                          fontSize: previewMode ? 15 : 18,
                          borderLeft: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        S
                      </button>
                    </div>
                    <button
                      type="button"
                      style={{
                        ...trackMoreStyle,
                        width: trackMoreButtonSize,
                        height: trackMoreButtonSize,
                      }}
                    >
                      <MoreVertical size={previewMode ? 16 : 18} strokeWidth={2.2} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                      maxWidth: trackFaderMaxWidth,
                      height: 9,
                      borderRadius: 999,
                      backgroundColor: "var(--agentic-control-bg)",
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "80%",
                        height: "100%",
                        borderRadius: 999,
                        backgroundColor: "var(--agentic-contrast)",
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        left: "74%",
                        top: -10,
                        width: previewMode ? 22 : 26,
                        height: previewMode ? 22 : 26,
                        borderRadius: 999,
                        backgroundColor: "var(--on-image-primary)",
                        boxShadow: "0 0 0 2px rgba(255,255,255,0.12)",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      width: trackKnobSize,
                      height: trackKnobSize,
                      flexShrink: 0,
                      borderRadius: 999,
                      border: "3px solid var(--agentic-control-bg)",
                      backgroundColor: "var(--agentic-contrast)",
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: 8,
                        transform: "translateX(-50%)",
                        width: 2,
                        height: 10,
                        borderRadius: 999,
                        backgroundColor: "var(--agentic-muted)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1" style={{ borderBottom: "1px solid var(--agentic-border-strong)" }}>
              <div
                className="flex items-center"
                style={{
                  height: timelineRulerHeight,
                  padding: 0,
                  color: "var(--agentic-muted)",
                  fontSize: previewMode ? 16 : 20,
                  backgroundColor: "var(--agentic-surface)",
                }}
              >
                {barNumbers.map((n) => (
                  <div
                    key={n}
                    className="flex items-center"
                    style={{
                      height: "100%",
                      width: barCellWidth,
                      minWidth: barCellWidth,
                      paddingLeft: previewMode ? 8 : 10,
                      borderRight: "1px solid var(--agentic-border-strong)",
                      backgroundColor: n === 1 ? "rgba(255,255,255,0.12)" : "transparent",
                      fontSize: previewMode ? 13 : 16,
                      fontWeight: n === 1 ? 700 : 500,
                      color: n === 1 ? "var(--agentic-contrast)" : "var(--agentic-muted)",
                    }}
                  >
                    {n}
                  </div>
                ))}
              </div>
              <div
                style={{
                  height: topTrackAreaHeight - timelineRulerHeight,
                  backgroundImage:
                    "repeating-linear-gradient(to right, var(--agentic-border) 0, var(--agentic-border) 1px, transparent 1px, transparent 16px), repeating-linear-gradient(to right, var(--agentic-border-strong) 0, var(--agentic-border-strong) 1px, transparent 1px, transparent 80px)",
                  backgroundColor: "var(--agentic-grid)",
                }}
              />
            </div>
          </div>

          <div style={{ flex: 1, minHeight: 0, position: "relative", backgroundColor: "var(--agentic-topbar)" }}>
            <div
              style={{
                position: "absolute",
                left: trackPanelWidth,
                top: 0,
                bottom: 0,
                width: 2,
                backgroundColor: "var(--agentic-marker)",
              }}
            />
          </div>

          <div
            className="flex items-center justify-between"
            style={{
              height: bottomTransportHeight,
              padding: "0 16px",
              borderTop: "1px solid var(--agentic-border)",
              backgroundColor: "var(--agentic-surface)",
            }}
          >
            <div className="flex items-center gap-10">
              <div
                style={{
                  width: previewMode ? 112 : 190,
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: "var(--agentic-slider-track)",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: previewMode ? 36 : 72,
                    top: -9,
                    width: 24,
                    height: 24,
                    borderRadius: 999,
                    backgroundColor: "var(--agentic-slider-thumb)",
                  }}
                />
              </div>
              <div className="flex items-center gap-6">
                <button type="button" style={bottomIconStyle}><AudioWaveform size={20} strokeWidth={1.8} /></button>
                <button type="button" style={bottomIconStyle}><MicOff size={20} strokeWidth={1.8} /></button>
                <button type="button" style={bottomIconStyle}><SlidersHorizontal size={20} strokeWidth={1.8} /></button>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <button type="button" style={transportStyle}><SkipBack size={24} strokeWidth={2.1} /></button>
              <button type="button" style={transportStyle}><Play size={26} strokeWidth={2.1} /></button>
              <button type="button" style={{ ...transportStyle, color: "var(--agentic-danger)" }}>
                <Circle size={22} fill="currentColor" strokeWidth={2} />
              </button>
            </div>

            <div className="flex items-center gap-6">
              <button type="button" style={bottomPillStyle}><Repeat size={16} strokeWidth={2} /></button>
              <button type="button" style={bottomPillStyle}>1.0x</button>
              <button type="button" style={bottomPillStyle}>4/4</button>
              <button type="button" style={bottomPillStyle}>65 BPM</button>
            </div>
          </div>
        </div>

        {showAgentPanel && (
          <aside
            className="flex flex-col shrink-0"
            style={{
              width: 420,
              minWidth: 420,
              flexShrink: 0,
              height: `calc(100% - ${bottomTransportHeight}px)`,
              alignSelf: "flex-start",
              overflow: "hidden",
              borderLeft: "1px solid var(--agentic-border-strong)",
              backgroundColor: "var(--agentic-surface)",
            }}
          >
            <div
              className="flex items-center justify-between"
              style={{
                height: 58,
                padding: "0 14px",
                borderBottom: "1px solid var(--agentic-border)",
              }}
            >
              <div className="flex items-center gap-2" style={{ color: "var(--agentic-foreground)" }}>
                <Bot size={18} strokeWidth={2} />
                <span style={{ fontSize: 16, fontWeight: 700 }}>AI Agent</span>
              </div>
              <div
                className="flex items-center gap-1.5"
                style={{ color: "var(--secondary)", fontSize: 13, fontWeight: 600 }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    backgroundColor: "var(--sidebar-accent-teal)",
                  }}
                />
                Online
              </div>
            </div>

            <div className="flex flex-wrap gap-2" style={{ padding: "12px 12px 10px" }}>
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="tablet-touch-target tablet-pressable inline-flex items-center gap-1.5"
                  style={{
                    minHeight: 40,
                    padding: "0 11px",
                    borderRadius: 12,
                    border: "1px solid var(--agentic-border)",
                    backgroundColor: "var(--agentic-control-bg)",
                    color: "var(--agentic-foreground)",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  <WandSparkles size={12} strokeWidth={1.8} />
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto" style={{ padding: "0 12px 12px" }}>
              <div className="flex flex-col gap-2">
                {agentMessages.map((message) => {
                  const isUser = message.role === "user";
                  return (
                    <div
                      key={message.id}
                      className="flex"
                      style={{ justifyContent: isUser ? "flex-end" : "flex-start" }}
                    >
                      <div
                        style={{
                          maxWidth: "86%",
                          borderRadius: isUser ? 14 : 12,
                          padding: "10px 12px",
                          backgroundColor: isUser
                            ? "var(--agentic-chat-user-bg)"
                            : "var(--agentic-chat-agent-bg)",
                          color: isUser
                            ? "var(--agentic-chat-user-fg)"
                            : "var(--agentic-chat-agent-fg)",
                          border: isUser
                            ? "1px solid var(--agentic-chat-user-border)"
                            : "1px solid var(--agentic-chat-agent-border)",
                          fontSize: 14,
                          lineHeight: 1.45,
                          fontWeight: 450,
                        }}
                      >
                        {message.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid var(--agentic-border)",
                padding: "10px 12px 12px",
                backgroundColor: "var(--agentic-topbar)",
              }}
            >
              <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
                <Sparkles size={13} strokeWidth={1.9} style={{ color: "var(--secondary)" }} />
                <span style={{ fontSize: 11, color: "var(--secondary)", fontWeight: 600 }}>
                  Context: Arrangement + Timeline
                </span>
              </div>

              <div className="flex items-end gap-2">
                <textarea
                  value={agentDraft}
                  onChange={(e) => setAgentDraft(e.target.value)}
                  placeholder="Ask agent to arrange, mix, or automate..."
                  rows={2}
                  style={{
                    flex: 1,
                    resize: "none",
                    borderRadius: 14,
                    border: "1px solid var(--agentic-border)",
                    backgroundColor: "var(--agentic-elevated-strong)",
                    color: "var(--agentic-foreground)",
                    fontSize: 14,
                    fontFamily: "var(--app-font-family)",
                    padding: "9px 10px",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => sendMessage()}
                  className="tablet-icon-target tablet-pressable inline-flex items-center justify-center"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 9999,
                    border: "1px solid var(--solid-button-border)",
                    backgroundColor: "var(--solid-button-bg)",
                    color: "var(--solid-button-fg)",
                    cursor: "pointer",
                  }}
                >
                  <SendHorizontal size={18} strokeWidth={2.1} />
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}

const toolbarIconStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 12,
  border: "1px solid var(--agentic-border)",
  backgroundColor: "var(--agentic-elevated)",
  color: "var(--agentic-control-text)",
};

const trackTogglePillStyle: React.CSSProperties = {
  width: 52,
  height: 44,
  borderRadius: 0,
  border: "none",
  color: "var(--agentic-contrast)",
  backgroundColor: "transparent",
  fontSize: 18,
  fontWeight: 700,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const trackMoreStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  backgroundColor: "var(--agentic-control-bg)",
  color: "var(--agentic-contrast)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const bottomIconStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 12,
  border: "1px solid var(--agentic-border)",
  backgroundColor: "var(--agentic-elevated)",
  color: "var(--agentic-control-text)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const transportStyle: React.CSSProperties = {
  width: 50,
  height: 50,
  borderRadius: 14,
  border: "1px solid var(--agentic-border)",
  backgroundColor: "var(--agentic-elevated)",
  color: "var(--agentic-foreground)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const bottomPillStyle: React.CSSProperties = {
  height: 44,
  padding: "0 13px",
  borderRadius: 9999,
  border: "1px solid var(--agentic-border)",
  backgroundColor: "var(--agentic-elevated)",
  color: "var(--agentic-control-text)",
  fontSize: 14,
  fontWeight: 500,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
};
