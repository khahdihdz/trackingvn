import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://trackingvn.vercel.app"),
  title: "TrackingVN — Tra cứu vận đơn",
  description: "Tra cứu mã vận đơn và theo dõi hành trình giao hàng với các đơn vị vận chuyển tại Việt Nam.",
  keywords: ["tra cứu vận đơn", "tracking", "SPX", "GHN", "GHTK", "Viettel Post", "J&T", "VNPost"],
  openGraph: { title: "TrackingVN — Tra cứu vận đơn", description: "Tra cứu và theo dõi hành trình đơn hàng.", url: "https://trackingvn.vercel.app", siteName: "TrackingVN", type: "website" },
  twitter: { card: "summary_large_image", title: "TrackingVN — Tra cứu vận đơn", description: "Tra cứu và theo dõi hành trình đơn hàng." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
