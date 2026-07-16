# Audit — previous influxfinancial.com.au (July 2026)

Platform: WordPress + Elementor (Hello Elementor theme, ThemesFlat addons,
"Pixxelstudio86" template credit in the footer).

## Content & UX issues found (all fixed in the rebuild)

| # | Issue | Evidence | Resolution |
|---|---|---|---|
| 1 | Lorem-ipsum blog posts | `/dolorum-est-et-sunt-molestiae/`, `/voluptas-vitae-quasi-ut/`, `/doloremque-est-vitae-molestiae-ut/` | Removed; 301 → `/resources`; six real articles written |
| 2 | Placeholder team contacts | `+1 (859) 254-6589`, `info@example.com` on team cards | Removed; central verified contacts only |
| 3 | Template testimonials | "Jhon william", "Sarah albert", "Mike hardson" | Not carried over; approved-only testimonial system with placeholder state |
| 4 | Duplicate service copy | Self-Employed Loans reused Debt Consolidation description | Unique copy per service (10 pages) |
| 5 | Services had no pages | All service links pointed to `#` | 10 full service pages with unique SEO meta |
| 6 | `/dummy/` page live and indexed | In sitemap | 301 → `/` |
| 7 | Inconsistent phone numbers | 03 7047 9370 vs 0488 705 689 | 03 number used site-wide; mobile flagged for owner |
| 8 | Repeated "Why Choose Us" blocks | Same 4 points on home + about | Single differentiated Why Influx page + one homepage section |
| 9 | Template credit in footer | "Pixxelstudio86" | Removed |
| 10 | Inconsistent team titles | Joe Anto: "Director of OneHQ accounting and Influx Financial" vs other phrasing | Standardised, defined in one data file |
| 11 | No legal/compliance pages | No privacy policy, credit guide, complaints | All five legal routes created (owner to populate regulated content) |
| 12 | Spelling/grammar ("Personalized", "Subscribe our newsletter") | Homepage/footer | Australian English throughout |
| 13 | Thin SEO | One title ("INFLUX"), no meta descriptions, no structured data | Unique meta per page, JSON-LD, sitemap, breadcrumbs |
| 14 | Real Estate service with duplicated financing copy | Services grid | Removed pending owner confirmation; redirect in place |

## Reusable assets extracted

- **Logo** — white + colour wordmark PNGs (`public/images/influx-logo-*.png`) and square mark (favicon source)
- **Palette** (from Elementor kit `post-14.css`): `#002A23` primary, `#006D5A` secondary (logo green), `#015849`, `#9DC5BE` sage, `#E8FFFB`/`#EEFFFC`/`#F7FFFE` mint backgrounds, `#D8DDDC` borders, `#FFEAB0`/`#FFBC7D` warm gold accents
- **Typography direction** — "Stage Grotesk" (commercial; tight -0.04em tracking, bold weights). Replaced with Schibsted Grotesk (SIL OFL, redistributable) which preserves the confident grotesque character
- **Headshots** — Jose Poly (`t-1.png`), Joe Anto (`2.png`), 400×400
- **Messaging** — "Making First Homes Happen" tagline; "70+ lenders", "1,500+ clients managed" claims (owner to re-verify); mortgage broking + lending advisory positioning; OneHQ Accounting relationship
- **Verified contacts** — 03 7047 9370, admin@influxfinancial.com.au, Facebook page

Note: the Facebook page could not be crawled (login wall) — owner should
supply any brand photography/copy from it worth reusing.

## Redirect map (complete — from the old XML sitemap)

| Old URL | New URL | Status |
|---|---|---|
| `/about-us/` | `/about` | 301 |
| `/services/` | `/services` | 301 |
| `/contact-us/` | `/contact` | 301 |
| `/blog/` | `/resources` | 301 |
| `/dummy/` | `/` | 301 |
| `/dolorum-est-et-sunt-molestiae/` | `/resources` | 301 |
| `/voluptas-vitae-quasi-ut/` | `/resources` | 301 |
| `/doloremque-est-vitae-molestiae-ut/` | `/resources` | 301 |
| `/category/*` | `/resources` | 301 |
| `/services/real-estate` | `/services` | 301 (service removed pending confirmation) |

Implemented in `public/_redirects`. Before launch, re-check Google's indexed
pages (`site:influxfinancial.com.au`) for any URL not in this table.

## New sitemap

```
/                     /about        /team         /why-influx    /how-it-works
/services             + 10 service pages (first-home-buyers is the flagship)
/calculators          /resources    /resources/[slug]
/case-studies         /case-studies/[slug]
/faq                  /contact      /book-consultation
/privacy-policy       /terms        /credit-guide  /complaints   /disclaimer
/404
```

## Visual direction (implemented)

Premium editorial finance: deep pine green + mint neutrals from the existing
brand, confident grotesque typography with tight tracking, generous
whitespace, thin `#D8DDDC` borders, 1rem–2rem radii, restrained green-tinted
shadows, subtle dot texture on section backgrounds, gold reserved for small
highlights on dark sections. Real team photography instead of stock. Motion:
word-rise hero, scroll reveals, sliding nav indicator, spotlight cards,
count-up stats — all transform/opacity, all disabled under
`prefers-reduced-motion`.
