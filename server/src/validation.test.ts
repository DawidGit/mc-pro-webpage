import { describe, expect, it } from 'vitest';
import { ContactFormInput, contactFormSchema } from './validation';

const validInput: ContactFormInput = {
  name: 'Dawid Widulinski',
  email: 'dawid@example.com',
  phone: '(630) 313-0694',
  company: 'Numeritum',
  projectType: 'retail',
  message: 'Test message about a retail buildout.',
  'cf-turnstile-response': 'tok_abc123',
};

describe('contactFormSchema', () => {
  it('accepts a fully valid submission', () => {
    const result = contactFormSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('rejects a missing turnstile token', () => {
    const { 'cf-turnstile-response': _token, ...rest } = validInput;
    const result = contactFormSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = contactFormSchema.safeParse({
      ...validInput,
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a missing name', () => {
    const result = contactFormSchema.safeParse({ ...validInput, name: '' });
    expect(result.success).toBe(false);
  });

  it('rejects a too-short message', () => {
    const result = contactFormSchema.safeParse({ ...validInput, message: 'hi' });
    expect(result.success).toBe(false);
  });

  it('rejects an over-long message (spam guard)', () => {
    const result = contactFormSchema.safeParse({
      ...validInput,
      message: 'x'.repeat(5001),
    });
    expect(result.success).toBe(false);
  });

  it('allows optional fields to be empty strings', () => {
    const result = contactFormSchema.safeParse({
      ...validInput,
      phone: '',
      company: '',
      projectType: '',
    });
    expect(result.success).toBe(true);
  });

  it('rejects unknown projectType values', () => {
    const result = contactFormSchema.safeParse({
      ...validInput,
      projectType: 'skyscraper',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a honeypot (botcheck) filled in', () => {
    const result = contactFormSchema.safeParse({
      ...validInput,
      botcheck: 'on',
    });
    expect(result.success).toBe(false);
  });

  it('strips unknown extra fields (prototype pollution guard)', () => {
    const result = contactFormSchema.safeParse({
      ...validInput,
      __proto__: 'x',
      extra: 'field',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect('extra' in (result.data as object)).toBe(false);
    }
  });
});
