import { describe, expect, it } from 'vitest';
import {
  contactConfig,
  faqConfig,
  footerConfig,
  servicesConfig,
  siteConfig,
  testimonialsConfig,
} from './config';

describe('siteConfig (SEO / GEO)', () => {
  it('has required branding and canonical fields', () => {
    expect(siteConfig.siteName).toBeTruthy();
    expect(siteConfig.legalName).toBeTruthy();
    expect(siteConfig.siteTitle.length).toBeGreaterThan(10);
    expect(siteConfig.siteDescription.length).toBeGreaterThan(40);
    expect(siteConfig.canonicalUrl).toMatch(/^https:\/\//);
    expect(siteConfig.ogImage).toMatch(/^https:\/\//);
  });

  it('has Streamwood NAP geo coordinates', () => {
    expect(siteConfig.streetAddress).toContain('Bonded Parkway');
    expect(siteConfig.addressLocality).toBe('Streamwood');
    expect(siteConfig.addressRegion).toBe('IL');
    expect(siteConfig.postalCode).toBe('60107');
    expect(siteConfig.latitude).toBeGreaterThan(40);
    expect(siteConfig.longitude).toBeLessThan(-87);
  });
});

describe('contact & footer NAP consistency', () => {
  it('uses the production phone and email', () => {
    expect(contactConfig.phone).toBe('(312) 405-0066');
    expect(contactConfig.email).toBe('office@mcprogc.com');
    expect(footerConfig.email).toBe(contactConfig.email);
  });

  it('keeps contact and footer address aligned with siteConfig', () => {
    expect(contactConfig.address).toContain(siteConfig.streetAddress);
    expect(contactConfig.address).toContain(siteConfig.addressLocality);
    expect(contactConfig.address).toContain(siteConfig.postalCode);
    expect(footerConfig.locationText).toContain(siteConfig.streetAddress);
    expect(footerConfig.locationText).toContain(siteConfig.addressLocality);
  });

  it('has a Google Maps embed pointing at Streamwood', () => {
    expect(contactConfig.mapEmbedUrl).toMatch(/maps\.google\.com|google\.com\/maps/);
    expect(contactConfig.mapEmbedUrl).toMatch(/Streamwood|Bonded/i);
  });
});

describe('content sections', () => {
  it('has at least one service', () => {
    expect(servicesConfig.services.length).toBeGreaterThan(0);
    for (const service of servicesConfig.services) {
      expect(service.title.trim()).not.toBe('');
      expect(service.description.trim()).not.toBe('');
    }
  });

  it('has exactly three testimonials in one row', () => {
    expect(testimonialsConfig.testimonials).toHaveLength(3);
    for (const item of testimonialsConfig.testimonials) {
      expect(item.name.trim()).not.toBe('');
      expect(item.quote.trim().length).toBeGreaterThan(20);
      expect(item.image).toBeTruthy();
    }
  });

  it('has FAQ entries for schema coverage', () => {
    expect(faqConfig.faqs.length).toBeGreaterThanOrEqual(3);
    for (const faq of faqConfig.faqs) {
      expect(faq.question.trim()).not.toBe('');
      expect(faq.answer.trim().length).toBeGreaterThan(20);
    }
  });
});
