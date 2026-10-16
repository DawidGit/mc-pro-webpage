import { describe, expect, it } from 'vitest';
import { formatPhoneNumber } from './phoneFormat';

describe('formatPhoneNumber', () => {
  it('formats progressively as the user types', () => {
    expect(formatPhoneNumber('3')).toBe('(3');
    expect(formatPhoneNumber('31')).toBe('(31');
    expect(formatPhoneNumber('312')).toBe('(312');
    expect(formatPhoneNumber('3124')).toBe('(312) 4');
    expect(formatPhoneNumber('31240')).toBe('(312) 40');
    expect(formatPhoneNumber('312405')).toBe('(312) 405');
    expect(formatPhoneNumber('3124050')).toBe('(312) 405-0');
    expect(formatPhoneNumber('3124050066')).toBe('(312) 405-0066');
  });

  it('strips separators the user typed', () => {
    expect(formatPhoneNumber('312-405-0066')).toBe('(312) 405-0066');
    expect(formatPhoneNumber('312.405.0066')).toBe('(312) 405-0066');
    expect(formatPhoneNumber('(312) 405-0066')).toBe('(312) 405-0066');
    expect(formatPhoneNumber('312 405 0066')).toBe('(312) 405-0066');
  });

  it('drops a leading 1/+1 country code', () => {
    expect(formatPhoneNumber('13124050066')).toBe('(312) 405-0066');
    expect(formatPhoneNumber('+1 312 405 0066')).toBe('(312) 405-0066');
    expect(formatPhoneNumber('1 (312) 405-0066')).toBe('(312) 405-0066');
  });

  it('caps input at 10 digits', () => {
    expect(formatPhoneNumber('3124050066999')).toBe('(312) 405-0066');
  });

  it('returns empty string for no digits', () => {
    expect(formatPhoneNumber('')).toBe('');
    expect(formatPhoneNumber('abc')).toBe('');
    expect(formatPhoneNumber('---')).toBe('');
  });

  it('keeps partial input while typing (no country-code stripping mid-typing)', () => {
    // 1 as first digit must not be stripped while it could still be a
    // valid area code start (e.g. 1xx area codes exist).
    expect(formatPhoneNumber('1')).toBe('(1');
    expect(formatPhoneNumber('131')).toBe('(131');
  });
});
