// Trạng thái chuẩn hóa dùng chung cho toàn hệ thống.
// Mọi provider phải map trạng thái riêng của DVVC về một trong các giá trị này.
export type NormalizedStatusCode =
  | "CREATED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "ARRIVED_FACILITY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "DELIVERY_FAILED"
  | "RETURNING"
  | "RETURNED"
  | "CANCELLED"
  | "LOST"
  | "EXCEPTION"
  | "UNKNOWN";

export interface NormalizedStatus {
  code: NormalizedStatusCode;
  label: string; // nhãn tiếng Việt để hiển thị
  description?: string;
}

export interface TrackingEvent {
  timestamp: string; // ISO-8601 nếu xác định được, ngược lại giữ nguyên chuỗi gốc
  status: string; // trạng thái gốc do DVVC trả về (không dịch)
  description: string;
  location?: string;
  facility?: string;
  source?: string; // 'raw-html' | 'raw-json' | provider id, phục vụ debug
}

export interface PartyInfo {
  name?: string;
  address?: string;
  phone?: string; // đã được che một phần trước khi ra tới frontend
}

export interface TrackingResult {
  success: boolean;
  carrier: {
    id: string;
    name: string;
    logo?: string;
  };
  trackingCode: string;
  status: NormalizedStatus;
  sender?: PartyInfo;
  receiver?: PartyInfo;
  origin?: string;
  destination?: string;
  service?: string;
  weight?: string;
  shippingFee?: string;
  codAmount?: string;
  estimatedDelivery?: string;
  createdAt?: string;
  deliveredAt?: string;
  lastUpdated?: string;
  events: TrackingEvent[];
  /** Khi provider không truy vấn tự động được (bị chặn, đổi cấu trúc, timeout...) */
  unavailableReason?: string;
  officialUrl: string;
}

export interface TrackingProvider {
  id: string;
  name: string;
  logo?: string;
  /**
   * true nếu adapter đã được xác thực là hoạt động thật với nguồn công khai.
   * false = chưa xác minh / nguồn chặn truy cập tự động -> luôn trả UNAVAILABLE + link chính thức.
   * Xem mục 42 trong prompt gốc: không được tuyên bố "hỗ trợ" nếu chưa hoạt động thật.
   */
  verified: boolean;
  /** Đoán xem mã vận đơn có khả năng thuộc DVVC này hay không (không tuyệt đối). */
  detect(trackingCode: string): boolean;
  /** Thực hiện tra cứu thật. Phải luôn throw ProviderError thay vì trả dữ liệu giả. */
  track(trackingCode: string): Promise<TrackingResult>;
  getOfficialUrl(trackingCode: string): string;
}

export type ProviderHealthStatus = "online" | "degraded" | "unavailable";

export interface ProviderHealth {
  id: string;
  name: string;
  status: ProviderHealthStatus;
  lastChecked: string;
  lastError?: string;
}
