import { trustItems } from "@/data/site-data";

export function TrustStrip() {
  return (
    <section className="trust-strip">
      <div className="container trust-grid">
        {trustItems.map(({ title, text, icon: Icon }) => (
          <div className="trust-item" key={title}>
            <span className="trust-icon"><Icon size={20} /></span>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
