import { describe, expect, it } from "vitest";
import { detectCarriers, normalizeTrackingCode } from "@/lib/detector";
import { ALL_PROVIDERS } from "@/providers";
import { isValidTrackingCode } from "@/lib/validate";

describe("normalizeTrackingCode", () => {
  it("trims whitespace and uppercases", () => {
    expect(normalizeTrackingCode("  abc 123 ")).toBe("ABC123");
  });
});

describe("isValidTrackingCode", () => {
  it("accepts reasonable alphanumeric codes", () => {
    expect(isValidTrackingCode("ABC123456")).toBe(true);
  });

  it("rejects codes that are too short", () => {
    expect(isValidTrackingCode("AB")).toBe(false);
  });

  it("rejects codes with disallowed characters", () => {
    expect(isValidTrackingCode("ABC<script>")).toBe(false);
  });

  it("rejects overly long codes", () => {
    expect(isValidTrackingCode("A".repeat(50))).toBe(false);
  });
});

describe("detectCarriers", () => {
  it("returns candidate providers for a numeric Viettel Post-like code", () => {
    const results = detectCarriers("123456789012", ALL_PROVIDERS);
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.provider.id === "viettelpost")).toBe(true);
  });

  it("returns an empty list for a code matching nothing", () => {
    const results = detectCarriers("!!", ALL_PROVIDERS);
    expect(results).toHaveLength(0);
  });
});
