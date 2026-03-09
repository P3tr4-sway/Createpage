import { fireEvent, render, screen } from "@testing-library/react";
import { EntranceLocaleProvider } from "../src/features/entrance/EntranceLocaleContext";
import { JamyPage } from "../src/features/entrance/pages/JamyPage";

describe("JamyPage", () => {
  it("shows jam-specific AI suggestions across recording and add-track states", () => {
    render(
      <EntranceLocaleProvider locale="en">
        <JamyPage onBack={vi.fn()} />
      </EntranceLocaleProvider>,
    );

    expect(
      screen.getByRole("button", {
        name: "Generate a backing track that fits my vibe",
      }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Record" }));
    fireEvent.click(screen.getByRole("button", { name: "Record" }));

    expect(
      screen.getByRole("button", { name: "Make the guitar brighter" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Take 01")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Add track" }));

    expect(
      screen.getByRole("button", { name: "Generate a bass line" }),
    ).toBeInTheDocument();
  });
});
