import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, requestJson } from "@/services/api-client";

afterEach(() => vi.unstubAllGlobals());

describe("requestJson", () => {
  it("returns JSON for a successful response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ value: 42 }), {
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    await expect(requestJson("/example")).resolves.toEqual({ value: 42 });
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:4000/api/example",
      expect.objectContaining({ credentials: "include" }),
    );
  });

  it("preserves caller headers and adds JSON content type for string bodies", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    await requestJson("/example", {
      method: "POST",
      body: JSON.stringify({ value: 42 }),
      headers: { "X-Request-Source": "test" },
    });

    const options = fetch.mock.calls[0][1];
    expect(options.headers).toBeInstanceOf(Headers);
    expect(options.headers.get("Content-Type")).toBe("application/json");
    expect(options.headers.get("X-Request-Source")).toBe("test");
  });

  it("throws a structured API error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ error: { code: "NOPE", message: "Not allowed" } }),
          {
            status: 403,
            headers: { "Content-Type": "application/json" },
          },
        ),
      ),
    );

    await expect(requestJson("/example")).rejects.toMatchObject({
      name: "ApiError",
      message: "Not allowed",
      status: 403,
      code: "NOPE",
    });
    expect(ApiError).toBeDefined();
  });
});
