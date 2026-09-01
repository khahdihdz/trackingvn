export class ProviderError extends Error {
  constructor(
    message: string,
    public code:
      | "NOT_FOUND"
      | "TIMEOUT"
      | "BLOCKED"
      | "MALFORMED_RESPONSE"
      | "UPSTREAM_ERROR"
      | "NOT_VERIFIED" = "UPSTREAM_ERROR",
  ) {
    super(message);
    this.name = "ProviderError";
  }
}

export class ProviderTimeoutError extends ProviderError {
  constructor(providerId: string, ms: number) {
    super(`Provider "${providerId}" timed out after ${ms}ms`, "TIMEOUT");
    this.name = "ProviderTimeoutError";
  }
}

export class RateLimitError extends Error {
  constructor(public retryAfterSeconds: number) {
    super(`Rate limit exceeded. Retry after ${retryAfterSeconds}s`);
    this.name = "RateLimitError";
  }
}
