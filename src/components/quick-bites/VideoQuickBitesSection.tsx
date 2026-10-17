"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { Lock, Play } from "lucide-react";
import { QuickBitesPlayer } from "@/components/quick-bites/QuickBitesPlayer";
import {
  QUICK_BITE_GROUPS,
  isQuickBiteEpisodePlayable,
  nextPlayableQuickBite,
  quickBitePoster,
  type QuickBiteEpisode,
} from "@/lib/quick-bites/catalog";
import {
  PHARMACY_QUICK_BITE_EPISODES,
  isPharmacyQuickBitePlayable,
  nextPlayablePharmacyQuickBite,
  pharmacyQuickBitePoster,
} from "@/lib/quick-bites/pharmacy-catalog";
import { dbUi } from "@/lib/study/dashboard-ui";
import { cn } from "@/lib/utils";

type QuickBiteSeries = {
  id: string;
  headingId: string;
  title: string;
  subtitle: string;
  note: string | null;
  lockedMessage: string;
  groups: { title: string; episodes: QuickBiteEpisode[] }[];
  poster: (slug: string) => { webp: string; jpg: string };
  apiBase: string;
  includeCaptionsTrack: boolean;
  captionsNote: string;
  isPlayable: (episode: QuickBiteEpisode, canPlayLibrary: boolean) => boolean;
  nextEpisode: (slug: string, canPlayLibrary: boolean) => QuickBiteEpisode | null;
};

const NURSING_SERIES: QuickBiteSeries = {
  id: "video-quick-bites",
  headingId: "video-quick-bites-heading",
  title: "Video Quick Bites",
  subtitle: "Short chalkboard explainers for the nursing boards.",
  note: "Lab ranges vary by lab.",
  lockedMessage: "How the Nursing Boards Work is free. Paid members can watch every episode.",
  groups: QUICK_BITE_GROUPS,
  poster: quickBitePoster,
  apiBase: "/api/quick-bites",
  includeCaptionsTrack: true,
  captionsNote: "Captions are available from the player. They match the words already on screen.",
  isPlayable: isQuickBiteEpisodePlayable,
  nextEpisode: nextPlayableQuickBite,
};

const PHARMACY_SERIES: QuickBiteSeries = {
  id: "video-quick-bites-pharmacy",
  headingId: "video-quick-bites-pharmacy-heading",
  title: "Quick Bites: Pharmacy",
  subtitle: "Short chalkboard explainers for the pharmacy boards.",
  note: null,
  lockedMessage: "Paid members can watch every episode.",
  groups: [{ title: "", episodes: PHARMACY_QUICK_BITE_EPISODES }],
  poster: pharmacyQuickBitePoster,
  apiBase: "/api/quick-bites-pharmacy",
  includeCaptionsTrack: false,
  captionsNote: "Captions are already on the video.",
  isPlayable: isPharmacyQuickBitePlayable,
  nextEpisode: nextPlayablePharmacyQuickBite,
};

