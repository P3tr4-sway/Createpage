import { render, screen } from "@testing-library/react";
import { EntranceLocaleProvider } from "../src/features/entrance/EntranceLocaleContext";
import { LooperPage } from "../src/features/entrance/pages/LooperPage";

describe("LooperPage", () => {
  it("aligns the loop library overlay positioning with jamy", () => {
    render(
      <EntranceLocaleProvider locale="en">
        <LooperPage onBack={vi.fn()} />
      </EntranceLocaleProvider>,
    );

    const library = screen.getByRole("complementary");

    expect(library).toHaveClass("top-[88px]");
    expect(library).toHaveClass("bottom-[88px]");
    expect(library).toHaveClass("right-4");
  });
});
