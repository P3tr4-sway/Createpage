import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
  type UIEvent,
} from "react";
import type { TutorialCourse } from "@/features/entrance/components/TutorialDialog";
import type { BrowseItem, GuitarClip } from "@/features/entrance/model/entrance.types";
import type {
  FullscreenView,
  HomeSubView,
  SectionId,
} from "@/features/entrance/state/useEntranceViewState";
import type { ActionId } from "@/features/entrance/workspace/EntranceWorkspace.types";

interface UseEntranceWorkspaceControllerParams {
  activeSection: SectionId;
  activeSubView: HomeSubView;
  pendingScrollTarget: SectionId | null;
  setActiveSection: (value: SectionId) => void;
  setPendingScrollTarget: (value: SectionId | null) => void;
  setActiveSubView: (value: HomeSubView) => void;
  setFullscreenView: (value: FullscreenView) => void;
  setTemplateOpen: (value: boolean) => void;
  setSongOpen: (value: boolean) => void;
  setGuitarOpen: (value: boolean) => void;
  setTutorialOpen: (value: boolean) => void;
}

export function useEntranceWorkspaceController({
  activeSection,
  activeSubView,
  pendingScrollTarget,
  setActiveSection,
  setPendingScrollTarget,
  setActiveSubView,
  setFullscreenView,
  setTemplateOpen,
  setSongOpen,
  setGuitarOpen,
  setTutorialOpen,
}: UseEntranceWorkspaceControllerParams) {
  const studioRef = useRef<HTMLDivElement>(null);
  const launchRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const heroPromptFieldRef = useRef<HTMLDivElement>(null);
  const heroPromptInputRef = useRef<HTMLInputElement>(null);
  const [looperInitialFilter, setLooperInitialFilter] = useState("Hot");
  const [backingTrackInitialFilter, setBackingTrackInitialFilter] = useState("Hot");
  const [selectedTemplate, setSelectedTemplate] = useState<BrowseItem | null>(null);
  const [selectedSong, setSelectedSong] = useState<BrowseItem | null>(null);
  const [selectedGuitarClip, setSelectedGuitarClip] = useState<GuitarClip | null>(null);
  const [selectedTutorial, setSelectedTutorial] = useState<TutorialCourse | null>(null);
  const [heroPromptValue, setHeroPromptValue] = useState("");
  const [heroPromptOpen, setHeroPromptOpen] = useState(false);

  useEffect(() => {
    if (activeSubView !== "home" || !pendingScrollTarget) {
      return;
    }

    const refMap: Record<SectionId, RefObject<HTMLDivElement | null>> = {
      studio: studioRef,
      launch: launchRef,
      community: communityRef,
    };

    const timer = window.setTimeout(() => {
      refMap[pendingScrollTarget].current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setPendingScrollTarget(null);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [activeSubView, pendingScrollTarget, setPendingScrollTarget]);

  useEffect(() => {
    if (!heroPromptOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && heroPromptFieldRef.current?.contains(target)) {
        return;
      }

      setHeroPromptOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      setHeroPromptOpen(false);
      heroPromptInputRef.current?.blur();
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [heroPromptOpen]);

  useEffect(() => {
    if (!heroPromptOpen) {
      return;
    }

    heroPromptInputRef.current?.focus();
  }, [heroPromptOpen]);

  const handleScrollTo = useCallback((id: SectionId) => {
    setActiveSection(id);

    if (activeSubView !== "home") {
      setPendingScrollTarget(id);
      setActiveSubView("home");
      return;
    }

    const refMap: Record<SectionId, RefObject<HTMLDivElement | null>> = {
      studio: studioRef,
      launch: launchRef,
      community: communityRef,
    };

    refMap[id].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeSubView, setActiveSection, setActiveSubView, setPendingScrollTarget]);

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const container = event.currentTarget;
      const sections: Array<{ id: SectionId; ref: RefObject<HTMLDivElement | null> }> = [
        { id: "studio", ref: studioRef },
        { id: "launch", ref: launchRef },
        { id: "community", ref: communityRef },
      ];

      const activationLine = container.scrollTop + container.clientHeight * 0.32;
      let nextActive: SectionId = "studio";

      for (const section of sections) {
        if (section.ref.current && activationLine >= section.ref.current.offsetTop) {
          nextActive = section.id;
        }
      }

      if (nextActive !== activeSection) {
        setActiveSection(nextActive);
      }
    },
    [activeSection, setActiveSection],
  );

  const openAgenticWorkspace = useCallback(() => {
    setFullscreenView("agentic-producing");
  }, [setFullscreenView]);

  const openLooperWorkspace = useCallback((filter: string) => {
    setLooperInitialFilter(filter);
    setActiveSubView("looper");
  }, [setActiveSubView]);

  const openBackingTrackWorkspace = useCallback((filter: string) => {
    setBackingTrackInitialFilter(filter);
    setActiveSubView("instant-backing-track");
  }, [setActiveSubView]);

  const openTemplate = useCallback((item: BrowseItem) => {
    setSelectedTemplate(item);
    setTemplateOpen(true);
  }, [setTemplateOpen]);

  const openSong = useCallback((item: BrowseItem) => {
    setSelectedSong(item);
    setSongOpen(true);
  }, [setSongOpen]);

  const openGuitar = useCallback((item: GuitarClip) => {
    setSelectedGuitarClip(item);
    setGuitarOpen(true);
  }, [setGuitarOpen]);

  const openTutorial = useCallback((item: TutorialCourse) => {
    setSelectedTutorial(item);
    setTutorialOpen(true);
  }, [setTutorialOpen]);

  const handleLaunch = useCallback((id: ActionId) => {
    switch (id) {
      case "looper":
        setActiveSubView("looper");
        return;
      default:
        return;
    }
  }, [setActiveSubView]);

  const openHeroPrompt = useCallback(() => {
    setHeroPromptOpen(true);
  }, []);

  const updateHeroPromptValue = useCallback((value: string) => {
    setHeroPromptValue(value);
    setHeroPromptOpen(true);
  }, []);

  const handleHeroPromptSuggestionSelect = useCallback((prompt: string) => {
    setHeroPromptValue(prompt);
    setHeroPromptOpen(false);

    window.requestAnimationFrame(() => {
      heroPromptInputRef.current?.focus();
    });
  }, []);

  return {
    studioRef,
    launchRef,
    communityRef,
    scrollContainerRef,
    heroPromptFieldRef,
    heroPromptInputRef,
    looperInitialFilter,
    backingTrackInitialFilter,
    selectedTemplate,
    selectedSong,
    selectedGuitarClip,
    selectedTutorial,
    heroPromptValue,
    heroPromptOpen,
    handleScrollTo,
    handleScroll,
    openAgenticWorkspace,
    openLooperWorkspace,
    openBackingTrackWorkspace,
    openTemplate,
    openSong,
    openGuitar,
    openTutorial,
    handleLaunch,
    openHeroPrompt,
    updateHeroPromptValue,
    handleHeroPromptSuggestionSelect,
  };
}
