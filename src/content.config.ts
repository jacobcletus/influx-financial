import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Structured content collections. Non-developers can edit the YAML
 * and Markdown files in src/data and src/content without touching
 * any component code.
 */

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const services = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/data/services' }),
  schema: z.object({
    title: z.string(),
    navLabel: z.string(),
    seoTitle: z.string(),
    metaDescription: z.string().max(170),
    h1: z.string(),
    icon: z.string(),
    order: z.number(),
    intro: z.string(),
    whoFor: z.array(z.string()),
    challenges: z.array(z.object({ title: z.string(), body: z.string() })),
    howWeHelp: z.array(z.object({ title: z.string(), body: z.string() })),
    process: z.array(z.object({ title: z.string(), body: z.string() })),
    considerations: z.array(z.string()),
    faqs: z.array(faqSchema),
    related: z.array(z.string()),
    teamMember: z.string(),
    articles: z.array(z.string()).default([]),
    ctaHeading: z.string(),
    ctaBody: z.string(),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/data/team' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    order: z.number(),
    image: z.string(),
    imageAlt: z.string(),
    /** Only publish once verified, never invent qualifications. */
    qualifications: z.array(z.string()).default([]),
    memberships: z.array(z.string()).default([]),
    bio: z.string(),
    focus: z.array(z.string()).default([]),
  }),
});

const faqs = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/data/faqs' }),
  schema: z.object({
    category: z.string(),
    order: z.number(),
    items: z.array(faqSchema),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/data/testimonials' }),
  schema: z.object({
    quote: z.string(),
    name: z.string(),
    context: z.string().optional(),
    source: z.string().optional(),
    /** Only testimonials the owner has verified and approved are shown. */
    approved: z.boolean().default(false),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    /** Optional shorter <title> tag (kept under ~60 chars); falls back to `title` + brand suffix. */
    seoTitle: z.string().optional(),
    description: z.string().max(170),
    publishDate: z.coerce.date(),
    reviewDate: z.coerce.date(),
    author: reference('team'),
    category: z.enum([
      'First home buyers',
      'Refinancing',
      'Investing',
      'Loan basics',
      'Business & self-employed',
      'Tax & accounting',
    ]),
    tags: z.array(z.string()).default([]),
    relatedServices: z.array(z.string()).default([]),
    /** Optional Q&A. Rendered as a visible accordion + FAQPage schema. */
    faqs: z.array(faqSchema).default([]),
    draft: z.boolean().default(false),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    /** Optional shorter <title> tag (kept under ~60 chars); falls back to `title` + brand suffix. */
    seoTitle: z.string().optional(),
    description: z.string().max(170),
    clientType: z.string(),
    service: z.string(),
    publishDate: z.coerce.date(),
    challenge: z.string(),
    approach: z.string(),
    outcome: z.string(),
    /** Case studies publish only after the owner verifies details and the client consents. */
    approved: z.boolean().default(false),
    draft: z.boolean().default(true),
  }),
});

export const collections = { services, team, faqs, testimonials, articles, caseStudies };
