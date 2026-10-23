import { Quote, Star } from "lucide-react";
import { testimonials } from "@/data/site-data";

export function TestimonialsSection() {
  return (
    <section className="section soft">
      <div className="container center">
        <div className="eyebrow">— Client Feedback</div>
        <h2 className="title">What Our Clients Say</h2>
        <div className="testimonial-grid">
          {testimonials.map(({ quote, name, role }) => (
            <article className="testimonial-card" key={quote}>
              <Quote size={28} className="testimonial-quote" />
              <p>“{quote}”</p>
              <div className="testimonial-meta"><span className="avatar">{name[0]}</span><span><strong>{name}</strong><small>{role}</small></span></div>
              <div className="stars"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
