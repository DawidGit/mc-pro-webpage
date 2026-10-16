// Contact form submission to our own API (server/ — Express + TypeScript).
// The API verifies the Cloudflare Turnstile token server-side and delivers
// the message via SMTP to office@mcprogc.com.

export interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  message: string;
}

export interface ContactRequestBody extends ContactFormState {
  'cf-turnstile-response': string;
  /** Hidden honeypot — humans never fill it; bots often do. */
  botcheck: string;
}

export type SubmitResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

/** Same-origin route — nginx proxies /api/* to the contact-api container. */
export const CONTACT_API_ENDPOINT = '/api/contact';

export function buildContactRequestBody(
  form: ContactFormState,
  turnstileToken: string
): ContactRequestBody {
  return {
    name: form.name,
    email: form.email,
    phone: form.phone,
    company: form.company,
    projectType: form.projectType,
    message: form.message,
    'cf-turnstile-response': turnstileToken,
    botcheck: '',
  };
}

export async function submitContactForm(
  form: ContactFormState,
  turnstileToken: string
): Promise<SubmitResult> {
  try {
    const response = await fetch(CONTACT_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(buildContactRequestBody(form, turnstileToken)),
    });

    const data = (await response.json().catch(() => null)) as
      | { ok?: boolean; message?: string }
      | null;

    if (response.ok && data?.ok) {
      return { ok: true, message: data.message ?? 'Message sent successfully.' };
    }

    if (response.status === 429) {
      return {
        ok: false,
        message: 'You are sending messages too quickly. Please wait a minute and try again.',
      };
    }

    return {
      ok: false,
      message: data?.message ?? 'Something went wrong. Please try again.',
    };
  } catch {
    return {
      ok: false,
      message: 'Network error. Please check your connection and try again.',
    };
  }
}
