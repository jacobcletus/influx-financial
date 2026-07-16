# Influx Financial website — project guide for Claude

Production website for influxfinancial.com.au (Melbourne mortgage broking,
lending & accounting). Live at https://influx-financial.pages.dev, deployed
automatically by Cloudflare Pages on every push to `main` on GitHub
(jacobcletus/influx-financial).

## Stack & commands

Astro 5 (static output) + React 19 islands + TypeScript strict + Tailwind v4.
Node lives at `~/.local/node22/bin` on the owner's Mac — prepend to PATH:
`export PATH=~/.local/node22/bin:$PATH`

- `npm run dev` — local preview at localhost:4321
- `npm run build && node scripts/qa-check.mjs` — build + QA (run before every push)
- `npm run typecheck && npm run lint` — must stay clean

## Hard rules

1. **Never invent business facts.** Anything unverified is marked
   `[OWNER TO CONFIRM: ...]` — only replace a placeholder with information
   the owner has actually supplied. Full list: docs/OWNER-CHECKLIST.md.
2. **No fabricated testimonials, case studies, stats, licence numbers or
   qualifications.** Testimonials render only with `approved: true`;
   case studies only with `approved: true` + `draft: false`.
3. **Brand palette is extracted from the real brand — don't drift.**
   Tokens live in src/styles/global.css (`--color-pine-*`, `--color-mist-*`,
   sage/gold accents). Font: Schibsted Grotesk (OFL).
4. Copy style: Australian English, calm, direct, no marketing clichés
   ("unlock", "journey", "tailored solutions", "best rates guaranteed").
5. Every page needs a unique title/description and exactly one h1
   (scripts/qa-check.mjs enforces this).
6. Keep animations subtle, transform/opacity only, reduced-motion respected.
7. Government scheme thresholds are deliberately never stated — update the
   `lastReviewed` date when touching that content.

## Where things live

- Business details/contacts/stats/announcement: `src/data/site.ts`
- Navigation: `src/data/navigation.ts`
- Service page copy: `src/data/services/*.yaml`
- Team, FAQs, testimonials: `src/data/{team,faqs,testimonials}/*.yaml`
- Articles / case studies: `src/content/{articles,case-studies}/*.md`
- Design tokens & global CSS: `src/styles/global.css`
- Contact form backend: `functions/api/contact.ts` (Cloudflare Pages Function)
- Redirects / security headers: `public/_redirects`, `public/_headers`
- Docs: docs/AUDIT.md, docs/SEO-KEYWORD-MAP.md, docs/DEPLOYMENT.md,
  docs/OWNER-CHECKLIST.md

## Deploy

`git push` to `main` → Cloudflare Pages builds (`npm run build`, output
`dist`, NODE_VERSION=22) and deploys in ~2 minutes. Verify the live site
after significant changes.
