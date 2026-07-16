import EnquiryForm from './EnquiryForm';

/** Detailed consultation request form (Book a Consultation page). */
export default function ConsultationForm({ turnstileSiteKey }: { turnstileSiteKey?: string }) {
  return <EnquiryForm variant="consultation" turnstileSiteKey={turnstileSiteKey} />;
}
