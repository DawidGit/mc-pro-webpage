/**
 * Plain-text + HTML email rendering for contact form submissions.
 * All user input is HTML-escaped to prevent XSS in mail clients.
 */

export interface ContactEmailData {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  message: string;
}

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

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export interface RenderedEmail {
  subject: string;
  text: string;
  html: string;
}

export function buildContactEmail(data: ContactEmailData): RenderedEmail {
  const label = projectTypeLabel(data.projectType);

  // Stable prefix for mail filters/automation; name for human scanning.
  const subject = `[MC Pro Website] Consultation request — ${data.name}`;

  const text = [
    'New consultation request from the MC Pro website contact form.',
    '',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || '—'}`,
    `Company: ${data.company || '—'}`,
    `Project type: ${label}`,
    '',
    'Message:',
    data.message,
    '',
    '— Sent automatically by mcprogc.com contact form',
  ].join('\n');

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1f2937">
  <h2 style="margin:0 0 16px;font-size:18px;color:#111827">New consultation request</h2>
  <table style="border-collapse:collapse;width:100%;font-size:14px">
    <tr><td style="padding:6px 12px 6px 0;color:#6b7280;white-space:nowrap">Name</td><td style="padding:6px 0"><strong>${escapeHtml(data.name)}</strong></td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#6b7280;white-space:nowrap">Email</td><td style="padding:6px 0"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#6b7280;white-space:nowrap">Phone</td><td style="padding:6px 0">${escapeHtml(data.phone || '—')}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#6b7280;white-space:nowrap">Company</td><td style="padding:6px 0">${escapeHtml(data.company || '—')}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#6b7280;white-space:nowrap">Project type</td><td style="padding:6px 0">${escapeHtml(label)}</td></tr>
  </table>
  <h3 style="margin:24px 0 8px;font-size:14px;color:#374151">Message</h3>
  <p style="margin:0;padding:12px 16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;white-space:pre-line">${escapeHtml(data.message).replaceAll('\n', '<br>')}</p>
  <p style="margin:24px 0 0;font-size:12px;color:#9ca3af">Sent automatically by mcprogc.com contact form</p>
</div>`;

  return { subject, text, html };
}
