import {
  ArrowLeft,
  ChevronDown,
  Disc3,
  Guitar,
  Moon,
  Plus,
  Search,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { EntranceLocaleProvider, type Locale } from "@/features/entrance/EntranceLocaleContext";
import { AgenticProducingPage } from "@/features/entrance/pages/AgenticProducingPage";
import { InstantBackingTrackPage } from "@/features/entrance/pages/InstantBackingTrackPage";
import { JamyPage } from "@/features/entrance/pages/JamyPage";
import { LooperPage } from "@/features/entrance/pages/LooperPage";
import { ProjectsSheet } from "@/features/entrance/components/ProjectsSheet";
import { TemplateSheet } from "@/features/entrance/components/TemplateSheet";
import {
  TutorialDialog,
  tutorialCourses,
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
import { useEntranceViewState } from "@/features/entrance/state/useEntranceViewState";
import {
  buildQuickActions,
  buildSidebarProjects,
  buildTutorialBrowseItems,
  filterHeroPromptSuggestions,
  getContentTitle,
  getVisibleHeroPromptSuggestions,
} from "@/features/entrance/workspace/EntranceWorkspace.model";
import {
  LoopLaunchPanel,
  SidebarProjectListItem,
  SidebarStartAction,
} from "@/features/entrance/workspace/EntranceWorkspacePanels";
import type {
  SidebarProject,
} from "@/features/entrance/workspace/EntranceWorkspace.types";
import {
  QuickAccessCarousel,
  QuickActionsPage,
  TopBrowsePage,
  TopListColumn,
} from "@/features/entrance/workspace/EntranceWorkspaceBrowse";
import { EntranceWorkspaceHero } from "@/features/entrance/workspace/EntranceWorkspaceHero";
import { EntranceWorkspaceTutorialPanel } from "@/features/entrance/workspace/EntranceWorkspaceTutorialPanel";
import {
  secondaryButtonStyle,
  sectionDescriptionStyle,
  sectionTitleStyle,
} from "@/features/entrance/workspace/EntranceWorkspaceBrowse.styles";
import { getEntranceWorkspaceTone } from "@/features/entrance/workspace/EntranceWorkspace.theme";
import {
  eyebrowStyle,
  iconButtonStyle,
  languageSelectIconStyle,
  languageSelectStyle,
  languageSelectWrapStyle,
  railHeadingStyle,
  sidebarProjectListStyle,
  sidebarSectionLabelStyle,
  sidebarSectionStyle,
  sidebarViewAllStyle,
  topTitleStyle,
  workspaceSectionStyle,
} from "@/features/entrance/workspace/EntranceWorkspace.styles";
import { useEntranceWorkspaceController } from "@/features/entrance/workspace/useEntranceWorkspaceController";

export function EntranceWorkspace() {
  const {
    viewState: {
      activeBoard,
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
    setActiveBoard,
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
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = mounted ? resolvedTheme === "dark" : true;
  const copy = copyByLocale[locale];
  const {
    switchBoard,
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
    openJamyWorkspace,
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
  } = useEntranceWorkspaceController({
    activeBoard,
    activeSection,
    activeSubView,
    pendingScrollTarget,
    setActiveBoard,
    setActiveSection,
    setPendingScrollTarget,
    setActiveSubView,
    setFullscreenView,
    setTemplateOpen,
    setSongOpen,
    setGuitarOpen,
    setTutorialOpen,
  });

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

  const shellTone = useMemo(() => getEntranceWorkspaceTone(isDark), [isDark]);
  const isPlayBoard = activeBoard === "play";

  const sidebarStartItems = useMemo(
    () =>
      isPlayBoard
        ? [
            {
              id: "looper",
              label: "Open Looper",
              icon: Disc3,
              onClick: () => openLooperWorkspace("Hot"),
            },
            {
              id: "jamy",
              label: "Start Jam",
              icon: Guitar,
              onClick: openJamyWorkspace,
            },
            {
              id: "backing-track",
              label: "Backing Tracks",
              icon: Search,
              onClick: () => openBackingTrackWorkspace("Hot"),
            },
          ]
        : [
            {
              id: "new-project",
              label: "New Project",
              icon: Plus,
              onClick: openAgenticWorkspace,
            },
            {
              id: "search-project",
              label: "Search Project",
              icon: Search,
              onClick: () => setProjectsOpen(true),
            },
          ],
    [
      handleScrollTo,
      isPlayBoard,
      openAgenticWorkspace,
      openBackingTrackWorkspace,
      openLooperWorkspace,
      setProjectsOpen,
    ],
  );

  const sidebarProjects = useMemo<SidebarProject[]>(
    () =>
      buildSidebarProjects({
        copy,
        guitarClips,
        topJamTracks,
        onOpenWorkspace: openAgenticWorkspace,
        onOpenLooper: openLooperWorkspace,
        onOpenGuitar: openGuitar,
        onOpenTemplate: openTemplate,
        onOpenBackingTrack: openBackingTrackWorkspace,
      }),
    [
      copy,
      openAgenticWorkspace,
      openBackingTrackWorkspace,
      openGuitar,
      openLooperWorkspace,
      openTemplate,
    ],
  );

  const quickActions = useMemo(
    () =>
      buildQuickActions({
        copy,
        topSongs,
        guitarClips,
        hipHopStarterTemplate,
        onOpenWorkspace: openAgenticWorkspace,
        onScrollTo: handleScrollTo,
        onOpenLooper: openLooperWorkspace,
        onOpenBackingTrack: openBackingTrackWorkspace,
        onOpenTemplate: openTemplate,
        onOpenGuitar: openGuitar,
      }),
    [
      copy,
      handleScrollTo,
      openAgenticWorkspace,
      openBackingTrackWorkspace,
      openGuitar,
      openLooperWorkspace,
      openTemplate,
    ],
  );
  const boardSidebarProjects = useMemo<SidebarProject[]>(() => {
    const createProjectIds = new Set([
      "late-night-arrangement",
      "dream-guitar-bed",
      "ambient-swells-notes",
    ]);

    return sidebarProjects.filter((project) =>
      isPlayBoard ? !createProjectIds.has(project.id) : createProjectIds.has(project.id),
    );
  }, [isPlayBoard, sidebarProjects]);
  const boardQuickActions = useMemo(() => {
    const createActionIds = new Set(["make-song", "make-hip-hop-idea"]);

    return quickActions.filter((action) =>
      isPlayBoard ? !createActionIds.has(action.id) : createActionIds.has(action.id),
    );
  }, [isPlayBoard, quickActions]);

  const filteredHeroPromptSuggestions = useMemo(
    () => filterHeroPromptSuggestions(copy.heroPromptSuggestions, heroPromptValue),
    [copy.heroPromptSuggestions, heroPromptValue],
  );

  const visibleHeroPromptSuggestions = useMemo(
    () => getVisibleHeroPromptSuggestions(filteredHeroPromptSuggestions),
    [filteredHeroPromptSuggestions],
  );

  const tutorialBrowseItems = useMemo(
    () => buildTutorialBrowseItems(tutorialCourses, copy.tutorialPartUnit),
    [copy.tutorialPartUnit],
  );

  const contentTitle = getContentTitle(activeSubView, copy.contentTitles);
  const homePreviewCanvasWidth = 1280;
  const homePreviewZoom = 1.14;
  const homePreviewFocusX = 0.42;
  const mainHeaderHeight = 72;
  const boardSwitcherHeight = 78;
  const isLooperFullscreen = activeSubView === "looper";
  const showMainHeader = activeSubView !== "home" && !isLooperFullscreen;
  const showSidebar = !isLooperFullscreen;
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

  if (fullscreenView === "jamy") {
    return (
      <EntranceLocaleProvider locale={locale}>
        <JamyPage onBack={() => setFullscreenView(null)} />
      </EntranceLocaleProvider>
    );
  }

  return (
    <EntranceLocaleProvider locale={locale}>
      <div
        className="relative flex h-full w-full flex-col overflow-hidden"
        style={{
          fontFamily: "var(--app-font-family)",
          background: shellTone.appBg,
        }}
      >
        <div
          className="relative shrink-0"
          style={{
            height: boardSwitcherHeight,
            minHeight: boardSwitcherHeight,
            backgroundColor: shellTone.mainHeaderBg,
            borderBottom: `1px solid ${shellTone.railBorder}`,
            backdropFilter: "blur(20px)",
          }}
        >
          <div
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center"
            style={{
              gap: 18,
            }}
          >
            {(["play", "create"] as const).map((board) => {
              const isActive = activeBoard === board;

              return (
                <button
                  key={board}
                  type="button"
                  onClick={() => switchBoard(board)}
                  className="tablet-touch-target tablet-pressable"
                  style={{
                    minWidth: 0,
                    height: "auto",
                    padding: 0,
                    border: "none",
                    borderRadius: 0,
                    backgroundColor: "transparent",
                    color: isActive ? "var(--foreground)" : "var(--secondary)",
                    fontSize: 22,
                    fontWeight: isActive ? 700 : 520,
                    letterSpacing: isActive ? "0.01em" : "0.02em",
                  }}
                >
                  {copy.boardSwitcher[board]}
                </button>
              );
            })}
          </div>

          <div
            className="absolute right-6 top-1/2 flex -translate-y-1/2 items-center gap-2"
            style={{ zIndex: 1 }}
          >
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

        <div className="flex min-h-0 flex-1 overflow-hidden">
          {showSidebar ? (
            <aside
              className="relative flex h-full shrink-0 flex-col"
              style={{
                width: sidebarWidth,
                minWidth: sidebarWidth,
                flexBasis: sidebarWidth,
                padding: `22px ${sidebarInlinePadding}px 14px`,
                background: shellTone.sidebarBackground,
                borderRight: `1px solid ${shellTone.railBorder}`,
                boxShadow: shellTone.sidebarShadow,
                zIndex: 2,
              }}
            >
              <div style={{ marginBottom: 18 }}>
                <h1 style={railHeadingStyle}>{copy.boardSwitcher[activeBoard]}</h1>
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
                    <div style={sidebarProjectListStyle}>
                      {sidebarStartItems.map((action) => (
                        <SidebarStartAction
                          key={action.id}
                          label={action.label}
                          icon={action.icon}
                          onClick={action.onClick}
                        />
                      ))}
                    </div>
                  </section>

                  <section
                    style={{
                      ...sidebarSectionStyle,
                      display: "flex",
                      minHeight: 0,
                      flex: 1,
                      flexDirection: "column",
                    }}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p style={sidebarSectionLabelStyle}>{copy.myProjects}</p>
                      <button
                        type="button"
                        onClick={() => setProjectsOpen(true)}
                        className="tablet-touch-target tablet-pressable"
                        style={sidebarViewAllStyle}
                      >
                        {copy.viewAll}
                      </button>
                    </div>

                    <div
                      className="min-h-0 flex-1 overflow-y-auto"
                      style={sidebarProjectListStyle}
                    >
                      {boardSidebarProjects.map((project) => (
                        <SidebarProjectListItem key={project.id} project={project} />
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </aside>
          ) : null}

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
                  className="tablet-touch-target tablet-pressable inline-flex items-center gap-2 rounded-[var(--radius-control)]"
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
                {isPlayBoard ? (
                  <div
                    style={{
                      padding: `28px ${mainContentInlinePadding}px 42px`,
                      background: shellTone.homeContentBackground,
                    }}
                  >
                    <section ref={launchRef} style={workspaceSectionStyle}>
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 style={sectionTitleStyle}>Start playing right away.</h3>
                          <p style={sectionDescriptionStyle}>
                            Jump into loops, jam starters, and backing tracks without opening a project first.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => openBackingTrackWorkspace("Hot")}
                          className="tablet-touch-target tablet-pressable inline-flex items-center gap-2 rounded-[var(--radius-control)]"
                          style={secondaryButtonStyle}
                        >
                          Backing Track
                        </button>
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
                            <JamWithAI onLaunch={openJamyWorkspace} />
                          </div>
                        </div>

                        <QuickAccessCarousel
                          actions={boardQuickActions}
                          onSeeAll={() => setActiveSubView("quick-actions")}
                          heading={copy.quickActionsHeading}
                          hint={copy.quickActionsHint}
                          seeAllLabel={copy.seeAll}
                        />
                      </div>
                    </section>

                    <section
                      ref={communityRef}
                      style={{ ...workspaceSectionStyle, paddingBottom: 0 }}
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p style={eyebrowStyle}>{copy.browseEyebrow}</p>
                          <h3 style={sectionTitleStyle}>{copy.browseTitle}</h3>
                        </div>
                      </div>

                      <div className="grid grid-cols-[0.92fr_0.92fr_1.16fr] gap-5">
                        <TopListColumn
                          title={copy.contentTitles.topTemplates}
                          items={topJamTracks}
                          onItemClick={openTemplate}
                          onOpenDetail={() => setActiveSubView("top-templates")}
                          seeAllLabel={copy.seeAll}
                        />
                        <TopListColumn
                          title={copy.contentTitles.topSongs}
                          items={topSongs}
                          onItemClick={openSong}
                          onOpenDetail={() => setActiveSubView("top-songs")}
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
                ) : (
                  <>
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
                      onOpenWorkspace={openAgenticWorkspace}
                      onPromptOpen={openHeroPrompt}
                      onPromptChange={updateHeroPromptValue}
                      onPromptSelect={handleHeroPromptSuggestionSelect}
                    />

                    <div
                      style={{
                        position: "relative",
                        zIndex: 1,
                        marginTop: -24,
                        padding: `92px ${mainContentInlinePadding}px 42px`,
                        background: shellTone.homeContentBackground,
                      }}
                    >
                      <section ref={launchRef} style={workspaceSectionStyle}>
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <h3 style={sectionTitleStyle}>Start from an idea.</h3>
                            <p style={sectionDescriptionStyle}>
                              Open a project workspace, capture a take, and keep AI available as a background assistant.
                            </p>
                          </div>
                        </div>

                        <QuickAccessCarousel
                          actions={boardQuickActions}
                          onSeeAll={() => setActiveSubView("quick-actions")}
                          heading={copy.quickActionsHeading}
                          hint={copy.quickActionsHint}
                          seeAllLabel={copy.seeAll}
                        />
                      </section>

                      <section
                        ref={communityRef}
                        style={{ ...workspaceSectionStyle, paddingBottom: 0 }}
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <div>
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
                  </>
                )}
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
                    actions={boardQuickActions}
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
      </div>
    </EntranceLocaleProvider>
  );
}
