import { useMemo } from "react";
import { useEntranceLocale } from "@/features/entrance/EntranceLocaleContext";
import { getJamyTracksForLocale } from "@/features/entrance/model/agentic.mock";
import { AgenticProducingPage } from "@/features/entrance/pages/AgenticProducingPage";

interface JamyPageProps {
  onBack: () => void;
}

export function JamyPage({ onBack }: JamyPageProps) {
  const locale = useEntranceLocale();
  const initialTracks = useMemo(() => getJamyTracksForLocale(locale), [locale]);

  return (
    <AgenticProducingPage
      onBack={onBack}
      projectTitle="Jamy"
      showAgentOverlay={false}
      allowAddTrack={false}
      initialTracks={initialTracks}
    />
  );
}
