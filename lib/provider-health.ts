import { ALL_PROVIDERS } from "@/providers";
import type { ProviderHealth } from "@/types/tracking";

/**
 * Health nội bộ dựa trên metadata `verified` của từng provider.
 * Vì mọi provider chưa xác minh đều trả UNAVAILABLE có chủ đích (không giả lập dữ liệu),
 * "unavailable" ở đây phản ánh đúng trạng thái thật, không phải một lỗi cần báo động.
 */
export function getProviderHealthSnapshot(): ProviderHealth[] {
  const now = new Date().toISOString();
  return ALL_PROVIDERS.map((p) => ({
    id: p.id,
    name: p.name,
    status: p.verified ? "online" : "unavailable",
    lastChecked: now,
  }));
}
