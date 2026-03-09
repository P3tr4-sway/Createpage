import { act, renderHook } from "@testing-library/react";
import { useEntranceViewState } from "../src/features/entrance/state/useEntranceViewState";

describe("useEntranceViewState", () => {
  it("updates subview and panel visibility", () => {
    const { result } = renderHook(() => useEntranceViewState());

    act(() => {
      result.current.setActiveBoard("play");
      result.current.setActiveSubView("looper");
      result.current.setProjectsOpen(true);
      result.current.setTemplateOpen(true);
      result.current.setSongOpen(true);
      result.current.setGuitarOpen(true);
      result.current.setTutorialOpen(true);
      result.current.setActiveSection("community");
    });

    expect(result.current.viewState.activeBoard).toBe("play");
    expect(result.current.viewState.activeSubView).toBe("looper");
    expect(result.current.viewState.projectsOpen).toBe(true);
    expect(result.current.viewState.templateOpen).toBe(true);
    expect(result.current.viewState.songOpen).toBe(true);
    expect(result.current.viewState.guitarOpen).toBe(true);
    expect(result.current.viewState.tutorialOpen).toBe(true);
    expect(result.current.viewState.activeSection).toBe("community");
  });
});
