import { describe, expect, it } from "vitest";
import { normalizeStatus } from "@/lib/normalizer";

describe("normalizeStatus", () => {
  it("maps Vietnamese delivered phrases to DELIVERED", () => {
    expect(normalizeStatus("Đã giao hàng").code).toBe("DELIVERED");
    expect(normalizeStatus("Giao thành công").code).toBe("DELIVERED");
    expect(normalizeStatus("Delivered").code).toBe("DELIVERED");
  });

  it("maps in-transit phrases to IN_TRANSIT", () => {
    expect(normalizeStatus("Đang vận chuyển").code).toBe("IN_TRANSIT");
    expect(normalizeStatus("In transit").code).toBe("IN_TRANSIT");
  });

  it("maps out-for-delivery phrases to OUT_FOR_DELIVERY", () => {
    expect(normalizeStatus("Đang giao hàng").code).toBe("OUT_FOR_DELIVERY");
  });

  it("maps return phrases", () => {
    expect(normalizeStatus("Hoàn hàng").code).toBe("RETURNING");
    expect(normalizeStatus("Đã hoàn hàng").code).toBe("RETURNED");
  });

  it("maps cancellation", () => {
    expect(normalizeStatus("Đã hủy đơn").code).toBe("CANCELLED");
  });

  it("falls back to UNKNOWN for unrecognized text, preserving original as description", () => {
    const result = normalizeStatus("Trạng thái lạ xyz");
    expect(result.code).toBe("UNKNOWN");
    expect(result.description).toBe("Trạng thái lạ xyz");
  });
});
