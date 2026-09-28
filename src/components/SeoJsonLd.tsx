import { useEffect } from 'react';
import {
  contactConfig,
  faqConfig,
  servicesConfig,
  siteConfig,
} from '../config';

const CANONICAL = siteConfig.canonicalUrl.replace(/\/$/, '');

function phoneToE164(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+1-${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits[0]}-${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

function buildGraph() {
  const businessId = `${CANONICAL}/#business`;
  const websiteId = `${CANONICAL}/#website`;
  const faqId = `${CANONICAL}/#faq`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: `${CANONICAL}/`,
        name: siteConfig.siteName,
        description: siteConfig.siteDescription,
        inLanguage: siteConfig.language || 'en',
        publisher: { '@id': businessId },
      },
      {
        '@type': ['GeneralContractor', 'HomeAndConstructionBusiness', 'LocalBusiness'],
        '@id': businessId,
        name: siteConfig.siteName,
        legalName: siteConfig.legalName,
        alternateName: ['MCProGC', 'Mc Pro', 'MC Pro INC'],
        description: siteConfig.siteDescription,
        url: `${CANONICAL}/`,
        image: siteConfig.ogImage,
        logo: siteConfig.logoUrl,
        telephone: phoneToE164(contactConfig.phone),
        email: contactConfig.email,
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          streetAddress: siteConfig.streetAddress,
          addressLocality: siteConfig.addressLocality,
          addressRegion: siteConfig.addressRegion,
          postalCode: siteConfig.postalCode,
          addressCountry: 'US',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: siteConfig.latitude,
          longitude: siteConfig.longitude,
        },
        hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${siteConfig.streetAddress}, ${siteConfig.addressLocality}, ${siteConfig.addressRegion} ${siteConfig.postalCode}`
        )}`,
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '07:00',
            closes: '17:00',
          },
        ],
        areaServed: [
          { '@type': 'City', name: 'Streamwood' },
          { '@type': 'City', name: 'Chicago' },
          { '@type': 'AdministrativeArea', name: 'Cook County' },
          { '@type': 'AdministrativeArea', name: 'DuPage County' },
          { '@type': 'State', name: 'Illinois' },
        ],
        serviceType: servicesConfig.services.map((s) => s.title),
        knowsAbout: [
          'General contracting',
          'Design-build construction',
          'Pre-construction planning',
          'Construction management',
          'Solid surface installation',
          'Commercial build-outs',
          'Residential remodeling',
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'MC Pro Construction Services',
          itemListElement: servicesConfig.services.map((service, index) => ({
            '@type': 'Offer',
            position: index + 1,
            itemOffered: {
              '@type': 'Service',
              name: service.title,
              description: service.description,
              provider: { '@id': businessId },
              areaServed: { '@type': 'State', name: 'Illinois' },
            },
          })),
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: phoneToE164(contactConfig.phone),
            email: contactConfig.email,
            contactType: 'customer service',
            areaServed: 'US',
            availableLanguage: ['English'],
          },
        ],
        sameAs: siteConfig.sameAs.length > 0 ? siteConfig.sameAs : undefined,
      },
      {
        '@type': 'FAQPage',
        '@id': faqId,
        url: `${CANONICAL}/#faq`,
        mainEntity: faqConfig.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${CANONICAL}/#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${CANONICAL}/` },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${CANONICAL}/#services` },
          { '@type': 'ListItem', position: 3, name: 'Projects', item: `${CANONICAL}/#projects` },
          { '@type': 'ListItem', position: 4, name: 'Contact', item: `${CANONICAL}/#contact` },
        ],
      },
    ],
  };
}

/** Injects semantic JSON-LD @graph for SEO, local GEO, and AI search (GEO). */
export function SeoJsonLd() {
  useEffect(() => {
    const scriptId = 'mcpro-jsonld';
    // Remove static fallback JSON-LD so crawlers see a single @graph.
    document
      .querySelectorAll('script[type="application/ld+json"]:not(#' + scriptId + ')')
      .forEach((node) => node.remove());

    let el = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = scriptId;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(buildGraph());

    const setMeta = (selector: string, attr: string, value: string) => {
      const node = document.querySelector(selector);
      if (node) node.setAttribute(attr, value);
    };

    document.title = siteConfig.siteTitle;
    setMeta('meta[name="description"]', 'content', siteConfig.siteDescription);
    setMeta('meta[name="keywords"]', 'content', siteConfig.keywords);
    setMeta('meta[name="author"]', 'content', siteConfig.siteName);
    setMeta('link[rel="canonical"]', 'href', `${CANONICAL}/`);
    setMeta('meta[property="og:url"]', 'content', `${CANONICAL}/`);
    setMeta('meta[property="og:title"]', 'content', siteConfig.siteTitle);
    setMeta('meta[property="og:description"]', 'content', siteConfig.siteDescription);
    setMeta('meta[property="og:image"]', 'content', siteConfig.ogImage);
    setMeta('meta[property="og:site_name"]', 'content', siteConfig.siteName);
    setMeta('meta[name="twitter:url"]', 'content', `${CANONICAL}/`);
    setMeta('meta[name="twitter:title"]', 'content', siteConfig.siteTitle);
    setMeta('meta[name="twitter:description"]', 'content', siteConfig.siteDescription);
    setMeta('meta[name="twitter:image"]', 'content', siteConfig.ogImage);
    setMeta('meta[name="geo.region"]', 'content', `US-${siteConfig.addressRegion}`);
    setMeta('meta[name="geo.placename"]', 'content', siteConfig.addressLocality);
    setMeta('meta[name="geo.position"]', 'content', `${siteConfig.latitude};${siteConfig.longitude}`);
    setMeta('meta[name="ICBM"]', 'content', `${siteConfig.latitude}, ${siteConfig.longitude}`);
  }, []);

  return null;
}
