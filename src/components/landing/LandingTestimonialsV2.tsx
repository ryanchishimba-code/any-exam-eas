"use client";

/**
 * LandingTestimonialsV2 — full social-proof section.
 *
 * Layout:
 *   - Section header with clinician-cred trust line
 *   - Two wide "featured" cards (longQuote + outcome + detail)
 *   - Six compact quote cards in a responsive 3-column grid
 *   - One video-placeholder card (future-proofed)
 *   - Legal disclaimer
 */

import Link from "next/link";
import { ArrowRight, BadgeCheck, PlayCircle, Quote } from "lucide-react";
import { Reveal } from "@/components/landing/v2/Reveal";
import { LANDING_SUCCESS_STORIES, type LandingSuccessStory } from "@/lib/landing/content";
import { SocialShareBar } from "@/components/social/SocialShareBar";
import { ROUTES } from "@/lib/routes";

const DEFAULT_STORIES = LANDING_SUCCESS_STORIES;

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

function OutcomePill({ outcome }: { outcome: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-accent)]/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[var(--color-accent)]">
      <BadgeCheck className="h-3 w-3 shrink-0" aria-hidden />
      {outcome}
    </span>
  );
}

function FeaturedCard({ story, delay }: { story: LandingSuccessStory; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <figure className="flex h-full flex-col rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-7 shadow-[var(--shadow-apple-md)]">
        <Quote
          className="h-6 w-6 shrink-0 text-[var(--color-accent)]/40"
          strokeWidth={2}
          aria-hidden
        />
        <blockquote className="mt-4 flex-1 text-base font-medium leading-relaxed text-[var(--color-ink)]">
          &ldquo;{story.longQuote ?? story.quote}&rdquo;
        </blockquote>
        <div className="mt-6 flex flex-col gap-3 border-t border-[var(--color-border)] pt-5">
          <OutcomePill outcome={story.outcome} />
          {story.detail && (
            <p className="text-xs text-[var(--color-ink-muted)]">{story.detail}</p>
          )}
          <figcaption className="flex items-center gap-3">
            <Avatar story={story} />
            <div>
              <p className="text-sm font-bold text-[var(--color-ink)]">{story.name}</p>
              <p className="text-xs text-[var(--color-ink-muted)]">{story.exam}</p>
            </div>
          </figcaption>
        </div>
      </figure>
    </Reveal>
  );
}

function CompactCard({ story, delay }: { story: LandingSuccessStory; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <figure className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-apple-sm)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-apple-md)]">
        <Quote
          className="h-4 w-4 shrink-0 text-[var(--color-accent)]/35"
          strokeWidth={2}
          aria-hidden
        />
        <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-ink)]">
          &ldquo;{story.quote}&rdquo;
        </blockquote>
        <div className="mt-4 space-y-2 border-t border-[var(--color-border)] pt-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-accent)]">
            {story.outcome}
          </p>
          <figcaption className="flex items-center gap-2.5">
            <Avatar story={story} />
            <div>
              <p className="text-sm font-semibold text-[var(--color-ink)]">{story.name}</p>
              <p className="text-xs text-[var(--color-ink-muted)]">{story.exam}</p>
            </div>
          </figcaption>
        </div>
      </figure>
    </Reveal>
  );
}

function VideoPlaceholderCard() {
  return (
    <Reveal delay={0.3}>
      <div
        aria-label="Video testimonials coming soon"
        className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-elevated)] shadow-[var(--shadow-apple-sm)]">
          <PlayCircle
            className="h-6 w-6 text-[var(--color-ink-muted)]"
            strokeWidth={1.5}
            aria-hidden
          />
        </span>
        <div>
          <p className="text-sm font-semibold text-[var(--color-ink)]">Video testimonials</p>
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
            Video stories from students coming soon
          </p>
        </div>
      </div>
    </Reveal>
  );
}

export function LandingTestimonialsV2({
  stories = DEFAULT_STORIES,
}: {
  stories?: LandingSuccessStory[];
}) {
  const FEATURED = stories.filter((s) => s.featured);
  const COMPACT = stories.filter((s) => !s.featured).slice(0, 6);

  return (
    <section
      id="testimonials"
      className="scroll-mt-24 bg-[var(--color-bg)] py-20 sm:py-24"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Real results
          </p>
          <h2
            id="testimonials-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl"
          >
            Students who passed on their first try.
          </h2>
          <p className="mt-4 text-base text-[var(--color-ink-muted)]">
            Feedback from healthcare students across NCLEX, USMLE, NAPLEX, PANCE, AANP FNP, and
            NPTE-PT. Individual results vary.
          </p>
          {/* Clinician cred line */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <BadgeCheck
              className="h-4 w-4 shrink-0 text-[var(--color-accent)]"
              aria-hidden
            />
            <p className="text-xs font-semibold text-[var(--color-ink-muted)]">
              Curated by licensed healthcare providers with 12+ years of combined frontline
              experience
            </p>
          </div>
        </div>

        {/* Featured row */}
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {FEATURED.map((story, i) => (
            <FeaturedCard key={story.name} story={story} delay={i * 0.05} />
          ))}
        </div>

        {/* Compact grid */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMPACT.map((story, i) => (
            <CompactCard key={story.name} story={story} delay={i * 0.04} />
          ))}
          <VideoPlaceholderCard />
        </div>

        {/* Share + community CTA */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <Link
            href={ROUTES.community}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-5 py-2.5 text-sm font-bold text-[var(--color-ink)] shadow-[var(--shadow-apple-sm)] transition hover:shadow-[var(--shadow-apple-md)]"
          >
            Join the community wall
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <SocialShareBar
            entityType="story"
            text="Real students passing their boards with AnyExamEasy 🎓"
            url="https://www.anyexameasy.com"
          />
        </div>

        {/* Legal */}
        <p className="mt-8 text-center text-[11px] leading-relaxed text-[var(--color-ink-muted)]">
          Illustrative student feedback. Individual experiences and licensure outcomes vary
          significantly. AnyExamEasy does not guarantee exam results.
        </p>
      </div>
    </section>
  );
}
