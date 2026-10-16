import { z } from 'zod';

/**
 * Contact form input accepted by POST /api/contact.
 * Mirrors the client-side form 1:1.
 */
export const contactFormSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(200),
    phone: z.string().trim().max(30).default(''),
    company: z.string().trim().max(120).default(''),
    projectType: z
      .enum(['retail', 'office', 'industrial', 'medical', 'restaurant', 'other', ''])
      .default(''),
    message: z.string().trim().min(10).max(5000),
    'cf-turnstile-response': z.string().min(1),
    // Honeypot: humans never send this; if present → bot.
    botcheck: z.literal('').optional(),
  })
  .strip();

export type ContactFormInput = z.infer<typeof contactFormSchema>;
