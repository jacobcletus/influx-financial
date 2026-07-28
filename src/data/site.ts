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
  legalName: 'Influx Group Pty Ltd',
  tagline: 'Making first homes happen',
  url: 'https://influxfinancial.com.au',
  description:
    'Influx Financial is a Melbourne-based mortgage broking, lending and accounting business helping Australians compare home loans from a wide panel of lenders.',

  contact: {
    phone: '0488 705 689',
    phoneHref: 'tel:+61488705689',
    email: 'jose@influxfinancial.com.au',
    emailHref: 'mailto:jose@influxfinancial.com.au',
    // Head-office address, used for footer NAP and LocalBusiness schema.
    address: 'Level 3, 21 Cityside Drive, Mickleham VIC 3064',
    serviceArea: 'Melbourne and across Victoria, with remote appointments Australia-wide',
    hours: null as string | null, // [OWNER TO CONFIRM: business hours for each office]
  },

  /** Physical office locations. The first entry is the head office. */
  offices: [
    {
      name: 'Mickleham (Head Office)',
      building: 'Waterman Merrifield',
      address: 'Level 3, 21 Cityside Drive',
      suburb: 'Mickleham VIC 3064',
      phone: '(03) 8782 3777',
      phoneHref: 'tel:+61387823777',
      mapQuery: 'Waterman Merrifield, 21 Cityside Drive, Mickleham VIC 3064',
    },
    {
      name: 'Croydon',
      building: null as string | null,
      address: 'Level 1, 39-41 Hewish Road',
      suburb: 'Croydon VIC 3136',
      phone: '(03) 9056 3899',
      phoneHref: 'tel:+61390563899',
      mapQuery: '39-41 Hewish Road, Croydon VIC 3136',
    },
  ],

  social: {
    facebook: 'https://www.facebook.com/people/Influx-Financial/61572697751092/',
    instagram: 'https://www.instagram.com/influxgroup.au/',
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
      verified: true,
    },
    {
      value: 2500,
      suffix: '+',
      label: 'clients supported',
      verified: true,
    },
  ],

  /** Announcement bar, set `enabled: false` to hide site-wide. */
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
    abn: '91 683 134 367',
    aggregator: 'Australian Finance Group (AFG)',
    // Jose Poly is an Authorised Credit Representative operating under AFG's
    // Australian Credit Licence (ACL 389087 is held by Australian Finance Group Ltd).
    creditRepName: 'Jose Poly',
    creditRepNumber: '566032',
    acl: '389087',
    aclHolder: 'Australian Finance Group Ltd',
    memberships: [] as string[], // [OWNER TO CONFIRM: per-person MFAA membership numbers — owner to provide]
    afcaMember: null as boolean | null, // [OWNER TO CONFIRM: AFCA membership number — owner to provide]
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
