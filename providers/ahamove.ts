import type { TrackingProvider } from "@/types/tracking";
import { makeUnavailableProvider } from "./base";

const AHAMOVE_PATTERN = /^[A-Z0-9]{8,20}$/;

export const ahamoveProvider: TrackingProvider = makeUnavailableProvider({
  id: "ahamove",
  name: "Ahamove",
  logo: "/carriers/ahamove.svg",
  detectPattern: AHAMOVE_PATTERN,
  officialUrl: (code) => `https://ahamove.com/tracking?order_id=${encodeURIComponent(code)}`,
  reason: "Ahamove chủ yếu là giao hàng theo yêu cầu qua app, chưa có trang tra cứu công khai xác minh được.",
});
