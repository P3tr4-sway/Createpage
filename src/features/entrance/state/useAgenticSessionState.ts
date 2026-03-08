import { useEffect, useState } from "react";
import type { Locale } from "@/features/entrance/EntranceLocaleContext";
import {
  getInitialAudioQueueForLocale,
  getInitialGenerationHistoryForLocale,
  getInitialProducerMessagesForLocale,
  getInitialTracksForLocale,
} from "@/features/entrance/model/agentic.mock";
import type {
  AgentMode,
  ArrangementTrack,
  AudioQueueItem,
  GenerationHistoryItem,
  MusicianTargetId,
  OverlayMenu,
  ProducerMessage,
} from "@/features/entrance/model/agentic.types";

interface UseAgenticSessionStateParams {
  locale: Locale;
  defaultLyricsDraft: string;
  trackName: (index: number) => string;
  ideaLane: string;
}

export function useAgenticSessionState({
  locale,
  defaultLyricsDraft,
  trackName,
  ideaLane,
}: UseAgenticSessionStateParams) {
  const [tracks, setTracks] = useState(() => getInitialTracksForLocale(locale));
  const [selectedTrackId, setSelectedTrackId] = useState(
    () => getInitialTracksForLocale(locale)[0].id,
  );
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
  const [lyricsDraft, setLyricsDraft] = useState<string>(() => defaultLyricsDraft);
  const [producerDraft, setProducerDraft] = useState("");
  const [producerWorkspaceOpen, setProducerWorkspaceOpen] = useState(false);
  const [producerMessages, setProducerMessages] =
    useState<ProducerMessage[]>(() => getInitialProducerMessagesForLocale(locale));
  const [audioQueue, setAudioQueue] =
    useState<AudioQueueItem[]>(() => getInitialAudioQueueForLocale(locale));
  const [generationHistory, setGenerationHistory] =
    useState<GenerationHistoryItem[]>(() => getInitialGenerationHistoryForLocale(locale));

  useEffect(() => {
    const nextTracks = getInitialTracksForLocale(locale);
    setTracks(nextTracks);
    setSelectedTrackId(nextTracks[0]?.id ?? "");
    setMutedTrackIds([]);
    setSoloTrackIds([]);
    setIsPlaying(false);
    setLoopEnabled(false);
    setCurrentBeat(6);
    setScrollLeft(0);
    setScrollTop(0);
    setIsDraggingPlayhead(false);
    setAgentMode("musician");
    setOpenOverlayMenu(null);
    setMusicianTargetId("ai-drummer");
    setStyleDraft("");
    setLyricsDraft(defaultLyricsDraft);
    setProducerDraft("");
    setProducerWorkspaceOpen(false);
    setProducerMessages(getInitialProducerMessagesForLocale(locale));
    setAudioQueue(getInitialAudioQueueForLocale(locale));
    setGenerationHistory(getInitialGenerationHistoryForLocale(locale));
  }, [defaultLyricsDraft, locale]);

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

  const updateTrackVolume = (trackId: string, volume: number) => {
    const nextVolume = Math.max(0, Math.min(100, volume));
    setTracks((prev) =>
      prev.map((track) =>
        track.id === trackId
          ? {
              ...track,
              volume: nextVolume,
            }
          : track,
      ),
    );
  };

  const updateTrackPan = (trackId: string, pan: number) => {
    const nextPan = Math.max(-50, Math.min(50, pan));
    setTracks((prev) =>
      prev.map((track) =>
        track.id === trackId
          ? {
              ...track,
              pan: nextPan,
            }
          : track,
      ),
    );
  };

  const addTrack = () => {
    const nextIndex = tracks.length + 1;
    const nextTrack: ArrangementTrack = {
      id: `track-${nextIndex}`,
      name: trackName(nextIndex),
      icon: "default",
      role: ideaLane,
      level: "-inf dB",
      defaultVolume: 72,
      volume: 72,
      pan: 0,
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

  return {
    tracks,
    setTracks,
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
    setAgentMode,
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
    setAudioQueue,
    generationHistory,
    setGenerationHistory,
    pushQueueItem,
    pushHistoryItem,
    selectAgentMode,
    updateTrackVolume,
    updateTrackPan,
    addTrack,
    deleteTrack,
    toggleMuted,
    toggleSolo,
  };
}
