import { MessageCircle, Phone } from "lucide-react";

export function MobileStickyBar() {
  return (
    <div className="mobile-sticky-bar">
      <a href="tel:+971529812786"><Phone size={16} /> Call Now</a>
      <a href="https://wa.me/971529812786"><MessageCircle size={16} /> WhatsApp Us</a>
    </div>
  );
}
