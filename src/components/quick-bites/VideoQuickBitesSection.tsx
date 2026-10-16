"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { Lock, Play } from "lucide-react";
import {
  QUICK_BITE_GROUPS,
  isOpenQuickBite,
  quickBitePoster,
  type QuickBiteEpisode,
} from "@/lib/quick-bites/catalog";
import { dbUi } from "@/lib/study/dashboard-ui";
import { cn } from "@/lib/utils";

const QuickBitesPlayer = dynamic(
  () => import("@/components/quick-bites/QuickBitesPlayer").then((mod) => mod.QuickBitesPlayer),
  {
    ssr: false,
    loading: () => (
      <div
        className="aspect-video w-full animate-pulse rounded-2xl bg-[var(--color-surface)]"
        aria-hidden
      />
    ),
  }
);

function Poster({ slug }: { slug: string }) {
  const poster = quickBitePoster(slug);
  return (
    <picture>
      <source srcSet={poster.webp} type="image/webp" />
      <img
        src={poster.jpg}
        alt=""
        width={1280}
        height={720}
        loading="lazy"
        decoding="async"
        className="aspect-video h-auto w-full object-cover"
      />
    </picture>
  );
}

function episodeIsPlayable(episode: QuickBiteEpisode, canPlayLibrary: boolean) {
  return !episode.held && (canPlayLibrary || isOpenQuickBite(episode.slug));
}

function EpisodeMeta({ episode }: { episode: QuickBiteEpisode }) {
  return (
    <span className="flex min-h-11 items-center gap-3 px-3.5 py-2.5">
      <span className="w-6 shrink-0 text-[13px] font-semibold tabular-nums text-[var(--color-ink-muted)]">
        {episode.number}
      </span>
      <span className="min-w-0 flex-1 text-[14px] font-semibold leading-snug tracking-[-0.01em] text-[var(--color-ink)]">
        {episode.title}
      </span>
      <span className="shrink-0 text-[12px] tabular-nums text-[var(--color-ink-muted)]">
        {episode.held ? "Coming soon" : episode.duration}
      </span>
    </span>
  );
}

export function VideoQuickBitesSection({
  canPlay,
  upgradeHref,
  upgradeLabel,
}: {
  canPlay: boolean;
  upgradeHref: string;
  upgradeLabel: string;
}) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const active =
    QUICK_BITE_GROUPS.flatMap((group) => group.episodes).find(
      (episode) => episode.slug === activeSlug && episodeIsPlayable(episode, canPlay)
    ) ?? null;

  return (
    <section
      id="video-quick-bites"
      aria-labelledby="video-quick-bites-heading"
      className={cn(dbUi.surface, "scroll-mt-28 space-y-5 p-4 sm:p-6")}
    >
      <div className="space-y-2">
        <p className={dbUi.eyebrow}>Quick Bites by AnyExamEasy</p>
        <h2
          id="video-quick-bites-heading"
          className="text-[22px] font-semibold tracking-[-0.03em] text-[var(--color-ink)] sm:text-[26px]"
        >
          Video Quick Bites
        </h2>
        <p className={dbUi.subtitle}>
          Short chalkboard explainers for the nursing boards.
        </p>
        <p className="text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
          Lab ranges vary by lab.
        </p>
      </div>

      {canPlay ? (
        <p className="text-[13px] text-[var(--color-ink-muted)]">Choose an episode to play.</p>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] leading-relaxed text-[var(--color-ink)]">
            How the Nursing Boards Work is free. Paid members can watch every episode.
          </p>
          <Link
            href={upgradeHref}
            className={cn(dbUi.primaryBtn, "min-h-11 w-full sm:w-auto")}
          >
            {upgradeLabel}
          </Link>
        </div>
      )}

      {active ? <QuickBitesPlayer episode={active} onClose={() => setActiveSlug(null)} /> : null}

      <div className="space-y-6">
        {QUICK_BITE_GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className="text-[13px] font-semibold tracking-[-0.01em] text-[var(--color-ink)]">
              {group.title}
            </h3>
            <ul className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.episodes.map((episode) => (
                <li key={episode.slug}>
                  {episodeIsPlayable(episode, canPlay) ? (
                    <button
                      type="button"
                      aria-pressed={active?.slug === episode.slug}
                      aria-label={`Play ${episode.number}. ${episode.title}`}
                      onClick={() =>
                        setActiveSlug((current) =>
                          current === episode.slug ? null : episode.slug
                        )
                      }
                      className="flex min-h-11 w-full flex-col overflow-hidden rounded-2xl border border-[var(--db-line,var(--color-border))]/80 bg-[var(--color-surface)] text-left transition hover:border-[var(--color-accent)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                    >
                      <span className="relative block">
                        <Poster slug={episode.slug} />
                        <span className="absolute bottom-2 left-2 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-black/70 text-white">
                          <Play className="h-4 w-4" aria-hidden />
                        </span>
                      </span>
                      <EpisodeMeta episode={episode} />
                    </button>
                  ) : (
                    <figure className="overflow-hidden rounded-2xl border border-[var(--db-line,var(--color-border))]/80 bg-[var(--color-surface)]">
                      <div className="relative">
                        <Poster slug={episode.slug} />
                        {canPlay ? null : (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                            <span className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-black/70 text-white">
                              <Lock className="h-4 w-4" aria-hidden />
                              <span className="sr-only">Locked</span>
                            </span>
                          </div>
                        )}
                      </div>
                      <figcaption>
                        <EpisodeMeta episode={episode} />
                      </figcaption>
                    </figure>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
