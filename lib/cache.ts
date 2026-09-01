import type { TrackingResult } from "@/types/tracking";

interface CacheEntry {
  value: TrackingResult;
  expiresAt: number;
}

const SHORT_TTL_MS = Number(process.env.CACHE_TTL ?? 60) * 1000; // trạng thái đang biến động
const DELIVERED_TTL_MS = SHORT_TTL_MS * 20; // DELIVERED có thể cache lâu hơn nhiều (mục 16)

// LƯU Ý: đây là cache trong bộ nhớ của MỘT instance serverless. Trên Vercel/Cloudflare,
// mỗi cold start / mỗi vùng có thể có bộ nhớ riêng nên đây chỉ là lớp giảm tải tối thiểu,
// không phải cache phân tán. Muốn cache dùng chung nhiều instance, thay bằng Cloudflare KV
// hoặc Vercel KV (Upstash Redis) — xem ghi chú trong README.
const store = new Map<string, CacheEntry>();

function cacheKey(carrierId: string, trackingCode: string): string {
  return `${carrierId}:${trackingCode}`;
}

export function getCached(carrierId: string, trackingCode: string): TrackingResult | null {
  const entry = store.get(cacheKey(carrierId, trackingCode));
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(cacheKey(carrierId, trackingCode));
    return null;
  }
  return entry.value;
}

export function setCached(carrierId: string, trackingCode: string, value: TrackingResult): void {
  const ttl = value.status.code === "DELIVERED" ? DELIVERED_TTL_MS : SHORT_TTL_MS;
  store.set(cacheKey(carrierId, trackingCode), { value, expiresAt: Date.now() + ttl });
}

/** Dọn các entry hết hạn — gọi định kỳ tránh Map phình to trong instance sống lâu. */
export function pruneExpired(): void {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.expiresAt) store.delete(key);
  }
}
