import { describe, expect, it } from 'vitest';
import {
  buildContactRequestBody,
  CONTACT_API_ENDPOINT,
  type ContactFormState,
} from './contactFormService';

const validForm: ContactFormState = {
  name: 'Dawid P Widulinski',
  email: 'dawid.widulinski@gmail.com',
  phone: '6303130694',
  company: 'Numeritum',
  projectType: 'retail',
  message: 'TEST',
};

describe('buildContactRequestBody', () => {
  it('includes every user field and the turnstile token', () => {
    const body = buildContactRequestBody(validForm, 'tok_abc');

    expect(body.name).toBe(validForm.name);
    expect(body.email).toBe(validForm.email);
    expect(body.phone).toBe(validForm.phone);
    expect(body.company).toBe(validForm.company);
    expect(body.projectType).toBe(validForm.projectType);
    expect(body.message).toBe(validForm.message);
    expect(body['cf-turnstile-response']).toBe('tok_abc');
  });

  it('adds the hidden honeypot botcheck field', () => {
    const body = buildContactRequestBody(validForm, 'tok_abc');
    expect(body.botcheck).toBe('');
  });

  it('sends the raw projectType value (labels are resolved server-side)', () => {
    const body = buildContactRequestBody({ ...validForm, projectType: 'medical' }, 't');
    expect(body.projectType).toBe('medical');
  });
});

describe('CONTACT_API_ENDPOINT', () => {
  it('points at the same-origin API route proxied by nginx', () => {
    expect(CONTACT_API_ENDPOINT).toBe('/api/contact');
  });
});
