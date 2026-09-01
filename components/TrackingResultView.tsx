"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import StatusBadge from "./StatusBadge";
import TrackingTimeline from "./TrackingTimeline";
import ShipmentInfo from "./ShipmentInfo";
import ErrorState from "./ErrorState";
import CarrierSelector from "./CarrierSelector";
import AutoRefreshControl from "./AutoRefreshControl";
import CopyShareButtons from "./CopyShareButtons";
import { addHistoryItem } from "@/lib/history";
import type { TrackingResult } from "@/types/tracking";

type ApiResponse =
  | { success: true; data: TrackingResult }
  | { success: false; error: string; message: string; retryAfterSeconds?: number };

export default function TrackingResultView({ code }: { code: string }) {
  const [carrierId, setCarrierId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [autoRefreshMinutes, setAutoRefreshMinutes] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchTracking = useCallback(async () => {
    // Không request khi tab không hoạt động (mục 15).
    if (document.visibilityState !== "visible") return;

    setLoading(true);
    try {
      const params = new URLSearchParams({ code });
      if (carrierId) params.set("carrier", carrierId);
      const res = await fetch(`/api/tracking?${params.toString()}`);
      const json = (await res.json()) as ApiResponse;
      setResponse(json);

      if (json.success) {
        addHistoryItem({
          code: json.data.trackingCode,
          carrierName: json.data.carrier.name,
          statusLabel: json.data.status.label,
          searchedAt: new Date().toISOString(),
        });
      }
    } catch {
      setResponse({
        success: false,
        error: "NETWORK_ERROR",
        message: "Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng.",
      });
    } finally {
      setLoading(false);
    }
  }, [code, carrierId]);

  useEffect(() => {
    fetchTracking();
  }, [fetchTracking]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (autoRefreshMinutes > 0) {
      intervalRef.current = setInterval(fetchTracking, autoRefreshMinutes * 60 * 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRefreshMinutes, fetchTracking]);

  return (
    <main className="space-y-5">
      <Link href="/" className="text-sm text-brand-600 hover:underline dark:text-brand-500">
        ← Tra cứu khác
      </Link>

      <CarrierSelector value={carrierId} onChange={setCarrierId} />

      {loading && !response && (
        <div className="card animate-fade-in text-center text-slate-500 dark:text-slate-400" aria-busy="true">
          Đang tải...
        </div>
      )}

      {response && response.success && (
        <div className="animate-fade-in space-y-5">
          <div className="card space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{response.data.carrier.name}</span>
              <span className="font-mono text-sm text-slate-500 dark:text-slate-400">
                {response.data.trackingCode}
              </span>
            </div>
            <StatusBadge code={response.data.status.code} label={response.data.status.label} />
            {response.data.estimatedDelivery && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Dự kiến giao: {response.data.estimatedDelivery}
              </p>
            )}
          </div>

          {!response.data.success && response.data.unavailableReason && (
            <ErrorState
              icon="⚠️"
              title="Không thể lấy dữ liệu tự động"
              description={response.data.unavailableReason}
              officialUrl={response.data.officialUrl}
            />
          )}

          <CopyShareButtons code={response.data.trackingCode} />

          <AutoRefreshControl minutes={autoRefreshMinutes} onChange={setAutoRefreshMinutes} />

          {response.data.success && (
            <>
              <ShipmentInfo result={response.data} />
              <div className="card">
                <h3 className="mb-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Lịch sử vận chuyển
                </h3>
                <TrackingTimeline events={response.data.events} />
              </div>
            </>
          )}
        </div>
      )}

      {response && !response.success && response.error === "CARRIER_NOT_DETECTED" && (
        <ErrorState
          icon="❓"
          title="Không xác định được đơn vị vận chuyển"
          description="Bạn có thể chọn DVVC thủ công ở trên."
        />
      )}

      {response && !response.success && response.error === "RATE_LIMITED" && (
        <ErrorState
          icon="⏳"
          title="Bạn đang tra cứu quá nhanh"
          description="Vui lòng thử lại sau ít phút."
        />
      )}

      {response &&
        !response.success &&
        response.error !== "CARRIER_NOT_DETECTED" &&
        response.error !== "RATE_LIMITED" && (
          <ErrorState icon="⚠️" title="Không thể lấy dữ liệu lúc này" description={response.message} />
        )}
    </main>
  );
}
