import type { TrackingProvider } from "@/types/tracking";
import { makeUnavailableProvider } from "./base";

// GHTK thường dùng mã dạng S<số> hoặc chuỗi số dài do hệ thống shop sinh ra.
const GHTK_PATTERN = /^S\d{6,}$|^\d{10,15}$/;

export const ghtkProvider: TrackingProvider = makeUnavailableProvider({
  id: "ghtk",
  name: "Giao Hàng Tiết Kiệm (GHTK)",
  logo: "/carriers/ghtk.svg",
  detectPattern: GHTK_PATTERN,
  officialUrl: (code) => `https://i.ghtk.vn/${encodeURIComponent(code)}`,
  reason:
    "Chưa xác minh được trang/endpoint tra cứu công khai của GHTK cho phép truy vấn không cần " +
    "đăng nhập và không bị giới hạn bởi cơ chế chống bot khi gọi từ server ngoài.",
});
