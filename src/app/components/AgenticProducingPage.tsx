import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  X,
  Undo2,
  Upload,
  Save,
  Plus,
  MoreVertical,
  SkipBack,
  Play,
  Pause,
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

type AgentMessage = {
  id: number;
  role: "agent" | "user";
  text: string;
};

type ArrangementClip = {
  id: string;
  label: string;
  startBeat: number;
  durationBeats: number;
  fill: string;
  accent: string;
};

type ArrangementTrack = {
  id: string;
  name: string;
  role: string;
  level: string;
  clips: ArrangementClip[];
};

const initialTracks: ArrangementTrack[] = [
  {
    id: "drums",
    name: "Drums",
    role: "Pocket",
    level: "-4.5 dB",
    clips: [
      {
        id: "drums-a",
        label: "Intro groove",
        startBeat: 0,
        durationBeats: 12,
        fill: "linear-gradient(135deg, rgba(69, 132, 255, 0.94), rgba(40, 87, 214, 0.94))",
        accent: "#DCE7FF",
      },
      {
        id: "drums-b",
        label: "Main pocket",
        startBeat: 16,
        durationBeats: 28,
        fill: "linear-gradient(135deg, rgba(46, 109, 239, 0.96), rgba(30, 74, 189, 0.96))",
        accent: "#F7FBFF",
      },
      {
        id: "drums-c",
        label: "Fill + lift",
        startBeat: 52,
        durationBeats: 8,
        fill: "linear-gradient(135deg, rgba(98, 146, 255, 0.96), rgba(46, 109, 239, 0.94))",
        accent: "#F7FBFF",
      },
    ],
  },
  {
    id: "bass",
    name: "Bass",
    role: "Low end",
    level: "-6.0 dB",
    clips: [
      {
        id: "bass-a",
        label: "Verse line",
        startBeat: 4,
        durationBeats: 20,
        fill: "linear-gradient(135deg, rgba(41, 185, 133, 0.94), rgba(24, 128, 92, 0.94))",
        accent: "#E7FFF6",
      },
      {
        id: "bass-b",
        label: "Hook sustain",
        startBeat: 28,
        durationBeats: 24,
        fill: "linear-gradient(135deg, rgba(58, 204, 148, 0.94), rgba(30, 145, 106, 0.96))",
        accent: "#F2FFF9",
      },
    ],
  },
  {
    id: "guitar",
    name: "Guitar",
    role: "Texture",
    level: "-8.2 dB",
    clips: [
      {
        id: "guitar-a",
        label: "Muted comp",
        startBeat: 8,
        durationBeats: 12,
        fill: "linear-gradient(135deg, rgba(249, 161, 71, 0.96), rgba(233, 119, 14, 0.94))",
        accent: "#FFF4E6",
      },
      {
        id: "guitar-b",
        label: "Open chorus",
        startBeat: 24,
        durationBeats: 20,
        fill: "linear-gradient(135deg, rgba(251, 186, 88, 0.96), rgba(242, 136, 26, 0.96))",
        accent: "#FFF6EA",
      },
      {
        id: "guitar-c",
        label: "Lift voicing",
        startBeat: 48,
        durationBeats: 12,
        fill: "linear-gradient(135deg, rgba(255, 194, 107, 0.96), rgba(244, 146, 37, 0.96))",
        accent: "#FFF9EF",
      },
    ],
  },
  {
    id: "vocal",
    name: "Vocal",
    role: "Lead",
    level: "-3.0 dB",
    clips: [
      {
        id: "vocal-a",
        label: "Guide vocal",
        startBeat: 12,
        durationBeats: 16,
        fill: "linear-gradient(135deg, rgba(216, 106, 156, 0.96), rgba(176, 65, 115, 0.94))",
        accent: "#FFF0F6",
      },
      {
        id: "vocal-b",
        label: "Hook doubles",
        startBeat: 32,
        durationBeats: 16,
        fill: "linear-gradient(135deg, rgba(230, 128, 174, 0.96), rgba(190, 79, 127, 0.95))",
        accent: "#FFF3F8",
      },
      {
        id: "vocal-c",
        label: "Outro adlibs",
        startBeat: 56,
        durationBeats: 8,
        fill: "linear-gradient(135deg, rgba(237, 145, 188, 0.96), rgba(198, 87, 137, 0.96))",
        accent: "#FFF6FA",
      },
    ],
  },
];

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

