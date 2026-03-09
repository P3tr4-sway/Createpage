import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useMemo,
  useRef,
} from "react";
import {
  X,
  Undo2,
  Upload,
  Save,
  Plus,
  SkipBack,
  Play,
  Pause,
  Circle,
  Repeat,
  MicOff,
  SlidersHorizontal,
  AudioWaveform,
  Drum,
} from "lucide-react";
import { Slider } from "@/app/components/ui/slider";
import { AgenticOverlayDock } from "@/features/entrance/components/AgenticOverlayDock";
import { useEntranceLocale } from "@/features/entrance/EntranceLocaleContext";
import { agenticCopyByLocale } from "@/features/entrance/i18n/agentic.copy";
import {
  getInitialTracksForLocale,
  getMusicianTargetsForLocale,
} from "@/features/entrance/model/agentic.mock";
import type { ArrangementTrack } from "@/features/entrance/model/agentic.types";
import { useAgenticOverlayController } from "@/features/entrance/pages/agentic/useAgenticOverlayController";
import { useAgenticTimelineController } from "@/features/entrance/pages/agentic/useAgenticTimelineController";
import { useAgenticSessionState } from "@/features/entrance/state/useAgenticSessionState";

interface AgenticProducingPageProps {
  onBack?: () => void;
  previewMode?: boolean;
  projectTitle?: string;
  showAgentOverlay?: boolean;
  allowAddTrack?: boolean;
  initialTracks?: ArrangementTrack[];
}
export function AgenticProducingPage({
  onBack,
  previewMode = false,
  projectTitle,
  showAgentOverlay: showAgentOverlayProp,
  allowAddTrack = true,
  initialTracks,
}: AgenticProducingPageProps) {
  const locale = useEntranceLocale();
  const copy = agenticCopyByLocale[locale];
  const localizedTargets = getMusicianTargetsForLocale(locale);
  const resolvedInitialTracks = useMemo(
    () => initialTracks ?? getInitialTracksForLocale(locale),
    [initialTracks, locale],
  );
  const {
    tracks,
    selectedTrackId,
    setSelectedTrackId,
    mutedTrackIds,
    soloTrackIds,
    isPlaying,
    setIsPlaying,
    loopEnabled,
    setLoopEnabled,
    currentBeat,
    setCurrentBeat,
    scrollLeft,
    setScrollLeft,
    scrollTop,
    setScrollTop,
    isDraggingPlayhead,
    setIsDraggingPlayhead,
    agentMode,
    openOverlayMenu,
    setOpenOverlayMenu,
    musicianTargetId,
    setMusicianTargetId,
    styleDraft,
    setStyleDraft,
    lyricsDraft,
    setLyricsDraft,
    producerDraft,
    setProducerDraft,
    producerWorkspaceOpen,
    setProducerWorkspaceOpen,
    producerMessages,
    setProducerMessages,
    audioQueue,
    generationHistory,
    pushQueueItem,
    pushHistoryItem,
    selectAgentMode,
    updateTrackVolume,
    updateTrackPan,
    addTrack,
    toggleMuted,
    toggleSolo,
  } = useAgenticSessionState({
    locale,
    defaultLyricsDraft: copy.defaultLyricsDraft,
    trackName: copy.trackName,
    ideaLane: copy.ideaLane,
    initialTracks: resolvedInitialTracks,
  });

  const showAgentOverlay = showAgentOverlayProp ?? !previewMode;
  const showProjectTitle = !previewMode;
  const showBackButton = !previewMode && typeof onBack === "function";
  const pageTitle = projectTitle ?? copy.projectTitle;
  const selectedTrack = tracks.find((track) => track.id === selectedTrackId) ?? tracks[0];
  const selectedMusicianTarget =
    localizedTargets.find((target) => target.id === musicianTargetId) ?? localizedTargets[0];
  const selectedStyle = styleDraft.trim() || copy.selectedStyleFallback;
  const producerWorkspaceVisible = showAgentOverlay && agentMode === "producer" && producerWorkspaceOpen;
  const {
    handlePlayheadPointerDown,
    handleSeekPointerDown,
    handleTimelineScroll,
    metrics,
    previewRootRef,
    seekToBeat,
    timelineBodyRef,
    timelinePaneRef,
    transportPosition,
  } = useAgenticTimelineController({
    currentBeat,
    isDraggingPlayhead,
    isPlaying,
    loopEnabled,
    previewMode,
    scrollLeft,
    setCurrentBeat,
    setIsDraggingPlayhead,
    setIsPlaying,
    setScrollLeft,
    setScrollTop,
  });
  const {
    handleMusicianGenerate,
    handleProducerSubmit,
    openProducerWorkspace,
    overlayDockRef,
  } = useAgenticOverlayController({
    copy,
    producerDraft,
    pushHistoryItem,
    pushQueueItem,
    selectedMusicianTarget,
    selectedStyle,
    selectedTrack,
    setOpenOverlayMenu,
    setProducerDraft,
    setProducerMessages,
    setProducerWorkspaceOpen,
    setSelectedTrackId,
    tracks,
  });

  return (
    <section
      ref={previewRootRef}
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
                aria-label={copy.closeDaw}
                className="tablet-icon-target tablet-pressable inline-flex items-center justify-center"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--radius-control)",
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
                  {pageTitle}
                </h2>
              ) : (
                <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={copy.undo}
                className="tablet-icon-target tablet-pressable inline-flex items-center justify-center"
                style={toolbarIconStyle}
              >
                <Undo2 size={16} strokeWidth={1.8} />
              </button>
              <button
                type="button"
                aria-label={copy.importAudio}
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
                  borderRadius: "var(--radius-pill)",
                  border: "1px solid var(--agentic-border)",
                  color: "var(--background)",
                  backgroundColor: "var(--foreground)",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                <Save size={14} strokeWidth={1.9} />
                {copy.save}
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
                  width: metrics.trackPanelWidth,
                  borderRight: "1px solid var(--agentic-border-strong)",
                  background:
                    "linear-gradient(180deg, rgba(10,12,17,0.92), rgba(19,24,33,0.92))",
                }}
              >
                <div
                  className="flex items-center justify-between"
                  style={{
                    height: metrics.arrangementHeaderHeight,
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
                      {metrics.totalBars} {copy.barsUnit} • {metrics.tempo} BPM • {tracks.length} {copy.tracksUnit}
                    </div>
                  </div>

                  {allowAddTrack ? (
                    <button
                      type="button"
                      onClick={addTrack}
                      aria-label={copy.addTrack}
                      className="tablet-touch-target tablet-pressable inline-flex items-center justify-center"
                      style={{
                        width: previewMode ? 28 : 32,
                        height: previewMode ? 28 : 32,
                        borderRadius: "var(--radius-control)",
                        border: "none",
                        backgroundColor: "transparent",
                        color: "var(--agentic-contrast)",
                      }}
                    >
                      <Plus size={previewMode ? 14 : 16} strokeWidth={2.2} />
                    </button>
                  ) : (
                    <div style={{ width: previewMode ? 28 : 32, height: previewMode ? 28 : 32 }} />
                  )}
                </div>

                <div className="min-h-0 flex-1 overflow-hidden">
                  <div style={{ transform: `translateY(-${scrollTop}px)` }}>
                    {tracks.map((track) => {
                      const isSelected = track.id === selectedTrackId;
                      const isMuted = mutedTrackIds.includes(track.id);
                      const isSolo = soloTrackIds.includes(track.id);
                      const trackNumber = tracks.findIndex((item) => item.id === track.id) + 1;

                      return (
                        <div
                          key={track.id}
                          className="flex items-center"
                          style={{
                            height: metrics.trackRowHeight,
                            padding: previewMode ? "12px 12px" : "14px 16px",
                            borderBottom: "1px solid rgba(255,255,255,0.08)",
                            background:
                              isSelected
                                ? "linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.04))"
                                : "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
                            boxShadow: isSelected
                              ? "inset 0 1px 0 rgba(255,255,255,0.08)"
                              : "none",
                          }}
                        >
                          <div className="min-w-0 flex-1">
                            <button
                              type="button"
                              onClick={() => setSelectedTrackId(track.id)}
                              className="flex w-full min-w-0 items-center gap-3 text-left"
                              style={{
                                background: "transparent",
                                border: "none",
                                padding: 0,
                                color: "inherit",
                              }}
                            >
                              <span
                                style={{
                                  width: previewMode ? 18 : 20,
                                  color: "rgba(255,255,255,0.52)",
                                  fontSize: previewMode ? 13 : 14,
                                  fontWeight: 600,
                                  letterSpacing: "0.08em",
                                  textAlign: "center",
                                }}
                              >
                                {trackNumber}
                              </span>
                              <span
                                className="inline-flex items-center justify-center"
                                style={{
                                  width: previewMode ? 18 : 20,
                                  height: previewMode ? 18 : 20,
                                  color: "rgba(255,255,255,0.96)",
                                  flexShrink: 0,
                                }}
                              >
                                <TrackIcon track={track} previewMode={previewMode} />
                              </span>
                              <span
                                className="min-w-0 flex-1"
                                style={{
                                  color: "rgba(255,255,255,0.96)",
                                  fontSize: previewMode ? 15 : 17,
                                  fontWeight: 600,
                                  letterSpacing: "-0.01em",
                                  lineHeight: 1.15,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {track.name}
                              </span>
                            </button>

                            <div
                              className="mt-4 flex items-center"
                              style={{ gap: previewMode ? 8 : 10 }}
                            >
                              <button
                                type="button"
                                onClick={() => toggleMuted(track.id)}
                                aria-label={`${isMuted ? copy.unmute : copy.mute} ${track.name}`}
                                style={{
                                  ...trackTogglePillStyle,
                                  width: previewMode ? 34 : 38,
                                  height: previewMode ? 30 : 32,
                                  backgroundColor: isMuted
                                    ? "rgba(255,255,255,0.92)"
                                    : "rgba(0,0,0,0.44)",
                                  border: "1px solid rgba(255,255,255,0.18)",
                                  color: isMuted ? "#111111" : "rgba(255,255,255,0.88)",
                                }}
                              >
                                M
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleSolo(track.id)}
                                aria-label={`${isSolo ? copy.disableSolo : copy.solo} ${track.name}`}
                                style={{
                                  ...trackTogglePillStyle,
                                  width: previewMode ? 34 : 38,
                                  height: previewMode ? 30 : 32,
                                  backgroundColor: isSolo
                                    ? "rgba(255,255,255,0.92)"
                                    : "rgba(0,0,0,0.44)",
                                  border: "1px solid rgba(255,255,255,0.18)",
                                  color: isSolo ? "#111111" : "rgba(255,255,255,0.88)",
                                }}
                              >
                                S
                              </button>

                              <div className="min-w-0 flex-1">
                                <div
                                  className="flex items-center justify-between"
                                  style={{
                                    marginBottom: 6,
                                    paddingInline: 2,
                                  }}
                                >
                                  <span
                                    style={{
                                      color: "rgba(255,255,255,0.64)",
                                      fontSize: previewMode ? 9 : 10,
                                      fontWeight: 700,
                                      letterSpacing: "0.08em",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    {copy.volume}
                                  </span>
                                  <span
                                    style={{
                                      color: "rgba(255,255,255,0.74)",
                                      fontSize: previewMode ? 10 : 11,
                                      fontWeight: 600,
                                    }}
                                  >
                                    {Math.round(track.volume)}
                                  </span>
                                </div>
                                <Slider
                                  min={0}
                                  max={100}
                                  step={1}
                                  value={[track.volume]}
                                  aria-label={`${copy.volume} ${track.name}`}
                                  onDoubleClick={() =>
                                    updateTrackVolume(track.id, track.defaultVolume)
                                  }
                                  onValueChange={(values) =>
                                    updateTrackVolume(track.id, values[0] ?? track.volume)
                                  }
                                  className="w-full [&_[data-slot=slider-track]]:h-6 [&_[data-slot=slider-track]]:rounded-full [&_[data-slot=slider-track]]:bg-[rgba(16,16,16,0.96)] [&_[data-slot=slider-track]]:shadow-[inset_0_1px_2px_rgba(255,255,255,0.06)] [&_[data-slot=slider-range]]:bg-[rgba(255,255,255,0.08)] [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:border-[rgba(255,255,255,0.22)] [&_[data-slot=slider-thumb]]:bg-[#F4F4F5] [&_[data-slot=slider-thumb]]:shadow-[0_3px_10px_rgba(0,0,0,0.4)]"
                                />
                              </div>

                              <PanControl
                                centeredLabel={copy.centeredPan}
                                name={track.name}
                                pan={track.pan}
                                panLabel={copy.pan}
                                previewMode={previewMode}
                                onChange={(nextPan) => updateTrackPan(track.id, nextPan)}
                              />
                            </div>
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
                    height: metrics.arrangementHeaderHeight,
                    backgroundColor: "var(--agentic-surface)",
                    borderBottom: "1px solid var(--agentic-border-strong)",
                  }}
                  onPointerDown={handleSeekPointerDown}
                >
                  <div
                    className="relative flex h-full items-stretch"
                    style={{
                      width: metrics.timelineContentWidth,
                      paddingLeft: metrics.timelineLeadingInset,
                      paddingRight: metrics.timelineTrailingInset,
                      transform: `translateX(-${scrollLeft}px)`,
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: metrics.timelineLeadingInset,
                        top: 0,
                        bottom: 0,
                        width: 1,
                        backgroundColor: "var(--agentic-border-strong)",
                        zIndex: 1,
                      }}
                    />
                    {Array.from({ length: metrics.totalBars }, (_, barIndex) => {
                      const label = barIndex + 1;
                      return (
                        <div
                          key={label}
                          className="relative h-full shrink-0"
                          style={{
                            width: metrics.barWidth,
                            minWidth: metrics.barWidth,
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

                          {Array.from({ length: metrics.beatsPerBar - 1 }, (_, beatIndex) => (
                            <span
                              key={`${label}-${beatIndex}`}
                              style={{
                                position: "absolute",
                                left: (beatIndex + 1) * metrics.pixelsPerBeat,
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
                  onScroll={handleTimelineScroll}
                  style={{ backgroundColor: "var(--agentic-topbar)" }}
                >
                  <div style={{ width: metrics.timelineContentWidth }}>
                    {tracks.map((track, rowIndex) => {
                      const isSelected = track.id === selectedTrackId;

                      return (
                        <div
                          key={track.id}
                          className="relative"
                          style={{
                            height: metrics.trackRowHeight,
                            borderBottom: "1px solid var(--agentic-border)",
                            backgroundColor: isSelected
                              ? "rgba(255,255,255,0.03)"
                              : "transparent",
                            backgroundImage:
                              "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.16) 1px, transparent 1px)",
                            backgroundSize: `${metrics.pixelsPerBeat}px 100%, ${metrics.barWidth}px 100%`,
                            backgroundPosition: `${metrics.timelineLeadingInset}px 0, ${metrics.timelineLeadingInset}px 0`,
                          }}
                          onPointerDown={handleSeekPointerDown}
                        >
                          <span
                            aria-hidden="true"
                            style={{
                              position: "absolute",
                              left: metrics.timelineLeadingInset,
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

                          {!previewMode
                            ? track.clips.map((clip) => (
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
                                      metrics.timelineLeadingInset +
                                      clip.startBeat * metrics.pixelsPerBeat +
                                      4,
                                    top: previewMode ? 10 : 12,
                                    width: clip.durationBeats * metrics.pixelsPerBeat - 8,
                                    height: metrics.trackRowHeight - (previewMode ? 20 : 24),
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
                                    {copy.barLabel(
                                      Math.floor(clip.startBeat / metrics.beatsPerBar) + 1,
                                      Math.ceil(clip.durationBeats / metrics.beatsPerBar),
                                    )}
                                  </span>
                                </button>
                              ))
                            : null}
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
                    aria-label={copy.playheadAt(transportPosition)}
                    onPointerDown={handlePlayheadPointerDown}
                    style={{
                      position: "absolute",
                      left: metrics.playheadViewportX,
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
                height: metrics.bottomTransportHeight,
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
                  <button type="button" style={bottomIconStyle} aria-label={copy.waveformTools}>
                    <AudioWaveform size={20} strokeWidth={1.8} />
                  </button>
                  <button type="button" style={bottomIconStyle} aria-label={copy.microphoneMonitor}>
                    <MicOff size={20} strokeWidth={1.8} />
                  </button>
                  <button type="button" style={bottomIconStyle} aria-label={copy.mixerControls}>
                    <SlidersHorizontal size={20} strokeWidth={1.8} />
                  </button>
                </div>
              </div>

              <div className="flex items-center" style={{ gap: previewMode ? 10 : 12 }}>
                <button
                  type="button"
                  onClick={() => seekToBeat(0)}
                  aria-label={copy.returnToStart}
                  style={transportStyle}
                >
                  <SkipBack size={previewMode ? 20 : 24} strokeWidth={2.1} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!isPlaying && currentBeat >= metrics.maxTimelineBeat) {
                      seekToBeat(0);
                    }
                    setIsPlaying((prev) => !prev);
                  }}
                  aria-label={isPlaying ? copy.pausePlayback : copy.startPlayback}
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
                  aria-label={copy.record}
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
                  {copy.loop}
                </button>
                <button type="button" style={bottomPillStyle}>
                  {selectedTrack.name}
                </button>
                <button type="button" style={bottomPillStyle}>
                  4/4
                </button>
                <button type="button" style={bottomPillStyle}>
                  {metrics.tempo} BPM
                </button>
              </div>
            </div>
          </div>

          {showAgentOverlay ? (
            <AgenticOverlayDock
              bottomTransportHeight={metrics.bottomTransportHeight}
              producerWorkspaceVisible={producerWorkspaceVisible}
              producerMessages={producerMessages}
              audioQueue={audioQueue}
              generationHistory={generationHistory}
              onCloseProducerWorkspace={() => setProducerWorkspaceOpen(false)}
              overlayDockRef={overlayDockRef}
              agentMode={agentMode}
              openOverlayMenu={openOverlayMenu}
              targets={localizedTargets}
              selectedTarget={selectedMusicianTarget}
              styleDraft={styleDraft}
              lyricsDraft={lyricsDraft}
              producerDraft={producerDraft}
              producerWorkspaceOpen={producerWorkspaceOpen}
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
              onDraftChange={setProducerDraft}
              onDraftSubmit={handleProducerSubmit}
              onOpenWorkspace={openProducerWorkspace}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

function TrackIcon({
  track,
  previewMode,
}: {
  track: ArrangementTrack;
  previewMode: boolean;
}) {
  if (track.icon === "drums") {
    return <Drum size={previewMode ? 18 : 20} strokeWidth={2} />;
  }

  return <AudioWaveform size={previewMode ? 18 : 20} strokeWidth={2} />;
}

function PanKnob({ pan }: { pan: number }) {
  const rotation = (pan / 50) * 135;

  return (
    <span
      aria-hidden="true"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: 7,
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      />
      <span
        style={{
          width: 2,
          height: 10,
          borderRadius: 999,
          backgroundColor: "#C8F36B",
          transform: `translateY(-7px) rotate(${rotation}deg)`,
          transformOrigin: "center 12px",
          boxShadow: "0 0 10px rgba(200,243,107,0.24)",
        }}
      />
    </span>
  );
}

function PanControl({
  centeredLabel,
  name,
  pan,
  panLabel,
  previewMode,
  onChange,
}: {
  centeredLabel: string;
  name: string;
  pan: number;
  panLabel: string;
  previewMode: boolean;
  onChange: (pan: number) => void;
}) {
  const knobRef = useRef<HTMLButtonElement | null>(null);

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const startX = event.clientX;
    const startPan = pan;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const nextPan = clampPan(startPan + deltaX * 0.45);
      onChange(nextPan);
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    knobRef.current?.focus();
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <button
      ref={knobRef}
      type="button"
      onPointerDown={handlePointerDown}
      onDoubleClick={() => onChange(0)}
      aria-label={`${panLabel} ${name} ${formatPanLabel(pan, centeredLabel)}`}
      style={{
        width: previewMode ? 34 : 40,
        height: previewMode ? 34 : 40,
        padding: 0,
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.12)",
        background:
          "radial-gradient(circle at 30% 28%, rgba(255,255,255,0.22), rgba(255,255,255,0.08) 38%, rgba(22,22,22,0.92) 39%, rgba(39,39,39,0.95) 100%)",
        boxShadow:
          "inset 0 1px 1px rgba(255,255,255,0.08), 0 4px 10px rgba(0,0,0,0.22)",
        color: "rgba(255,255,255,0.84)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        cursor: "ew-resize",
        touchAction: "none",
      }}
    >
      <PanKnob pan={pan} />
    </button>
  );
}

function formatPanLabel(pan: number, centeredLabel: string) {
  if (pan === 0) {
    return centeredLabel;
  }

  return `${pan < 0 ? "L" : "R"}${Math.abs(pan)}`;
}

function clampPan(pan: number) {
  return Math.max(-50, Math.min(50, pan));
}

const toolbarIconStyle: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: "var(--radius-control)",
  border: "1px solid var(--agentic-border)",
  backgroundColor: "var(--agentic-elevated)",
  color: "var(--agentic-control-text)",
};

const trackTogglePillStyle: CSSProperties = {
  borderRadius: "var(--radius-control)",
  border: "1px solid rgba(255,255,255,0.1)",
  fontSize: 13,
  fontWeight: 700,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const bottomIconStyle: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: "var(--radius-control)",
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
  borderRadius: "var(--radius-control)",
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
  borderRadius: "var(--radius-pill)",
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
