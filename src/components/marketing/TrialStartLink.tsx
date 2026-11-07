"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import { useSession } from "next-auth/react";

/**
 * Full-page trial signup link. A client router transition prefetches an empty
 * shell for this dynamic route and leaves the screen blank. A real navigation
 * paints the signup form from the first HTML response.
 */
export function TrialStartLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const { status } = useSession();
  const [pending, setPending] = useState(false);
  const pendingLabel =
    status === "authenticated" ? "Opening your dashboard…" : "Starting your free trial…";

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (
      pending ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      if (pending) event.preventDefault();
      return;
    }
    event.preventDefault();
    setPending(true);
    window.setTimeout(() => {
      window.location.assign(href);
    }, 0);
  }

  return (
    <a
      className={className}
      href={href}
      aria-busy={pending || undefined}
      data-loading={pending ? "true" : "false"}
      onClick={onClick}
    >
      {pending ? (
        <>
          <span className="fp-cta-spin" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </a>
  );
}
