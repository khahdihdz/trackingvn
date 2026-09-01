import type { TrackingProvider } from "@/types/tracking";
import { makeUnavailableProvider } from "./base";

// Mã vận đơn GHN thường là chuỗi 6-10 ký tự chữ+số (vd: 5ENLKKHD) — pattern không đặc thù,
// dễ trùng với DVVC khác nên độ ưu tiên nhận diện thấp.
const GHN_PATTERN = /^[A-Z0-9]{6,10}$/;

export const ghnProvider: TrackingProvider = makeUnavailableProvider({
  id: "ghn",
  name: "Giao Hàng Nhanh (GHN)",
  logo: "/carriers/ghn.svg",
  detectPattern: GHN_PATTERN,
  officialUrl: (code) => `https://donhang.ghn.vn/?order_code=${encodeURIComponent(code)}`,
  reason:
    "Endpoint tra cứu công khai duy nhất tìm được (shipping-order/detail) yêu cầu header " +
    "Token/ShopId của tài khoản merchant GHN — đây là API cần tài khoản, không được dùng theo " +
    "quy định của hệ thống. Trang ghn.vn/tra-cuu-van-don là SPA gọi cùng API nội bộ đó.",
});
