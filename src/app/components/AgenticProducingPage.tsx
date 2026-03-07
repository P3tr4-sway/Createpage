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
  ChevronDown,
  SkipBack,
  Play,
  Pause,
  Circle,
  Repeat,
  MicOff,
  SlidersHorizontal,
  AudioWaveform,
} from "lucide-react";

interface AgenticProducingPageProps {
  onBack?: () => void;
  previewMode?: boolean;
}

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

function clampBeat(beat: number, totalBeats: number) {
  const maxBeat = Math.max(totalBeats - 0.001, 0);
  return Math.min(Math.max(beat, 0), maxBeat);
}

function formatTransportPosition(
  currentBeat: number,
  beatsPerBar: number,
  totalBeats: number,
) {
  const safeBeat = clampBeat(currentBeat, totalBeats);
  const wholeBeat = Math.floor(safeBeat);
  const bar = Math.floor(wholeBeat / beatsPerBar) + 1;
  const beatInBar = (wholeBeat % beatsPerBar) + 1;
  const sixteenth = Math.floor((safeBeat - wholeBeat) * 4) + 1;
  return `${String(bar).padStart(2, "0")}.${beatInBar}.${Math.min(sixteenth, 4)}`;
}

function createUiId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

type AgentMode = "musician" | "producer";

type MusicianTargetId =
  | "ai-drummer"
  | "ai-bassist"
  | "ai-guitarist"
  | "ai-keyboardist"
  | "ai-percussionist"
  | "ai-vocalist";

type MusicianTarget = {
  id: MusicianTargetId;
  label: string;
  helper: string;
  showsLyrics: boolean;
  trackMatch: string;
};

type OverlayMenu = "target" | "mode" | null;

type ProducerMessage = {
  id: string;
  role: "user" | "agent";
  text: string;
  timestamp: string;
};

type QueueStatus = "Generating" | "Queued" | "Ready";

type AudioQueueItem = {
  id: string;
  title: string;
  owner: string;
  status: QueueStatus;
  detail: string;
  progress: string;
};

type GenerationHistoryItem = {
  id: string;
  title: string;
  owner: string;
  meta: string;
  timestamp: string;
};

const musicianTargets: MusicianTarget[] = [
  {
    id: "ai-drummer",
    label: "AI Drummer",
    helper: "Pocket, fills, and momentum",
    showsLyrics: false,
    trackMatch: "drums",
  },
  {
    id: "ai-bassist",
    label: "AI Bassist",
    helper: "Low-end pulse and movement",
    showsLyrics: false,
    trackMatch: "bass",
  },
  {
    id: "ai-guitarist",
    label: "AI Guitarist",
    helper: "Comping, voicings, and texture",
    showsLyrics: false,
    trackMatch: "guitar",
  },
  {
    id: "ai-keyboardist",
    label: "AI Keyboardist",
    helper: "Keys, harmony pads, and glue",
    showsLyrics: false,
    trackMatch: "keys",
  },
  {
    id: "ai-percussionist",
    label: "AI Percussionist",
    helper: "Perc layers and groove detail",
    showsLyrics: false,
    trackMatch: "perc",
  },
  {
    id: "ai-vocalist",
    label: "AI Vocalist",
    helper: "Topline, phrasing, and hooks",
    showsLyrics: true,
    trackMatch: "vocal",
  },
];

const agentModeOptions: Array<{
  id: AgentMode;
  label: string;
}> = [
  {
    id: "musician",
    label: "AI Musician",
  },
  {
    id: "producer",
    label: "AI Producer",
  },
];

const initialProducerMessages: ProducerMessage[] = [
  {
    id: "producer-intro",
    role: "agent",
    text: "Tell me the section, mood, or next move. I will turn it into a concrete pass and route it to the right AI musician.",
    timestamp: "Ready",
  },
];

const initialAudioQueue: AudioQueueItem[] = [
  {
    id: "queue-vocal-hook",
    title: "Hook doubles",
    owner: "AI Vocalist",
    status: "Generating",
    detail: "Neo Soul • Bars 9-16",
    progress: "Rendering topline timing",
  },
  {
    id: "queue-bass-pocket",
    title: "Verse pocket",
    owner: "AI Bassist",
    status: "Queued",
    detail: "Neo Soul • Bars 1-8",
    progress: "Waiting for lane handoff",
  },
  {
    id: "queue-drum-variation",
    title: "Lift fill",
    owner: "AI Drummer",
    status: "Ready",
    detail: "House • Bars 17-20",
    progress: "Ready to audition",
  },
];