function clampBeat(beat: number, totalBeats: number) {
  return Math.min(Math.max(beat, 0), totalBeats);
}

function formatTransportPosition(currentBeat: number, beatsPerBar: number) {
  const wholeBeat = Math.floor(currentBeat);
  const bar = Math.floor(wholeBeat / beatsPerBar) + 1;
  const beatInBar = (wholeBeat % beatsPerBar) + 1;
  const sixteenth = Math.floor((currentBeat - wholeBeat) * 4) + 1;
  return `${String(bar).padStart(2, "0")}.${beatInBar}.${Math.min(sixteenth, 4)}`;
}

export function AgenticProducingPage({
  onBack,
  previewMode = false,
}: AgenticProducingPageProps) {
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>(
    initialAgentMessages,
  );
  const [agentDraft, setAgentDraft] = useState("");
  const [tracks, setTracks] = useState(initialTracks);
  const [selectedTrackId, setSelectedTrackId] = useState(initialTracks[0].id);
  const [mutedTrackIds, setMutedTrackIds] = useState<string[]>([]);
  const [soloTrackIds, setSoloTrackIds] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(6);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);

  const timelinePaneRef = useRef<HTMLDivElement | null>(null);
  const timelineBodyRef = useRef<HTMLDivElement | null>(null);

  const showAgentPanel = !previewMode;
  const showProjectTitle = !previewMode;
  const showBackButton = !previewMode && typeof onBack === "function";
  const trackPanelWidth = previewMode ? 282 : 356;
  const arrangementHeaderHeight = previewMode ? 44 : 58;
  const trackRowHeight = previewMode ? 76 : 92;
  const bottomTransportHeight = previewMode ? 72 : 94;
  const pixelsPerBeat = previewMode ? 26 : 36;
  const beatsPerBar = 4;
  const totalBars = 24;
  const tempo = 65;
  const totalBeats = totalBars * beatsPerBar;
  const barWidth = beatsPerBar * pixelsPerBeat;
  const timelineContentWidth = totalBeats * pixelsPerBeat;
  const playheadViewportX = currentBeat * pixelsPerBeat - scrollLeft;
  const selectedTrack = tracks.find((track) => track.id === selectedTrackId) ?? tracks[0];

  const sendMessage = (rawText?: string) => {
    const nextText = (rawText ?? agentDraft).trim();
    if (!nextText) return;

    setAgentMessages((prev) => {
      const nextId = prev.length + 1;
      const userMessage: AgentMessage = { id: nextId, role: "user", text: nextText };
      const agentMessage: AgentMessage = {
        id: nextId + 1,
        role: "agent",
        text: "Noted. I can apply this as: 1) section edit 2) automation move 3) mix tweak. Pick one and I will detail exact bars.",
      };
      return [...prev, userMessage, agentMessage];
    });
    setAgentDraft("");
  };

  const addTrack = () => {
    const nextIndex = tracks.length + 1;
    const nextTrack: ArrangementTrack = {
      id: `track-${nextIndex}`,
      name: `Track ${nextIndex}`,
      role: "Idea lane",
      level: "-inf dB",
      clips: [],
    };
    setTracks((prev) => [...prev, nextTrack]);
    setSelectedTrackId(nextTrack.id);
  };

  const toggleMuted = (trackId: string) => {
    setMutedTrackIds((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId],
    );
  };

  const toggleSolo = (trackId: string) => {
    setSoloTrackIds((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId],
    );
  };

  const seekToBeat = (nextBeat: number) => {
    setCurrentBeat(clampBeat(nextBeat, totalBeats));
  };

  const seekFromClientX = (clientX: number) => {
    const pane = timelinePaneRef.current;
    if (!pane) return;
    const bounds = pane.getBoundingClientRect();
    const localX = clientX - bounds.left + scrollLeft;
    seekToBeat(localX / pixelsPerBeat);
  };

  const handleSeekPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    seekFromClientX(event.clientX);
  };

  const handlePlayheadPointerDown = (
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    seekFromClientX(event.clientX);
    setIsDraggingPlayhead(true);
  };

  useEffect(() => {
    if (!isDraggingPlayhead) return;

    const handlePointerMove = (event: PointerEvent) => {
      seekFromClientX(event.clientX);
    };

    const handlePointerUp = () => {
      setIsDraggingPlayhead(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp, { once: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDraggingPlayhead, pixelsPerBeat, scrollLeft, totalBeats]);

  useEffect(() => {
    if (!isPlaying) return;

    let frameId = 0;
    let previousTime = performance.now();

    const tick = (now: number) => {
      const deltaSeconds = (now - previousTime) / 1000;
      previousTime = now;

      setCurrentBeat((prev) => {
        const nextBeat = prev + deltaSeconds * (tempo / 60);
        if (nextBeat >= totalBeats) {
          return loopEnabled ? nextBeat % totalBeats : totalBeats;
        }
        return nextBeat;
      });

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [isPlaying, loopEnabled, tempo, totalBeats]);

  useEffect(() => {
    if (isPlaying && !loopEnabled && currentBeat >= totalBeats) {
      setIsPlaying(false);
    }
  }, [currentBeat, isPlaying, loopEnabled, totalBeats]);

  useEffect(() => {
    const timelineBody = timelineBodyRef.current;
    if (!timelineBody) return;

    const markerX = currentBeat * pixelsPerBeat;
    const viewportStart = timelineBody.scrollLeft;
    const viewportEnd = viewportStart + timelineBody.clientWidth;
    const leftPadding = 48;
    const rightPadding = 92;

    if (markerX < viewportStart + leftPadding) {
      timelineBody.scrollTo({ left: Math.max(markerX - leftPadding, 0) });
      return;
    }

    if (markerX > viewportEnd - rightPadding) {
      timelineBody.scrollTo({
        left: Math.min(markerX - timelineBody.clientWidth + rightPadding, timelineContentWidth),
      });
    }
  }, [currentBeat, pixelsPerBeat, timelineContentWidth]);

  const transportPosition = formatTransportPosition(currentBeat, beatsPerBar);

  return (
    <section
      className="flex h-full w-full overflow-hidden"
      style={{
        backgroundColor: "var(--agentic-bg)",
        fontFamily: "var(--app-font-family)",
      }}
    >
      <div className="flex min-w-0 flex-1 flex-col">
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
              <button
                type="button"
                className="tablet-icon-target tablet-pressable inline-flex items-center justify-center"
                style={toolbarIconStyle}
              >
                <Undo2 size={16} strokeWidth={1.8} />
              </button>
              <button
                type="button"
                className="tablet-icon-target tablet-pressable inline-flex items-center justify-center"
                style={toolbarIconStyle}
              >
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

        <div
          className="flex min-h-0 flex-1"
          style={{ backgroundColor: "var(--agentic-bg)" }}
        >
          <div className="flex min-w-0 flex-1 flex-col">
            <div
              className="flex min-h-0 flex-1"
              style={{
                backgroundColor: "var(--agentic-bg)",
                borderBottom: "1px solid var(--agentic-border)",
              }}
            >
              <div
                className="flex shrink-0 flex-col"
                style={{
                  width: trackPanelWidth,
                  borderRight: "1px solid var(--agentic-border-strong)",
                  background:
                    "linear-gradient(180deg, rgba(10,12,17,0.92), rgba(19,24,33,0.92))",
                }}
              >
                <div
                  className="flex items-center justify-between"
                  style={{
                    height: arrangementHeaderHeight,
                    padding: previewMode ? "0 12px" : "0 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: "var(--agentic-track-title)",
                        fontSize: previewMode ? 14 : 16,
                        fontWeight: 700,
                      }}
                    >
                      Arrangement
                    </div>
                    <div
                      style={{
                        color: "var(--agentic-muted)",
                        fontSize: previewMode ? 11 : 12,
                        marginTop: 2,
                      }}
                    >
                      {totalBars} bars • {tempo} BPM • 4 tracks
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addTrack}
                    className="tablet-touch-target tablet-pressable inline-flex items-center justify-center"
                    style={{
                      width: previewMode ? 34 : 40,
                      height: previewMode ? 34 : 40,
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.1)",
                      backgroundColor: "rgba(255,255,255,0.06)",
                      color: "var(--agentic-contrast)",
                    }}
                  >
                    <Plus size={previewMode ? 18 : 20} strokeWidth={2.2} />
                  </button>
                </div>

                <div className="min-h-0 flex-1 overflow-hidden">
                  <div style={{ transform: `translateY(-${scrollTop}px)` }}>
                    {tracks.map((track) => {
                      const isSelected = track.id === selectedTrackId;
                      const isMuted = mutedTrackIds.includes(track.id);
                      const isSolo = soloTrackIds.includes(track.id);

                      return (
                        <div
                          key={track.id}
                          className="flex items-center"
                          style={{
                            height: trackRowHeight,
                            padding: previewMode ? "0 12px" : "0 16px",
                            borderBottom: "1px solid rgba(255,255,255,0.08)",
                            backgroundColor: isSelected
                              ? "rgba(255,255,255,0.06)"
                              : "transparent",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedTrackId(track.id)}
                            className="flex min-w-0 flex-1 items-center gap-3 text-left"
                            style={{
                              background: "transparent",
                              border: "none",
                              padding: 0,
                              color: "inherit",
                            }}
                          >
                            <span
                              style={{
                                width: 8,
                                alignSelf: "stretch",
                                borderRadius: 999,
                                backgroundColor: track.clips[0]?.accent ?? "#94A3B8",
                              }}
                            />
                            <span className="min-w-0 flex-1">
                              <span
                                style={{
                                  display: "block",
                                  color: "var(--agentic-track-title)",
                                  fontSize: previewMode ? 15 : 18,
                                  fontWeight: 700,
                                  lineHeight: 1.15,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {track.name}
                              </span>
                              <span
                                style={{
                                  display: "block",
                                  color: "var(--agentic-muted)",
                                  fontSize: previewMode ? 11 : 13,
                                  marginTop: 6,
                                }}
                              >
                                {track.role} • {track.level}
                              </span>
                            </span>
                          </button>

                          <div
                            className="flex items-center"
                            style={{ gap: previewMode ? 8 : 10, marginLeft: 10 }}
                          >
                            <button
                              type="button"
                              onClick={() => toggleMuted(track.id)}
                              style={{
                                ...trackTogglePillStyle,
                                width: previewMode ? 32 : 36,
                                height: previewMode ? 32 : 36,
                                backgroundColor: isMuted
                                  ? "rgba(245, 158, 11, 0.22)"
                                  : "rgba(255,255,255,0.06)",
                                color: isMuted
                                  ? "#FDE68A"
                                  : "var(--agentic-contrast)",
                              }}
                            >
                              M
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleSolo(track.id)}
                              style={{
                                ...trackTogglePillStyle,
                                width: previewMode ? 32 : 36,
                                height: previewMode ? 32 : 36,
                                backgroundColor: isSolo
                                  ? "rgba(59, 130, 246, 0.24)"
                                  : "rgba(255,255,255,0.06)",
                                color: isSolo
                                  ? "#DBEAFE"
                                  : "var(--agentic-contrast)",
                              }}
                            >
                              S
                            </button>
                            <button
                              type="button"
                              style={{
                                ...trackMoreStyle,
                                width: previewMode ? 34 : 38,
                                height: previewMode ? 34 : 38,
                              }}
                            >
                              <MoreVertical size={previewMode ? 16 : 18} strokeWidth={2.2} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div ref={timelinePaneRef} className="relative flex min-w-0 flex-1 flex-col">
                <div
                  className="relative shrink-0 overflow-hidden"
                  style={{
                    height: arrangementHeaderHeight,
                    backgroundColor: "var(--agentic-surface)",
                    borderBottom: "1px solid var(--agentic-border-strong)",
                  }}
                  onPointerDown={handleSeekPointerDown}
                >
                  <div
                    className="flex h-full"
                    style={{
                      width: timelineContentWidth,
                      transform: `translateX(-${scrollLeft}px)`,
                    }}
                  >
                    {Array.from({ length: totalBars }, (_, barIndex) => {
                      const label = barIndex + 1;
                      return (
                        <div
                          key={label}
                          className="relative h-full shrink-0"
                          style={{
                            width: barWidth,
                            minWidth: barWidth,
                            borderRight: "1px solid var(--agentic-border-strong)",
                            backgroundColor:
                              label % 2 === 0
                                ? "rgba(255,255,255,0.03)"
                                : "transparent",
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              left: previewMode ? 8 : 12,
                              top: previewMode ? 10 : 14,
                              color:
                                label === 1
                                  ? "var(--agentic-contrast)"
                                  : "var(--agentic-muted)",
                              fontSize: previewMode ? 12 : 14,
                              fontWeight: label === 1 ? 700 : 600,
                            }}
                          >
                            {label}
                          </span>

                          {Array.from({ length: beatsPerBar - 1 }, (_, beatIndex) => (
                            <span
                              key={`${label}-${beatIndex}`}
                              style={{
                                position: "absolute",
                                left: (beatIndex + 1) * pixelsPerBeat,
                                top: previewMode ? 18 : 20,
                                bottom: previewMode ? 8 : 10,
                                width: 1,
                                backgroundColor: "rgba(255,255,255,0.09)",
                              }}
                            />
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div
                  ref={timelineBodyRef}
                  className="min-h-0 flex-1 overflow-x-auto overflow-y-auto"
                  onScroll={(event) => {
                    setScrollLeft(event.currentTarget.scrollLeft);
                    setScrollTop(event.currentTarget.scrollTop);
                  }}
                  style={{ backgroundColor: "var(--agentic-topbar)" }}
                >
                  <div style={{ width: timelineContentWidth }}>
                    {tracks.map((track, rowIndex) => {
                      const isSelected = track.id === selectedTrackId;

                      return (
                        <div
                          key={track.id}
                          className="relative"
                          style={{
                            height: trackRowHeight,
                            borderBottom: "1px solid var(--agentic-border)",
                            backgroundColor: isSelected
                              ? "rgba(255,255,255,0.03)"
                              : "transparent",
                            backgroundImage:
                              "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.16) 1px, transparent 1px)",
                            backgroundSize: `${pixelsPerBeat}px 100%, ${barWidth}px 100%`,
                          }}
                          onPointerDown={handleSeekPointerDown}
                        >
                          {rowIndex % 2 === 1 ? (
                            <span
                              aria-hidden="true"
                              style={{
                                position: "absolute",
                                inset: 0,
                                backgroundColor: "rgba(255,255,255,0.015)",
                              }}
                            />
                          ) : null}

                          {track.clips.map((clip) => (
                            <button
                              key={clip.id}
                              type="button"
                              onClick={() => {
                                setSelectedTrackId(track.id);
                                seekToBeat(clip.startBeat);
                              }}
                              className="absolute overflow-hidden text-left"
                              style={{
                                left: clip.startBeat * pixelsPerBeat + 4,
                                top: previewMode ? 10 : 12,
                                width: clip.durationBeats * pixelsPerBeat - 8,
                                height: trackRowHeight - (previewMode ? 20 : 24),
                                borderRadius: previewMode ? 12 : 14,
                                border: isSelected
                                  ? "1px solid rgba(255,255,255,0.38)"
                                  : "1px solid rgba(255,255,255,0.16)",
                                background: clip.fill,
                                boxShadow: isSelected
                                  ? "0 16px 28px rgba(15,23,42,0.28)"
                                  : "0 10px 18px rgba(15,23,42,0.2)",
                                padding: previewMode ? "10px 10px" : "12px 12px",
                                color: clip.accent,
                              }}
                            >
                              <span
                                style={{
                                  display: "block",
                                  fontSize: previewMode ? 12 : 13,
                                  fontWeight: 700,
                                  letterSpacing: "0.01em",
                                }}
                              >
                                {clip.label}
                              </span>
                              <span
                                style={{
                                  display: "block",
                                  marginTop: 5,
                                  fontSize: previewMode ? 10 : 11,
                                  opacity: 0.86,
                                }}
                              >
                                Bar {Math.floor(clip.startBeat / beatsPerBar) + 1} •{" "}
                                {Math.ceil(clip.durationBeats / beatsPerBar)} bars
                              </span>
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                  }}
                >
                  <button
                    type="button"
                    aria-label={`Playhead at ${transportPosition}`}
                    onPointerDown={handlePlayheadPointerDown}
                    style={{
                      position: "absolute",
                      left: playheadViewportX,
                      top: 0,
                      bottom: 0,
                      width: 20,
                      transform: "translateX(-10px)",
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      cursor: "ew-resize",
                      pointerEvents: "auto",
                      touchAction: "none",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 9,
                        top: arrangementHeaderHeight,
                        bottom: 0,
                        width: 2,
                        borderRadius: 999,
                        backgroundColor: "var(--agentic-marker)",
                        boxShadow: "0 0 0 1px rgba(255,255,255,0.08)",
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        left: 2,
                        top: previewMode ? 6 : 10,
                        width: 16,
                        height: previewMode ? 20 : 24,
                        borderRadius: 999,
                        backgroundColor: "var(--agentic-marker)",
                        boxShadow: "0 10px 18px rgba(244,67,67,0.28)",
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div
              className="flex items-center justify-between"
              style={{
                height: bottomTransportHeight,
                padding: previewMode ? "0 14px" : "0 16px",
                borderTop: "1px solid var(--agentic-border)",
                backgroundColor: "var(--agentic-surface)",
              }}
            >
              <div className="flex items-center" style={{ gap: previewMode ? 12 : 18 }}>
                <div
                  style={{
                    minWidth: previewMode ? 86 : 108,
                    padding: previewMode ? "10px 12px" : "12px 14px",
                    borderRadius: 14,
                    border: "1px solid var(--agentic-border)",
                    backgroundColor: "var(--agentic-elevated)",
                    color: "var(--agentic-foreground)",
                    fontSize: previewMode ? 13 : 15,
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  {transportPosition}
                </div>

                <div className="flex items-center" style={{ gap: previewMode ? 8 : 10 }}>
                  <button type="button" style={bottomIconStyle}>
                    <AudioWaveform size={20} strokeWidth={1.8} />
                  </button>
                  <button type="button" style={bottomIconStyle}>
                    <MicOff size={20} strokeWidth={1.8} />
                  </button>
                  <button type="button" style={bottomIconStyle}>
                    <SlidersHorizontal size={20} strokeWidth={1.8} />
                  </button>
                </div>
              </div>

              <div className="flex items-center" style={{ gap: previewMode ? 10 : 12 }}>
                <button
                  type="button"
                  onClick={() => seekToBeat(0)}
                  style={transportStyle}
                >
                  <SkipBack size={previewMode ? 20 : 24} strokeWidth={2.1} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!isPlaying && currentBeat >= totalBeats) {
                      seekToBeat(0);
                    }
                    setIsPlaying((prev) => !prev);
                  }}
                  style={{
                    ...transportStyle,
                    width: previewMode ? 52 : 58,
                    height: previewMode ? 52 : 58,
                    backgroundColor: "var(--agentic-marker)",
                    color: "#FFFFFF",
                    border: "none",
                  }}
                >
                  {isPlaying ? (
                    <Pause size={previewMode ? 22 : 26} strokeWidth={2.2} />
                  ) : (
                    <Play size={previewMode ? 22 : 26} strokeWidth={2.2} />
                  )}
                </button>
                <button
                  type="button"
                  style={{ ...transportStyle, color: "var(--agentic-danger)" }}
                >
                  <Circle size={previewMode ? 18 : 22} fill="currentColor" strokeWidth={2} />
                </button>
              </div>

              <div className="flex items-center" style={{ gap: previewMode ? 8 : 10 }}>
                <button
                  type="button"
                  onClick={() => setLoopEnabled((prev) => !prev)}
                  style={{
                    ...bottomPillStyle,
                    backgroundColor: loopEnabled
                      ? "rgba(59,130,246,0.16)"
                      : "var(--agentic-elevated)",
                    color: loopEnabled ? "#DBEAFE" : "var(--agentic-control-text)",
                  }}
                >
                  <Repeat size={16} strokeWidth={2} />
                  Loop
                </button>
                <button type="button" style={bottomPillStyle}>
                  {selectedTrack.name}
                </button>
                <button type="button" style={bottomPillStyle}>
                  4/4
                </button>
                <button type="button" style={bottomPillStyle}>
                  {tempo} BPM
                </button>
              </div>
            </div>
          </div>

          {showAgentPanel && (
            <aside
              className="flex shrink-0 flex-col"
              style={{
                width: 420,
                minWidth: 420,
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
                <div
                  className="flex items-center gap-2"
                  style={{ color: "var(--agentic-foreground)" }}
                >
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
                    onChange={(event) => setAgentDraft(event.target.value)}
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
      </div>
    </section>
  );
}

const toolbarIconStyle: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 12,
  border: "1px solid var(--agentic-border)",
  backgroundColor: "var(--agentic-elevated)",
  color: "var(--agentic-control-text)",
};

const trackTogglePillStyle: CSSProperties = {
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.1)",
  fontSize: 13,
  fontWeight: 700,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const trackMoreStyle: CSSProperties = {
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  backgroundColor: "rgba(255,255,255,0.06)",
  color: "var(--agentic-contrast)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const bottomIconStyle: CSSProperties = {
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

const transportStyle: CSSProperties = {
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

const bottomPillStyle: CSSProperties = {
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
