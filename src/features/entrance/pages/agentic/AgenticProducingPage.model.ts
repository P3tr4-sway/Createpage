export interface AgenticTimelineMetrics {
  arrangementHeaderHeight: number;
  barWidth: number;
  beatsPerBar: number;
  bottomTransportHeight: number;
  maxTimelineBeat: number;
  pixelsPerBeat: number;
  playheadViewportX: number;
  previewInitialBeat: number;
  previewPlayheadTargetRatio: number;
  previewPlayheadViewportX: number;
  previewTimelinePaneWidth: number;
  tempo: number;
  timelineContentWidth: number;
  timelineGridWidth: number;
  timelineLeadingInset: number;
  timelineTrailingInset: number;
  totalBars: number;
  totalBeats: number;
  trackPanelWidth: number;
  trackRowHeight: number;
}

interface AgenticTimelineMetricsInput {
  currentBeat: number;
  previewMode: boolean;
  previewViewportWidth: number;
  scrollLeft: number;
}

export function clampBeat(beat: number, totalBeats: number) {
  const maxBeat = Math.max(totalBeats - 0.001, 0);
  return Math.min(Math.max(beat, 0), maxBeat);
}

export function formatTransportPosition(
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

export function createAgenticUiId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function getAgenticTimelineMetrics({
  currentBeat,
  previewMode,
  previewViewportWidth,
  scrollLeft,
}: AgenticTimelineMetricsInput): AgenticTimelineMetrics {
  const previewInitialBeat = 6;
  const previewPlayheadTargetRatio = 2 / 3;
  const trackPanelWidth = previewMode ? 282 : 356;
  const arrangementHeaderHeight = previewMode ? 44 : 58;
  const trackRowHeight = previewMode ? 76 : 92;
  const bottomTransportHeight = previewMode ? 72 : 94;
  const pixelsPerBeat = previewMode ? 26 : 36;
  const beatsPerBar = 4;
  const totalBars = 24;
  const tempo = 65;
  const totalBeats = totalBars * beatsPerBar;
  const maxTimelineBeat = Math.max(totalBeats - 0.001, 0);
  const barWidth = beatsPerBar * pixelsPerBeat;
  const timelineGridWidth = totalBeats * pixelsPerBeat;
  const previewPlayheadViewportX = previewMode
    ? Math.max(previewViewportWidth * previewPlayheadTargetRatio - trackPanelWidth, 0)
    : 0;
  const previewTimelinePaneWidth = previewMode
    ? Math.max(previewViewportWidth - trackPanelWidth, 0)
    : 0;
  const timelineLeadingInset = previewMode
    ? Math.max(20, previewPlayheadViewportX - previewInitialBeat * pixelsPerBeat)
    : 36;
  const timelineTrailingInset = previewMode
    ? Math.max(52, previewTimelinePaneWidth - previewPlayheadViewportX + 24)
    : 72;
  const timelineContentWidth = timelineLeadingInset + timelineGridWidth + timelineTrailingInset;
  const playheadViewportX = timelineLeadingInset + currentBeat * pixelsPerBeat - scrollLeft;

  return {
    arrangementHeaderHeight,
    barWidth,
    beatsPerBar,
    bottomTransportHeight,
    maxTimelineBeat,
    pixelsPerBeat,
    playheadViewportX,
    previewInitialBeat,
    previewPlayheadTargetRatio,
    previewPlayheadViewportX,
    previewTimelinePaneWidth,
    tempo,
    timelineContentWidth,
    timelineGridWidth,
    timelineLeadingInset,
    timelineTrailingInset,
    totalBars,
    totalBeats,
    trackPanelWidth,
    trackRowHeight,
  };
}
