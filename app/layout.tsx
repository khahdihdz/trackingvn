import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tra Cứu Vận Đơn Việt Nam",
  description: "Tra cứu và theo dõi vận đơn các đơn vị vận chuyển tại Việt Nam.",
  openGraph: {
    title: "Tra Cứu Vận Đơn Việt Nam",
    description: "Tra cứu và theo dõi vận đơn các đơn vị vận chuyển tại Việt Nam.",
    locale: "vi_VN",
    type: "website",
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* Áp dụng dark mode sớm nhất có thể để tránh nháy sáng/tối (mục 21). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (stored === 'dark' || (!stored && prefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">{children}</div>
      </body>
    </html>
  );
}
