import type { TrackingProvider } from "@/types/tracking";
import { makeUnavailableProvider } from "./base";

const JT_PATTERN = /^[A-Z]{2}\d{9,12}$|^\d{12,13}$/;

export const jtExpressProvider: TrackingProvider = makeUnavailableProvider({
  id: "jtexpress",
  name: "J&T Express Việt Nam",
  logo: "/carriers/jtexpress.svg",
  detectPattern: JT_PATTERN,
  officialUrl: (code) => `https://jtexpress.vn/tracking?bill_code=${encodeURIComponent(code)}`,
  reason: "Chưa xác minh được endpoint tra cứu công khai ổn định, không cần token nội bộ.",
});
