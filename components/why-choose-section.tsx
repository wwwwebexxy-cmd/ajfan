import { benefits } from "@/data/site-data";

export function WhyChooseSection() {
  return (
    <section className="section soft">
      <div className="container center">
        <div className="eyebrow">— Why Choose Us</div>
        <h2 className="title">A Reliable Partner for Every Procedure</h2>
        <div className="benefit-grid">
          {benefits.map(([num, title, text]) => (
            <div className="benefit-card" key={num}>
              <span className="benefit-num">{num}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
