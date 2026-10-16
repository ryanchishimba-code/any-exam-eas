import type { LandingSuccessStory } from "@/lib/landing/content";
import { TESTIMONIAL_RESULTS_NOTE } from "@/lib/marketing/legal-copy";

/** Consented quotes only. Renders nothing when none are passed in. */
export function HomeQuote({ stories }: { stories: LandingSuccessStory[] }) {
  const approved = stories.filter((story) => story.quote && story.name);
  if (approved.length === 0) return null;

  return (
    <section className="home-section home-quote home-rise" aria-labelledby="home-quotes-heading">
      <h2 id="home-quotes-heading">From students</h2>
      <p className="home-quote__label">{TESTIMONIAL_RESULTS_NOTE}</p>
      <ul className="home-quote__list">
        {approved.map((story) => (
          <li key={`${story.name}-${story.exam}`}>
            <figure>
              <blockquote>
                <p>“{story.quote}”</p>
              </blockquote>
              <figcaption>
                {story.name}
                {story.exam ? ` · ${story.exam}` : ""}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
