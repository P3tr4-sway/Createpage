import {
  useCallback,
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import type {
  AgenticCopy,
  ArrangementTrack,
  AudioQueueItem,
  GenerationHistoryItem,
  MusicianTarget,
  OverlayMenu,
  ProducerMessage,
} from "@/features/entrance/model/agentic.types";
import { createAgenticUiId } from "@/features/entrance/pages/agentic/AgenticProducingPage.model";

interface UseAgenticOverlayControllerParams {
  copy: AgenticCopy;
  producerDraft: string;
  pushHistoryItem: (item: GenerationHistoryItem) => void;
  pushQueueItem: (item: AudioQueueItem) => void;
  selectedMusicianTarget: MusicianTarget;
  selectedStyle: string;
  selectedTrack: ArrangementTrack;
  setOpenOverlayMenu: Dispatch<SetStateAction<OverlayMenu>>;
  setProducerDraft: Dispatch<SetStateAction<string>>;
  setProducerMessages: Dispatch<SetStateAction<ProducerMessage[]>>;
  setProducerWorkspaceOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedTrackId: Dispatch<SetStateAction<string>>;
  tracks: ArrangementTrack[];
}

export function useAgenticOverlayController({
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
}: UseAgenticOverlayControllerParams) {
  const overlayDockRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!overlayDockRef.current) {
        return;
      }
      if (!overlayDockRef.current.contains(event.target as Node)) {
        setOpenOverlayMenu(null);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [setOpenOverlayMenu]);

  const handleMusicianGenerate = useCallback(() => {
    setOpenOverlayMenu(null);

    const targetTrack = tracks.find((track) =>
      track.name.toLowerCase().includes(selectedMusicianTarget.trackMatch),
    );

    if (targetTrack) {
      setSelectedTrackId(targetTrack.id);
    }

    pushQueueItem({
      id: createAgenticUiId("queue"),
      title: copy.musicianPassTitle(selectedMusicianTarget.label),
      owner: selectedMusicianTarget.label,
      status: copy.statusGenerating,
      detail: `${selectedStyle} • ${targetTrack?.name ?? selectedTrack.name}`,
      progress: selectedMusicianTarget.showsLyrics
        ? copy.lyricProgress
        : copy.instrumentalProgress,
    });

    pushHistoryItem({
      id: createAgenticUiId("history"),
      title: copy.musicianPassTitle(selectedMusicianTarget.label),
      owner: selectedMusicianTarget.label,
      meta: selectedMusicianTarget.showsLyrics
        ? copy.lyricDraftMeta(selectedStyle)
        : copy.instrumentalPassMeta(selectedStyle),
      timestamp: copy.justNow,
    });
  }, [
    copy,
    pushHistoryItem,
    pushQueueItem,
    selectedMusicianTarget,
    selectedStyle,
    selectedTrack.name,
    setOpenOverlayMenu,
    setSelectedTrackId,
    tracks,
  ]);

  const openProducerWorkspace = useCallback(() => {
    setOpenOverlayMenu(null);
    setProducerWorkspaceOpen(true);
  }, [setOpenOverlayMenu, setProducerWorkspaceOpen]);

  const handleProducerSubmit = useCallback((nextText?: string) => {
    const nextDraft = (nextText ?? producerDraft).trim();
    if (!nextDraft) {
      return;
    }

    openProducerWorkspace();

    setProducerMessages((prev) => [
      ...prev,
      {
        id: createAgenticUiId("message"),
        role: "user",
        text: nextDraft,
        timestamp: copy.justNow,
      },
      {
        id: createAgenticUiId("message"),
        role: "agent",
        text: copy.producerSubmitReply(selectedStyle, selectedMusicianTarget.label),
        timestamp: copy.justNow,
      },
    ]);

    pushQueueItem({
      id: createAgenticUiId("queue"),
      title: copy.producerBrief,
      owner: copy.aiProducer,
      status: copy.statusGenerating,
      detail: copy.producerSessionDirection(selectedStyle),
      progress: copy.producerDispatch,
    });

    pushHistoryItem({
      id: createAgenticUiId("history"),
      title: copy.producerBrief,
      owner: copy.aiProducer,
      meta: copy.producerChatDirected(selectedStyle),
      timestamp: copy.justNow,
    });

    setProducerDraft("");
  }, [
    copy,
    openProducerWorkspace,
    producerDraft,
    pushHistoryItem,
    pushQueueItem,
    selectedMusicianTarget.label,
    selectedStyle,
    setProducerDraft,
    setProducerMessages,
  ]);

  return {
    handleMusicianGenerate,
    handleProducerSubmit,
    openProducerWorkspace,
    overlayDockRef,
  };
}
