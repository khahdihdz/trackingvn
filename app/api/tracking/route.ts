import { NextRequest, NextResponse } from "next/server";
import { lookupTracking } from "@/lib/tracking";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { isValidTrackingCode, MAX_CODE_LENGTH } from "@/lib/validate";
import { detectCarriers, normalizeTrackingCode } from "@/lib/detector";
import { getCached } from "@/lib/cache";
import { RateLimitError } from "@/lib/errors";
import { ALL_PROVIDERS } from "@/providers";

export const runtime = "nodejs";

function json(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      ...(init?.headers ?? {}),
    },
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawCode = searchParams.get("code") ?? "";
  const carrierId = searchParams.get("carrier") ?? undefined;
  const code = normalizeTrackingCode(rawCode);

  if (!isValidTrackingCode(code)) {
    return json(
      {
        success: false,
        error: "INVALID_CODE",
        message: `Mã vận đơn không hợp lệ (tối đa ${MAX_CODE_LENGTH} ký tự, chỉ gồm chữ/số/-/_).`,
      },
      { status: 400 },
    );
  }

  if (carrierId && !ALL_PROVIDERS.some((p) => p.id === carrierId)) {
    return json(
      { success: false, error: "UNKNOWN_CARRIER", message: "Không hỗ trợ đơn vị vận chuyển này." },
      { status: 400 },
    );
  }

  // Cache-first: request lấy được từ cache không bị tính vào rate limit.
  const candidates = carrierId
    ? ALL_PROVIDERS.filter((p) => p.id === carrierId)
    : detectCarriers(code, ALL_PROVIDERS).map((d) => d.provider);

  for (const provider of candidates) {
    const cached = getCached(provider.id, code);
    if (cached) {
      return json({ success: true, data: cached }, { status: 200 });
    }
  }

  const identifier = getClientIdentifier(req.headers);
  try {
    checkRateLimit(identifier);
  } catch (err) {
    if (err instanceof RateLimitError) {
      return json(
        {
          success: false,
          error: "RATE_LIMITED",
          message: "Bạn đang tra cứu quá nhanh. Vui lòng thử lại sau ít phút.",
          retryAfterSeconds: err.retryAfterSeconds,
        },
        {
          status: 429,
          headers: { "Retry-After": String(err.retryAfterSeconds) },
        },
      );
    }
    throw err;
  }

  try {
    const outcome = await lookupTracking(code, { carrierId });

    if (!outcome.detected || !outcome.result) {
      return json(
        {
          success: false,
          error: "CARRIER_NOT_DETECTED",
          message: "Không xác định được đơn vị vận chuyển. Bạn có thể chọn DVVC thủ công.",
        },
        { status: 200 },
      );
    }

    return json({ success: true, data: outcome.result }, { status: 200 });
  } catch {
    return json(
      {
        success: false,
        error: "UPSTREAM_ERROR",
        message: "Không thể lấy dữ liệu lúc này. Website của đơn vị vận chuyển có thể đang không phản hồi.",
      },
      { status: 200 },
    );
  }
}
