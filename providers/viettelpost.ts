import type { TrackingProvider } from "@/types/tracking";
import { makeUnavailableProvider } from "./base";

const VTP_PATTERN = /^[0-9]{9,13}$/;

export const viettelPostProvider: TrackingProvider = makeUnavailableProvider({
  id: "viettelpost",
  name: "Viettel Post",
  logo: "/carriers/viettelpost.svg",
  detectPattern: VTP_PATTERN,
  officialUrl: (code) =>
    `https://viettelpost.vn/tra-cuu-hanh-trinh-don-hang/?ma_don_hang=${encodeURIComponent(code)}`,
  reason:
    "Trang tra cứu công khai render bằng JS và gọi API nội bộ; chưa xác minh được API này " +
    "không yêu cầu auth và không chặn request từ ngoài domain viettelpost.vn (CORS/anti-bot). " +
    "Cần kiểm thử thủ công trước khi bật provider này (verified: true).",
});
