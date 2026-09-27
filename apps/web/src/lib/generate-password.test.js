import { afterEach, describe, expect, it, vi } from "vitest";
import { generatePassword } from "./generate-password";

describe("password generation", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("uses 24 cryptographically random bytes to produce a valid password", () => {
    const getRandomValues = vi.fn((bytes) => {
      bytes.set(Array.from({ length: 24 }, (_, index) => index));
      return bytes;
    });
    vi.stubGlobal("crypto", { getRandomValues });

    const password = generatePassword();

    expect(getRandomValues).toHaveBeenCalledOnce();
    expect(getRandomValues.mock.calls[0][0]).toHaveLength(24);
    expect(password).toHaveLength(32);
    expect(password).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(new TextEncoder().encode(password).length).toBeLessThanOrEqual(72);
  });
});
