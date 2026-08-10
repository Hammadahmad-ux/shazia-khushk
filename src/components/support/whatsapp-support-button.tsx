import { WhatsAppIcon } from "@/components/ui/icons";
import { getWhatsAppUrl } from "@/lib/commerce/business-config";

export function WhatsAppSupportButton() {
  return (
    <a
      aria-label="Chat on WhatsApp"
      className="whatsapp-button"
      href={getWhatsAppUrl()}
      rel="noopener noreferrer"
      target="_blank"
    >
      <WhatsAppIcon className="whatsapp-button__icon" />
      <span className="whatsapp-button__tooltip" aria-hidden="true">
        Chat on WhatsApp
      </span>
    </a>
  );
}
