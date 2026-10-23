"use client";

import Link from "next/link";
import { Menu, MessageCircle, Phone, MapPin, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation } from "@/data/site-data";
import { Brand } from "./brand";

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="topbar">
        <div className="container topbar-content">
          <div className="topbar-group">
            <span className="topbar-group"><MapPin size={15} className="gold" /> Sharjah, UAE</span>
            <span>|</span>
            <span>Professional UAE Government &amp; Business Services</span>
          </div>
          <div className="topbar-group">
            <a href="tel:+971543145156"><Phone size={15} /> +971 54 314 5156</a>
            <a className="whatsapp" href="https://wa.me/971543145156"><MessageCircle size={15} /> WhatsApp Us</a>
          </div>
        </div>
      </div>
      <nav className="nav">
        <div className="container">
          <Link href="/" aria-label="DSN Groups home" onClick={() => setIsOpen(false)}><Brand /></Link>
          <div className="nav-links">
            {navigation.map(([href, label]) => <Link key={href} className={isActive(href) ? "active" : ""} href={href}>{label}</Link>)}
          </div>
          <Link className="consult" href="/contact">Get a Free Consultation</Link>
          <button className="mobile-menu-button" type="button" aria-label={isOpen ? "Close menu" : "Open menu"} aria-controls="mobile-navigation" aria-expanded={isOpen} onClick={() => setIsOpen((value) => !value)}>
            {isOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
        <div id="mobile-navigation" className={`mobile-menu ${isOpen ? "open" : ""}`}>
          {navigation.map(([href, label]) => <Link key={href} href={href} onClick={() => setIsOpen(false)}>{label}</Link>)}
          <Link className="consult-mobile" href="/contact" onClick={() => setIsOpen(false)}>Get a Free Consultation</Link>
        </div>
      </nav>
    </>
  );
}
