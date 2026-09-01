import type { NormalizedStatusCode } from "@/types/tracking";

const STYLE: Record<NormalizedStatusCode, { icon: string; className: string }> = {
  CREATED: { icon: "⚪", className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  PICKED_UP: { icon: "🔵", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  IN_TRANSIT: { icon: "🟣", className: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
  ARRIVED_FACILITY: { icon: "🟠", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  OUT_FOR_DELIVERY: { icon: "🟢", className: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
  DELIVERED: { icon: "✅", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  DELIVERY_FAILED: { icon: "⚠️", className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
  RETURNING: { icon: "↩️", className: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" },
  RETURNED: { icon: "↩️", className: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" },
  CANCELLED: { icon: "❌", className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
  LOST: { icon: "❗", className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
  EXCEPTION: { icon: "⚠️", className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
  UNKNOWN: { icon: "❓", className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
};

export default function StatusBadge({
  code,
  label,
}: {
  code: NormalizedStatusCode;
  label: string;
}) {
  const style = STYLE[code];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${style.className}`}
    >
      <span aria-hidden>{style.icon}</span>
      {label}
    </span>
  );
}
