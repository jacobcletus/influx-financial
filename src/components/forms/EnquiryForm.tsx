import { useEffect, useRef, useState, type FormEvent } from 'react';

/**
 * Shared enquiry form engine used by ContactForm (short) and
 * ConsultationForm (detailed). Submits JSON to the Cloudflare Pages
 * Function at /api/contact.
 *
 * Spam protection: honeypot field + optional Cloudflare Turnstile
 * (rendered when PUBLIC_TURNSTILE_SITE_KEY is configured).
 * Privacy: no sensitive financial documents or identifiers are
 * collected here by design.
 */

export type EnquiryVariant = 'short' | 'consultation';

interface EnquiryFormProps {
  variant: EnquiryVariant;
  turnstileSiteKey?: string;
}

const SERVICES = [
  'Home loan',
  'First home buyer',
  'Refinancing',
  'Investment loan',
  'Construction loan',
  'Commercial loan',
  'Asset finance',
  'Self-employed loan',
  'Debt consolidation',
  'Accounting & tax',
  'Not sure yet',
];

const TIMEFRAMES = [
  'As soon as possible',
  'Within 3 months',
  '3 to 6 months',
  '6 to 12 months',
  'Just researching',
];

const BUYER_TYPES = [
  'First home buyer',
  'Next home / upgrading',
  'Property investor',
  'Business owner',
  'Refinancing my current loan',
  'Other',
];

type Status = 'idle' | 'submitting' | 'success' | 'error';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
    };
  }
}

