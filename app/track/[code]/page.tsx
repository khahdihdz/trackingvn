import type { Metadata } from "next";
import TrackingResultView from "@/components/TrackingResultView";

export function generateMetadata({ params }: { params: { code: string } }): Metadata {
  return {
    title: `Tra cứu ${params.code} — Tracking Việt Nam`,
    description: "Kết quả tra cứu vận đơn.",
  };
}

export default function TrackPage({ params }: { params: { code: string } }) {
  return <TrackingResultView code={decodeURIComponent(params.code)} />;
}
