"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  getQuickBiteBySlug,
  quickBitePoster,
  type QuickBiteEpisode,
} from "@/lib/quick-bites/catalog";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; videoUrl: string; captionsUrl: string }
  | { status: "locked" }
  | { status: "failed" };

export function QuickBitesPlayer({
  episode,
  onClose,
}: {
  episode: QuickBiteEpisode;
  onClose: () => void;
}) {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const poster = quickBitePoster(episode.slug);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });

    fetch(`/api/quick-bites/${episode.slug}/media`, { signal: controller.signal })
      .then(async (response) => {
        if (response.status === 401 || response.status === 403) {
          setState({ status: "locked" });
          return;
        }
        if (!response.ok) {
          setState({ status: "failed" });
          return;
        }
        const body = (await response.json()) as { videoUrl?: string; captionsUrl?: string };
        if (!body.videoUrl || !body.captionsUrl) {
          setState({ status: "failed" });
          return;
        }
        setState({ status: "ready", videoUrl: body.videoUrl, captionsUrl: body.captionsUrl });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({ status: "failed" });
      });

    return () => controller.abort();
  }, [episode.slug]);

  useEffect(() => {
    const node = document.getElementById("quick-bites-player");
    if (!node || typeof node.scrollIntoView !== "function") return;
    try {
      node.scrollIntoView({ block: "nearest" });
    } catch {
      // Some test environments do not implement scrolling.
    }
  }, [episode.slug]);

  const known = getQuickBiteBySlug(episode.slug) ?? episode;

  return (
    <div id="quick-bites-player" className="scroll-mt-28 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
            Now playing
          </p>
          <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
            {known.number}. {known.title}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--color-border)] text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          <X className="h-4 w-4" aria-hidden />
          <span className="sr-only">Close player</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-[#14120f] shadow-[var(--shadow-apple-md)]">
        {state.status === "ready" ? (
          <video
            key={known.slug}
            controls
            preload="none"
            playsInline
            poster={poster.webp}
            width={1920}
            height={1080}
            src={state.videoUrl}
            aria-label={`${known.title} video`}
            className="aspect-video h-auto w-full bg-black"
          >
            <track kind="captions" src={state.captionsUrl} srcLang="en" label="English" />
          </video>
        ) : (
          <div className="relative aspect-video w-full bg-black">
            <picture>
              <source srcSet={poster.webp} type="image/webp" />
              <img
                src={poster.jpg}
                alt=""
                width={1280}
                height={720}
                className="h-full w-full object-cover"
              />
            </picture>
            <p className="absolute inset-x-0 bottom-0 bg-black/55 px-4 py-3 text-[13px] text-white">
              {state.status === "loading"
                ? "Preparing your episode..."
                : state.status === "locked"
                  ? "This episode is part of a paid membership."
                  : "This episode did not load. Close it and try again."}
            </p>
          </div>
        )}
      </div>
      <p className="text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
        Captions are available from the player. They match the words already on screen.
      </p>
    </div>
  );
}
