import {
  ArrowLeft,
  Bot,
  ChevronDown,
  Moon,
  Repeat,
  Sparkles,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
  type UIEvent,
  useCallback,
} from "react";
import { EntranceLocaleProvider, type Locale } from "@/features/entrance/EntranceLocaleContext";
import { AgenticProducingPage } from "@/features/entrance/pages/AgenticProducingPage";
import { InstantBackingTrackPage } from "@/features/entrance/pages/InstantBackingTrackPage";
import { LooperPage } from "@/features/entrance/pages/LooperPage";
import { ProjectsSheet } from "@/features/entrance/components/ProjectsSheet";
import { TemplateSheet } from "@/features/entrance/components/TemplateSheet";
import {
  TutorialDialog,
  tutorialCourses,
  type TutorialCourse,
} from "@/features/entrance/components/TutorialDialog";
import { JamWithAI } from "@/features/entrance/components/JamWithAI";
import {
  copyByLocale,
  getInitialLocale,
  LOCALE_STORAGE_KEY,
  localeOptions,
} from "@/features/entrance/i18n/entrance.copy";
import {
  guitarClips,
  hipHopStarterTemplate,
  topJamTracks,
  topSongs,
} from "@/features/entrance/model/entrance.mock";
import type { BrowseItem, GuitarClip } from "@/features/entrance/model/entrance.types";
import {
  useEntranceViewState,
  type SectionId,
} from "@/features/entrance/state/useEntranceViewState";
import {
  LoopLaunchPanel,
  SidebarProjectListItem,
  SidebarStartAction,
} from "@/features/entrance/workspace/EntranceWorkspacePanels";
import {
  QuickAccessCarousel,
  QuickActionsPage,
  TopBrowsePage,
  TopListColumn,
  type QuickAction,
} from "@/features/entrance/workspace/EntranceWorkspaceBrowse";
import { EntranceWorkspaceHero } from "@/features/entrance/workspace/EntranceWorkspaceHero";
import { EntranceWorkspaceTutorialPanel } from "@/features/entrance/workspace/EntranceWorkspaceTutorialPanel";
import {
  inlineLinkButtonStyle,
  secondaryButtonStyle,
  sectionDescriptionStyle,
  sectionTitleStyle,
} from "@/features/entrance/workspace/EntranceWorkspaceBrowse.styles";

type ActionId = "looper";

type SidebarAction = {
  label: string;
  meta?: string;
  icon: LucideIcon;
  accent: string;
  onClick: () => void;
};

type SidebarProject = {
  id: string;
  title: string;
  meta: string;
  status: string;
  onClick: () => void;
};

