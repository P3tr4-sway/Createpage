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

export function AgenticProducingPage({ onBack }: AgenticProducingPageProps) {
  return (
    <section
      className="h-full w-full overflow-hidden flex flex-col"
      style={{
        backgroundColor: "#14151A",
        fontFamily: "'Lava', sans-serif",
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{
          height: 68,
          padding: "0 18px",
          backgroundColor: "#121319",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
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
            color: "rgba(255,255,255,0.88)",
            backgroundColor: "transparent",
            border: "none",
          }}
        >
          <X size={22} strokeWidth={2} />
        </button>

        <h2
          style={{
            color: "#F5F6FA",
            fontSize: 34,
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
              height: 40,
              padding: "0 14px",
              borderRadius: 12,
              border: "none",
              color: "#14151A",
              backgroundColor: "#FFFFFF",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            <Save size={15} strokeWidth={1.9} />
            Save
          </button>
        </div>
      </div>

      <div
        className="flex flex-col flex-1"
        style={{ minHeight: 0, backgroundColor: "#14151A" }}
      >
        <div className="flex" style={{ height: 122 }}>
          <div
            style={{
              width: 360,
              borderRight: "1px solid rgba(255,255,255,0.08)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <button
              type="button"
              className="inline-flex items-center gap-2 cursor-pointer"
              style={{
                width: "100%",
                height: 54,
                padding: "0 18px",
                color: "#E8EAF2",
                backgroundColor: "#14151A",
                border: "none",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                fontSize: 34,
                fontWeight: 600,
              }}
            >
              <Plus size={20} strokeWidth={2.2} />
              Add Track
            </button>

            <div
              className="flex items-center justify-between"
              style={{
                height: 68,
                padding: "0 14px",
                background: "linear-gradient(90deg, #FF6A00 0%, #4A1B0A 22%, #2A1310 100%)",
              }}
            >
              <div className="flex items-center gap-14">
                <span style={{ color: "#F7F8FC", fontSize: 34, fontWeight: 700 }}>Track 1</span>
                <div className="flex items-center gap-8">
                  <button type="button" style={trackPillStyle}>M</button>
                  <button type="button" style={trackPillStyle}>S</button>
                  <button type="button" style={{ ...trackPillStyle, width: 34, padding: 0 }}>
                    <MoreVertical size={15} strokeWidth={2} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-14">
                <div
                  style={{
                    width: 154,
                    height: 6,
                    borderRadius: 999,
                    backgroundColor: "rgba(255,255,255,0.82)",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 58,
                      top: -7,
                      width: 20,
                      height: 20,
                      borderRadius: 999,
                      backgroundColor: "#FFFFFF",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    border: "3px solid #C9CCD8",
                    backgroundColor: "rgba(255,255,255,0.08)",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div
              className="flex items-center"
              style={{
                height: 34,
                padding: "0 12px",
                color: "rgba(255,255,255,0.46)",
                fontSize: 14,
                backgroundColor: "#1E2028",
              }}
            >
              {barNumbers.map((n) => (
                <div key={n} style={{ width: "5%", minWidth: 48 }}>
                  {n}
                </div>
              ))}
            </div>
            <div
              style={{
                height: 88,
                backgroundImage:
                  "repeating-linear-gradient(to right, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 16px), repeating-linear-gradient(to right, rgba(255,255,255,0.09) 0, rgba(255,255,255,0.09) 1px, transparent 1px, transparent 80px)",
                backgroundColor: "#1B1D24",
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0, position: "relative", backgroundColor: "#121319" }}>
          <div
            style={{
              position: "absolute",
              left: 360,
              top: 0,
              bottom: 0,
              width: 2,
              backgroundColor: "#EBEDF6",
            }}
          />
        </div>

        <div
          className="flex items-center justify-between"
          style={{
            height: 96,
            padding: "0 18px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            backgroundColor: "#1A1C22",
          }}
        >
          <div className="flex items-center gap-12">
            <div
              style={{
                width: 190,
                height: 6,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.26)",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 72,
                  top: -8,
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  backgroundColor: "#D8DBE7",
                }}
              />
            </div>
            <div className="flex items-center gap-8">
              <button type="button" style={bottomIconStyle}><AudioWaveform size={20} strokeWidth={1.8} /></button>
              <button type="button" style={bottomIconStyle}><MicOff size={20} strokeWidth={1.8} /></button>
              <button type="button" style={bottomIconStyle}><SlidersHorizontal size={20} strokeWidth={1.8} /></button>
            </div>
          </div>

          <div className="flex items-center gap-12">
            <button type="button" style={transportStyle}><SkipBack size={26} strokeWidth={2.1} /></button>
            <button type="button" style={transportStyle}><Play size={28} strokeWidth={2.1} /></button>
            <button type="button" style={{ ...transportStyle, color: "#FF4E46" }}>
              <Circle size={24} fill="currentColor" strokeWidth={2} />
            </button>
          </div>

          <div className="flex items-center gap-8">
            <button type="button" style={bottomPillStyle}><Repeat size={16} strokeWidth={2} /></button>
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
  width: 36,
  height: 36,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.04)",
  color: "#C6CAD6",
};

const trackPillStyle: React.CSSProperties = {
  width: 44,
  height: 34,
  borderRadius: 10,
  border: "none",
  color: "rgba(255,255,255,0.8)",
  backgroundColor: "rgba(255,255,255,0.12)",
  fontSize: 16,
  fontWeight: 600,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const bottomIconStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 12,
  border: "none",
  backgroundColor: "transparent",
  color: "#C7CBDA",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const transportStyle: React.CSSProperties = {
  width: 58,
  height: 58,
  borderRadius: 16,
  border: "none",
  backgroundColor: "transparent",
  color: "#F2F3F8",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const bottomPillStyle: React.CSSProperties = {
  height: 42,
  padding: "0 14px",
  borderRadius: 12,
  border: "none",
  backgroundColor: "rgba(255,255,255,0.06)",
  color: "#DEE2EE",
  fontSize: 22,
  fontWeight: 600,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
};
