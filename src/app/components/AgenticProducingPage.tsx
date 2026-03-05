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
} from "lucide-react";

interface AgenticProducingPageProps {
  onBack: () => void;
}

const barNumbers = Array.from({ length: 20 }, (_, i) => i + 1);
const TRACK_PANEL_WIDTH = 380;
const TOP_TRACK_AREA_HEIGHT = 156;
const ADD_TRACK_ROW_HEIGHT = 52;
const TIMELINE_RULER_HEIGHT = 42;

export function AgenticProducingPage({ onBack }: AgenticProducingPageProps) {
  return (
    <section
      className="h-full w-full overflow-hidden flex flex-col"
      style={{
        backgroundColor: "var(--agentic-bg)",
        fontFamily: "'Lava', sans-serif",
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{
          height: 60,
          padding: "0 16px",
          backgroundColor: "var(--agentic-topbar)",
          borderBottom: "1px solid var(--agentic-border)",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center cursor-pointer"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            color: "var(--agentic-foreground)",
            backgroundColor: "transparent",
            border: "none",
          }}
        >
          <X size={22} strokeWidth={2} />
        </button>

        <h2
          style={{
            color: "var(--agentic-foreground)",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "0.01em",
          }}
        >
          New Project 20250408
        </h2>

        <div className="flex items-center gap-2">
          <button type="button" className="inline-flex items-center justify-center" style={toolbarIconStyle}>
            <Undo2 size={16} strokeWidth={1.8} />
          </button>
          <button type="button" className="inline-flex items-center justify-center" style={toolbarIconStyle}>
            <Upload size={16} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 cursor-pointer"
            style={{
              height: 36,
              padding: "0 12px",
              borderRadius: 10,
              border: "none",
              color: "var(--background)",
              backgroundColor: "var(--foreground)",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            <Save size={14} strokeWidth={1.9} />
            Save
          </button>
        </div>
      </div>

      <div
        className="flex flex-col flex-1"
        style={{ minHeight: 0, backgroundColor: "var(--agentic-bg)" }}
      >
        <div className="flex" style={{ height: TOP_TRACK_AREA_HEIGHT }}>
          <div
            style={{
              width: TRACK_PANEL_WIDTH,
              borderRight: "1px solid var(--agentic-border-strong)",
              borderBottom: "1px solid var(--agentic-border-strong)",
            }}
          >
            <button
              type="button"
              className="inline-flex items-center gap-2 cursor-pointer"
              style={{
                width: "100%",
                height: ADD_TRACK_ROW_HEIGHT,
                padding: "0 16px",
                color: "var(--agentic-foreground)",
                backgroundColor: "var(--agentic-bg)",
                border: "none",
                borderBottom: "1px solid var(--agentic-border)",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "0",
              }}
            >
              <Plus size={20} strokeWidth={2.2} />
              Add Track
            </button>

            <div
              className="relative flex flex-col justify-between"
              style={{
                height: TOP_TRACK_AREA_HEIGHT - ADD_TRACK_ROW_HEIGHT,
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
                  width: 6,
                  backgroundColor: "#F44343",
                }}
              />

              <div className="flex items-center justify-between">
                <span
                  style={{
                    color: "var(--agentic-track-title)",
                    fontSize: 18,
                    fontWeight: 700,
                    lineHeight: 1.15,
                    letterSpacing: "0",
                  }}
                >
                  Track 1
                </span>
                <div className="flex items-center gap-8">
                  <div
                    className="flex items-center overflow-hidden"
                    style={{
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.08)",
                      backgroundColor: "var(--agentic-control-bg)",
                    }}
                  >
                    <button type="button" style={trackTogglePillStyle}>M</button>
                    <button type="button" style={{ ...trackTogglePillStyle, borderLeft: "1px solid rgba(255,255,255,0.1)" }}>S</button>
                  </div>
                  <button type="button" style={trackMoreStyle}>
                    <MoreVertical size={18} strokeWidth={2.2} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div
                  style={{
                    width: 220,
                    height: 7,
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
                      top: -8,
                      width: 22,
                      height: 22,
                      borderRadius: 999,
                      backgroundColor: "var(--on-image-primary)",
                      boxShadow: "0 0 0 2px rgba(255,255,255,0.12)",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: 46,
                    height: 46,
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
                      top: 6,
                      transform: "translateX(-50%)",
                      width: 2,
                      height: 8,
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
                height: TIMELINE_RULER_HEIGHT,
                padding: 0,
                color: "var(--agentic-muted)",
                fontSize: 20,
                backgroundColor: "var(--agentic-surface)",
              }}
            >
              {barNumbers.map((n) => (
                <div
                  key={n}
                  className="flex items-center"
                  style={{
                    height: "100%",
                    width: 54,
                    minWidth: 54,
                    paddingLeft: 8,
                    borderRight: "1px solid var(--agentic-border-strong)",
                    backgroundColor: n === 1 ? "rgba(255,255,255,0.12)" : "transparent",
                    fontSize: 14,
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
                height: TOP_TRACK_AREA_HEIGHT - TIMELINE_RULER_HEIGHT,
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
              left: TRACK_PANEL_WIDTH,
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
            height: 82,
            padding: "0 16px",
            borderTop: "1px solid var(--agentic-border)",
            backgroundColor: "var(--agentic-surface)",
          }}
        >
          <div className="flex items-center gap-10">
            <div
              style={{
                width: 160,
                height: 6,
                borderRadius: 999,
                backgroundColor: "var(--agentic-slider-track)",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 62,
                  top: -8,
                  width: 20,
                  height: 20,
                  borderRadius: 999,
                  backgroundColor: "var(--agentic-slider-thumb)",
                }}
              />
            </div>
            <div className="flex items-center gap-6">
              <button type="button" style={bottomIconStyle}><AudioWaveform size={18} strokeWidth={1.8} /></button>
              <button type="button" style={bottomIconStyle}><MicOff size={18} strokeWidth={1.8} /></button>
              <button type="button" style={bottomIconStyle}><SlidersHorizontal size={18} strokeWidth={1.8} /></button>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <button type="button" style={transportStyle}><SkipBack size={22} strokeWidth={2.1} /></button>
            <button type="button" style={transportStyle}><Play size={24} strokeWidth={2.1} /></button>
            <button type="button" style={{ ...transportStyle, color: "var(--agentic-danger)" }}>
              <Circle size={20} fill="currentColor" strokeWidth={2} />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <button type="button" style={bottomPillStyle}><Repeat size={14} strokeWidth={2} /></button>
            <button type="button" style={bottomPillStyle}>1.0x</button>
            <button type="button" style={bottomPillStyle}>4/4</button>
            <button type="button" style={bottomPillStyle}>65 BPM</button>
          </div>
        </div>
      </div>
    </section>
  );
}

const toolbarIconStyle: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 9,
  border: "1px solid var(--agentic-border-strong)",
  backgroundColor: "var(--agentic-control-bg)",
  color: "var(--agentic-control-text)",
};

const trackTogglePillStyle: React.CSSProperties = {
  width: 46,
  height: 38,
  borderRadius: 0,
  border: "none",
  color: "var(--agentic-contrast)",
  backgroundColor: "transparent",
  fontSize: 16,
  fontWeight: 700,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const trackMoreStyle: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "var(--agentic-control-bg)",
  color: "var(--agentic-contrast)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const bottomIconStyle: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 10,
  border: "none",
  backgroundColor: "transparent",
  color: "var(--agentic-control-text)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const transportStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 12,
  border: "none",
  backgroundColor: "transparent",
  color: "var(--agentic-foreground)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const bottomPillStyle: React.CSSProperties = {
  height: 34,
  padding: "0 12px",
  borderRadius: 10,
  border: "none",
  backgroundColor: "var(--agentic-control-bg)",
  color: "var(--agentic-control-text)",
  fontSize: 13,
  fontWeight: 600,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
};
