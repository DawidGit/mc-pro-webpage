/**
 * In-memory sliding-window rate limiter (per client IP).
 * Sufficient for a single-instance contact form API.
 */

export interface RateLimiterOptions {
  /** Window length in milliseconds. */
  windowMs: number;
  /** Max requests per window per IP. */
  max: number;
}

export interface RateLimitResult {
  allowed: boolean;
  /** Milliseconds until the limit resets (only set when blocked). */
  retryAfterMs?: number;
}

interface Hit {
  count: number;
  resetAt: number;
}

export interface RateLimiter {
  check(key: string): RateLimitResult;
  /** Number of tracked IPs — for tests/metrics. */
  size(): number;
}

export function createRateLimiter(options: RateLimiterOptions): RateLimiter {
  const { windowMs, max } = options;
  const hits = new Map<string, Hit>();

  function prune(now: number): void {
    for (const [key, hit] of hits) {
      if (hit.resetAt <= now) hits.delete(key);
    }
  }

  return {
    check(key: string): RateLimitResult {
      const now = Date.now();
      prune(now);

      const hit = hits.get(key);
      if (!hit) {
        hits.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true };
      }

      if (hit.count >= max) {
        return { allowed: false, retryAfterMs: hit.resetAt - now };
      }

      hit.count += 1;
      return { allowed: true };
    },

    size(): number {
      return hits.size;
    },
  };
}
