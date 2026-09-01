const MAX_CODE_LENGTH = 40;
const MIN_CODE_LENGTH = 4;
// Chỉ cho phép chữ, số và dấu gạch nối/gạch dưới — đủ cho hầu hết DVVC Việt Nam.
const CODE_PATTERN = /^[A-Z0-9._-]+$/;

export function isValidTrackingCode(code: string): boolean {
  if (code.length < MIN_CODE_LENGTH || code.length > MAX_CODE_LENGTH) return false;
  return CODE_PATTERN.test(code);
}

export { MAX_CODE_LENGTH, MIN_CODE_LENGTH };
