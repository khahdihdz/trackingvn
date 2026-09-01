"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
      className="rounded-full border border-slate-300 p-2 text-lg transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
