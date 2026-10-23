import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { services } from "@/data/site-data";

export function ServiceGrid() {
  return (
    <section className="section soft">
      <div className="container center">
        <div className="eyebrow">— What We Do</div>
        <h2 className="title">Our Services</h2>
        <p className="subtitle">Complete UAE government, visa and business solutions under one roof.</p>
        <div className="cards">
          {services.map((service) => {
            const Icon = service.icon;
            const href = service.slug === "business-setup" ? "/business-setup" : `/${service.slug}`;
            return (
              <Link className="card" href={href} key={service.slug}>
                <span className="icon"><Icon size={22} strokeWidth={1.8} /></span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <span className="link">Explore {service.title} <ArrowRight size={16} /></span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
