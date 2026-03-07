import { useReducer } from "react";

export type SectionId = "studio" | "launch" | "community";
export type FullscreenView = "agentic-producing" | null;
export type HomeSubView =
  | "home"
  | "looper"
  | "instant-backing-track"
  | "quick-actions"
  | "top-songs"
  | "top-templates"
  | "tutorials";

interface EntranceViewState {
  activeSection: SectionId;
  pendingScrollTarget: SectionId | null;
  fullscreenView: FullscreenView;
  activeSubView: HomeSubView;
  projectsOpen: boolean;
  templateOpen: boolean;
  songOpen: boolean;
  guitarOpen: boolean;
  tutorialOpen: boolean;
}

type EntranceViewAction =
  | { type: "set-active-section"; payload: SectionId }
  | { type: "set-pending-scroll-target"; payload: SectionId | null }
  | { type: "set-fullscreen-view"; payload: FullscreenView }
  | { type: "set-active-subview"; payload: HomeSubView }
  | { type: "set-projects-open"; payload: boolean }
  | { type: "set-template-open"; payload: boolean }
  | { type: "set-song-open"; payload: boolean }
  | { type: "set-guitar-open"; payload: boolean }
  | { type: "set-tutorial-open"; payload: boolean };

const initialEntranceViewState: EntranceViewState = {
  activeSection: "studio",
  pendingScrollTarget: null,
  fullscreenView: null,
  activeSubView: "home",
  projectsOpen: false,
  templateOpen: false,
  songOpen: false,
  guitarOpen: false,
  tutorialOpen: false,
};

function entranceViewReducer(
  state: EntranceViewState,
  action: EntranceViewAction,
): EntranceViewState {
  switch (action.type) {
    case "set-active-section":
      return { ...state, activeSection: action.payload };
    case "set-pending-scroll-target":
      return { ...state, pendingScrollTarget: action.payload };
    case "set-fullscreen-view":
      return { ...state, fullscreenView: action.payload };
    case "set-active-subview":
      return { ...state, activeSubView: action.payload };
    case "set-projects-open":
      return { ...state, projectsOpen: action.payload };
    case "set-template-open":
      return { ...state, templateOpen: action.payload };
    case "set-song-open":
      return { ...state, songOpen: action.payload };
    case "set-guitar-open":
      return { ...state, guitarOpen: action.payload };
    case "set-tutorial-open":
      return { ...state, tutorialOpen: action.payload };
    default:
      return state;
  }
}

export function useEntranceViewState() {
  const [viewState, dispatch] = useReducer(
    entranceViewReducer,
    initialEntranceViewState,
  );

  return {
    viewState,
    setActiveSection: (value: SectionId) =>
      dispatch({ type: "set-active-section", payload: value }),
    setPendingScrollTarget: (value: SectionId | null) =>
      dispatch({ type: "set-pending-scroll-target", payload: value }),
    setFullscreenView: (value: FullscreenView) =>
      dispatch({ type: "set-fullscreen-view", payload: value }),
    setActiveSubView: (value: HomeSubView) =>
      dispatch({ type: "set-active-subview", payload: value }),
    setProjectsOpen: (value: boolean) =>
      dispatch({ type: "set-projects-open", payload: value }),
    setTemplateOpen: (value: boolean) =>
      dispatch({ type: "set-template-open", payload: value }),
    setSongOpen: (value: boolean) =>
      dispatch({ type: "set-song-open", payload: value }),
    setGuitarOpen: (value: boolean) =>
      dispatch({ type: "set-guitar-open", payload: value }),
    setTutorialOpen: (value: boolean) =>
      dispatch({ type: "set-tutorial-open", payload: value }),
  };
}
