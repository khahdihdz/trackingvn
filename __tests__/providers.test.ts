import { describe, expect, it } from "vitest";
import { ALL_PROVIDERS } from "@/providers";

describe("provider contract", () => {
  it("every provider implements the required interface", () => {
    for (const p of ALL_PROVIDERS) {
      expect(typeof p.id).toBe("string");
      expect(typeof p.name).toBe("string");
      expect(typeof p.detect).toBe("function");
      expect(typeof p.track).toBe("function");
      expect(typeof p.getOfficialUrl).toBe("function");
    }
  });

  it("every provider has a unique id", () => {
    const ids = ALL_PROVIDERS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("unverified providers return UNAVAILABLE with an official URL, never fabricated data", async () => {
    for (const p of ALL_PROVIDERS.filter((p) => !p.verified)) {
      const result = await p.track("TESTCODE123");
      expect(result.success).toBe(false);
      expect(result.unavailableReason).toBeTruthy();
      expect(result.officialUrl).toContain("http");
      expect(result.events).toHaveLength(0);
    }
  });

  it("getOfficialUrl always returns a valid absolute URL", () => {
    for (const p of ALL_PROVIDERS) {
      const url = p.getOfficialUrl("ABC123");
      expect(() => new URL(url)).not.toThrow();
    }
  });
});
