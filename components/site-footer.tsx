import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { SiFacebook, SiInstagram } from "react-icons/si";
import { Brand } from "./brand";
import { WhatsAppFloat } from "./whatsapp-float";
import { businessEmail } from "@/lib/site-meta";

export function SiteFooter() {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <Brand dark />
              <h3 className="footer-tagline">DSN GROUPS<br /><small>DSN: DREAM STARTS NOW</small></h3>
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
                <a href="tel:+971543145156"><Phone size={15} /> +971 54 314 5156</a>
                <a href="https://wa.me/971543145156"><MessageCircle size={15} /> +971 54 314 5156</a>
                <a href={`mailto:${businessEmail}`}><Mail size={15} /> {businessEmail}</a>
              </div>
              <div className="footer-socials" aria-label="Social media links">
                <a href="https://www.instagram.com/dsngroups?utm_source=ig_web_button_share_sheet&vrfl=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram">
                  <SiInstagram aria-hidden="true" />
                </a>
                <a href="https://www.facebook.com/people/DSN-Groups/61594177463846/" target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook">
                  <SiFacebook aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
          <div className="copyright"><span>© 2026 DSN Groups. All rights reserved.</span><span className="footer-legal"><span>Privacy Policy</span><span>Terms of Service</span></span></div>
        </div>
      </footer>
      <WhatsAppFloat />
    </>
  );
}
