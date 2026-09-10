import type { ReactNode } from "react";

export function PageShell({
  title,
  description,
  eyebrow,
  children,
  align = "left",
  maxWidth = "max-w-3xl",
  compact = false,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  children?: ReactNode;
  align?: "left" | "center";
  maxWidth?: string;
  /** Transactional pages — a marketing-sized hero pushes the form off-screen. */
  compact?: boolean;
  /** @deprecated — all pages use the same clean Apple layout */
  variant?: "default" | "premium";
}) {
  const centered = align === "center";
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div
        className={`mx-auto px-6 ${compact ? "pb-12 pt-[calc(var(--page-top)-0.75rem)]" : "pb-24 pt-[var(--page-top)]"} ${maxWidth} ${
          centered ? "text-center" : ""
        }`}
      >
        {eyebrow && (
          <p className={`text-xs font-medium uppercase tracking-wide text-[var(--color-ink-muted)] ${centered ? "" : "mb-3"}`}>
            {eyebrow}
          </p>
        )}
        <h1
          className={
            compact
              ? "text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl"
              : "apple-display"
          }
        >
          {title}
        </h1>
        {description && (
          <p className={`apple-subhead mt-5 max-w-xl ${centered ? "mx-auto" : ""}`}>
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
