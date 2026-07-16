/**
 * Cloudflare Pages Function: POST /api/contact
 *
 * Handles enquiry submissions from the ContactForm / ConsultationForm
 * React islands. Static pages stay static; only this endpoint runs
 * server-side.
 *
 * Protections:
 *  - Honeypot field ("website") silently accepted and dropped
 *  - Cloudflare Turnstile verification when TURNSTILE_SECRET_KEY is set
 *  - Server-side validation of required fields
 *  - Field length limits to prevent abuse
 *
 * Delivery: sends a notification email via Resend when RESEND_API_KEY
 * is configured. [OWNER TO CONFIRM: preferred email delivery service —
 * Resend, MailChannels, or another provider.]
 */

interface Env {
  TURNSTILE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
  CONTACT_INBOX?: string;
  CONTACT_FROM?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

interface EnquiryPayload {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  contactMethod?: string;
  buyerType?: string;
  timeframe?: string;
  preferredTime?: string;
  message?: string;
  consent?: string;
  website?: string; // honeypot
  formVariant?: string;
  'cf-turnstile-response'?: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const clip = (value: unknown, max: number): string =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

export const onRequestPost = async (context: PagesContext): Promise<Response> => {
  const { request, env } = context;

  let payload: EnquiryPayload;
  try {
    payload = (await request.json()) as EnquiryPayload;
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  // Honeypot: bots fill hidden fields. Pretend success, do nothing.
  if (payload.website) {
    return json({ ok: true });
  }

  const name = clip(payload.name, 120);
  const email = clip(payload.email, 200);
  const phone = clip(payload.phone, 40);
  const message = clip(payload.message, 4000);

  if (name.length < 2) return json({ error: 'Please provide your full name.' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return json({ error: 'Please provide a valid email address.' }, 400);
  if (phone.replace(/\D/g, '').length < 8)
    return json({ error: 'Please provide a valid phone number.' }, 400);
  if (!payload.consent) return json({ error: 'Privacy consent is required.' }, 400);

  // Turnstile verification (when configured)
  if (env.TURNSTILE_SECRET_KEY) {
    const token = clip(payload['cf-turnstile-response'], 4000);
    if (!token) return json({ error: 'Please complete the spam check.' }, 400);
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: request.headers.get('CF-Connecting-IP') ?? undefined,
      }),
    });
    const outcome = (await verify.json()) as { success: boolean };
    if (!outcome.success) return json({ error: 'Spam check failed — please try again.' }, 400);
  }

  const fields: Array<[string, string]> = [
    ['Form', clip(payload.formVariant, 40) || 'short'],
    ['Name', name],
    ['Email', email],
    ['Phone', phone],
    ['Service', clip(payload.service, 80)],
    ['Preferred contact', clip(payload.contactMethod, 40)],
    ['Buyer type', clip(payload.buyerType, 80)],
    ['Timeframe', clip(payload.timeframe, 80)],
    ['Preferred time', clip(payload.preferredTime, 200)],
    ['Message', message],
  ];
  const summary = fields
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  // Deliver via Resend when configured; otherwise log so submissions
  // are visible in Cloudflare's function logs during setup.
  if (env.RESEND_API_KEY && env.CONTACT_INBOX && env.CONTACT_FROM) {
    const send = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM,
        to: [env.CONTACT_INBOX],
        reply_to: email,
        subject: `Website enquiry — ${name} (${clip(payload.service, 80) || 'general'})`,
        text: summary,
      }),
    });
    if (!send.ok) {
      console.error('Resend delivery failed', send.status, await send.text());
      return json({ error: 'We could not send your enquiry just now. Please call us.' }, 502);
    }
  } else {
    console.log('Enquiry received (email delivery not configured):\n' + summary);
  }

  return json({ ok: true });
};
