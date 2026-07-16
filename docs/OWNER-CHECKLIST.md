# Owner checklist — confirm before launch

Everything below is marked `[OWNER TO CONFIRM]` in the codebase. Search the
repo for that string to find each location. **Nothing on this list should be
guessed** — several items are regulatory requirements.

## Regulatory & legal (blocking — must be resolved before go-live)

1. **Australian Credit Licence or Credit Representative number**, and the
   licensee it sits under → `src/data/site.ts`, footer, `/credit-guide`.
2. **ABN / registered legal entity name** → `src/data/site.ts`.
3. **Credit Guide content** from your licensee's approved template →
   `/credit-guide` page (currently a structured placeholder).
4. **AFCA membership number** → `/complaints`, `/credit-guide`.
5. **OneHQ Accounting entity details** and registered tax agent number →
   `/services/accounting-tax`, `/disclaimer`, footer.
6. **Privacy Policy and Terms reviewed by a lawyer/compliance adviser** —
   drafts are provided but not legal advice.
7. **Aggregator name and lender-panel statement** → `/credit-guide`.

## Business facts

8. **"70+ lenders" and "1,500+ clients"** — both appeared on the old site;
   re-confirm and set `verified: true` in `src/data/site.ts`.
9. **Second phone number 0488 705 689** (was on the old About page) —
   publish or drop.
10. **Public office address & business hours** — or confirm service-only.
    (Map embed and LocalBusiness schema are held back until then.)
11. **The five-step process** described on the homepage and How It Works.
12. **Team**: qualifications, memberships, years of experience and a
    personal line for Jose Poly and Joe Anto → `src/data/team/*.yaml`.
13. **Founding year / company story detail** → `/about`.
14. **Real Estate service** — the old site listed it with duplicated copy,
    so it was removed pending confirmation (redirect
    `/services/real-estate → /services` is in place). If Influx does offer
    it directly, we'll build the page properly.

## Marketing assets

15. **Testimonials** — genuine client reviews with permission to publish →
    `src/data/testimonials/` (placeholder state shows until then).
16. **Case studies** — verified client stories with written consent →
    `src/content/case-studies/` (template provided).
17. **Instagram URL** (old site linked an empty Instagram icon), LinkedIn,
    and **Google Business Profile** link → `src/data/site.ts`.
18. **Booking platform** (e.g. Calendly) link → `src/data/site.ts`
    (`booking.calendarUrl`).
19. **Lender logos** — only with each lender's permission; currently none
    are displayed.
20. **Additional photography** — office/at-work imagery to supplement the
    two headshots (optional but recommended).

## Technical

21. **Google Search Console verification token** → `src/data/site.ts`.
22. **Analytics platform choice** → `.env.example` / `_headers` CSP note.
23. **Turnstile keys** and **email delivery (Resend) keys** → Cloudflare
    Pages environment variables (see docs/DEPLOYMENT.md).
