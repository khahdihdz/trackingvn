"use client";

import { ALL_PROVIDERS } from "@/providers";

export default function CarrierSelector({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (carrierId: string | null) => void;
}) {
  return (
    <div>
      <label htmlFor="carrier-select" className="mb-1 block text-sm font-medium">
        Đơn vị vận chuyển
      </label>
      <select
        id="carrier-select"
        className="input-base"
        value={value ?? "auto"}
        onChange={(e) => onChange(e.target.value === "auto" ? null : e.target.value)}
      >
        <option value="auto">Tự động</option>
        {ALL_PROVIDERS.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
}
