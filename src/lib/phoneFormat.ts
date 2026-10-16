/**
 * Auto-formats US phone numbers as the user types: (xxx) xxx-xxxx.
 *
 * The user can type digits in any style (3124050066, 312-405-0066,
 * +1 312 405 0066…) — separators are ignored and the canonical format
 * is applied progressively, so the field always shows what it will look
 * like. A leading 1/+1 country code is dropped; input is capped at 10
 * digits.
 */
export function formatPhoneNumber(input: string): string {
  let digits = input.replace(/\D/g, '');

  // Drop a leading US country code (1 / +1) once 11 digits are present.
  if (digits.length === 11 && digits.startsWith('1')) {
    digits = digits.slice(1);
  }

  // Keep at most 10 digits (US NANP).
  digits = digits.slice(0, 10);

  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}