const initialGenerationHistory: GenerationHistoryItem[] = [
  {
    id: "history-drum-pocket",
    title: "Main pocket",
    owner: "AI Drummer",
    meta: "Neo Soul • Drums",
    timestamp: "2 min ago",
  },
  {
    id: "history-guitar-comp",
    title: "Muted comp",
    owner: "AI Guitarist",
    meta: "Indie Pop • Guitar",
    timestamp: "12 min ago",
  },
  {
    id: "history-producer-brief",
    title: "Session brief",
    owner: "AI Producer",
    meta: "Structure + cue sheet",
    timestamp: "18 min ago",
  },
];

export function AgenticProducingPage({
  onBack,
  previewMode = false,
}: AgenticProducingPageProps) {
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
  const [agentMode, setAgentMode] = useState<AgentMode>("musician");
  const [openOverlayMenu, setOpenOverlayMenu] = useState<OverlayMenu>(null);
  const [musicianTargetId, setMusicianTargetId] =
    useState<MusicianTargetId>("ai-drummer");
  const [styleDraft, setStyleDraft] = useState("");
  const [lyricsDraft, setLyricsDraft] = useState(
    "Falling through the city lights, give me a slow-burn chorus with space.",
  );
  const [producerDraft, setProducerDraft] = useState("");
  const [producerWorkspaceOpen, setProducerWorkspaceOpen] = useState(false);
  const [producerMessages, setProducerMessages] =
    useState<ProducerMessage[]>(initialProducerMessages);
  const [audioQueue, setAudioQueue] = useState<AudioQueueItem[]>(initialAudioQueue);
  const [generationHistory, setGenerationHistory] =
    useState<GenerationHistoryItem[]>(initialGenerationHistory);

  const timelinePaneRef = useRef<HTMLDivElement | null>(null);
  const timelineBodyRef = useRef<HTMLDivElement | null>(null);
  const overlayDockRef = useRef<HTMLDivElement | null>(null);

  const showAgentOverlay = !previewMode;
  const showProjectTitle = !previewMode;
  const showBackButton = !previewMode && typeof onBack === "function";
  const trackPanelWidth = previewMode ? 282 : 356;
  const arrangementHeaderHeight = previewMode ? 44 : 58;
  const trackRowHeight = previewMode ? 76 : 92;
  const bottomTransportHeight = previewMode ? 72 : 94;
  const pixelsPerBeat = previewMode ? 26 : 36;
  const timelineLeadingInset = previewMode ? 20 : 36;
  const timelineTrailingInset = previewMode ? 52 : 72;
  const beatsPerBar = 4;
  const totalBars = 24;
  const tempo = 65;
  const totalBeats = totalBars * beatsPerBar;
  const maxTimelineBeat = Math.max(totalBeats - 0.001, 0);
  const barWidth = beatsPerBar * pixelsPerBeat;
  const timelineGridWidth = totalBeats * pixelsPerBeat;
  const timelineContentWidth =
    timelineLeadingInset + timelineGridWidth + timelineTrailingInset;
  const playheadViewportX =
    timelineLeadingInset + currentBeat * pixelsPerBeat - scrollLeft;
  const selectedTrack = tracks.find((track) => track.id === selectedTrackId) ?? tracks[0];
  const selectedMusicianTarget =
    musicianTargets.find((target) => target.id === musicianTargetId) ?? musicianTargets[0];
  const selectedStyle = styleDraft.trim() || "Freeform";
  const producerWorkspaceVisible = showAgentOverlay && agentMode === "producer" && producerWorkspaceOpen;

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!overlayDockRef.current) return;
      if (!overlayDockRef.current.contains(event.target as Node)) {
        setOpenOverlayMenu(null);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const pushQueueItem = (item: AudioQueueItem) => {
    setAudioQueue((prev) => [item, ...prev].slice(0, 6));
  };

  const pushHistoryItem = (item: GenerationHistoryItem) => {
    setGenerationHistory((prev) => [item, ...prev].slice(0, 8));
  };

  const selectAgentMode = (nextMode: AgentMode) => {
    setAgentMode(nextMode);
    setOpenOverlayMenu(null);
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

  const deleteTrack = (trackId: string) => {
    setTracks((prev) => {
      if (prev.length <= 1) return prev;
      const deletedIndex = prev.findIndex((track) => track.id === trackId);
      const nextTracks = prev.filter((track) => track.id !== trackId);
      const fallbackTrack =
        nextTracks[Math.min(deletedIndex, nextTracks.length - 1)] ?? nextTracks[0];
      setSelectedTrackId((current) => (current === trackId ? fallbackTrack.id : current));
      return nextTracks;
    });
    setMutedTrackIds((prev) => prev.filter((id) => id !== trackId));
    setSoloTrackIds((prev) => prev.filter((id) => id !== trackId));
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

  const handleMusicianGenerate = () => {
    setOpenOverlayMenu(null);

    const targetTrack = tracks.find((track) =>
      track.name.toLowerCase().includes(selectedMusicianTarget.trackMatch),
    );

    if (targetTrack) {
      setSelectedTrackId(targetTrack.id);
    }

    pushQueueItem({
      id: createUiId("queue"),
      title: `${selectedMusicianTarget.label} pass`,
      owner: selectedMusicianTarget.label,
      status: "Generating",
      detail: `${selectedStyle} • ${targetTrack?.name ?? selectedTrack.name}`,
      progress: selectedMusicianTarget.showsLyrics
        ? "Shaping topline + lyric cadence"
        : "Rendering arrangement take",
    });

    pushHistoryItem({
      id: createUiId("history"),
      title: `${selectedMusicianTarget.label} pass`,
      owner: selectedMusicianTarget.label,
      meta: selectedMusicianTarget.showsLyrics
        ? `${selectedStyle} • lyric-guided draft`
        : `${selectedStyle} • instrumental pass`,
      timestamp: "Just now",
    });
  };

  const handleProducerSubmit = () => {
    const nextDraft = producerDraft.trim();
    if (!nextDraft) return;

    setOpenOverlayMenu(null);
    setProducerWorkspaceOpen(true);

    setProducerMessages((prev) => [
      ...prev,
      {
        id: createUiId("message"),
        role: "user",
        text: nextDraft,
        timestamp: "Just now",
      },
      {
        id: createUiId("message"),
        role: "agent",
        text: `Locked. I am shaping this into a ${selectedStyle} direction and sending the next pass to ${selectedMusicianTarget.label}. Queue and recent outputs stay visible on the right.`,
        timestamp: "Just now",
      },
    ]);

    pushQueueItem({
      id: createUiId("queue"),
      title: "Producer brief",
      owner: "AI Producer",
      status: "Generating",
      detail: `${selectedStyle} • Session direction`,
      progress: "Dispatching tasks to AI musicians",
    });

    pushHistoryItem({
      id: createUiId("history"),
      title: "Producer brief",
      owner: "AI Producer",
      meta: `${selectedStyle} • chat-directed`,
      timestamp: "Just now",
    });

    setProducerDraft("");
  };

  const seekToBeat = (nextBeat: number) => {
    setCurrentBeat(clampBeat(nextBeat, totalBeats));
  };

  const seekFromClientX = (clientX: number) => {
    const pane = timelinePaneRef.current;
    if (!pane) return;
    const bounds = pane.getBoundingClientRect();
    const localX = clientX - bounds.left + scrollLeft - timelineLeadingInset;
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
          return loopEnabled ? nextBeat % totalBeats : maxTimelineBeat;
        }
        return nextBeat;
      });

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [isPlaying, loopEnabled, maxTimelineBeat, tempo, totalBeats]);

  useEffect(() => {
    if (isPlaying && !loopEnabled && currentBeat >= maxTimelineBeat) {
      setIsPlaying(false);
    }
  }, [currentBeat, isPlaying, loopEnabled, maxTimelineBeat]);

  useEffect(() => {
    const timelineBody = timelineBodyRef.current;
    if (!timelineBody) return;

    const markerX = timelineLeadingInset + currentBeat * pixelsPerBeat;
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
  }, [currentBeat, pixelsPerBeat, timelineContentWidth, timelineLeadingInset]);

  const transportPosition = formatTransportPosition(
    currentBeat,
    beatsPerBar,
    totalBeats,
  );

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
                aria-label="Close DAW"
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
                aria-label="Undo"
                className="tablet-icon-target tablet-pressable inline-flex items-center justify-center"
                style={toolbarIconStyle}
              >
                <Undo2 size={16} strokeWidth={1.8} />
              </button>
              <button
                type="button"
                aria-label="Import audio"
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
          <div className="relative flex min-w-0 flex-1 flex-col">
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
                        color: "var(--agentic-muted)",
                        fontSize: previewMode ? 11 : 12,
                      }}
                    >
                      {totalBars} bars • {tempo} BPM • {tracks.length} tracks
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addTrack}
                    aria-label="Add track"
                    className="tablet-touch-target tablet-pressable inline-flex items-center justify-center"
                    style={{
                      width: previewMode ? 28 : 32,
                      height: previewMode ? 28 : 32,
                      borderRadius: 10,
                      border: "none",
                      backgroundColor: "transparent",
                      color: "var(--agentic-contrast)",
                    }}
                  >
                    <Plus size={previewMode ? 14 : 16} strokeWidth={2.2} />
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
                                width: 10,
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
                                className="flex items-center"
                                style={{
                                  gap: 8,
                                  marginTop: 6,
                                  fontSize: previewMode ? 11 : 12,
                                }}
                              >
                                <span
                                  style={{
                                    color: "rgba(226,232,240,0.9)",
                                    fontWeight: 600,
                                  }}
                                >
                                  {track.role}
                                </span>
                                <span
                                  style={{
                                    width: 4,
                                    height: 4,
                                    borderRadius: 999,
                                    backgroundColor: "rgba(148,163,184,0.7)",
                                  }}
                                />
                                <span
                                  style={{
                                    color: "rgba(148,163,184,0.95)",
                                    fontWeight: 500,
                                  }}
                                >
                                  {track.level}
                                </span>
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
                              aria-label={`${isMuted ? "Unmute" : "Mute"} ${track.name}`}
                              style={{
                                ...trackTogglePillStyle,
                                width: 44,
                                height: 44,
                                backgroundColor: isMuted
                                  ? "rgba(239, 68, 68, 0.22)"
                                  : "rgba(255,255,255,0.06)",
                                color: isMuted
                                  ? "#FCA5A5"
                                  : "var(--agentic-contrast)",
                              }}
                            >
                              M
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleSolo(track.id)}
                              aria-label={`${isSolo ? "Disable solo for" : "Solo"} ${track.name}`}
                              style={{
                                ...trackTogglePillStyle,
                                width: 44,
                                height: 44,
                                backgroundColor: isSolo
                                  ? "rgba(250, 204, 21, 0.24)"
                                  : "rgba(255,255,255,0.06)",
                                color: isSolo
                                  ? "#FDE68A"
                                  : "var(--agentic-contrast)",
                              }}
                            >
                              S
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
                    className="relative flex h-full items-stretch"
                    style={{
                      width: timelineContentWidth,
                      paddingLeft: timelineLeadingInset,
                      paddingRight: timelineTrailingInset,
                      transform: `translateX(-${scrollLeft}px)`,
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: timelineLeadingInset,
                        top: 0,
                        bottom: 0,
                        width: 1,
                        backgroundColor: "var(--agentic-border-strong)",
                        zIndex: 1,
                      }}
                    />
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
                              left: previewMode ? 10 : 14,
                              top: previewMode ? 9 : 13,
                              zIndex: 2,
                              color: "rgba(226,232,240,0.78)",
                              fontSize: previewMode ? 12 : 15,
                              fontWeight: 600,
                              textShadow: "0 1px 0 rgba(0,0,0,0.3)",
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
                                top: previewMode ? 20 : 24,
                                bottom: previewMode ? 7 : 9,
                                width: 1,
                                backgroundColor: "rgba(255,255,255,0.09)",
                              }}
                            />
                          ))}
                          <span
                            style={{
                              position: "absolute",
                              left: 0,
                              right: 0,
                              bottom: 0,
                              height: 1,
                              backgroundColor: "rgba(255,255,255,0.08)",
                            }}
                          />
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
                            backgroundPosition: `${timelineLeadingInset}px 0, ${timelineLeadingInset}px 0`,
                          }}
                          onPointerDown={handleSeekPointerDown}
                        >
                          <span
                            aria-hidden="true"
                            style={{
                              position: "absolute",
                              left: timelineLeadingInset,
                              top: 0,
                              bottom: 0,
                              width: 1,
                              backgroundColor: "rgba(255,255,255,0.16)",
                              zIndex: 1,
                            }}
                          />
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
                                left:
                                  timelineLeadingInset +
                                  clip.startBeat * pixelsPerBeat +
                                  4,
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
                      width: 44,
                      transform: "translateX(-22px)",
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
                        top: previewMode ? 8 : 10,
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
                        left: 4,
                        top: previewMode ? 1 : 2,
                        width: 12,
                        height: previewMode ? 12 : 14,
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
                  <button type="button" style={bottomIconStyle} aria-label="Waveform tools">
                    <AudioWaveform size={20} strokeWidth={1.8} />
                  </button>
                  <button type="button" style={bottomIconStyle} aria-label="Microphone monitor">
                    <MicOff size={20} strokeWidth={1.8} />
                  </button>
                  <button type="button" style={bottomIconStyle} aria-label="Mixer controls">
                    <SlidersHorizontal size={20} strokeWidth={1.8} />
                  </button>
                </div>
              </div>

              <div className="flex items-center" style={{ gap: previewMode ? 10 : 12 }}>
                <button
                  type="button"
                  onClick={() => seekToBeat(0)}
                  aria-label="Return to start"
                  style={transportStyle}
                >
                  <SkipBack size={previewMode ? 20 : 24} strokeWidth={2.1} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!isPlaying && currentBeat >= maxTimelineBeat) {
                      seekToBeat(0);
                    }
                    setIsPlaying((prev) => !prev);
                  }}
                  aria-label={isPlaying ? "Pause playback" : "Start playback"}
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
                  aria-label="Record"
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

          {showAgentOverlay ? (
            <>
              <div style={overlayDockShellStyle(bottomTransportHeight)}>
                {producerWorkspaceVisible ? (
                  <div style={producerWorkspacePopoverStyle}>
                    <div style={{ height: "100%", pointerEvents: "auto" }}>
                      <ProducerWorkspacePanel
                        messages={producerMessages}
                        audioQueue={audioQueue}
                        generationHistory={generationHistory}
                        onClose={() => setProducerWorkspaceOpen(false)}
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
                      targets={musicianTargets}
                      selectedTarget={selectedMusicianTarget}
                      styleDraft={styleDraft}
                      lyricsDraft={lyricsDraft}
                      onTargetToggle={() =>
                        setOpenOverlayMenu((prev) => (prev === "target" ? null : "target"))
                      }
                      onModeToggle={() =>
                        setOpenOverlayMenu((prev) => (prev === "mode" ? null : "mode"))
                      }
                      onSelectTarget={(targetId) => {
                        setMusicianTargetId(targetId);
                        setOpenOverlayMenu(null);
                      }}
                      onStyleChange={setStyleDraft}
                      onLyricsChange={setLyricsDraft}
                      onGenerate={handleMusicianGenerate}
                      onSelectMode={selectAgentMode}
                      currentMode={agentMode}
                    />
                  ) : (
                    <ProducerComposerBar
                      draft={producerDraft}
                      workspaceOpen={producerWorkspaceOpen}
                      openMenu={openOverlayMenu}
                      onDraftChange={setProducerDraft}
                      onDraftSubmit={handleProducerSubmit}
                      onOpenWorkspace={() => {
                        setOpenOverlayMenu(null);
                        setProducerWorkspaceOpen(true);
                      }}
                      onModeToggle={() =>
                        setOpenOverlayMenu((prev) => (prev === "mode" ? null : "mode"))
                      }
                      onSelectMode={selectAgentMode}
                      currentMode={agentMode}
                    />
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
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
  return (
    <div className="flex-1" style={overlayBarStyle}>
      <div className="flex items-center" style={{ gap: 14 }}>
        <div className="flex items-center" style={{ flex: "1 1 auto", gap: 14, minWidth: 0 }}>
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
              <span style={overlayFieldLabelStyle}>AI Musician</span>
              <span style={overlayFieldValueStyle}>{selectedTarget.label}</span>
            </span>
            <ChevronDown size={18} strokeWidth={2} />
          </button>

          {openMenu === "target" ? (
            <div style={overlayMenuStyle}>
              <div style={overlayMenuTitleStyle}>Choose AI Musician</div>
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
                      backgroundColor: isActive ? "var(--soft-surface-strong)" : "transparent",
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
            <label style={{ ...overlayLyricsFieldStyle, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span style={overlayFieldLabelStyle}>Style</span>
              <input
                type="text"
                value={styleDraft}
                onChange={(event) => onStyleChange(event.target.value)}
                placeholder="Enter a style"
                className="min-w-0 bg-transparent outline-none"
                style={overlayTextFieldInputStyle}
              />
            </label>
          </div>

          {selectedTarget.showsLyrics ? (
            <label style={{ ...overlayFieldWrapStyle, ...overlayLyricsFieldStyle, flex: "1 1 320px" }}>
              <span style={overlayFieldLabelStyle}>Lyrics</span>
              <textarea
                value={lyricsDraft}
                onChange={(event) => onLyricsChange(event.target.value)}
                rows={1}
                placeholder="Shape the topline or paste a hook..."
                style={overlayLyricsInputStyle}
              />
            </label>
          ) : null}
        </div>

        <div className="flex items-center" style={{ gap: 10, flex: "0 0 auto" }}>
          <button type="button" onClick={onGenerate} style={generateButtonStyle}>
            Generate
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
  workspaceOpen: boolean;
  openMenu: OverlayMenu;
  currentMode: AgentMode;
  onDraftChange: (value: string) => void;
  onDraftSubmit: () => void;
  onOpenWorkspace: () => void;
  onModeToggle: () => void;
  onSelectMode: (mode: AgentMode) => void;
}

function ProducerComposerBar({
  draft,
  workspaceOpen,
  openMenu,
  currentMode,
  onDraftChange,
  onDraftSubmit,
  onOpenWorkspace,
  onModeToggle,
  onSelectMode,
}: ProducerComposerBarProps) {
  return (
    <div className="flex-1" style={overlayBarStyle}>
      <div className="flex items-center" style={{ gap: 12 }}>
        <div className="flex-1" style={producerInputShellStyle}>
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
            placeholder="Start with your AI Music Producer."
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[var(--secondary)]"
            style={producerInputStyle}
          />
        </div>

        <button
          type="button"
          onClick={onOpenWorkspace}
          style={producerWorkspaceButtonStyle}
          aria-label="Open AI Producer workspace"
        >
          <AudioWaveform size={18} strokeWidth={2} />
        </button>

        <button type="button" onClick={onDraftSubmit} style={generateButtonStyle}>
          {workspaceOpen ? "Send" : "Start"}
        </button>

        <ModeToggleButton
          open={openMenu === "mode"}
          currentMode={currentMode}
          onToggle={onModeToggle}
          onSelectMode={onSelectMode}
        />
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
  const currentModeLabel =
    agentModeOptions.find((mode) => mode.id === currentMode)?.label ?? "AI Musician";
  const nextMode = currentMode === "musician" ? "producer" : "musician";
  const nextModeLabel =
    agentModeOptions.find((mode) => mode.id === nextMode)?.label ?? "AI Producer";

  return (
    <div style={{ position: "relative", flex: "0 0 auto" }}>
      <button
        type="button"
        onClick={onToggle}
        style={modeToggleButtonStyle}
        aria-label={`Current mode ${currentModeLabel}. Open switcher.`}
      >
        {currentModeLabel}
      </button>

      {open ? (
        <div style={{ ...overlayMenuStyle, left: 0, right: 0, width: "100%", minWidth: 0 }}>
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
  return (
    <div style={producerPanelStyle}>
      <div className="flex items-center justify-between" style={producerPanelHeaderStyle}>
        <div>
          <div style={producerPanelEyebrowStyle}>AI Producer</div>
          <div style={producerPanelTitleStyle}>Shape the next move for this session.</div>
        </div>

        <button type="button" onClick={onClose} style={producerPanelCloseStyle} aria-label="Close AI Producer workspace">
          <X size={18} strokeWidth={2} />
        </button>
      </div>

      <div
        className="flex min-h-0 flex-1"
        style={{ gap: 16, padding: 16, flexWrap: "nowrap", overflow: "hidden" }}
      >
        <div style={producerChatCardStyle}>
          <div style={producerSectionHeaderStyle}>
            <div style={producerSectionEyebrowStyle}>Conversation</div>
            <div style={producerSectionMetaStyle}>Direction, notes, and next actions</div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto" style={producerMessagesWrapStyle}>
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
                        ...(isUser ? producerUserBubbleStyle : producerAgentBubbleStyle),
                        maxWidth: "82%",
                      }}
                    >
                      <div>{message.text}</div>
                      <div style={producerMessageTimestampStyle}>{message.timestamp}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className="flex min-h-0 flex-col"
          style={{ flex: "0 0 320px", width: "min(320px, 100%)", gap: 16, overflowY: "auto" }}
        >
          <div style={producerRailCardStyle}>
            <div style={producerSectionHeaderStyle}>
              <div style={producerSectionEyebrowStyle}>Render Queue</div>
              <div style={producerSectionMetaStyle}>Active and queued generations</div>
            </div>

            <div className="flex flex-col overflow-y-auto" style={{ gap: 10 }}>
              {audioQueue.map((item) => (
                <div key={item.id} style={producerListItemStyle}>
                  <div className="flex items-start justify-between" style={{ gap: 12 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={producerListItemTitleStyle}>{item.title}</div>
                      <div style={producerListItemMetaStyle}>
                        {item.owner} • {item.detail}
                      </div>
                    </div>
                    <span style={queueStatusBadgeStyle(item.status)}>{item.status}</span>
                  </div>
                  <div style={producerListItemSubtleStyle}>{item.progress}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={producerRailCardStyle}>
            <div style={producerSectionHeaderStyle}>
              <div style={producerSectionEyebrowStyle}>Recent Passes</div>
              <div style={producerSectionMetaStyle}>Latest outputs and handoffs</div>
            </div>

            <div className="flex flex-col overflow-y-auto" style={{ gap: 10 }}>
              {generationHistory.map((item) => (
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
        </div>
      </div>
    </div>
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
  cursor: "pointer",
};

const trackMoreStyle: CSSProperties = {
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  backgroundColor: "rgba(255,255,255,0.06)",
  color: "var(--agentic-contrast)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
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
  cursor: "pointer",
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
  cursor: "pointer",
};

const bottomPillStyle: CSSProperties = {
  minWidth: 44,
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
  cursor: "pointer",
};

const overlayDockShellStyle = (bottomTransportHeight: number): CSSProperties => ({
  position: "absolute",
  left: "50%",
  bottom: bottomTransportHeight + 18,
  transform: "translateX(-50%)",
  width: "min(1120px, calc(100% - 56px))",
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

const overlayBarStyle: CSSProperties = {
  minHeight: 80,
  borderRadius: 9999,
  border: "1px solid var(--border)",
  backgroundColor: "var(--card)",
  boxShadow: "0 10px 28px rgba(15,23,42,0.08)",
  padding: "12px",
};

const overlayFieldWrapStyle: CSSProperties = {
  minWidth: 0,
};

const overlayFieldButtonStyle: CSSProperties = {
  width: "100%",
  minHeight: 56,
  padding: "0 18px",
  borderRadius: 9999,
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
  borderRadius: 9999,
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

const producerInputShellStyle: CSSProperties = {
  minHeight: 56,
  display: "flex",
  alignItems: "center",
  padding: "0 12px 0 10px",
};

const producerInputStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  border: "none",
  padding: 0,
  background: "transparent",
  color: "var(--foreground)",
  fontSize: 18,
  fontWeight: 500,
};

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
  borderRadius: 9999,
  cursor: "pointer",
};

const producerWorkspaceButtonStyle: CSSProperties = {
  width: 56,
  height: 56,
  border: "1px solid var(--border)",
  backgroundColor: "var(--soft-surface)",
  color: "var(--foreground)",
  borderRadius: 18,
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
  borderRadius: 9999,
  cursor: "pointer",
};

const overlayMenuStyle: CSSProperties = {
  position: "absolute",
  left: 0,
  bottom: "calc(100% + 12px)",
  width: "100%",
  minWidth: 220,
  borderRadius: 24,
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
  borderRadius: 16,
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
};

const overlayMenuMetaStyle: CSSProperties = {
  display: "block",
  marginTop: 3,
  color: "var(--muted-foreground)",
  fontSize: 12,
  fontWeight: 500,
  lineHeight: 1.35,
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
  borderRadius: 9999,
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
