"use client";

const OPTIONS = [
  { value: 0, label: "Không tự động" },
  { value: 5, label: "5 phút" },
  { value: 15, label: "15 phút" },
  { value: 30, label: "30 phút" },
  { value: 60, label: "60 phút" },
];

export default function AutoRefreshControl({
  minutes,
  onChange,
}: {
  minutes: number;
  onChange: (minutes: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <label htmlFor="auto-refresh" className="flex items-center gap-2">
        <input
          id="auto-refresh"
          type="checkbox"
          checked={minutes > 0}
          onChange={(e) => onChange(e.target.checked ? 15 : 0)}
          className="h-4 w-4"
        />
        Tự động cập nhật
      </label>
      {minutes > 0 && (
        <select
          aria-label="Tần suất cập nhật"
          className="rounded-lg border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-900"
          value={minutes}
          onChange={(e) => onChange(Number(e.target.value))}
        >
          {OPTIONS.filter((o) => o.value > 0).map((o) => (
            <option key={o.value} value={o.value}>
              Cập nhật mỗi {o.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
