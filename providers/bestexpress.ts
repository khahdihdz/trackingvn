import type { TrackingProvider } from "@/types/tracking";
import { makeUnavailableProvider } from "./base";

const BEST_PATTERN = /^BE\d{10,12}$/;

export const bestExpressProvider: TrackingProvider = makeUnavailableProvider({
  id: "bestexpress",
  name: "BEST Express Việt Nam",
  logo: "/carriers/bestexpress.svg",
  detectPattern: BEST_PATTERN,
  officialUrl: (code) => `https://www.best-inc.vn/track?bill=${encodeURIComponent(code)}`,
  reason: "Chưa xác minh được nguồn tracking công khai ổn định cho BEST Express tại Việt Nam.",
});
