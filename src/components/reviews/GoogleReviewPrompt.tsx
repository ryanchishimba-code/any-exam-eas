"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import {
  GOOGLE_REVIEW_COPY,
  GOOGLE_REVIEW_CTA_NAME,
  googleReviewHiddenUntil,
  googleReviewUrl,
  isGoogleReviewSuppressed,
  readGoogleReviewHiddenUntil,
  writeGoogleReviewHiddenUntil,
  type GoogleReviewSurface,
} from "@/lib/reviews/google-review";

type Variant = "card" | "link";

type Props = {
  surface: GoogleReviewSurface;
  /** Card after an exam. Quiet text link on dashboard and account. */
  variant?: Variant;
  className?: string;
};

/**
 * Renders nothing when the public review URL is unset, the visitor is signed
 * out, or they dismissed or opened the review within the last 60 days.
 * First paint is empty so server and client HTML match.
 */
export function GoogleReviewPrompt({ surface, variant = "card", className }: Props) {
  const url = googleReviewUrl();
  if (!url) return null;
  return (
    <GoogleReviewPromptLive url={url} surface={surface} variant={variant} className={className} />
  );
}

function GoogleReviewPromptLive({
  url,
  surface,
  variant,
  className,
}: {
  url: string;
  surface: GoogleReviewSurface;
  variant: Variant;
  className?: string;
}) {
  const { data: session, status } = useSession();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    const signedIn = status === "authenticated" && Boolean(session?.user);
    if (!signedIn) {
      setVisible(false);
      return;
    }
    try {
      const until = readGoogleReviewHiddenUntil(window.localStorage);
      setVisible(!isGoogleReviewSuppressed(until, Date.now()));
    } catch {
      setVisible(false);
    }
  }, [session?.user, status]);

  function hideForCooldown() {
    try {
      writeGoogleReviewHiddenUntil(window.localStorage, googleReviewHiddenUntil(Date.now()));
    } catch {
      /* Private mode can block storage; still hide for this view. */
    }
    setVisible(false);
  }

  function onReviewClick() {
    analytics.ctaClicked(GOOGLE_REVIEW_CTA_NAME, surface);
    hideForCooldown();
  }

  if (!visible) return null;

  return (
    <GoogleReviewPromptView
      url={url}
      surface={surface}
      variant={variant}
      className={className}
      onDismiss={hideForCooldown}
      onOpen={onReviewClick}
    />
  );
}

function GoogleReviewPromptView({
  url,
  surface,
  variant,
  className,
  onDismiss,
  onOpen,
}: {
  url: string;
  surface: GoogleReviewSurface;
  variant: Variant;
  className?: string;
  onDismiss: () => void;
  onOpen: () => void;
}) {
  if (variant === "link") {
    return (
      <span
        data-google-review={surface}
        className={cn(
          "inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1",
          className
        )}
      >
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onOpen}
          className="inline-flex min-h-11 items-center font-semibold text-[var(--color-ink)] underline-offset-2 hover:text-[var(--color-accent)] hover:underline"
        >
          {GOOGLE_REVIEW_COPY.linkLabel}
        </a>
        <span className="text-[var(--color-ink-muted)]">{GOOGLE_REVIEW_COPY.linkHint}</span>
        <button
          type="button"
          onClick={onDismiss}
          className="inline-flex min-h-11 items-center px-1 text-[12px] font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
        >
          {GOOGLE_REVIEW_COPY.dismiss}
        </button>
      </span>
    );
  }

  return (
    <aside
      data-google-review={surface}
      aria-label={GOOGLE_REVIEW_COPY.cardTitle}
      className={cn(
        "w-full max-w-full overflow-hidden rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 text-left shadow-[var(--shadow-apple-sm)] sm:p-5",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="pt-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
          {GOOGLE_REVIEW_COPY.cardEyebrow}
        </p>
        <button
          type="button"
          onClick={onDismiss}
          className="inline-flex min-h-11 shrink-0 items-center px-1 text-[13px] font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
        >
          {GOOGLE_REVIEW_COPY.dismiss}
        </button>
      </div>
      <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
        {GOOGLE_REVIEW_COPY.cardTitle}
      </h2>
      <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-muted)]">
        {GOOGLE_REVIEW_COPY.cardBody}
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onOpen}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[var(--color-accent)] px-4 text-center text-[14px] font-semibold text-white shadow-[var(--shadow-apple-btn)] transition hover:opacity-95 sm:w-auto sm:min-w-[14rem] sm:px-6"
      >
        {GOOGLE_REVIEW_COPY.cardAction}
      </a>
    </aside>
  );
}
