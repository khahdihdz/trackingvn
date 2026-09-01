import SearchBox from "@/components/SearchBox";
import RecentSearches from "@/components/RecentSearches";
import ThemeToggle from "@/components/ThemeToggle";
import { ALL_PROVIDERS } from "@/providers";

export default function HomePage() {
  return (
    <main>
      <header className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-3xl">📦</p>
          <h1 className="mt-2 text-2xl font-bold">Tracking Việt Nam</h1>
          <p className="text-slate-600 dark:text-slate-400">Theo dõi đơn hàng nhanh chóng</p>
        </div>
        <ThemeToggle />
      </header>

      <SearchBox />

      <section className="mt-8 text-center">
        <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-300">Đơn vị hỗ trợ</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {ALL_PROVIDERS.map((p) => p.name).join(" · ")}
        </p>
      </section>

      <RecentSearches />
    </main>
  );
}
