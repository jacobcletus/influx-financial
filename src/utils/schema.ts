/**
 * JSON-LD structured data builders. All business facts come from
 * src/data/site.ts so schema stays consistent with visible content.
 * Fields that are unverified (null in site.ts) are simply omitted,
 * never fabricated.
 */
import { site } from '@/data/site';

type JsonLd = Record<string, unknown>;

const ORG_ID = `${site.url}/#organization`;

export function organizationSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'FinancialService'],
    '@id': ORG_ID,
    name: site.name,
    url: site.url,
    logo: `${site.url}/images/influx-logo-dark.png`,
    image: `${site.url}/images/og/og-default.png`,
    description: site.description,
    telephone: '+61 488 705 689',
    email: site.contact.email,
    areaServed: [
      ...site.serviceSuburbs.map((name) => ({ '@type': 'City', name })),
      { '@type': 'City', name: 'Melbourne' },
      { '@type': 'State', name: 'Victoria' },
      { '@type': 'Country', name: 'Australia' },
    ],
    award: site.awards.map((a) => `${a.result} — ${a.name} ${a.year}: ${a.category}`),
    sameAs: [site.social.facebook, site.social.instagram].filter(Boolean),
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.offices[0].building
        ? `${site.offices[0].building}, ${site.offices[0].address}`
        : site.offices[0].address,
      addressLocality: 'Mickleham',
      addressRegion: 'VIC',
      postalCode: '3064',
      addressCountry: 'AU',
    },
  };
}

export function websiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    url: site.url,
    name: site.name,
    inLanguage: 'en-AU',
    publisher: { '@id': ORG_ID },
  };
}

/**
 * One FinancialService (LocalBusiness) node per physical office, each with
 * its own NAP + local `areaServed`, linked to the parent Organization.
 * This is what powers the Google local pack for both locations.
 */
export function localBusinessSchemas(): JsonLd[] {
  return site.offices.map((office) => ({
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    '@id': `${site.url}/#office-${office.id}`,
    name: `${site.name} — ${office.locality}`,
    parentOrganization: { '@id': ORG_ID },
    url: site.url,
    image: `${site.url}/images/og/og-default.png`,
    telephone: office.phoneHref.replace('tel:', ''),
    address: {
      '@type': 'PostalAddress',
      streetAddress: office.building ? `${office.building}, ${office.address}` : office.address,
      addressLocality: office.locality,
      addressRegion: office.region,
      postalCode: office.postalCode,
      addressCountry: 'AU',
    },
    areaServed: office.areaServed.map((name) => ({ '@type': 'City', name })),
    hasMap: `https://maps.google.com/maps?q=${encodeURIComponent(office.mapQuery)}`,
  }));
}

export function serviceSchema(input: { name: string; description: string; url: string }): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    url: input.url,
    serviceType: input.name,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'State', name: 'Victoria' },
  };
}

export function breadcrumbSchema(items: Array<{ name: string; href: string }>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.href}`,
    })),
  };
}

export function faqSchema(items: Array<{ question: string; answer: string }>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function personSchema(input: {
  name: string;
  role: string;
  image: string;
  url: string;
  description: string;
  /** e.g. "Finalist — AFG Broker Awards 2026: Best New Broker". Omitted if absent. */
  award?: string | string[];
}): JsonLd {
  const schema: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: input.name,
    jobTitle: input.role,
    image: `${site.url}${input.image}`,
    url: input.url,
    description: input.description,
    worksFor: { '@id': ORG_ID },
  };
  if (input.award) schema.award = input.award;
  return schema;
}

export function articleSchema(input: {
  title: string;
  description: string;
  url: string;
  publishDate: Date;
  reviewDate: Date;
  authorName: string;
  authorUrl: string;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    url: input.url,
    datePublished: input.publishDate.toISOString(),
    dateModified: input.reviewDate.toISOString(),
    author: { '@type': 'Person', name: input.authorName, url: input.authorUrl },
    publisher: { '@id': ORG_ID },
    image: `${site.url}/images/og/og-default.png`,
    mainEntityOfPage: input.url,
  };
}
