import { describe, expect, it } from "vitest";
import { getErrorMessage } from "@/lib/error-message";

describe("getErrorMessage", () => {
  it("returns an Error message", () => {
    expect(getErrorMessage(new Error("Request failed"), "Fallback")).toBe(
      "Request failed",
    );
  });

  it("returns the fallback for unknown error values", () => {
    expect(getErrorMessage(null, "Fallback")).toBe("Fallback");
  });
});
