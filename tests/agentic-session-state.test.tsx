import { act, renderHook } from "@testing-library/react";
import { useAgenticSessionState } from "../src/features/entrance/state/useAgenticSessionState";

describe("useAgenticSessionState", () => {
  it("supports track operations and mode switching", () => {
    const { result } = renderHook(() =>
      useAgenticSessionState({
        locale: "en",
        defaultLyricsDraft: "draft",
        trackName: (index) => `Track ${index}`,
        ideaLane: "Idea lane",
      }),
    );

    const initialTrackCount = result.current.tracks.length;

    act(() => {
      result.current.addTrack();
    });

    expect(result.current.tracks.length).toBe(initialTrackCount + 1);

    const firstTrackId = result.current.tracks[0].id;
    act(() => {
      result.current.toggleMuted(firstTrackId);
      result.current.toggleSolo(firstTrackId);
      result.current.setOpenOverlayMenu("mode");
      result.current.selectAgentMode("producer");
    });

    expect(result.current.mutedTrackIds).toContain(firstTrackId);
    expect(result.current.soloTrackIds).toContain(firstTrackId);
    expect(result.current.agentMode).toBe("producer");
    expect(result.current.openOverlayMenu).toBeNull();
  });

  it("resets state when locale context changes", () => {
    const { result, rerender } = renderHook(
      ({ locale, defaultLyricsDraft }: { locale: "en" | "zh-CN"; defaultLyricsDraft: string }) =>
        useAgenticSessionState({
          locale,
          defaultLyricsDraft,
          trackName: (index) => `Track ${index}`,
          ideaLane: "Idea lane",
        }),
      {
        initialProps: {
          locale: "en" as const,
          defaultLyricsDraft: "english-draft",
        },
      },
    );

    act(() => {
      result.current.setProducerDraft("custom-producer-draft");
      result.current.setStyleDraft("neo-soul");
      result.current.setOpenOverlayMenu("target");
      result.current.setAgentMode("producer");
    });

    rerender({ locale: "zh-CN", defaultLyricsDraft: "中文草稿" });

    expect(result.current.producerDraft).toBe("");
    expect(result.current.styleDraft).toBe("");
    expect(result.current.openOverlayMenu).toBeNull();
    expect(result.current.agentMode).toBe("musician");
    expect(result.current.lyricsDraft).toBe("中文草稿");
  });
});