export default function EnquiryForm({ variant, turnstileSiteKey }: EnquiryFormProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>('');
  const turnstileRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const isConsultation = variant === 'consultation';

  /* Load Turnstile only if configured */
  useEffect(() => {
    if (!turnstileSiteKey || !turnstileRef.current) return;
    const render = () => {
      if (window.turnstile && turnstileRef.current) {
        window.turnstile.render(turnstileRef.current, { sitekey: turnstileSiteKey });
      }
    };
    if (window.turnstile) {
      render();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = render;
    document.head.appendChild(script);
  }, [turnstileSiteKey]);

  function validate(data: FormData): Record<string, string> {
    const errs: Record<string, string> = {};
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();
    if (name.length < 2) errs.name = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = 'Please enter a valid email address.';
    if (phone.replace(/\D/g, '').length < 8) errs.phone = 'Please enter a valid phone number.';
    if (!data.get('consent')) errs.consent = 'Please agree to the privacy collection notice.';
    return errs;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const errs = validate(data);
    setErrors(errs);
    setServerError('');
    if (Object.keys(errs).length > 0) {
      statusRef.current?.focus();
      return;
    }

    setStatus('submitting');
    try {
      const payload = Object.fromEntries(data.entries());
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, formVariant: variant }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? 'Something went wrong sending your enquiry.');
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setServerError(
        err instanceof Error && err.message
          ? err.message
          : 'Something went wrong sending your enquiry.'
      );
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-sage-200 bg-mist-100 p-8 text-center" role="status">
        <p className="text-xl font-bold text-pine-900">Thanks, we've got your enquiry.</p>
        <p className="mt-2 text-ink-600">
          One of the team will be in touch within one business day. If it's urgent, call us on{' '}
          <a href="tel:+61488705689" className="font-semibold text-pine-800 underline">
            0488 705 689
          </a>
          .
        </p>
      </div>
    );
  }

  const inputCls = 'field-input';
  const labelCls = 'mb-1.5 block text-[0.9rem] font-semibold text-ink-900';
  const errCls = 'mt-1 text-[0.82rem] font-medium text-[#b3261e]';

  return (
    <form onSubmit={onSubmit} noValidate>
      {/* Error summary for screen readers */}
      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="outline-none">
        {Object.keys(errors).length > 0 && (
          <p className="mb-4 rounded-lg border border-[#e7b8b5] bg-[#fdf3f2] px-4 py-3 text-[0.9rem] font-medium text-[#8c1d18]">
            Please fix the highlighted fields below.
          </p>
        )}
        {status === 'error' && (
          <p className="mb-4 rounded-lg border border-[#e7b8b5] bg-[#fdf3f2] px-4 py-3 text-[0.9rem] font-medium text-[#8c1d18]">
            {serverError} You can also email us directly at{' '}
            <a href="mailto:admin@influxfinancial.com.au" className="underline">
              admin@influxfinancial.com.au
            </a>
            .
          </p>
        )}
      </div>

      {/* Honeypot, hidden from real users */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${variant}-website`}>Leave this field empty</label>
        <input
          id={`${variant}-website`}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${variant}-name`} className={labelCls}>
            Full name
          </label>
          <input
            id={`${variant}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${variant}-name-err` : undefined}
            className={inputCls}
          />
          {errors.name && (
            <p id={`${variant}-name-err`} className={errCls}>
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${variant}-email`} className={labelCls}>
            Email
          </label>
          <input
            id={`${variant}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${variant}-email-err` : undefined}
            className={inputCls}
          />
          {errors.email && (
            <p id={`${variant}-email-err`} className={errCls}>
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${variant}-phone`} className={labelCls}>
            Phone
          </label>
          <input
            id={`${variant}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? `${variant}-phone-err` : undefined}
            className={inputCls}
          />
          {errors.phone && (
            <p id={`${variant}-phone-err`} className={errCls}>
              {errors.phone}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${variant}-service`} className={labelCls}>
            {isConsultation ? 'Service type' : 'Service needed'}
          </label>
          <select
            id={`${variant}-service`}
            name="service"
            className={inputCls}
            defaultValue="Not sure yet"
          >
            {SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {isConsultation ? (
          <>
            <div>
              <label htmlFor={`${variant}-buyerType`} className={labelCls}>
                Which best describes you?
              </label>
              <select
                id={`${variant}-buyerType`}
                name="buyerType"
                className={inputCls}
                defaultValue="First home buyer"
              >
                {BUYER_TYPES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${variant}-timeframe`} className={labelCls}>
                General timeframe
              </label>
              <select
                id={`${variant}-timeframe`}
                name="timeframe"
                className={inputCls}
                defaultValue="Within 3 months"
              >
                {TIMEFRAMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={`${variant}-preferredTime`} className={labelCls}>
                Preferred consultation time{' '}
                <span className="font-normal text-ink-500">(optional)</span>
              </label>
              <input
                id={`${variant}-preferredTime`}
                name="preferredTime"
                type="text"
                placeholder="e.g. weekday evenings, Saturday morning"
                className={inputCls}
              />
            </div>
          </>
        ) : (
          <div>
            <label htmlFor={`${variant}-contactMethod`} className={labelCls}>
              Preferred contact method
            </label>
            <select
              id={`${variant}-contactMethod`}
              name="contactMethod"
              className={inputCls}
              defaultValue="Phone"
            >
              <option value="Phone">Phone</option>
              <option value="Email">Email</option>
              <option value="Either">Either</option>
            </select>
          </div>
        )}

        <div className="sm:col-span-2">
          <label htmlFor={`${variant}-message`} className={labelCls}>
            Message <span className="font-normal text-ink-500">(optional)</span>
          </label>
          <textarea
            id={`${variant}-message`}
            name="message"
            rows={4}
            className={inputCls}
            placeholder="Tell us a little about your situation or what you'd like to achieve. Please don't include sensitive details like tax file numbers or account numbers."
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="flex items-start gap-3 text-[0.85rem] leading-relaxed text-ink-600">
          <input
            type="checkbox"
            name="consent"
            required
            aria-invalid={!!errors.consent}
            className="mt-1 h-4 w-4 shrink-0 accent-[#006d5a]"
          />
          <span>
            I agree to Influx Financial collecting and using the details above to respond to my
            enquiry, as described in the{' '}
            <a href="/privacy-policy" className="font-semibold text-pine-800 underline">
              Privacy Policy
            </a>
            .
          </span>
        </label>
        {errors.consent && <p className={errCls}>{errors.consent}</p>}
      </div>

      {turnstileSiteKey && <div ref={turnstileRef} className="mt-4" />}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-6 w-full rounded-full bg-pine-700 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-pine-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === 'submitting'
          ? 'Sending…'
          : isConsultation
            ? 'Request my free consultation'
            : 'Send enquiry'}
      </button>
    </form>
  );
}
