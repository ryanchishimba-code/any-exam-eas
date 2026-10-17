"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { NextEpisodeButton, QuickBitesQuiz } from "@/components/quick-bites/QuickBitesQuiz";
import {
  getQuickBiteBySlug,
  quickBitePoster,
  type QuickBiteEpisode,
} from "@/lib/quick-bites/catalog";
import { parseVideoTimestamp } from "@/lib/quick-bites/timestamp";
import { dbUi } from "@/lib/study/dashboard-ui";
import { cn } from "@/lib/utils";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; videoUrl: string; captionsUrl: string }
  | { status: "locked" }
  | { status: "failed" };

export function QuickBitesPlayer({
  episode,
  onClose,
  onNext,
  playbackNonce = 0,
  library,
}: {
  episode: QuickBiteEpisode | null;
  onClose: () => void;
  onNext?: () => void;
  /** Changes when the student picks an episode. Resets the quiz without remounting the page. */
  playbackNonce?: number;
  library?: ReactNode;
}) {
  const slug = episode ? (getQuickBiteBySlug(episode.slug) ?? episode).slug : "";
  const [media, setMedia] = useState<{ slug: string; state: LoadState }>({
    slug: "",
    state: { status: "loading" },
  });
  const state = media.slug === slug ? media.state : { status: "loading" };
  const identity = `${episode?.slug ?? ""}:${playbackNonce}`;
  const [quizSession, setQuizSession] = useState({ id: identity, open: false });
  const quizOpen = quizSession.id === identity && quizSession.open;
  const videoRef = useRef<HTMLVideoElement>(null);
  const playedToken = useRef("");
  const scrollLock = useRef<number | null>(null);

  function holdScroll() {
    scrollLock.current = window.scrollY;
  }

  useLayoutEffect(() => {
    const y = scrollLock.current;
    if (y == null) return;
    const restore = () => {
      if (Math.abs(window.scrollY - y) > 1) window.scrollTo(0, y);
    };
    restore();
    const frame = requestAnimationFrame(restore);
    const timer = window.setTimeout(() => {
      restore();
      scrollLock.current = null;
    }, 60);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [quizOpen]);
  const known = episode ? (getQuickBiteBySlug(episode.slug) ?? episode) : null;
  const poster = known ? quickBitePoster(known.slug) : null;

  function rewatch(timestamp: string) {
    const video = videoRef.current;
    const seconds = parseVideoTimestamp(timestamp);
    if (!video || seconds == null) return;
    const seek = () => {
      try {
        video.currentTime = seconds;
      } catch {
        // jsdom media elements may reject seeking.
      }
    };
    seek();
    if (video.readyState < 1) {
      video.addEventListener("loadedmetadata", seek, { once: true });
    }
  }

  useEffect(() => {
    if (!slug) return;
    const controller = new AbortController();
    let active = true;

    fetch(`/api/quick-bites/${slug}/media`, { signal: controller.signal })
      .then(async (response) => {
        if (!active) return;
        if (response.status === 401 || response.status === 403) {
          setMedia({ slug, state: { status: "locked" } });
          return;
        }
        if (!response.ok) {
          setMedia({ slug, state: { status: "failed" } });
          return;
        }
        const body = (await response.json()) as { videoUrl?: string; captionsUrl?: string };
        if (!active) return;
        if (!body.videoUrl || !body.captionsUrl) {
          setMedia({ slug, state: { status: "failed" } });
          return;
        }
        setMedia({
          slug,
          state: { status: "ready", videoUrl: body.videoUrl, captionsUrl: body.captionsUrl },
        });
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (error instanceof DOMException && error.name === "AbortError") return;
        setMedia({ slug, state: { status: "failed" } });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [slug]);

  useEffect(() => {
    if (!known || state.status !== "ready") return;
    const video = videoRef.current;
    if (!video) return;
    const token = `${known.slug}:${playbackNonce}`;
    if (playedToken.current === token) return;
    playedToken.current = token;
    try {
      const pending = video.play?.();
      if (pending && typeof pending.catch === "function") pending.catch(() => {});
    } catch {
      // Autoplay can be blocked. The controls stay available.
    }
  }, [known, state.status, playbackNonce]);

  return (
    <div className="contents">
      <div
        id="quick-bites-player"
        className="scroll-mt-28 [grid-area:player] [overflow-anchor:none]"
        style={{ overflowAnchor: "none" }}
      >
        <div className="flex h-[4.5rem] items-start justify-between gap-3">
          {known ? (
            <>
              <div className="min-w-0 pt-0.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                  Now playing
                </p>
                <h3 className="line-clamp-2 text-[18px] font-semibold leading-snug tracking-[-0.02em] text-[var(--color-ink)]">
                  {known.number}. {known.title}
                </h3>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  aria-expanded={quizOpen}
                  aria-controls="quick-bites-quiz-panel"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    holdScroll();
                    setQuizSession({ id: identity, open: !quizOpen });
                  }}
                  className={cn(quizOpen ? dbUi.ghostBtn : dbUi.primaryBtn, "min-h-11 px-3 sm:px-4")}
                >
                  {quizOpen ? "Close quiz" : "Take the quiz"}
                </button>
                {onNext && !quizOpen ? (
                  <span className="hidden sm:inline-flex">
                    <NextEpisodeButton onNext={onNext} emphasis="quiet" />
                  </span>
                ) : null}
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={onClose}
                  className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                >
                  <X className="h-4 w-4" aria-hidden />
                  <span className="sr-only">Close player</span>
                </button>
              </div>
            </>
          ) : (
            <p className="text-[14px] text-[var(--color-ink-muted)]">Nothing playing yet.</p>
          )}
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#14120f] shadow-[var(--shadow-apple-md)]">
          {known && poster && state.status === "ready" ? (
            <video
              key={known.slug}
              ref={videoRef}
              controls
              preload="none"
              playsInline
              poster={poster.webp}
              width={1920}
              height={1080}
              src={state.videoUrl}
              aria-label={`${known.title} video`}
              className="absolute inset-0 h-full w-full bg-black object-contain"
            >
              <track kind="captions" src={state.captionsUrl} srcLang="en" label="English" />
            </video>
          ) : (
            <div className="absolute inset-0">
              {poster ? (
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
              ) : null}
              <p className="absolute inset-x-0 bottom-0 bg-black/55 px-4 py-3 text-[13px] text-white">
                {!known
                  ? "Your episode plays here."
                  : state.status === "loading"
                    ? "Preparing your episode..."
                    : state.status === "locked"
                      ? "This episode is part of a paid membership."
                      : "This episode did not load. Close it and try again."}
              </p>
            </div>
          )}
        </div>
        <p className="mt-3 h-16 overflow-hidden text-[12px] leading-8 text-[var(--color-ink-muted)]">
          {known ? "Captions are available from the player. They match the words already on screen." : "\u00a0"}
        </p>
      </div>

      {library}

      <div
        id="quick-bites-quiz-panel"
        data-state={quizOpen ? "open" : "closed"}
        className="h-[min(16rem,28dvh)] max-h-[min(16rem,28dvh)] min-h-0 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] [grid-area:quiz] [overflow-anchor:none]"
        style={{ overflowAnchor: "none" }}
      >
        <div className="h-full overflow-y-auto p-4 [scrollbar-gutter:stable]">
          {known && quizOpen ? (
            <QuickBitesQuiz slug={known.slug} onRewatch={rewatch} onNext={onNext} />
          ) : (
            <p className="text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
              {known
                ? "The quiz stays in this panel so the video can keep playing."
                : "Choose an episode. Questions stay closed until you take the quiz."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
