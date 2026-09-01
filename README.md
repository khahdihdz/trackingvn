# Tracking Việt Nam

Website tra cứu vận đơn Việt Nam — không dùng API trả phí, không yêu cầu tài khoản DVVC,
kiến trúc serverless (Next.js), deploy được lên Vercel hoặc Cloudflare Pages.

## 1. Cấu trúc project

```
tracking-vn/
├── app/
│   ├── page.tsx                 # Trang chủ (ô tìm kiếm + lịch sử)
│   ├── layout.tsx                # Layout gốc, dark mode, SEO metadata
│   ├── globals.css
│   ├── track/[code]/page.tsx     # Trang kết quả /track/ABC123
│   └── api/tracking/route.ts     # Serverless function tra cứu
├── components/                   # SearchBox, TrackingTimeline, StatusBadge, ShipmentInfo,
│                                  # CarrierSelector, ErrorState, AutoRefreshControl, ...
├── providers/                    # 1 file / DVVC, cùng implement interface TrackingProvider
│   ├── base.ts                   # helper dùng chung (unavailableResult, factory)
│   ├── ghn.ts, ghtk.ts, viettelpost.ts, vnpost.ts, jtexpress.ts, ninjavan.ts,
│   │   bestexpress.ts, spx.ts, ahamove.ts, other-carriers.ts (247Express, Nhất Tín,
│   │   Long Vân, Nasco)
│   └── index.ts                  # ALL_PROVIDERS registry
├── lib/
│   ├── detector.ts                # nhận diện DVVC theo pattern mã vận đơn
│   ├── normalizer.ts              # chuẩn hóa trạng thái (VN/EN) -> mã chuẩn
│   ├── tracking.ts                # orchestrator: cache -> provider -> fallback
│   ├── cache.ts                   # cache TTL trong bộ nhớ instance
│   ├── rate-limit.ts              # rate limit theo IP
│   ├── privacy.ts                 # che số điện thoại, log an toàn
│   ├── validate.ts                # validate input
│   ├── history.ts                 # lịch sử tra cứu (localStorage, client-side)
│   ├── provider-health.ts         # health nội bộ
│   ├── fetch-with-timeout.ts
│   └── errors.ts
├── types/tracking.ts              # TrackingProvider, TrackingResult, TrackingEvent...
├── __tests__/                     # vitest: normalizer, detector, providers, privacy
├── public/{robots.txt,manifest.json,carriers/}
├── vercel.json
└── .env.example
```

## 2. Cài đặt & chạy local

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

Kiểm tra trước khi bàn giao / trước mỗi lần deploy:

```bash
npm run lint
npm run test
npm run build
```

## 3. Danh sách DVVC — trạng thái thực tế (mục 44, yêu cầu bắt buộc)

**Quan trọng — đọc trước khi dùng:** hệ thống **không được** dùng API cần tài khoản
merchant/API key trả phí, và **không được** bypass CAPTCHA/Cloudflare/anti-bot. Trong quá
trình xây dựng, tôi không thể xác minh (từ môi trường phát triển) rằng bất kỳ DVVC nào dưới
đây có một nguồn tra cứu công khai, không cần đăng nhập, và không bị chặn khi gọi tự động từ
server. Vì vậy, **đúng theo mục 31/42/44 của spec — không tự ý giả lập dữ liệu** — toàn bộ 13
provider hiện được cấu hình ở trạng thái trung thực nhất: `verified: false`, và `track()` luôn
trả về `UNAVAILABLE` kèm lý do cụ thể + link mở thẳng trang tra cứu chính thức của DVVC.

