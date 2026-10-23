import { industries } from "@/data/site-data";

export function IndustriesSection() {
  return (
    <section className="section">
      <div className="container center">
        <div className="eyebrow">— Industries</div>
        <h2 className="title">Who We Serve</h2>
        <div className="industry-grid">
          {industries.map(({ title, text, icon: Icon }) => (
            <div className="industry-card" key={title}>
              <span className="industry-icon"><Icon size={20} /></span>
              <span><h3>{title}</h3><p>{text}</p></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
