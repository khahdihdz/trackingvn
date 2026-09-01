import type { TrackingProvider } from "@/types/tracking";
import { makeUnavailableProvider } from "./base";

const SPX_PATTERN = /^SPX[A-Z0-9]{9,15}$/;

export const spxProvider: TrackingProvider = makeUnavailableProvider({
  id: "spx",
  name: "SPX Express Việt Nam (Shopee Xpress)",
  logo: "/carriers/spx.svg",
  detectPattern: SPX_PATTERN,
  officialUrl: (code) => `https://spx.vn/track?sn=${encodeURIComponent(code)}`,
  reason: "SPX chủ yếu phục vụ đơn Shopee, tracking công khai độc lập chưa được xác minh.",
});