| DVVC | Trạng thái | Lý do |
|---|---|---|
| GHN | ❌ Chưa hoạt động | Endpoint public duy nhất tìm được yêu cầu header `Token`/`ShopId` của tài khoản merchant — là API cần tài khoản, bị cấm theo mục 3. Trang `ghn.vn/tra-cuu-van-don` là SPA gọi cùng API đó. |
| GHTK | ❌ Chưa hoạt động | Chưa xác minh được endpoint/trang public không cần đăng nhập và không bị chặn bot. |
| Viettel Post | ❌ Chưa hoạt động | Trang tra cứu là SPA gọi API nội bộ; chưa kiểm thử được CORS/anti-bot khi gọi từ server ngoài domain. |
| VNPost / EMS | ❌ Chưa hoạt động | Trang định vị bưu phẩm có thể dùng captcha/token phiên, chưa xác minh được. |
| J&T Express | ❌ Chưa hoạt động | Chưa xác minh được endpoint public ổn định. |
| Ninja Van | ❌ Chưa hoạt động | SPA gọi API nội bộ, chưa xác minh public/CORS. |
| BEST Express | ❌ Chưa hoạt động | Chưa xác minh được nguồn public ổn định. |
| SPX Express | ❌ Chưa hoạt động | Chủ yếu phục vụ đơn Shopee; chưa có nguồn tracking độc lập xác minh được. |
| Ahamove | ❌ Chưa hoạt động | Giao hàng theo yêu cầu qua app; chưa có trang tra cứu công khai xác minh được. |
| 247Express, Nhất Tín, Long Vân, Nasco | ❌ Chưa hoạt động | Chưa xác minh được nguồn tracking công khai ổn định. |

Mọi provider ở trạng thái này vẫn **hoạt động đúng như thiết kế**: người dùng nhập mã, hệ
thống nhận diện DVVC, hiển thị rõ "Không thể lấy dữ liệu tự động" kèm nút mở trang tra cứu
chính thức — không có màn hình trắng, không có dữ liệu giả.

### Cách bật một provider thật (theo đúng quy trình mục 42)

1. Mở DevTools → Network trên trang tra cứu công khai của DVVC, nhập một mã thật, xem request
   nào trả về dữ liệu (JSON hoặc HTML) và có yêu cầu auth/token hay không.
2. Nếu **không** cần token/đăng nhập và **không** bị Cloudflare challenge chặn khi gọi từ
   server khác domain: viết parser trong file provider tương ứng (`providers/<id>.ts`), dùng
   `fetchWithTimeout` từ `lib/fetch-with-timeout.ts` và `cheerio` (đã có trong dependencies)
   nếu response là HTML.
3. Map trạng thái gốc qua `normalizeStatus()` trong `lib/normalizer.ts`.
4. Viết test mock cho parser (xem `__tests__/providers.test.ts` để tham khảo cấu trúc).
5. Đổi `verified: false` → `true` trong config của provider đó.
6. Nếu trong quá trình test phát hiện cần bypass CAPTCHA/Cloudflare để lấy dữ liệu — **dừng
   lại**, giữ nguyên `verified: false`. Đây là giới hạn cứng của toàn bộ hệ thống.

## 4. Deploy Vercel

```bash
npm install -g vercel   # nếu chưa có
vercel
```

Vercel tự nhận diện Next.js qua `vercel.json`. Không cần cấu hình biến môi trường bắt buộc
(xem `.env.example` — chỉ có tham số tùy chỉnh TTL/rate-limit, không có secret).

## 5. Deploy Cloudflare Pages

```
Build command: npm run build
Output directory: .next
```

Cần bật **Cloudflare Pages Next.js runtime** (`@cloudflare/next-on-pages`) nếu muốn chạy
`app/api/tracking/route.ts` dưới dạng Cloudflare Function thay vì Vercel serverless function.
Tham khảo: `https://developers.cloudflare.com/pages/framework-guides/nextjs/`.

## 6. Giới hạn kiến trúc cần biết

- **Cache & rate-limit hiện tại là in-memory theo từng instance serverless** (`lib/cache.ts`,
  `lib/rate-limit.ts`) — phù hợp để giảm tải cơ bản nhưng không phải giới hạn phân tán toàn
  cục. Traffic lớn nên chuyển sang Cloudflare KV / Vercel KV (Upstash Redis).
- Lịch sử tra cứu lưu ở `localStorage` phía client, không có database (đúng mục 14).
- Không secret nào được đưa ra frontend; toàn bộ logic gọi DVVC chạy trong serverless
  function (mục 27).

## 7. Testing

```bash
npm run test
```

Bao gồm test cho: chuẩn hóa mã vận đơn, validate input, nhận diện DVVC theo pattern, hợp đồng
interface của mọi provider (đảm bảo provider chưa xác minh luôn trả UNAVAILABLE + link chính
thức chứ không bao giờ trả dữ liệu giả), và che số điện thoại/mã vận đơn khi log.
