import { TESTIMONIAL_RESULTS_NOTE } from "@/lib/marketing/legal-copy";
import type { LandingTestimonialCard } from "@/lib/testimonials/landing-stories";

export function BoardLandingTestimonials({ stories }: { stories: LandingTestimonialCard[] }) {
  if (stories.length === 0) return null;

  return (
    <section
      className="bl-section bl-section--tight bl-testimonials"
      aria-labelledby="bl-testimonials-heading"
    >
      <h2 id="bl-testimonials-heading">From students</h2>
      <p className="bl-testimonials__note">{TESTIMONIAL_RESULTS_NOTE}</p>
      <ul className="bl-testimonials__row">
        {stories.map((story) => (
          <li key={`${story.name}-${story.exam}`} className="bl-testimonials__card">
            <blockquote>
              <p>{story.quote}</p>
            </blockquote>
            <p className="bl-testimonials__by">
              <span className="bl-testimonials__initials" aria-hidden>{story.initials}</span>
              {story.name}
              <span> · {story.exam}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
