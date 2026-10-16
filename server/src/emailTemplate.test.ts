import { describe, expect, it } from 'vitest';
import { buildContactEmail } from './emailTemplate';

const validForm = {
  name: 'Dawid Widulinski',
  email: 'dawid@example.com',
  phone: '(630) 313-0694',
  company: 'Numeritum',
  projectType: 'retail',
  message: 'Test message about a retail buildout.',
};

describe('buildContactEmail', () => {
  it('renders subject with the stable automation prefix and sender name', () => {
    const { subject } = buildContactEmail(validForm);
    expect(subject).toBe('[MC Pro Website] Consultation request — Dawid Widulinski');
  });

  it('renders a text body containing every field', () => {
    const { text } = buildContactEmail(validForm);
    expect(text).toContain('Dawid Widulinski');
    expect(text).toContain('dawid@example.com');
    expect(text).toContain('(630) 313-0694');
    expect(text).toContain('Numeritum');
    expect(text).toContain('Retail Buildout');
    expect(text).toContain('Test message about a retail buildout.');
  });

  it('maps an empty project type to a readable label', () => {
    const { text } = buildContactEmail({ ...validForm, projectType: '' });
    expect(text).toContain('Not specified');
  });

  it('escapes HTML in user input for the HTML body (XSS in mail clients)', () => {
    const { html } = buildContactEmail({
      ...validForm,
      name: '<script>alert(1)</script>',
      message: '<b>bold</b> & "quotes"',
    });
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&quot;quotes&quot;');
    expect(html).toContain('&amp; &quot;quotes&quot;');
  });

  it('preserves line breaks in the message body', () => {
    const { text, html } = buildContactEmail({
      ...validForm,
      message: 'line one\nline two',
    });
    expect(text).toContain('line one\nline two');
    expect(html).toContain('line one<br>line two');
  });
});
