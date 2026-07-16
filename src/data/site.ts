/**
 * Central business configuration for Influx Financial.
 *
 * Every page, structured-data block and the footer reads from this
 * file so business details stay consistent across the site (important
 * for local SEO / NAP consistency). Update details HERE, not in
 * individual components.
 *
 * Items marked [OWNER TO CONFIRM: ...] must be verified by the
 * business owner before launch. Do not invent values.
 */

export const site = {
  name: 'Influx Financial',
  legalName: 'Influx Financial', // [OWNER TO CONFIRM: registered legal entity name]
  tagline: 'Making first homes happen',
  url: 'https://influxfinancial.com.au',
  description:
    'Influx Financial is a Melbourne-based mortgage broking, lending and accounting business helping Australians compare home loans from a wide panel of lenders.',

  contact: {
    phone: '03 7047 9370',
    phoneHref: 'tel:+61370479370',
    // A second number (0488 705 689) appeared on the old About page.
    // [OWNER TO CONFIRM: is 0488 705 689 a current business mobile? Publish or remove.]
    email: 'admin@influxfinancial.com.au',
    emailHref: 'mailto:admin@influxfinancial.com.au',
    address: null as string | null, // [OWNER TO CONFIRM: public office address, or confirm service-only business]
    serviceArea: 'Melbourne and across Victoria, with remote appointments Australia-wide',
    hours: null as string | null, // [OWNER TO CONFIRM: business hours]
  },

  social: {
    facebook: 'https://www.facebook.com/people/Influx-Financial/61572697751092/',
    instagram: null as string | null, // [OWNER TO CONFIRM: Instagram profile URL]
    linkedin: null as string | null, // [OWNER TO CONFIRM: LinkedIn page URL, if any]
    googleBusinessProfile: null as string | null, // [OWNER TO CONFIRM: Google Business Profile link]
  },

  /**
   * Statistics shown in the trust bar. `verified` reflects whether the
   * owner has re-confirmed the figure for the new site. Figures below
   * were published on the previous influxfinancial.com.au and must be
   * re-confirmed before launch; set `verified: true` once confirmed.
   */
  stats: [
    {
      value: 70,
      suffix: '+',
      label: 'lenders on our panel',
      verified: false, // [OWNER TO CONFIRM: lender panel size]
    },
    {
      value: 1500,
      suffix: '+',
      label: 'clients supported',
      verified: false, // [OWNER TO CONFIRM: client count]
    },
  ],

  /** Announcement bar — set `enabled: false` to hide site-wide. */
  announcement: {
    enabled: true,
    text: 'Free 30-minute tax and mortgage consultation',
    href: '/book-consultation',
    linkLabel: 'Book now',
  },

  booking: {
    /**
     * External booking platform (e.g. Calendly event URL).
     * [OWNER TO CONFIRM: booking platform link]. While unset, the
     * Book a Consultation page shows the enquiry form only.
     */
    calendarUrl: null as string | null,
  },

  regulatory: {
    // NEVER publish licence details until verified against the ASIC register.
    abn: null as string | null, // [OWNER TO CONFIRM: ABN]
    creditLicence: null as string | null, // [OWNER TO CONFIRM: Australian Credit Licence or Credit Representative number, and the licensee it sits under]
    memberships: [] as string[], // [OWNER TO CONFIRM: e.g. MFAA or FBAA membership, AFCA membership number]
    afcaMember: null as boolean | null, // [OWNER TO CONFIRM: AFCA membership — required for credit assistance providers]
  },

  analytics: {
    // [OWNER TO CONFIRM: analytics platform]. Cloudflare Web Analytics
    // is the lightest option; add its token via PUBLIC_ANALYTICS_ID.
    searchConsoleVerification: null as string | null, // [OWNER TO CONFIRM: Google Search Console verification token]
  },
} as const;

export type SiteConfig = typeof site;

/** General-advice disclaimer used across finance content. */
export const generalAdviceDisclaimer =
  'The information on this page is general in nature and does not take your personal objectives, financial situation or needs into account. Consider whether the information is appropriate for your circumstances and seek advice before acting on it. Lending criteria, fees and charges apply to all loan products.';

export const comparisonDisclaimer =
  'Comparing loans from a panel of lenders does not mean every product in the market is compared, and outcomes depend on your individual circumstances and lender criteria.';
