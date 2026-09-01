import type { TrackingResult } from "@/types/tracking";

interface CacheEntry {
  value: TrackingResult;
  expiresAt: number;
}

const SHORT_TTL_MS = Number(process.env.CACHE_TTL ?? 120) * 1000; // 2 phút mặc định
const DELIVERED_TTL_MS = SHORT_TTL_MS * 20;

// In-memory cache theo serverless instance. Đây là lớp giảm tải tối thiểu;
// cache phân tán nên dùng Vercel/Upstash/Cloudflare KV khi traffic tăng.
const store = new Map<string, CacheEntry>();

function cacheKey(carrierId: string, trackingCode: string): string {
  return `${carrierId}:${trackingCode}`;
}

export function getCached(carrierId: string, trackingCode: string): TrackingResult | null {
  const key = cacheKey(carrierId, trackingCode);
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

export function setCached(carrierId: string, trackingCode: string, value: TrackingResult): void {
  const ttl = value.status.code === "DELIVERED" ? DELIVERED_TTL_MS : SHORT_TTL_MS;
  store.set(cacheKey(carrierId, trackingCode), { value, expiresAt: Date.now() + ttl });
}

export function pruneExpired(): void {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.expiresAt) store.delete(key);
  }
}
