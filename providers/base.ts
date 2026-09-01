import { ProviderError } from "@/lib/errors";
import type { TrackingProvider, TrackingResult } from "@/types/tracking";

/**
 * Dùng cho các DVVC mà nguồn tracking công khai không thể truy cập ổn định
 * (trang là SPA cần token merchant, có bảo vệ chống bot, hoặc chưa được kiểm chứng thực tế).
 * KHÔNG bypass CAPTCHA/Cloudflare/authentication (mục 3, 42, 44) — luôn trả UNAVAILABLE
 * kèm lý do cụ thể và link tra cứu chính thức.
 */
export function unavailableResult(
  carrierId: string,
  carrierName: string,
  trackingCode: string,
  officialUrl: string,
  reason: string,
): TrackingResult {
  return {
    success: false,
    carrier: { id: carrierId, name: carrierName },
    trackingCode,
    status: { code: "UNKNOWN", label: "Không xác định" },
    events: [],
    unavailableReason: reason,
    officialUrl,
  };
}

export function throwNotVerified(carrierName: string): never {
  throw new ProviderError(
    `${carrierName}: adapter chưa được xác minh hoạt động với nguồn công khai hiện tại.`,
    "NOT_VERIFIED",
  );
}

interface UnavailableProviderConfig {
  id: string;
  name: string;
  logo?: string;
  detectPattern: RegExp;
  officialUrl: (trackingCode: string) => string;
  reason: string;
}

/**
 * Factory cho các DVVC chưa có nguồn tracking công khai được xác minh là truy cập được
 * mà không cần bypass bảo vệ / không cần tài khoản. Luôn trả UNAVAILABLE + link chính thức,
 * đúng theo mục 3D, 19, 42, 44 của spec — không giả lập dữ liệu.
 */
export function makeUnavailableProvider(config: UnavailableProviderConfig): TrackingProvider {
  return {
    id: config.id,
    name: config.name,
    logo: config.logo,
    verified: false,
    detect(code: string) {
      return config.detectPattern.test(code);
    },
    async track(trackingCode: string) {
      return unavailableResult(
        config.id,
        config.name,
        trackingCode,
        config.officialUrl(trackingCode),
        config.reason,
      );
    },
    getOfficialUrl(trackingCode: string) {
      return config.officialUrl(trackingCode);
    },
  };
}
