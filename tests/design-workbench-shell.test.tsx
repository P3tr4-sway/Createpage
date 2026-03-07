import { render, screen } from "@testing-library/react";
import { DesignWorkbenchShell } from "../src/app/shell/DesignWorkbenchShell";

describe("DesignWorkbenchShell", () => {
  it("renders nested content", () => {
    render(
      <DesignWorkbenchShell>
        <div>shell-content</div>
      </DesignWorkbenchShell>,
    );

    expect(screen.getByText("shell-content")).toBeInTheDocument();
  });
});
