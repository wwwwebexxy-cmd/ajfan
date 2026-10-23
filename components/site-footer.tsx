import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { SiFacebook, SiInstagram } from "react-icons/si";
import { Brand } from "./brand";
import { WhatsAppFloat } from "./whatsapp-float";

const footerPhone = "0529812786";
const footerPhoneHref = "tel:+971529812786";
const footerWhatsAppHref = "https://wa.me/971529812786";
const footerEmail = "ajfantyping@gmail.com";
const footerInstagram = "https://www.instagram.com/ajfan_typing?dlrf=aWFscHhtcjNla2R4&utm_source=qr";
const footerFacebook = "https://www.facebook.com/share/1FCMCfVwu2/?mibextid=wwXIfr";

export function SiteFooter() {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <Brand dark />
              <h3 className="footer-tagline">AJFAN DOCUMENTS CLEARING<br /><small>AJFAN TYPING SERVICES</small></h3>
              <p>Professional UAE typing, document clearing, government and business services for individuals, families and companies.</p>
            </div>
            <div>
              <h4>SERVICES</h4>
              <Link href="/visa-services">Visa Services</Link>
              <Link href="/pro-services">PRO Services</Link>
              <Link href="/business-setup">Business Setup</Link>
              <Link href="/corporate-services">Corporate Services</Link>
              <Link href="/services">MOFA Attestation</Link>
              <Link href="/services">Translation Services</Link>
            </div>
            <div>
              <h4>QUICK LINKS</h4>
              <Link href="/">Home</Link>
              <Link href="/about">About Us</Link>
              <Link href="/services">Services</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className="footer-contact">
              <h4>CONTACT</h4>
              <div className="footer-addresses">
                <div className="footer-address">
                  <strong>SHARJAH</strong>
                  <p>Shams Business Centre,<br />Media City Free Zone,<br />Al Messaned, Sharjah</p>
                </div>
              </div>
              <div className="footer-contact-links">
                <a href={footerPhoneHref}><Phone size={15} /> {footerPhone}</a>
                <a href={footerWhatsAppHref}><MessageCircle size={15} /> {footerPhone}</a>
                <a href={`mailto:${footerEmail}`}><Mail size={15} /> {footerEmail}</a>
              </div>
              <div className="footer-socials" aria-label="Social media links">
                <a href={footerInstagram} target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram">
                  <SiInstagram aria-hidden="true" />
                </a>
                <a href={footerFacebook} target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook">
                  <SiFacebook aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
          <div className="copyright"><span>Â© 2026 AJFAN Documents Clearing. All rights reserved.</span><span className="footer-legal"><span>Privacy Policy</span><span>Terms of Service</span></span></div>
        </div>
      </footer>
      <WhatsAppFloat />
    </>
  );
}
