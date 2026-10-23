"use client";

import { SiWhatsapp } from "react-icons/si";
import { X } from "lucide-react";
import { useState } from "react";

export function WhatsAppFloat() {
  const [open, setOpen] = useState(false);
  return (
    <div className="float-wa-wrap">
      {open && <div className="float-wa-card"><div className="float-wa-card-head"><strong>Need help?</strong><span>Typically replies within minutes</span></div><div className="float-wa-card-body"><p>Send your requirement to our team on WhatsApp and we will guide you on the next steps.</p><a href="https://wa.me/971543145156"><SiWhatsapp aria-hidden="true" /> WhatsApp Us</a></div></div>}
      <button className="float-wa" type="button" aria-label={open ? "Close WhatsApp help" : "Open WhatsApp help"} onClick={() => setOpen((value) => !value)}>{open ? <X size={25} /> : <SiWhatsapp aria-hidden="true" />}</button>
    </div>
  );
}
