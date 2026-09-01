import type { TrackingEvent } from "@/types/tracking";

function formatTimestamp(ts: string): string {
  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) return ts; // giữ nguyên chuỗi gốc nếu không parse được
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TrackingTimeline({ events }: { events: TrackingEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Chưa có lịch sử vận chuyển từ nguồn dữ liệu.
      </p>
    );
  }

  // Mới nhất -> cũ nhất (mục 10).
  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <ol className="relative space-y-6 border-l-2 border-slate-200 pl-5 dark:border-slate-700">
      {sorted.map((event, idx) => (
        <li key={`${event.timestamp}-${idx}`} className="relative">
          <span
            className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full ${
              idx === 0 ? "bg-brand-600 ring-4 ring-brand-100 dark:ring-brand-900" : "bg-slate-300 dark:bg-slate-600"
            }`}
            aria-hidden
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">{formatTimestamp(event.timestamp)}</p>
          <p className={`font-medium ${idx === 0 ? "text-brand-700 dark:text-brand-500" : ""}`}>
            {event.description}
          </p>
          {(event.location || event.facility) && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {[event.facility, event.location].filter(Boolean).join(" · ")}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
