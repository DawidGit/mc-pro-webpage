import { describe, expect, it, vi } from 'vitest';
import { createRateLimiter } from './rateLimiter';

describe('createRateLimiter', () => {
  it('allows requests under the limit', () => {
    const limiter = createRateLimiter({ windowMs: 60_000, max: 3 });
    expect(limiter.check('1.1.1.1').allowed).toBe(true);
    expect(limiter.check('1.1.1.1').allowed).toBe(true);
    expect(limiter.check('1.1.1.1').allowed).toBe(true);
  });

  it('blocks requests over the limit within the window', () => {
    const limiter = createRateLimiter({ windowMs: 60_000, max: 2 });
    limiter.check('2.2.2.2');
    limiter.check('2.2.2.2');
    const blocked = limiter.check('2.2.2.2');
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });

  it('tracks clients independently', () => {
    const limiter = createRateLimiter({ windowMs: 60_000, max: 1 });
    limiter.check('3.3.3.3');
    expect(limiter.check('3.3.3.3').allowed).toBe(false);
    expect(limiter.check('4.4.4.4').allowed).toBe(true);
  });

  it('resets after the window elapses', () => {
    vi.useFakeTimers();
    try {
      const limiter = createRateLimiter({ windowMs: 1_000, max: 1 });
      limiter.check('5.5.5.5');
      expect(limiter.check('5.5.5.5').allowed).toBe(false);
      vi.advanceTimersByTime(1_100);
      expect(limiter.check('5.5.5.5').allowed).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it('prunes expired entries to avoid unbounded memory growth', () => {
    vi.useFakeTimers();
    try {
      const limiter = createRateLimiter({ windowMs: 1_000, max: 1 });
      limiter.check('6.6.6.6');
      vi.advanceTimersByTime(1_100);
      limiter.check('7.7.7.7');
      expect(limiter.size()).toBe(1);
    } finally {
      vi.useRealTimers();
    }
  });
});
