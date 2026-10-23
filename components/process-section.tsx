import Link from "next/link";
import { processSteps } from "@/data/site-data";

export function ProcessSection({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`section center ${compact ? "detail-steps" : ""}`}>
      <div className="container">
        <div className="eyebrow">— The Process</div>
        <h2 className="title">How It Works</h2>
        <div className="steps">
          {processSteps.map(([number, title, description]) => (
            <div className="step" key={number}>
              <div className="num">{number}</div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
        {!compact && <div style={{ marginTop: 50 }}><Link className="btn dark" href="/contact">Start Your Application</Link></div>}
      </div>
    </section>
  );
}
