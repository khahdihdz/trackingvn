/** Che một phần số điện thoại: 0912345678 -> 091*****678 (mục 13). */
export function maskPhone(phone?: string): string | undefined {
  if (!phone) return phone;
  const digits = phone.replace(/\s+/g, "");
  if (digits.length < 7) return "*".repeat(digits.length);
  const head = digits.slice(0, 3);
  const tail = digits.slice(-3);
  const middle = "*".repeat(Math.max(digits.length - 6, 3));
  return `${head}${middle}${tail}`;
}

/** Che mã vận đơn khi ghi log (mục 29): giữ 3 ký tự cuối. */
export function maskTrackingCode(code: string): string {
  if (code.length <= 3) return "*".repeat(code.length);
  return `${"*".repeat(code.length - 3)}${code.slice(-3)}`;
}

interface LogFields {
  carrier: string;
  trackingCode: string;
  status: "SUCCESS" | "ERROR" | "UNAVAILABLE" | "RATE_LIMITED";
  durationMs: number;
  errorType?: string;
}

/** Log có cấu trúc, không log dữ liệu cá nhân đầy đủ. */
export function logTrackingRequest(fields: LogFields): void {
  const ts = new Date().toISOString();
  const parts = [
    `[${ts}]`,
    `carrier=${fields.carrier}`,
    `tracking=${maskTrackingCode(fields.trackingCode)}`,
    `status=${fields.status}`,
    `duration=${fields.durationMs}ms`,
  ];
  if (fields.errorType) parts.push(`error=${fields.errorType}`);
  // eslint-disable-next-line no-console
  console.log(parts.join(" "));
}
