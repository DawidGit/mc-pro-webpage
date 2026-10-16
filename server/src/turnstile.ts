/**
 * Cloudflare Turnstile server-side token verification.
 * https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */

export const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export interface TurnstileResult {
  ok: boolean;
}

export async function verifyTurnstileToken(
  token: string,
  secret: string,
  remoteIp?: string
): Promise<TurnstileResult> {
  if (!secret) return { ok: false };

  const body = new URLSearchParams({
    secret,
    response: token,
  });
  if (remoteIp) body.set('remoteip', remoteIp);

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body,
    });
    if (!response.ok) return { ok: false };

    const data = (await response.json().catch(() => null)) as
      | { success?: boolean }
      | null;
    return { ok: data?.success === true };
  } catch {
    // Fail closed: network errors must never let a submission through.
    return { ok: false };
  }
}
