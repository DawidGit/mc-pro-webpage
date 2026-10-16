import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Server } from 'node:http';
import { createApp, type AppDependencies } from './app';
import { createRateLimiter } from './rateLimiter';

const validBody = {
  name: 'Dawid Widulinski',
  email: 'dawid@example.com',
  phone: '(630) 313-0694',
  company: 'Numeritum',
  projectType: 'retail',
  message: 'Test message about a retail buildout.',
  'cf-turnstile-response': 'tok_abc123',
};

function makeDeps(overrides: Partial<AppDependencies> = {}): AppDependencies {
  return {
    turnstileSecret: 'test-secret',
    verifyTurnstile: vi.fn().mockResolvedValue({ ok: true }),
    sendMail: vi.fn().mockResolvedValue({ ok: true }),
    rateLimiter: createRateLimiter({ windowMs: 60_000, max: 100 }),
    ...overrides,
  };
}

let server: Server;
let baseUrl: string;

async function startApp(deps: AppDependencies) {
  const app = createApp(deps);
  await new Promise<void>((resolve) => {
    server = app.listen(0, '127.0.0.1', () => resolve());
  });
  const addr = server.address();
  if (typeof addr === 'object' && addr) {
    baseUrl = `http://127.0.0.1:${addr.port}`;
  }
}

afterEach(async () => {
  if (server) {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
  vi.restoreAllMocks();
});

describe('POST /api/contact', () => {
  it('returns 200 and sends the email for a valid submission', async () => {
    const deps = makeDeps();
    await startApp(deps);

    const res = await fetch(`${baseUrl}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validBody),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(deps.sendMail).toHaveBeenCalledOnce();

    // Automation-friendly subject, sender name, and headers.
    const [subject, _text, _html, _replyTo, headers] = vi.mocked(deps.sendMail).mock.calls[0];
    expect(subject).toBe('[MC Pro Website] Consultation request — Dawid Widulinski');
    expect(headers).toEqual({
      'X-Contact-Form': 'mcprogc.com',
      'X-Project-Type': 'retail',
      'Auto-Submitted': 'auto-generated',
    });
  });

  it('returns 400 for invalid input (missing turnstile token)', async () => {
    const deps = makeDeps();
    await startApp(deps);

    const res = await fetch(`${baseUrl}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...validBody, 'cf-turnstile-response': '' }),
    });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(deps.sendMail).not.toHaveBeenCalled();
  });

  it('returns 403 when Turnstile verification fails', async () => {
    const deps = makeDeps({
      verifyTurnstile: vi.fn().mockResolvedValue({ ok: false }),
    });
    await startApp(deps);

    const res = await fetch(`${baseUrl}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validBody),
    });

    expect(res.status).toBe(403);
    expect(deps.sendMail).not.toHaveBeenCalled();
  });

  it('returns 503 when email delivery fails', async () => {
    const deps = makeDeps({
      sendMail: vi.fn().mockResolvedValue({ ok: false }),
    });
    await startApp(deps);

    const res = await fetch(`${baseUrl}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validBody),
    });

    expect(res.status).toBe(503);
  });

  it('returns 429 when the rate limit is exceeded', async () => {
    const deps = makeDeps({
      rateLimiter: createRateLimiter({ windowMs: 60_000, max: 1 }),
    });
    await startApp(deps);

    const first = await fetch(`${baseUrl}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validBody),
    });
    expect(first.status).toBe(200);

    const second = await fetch(`${baseUrl}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validBody),
    });
    expect(second.status).toBe(429);
    expect(second.headers.get('retry-after')).toBeTruthy();
  });

  it('silently accepts honeypot submissions (bots get fake success)', async () => {
    const deps = makeDeps();
    await startApp(deps);

    const res = await fetch(`${baseUrl}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...validBody, botcheck: 'on' }),
    });

    expect(res.status).toBe(200);
    expect(deps.sendMail).not.toHaveBeenCalled();
  });

  it('returns 415 for non-JSON content type', async () => {
    const deps = makeDeps();
    await startApp(deps);

    const res = await fetch(`${baseUrl}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: 'hello',
    });

    expect(res.status).toBe(415);
  });

  it('returns 404 for unknown paths', async () => {
    const deps = makeDeps();
    await startApp(deps);

    const res = await fetch(`${baseUrl}/unknown`);
    expect(res.status).toBe(404);
  });

  it('returns health status on /healthz', async () => {
    const deps = makeDeps();
    await startApp(deps);

    const res = await fetch(`${baseUrl}/healthz`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
  });
});
