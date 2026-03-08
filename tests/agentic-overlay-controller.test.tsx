import { act, renderHook } from "@testing-library/react";
import { useState } from "react";
import { agenticCopyByLocale } from "../src/features/entrance/i18n/agentic.copy";
import { getInitialTracksForLocale, getMusicianTargetsForLocale } from "../src/features/entrance/model/agentic.mock";
import type { OverlayMenu, ProducerMessage } from "../src/features/entrance/model/agentic.types";
import { useAgenticOverlayController } from "../src/features/entrance/pages/agentic/useAgenticOverlayController";

describe("useAgenticOverlayController", () => {
  it("dispatches musician and producer actions while syncing local UI state", () => {
    const tracks = getInitialTracksForLocale("en");
    const selectedMusicianTarget = getMusicianTargetsForLocale("en").find(
      (target) => target.id === "ai-vocalist",
    );

    if (!selectedMusicianTarget) {
      throw new Error("Expected ai-vocalist target to exist.");
    }

    const pushQueueItem = vi.fn();
    const pushHistoryItem = vi.fn();

    const { result } = renderHook(() => {
      const [producerDraft, setProducerDraft] = useState("Shape a wider chorus.");
      const [producerMessages, setProducerMessages] = useState<ProducerMessage[]>([]);
      const [producerWorkspaceOpen, setProducerWorkspaceOpen] = useState(false);
      const [selectedTrackId, setSelectedTrackId] = useState(tracks[0].id);
      const [openOverlayMenu, setOpenOverlayMenu] = useState<OverlayMenu>("target");
      const controller = useAgenticOverlayController({
        copy: agenticCopyByLocale.en,
        producerDraft,
        pushHistoryItem,
        pushQueueItem,
        selectedMusicianTarget,
        selectedStyle: "Neo Soul",
        selectedTrack: tracks[0],
        setOpenOverlayMenu,
        setProducerDraft,
        setProducerMessages,
        setProducerWorkspaceOpen,
        setSelectedTrackId,
        tracks,
      });

      return {
        ...controller,
        openOverlayMenu,
        producerDraft,
        producerMessages,
        producerWorkspaceOpen,
        selectedTrackId,
      };
    });

    act(() => {
      result.current.handleMusicianGenerate();
    });

    expect(result.current.selectedTrackId).toBe("drums");
    expect(result.current.openOverlayMenu).toBeNull();
    expect(pushQueueItem).toHaveBeenCalledWith(
      expect.objectContaining({
        owner: selectedMusicianTarget.label,
        status: agenticCopyByLocale.en.statusGenerating,
      }),
    );
    expect(pushHistoryItem).toHaveBeenCalledWith(
      expect.objectContaining({
        owner: selectedMusicianTarget.label,
      }),
    );

    act(() => {
      result.current.handleProducerSubmit();
    });

    expect(result.current.producerWorkspaceOpen).toBe(true);
    expect(result.current.producerDraft).toBe("");
    expect(result.current.producerMessages).toHaveLength(2);
    expect(result.current.producerMessages[0]).toMatchObject({
      role: "user",
      text: "Shape a wider chorus.",
    });
    expect(result.current.producerMessages[1]).toMatchObject({
      role: "agent",
    });
    expect(pushQueueItem).toHaveBeenCalledWith(
      expect.objectContaining({
        owner: agenticCopyByLocale.en.aiProducer,
        title: agenticCopyByLocale.en.producerBrief,
      }),
    );
  });
});
