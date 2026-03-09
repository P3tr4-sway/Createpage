import { act, renderHook } from "@testing-library/react";
import { useEntranceWorkspaceController } from "../src/features/entrance/workspace/useEntranceWorkspaceController";

describe("useEntranceWorkspaceController", () => {
  it("opens workspace flows and updates local selections", () => {
    const setActiveBoard = vi.fn();
    const setActiveSection = vi.fn();
    const setPendingScrollTarget = vi.fn();
    const setActiveSubView = vi.fn();
    const setFullscreenView = vi.fn();
    const setTemplateOpen = vi.fn();
    const setSongOpen = vi.fn();
    const setGuitarOpen = vi.fn();
    const setTutorialOpen = vi.fn();

    const { result } = renderHook(() =>
      useEntranceWorkspaceController({
        activeBoard: "create",
        activeSection: "studio",
        activeSubView: "home",
        pendingScrollTarget: null,
        setActiveBoard,
        setActiveSection,
        setPendingScrollTarget,
        setActiveSubView,
        setFullscreenView,
        setTemplateOpen,
        setSongOpen,
        setGuitarOpen,
        setTutorialOpen,
      }),
    );

    act(() => {
      result.current.openAgenticWorkspace();
      result.current.openJamyWorkspace();
      result.current.openLooperWorkspace("Rock");
      result.current.openBackingTrackWorkspace("Blues");
      result.current.openHeroPrompt();
      result.current.updateHeroPromptValue("neo soul");
      result.current.handleHeroPromptSuggestionSelect("Start a neo-soul jam.");
    });

    expect(setFullscreenView).toHaveBeenCalledWith("agentic-producing");
    expect(setFullscreenView).toHaveBeenCalledWith("jamy");
    expect(setActiveBoard).toHaveBeenCalledWith("create");
    expect(setActiveBoard).toHaveBeenCalledWith("play");
    expect(setActiveSubView).toHaveBeenCalledWith("looper");
    expect(setActiveSubView).toHaveBeenCalledWith("instant-backing-track");
    expect(result.current.looperInitialFilter).toBe("Rock");
    expect(result.current.backingTrackInitialFilter).toBe("Blues");
    expect(result.current.heroPromptValue).toBe("Start a neo-soul jam.");
    expect(result.current.heroPromptOpen).toBe(false);
  });
});
