export interface HistoryItem {
  code: string;
  carrierName: string;
  statusLabel: string;
  searchedAt: string;
}

const KEY = "tracking-vn:history";
const MAX_ITEMS = 20;

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

export function addHistoryItem(item: HistoryItem): void {
  if (typeof window === "undefined") return;
  const existing = getHistory().filter((h) => h.code !== item.code);
  const next = [item, ...existing].slice(0, MAX_ITEMS);
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
