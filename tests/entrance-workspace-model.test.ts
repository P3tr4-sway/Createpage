import { tutorialCourses } from "../src/features/entrance/components/TutorialDialog";
import { copyByLocale } from "../src/features/entrance/i18n/entrance.copy";
import {
  guitarClips,
  hipHopStarterTemplate,
  topJamTracks,
  topSongs,
} from "../src/features/entrance/model/entrance.mock";
import {
  buildCreateActions,
  buildQuickActions,
  buildSidebarProjects,
  buildTutorialBrowseItems,
  filterHeroPromptSuggestions,
  getContentTitle,
  getVisibleHeroPromptSuggestions,
} from "../src/features/entrance/workspace/EntranceWorkspace.model";

describe("EntranceWorkspace model selectors", () => {
  it("maps create actions to the expected callbacks", () => {
    const handleOpenWorkspace = vi.fn();
    const handleOpenLooper = vi.fn();
    const handleOpenGuitar = vi.fn();
    const handleScrollTo = vi.fn();

    const actions = buildCreateActions({
      copy: copyByLocale.en,
      guitarClips,
      onOpenWorkspace: handleOpenWorkspace,
      onOpenLooper: handleOpenLooper,
      onOpenGuitar: handleOpenGuitar,
      onScrollTo: handleScrollTo,
    });

    actions.find((action) => action.id === "start-song")?.onClick();
    actions.find((action) => action.id === "open-looper")?.onClick();
    actions.find((action) => action.id === "try-guitar-riff")?.onClick();
    actions.find((action) => action.id === "jam-vibe")?.onClick();

    expect(actions).toHaveLength(4);
    expect(handleOpenWorkspace).toHaveBeenCalledTimes(1);
    expect(handleOpenLooper).toHaveBeenCalledWith("Hot");
    expect(handleOpenGuitar).toHaveBeenCalledWith(
      expect.objectContaining({ id: "g1" }),
    );
    expect(handleScrollTo).toHaveBeenCalledWith("launch");
  });

  it("derives quick actions, tutorial browse items, and content titles", () => {
    const handleOpenWorkspace = vi.fn();
    const handleScrollTo = vi.fn();
    const handleOpenLooper = vi.fn();
    const handleOpenBackingTrack = vi.fn();
    const handleOpenTemplate = vi.fn();
    const handleOpenGuitar = vi.fn();

    const quickActions = buildQuickActions({
      copy: copyByLocale.en,
      topSongs,
      guitarClips,
      hipHopStarterTemplate,
      onOpenWorkspace: handleOpenWorkspace,
      onScrollTo: handleScrollTo,
      onOpenLooper: handleOpenLooper,
      onOpenBackingTrack: handleOpenBackingTrack,
      onOpenTemplate: handleOpenTemplate,
      onOpenGuitar: handleOpenGuitar,
    });
    const tutorialItems = buildTutorialBrowseItems(
      tutorialCourses,
      copyByLocale.en.tutorialPartUnit,
    );

    quickActions.find((action) => action.id === "make-hip-hop-idea")?.onClick();

    expect(quickActions).toHaveLength(6);
    expect(
      quickActions.find((action) => action.id === "make-song")?.imageUrl,
    ).toBe(topSongs.find((item) => item.id === "midnight-echoes")?.imageUrl);
    expect(handleOpenTemplate).toHaveBeenCalledWith(hipHopStarterTemplate);
    expect(tutorialItems[0].id).toBe(tutorialCourses[0].id);
    expect(tutorialItems[0].author).toContain(copyByLocale.en.tutorialPartUnit);
    expect(getContentTitle("quick-actions", copyByLocale.en.contentTitles)).toBe(
      copyByLocale.en.contentTitles.quickActions,
    );
  });

  it("keeps CTA and preview mapping stable when source arrays are reordered", () => {
    const handleOpenWorkspace = vi.fn();
    const handleOpenLooper = vi.fn();
    const handleOpenGuitar = vi.fn();
    const handleScrollTo = vi.fn();
    const handleOpenTemplate = vi.fn();
    const handleOpenBackingTrack = vi.fn();

    const reorderedCopy = {
      ...copyByLocale.en,
      createActions: [...copyByLocale.en.createActions].reverse(),
      sidebarProjects: [...copyByLocale.en.sidebarProjects].reverse(),
      quickActions: [...copyByLocale.en.quickActions].reverse(),
    };
    const reorderedSongs = [...topSongs].reverse();
    const reorderedTracks = [...topJamTracks].reverse();
    const reorderedGuitarClips = [...guitarClips].reverse();

    const createActions = buildCreateActions({
      copy: reorderedCopy,
      guitarClips: reorderedGuitarClips,
      onOpenWorkspace: handleOpenWorkspace,
      onOpenLooper: handleOpenLooper,
      onOpenGuitar: handleOpenGuitar,
      onScrollTo: handleScrollTo,
    });
    const sidebarProjects = buildSidebarProjects({
      copy: reorderedCopy,
      guitarClips: reorderedGuitarClips,
      topJamTracks: reorderedTracks,
      onOpenWorkspace: handleOpenWorkspace,
      onOpenLooper: handleOpenLooper,
      onOpenGuitar: handleOpenGuitar,
      onOpenTemplate: handleOpenTemplate,
      onOpenBackingTrack: handleOpenBackingTrack,
    });
    const quickActions = buildQuickActions({
      copy: reorderedCopy,
      topSongs: reorderedSongs,
      guitarClips: reorderedGuitarClips,
      hipHopStarterTemplate,
      onOpenWorkspace: handleOpenWorkspace,
      onScrollTo: handleScrollTo,
      onOpenLooper: handleOpenLooper,
      onOpenBackingTrack: handleOpenBackingTrack,
      onOpenTemplate: handleOpenTemplate,
      onOpenGuitar: handleOpenGuitar,
    });

    createActions.find((action) => action.id === "try-guitar-riff")?.onClick();
    sidebarProjects.find((project) => project.id === "house-drum-starter")?.onClick();
    quickActions.find((action) => action.id === "make-song")?.onClick();

    expect(handleOpenGuitar).toHaveBeenCalledWith(
      expect.objectContaining({ id: "g1" }),
    );
    expect(handleOpenTemplate).toHaveBeenCalledWith(
      expect.objectContaining({ id: "basement-funk-run" }),
    );
    expect(
      quickActions.find((action) => action.id === "make-song")?.imageUrl,
    ).toBe(topSongs.find((item) => item.id === "midnight-echoes")?.imageUrl);
  });

  it("filters and limits hero prompt suggestions", () => {
    const filtered = filterHeroPromptSuggestions(
      copyByLocale.en.heroPromptSuggestions,
      "trap",
    );
    const visible = getVisibleHeroPromptSuggestions(filtered, 2);

    expect(filtered.length).toBeGreaterThan(0);
    expect(
      filtered.every((suggestion) =>
        [suggestion.tag, suggestion.title, suggestion.prompt]
          .join(" ")
          .toLowerCase()
          .includes("trap"),
      ),
    ).toBe(true);
    expect(visible).toHaveLength(Math.min(filtered.length, 2));
  });
});
