import { ALL_PROVIDERS, getProviderById } from "@/providers";
import { detectCarriers, normalizeTrackingCode } from "./detector";
import { getCached, setCached } from "./cache";
import { logTrackingRequest } from "./privacy";
import { ProviderError } from "./errors";
import { maskPhone } from "./privacy";
import type { TrackingResult } from "@/types/tracking";

export interface LookupOptions {
  /** Nếu người dùng chọn thủ công một DVVC thay vì để hệ thống tự nhận diện. */
  carrierId?: string;
}

export interface LookupOutcome {
  result: TrackingResult | null;
  triedCarriers: string[];
  detected: boolean;
}

function maskResultPII(result: TrackingResult): TrackingResult {
  return {
    ...result,
    sender: result.sender ? { ...result.sender, phone: maskPhone(result.sender.phone) } : undefined,
    receiver: result.receiver
      ? { ...result.receiver, phone: maskPhone(result.receiver.phone) }
      : undefined,
  };
}

/**
 * Luồng tra cứu chính (mục 4, 7): chuẩn hóa mã -> chọn provider (thủ công hoặc tự nhận diện)
 * -> thử cache -> gọi provider thật -> nếu lỗi, thử provider tiếp theo (nếu tự động) -> chuẩn hóa PII.
 */
export async function lookupTracking(
  rawCode: string,
  options: LookupOptions = {},
): Promise<LookupOutcome> {
  const code = normalizeTrackingCode(rawCode);
  const triedCarriers: string[] = [];

  const candidates = options.carrierId
    ? [getProviderById(options.carrierId)].filter((p): p is NonNullable<typeof p> => Boolean(p))
    : detectCarriers(code, ALL_PROVIDERS).map((d) => d.provider);

  if (candidates.length === 0) {
    return { result: null, triedCarriers, detected: false };
  }

  for (const provider of candidates) {
    triedCarriers.push(provider.id);

    const cached = getCached(provider.id, code);
    if (cached) {
      return { result: maskResultPII(cached), triedCarriers, detected: true };
    }

    const start = Date.now();
    try {
      const result = await provider.track(code);
      const duration = Date.now() - start;

      logTrackingRequest({
        carrier: provider.id,
        trackingCode: code,
        status: result.success ? "SUCCESS" : "UNAVAILABLE",
        durationMs: duration,
      });

      setCached(provider.id, code, result);

      // Nếu provider trả UNAVAILABLE và người dùng KHÔNG chọn thủ công, thử provider tiếp theo
      // trong danh sách nghi ngờ trước khi bỏ cuộc.
      if (!result.success && !options.carrierId && candidates.length > 1) {
        continue;
      }

      return { result: maskResultPII(result), triedCarriers, detected: true };
    } catch (err) {
      const duration = Date.now() - start;
      const errorType = err instanceof ProviderError ? err.code : "UNKNOWN_ERROR";
      logTrackingRequest({
        carrier: provider.id,
        trackingCode: code,
        status: "ERROR",
        durationMs: duration,
        errorType,
      });
      // Thử provider tiếp theo nếu đang ở chế độ tự động.
      if (options.carrierId) {
        throw err;
      }
    }
  }

  // Tất cả provider nghi ngờ đều thất bại/unavailable.
  const fallbackProvider = candidates[0];
  const officialUrl = fallbackProvider ? fallbackProvider.getOfficialUrl(code) : undefined;
  return {
    result: fallbackProvider
      ? {
          success: false,
          carrier: { id: fallbackProvider.id, name: fallbackProvider.name },
          trackingCode: code,
          status: { code: "UNKNOWN", label: "Không xác định" },
          events: [],
          unavailableReason: "Không thể lấy dữ liệu tự động từ các đơn vị vận chuyển nghi ngờ.",
          officialUrl: officialUrl!,
        }
      : null,
    triedCarriers,
    detected: true,
  };
}
