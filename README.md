# TrackingVN

Website tra cứu mã vận đơn Việt Nam, xây dựng với Next.js và TypeScript.

## Tính năng

- Tự động nhận diện mã vận đơn.
- Chọn thủ công nhà vận chuyển.
- Backend provider và chuẩn hóa dữ liệu.
- Lịch sử tra cứu lưu cục bộ trên trình duyệt.
- Chia sẻ link theo mã vận đơn.
- Tự động cập nhật tùy chọn mỗi 30 giây.
- Responsive, mobile-first.
- Không giả lập dữ liệu hành trình.

Khi nhà vận chuyển không cho phép truy vấn tự động từ nguồn công khai, TrackingVN hiển thị lý do và liên kết tới trang tracking chính thức. Không vượt CAPTCHA, Cloudflare, đăng nhập hoặc token merchant.

## Chạy local

npm install
npm run dev

## Build

npm run build
npm start

## Deploy

Project tương thích Vercel. Import repository khahdihdz/trackingvn và deploy bằng Next.js.

© 2026 khahdihdz