function Poster({ poster }: { poster: { webp: string; jpg: string } }) {
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

/** True when most of the player is already on screen, so we should not move the page. */
export function isQuickBitesPlayerInView(node: HTMLElement): boolean {
  const rect = node.getBoundingClientRect();
  if (rect.height <= 0 || rect.width <= 0) return true;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  if (viewportHeight <= 0) return true;
  const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
  return visibleHeight >= Math.min(rect.height, viewportHeight) * 0.6;
}

export function VideoQuickBitesSection({
  canPlay,
  upgradeHref,
  upgradeLabel,
  series = "nursing",
}: {
  canPlay: boolean;
  upgradeHref: string;
  upgradeLabel: string;
  series?: "nursing" | "pharmacy";
}) {
  const config = series === "pharmacy" ? PHARMACY_SERIES : NURSING_SERIES;
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [session, setSession] = useState(0);
  const scrollRequest = useRef(false);
  const active =
    config.groups
      .flatMap((group) => group.episodes)
      .find((episode) => episode.slug === activeSlug && config.isPlayable(episode, canPlay)) ?? null;
  const nextEpisode = active ? config.nextEpisode(active.slug, canPlay) : null;

  function selectFromLibrary(slug: string) {
    const player = document.getElementById("quick-bites-player");
    // One smooth scroll only when the player is actually off-screen.
    scrollRequest.current = !!player && !isQuickBitesPlayerInView(player);
    setActiveSlug(slug);
    setSession((current) => current + 1);
  }

  function selectNext() {
    if (!nextEpisode) return;
    scrollRequest.current = false;
    setActiveSlug(nextEpisode.slug);
    setSession((current) => current + 1);
  }

  useLayoutEffect(() => {
    if (!scrollRequest.current) return;
    scrollRequest.current = false;
    const player = document.getElementById("quick-bites-player");
    if (!player || isQuickBitesPlayerInView(player)) return;
    try {
      player.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch {
      // jsdom may not implement scrolling.
    }
  }, [session]);

  return (
    <section
      id={config.id}
      aria-labelledby={config.headingId}
      className={cn(dbUi.surface, "scroll-mt-28 space-y-5 p-4 [overflow-anchor:none] sm:p-6")}
      style={{ overflowAnchor: "none" }}
    >
      <div className="space-y-2">
        <p className={dbUi.eyebrow}>Quick Bites by AnyExamEasy</p>
        <h2
          id={config.headingId}
          className="text-[22px] font-semibold tracking-[-0.03em] text-[var(--color-ink)] sm:text-[26px]"
        >
          {config.title}
        </h2>
        <p className={dbUi.subtitle}>{config.subtitle}</p>
        {config.note ? (
          <p className="text-[12px] leading-relaxed text-[var(--color-ink-muted)]">{config.note}</p>
        ) : null}
      </div>

      {canPlay ? (
        <p className="text-[13px] text-[var(--color-ink-muted)]">Choose an episode to play.</p>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] leading-relaxed text-[var(--color-ink)]">{config.lockedMessage}</p>
          <Link href={upgradeHref} className={cn(dbUi.primaryBtn, "min-h-11 w-full sm:w-auto")}>
            {upgradeLabel}
          </Link>
        </div>
      )}

      <div
        id="quick-bites-layout"
        className="grid grid-cols-1 items-start gap-4 [grid-template-areas:'player'_'library'_'quiz'] [overflow-anchor:none] lg:grid-cols-[minmax(0,1.55fr)_minmax(220px,0.8fr)] lg:gap-x-6 lg:[grid-template-areas:'player_library'_'quiz_library']"
        style={{ overflowAnchor: "none" }}
      >
        <QuickBitesPlayer
          episode={active}
          onClose={() => setActiveSlug(null)}
          onNext={nextEpisode ? selectNext : undefined}
          playbackNonce={session}
          apiBase={config.apiBase}
          poster={active ? config.poster(active.slug) : undefined}
          includeCaptionsTrack={config.includeCaptionsTrack}
          captionsNote={config.captionsNote}
          library={
            <div
              id="quick-bites-library"
              className="min-h-0 min-w-0 [grid-area:library] [overflow-anchor:none] max-lg:overflow-x-auto lg:sticky lg:top-[calc(var(--nav-height)+1rem)] lg:max-h-[calc(100dvh-var(--nav-height)-2rem)] lg:self-start lg:overflow-y-auto lg:pr-1"
              style={{ overflowAnchor: "none" }}
            >
              <div className="flex w-max items-start gap-3 lg:block lg:w-auto lg:space-y-6">
                {config.groups.map((group) => (
                  <div key={group.title || config.id} className="flex gap-3 lg:block">
                    {group.title ? (
                      <h3 className="sr-only text-[13px] font-semibold tracking-[-0.01em] text-[var(--color-ink)] lg:not-sr-only lg:mb-2.5">
                        {group.title}
                      </h3>
                    ) : null}
                    <ul className="flex gap-3 lg:grid lg:grid-cols-1">
                      {group.episodes.map((episode) => (
                        <li key={episode.slug} className="w-36 shrink-0 lg:w-auto">
                          {config.isPlayable(episode, canPlay) ? (
                            <button
                              type="button"
                              aria-pressed={active?.slug === episode.slug}
                              aria-label={`Play ${episode.number}. ${episode.title}`}
                              onMouseDown={(event) => event.preventDefault()}
                              onClick={() => selectFromLibrary(episode.slug)}
                              className="flex min-h-11 w-full flex-col overflow-hidden rounded-2xl border border-[var(--db-line,var(--color-border))]/80 bg-[var(--color-surface)] text-left transition hover:border-[var(--color-accent)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                            >
                              <span className="relative block">
                                <Poster poster={config.poster(episode.slug)} />
                                <span className="absolute bottom-2 left-2 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-black/70 text-white">
                                  <Play className="h-4 w-4" aria-hidden />
                                </span>
                              </span>
                              <EpisodeMeta episode={episode} />
                            </button>
                          ) : (
                            <figure className="overflow-hidden rounded-2xl border border-[var(--db-line,var(--color-border))]/80 bg-[var(--color-surface)]">
                              <div className="relative">
                                <Poster poster={config.poster(episode.slug)} />
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
            </div>
          }
        />
      </div>
    </section>
  );
}
