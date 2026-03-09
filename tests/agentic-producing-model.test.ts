import {
  clampBeat,
  formatTransportPosition,
  getAgenticTimelineMetrics,
} from "../src/features/entrance/pages/agentic/AgenticProducingPage.model";

describe("AgenticProducingPage model", () => {
  it("clamps beat values within the timeline range", () => {
    expect(clampBeat(-4, 96)).toBe(0);
    expect(clampBeat(12.5, 96)).toBe(12.5);
    expect(clampBeat(120, 96)).toBeCloseTo(95.999, 3);
  });

  it("formats the transport position from beat values", () => {
    expect(formatTransportPosition(6, 4, 96)).toBe("02.3.1");
    expect(formatTransportPosition(7.75, 4, 96)).toBe("02.4.4");
  });

  it("derives stable preview timeline metrics", () => {
    const metrics = getAgenticTimelineMetrics({
      currentBeat: 6,
      isJamExperience: false,
      previewMode: true,
      previewViewportWidth: 1280,
      scrollLeft: 0,
    });

    expect(metrics.trackPanelWidth).toBe(282);
    expect(metrics.totalBeats).toBe(96);
    expect(metrics.barWidth).toBe(metrics.beatsPerBar * metrics.pixelsPerBeat);
    expect(metrics.playheadViewportX).toBeCloseTo(metrics.previewPlayheadViewportX, 5);
    expect(metrics.timelineContentWidth).toBeGreaterThan(metrics.timelineGridWidth);
  });

  it("allocates taller track rows for Jamy lanes", () => {
    const defaultMetrics = getAgenticTimelineMetrics({
      currentBeat: 0,
      isJamExperience: false,
      previewMode: false,
      previewViewportWidth: 0,
      scrollLeft: 0,
    });
    const jamMetrics = getAgenticTimelineMetrics({
      currentBeat: 0,
      isJamExperience: true,
      previewMode: false,
      previewViewportWidth: 0,
      scrollLeft: 0,
    });

    expect(defaultMetrics.trackRowHeight).toBe(116);
    expect(jamMetrics.trackRowHeight).toBe(176);
  });
});
