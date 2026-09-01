import type { TrackingProvider } from "@/types/tracking";
import { makeUnavailableProvider } from "./base";

const NINJAVAN_PATTERN = /^[A-Z]{2,3}\d{9,12}$/;

export const ninjaVanProvider: TrackingProvider = makeUnavailableProvider({
  id: "ninjavan",
  name: "Ninja Van Việt Nam",
  logo: "/carriers/ninjavan.svg",
  detectPattern: NINJAVAN_PATTERN,
  officialUrl: (code) => `https://www.ninjavan.co/vi-vn/tracking?id=${encodeURIComponent(code)}`,
  reason: "Trang tracking là SPA gọi API nội bộ chưa được xác minh là public/không giới hạn CORS.",
});
