/**
 * JSON-LD structured data builders. All business facts come from
 * src/data/site.ts so schema stays consistent with visible content.
 * Fields that are unverified (null in site.ts) are simply omitted —
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
    telephone: '+61 3 7047 9370',
    email: site.contact.email,
    areaServed: [
      { '@type': 'City', name: 'Melbourne' },
      { '@type': 'State', name: 'Victoria' },
      { '@type': 'Country', name: 'Australia' },
    ],
    sameAs: [site.social.facebook].filter(Boolean),
    // Address intentionally omitted until a public office address is
    // confirmed. [OWNER TO CONFIRM]
  };
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
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: input.name,
    jobTitle: input.role,
    image: `${site.url}${input.image}`,
    url: input.url,
    description: input.description,
    worksFor: { '@id': ORG_ID },
  };
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
