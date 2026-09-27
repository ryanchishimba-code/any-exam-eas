"use client";

/**
 * LandingTestimonialsV2 — public quotes only when admin-approved stories exist.
 * Otherwise render honest product / compare proof. Never invent names.
 */

import { Quote } from "lucide-react";
import { Reveal } from "@/components/landing/v2/Reveal";
import type { LandingSuccessStory } from "@/lib/landing/content";

function Avatar({ story }: { story: LandingSuccessStory }) {
  if (story.photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={story.photoUrl}
        alt=""
        className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-[var(--color-border)]"
      />
    );
  }
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
      style={{ background: story.avatarGradient }}
      aria-hidden
    >
      {story.initials}
    </span>
  );
}

function QuoteCard({ story, delay }: { story: LandingSuccessStory; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <figure className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-sm)]">
        <Quote
          className="h-5 w-5 shrink-0 text-[var(--color-accent)]/40"
          strokeWidth={2}
          aria-hidden
        />
        <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-ink)]">
          &ldquo;{story.quote}&rdquo;
        </blockquote>
        <figcaption className="mt-4 flex items-center gap-3 border-t border-[var(--color-border)] pt-4">
          <Avatar story={story} />
          <div>
            <p className="text-sm font-bold text-[var(--color-ink)]">{story.name}</p>
            <p className="text-xs text-[var(--color-ink-muted)]">
              {story.initials ? `${story.initials} · ` : ""}
              {story.exam}
              {formatPublishedOn(story.publishedOn)
                ? ` · ${formatPublishedOn(story.publishedOn)}`
                : ""}
            </p>
          </div>
        </figcaption>
      </figure>
    </Reveal>
  );
}

function formatPublishedOn(iso: string | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function LandingTestimonialsV2({
  stories = [],
}: {
  stories?: LandingSuccessStory[];
}) {
  const approved = stories.filter((s) => s.quote && s.name && s.exam);
  if (approved.length === 0) return null;

  return (
    <section
      id="testimonials"
      className="scroll-mt-24 bg-[var(--color-bg)] py-20 sm:py-24"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {approved.length > 0 ? (
          <>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                From approved students
              </p>
              <h2
                id="testimonials-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl"
              >
                Feedback we can publish.
              </h2>
              <p className="mt-4 text-base text-[var(--color-ink-muted)]">
                These quotes are approved in our CMS. Individual results vary — we do not
                guarantee exam scores or licensure.
              </p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {approved.slice(0, 6).map((story, i) => (
                <QuoteCard key={`${story.name}-${i}`} story={story} delay={i * 0.04} />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
