/**
 * Site navigation structure. The header, mobile menu, footer and
 * breadcrumb defaults all read from this file.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface ServiceNavGroup {
  heading: string;
  items: Array<NavLink & { description: string; icon: string }>;
}

/** Primary navigation (desktop centre links + mobile menu). */
export const primaryNav: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' }, // renders as mega-menu on desktop
  { label: 'First Home Buyers', href: '/services/first-home-buyers' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact', href: '/contact' },
];

export const ctaLink: NavLink = { label: 'Book a Free Consultation', href: '/book-consultation' };

/** Services mega-menu groups. Icons map to names in Icon.astro. */
export const servicesMenu: ServiceNavGroup[] = [
  {
    heading: 'Buy a home',
    items: [
      {
        label: 'Home Loans',
        href: '/services/home-loans',
        description: 'Compare loans from a wide lender panel',
        icon: 'home',
      },
      {
        label: 'First Home Buyers',
        href: '/services/first-home-buyers',
        description: 'Deposit-to-keys guidance for your first place',
        icon: 'key',
      },
      {
        label: 'Construction Loans',
        href: '/services/construction-loans',
        description: 'Staged funding for builds and renovations',
        icon: 'hammer',
      },
    ],
  },
  {
    heading: 'Grow & restructure',
    items: [
      {
        label: 'Refinancing',
        href: '/services/refinancing',
        description: 'Review your rate and loan structure',
        icon: 'refresh',
      },
      {
        label: 'Investment Loans',
        href: '/services/investment-loans',
        description: 'Finance structured for property investors',
        icon: 'chart',
      },
      {
        label: 'Debt Consolidation',
        href: '/services/debt-consolidation',
        description: 'Simplify multiple debts into one repayment',
        icon: 'layers',
      },
    ],
  },
  {
    heading: 'Business & specialist',
    items: [
      {
        label: 'Commercial Loans',
        href: '/services/commercial-loans',
        description: 'Funding for premises and business growth',
        icon: 'building',
      },
      {
        label: 'Asset Finance',
        href: '/services/asset-finance',
        description: 'Vehicles and equipment for your business',
        icon: 'truck',
      },
      {
        label: 'Vehicle Finance',
        href: '/services/vehicle-finance',
        description: 'Cars, utes and vans, personal and business',
        icon: 'car',
      },
      {
        label: 'Self-Employed Loans',
        href: '/services/self-employed-loans',
        description: 'Lending that understands business income',
        icon: 'briefcase',
      },
      {
        label: 'Accounting & Tax',
        href: '/services/accounting-tax',
        description: 'Tax planning alongside your lending',
        icon: 'calculator',
      },
    ],
  },
];

export const footerNav = {
  services: [
    { label: 'Home Loans', href: '/services/home-loans' },
    { label: 'First Home Buyers', href: '/services/first-home-buyers' },
    { label: 'Refinancing', href: '/services/refinancing' },
    { label: 'Investment Loans', href: '/services/investment-loans' },
    { label: 'Construction Loans', href: '/services/construction-loans' },
    { label: 'Commercial Loans', href: '/services/commercial-loans' },
    { label: 'Asset Finance', href: '/services/asset-finance' },
    { label: 'Vehicle Finance', href: '/services/vehicle-finance' },
    { label: 'Self-Employed Loans', href: '/services/self-employed-loans' },
    { label: 'Debt Consolidation', href: '/services/debt-consolidation' },
    { label: 'Accounting & Tax', href: '/services/accounting-tax' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Our Team', href: '/team' },
    { label: 'Why Influx', href: '/why-influx' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Resources', href: '/resources' },
    { label: 'Calculators', href: '/calculators' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Use', href: '/terms' },
    { label: 'Credit Guide', href: '/credit-guide' },
    { label: 'Disclaimer', href: '/disclaimer' },
  ],
} as const;
