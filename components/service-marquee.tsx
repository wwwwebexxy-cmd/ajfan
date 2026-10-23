import { services } from "@/data/site-data";

export function ServiceMarquee() {
  const items = [...services.map((service) => service.title), "Document Clearing", "UAE Business Support"];
  return (
    <div className="service-marquee" aria-label="Our services">
      <div className="service-marquee-track">
        {[...items, ...items].map((item, index) => (
          <span className="service-marquee-item" key={`${item}-${index}`}>
            {item}<i />
          </span>
        ))}
      </div>
    </div>
  );
}
