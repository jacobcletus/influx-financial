# Deployment — Cloudflare Pages

## 1. Connect the GitHub repository

1. Push this repository to GitHub (private is fine).
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repository and configure:
   - **Production branch:** `main`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Environment variables (production):**
     - `NODE_VERSION` = `22`
     - `PUBLIC_TURNSTILE_SITE_KEY` (once Turnstile is created)
     - `TURNSTILE_SECRET_KEY` (encrypt)
     - `RESEND_API_KEY` (encrypt), `CONTACT_INBOX`, `CONTACT_FROM`

These values match `astro.config.mjs` (`output: 'static'`, default `dist/` outDir).

## 2. Preview deployments

Enabled by default: every non-production branch and PR gets a unique
`*.pages.dev` preview URL. Set any preview-specific env vars under the
**Preview** environment (e.g. a Turnstile test key).

## 3. Custom domain & DNS

1. Pages project → **Custom domains → Add** → `influxfinancial.com.au` and
   `www.influxfinancial.com.au`.
2. If the domain's DNS is already on Cloudflare, records are created
   automatically (CNAME flattened at the apex). Otherwise move the
   nameservers to Cloudflare first.
3. Redirect `www` → apex: Cloudflare **Bulk Redirects** or a Pages
   `_redirects` line once the domain is active.
4. HTTPS is automatic (Universal SSL). Set **SSL/TLS mode: Full (strict)**
   and enable **Always Use HTTPS**.

## 4. Redirects & headers

- `public/_redirects` — 301 map from the old WordPress URLs (see
  docs/AUDIT.md for the source list). Verify after launch with
  `curl -I https://influxfinancial.com.au/about-us/` → expect `301` → `/about`.
- `public/_headers` — HSTS, CSP, X-Content-Type-Options, Referrer-Policy,
  Permissions-Policy, frame-ancestors. **Allowed external domain:**
  `challenges.cloudflare.com` (Turnstile only). If analytics or a booking
  embed is added, extend the CSP in the same file and document the domain.

## 5. Forms (Pages Function)

`functions/api/contact.ts` deploys automatically with the site — no extra
configuration. Behaviour:

- Without `RESEND_API_KEY`: submissions are validated and logged
  (visible in Pages → Functions → Logs). Good for pre-launch testing.
- With `RESEND_API_KEY` + `CONTACT_INBOX` + `CONTACT_FROM`: enquiries are
  emailed. `CONTACT_FROM` must be a sender verified with the provider.
- Turnstile is enforced server-side whenever `TURNSTILE_SECRET_KEY` is set.

Test after each deploy: submit the contact form on the preview URL and
confirm the success state and delivery/log entry.

## 6. Caching

- Fingerprinted assets under `/_astro/*` are cached for 1 year (immutable).
- HTML is served with Cloudflare's default (revalidated) caching — new
  deploys are visible immediately.
- Purge is never needed for normal deploys; use **Caching → Purge
  Everything** only if a stale asset is suspected.

## 7. Rollback

Pages keeps every deployment. **Deployments → ⋯ → Rollback to this
deployment** restores a previous build instantly (env vars are not rolled
back). Alternatively `git revert` on `main` and let CI redeploy.

## 8. Post-launch checks

- [ ] All redirects from docs/AUDIT.md return 301 to the right target
- [ ] `https://influxfinancial.com.au/sitemap-index.xml` resolves; submit in Google Search Console
- [ ] Search Console ownership verified (add token to `src/data/site.ts`)
- [ ] Forms deliver to the business inbox
- [ ] Lighthouse on `/`, `/services/home-loans`, `/services/first-home-buyers` — targets: Perf ≥ 90, A11y ≥ 95, BP ≥ 95, SEO ≥ 95
- [ ] securityheaders.com grade A or better
