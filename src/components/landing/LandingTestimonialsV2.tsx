import type { LandingSuccessStory } from "@/lib/landing/content";

/**
 * Customer quotes from the database only. Empty list renders nothing.
 * No photos, stars, verified badges, or pass claims.
 */
export function LandingTestimonialsV2({
  stories = [],
}: {
  stories?: LandingSuccessStory[];
}) {
  const approved = stories.filter((story) => story.quote && story.name && story.exam);
  if (approved.length === 0) return null;

  return (
    <section id="testimonials" className="scroll-mt-24" aria-labelledby="testimonials-heading">
      <h2
        id="testimonials-heading"
        className="text-[clamp(2rem,4vw,2.75rem)] font-bold tracking-tight text-[var(--color-ink)]"
      >
        From students
      </h2>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {approved.slice(0, 6).map((story) => (
          <li key={`${story.name}-${story.exam}`}>
            <figure className="h-full rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <blockquote className="text-lg leading-relaxed tracking-tight text-[var(--color-ink)]">
                “{story.quote}”
              </blockquote>
              <figcaption className="mt-5 text-sm font-semibold text-[var(--color-ink)]">
                {story.name}
                <span className="mt-1 block font-medium text-[var(--color-ink-muted)]">{story.exam}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
