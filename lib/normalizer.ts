import type { NormalizedStatus, NormalizedStatusCode } from "@/types/tracking";

// Nhãn tiếng Việt hiển thị cho từng trạng thái chuẩn hóa.
const LABELS: Record<NormalizedStatusCode, string> = {
  CREATED: "Đã tạo đơn",
  PICKED_UP: "Đã lấy hàng",
  IN_TRANSIT: "Đang vận chuyển",
  ARRIVED_FACILITY: "Đã đến bưu cục",
  OUT_FOR_DELIVERY: "Đang giao hàng",
  DELIVERED: "Đã giao hàng",
  DELIVERY_FAILED: "Giao hàng thất bại",
  RETURNING: "Đang hoàn hàng",
  RETURNED: "Đã hoàn hàng",
  CANCELLED: "Đã hủy đơn",
  LOST: "Thất lạc",
  EXCEPTION: "Có sự cố",
  UNKNOWN: "Không xác định",
};

// Danh sách quy tắc theo thứ tự ưu tiên: cụm càng cụ thể nên đứng trước.
// So khớp không phân biệt hoa/thường, không dấu lẫn có dấu (đã chuẩn hóa trước khi so khớp).
const RULES: Array<{ code: NormalizedStatusCode; patterns: RegExp[] }> = [
  {
    code: "DELIVERED",
    patterns: [/da giao( hang)?( thanh cong)?/, /giao thanh cong/, /delivered/, /hoan tat/],
  },
  {
    code: "DELIVERY_FAILED",
    patterns: [/giao (hang )?(khong thanh cong|that bai)/, /delivery failed/, /khong giao duoc/],
  },
  {
    code: "OUT_FOR_DELIVERY",
    patterns: [/dang giao( hang)?/, /out for delivery/, /buu ta dang giao/],
  },
  {
    code: "RETURNED",
    patterns: [/da hoan( hang| tra)?/, /returned/],
  },
  {
    code: "RETURNING",
    patterns: [/dang hoan( hang| tra)?/, /hoan hang/, /returning/, /chuyen hoan/],
  },
  {
    code: "CANCELLED",
    patterns: [/da huy/, /huy don/, /cancelled/, /canceled/],
  },
  {
    code: "LOST",
    patterns: [/that lac/, /mat hang/, /lost/],
  },
  {
    code: "ARRIVED_FACILITY",
    patterns: [/da den (buu cuc|kho|trung tam)/, /arrived at/, /nhap kho/],
  },
  {
    code: "PICKED_UP",
    patterns: [/da lay hang/, /lay hang thanh cong/, /picked up/, /nhan hang tu nguoi gui/],
  },
  {
    code: "IN_TRANSIT",
    patterns: [/dang van chuyen/, /dang trung chuyen/, /in transit/, /van chuyen den/],
  },
  {
    code: "CREATED",
    patterns: [/da tao don/, /khoi tao don/, /order created/, /nguoi gui tao don/],
  },
  {
    code: "EXCEPTION",
    patterns: [/su co/, /exception/, /loi don hang/],
  },
];

function stripDiacritics(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .trim();
}

/**
 * Chuyển trạng thái gốc (tiếng Việt hoặc tiếng Anh, tùy DVVC) thành trạng thái chuẩn hóa.
 * Không throw — nếu không khớp quy tắc nào, trả về UNKNOWN kèm mô tả gốc.
 */
export function normalizeStatus(rawStatus: string): NormalizedStatus {
  const clean = stripDiacritics(rawStatus);

  for (const rule of RULES) {
    if (rule.patterns.some((p) => p.test(clean))) {
      return { code: rule.code, label: LABELS[rule.code], description: rawStatus };
    }
  }

  return { code: "UNKNOWN", label: LABELS.UNKNOWN, description: rawStatus };
}

export function labelForCode(code: NormalizedStatusCode): string {
  return LABELS[code];
}
