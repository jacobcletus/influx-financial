# Influx Financial — Website

Production website for [Influx Financial](https://influxfinancial.com.au) — an Australian
mortgage broking, lending and accounting business based in Melbourne.

Built with **Astro 5 + React 19 + TypeScript (strict) + Tailwind CSS 4**, deployed on
**Cloudflare Pages** with a Pages Function for secure form handling.

## Stack at a glance

| Concern | Choice |
| --- | --- |
| Framework | Astro (static output — every content page is pre-rendered HTML) |
| Interactivity | React islands, hydrated only where needed (`client:load` header, `client:visible` forms/counters/calculator) |
| Styling | Tailwind CSS v4 (CSS-first config, design tokens in `src/styles/global.css`) |
| Fonts | Schibsted Grotesk (SIL OFL — redistributable), self-hosted via Fontsource |
| Content | Astro Content Collections (`src/content`) + structured YAML data (`src/data`) |
| Forms | Cloudflare Pages Function `functions/api/contact.ts` + honeypot + optional Turnstile |
| SEO | Per-page meta, canonical URLs, JSON-LD, `@astrojs/sitemap`, `robots.txt`, `_redirects` |

## Getting started

Requires **Node 20+** (Node 22 recommended).

```bash
npm install
cp .env.example .env      # fill in values as needed (optional for local dev)
npm run dev               # http://localhost:4321
```

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | ESLint over the project |
| `npm run format` | Prettier write |
| `npm run typecheck` | `astro check` — TypeScript + template checking |

## Editing content (no component knowledge needed)

| What | Where |
| --- | --- |
| Phone, email, announcement bar, stats, booking link, regulatory details | `src/data/site.ts` |
| Navigation & mega-menu | `src/data/navigation.ts` |
| Services (copy, FAQs, process, related links) | `src/data/services/*.yaml` |
| Team members | `src/data/team/*.yaml` |
| FAQs | `src/data/faqs/*.yaml` |
| Testimonials (only `approved: true` render) | `src/data/testimonials/*.yaml` |
| Articles | `src/content/articles/*.md` |
| Case studies (only `approved: true` + `draft: false` render) | `src/content/case-studies/*.md` |

Search the repo for `[OWNER TO CONFIRM` to find every business detail that must be verified
before launch — **do not remove the placeholders by guessing values.**

## Environment variables

Documented in [.env.example](.env.example). None are required to build; forms degrade
gracefully (submissions are logged by the Pages Function until email delivery is configured).

| Variable | Scope | Purpose |
| --- | --- | --- |
| `PUBLIC_TURNSTILE_SITE_KEY` | build (public) | Renders the Turnstile widget on forms |
| `TURNSTILE_SECRET_KEY` | function (secret) | Server-side Turnstile verification |
| `RESEND_API_KEY` | function (secret) | Email delivery for enquiries |
| `CONTACT_INBOX` / `CONTACT_FROM` | function | Enquiry recipient / verified sender |
| `PUBLIC_ANALYTICS_ID` | build (public) | Analytics token placeholder |

## Deployment (Cloudflare Pages)

Full guide: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). Short version:

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Production branch:** `main`
- **Node version:** set `NODE_VERSION=22` in Pages environment variables

Redirects live in [public/_redirects](public/_redirects); security headers (CSP, HSTS, etc.)
in [public/_headers](public/_headers). The contact endpoint deploys automatically from
`functions/api/contact.ts`.

## Git workflow

- `main` is the production branch — every push deploys.
- Work on feature branches (`feat/…`, `fix/…`, `content/…`) and open a PR; Cloudflare builds
  a preview URL per PR.

### PR checklist

- [ ] `npm run build`, `npm run typecheck`, `npm run lint` all pass
- [ ] No new `[OWNER TO CONFIRM]` values invented or removed without verification
- [ ] New pages have unique `title`, `description` and a single `H1`
- [ ] Images have alt text, width/height, and `loading="lazy"` below the fold
- [ ] Checked at 320 px, tablet and desktop widths
- [ ] Keyboard navigation and reduced-motion behaviour still work

## Project docs

- [docs/AUDIT.md](docs/AUDIT.md) — audit of the previous site, redirect map, asset inventory
- [docs/SEO-KEYWORD-MAP.md](docs/SEO-KEYWORD-MAP.md) — keyword map + 20 planned articles
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Cloudflare Pages setup, DNS, rollback
- [docs/OWNER-CHECKLIST.md](docs/OWNER-CHECKLIST.md) — everything the owner must confirm before launch
