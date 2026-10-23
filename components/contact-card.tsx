import Link from "next/link";
import { MapPin, MessageCircle, Phone } from "lucide-react";

const icons = { whatsapp: MessageCircle, phone: Phone, office: MapPin };

export function ContactCard({ type, title, description, label, href }: { type: keyof typeof icons; title: string; description: string; label: string; href: string }) {
  const Icon = icons[type];
  return (
    <div className="contact-card">
      <span className="icon"><Icon size={22} /></span>
      <h3>{title}</h3>
      <p>{description}</p>
      <Link className="btn dark contact-card-button" href={href}>{label}</Link>
    </div>
  );
}
