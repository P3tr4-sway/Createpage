import { fireEvent, render, screen } from "@testing-library/react";
import { EntranceLocaleProvider } from "../src/features/entrance/EntranceLocaleContext";
import { JamyPage } from "../src/features/entrance/pages/JamyPage";

describe("JamyPage", () => {
  it("supports recording a take and adding a new jam track", () => {
    render(
      <EntranceLocaleProvider locale="en">
        <JamyPage onBack={vi.fn()} />
      </EntranceLocaleProvider>,
    );

    expect(screen.getByText("2 tracks ready")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Record" }));
    fireEvent.click(screen.getByRole("button", { name: "Record" }));

    expect(screen.getByText("Take 01")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Add track" }));

    expect(screen.getByText("3 tracks ready")).toBeInTheDocument();
    expect(screen.getByText("Track 3")).toBeInTheDocument();
  });

  it("keeps the jam library as an overlay without rendering a separate backdrop layer", () => {
    render(
      <EntranceLocaleProvider locale="en">
        <JamyPage onBack={vi.fn()} />
      </EntranceLocaleProvider>,
    );

    expect(screen.queryByTestId("jam-library-backdrop")).not.toBeInTheDocument();
    expect(screen.getByRole("complementary")).toBeInTheDocument();
  });
});
