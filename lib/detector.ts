import type { TrackingProvider } from "@/types/tracking";

/**
 * Chuẩn hóa mã vận đơn người dùng nhập: xóa khoảng trắng thừa, upper-case.
 * Không được đổi các ký tự có ý nghĩa (một số DVVC dùng mã có gạch nối).
 */
export function normalizeTrackingCode(input: string): string {
  return input.trim().replace(/\s+/g, "").toUpperCase();
}

export interface DetectionResult {
  provider: TrackingProvider;
  confidence: "high" | "low";
}

/**
 * Xếp hạng các provider có khả năng khớp với mã vận đơn.
 * Vì nhiều DVVC dùng format mã trùng nhau (số 10-12 chữ số...), không có gì là tuyệt đối:
 * ta chỉ xếp hạng theo độ đặc thù của pattern, không khẳng định chắc chắn.
 */
export function detectCarriers(
  trackingCode: string,
  providers: TrackingProvider[],
): DetectionResult[] {
  const code = normalizeTrackingCode(trackingCode);
  const matches = providers.filter((p) => p.detect(code));

  // provider có verified=true và pattern chặt hơn (độ dài cố định, prefix chữ cái) sẽ được ưu tiên trước.
  return matches
    .map((provider) => ({
      provider,
      confidence: (provider.verified ? "high" : "low") as "high" | "low",
    }))
    .sort((a, b) => {
      if (a.confidence === b.confidence) return 0;
      return a.confidence === "high" ? -1 : 1;
    });
}
