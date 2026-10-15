import { describe, expect, it } from 'vitest';
import { contactConfig } from '../config';
import {
  buildWeb3FormsPayload,
  WEB3FORMS_ENDPOINT,
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

describe('contactConfig form integration fields', () => {
  it('exposes the Web3Forms access key (may be empty until configured)', () => {
    expect(typeof contactConfig.web3formsAccessKey).toBe('string');
  });

  it('exposes the reCAPTCHA v3 site key (may be empty until configured)', () => {
    expect(typeof contactConfig.recaptchaSiteKey).toBe('string');
  });
});

describe('buildWeb3FormsPayload', () => {
  it('includes access_key, subject and every user field', () => {
    const payload = buildWeb3FormsPayload(validForm, {
      accessKey: 'test-key-123',
    });

    expect(payload.access_key).toBe('test-key-123');
    expect(payload.subject).toContain('MC Pro');
    expect(payload.name).toBe(validForm.name);
    expect(payload.email).toBe(validForm.email);
    expect(payload.phone).toBe(validForm.phone);
    expect(payload.company).toBe(validForm.company);
    // projectType is mapped to a human-readable label for the email
    expect(payload.projectType).toBe('Retail Buildout');
    expect(payload.message).toBe(validForm.message);
    expect(payload.from_name).toBe('MC Pro Website');
  });

  it('adds the hidden honeypot botcheck field', () => {
    const payload = buildWeb3FormsPayload(validForm, {
      accessKey: 'test-key-123',
    });
    expect(payload.botcheck).toBe('');
  });

  it('appends recaptcha_response when a token is provided', () => {
    const payload = buildWeb3FormsPayload(validForm, {
      accessKey: 'test-key-123',
      recaptchaToken: 'tok-abc',
    });
    expect(payload.recaptcha_response).toBe('tok-abc');
  });

  it('omits recaptcha_response when no token is provided', () => {
    const payload = buildWeb3FormsPayload(validForm, {
      accessKey: 'test-key-123',
    });
    expect('recaptcha_response' in payload).toBe(false);
  });

  it('maps empty projectType to a readable label', () => {
    const payload = buildWeb3FormsPayload(
      { ...validForm, projectType: '' },
      { accessKey: 'k' }
    );
    expect(payload.projectType).toBe('Not specified');
  });
});

describe('WEB3FORMS_ENDPOINT', () => {
  it('points at the official Web3Forms submit endpoint', () => {
    expect(WEB3FORMS_ENDPOINT).toBe('https://api.web3forms.com/submit');
  });
});
