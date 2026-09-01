import { RateLimitError } from "./errors";

const WINDOW_MS = 10 * 60 * 1000; // 10 phút
const MAX_REQUESTS = Number(process.env.RATE_LIMIT ?? 30); // 30 request / 10 phút / IP

// Cùng lưu ý như cache.ts: đây là rate-limit theo từng instance serverless, không phải
// phân tán toàn cục. Cho production nhiều traffic, dùng Cloudflare Rate Limiting rules
// hoặc Vercel Firewall / Upstash Ratelimit thay cho bộ nhớ trong tiến trình.
const hits = new Map<string, number[]>();

export function checkRateLimit(identifier: string): void {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const timestamps = (hits.get(identifier) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= MAX_REQUESTS) {
    const oldestInWindow = timestamps[0]!;
    const retryAfterSeconds = Math.ceil((oldestInWindow + WINDOW_MS - now) / 1000);
    hits.set(identifier, timestamps);
    throw new RateLimitError(retryAfterSeconds);
  }

  timestamps.push(now);
  hits.set(identifier, timestamps);
}

export function getClientIdentifier(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}
