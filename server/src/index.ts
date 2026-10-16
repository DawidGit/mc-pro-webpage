import nodemailer, { type SentMessageInfo } from 'nodemailer';
import { createApp, type AppDependencies, type MailHeaders, type SendMailResult } from './app.js';
import { verifyTurnstileToken } from './turnstile.js';
import { createRateLimiter } from './rateLimiter.js';
import { createDevTransporter, type MailMessage, type MailTransport } from './devTransport.js';

interface ServerEnv {
  port: number;
  turnstileSecret: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  mailFrom: string;
  mailTo: string;
}

function readEnv(): ServerEnv {
  const required = ['TURNSTILE_SECRET_KEY', 'SMTP_USER', 'MAIL_TO'];
  const missing = required.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: Number(process.env.PORT ?? 3000),
    turnstileSecret: process.env.TURNSTILE_SECRET_KEY!,
    smtpHost: process.env.SMTP_HOST ?? 'smtp.gmail.com',
    smtpPort: Number(process.env.SMTP_PORT ?? 587),
    smtpUser: process.env.SMTP_USER!,
    // Empty in dev mode → emails are logged instead of sent.
    smtpPass: process.env.SMTP_PASS ?? '',
    mailFrom: process.env.MAIL_FROM || process.env.SMTP_USER!,
    mailTo: process.env.MAIL_TO!,
  };
}

function createTransporter(env: ServerEnv): MailTransport {
  // No SMTP password → local dev mode: log emails instead of sending them.
  if (!env.smtpPass) {
    console.warn('SMTP_PASS is empty — running in DEV mode (emails are logged, not sent).');
    return createDevTransporter();
  }
  const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: { user: env.smtpUser, pass: env.smtpPass },
  });
  // Adapter: nodemailer's callback-style overloads → our MailTransport shape.
  return {
    async sendMail(mail: MailMessage) {
      const info: SentMessageInfo = await transporter.sendMail({
        from: mail.from,
        to: mail.to,
        replyTo: mail.replyTo,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
        headers: mail.headers as Record<string, string> | undefined,
      });
      return { messageId: info.messageId };
    },
  };
}

function main(): void {
  const env = readEnv();
  const transporter = createTransporter(env);

  const sendMail = async (
    subject: string,
    text: string,
    html: string,
    replyTo: string,
    headers: MailHeaders
  ): Promise<SendMailResult> => {
    try {
      await transporter.sendMail({
        // Display name is filter-friendly: Gmail filter "from:Consultation Request".
        from: `Consultation Request <${env.mailFrom}>`,
        to: env.mailTo,
        replyTo,
        subject,
        text,
        html,
        headers,
      });
      return { ok: true };
    } catch (error) {
      console.error('Email delivery failed:', error);
      return { ok: false };
    }
  };  const deps: AppDependencies = {
    turnstileSecret: env.turnstileSecret,
    verifyTurnstile: verifyTurnstileToken,
    sendMail,
    rateLimiter: createRateLimiter({ windowMs: 60_000, max: 5 }),
  };

  const app = createApp(deps);
  app.listen(env.port, '0.0.0.0', () => {
    console.log(`Contact API listening on port ${env.port}`);
  });
}

main();
