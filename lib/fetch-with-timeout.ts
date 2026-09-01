import { ProviderTimeoutError } from "./errors";

const DEFAULT_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT ?? 8000);

/**
 * Wrapper quanh fetch() có timeout bắt buộc (mục 28 trong spec).
 * Không được để request treo vô thời hạn.
 */
export async function fetchWithTimeout(
  providerId: string,
  url: string,
  init: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
        Accept: "text/html,application/json;q=0.9,*/*;q=0.8",
        ...init.headers,
      },
    });
    return res;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new ProviderTimeoutError(providerId, timeoutMs);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
