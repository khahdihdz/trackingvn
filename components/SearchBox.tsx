"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBox() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

  const trimmed = value.trim();
  const isEmpty = trimmed.length === 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (isEmpty) return;
    router.push(`/track/${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="tracking-code" className="sr-only">
        Nhập mã vận đơn
      </label>
      <input
        id="tracking-code"
        name="tracking-code"
        className="input-base"
        placeholder="Nhập mã vận đơn..."
        value={value}
        maxLength={40}
        autoComplete="off"
        inputMode="text"
        onChange={(e) => setValue(e.target.value)}
        aria-invalid={touched && isEmpty}
      />
      {touched && isEmpty && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          Vui lòng nhập mã vận đơn.
        </p>
      )}
      <button type="submit" className="btn-primary w-full">
        🔍 Tra cứu
      </button>
    </form>
  );
}
