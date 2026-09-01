import { describe, expect, it } from "vitest";
import { maskPhone, maskTrackingCode } from "@/lib/privacy";

describe("maskPhone", () => {
  it("masks middle digits of a 10-digit phone number", () => {
    expect(maskPhone("0912345678")).toBe("091****678");
  });

  it("returns undefined for undefined input", () => {
    expect(maskPhone(undefined)).toBeUndefined();
  });
});

describe("maskTrackingCode", () => {
  it("keeps only the last 3 characters visible", () => {
    expect(maskTrackingCode("ABC123456789")).toBe("*********789");
  });
});
