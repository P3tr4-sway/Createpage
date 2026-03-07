import { copyByLocale } from "../src/features/entrance/i18n/entrance.copy";
import {
  guitarClips,
  hipHopStarterTemplate,
  topSongs,
} from "../src/features/entrance/model/entrance.mock";
import {
  buildCreateActions,
  buildQuickActions,
  buildTutorialBrowseItems,
  filterHeroPromptSuggestions,
  getContentTitle,
  getVisibleHeroPromptSuggestions,
} from "../src/features/entrance/workspace/EntranceWorkspace.model";
import { tutorialCourses } from "../src/features/entrance/components/TutorialDialog";

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

    actions[0].onClick();
    actions[1].onClick();
    actions[2].onClick();
    actions[3].onClick();

    expect(actions).toHaveLength(4);
    expect(handleOpenWorkspace).toHaveBeenCalledTimes(1);
    expect(handleOpenLooper).toHaveBeenCalledWith("Hot");
    expect(handleOpenGuitar).toHaveBeenCalledWith(guitarClips[0]);
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

    quickActions[4].onClick();

    expect(quickActions).toHaveLength(6);
    expect(quickActions[0].imageUrl).toBe(topSongs[0].imageUrl);
    expect(handleOpenTemplate).toHaveBeenCalledWith(hipHopStarterTemplate);
    expect(tutorialItems[0].author).toContain(copyByLocale.en.tutorialPartUnit);
    expect(getContentTitle("quick-actions", copyByLocale.en.contentTitles)).toBe(
      copyByLocale.en.contentTitles.quickActions,
    );
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
