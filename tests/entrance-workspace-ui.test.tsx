import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { LOCALE_STORAGE_KEY } from "../src/features/entrance/i18n/entrance.copy";
import { EntranceWorkspaceHero } from "../src/features/entrance/workspace/EntranceWorkspaceHero";
import {
  QuickAccessCarousel,
  TopBrowsePage,
  type QuickAction,
} from "../src/features/entrance/workspace/EntranceWorkspaceBrowse";
import { EntranceWorkspace } from "../src/features/entrance/workspace/EntranceWorkspace";
import type { BrowseItem, HeroPromptSuggestion } from "../src/features/entrance/model/entrance.types";

vi.mock("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: "dark",
    setTheme: vi.fn(),
  }),
}));

vi.mock("../src/features/entrance/pages/AgenticProducingPage", () => ({
  AgenticProducingPage: ({ previewMode = false }: { previewMode?: boolean }) => (
    <div>{previewMode ? "agentic-preview" : "agentic-page"}</div>
  ),
}));

vi.mock("../src/features/entrance/components/JamWithAI", () => ({
  JamWithAI: () => <div>jam-with-ai</div>,
}));

vi.mock("../src/features/entrance/components/ProjectsSheet", () => ({
  ProjectsSheet: () => null,
}));

vi.mock("../src/features/entrance/components/TemplateSheet", () => ({
  TemplateSheet: () => null,
}));

vi.mock("../src/features/entrance/components/TutorialDialog", async () => {
  const actual = await vi.importActual<
    typeof import("../src/features/entrance/components/TutorialDialog")
  >("../src/features/entrance/components/TutorialDialog");

  return {
    ...actual,
    TutorialDialog: () => null,
  };
});

describe("EntranceWorkspaceHero", () => {
  it("opens prompt actions and forwards suggestion selection", () => {
    const handlePromptOpen = vi.fn();
    const handlePromptChange = vi.fn();
    const handlePromptSelect = vi.fn();
    const suggestions: HeroPromptSuggestion[] = [
      { tag: "Trap", title: "Trap starter", prompt: "Start a trap beat." },
      { tag: "Jazz", title: "Jazz starter", prompt: "Start a jazz groove." },
      { tag: "Pop", title: "Pop starter", prompt: "Start a pop chorus." },
      { tag: "Soul", title: "Soul starter", prompt: "Start a neo-soul pocket." },
    ];

    render(
      <EntranceWorkspaceHero
        sectionRef={createRef<HTMLDivElement>()}
        height="480px"
        contentInset={32}
        previewCanvasWidth={1280}
        previewZoom={1.1}
        previewFocusX={0.42}
        tone={{
          heroFrameBg: "#111111",
          railBorder: "rgba(255,255,255,0.12)",
          heroScrim: "rgba(0,0,0,0.35)",
          heroHintBg: "rgba(255,255,255,0.1)",
          heroHintBorder: "rgba(255,255,255,0.2)",
          heroBridge: "linear-gradient(180deg, transparent, rgba(0,0,0,0.4))",
        }}
        openFullWorkspaceAriaLabel="Open full workspace"
        previewEyebrow="Full DAW"
        previewLabel="Tap anywhere to start."
        sloganTitle="Start with the idea."
        promptPlaceholder="Start with your AI Music Producer."
        promptStartLabel="Start"
        promptShowMoreLabel="Show more"
        promptEmptyLabel="No prompts"
        promptValue="trap"
        promptOpen
        filteredSuggestions={suggestions}
        visibleSuggestions={suggestions.slice(0, 3)}
        fieldRef={createRef<HTMLDivElement>()}
        inputRef={createRef<HTMLInputElement>()}
        onOpenWorkspace={vi.fn()}
        onPromptOpen={handlePromptOpen}
        onPromptChange={handlePromptChange}
        onPromptSelect={handlePromptSelect}
      />,
    );

    fireEvent.click(screen.getByPlaceholderText("Start with your AI Music Producer."));
    fireEvent.change(screen.getByDisplayValue("trap"), {
      target: { value: "trap drums" },
    });
    fireEvent.click(screen.getByText("Start a trap beat."));

    expect(handlePromptOpen).toHaveBeenCalledTimes(1);
    expect(handlePromptChange).toHaveBeenCalledWith("trap drums");
    expect(handlePromptSelect).toHaveBeenCalledWith("Start a trap beat.");
    expect(screen.getByText("Show more")).toBeInTheDocument();
    expect(screen.getByText("agentic-preview")).toBeInTheDocument();
  });
});

describe("Entrance workspace browse components", () => {
  it("renders quick actions and detail pages with working callbacks", () => {
    const handleSeeAll = vi.fn();
    const handleBrowseClick = vi.fn();
    const actions: QuickAction[] = [
      {
        id: "make-song",
        title: "Late-night jazz fusion",
        meta: "Turn a motif into a section",
        tag: "Jazz Fusion",
        imageUrl: "https://example.com/action.jpg",
        onClick: vi.fn(),
      },
    ];
    const items: BrowseItem[] = [
      {
        id: "neon-hearts",
        title: "Neon Hearts",
        author: "Ava Li",
        imageUrl: "https://example.com/song.jpg",
        avatarInitial: "A",
      },
    ];

    const { rerender } = render(
      <QuickAccessCarousel
        actions={actions}
        onSeeAll={handleSeeAll}
        heading="Quick Actions"
        hint="Fast ways to start."
        seeAllLabel="See all"
      />,
    );

    fireEvent.click(screen.getByText("See all"));
    fireEvent.click(screen.getByText("Late-night jazz fusion"));

    expect(handleSeeAll).toHaveBeenCalledTimes(1);
    expect(actions[0].onClick).toHaveBeenCalledTimes(1);

    rerender(
      <TopBrowsePage
        title="Top Songs"
        items={items}
        onBack={vi.fn()}
        onItemClick={handleBrowseClick}
        backLabel="Back"
      />,
    );

    fireEvent.click(screen.getByText("Neon Hearts"));

    expect(screen.getByText("Top Songs")).toBeInTheDocument();
    expect(handleBrowseClick).toHaveBeenCalledWith(items[0]);
  });
});

describe("EntranceWorkspace integration", () => {
  it("switches from home to quick actions and back", () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "en");

    render(<EntranceWorkspace />);

    expect(
      screen.queryByText(
        "Pick a concrete starting point and jump directly into the right flow.",
      ),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: "See all" })[0]);

    expect(
      screen.getByText(
        "Pick a concrete starting point and jump directly into the right flow.",
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: "Back" })[0]);

    expect(
      screen.queryByText(
        "Pick a concrete starting point and jump directly into the right flow.",
      ),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Start with the idea.")).toBeInTheDocument();
  });

  it("switches between create and play boards from the top rail", () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "en");

    render(<EntranceWorkspace />);

    expect(screen.getByText("Start with the idea.")).toBeInTheDocument();
    expect(screen.queryByText("jam-with-ai")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Play" }));

    expect(screen.getByText("jam-with-ai")).toBeInTheDocument();
    expect(screen.getByText("Start playing right away.")).toBeInTheDocument();
    expect(screen.queryByText("Start with the idea.")).not.toBeInTheDocument();
  });
});
