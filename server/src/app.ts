import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import { contactFormSchema } from './validation.js';
import { verifyTurnstileToken, type TurnstileResult } from './turnstile.js';
import { buildContactEmail } from './emailTemplate.js';
import type { RateLimiter } from './rateLimiter.js';

export interface SendMailResult {
  ok: boolean;
}

export interface AppDependencies {
  /** Cloudflare Turnstile secret key (server-side only). */
  turnstileSecret: string;
  verifyTurnstile: (token: string, secret: string, remoteIp?: string) => Promise<TurnstileResult>;
  sendMail: (subject: string, text: string, html: string, replyTo: string) => Promise<SendMailResult>;
  rateLimiter: RateLimiter;
}

function clientIp(req: Request): string {
  // Behind nginx reverse proxy — trust X-Forwarded-For set by our own proxy.
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip ?? 'unknown';
}

function jsonError(res: Response, status: number, message: string, extra?: Record<string, unknown>): void {
  res.status(status).json({ ok: false, message, ...extra });
}

export function createApp(deps: AppDependencies): Express {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', true);

  // Only accept JSON bodies of a sane size.
  app.use(express.json({ limit: '64kb' }));

  app.get('/healthz', (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.post('/api/contact', (req: Request, res: Response) => {
    // 0) Only JSON submissions are accepted.
    const contentType = req.headers['content-type'] ?? '';
    if (!contentType.includes('application/json')) {
      jsonError(res, 415, 'Unsupported content type. Please submit the form from the website.');
      return;
    }

    // 1) Rate limit first — cheap, before any parsing work.
    const ip = clientIp(req);
    const limit = deps.rateLimiter.check(ip);
    if (!limit.allowed) {
      const retryAfterSec = Math.max(1, Math.ceil((limit.retryAfterMs ?? 60_000) / 1000));
      res.setHeader('Retry-After', String(retryAfterSec));
      jsonError(res, 429, 'Too many requests. Please try again later.');
      return;
    }

    // 2) Honeypot — bots get a fake success, no email is sent.
    if (typeof req.body?.botcheck === 'string' && req.body.botcheck !== '') {
      res.status(200).json({ ok: true, message: 'Thank you! Your message has been sent successfully.' });
      return;
    }

    // 3) Validate input.
    const parsed = contactFormSchema.safeParse(req.body);
    if (!parsed.success) {
      jsonError(res, 400, 'Invalid form data. Please check your input and try again.');
      return;
    }

    // 4) Verify the Turnstile token server-side (fail closed).
    void (async () => {
      const turnstile = await deps.verifyTurnstile(
        parsed.data['cf-turnstile-response'],
        deps.turnstileSecret,
        ip
      );
      if (!turnstile.ok) {
        jsonError(res, 403, 'Captcha verification failed. Please refresh the page and try again.');
        return;
      }

      // 5) Build and send the email.
      const email = buildContactEmail(parsed.data);
      const sent = await deps.sendMail(email.subject, email.text, email.html, parsed.data.email);
      if (!sent.ok) {
        jsonError(res, 503, 'Message delivery failed. Please try again or call us directly.');
        return;
      }

      res.status(200).json({ ok: true, message: 'Thank you! Your message has been sent successfully.' });
    })().catch(() => {
      jsonError(res, 500, 'Unexpected server error. Please try again later.');
    });
  });

  // JSON 404 for unknown API paths.
  app.use((_req: Request, res: Response) => {
    jsonError(res, 404, 'Not found.');
  });

  // JSON error handler (bad JSON body → 415/400, not an HTML stack trace).
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    const isBodyParserError =
      'type' in err && (err as NodeJS.ErrnoException & { type?: string }).type !== undefined;
    if (isBodyParserError) {
      jsonError(res, 415, 'Unsupported content type. Please submit the form from the website.');
      return;
    }
    jsonError(res, 500, 'Unexpected server error. Please try again later.');
  });

  return app;
}

export { verifyTurnstileToken };
