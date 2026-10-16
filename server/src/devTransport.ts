/**
 * Dev mailer — logs the rendered email to the console instead of sending it.
 * Used when SMTP_PASS is empty (local development).
 */

export interface MailMessage {
  to: string;
  from: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
}

export interface MailTransport {
  sendMail(mail: MailMessage): Promise<{ messageId: string }>;
}

export function createDevTransporter(): MailTransport {
  return {
    async sendMail(mail: MailMessage) {
      console.log('──────────────────────── DEV EMAIL ────────────────────────');
      console.log(`To:      ${mail.to}`);
      console.log(`From:    ${mail.from}`);
      console.log(`ReplyTo: ${mail.replyTo}`);
      console.log(`Subject: ${mail.subject}`);
      console.log('──────────────────────── TEXT ────────────────────────────');
      console.log(mail.text);
      console.log('──────────────────────────────────────────────────────────');
      return { messageId: `<dev-${Date.now()}@localhost>` };
    },
  };
}
