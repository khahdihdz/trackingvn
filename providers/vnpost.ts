import type { TrackingProvider } from "@/types/tracking";
import { makeUnavailableProvider } from "./base";

const VNPOST_PATTERN = /^[A-Z]{2}\d{9}VN$|^\d{10,13}$/;

export const vnpostProvider: TrackingProvider = makeUnavailableProvider({
  id: "vnpost",
  name: "VNPost / EMS Việt Nam",
  logo: "/carriers/vnpost.svg",
  detectPattern: VNPOST_PATTERN,
  officialUrl: (code) =>
    `https://www.vnpost.vn/vi-vn/dinh-vi/buu-pham?key=${encodeURIComponent(code)}`,
  reason:
    "VNPost có trang định vị bưu phẩm công khai nhưng cần xác minh cơ chế submit form " +
    "(có thể dùng captcha hoặc token phiên) trước khi tự động hoá truy vấn.",
});