export function EntranceWorkspace() {
  const studioRef = useRef<HTMLDivElement>(null);
  const launchRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const heroPromptFieldRef = useRef<HTMLDivElement>(null);
  const heroPromptInputRef = useRef<HTMLInputElement>(null);
  const {
    viewState: {
      activeSection,
      pendingScrollTarget,
      fullscreenView,
      activeSubView,
      projectsOpen,
      templateOpen,
      songOpen,
      guitarOpen,
      tutorialOpen,
    },
    setActiveSection,
    setPendingScrollTarget,
    setFullscreenView,
    setActiveSubView,
    setProjectsOpen,
    setTemplateOpen,
    setSongOpen,
    setGuitarOpen,
    setTutorialOpen,
  } = useEntranceViewState();
  const [looperInitialFilter, setLooperInitialFilter] = useState("Hot");
  const [backingTrackInitialFilter, setBackingTrackInitialFilter] = useState("Hot");
  const [selectedTemplate, setSelectedTemplate] = useState<BrowseItem | null>(null);
  const [selectedSong, setSelectedSong] = useState<BrowseItem | null>(null);
  const [selectedGuitarClip, setSelectedGuitarClip] = useState<GuitarClip | null>(null);
  const [selectedTutorial, setSelectedTutorial] = useState<TutorialCourse | null>(null);
  const [heroPromptValue, setHeroPromptValue] = useState("");
  const [heroPromptOpen, setHeroPromptOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = mounted ? resolvedTheme === "dark" : true;
  const copy = copyByLocale[locale];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

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
  }, [activeSubView, pendingScrollTarget]);

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

  const shellTone = useMemo(
    () => ({
      appBg: isDark ? "#171717" : "#f7f7f5",
      homeBg: isDark
        ? "radial-gradient(circle at 22% 0%, rgba(255,255,255,0.04), transparent 24%), linear-gradient(180deg, #171717 0%, #121212 34%, #171717 100%)"
        : "radial-gradient(circle at 18% 0%, rgba(255,255,255,0.62), transparent 24%), linear-gradient(180deg, #fbfbfa 0%, #f2f2ef 34%, #f7f7f5 100%)",
      railBg: isDark ? "#1b1b1b" : "#f8f8f6",
      railSurface: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.72)",
      railSurfaceStrong: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.9)",
      railBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(23,23,23,0.08)",
      mainHeaderBg: isDark ? "#1c1c1c" : "#fafaf8",
      heroScrim: isDark
        ? "linear-gradient(180deg, rgba(6,8,12,0.18) 0%, rgba(6,8,12,0.36) 48%, rgba(6,8,12,0.6) 100%)"
        : "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.28) 48%, rgba(248,250,252,0.68) 100%)",
      heroBridge: isDark
        ? "linear-gradient(180deg, rgba(23,23,23,0) 0%, rgba(23,23,23,0.18) 36%, rgba(23,23,23,0.82) 100%)"
        : "linear-gradient(180deg, rgba(247,247,245,0) 0%, rgba(247,247,245,0.42) 36%, rgba(247,247,245,0.95) 100%)",
      heroFrameBg: isDark ? "rgba(12,12,12,0.96)" : "rgba(255,255,255,0.92)",
      heroHintBg: isDark ? "rgba(17,17,17,0.76)" : "rgba(255,255,255,0.8)",
      heroHintBorder: isDark ? "rgba(255,255,255,0.12)" : "rgba(23,23,23,0.08)",
      chipBg: isDark ? "rgba(255,255,255,0.06)" : "rgba(23,23,23,0.04)",
      mutedText: isDark ? "rgba(255,255,255,0.58)" : "rgba(82,82,82,0.86)",
    }),
    [isDark],
  );

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
  }, [activeSubView]);

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
    [activeSection],
  );

  const openTemplate = useCallback((item: BrowseItem) => {
    setSelectedTemplate(item);
    setTemplateOpen(true);
  }, []);

  const openSong = useCallback((item: BrowseItem) => {
    setSelectedSong(item);
    setSongOpen(true);
  }, []);

  const openGuitar = useCallback((item: GuitarClip) => {
    setSelectedGuitarClip(item);
    setGuitarOpen(true);
  }, []);

  const openTutorial = useCallback((item: TutorialCourse) => {
    setSelectedTutorial(item);
    setTutorialOpen(true);
  }, []);

  const handleLaunch = useCallback((id: ActionId) => {
    switch (id) {
      case "looper":
        setActiveSubView("looper");
        return;
      default:
        return;
    }
  }, []);

  const createActions = useMemo<SidebarAction[]>(
    () => [
      {
        label: copy.createActions[0].label,
        meta: copy.createActions[0].meta,
        icon: Bot,
        accent: "rgba(99, 102, 241, 0.18)",
        onClick: () => setFullscreenView("agentic-producing"),
      },
      {
        label: copy.createActions[1].label,
        meta: copy.createActions[1].meta,
        icon: Repeat,
        accent: "rgba(20, 184, 166, 0.18)",
        onClick: () => {
          setLooperInitialFilter("Hot");
          setActiveSubView("looper");
        },
      },
      {
        label: copy.createActions[2].label,
        meta: copy.createActions[2].meta,
        icon: Sparkles,
        accent: "rgba(244, 114, 182, 0.18)",
        onClick: () => openGuitar(guitarClips[0]),
      },
      {
        label: copy.createActions[3].label,
        meta: copy.createActions[3].meta,
        icon: Sparkles,
        accent: "rgba(250, 204, 21, 0.2)",
        onClick: () => handleScrollTo("launch"),
      },
    ],
    [copy.createActions, handleScrollTo, openGuitar],
  );

  const sidebarProjects = useMemo<SidebarProject[]>(
    () => [
      {
        id: "daw-1",
        title: copy.sidebarProjects[0].title,
        meta: copy.sidebarProjects[0].meta,
        status: copy.sidebarProjects[0].status,
        onClick: () => setFullscreenView("agentic-producing"),
      },
      {
        id: "loop-1",
        title: copy.sidebarProjects[1].title,
        meta: copy.sidebarProjects[1].meta,
        status: copy.sidebarProjects[1].status,
        onClick: () => {
          setLooperInitialFilter("Hot");
          setActiveSubView("looper");
        },
      },
      {
        id: "guitar-1",
        title: copy.sidebarProjects[2].title,
        meta: copy.sidebarProjects[2].meta,
        status: copy.sidebarProjects[2].status,
        onClick: () => openGuitar(guitarClips[0]),
      },
      {
        id: "template-1",
        title: copy.sidebarProjects[3].title,
        meta: copy.sidebarProjects[3].meta,
        status: copy.sidebarProjects[3].status,
        onClick: () => openTemplate(topJamTracks[8]),
      },
      {
        id: "backing-1",
        title: copy.sidebarProjects[4].title,
        meta: copy.sidebarProjects[4].meta,
        status: copy.sidebarProjects[4].status,
        onClick: () => {
          setBackingTrackInitialFilter("Blues");
          setActiveSubView("instant-backing-track");
        },
      },
      {
        id: "template-2",
        title: copy.sidebarProjects[5].title,
        meta: copy.sidebarProjects[5].meta,
        status: copy.sidebarProjects[5].status,
        onClick: () => openTemplate(topJamTracks[6]),
      },
      {
        id: "guitar-2",
        title: copy.sidebarProjects[6].title,
        meta: copy.sidebarProjects[6].meta,
        status: copy.sidebarProjects[6].status,
        onClick: () => openGuitar(guitarClips[2]),
      },
    ],
    [copy.sidebarProjects, openGuitar, openTemplate],
  );

  const quickActions = useMemo<QuickAction[]>(
    () => [
      {
        id: "make-song",
        title: copy.quickActions[0].title,
        meta: copy.quickActions[0].meta,
        tag: copy.quickActions[0].tag,
        imageUrl: topSongs[0].imageUrl,
        onClick: () => setFullscreenView("agentic-producing"),
      },
      {
        id: "jam-now",
        title: copy.quickActions[1].title,
        meta: copy.quickActions[1].meta,
        tag: copy.quickActions[1].tag,
        imageUrl: topSongs[1].imageUrl,
        onClick: () => handleScrollTo("launch"),
      },
      {
        id: "rock-loop",
        title: copy.quickActions[2].title,
        meta: copy.quickActions[2].meta,
        tag: copy.quickActions[2].tag,
        imageUrl: guitarClips[3].imageUrl,
        onClick: () => {
          setLooperInitialFilter("Rock");
          setActiveSubView("looper");
        },
      },
      {
        id: "blues-jam",
        title: copy.quickActions[3].title,
        meta: copy.quickActions[3].meta,
        tag: copy.quickActions[3].tag,
        imageUrl: guitarClips[4].imageUrl,
        onClick: () => {
          setBackingTrackInitialFilter("Blues");
          setActiveSubView("instant-backing-track");
        },
      },
      {
        id: "hiphop-song",
        title: copy.quickActions[4].title,
        meta: copy.quickActions[4].meta,
        tag: copy.quickActions[4].tag,
        imageUrl: hipHopStarterTemplate.imageUrl,
        onClick: () => openTemplate(hipHopStarterTemplate),
      },
      {
        id: "guitar-solo",
        title: copy.quickActions[5].title,
        meta: copy.quickActions[5].meta,
        tag: copy.quickActions[5].tag,
        imageUrl: guitarClips[0].imageUrl,
        onClick: () => openGuitar(guitarClips[0]),
      },
    ],
    [copy.quickActions, handleScrollTo, openGuitar, openTemplate],
  );

  const filteredHeroPromptSuggestions = useMemo(() => {
    const query = heroPromptValue.trim().toLowerCase();

    if (!query) {
      return copy.heroPromptSuggestions;
    }

    return copy.heroPromptSuggestions.filter((suggestion) =>
      [suggestion.tag, suggestion.title, suggestion.prompt].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [copy.heroPromptSuggestions, heroPromptValue]);

  const visibleHeroPromptSuggestions = useMemo(
    () => filteredHeroPromptSuggestions.slice(0, 3),
    [filteredHeroPromptSuggestions],
  );

  const handleHeroPromptSuggestionSelect = useCallback((prompt: string) => {
    setHeroPromptValue(prompt);
    setHeroPromptOpen(false);

    window.requestAnimationFrame(() => {
      heroPromptInputRef.current?.focus();
    });
  }, []);

  const tutorialBrowseItems = useMemo<BrowseItem[]>(
    () =>
      tutorialCourses.map((course) => ({
        title: course.title,
        author: `${course.lessons.length} ${copy.tutorialPartUnit} · ${course.duration}`,
        avatarInitial: course.mentor.slice(0, 1),
        imageUrl: course.imageUrl,
      })),
    [copy.tutorialPartUnit],
  );

  const contentTitle =
    activeSubView === "home"
      ? copy.contentTitles.home
      : activeSubView === "looper"
        ? copy.contentTitles.looper
        : activeSubView === "instant-backing-track"
          ? copy.contentTitles.backingTrack
          : activeSubView === "quick-actions"
            ? copy.contentTitles.quickActions
          : activeSubView === "top-songs"
            ? copy.contentTitles.topSongs
            : activeSubView === "top-templates"
              ? copy.contentTitles.topTemplates
              : copy.contentTitles.tutorials;
  const homePreviewCanvasWidth = 1280;
  const homePreviewZoom = 1.14;
  const homePreviewFocusX = 0.42;
  const mainHeaderHeight = 72;
  const isLooperFullscreen = activeSubView === "looper";
  const showMainHeader = activeSubView !== "home" && !isLooperFullscreen;
  const homeHeroHeight = `clamp(${520 + mainHeaderHeight}px, calc(100vh - ${248 - mainHeaderHeight}px), ${620 + mainHeaderHeight}px)`;
  const sidebarWidth = 399;
  const sidebarInlinePadding = 24;
  const mainContentInlinePadding = 32;

  if (fullscreenView === "agentic-producing") {
    return (
      <EntranceLocaleProvider locale={locale}>
        <AgenticProducingPage onBack={() => setFullscreenView(null)} />
      </EntranceLocaleProvider>
    );
  }

  return (
    <EntranceLocaleProvider locale={locale}>
      <div
        className="relative flex h-full w-full overflow-hidden"
        style={{
          fontFamily: "var(--app-font-family)",
          background: shellTone.appBg,
        }}
      >
        {isLooperFullscreen ? null : (
          <aside
            className="relative flex h-full shrink-0 flex-col"
            style={{
              width: sidebarWidth,
              minWidth: sidebarWidth,
              flexBasis: sidebarWidth,
              padding: `22px ${sidebarInlinePadding}px 14px`,
              background: isDark
                ? "radial-gradient(circle at top left, rgba(255,255,255,0.04), transparent 28%), linear-gradient(180deg, #1a1a1a 0%, #131313 100%)"
                : "radial-gradient(circle at top left, rgba(255,255,255,0.7), transparent 30%), linear-gradient(180deg, #fbfbfa 0%, #f1f1ee 100%)",
              borderRight: `1px solid ${shellTone.railBorder}`,
              boxShadow: isDark ? "24px 0 80px rgba(0,0,0,0.24)" : "24px 0 64px rgba(0,0,0,0.05)",
              zIndex: 2,
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: 18 }}>
              <div>
                <h1 style={railHeadingStyle}>Create</h1>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative" style={languageSelectWrapStyle}>
                  <select
                    value={locale}
                    onChange={(event) => setLocale(event.target.value as Locale)}
                    className="tablet-touch-target"
                    style={languageSelectStyle}
                    aria-label={copy.languageSelectorAriaLabel}
                  >
                    {localeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    size={14}
                    strokeWidth={1.8}
                    style={languageSelectIconStyle}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className="tablet-icon-target tablet-pressable"
                  style={iconButtonStyle}
                  aria-label={isDark ? copy.switchToLightMode : copy.switchToDarkMode}
                >
                  {isDark ? <Sun size={16} strokeWidth={1.9} /> : <Moon size={16} strokeWidth={1.9} />}
                </button>
              </div>
            </div>

            <div
              className="min-h-0 flex-1 overflow-y-auto"
              style={{ paddingRight: 2, paddingBottom: 8 }}
            >
              <div className="flex flex-col" style={{ minHeight: "100%" }}>
                <section style={{ ...sidebarSectionStyle, paddingBottom: 18 }}>
                  <div className="mb-3">
                    <p style={sidebarSectionLabelStyle}>{copy.start}</p>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {createActions.map((action) => (
                      <SidebarStartAction
                        key={action.label}
                        label={action.label}
                        meta={action.meta}
                        icon={action.icon}
                        accent={action.accent}
                        onClick={action.onClick}
                      />
                    ))}
                  </div>
                </section>

                <section style={{ ...sidebarSectionStyle, display: "flex", minHeight: 0, flex: 1, flexDirection: "column" }}>
                  <div className="mb-3 flex items-center justify-between">
                    <p style={sidebarSectionLabelStyle}>{copy.myProjects}</p>
                    <button
                      type="button"
                      onClick={() => setProjectsOpen(true)}
                      className="tablet-touch-target tablet-pressable"
                      style={inlineLinkButtonStyle}
                    >
                      {copy.viewAll}
                    </button>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto" style={sidebarProjectListStyle}>
                    {sidebarProjects.map((project) => (
                      <SidebarProjectListItem key={project.id} project={project} />
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </aside>
        )}

      <main className="flex min-w-0 flex-1 flex-col">
        {showMainHeader ? (
          <div
            className="flex items-center justify-between"
            style={{
              height: mainHeaderHeight,
              minHeight: mainHeaderHeight,
              padding: `0 ${mainContentInlinePadding}px`,
              backgroundColor: shellTone.mainHeaderBg,
              borderBottom: `1px solid ${shellTone.railBorder}`,
              backdropFilter: "blur(22px)",
            }}
          >
            <div>
              <h2 style={topTitleStyle}>{contentTitle}</h2>
            </div>

            <button
              type="button"
              onClick={() => setActiveSubView("home")}
              className="tablet-touch-target tablet-pressable inline-flex items-center gap-2 rounded-full"
              style={secondaryButtonStyle}
            >
              <ArrowLeft size={15} strokeWidth={1.9} />
              {copy.back}
            </button>
          </div>
        ) : null}

        {activeSubView === "home" ? (
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden"
            style={{ scrollBehavior: "smooth", background: shellTone.homeBg }}
          >
            <EntranceWorkspaceHero
              sectionRef={studioRef}
              height={homeHeroHeight}
              contentInset={mainContentInlinePadding}
              previewCanvasWidth={homePreviewCanvasWidth}
              previewZoom={homePreviewZoom}
              previewFocusX={homePreviewFocusX}
              tone={{
                heroFrameBg: shellTone.heroFrameBg,
                railBorder: shellTone.railBorder,
                heroScrim: shellTone.heroScrim,
                heroHintBg: shellTone.heroHintBg,
                heroHintBorder: shellTone.heroHintBorder,
                heroBridge: shellTone.heroBridge,
              }}
              openFullWorkspaceAriaLabel={copy.openFullWorkspaceAriaLabel}
              previewEyebrow={copy.heroPreviewEyebrow}
              previewLabel={copy.heroPreviewLabel}
              sloganTitle={copy.sidebarHeroTitle}
              promptPlaceholder={copy.heroPromptPlaceholder}
              promptStartLabel={copy.heroPromptStart}
              promptShowMoreLabel={copy.heroPromptShowMore}
              promptEmptyLabel={copy.heroPromptEmpty}
              promptValue={heroPromptValue}
              promptOpen={heroPromptOpen}
              filteredSuggestions={filteredHeroPromptSuggestions}
              visibleSuggestions={visibleHeroPromptSuggestions}
              fieldRef={heroPromptFieldRef}
              inputRef={heroPromptInputRef}
              onOpenWorkspace={() => setFullscreenView("agentic-producing")}
              onPromptOpen={() => setHeroPromptOpen(true)}
              onPromptChange={(value) => {
                setHeroPromptValue(value);
                if (!heroPromptOpen) {
                  setHeroPromptOpen(true);
                }
              }}
              onPromptSelect={handleHeroPromptSuggestionSelect}
            />

              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  marginTop: -24,
                  padding: `92px ${mainContentInlinePadding}px 42px`,
                  background: isDark
                    ? "linear-gradient(180deg, rgba(17,19,21,0) 0%, rgba(17,19,21,0.82) 64px, rgba(17,19,21,0.96) 100%)"
                    : "linear-gradient(180deg, rgba(243,244,246,0) 0%, rgba(243,244,246,0.92) 64px, rgba(243,244,246,0.96) 100%)",
                }}
              >
              <section ref={launchRef} style={sectionStyle}>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 style={sectionTitleStyle}>{copy.launchTitle}</h3>
                    <p style={sectionDescriptionStyle}>{copy.launchDescription}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="grid items-stretch gap-5 lg:grid-cols-2">
                    <div className="flex min-h-full flex-col">
                      <LoopLaunchPanel
                        onLaunch={() => handleLaunch("looper")}
                        title={copy.looperLaunchTitle}
                        description={copy.looperLaunchDescription}
                      />
                    </div>

                    <div className="flex min-h-full flex-col">
                      <JamWithAI />
                    </div>
                  </div>

                  <QuickAccessCarousel
                    actions={quickActions}
                    onSeeAll={() => setActiveSubView("quick-actions")}
                    heading={copy.quickActionsHeading}
                    hint={copy.quickActionsHint}
                    seeAllLabel={copy.seeAll}
                  />
                </div>
              </section>

              <section ref={communityRef} style={{ ...sectionStyle, paddingBottom: 0 }}>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p style={eyebrowStyle}>{copy.browseEyebrow}</p>
                    <h3 style={sectionTitleStyle}>{copy.browseTitle}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-[0.92fr_0.92fr_1.16fr] gap-5">
                  <TopListColumn
                    title={copy.contentTitles.topSongs}
                    items={topSongs}
                    onItemClick={openSong}
                    onOpenDetail={() => setActiveSubView("top-songs")}
                    seeAllLabel={copy.seeAll}
                  />
                  <TopListColumn
                    title={copy.contentTitles.topTemplates}
                    items={topJamTracks}
                    onItemClick={openTemplate}
                    onOpenDetail={() => setActiveSubView("top-templates")}
                    seeAllLabel={copy.seeAll}
                  />
                  <EntranceWorkspaceTutorialPanel
                    title={copy.tutorialTitle}
                    seeAllLabel={copy.seeAll}
                    partUnit={copy.tutorialPartUnit}
                    railBorder={shellTone.railBorder}
                    courses={tutorialCourses}
                    onSeeAll={() => setActiveSubView("tutorials")}
                    onOpenTutorial={openTutorial}
                  />
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div
            className="min-h-0 flex-1 overflow-y-auto"
            style={isLooperFullscreen ? { padding: 0 } : { padding: "24px 30px 40px" }}
          >
            {activeSubView === "looper" ? (
              <LooperPage
                onBack={() => setActiveSubView("home")}
                initialFilter={looperInitialFilter}
              />
            ) : activeSubView === "instant-backing-track" ? (
              <InstantBackingTrackPage
                onBack={() => setActiveSubView("home")}
                initialFilter={backingTrackInitialFilter}
              />
            ) : activeSubView === "quick-actions" ? (
              <QuickActionsPage
                actions={quickActions}
                onBack={() => setActiveSubView("home")}
                title={copy.contentTitles.quickActions}
                description={copy.quickActionsPageDescription}
                backLabel={copy.back}
              />
            ) : activeSubView === "top-songs" ? (
              <TopBrowsePage
                title={copy.contentTitles.topSongs}
                items={topSongs}
                onBack={() => setActiveSubView("home")}
                onItemClick={openSong}
                backLabel={copy.back}
              />
            ) : activeSubView === "top-templates" ? (
              <TopBrowsePage
                title={copy.contentTitles.topTemplates}
                items={topJamTracks}
                onBack={() => setActiveSubView("home")}
                onItemClick={openTemplate}
                backLabel={copy.back}
              />
            ) : (
              <TopBrowsePage
                title={copy.contentTitles.tutorials}
                items={tutorialBrowseItems}
                onBack={() => setActiveSubView("home")}
                onItemClick={(item) => {
                  const tutorial = tutorialCourses.find(
                    (source) => source.title === item.title,
                  );
                  if (tutorial) {
                    openTutorial(tutorial);
                  }
                }}
                backLabel={copy.back}
              />
            )}
          </div>
        )}
      </main>

      <ProjectsSheet open={projectsOpen} onOpenChange={setProjectsOpen} />
      <TemplateSheet
        open={templateOpen}
        onClose={() => setTemplateOpen(false)}
        template={selectedTemplate}
        mode="template"
      />
      <TemplateSheet
        open={songOpen}
        onClose={() => setSongOpen(false)}
        template={selectedSong}
        mode="song"
      />
      <TemplateSheet
        open={guitarOpen}
        onClose={() => setGuitarOpen(false)}
        template={selectedGuitarClip}
        mode="guitar"
      />
      <TutorialDialog
        open={tutorialOpen}
        onOpenChange={setTutorialOpen}
        tutorial={selectedTutorial}
      />
      </div>
    </EntranceLocaleProvider>
  );
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: "var(--secondary)",
  fontSize: 12,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  fontWeight: 700,
};

const railHeadingStyle: CSSProperties = {
  margin: "3px 0 0",
  color: "var(--foreground)",
  fontSize: 26,
  lineHeight: 1.02,
  letterSpacing: "-0.03em",
  fontWeight: 700,
};

const iconButtonStyle: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 999,
  border: "none",
  backgroundColor: "transparent",
  color: "var(--foreground)",
  cursor: "pointer",
};

const languageSelectWrapStyle: CSSProperties = {
  position: "relative",
  minWidth: 118,
};

const languageSelectStyle: CSSProperties = {
  width: "100%",
  height: 44,
  padding: "0 34px 0 14px",
  borderRadius: 999,
  border: "1px solid color-mix(in srgb, var(--border) 78%, transparent)",
  backgroundColor: "color-mix(in srgb, var(--card) 78%, transparent)",
  color: "var(--foreground)",
  fontSize: 13,
  fontWeight: 600,
  appearance: "none",
  outline: "none",
  cursor: "pointer",
};

const languageSelectIconStyle: CSSProperties = {
  position: "absolute",
  top: "50%",
  right: 13,
  transform: "translateY(-50%)",
  color: "var(--secondary)",
  pointerEvents: "none",
};

const sidebarSectionStyle: CSSProperties = {
  paddingTop: 22,
  borderTop: "1px solid color-mix(in srgb, var(--border) 76%, transparent)",
};

const sidebarSectionLabelStyle: CSSProperties = {
  margin: 0,
  color: "var(--foreground)",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const sidebarProjectListStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  paddingRight: 2,
};

const topTitleStyle: CSSProperties = {
  margin: "4px 0 0",
  color: "var(--foreground)",
  fontSize: 26,
  fontWeight: 700,
  letterSpacing: "-0.02em",
};

const sectionStyle: CSSProperties = {
  paddingBottom: 28,
};
