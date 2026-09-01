"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearHistory, getHistory, type HistoryItem } from "@/lib/history";

export default function RecentSearches() {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setItems(getHistory());
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="mt-8 space-y-3" aria-labelledby="recent-heading">
      <div className="flex items-center justify-between">
        <h2 id="recent-heading" className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          Tra cứu gần đây
        </h2>
        <button
          type="button"
          className="text-sm text-red-600 hover:underline dark:text-red-400"
          onClick={() => {
            clearHistory();
            setItems([]);
          }}
        >
          Xóa lịch sử
        </button>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.code}>
            <Link href={`/track/${encodeURIComponent(item.code)}`} className="card block hover:border-brand-500">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm">{item.code}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{item.carrierName}</span>
              </div>
              <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">{item.statusLabel}</div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
