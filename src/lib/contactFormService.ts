// Contact form submission via Web3Forms (https://web3forms.com)
// Static-site friendly: no backend required, emails land in office@mcprogc.com.

export interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  message: string;
}

export interface Web3FormsPayload {
  access_key: string;
  subject: string;
  from_name: string;
  botcheck: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  message: string;
  recaptcha_response?: string;
}

export interface BuildPayloadOptions {
  accessKey: string;
  /** reCAPTCHA v3 token — only present when a site key is configured (Web3Forms Pro). */
  recaptchaToken?: string;
}

export type SubmitResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

const PROJECT_TYPE_LABELS: Record<string, string> = {
  retail: 'Retail Buildout',
  office: 'Office Renovation',
  industrial: 'Industrial/Warehouse',
  medical: 'Medical Facility',
  restaurant: 'Restaurant/Food Service',
  other: 'Other Commercial Project',
};

export function projectTypeLabel(value: string): string {
  return PROJECT_TYPE_LABELS[value] ?? 'Not specified';
}

export function buildWeb3FormsPayload(
  form: ContactFormState,
  options: BuildPayloadOptions
): Web3FormsPayload {
  const payload: Web3FormsPayload = {
    access_key: options.accessKey,
    subject: 'MC Pro website — new consultation request',
    from_name: 'MC Pro Website',
    // Hidden honeypot: humans never fill this; bots often do. Web3Forms filters it.
    botcheck: '',
    name: form.name,
    email: form.email,
    phone: form.phone,
    company: form.company,
    projectType: projectTypeLabel(form.projectType),
    message: form.message,
  };

  if (options.recaptchaToken) {
    payload.recaptcha_response = options.recaptchaToken;
  }

  return payload;
}

export async function submitToWeb3Forms(
  form: ContactFormState,
  options: BuildPayloadOptions
): Promise<SubmitResult> {
  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(buildWeb3FormsPayload(form, options)),
    });

    const data = (await response.json().catch(() => null)) as
      | { success?: boolean; message?: string }
      | null;

    if (response.ok && data?.success) {
      return { ok: true, message: data.message ?? 'Message sent successfully.' };
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
