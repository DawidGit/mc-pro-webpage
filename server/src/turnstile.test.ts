import { afterEach, describe, expect, it, vi } from 'vitest';
import { verifyTurnstileToken } from './turnstile';

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

describe('verifyTurnstileToken', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns success when Cloudflare reports the token as valid', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 })
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await verifyTurnstileToken('tok_ok', 'secret', '1.2.3.4');

    expect(result.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      TURNSTILE_VERIFY_URL,
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('returns failure when Cloudflare reports the token as invalid', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: false, 'error-codes': ['invalid-input-response'] }), {
          status: 200,
        })
      )
    );

    const result = await verifyTurnstileToken('tok_bad', 'secret', '1.2.3.4');
    expect(result.ok).toBe(false);
  });

  it('returns failure on network error (fail closed)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));

    const result = await verifyTurnstileToken('tok_x', 'secret', '1.2.3.4');
    expect(result.ok).toBe(false);
  });

  it('returns failure when the secret is empty (misconfiguration)', async () => {
    const result = await verifyTurnstileToken('tok_x', '', '1.2.3.4');
    expect(result.ok).toBe(false);
  });
});
