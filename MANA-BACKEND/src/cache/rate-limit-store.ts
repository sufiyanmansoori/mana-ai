export interface RateLimitWindow {
  count: number;
  resetAt: number;
}

export interface RateLimitStore {
  increment(key: string, windowMs: number): Promise<RateLimitWindow>;
}

export class MemoryRateLimitStore implements RateLimitStore {
  private readonly windows = new Map<string, RateLimitWindow>();

  constructor(
    private readonly now: () => number = Date.now,
    private readonly maxEntries = 100_000,
  ) {
    if (!Number.isSafeInteger(maxEntries) || maxEntries < 1) {
      throw new RangeError('Rate limit maxEntries must be a positive integer.');
    }
  }

  async increment(key: string, windowMs: number): Promise<RateLimitWindow> {
    if (key.trim().length === 0) throw new TypeError('Rate limit key is required.');
    if (!Number.isSafeInteger(windowMs) || windowMs < 1) {
      throw new RangeError('Rate limit window must be a positive integer in milliseconds.');
    }
    const currentTime = this.now();
    const current = this.windows.get(key);
    if (!current || current.resetAt <= currentTime) {
      if (!current && this.windows.size >= this.maxEntries) this.pruneExpired();
      if (!current && this.windows.size >= this.maxEntries) {
        throw new Error('Memory rate limit store is full; refusing to bypass rate limits.');
      }
      const next = { count: 1, resetAt: currentTime + windowMs };
      this.windows.set(key, next);
      return { ...next };
    }
    current.count += 1;
    return { ...current };
  }

  pruneExpired(): number {
    const currentTime = this.now();
    let removed = 0;
    for (const [key, window] of this.windows) {
      if (window.resetAt <= currentTime) {
        this.windows.delete(key);
        removed += 1;
      }
    }
    return removed;
  }
}
