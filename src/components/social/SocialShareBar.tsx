"use client";

import { useCallback, useState } from "react";
import { buildShareUrl, SHARE_PLATFORMS } from "@/lib/social/platforms";
import type { ShareEntityType, SharePlatform } from "@/lib/social/types";
import { getOrCreateAnalyticsSessionId } from "@/lib/analytics/client-session";

/**
 * Reusable share bar. Drop it on questions, results, progress, success stories,
 * or any page. Fires a tracking beacon to /api/social/share on each click.
 *
 *   <SocialShareBar entityType="result" entityId={attemptId} text="I scored 92%!" />
 *
 * `url` defaults to the current page. Tracking failures never block the share.
 */
type SocialShareBarProps = {
  entityType: ShareEntityType;
  entityId?: string;
  /** Caption used by X / WhatsApp. */
  text?: string;
  /** Absolute URL to share. Defaults to the current page URL. */
  url?: string;
  className?: string;
  size?: "sm" | "md";
};

const BRAND_ICONS: Record<Exclude<SharePlatform, "copy">, React.ReactNode> = {
  x: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.08 24 18.09 24 12.07Z" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.04zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z" />
    </svg>
  ),
};

export function SocialShareBar({
  entityType,
  entityId,
  text,
  url,
  className = "",
  size = "md",
}: SocialShareBarProps) {
  const [copied, setCopied] = useState(false);

  const resolveUrl = useCallback(() => {
    if (url) return url;
    if (typeof window !== "undefined") return window.location.href;
    return "https://www.anyexameasy.com";
  }, [url]);

  const track = useCallback(
    (platform: SharePlatform) => {
      const shareUrl = resolveUrl();
      const payload = JSON.stringify({
        platform,
        entityType,
        entityId,
        url: shareUrl,
        sessionId: getOrCreateAnalyticsSessionId(),
      });
      try {
        // sendBeacon survives navigation/new-tab; fetch keepalive as fallback.
        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/social/share", new Blob([payload], { type: "application/json" }));
        } else {
          void fetch("/api/social/share", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
            keepalive: true,
          });
        }
      } catch {
        /* tracking is best-effort */
      }
    },
    [entityId, entityType, resolveUrl]
  );

  const onShare = useCallback(
    (platform: Exclude<SharePlatform, "copy">) => {
      const href = buildShareUrl(platform, { url: resolveUrl(), text });
      track(platform);
      if (href) window.open(href, "_blank", "noopener,noreferrer,width=600,height=560");
    },
    [resolveUrl, text, track]
  );

  const onCopy = useCallback(async () => {
    track("copy");
    try {
      await navigator.clipboard.writeText(resolveUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — no-op */
    }
  }, [resolveUrl, track]);

  const btn =
    size === "sm"
      ? "h-8 w-8"
      : "h-9 w-9";

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      role="group"
      aria-label="Share"
    >
      <span className="text-xs font-medium text-[var(--color-ink-muted)]">Share</span>
      {SHARE_PLATFORMS.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onShare(p.id)}
          aria-label={`Share on ${p.label}`}
          title={`Share on ${p.label}`}
          className={`inline-flex ${btn} items-center justify-center rounded-full border border-black/[0.08] bg-[var(--color-surface-elevated)] text-[var(--color-ink-muted)] transition hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)] dark:border-white/[0.1]`}
        >
          {BRAND_ICONS[p.id]}
        </button>
      ))}
      <button
        type="button"
        onClick={() => void onCopy()}
        aria-label="Copy link"
        title="Copy link"
        className={`inline-flex ${btn} items-center justify-center rounded-full border border-black/[0.08] bg-[var(--color-surface-elevated)] text-[var(--color-ink-muted)] transition hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)] dark:border-white/[0.1]`}
      >
        {copied ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H17a4 4 0 0 1 0 8h-3.5M10.5 18H7a4 4 0 0 1 0-8h3.5M8 12h8" />
          </svg>
        )}
      </button>
    </div>
  );
}
