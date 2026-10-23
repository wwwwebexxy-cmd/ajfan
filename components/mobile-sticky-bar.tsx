import { MessageCircle, Phone } from "lucide-react";

export function MobileStickyBar() {
  return (
    <div className="mobile-sticky-bar">
      <a href="tel:+971543145156"><Phone size={16} /> Call Now</a>
      <a href="https://wa.me/971543145156"><MessageCircle size={16} /> WhatsApp Us</a>
    </div>
  );
}
