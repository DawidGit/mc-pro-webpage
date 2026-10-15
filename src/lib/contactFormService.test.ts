import { describe, expect, it } from 'vitest';
import { contactConfig } from '../config';
import {
  buildWeb3FormsPayload,
  WEB3FORMS_ENDPOINT,
  HCAPTCHA_SITE_KEY,
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

  it('no longer exposes a reCAPTCHA site key (replaced by hCaptcha)', () => {
    expect('recaptchaSiteKey' in contactConfig).toBe(false);
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

  it('appends h-captcha-response when a token is provided', () => {
    const payload = buildWeb3FormsPayload(validForm, {
      accessKey: 'test-key-123',
      captchaToken: 'hcaptcha-tok-abc',
    });
    expect(payload['h-captcha-response']).toBe('hcaptcha-tok-abc');
  });

  it('omits captcha token when none is provided', () => {
    const payload = buildWeb3FormsPayload(validForm, {
      accessKey: 'test-key-123',
    });
    expect('h-captcha-response' in payload).toBe(false);
  });

  it('maps empty projectType to a readable label', () => {
    const payload = buildWeb3FormsPayload(
      { ...validForm, projectType: '' },
      { accessKey: 'k' }
    );
    expect(payload.projectType).toBe('Not specified');
  });
});

describe('WEB3FORMS_ENDPOINT and HCAPTCHA_SITE_KEY', () => {
  it('points at the official Web3Forms submit endpoint', () => {
    expect(WEB3FORMS_ENDPOINT).toBe('https://api.web3forms.com/submit');
  });

  it('uses the Web3Forms shared hCaptcha site key for free plans', () => {
    expect(HCAPTCHA_SITE_KEY).toBe('50b2fe65-b00b-4b9e-ad62-3ba471098be2');
  });
});
