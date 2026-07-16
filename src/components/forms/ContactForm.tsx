import EnquiryForm from './EnquiryForm';

/** Short contact form (Contact page). */
export default function ContactForm({ turnstileSiteKey }: { turnstileSiteKey?: string }) {
  return <EnquiryForm variant="short" turnstileSiteKey={turnstileSiteKey} />;
}
