import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageLoader } from "@/components/ui/page-loader";

describe("PageLoader", () => {
  it("announces its loading state", () => {
    render(<PageLoader label="Loading cart" />);
    expect(screen.getByLabelText("Loading cart")).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });
});
