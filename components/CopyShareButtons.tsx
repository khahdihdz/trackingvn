"use client";

import { useState } from "react";

export default function CopyShareButtons({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Trình duyệt không hỗ trợ Clipboard API — bỏ qua, không crash UI.
    }
  }

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: "Tra cứu vận đơn", text: code, url });
      } catch {
        // Người dùng hủy chia sẻ — không cần xử lý gì thêm.
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex gap-2">
      <button type="button" onClick={handleCopy} className="btn-primary flex-1 !bg-slate-700 hover:!bg-slate-800">
        {copied ? "✓ Đã sao chép" : "📋 Sao chép"}
      </button>
      <button type="button" onClick={handleShare} className="btn-primary flex-1">
        🔗 Chia sẻ
      </button>
    </div>
  );
}
