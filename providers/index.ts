import type { TrackingProvider } from "@/types/tracking";
import { ghnProvider } from "./ghn";
import { ghtkProvider } from "./ghtk";
import { viettelPostProvider } from "./viettelpost";
import { vnpostProvider } from "./vnpost";
import { jtExpressProvider } from "./jtexpress";
import { ninjaVanProvider } from "./ninjavan";
import { bestExpressProvider } from "./bestexpress";
import { spxProvider } from "./spx";
import { ahamoveProvider } from "./ahamove";
import {
  express247Provider,
  nhatTinProvider,
  longVanProvider,
  nascoExpressProvider,
} from "./other-carriers";

export const ALL_PROVIDERS: TrackingProvider[] = [
  viettelPostProvider,
  vnpostProvider,
  ghtkProvider,
  ghnProvider,
  jtExpressProvider,
  ninjaVanProvider,
  bestExpressProvider,
  spxProvider,
  ahamoveProvider,
  express247Provider,
  nhatTinProvider,
  longVanProvider,
  nascoExpressProvider,
];

export function getProviderById(id: string): TrackingProvider | undefined {
  return ALL_PROVIDERS.find((p) => p.id === id);
}
