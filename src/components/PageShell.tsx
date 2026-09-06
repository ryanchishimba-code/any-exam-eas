import type { ReactNode } from "react";

export function PageShell({
  title,
  description,
  eyebrow,
  children,
  align = "left",
  maxWidth = "max-w-3xl",
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  children?: ReactNode;
  align?: "left" | "center";
  maxWidth?: string;
  /** @deprecated — all pages use the same clean Apple layout */
  variant?: "default" | "premium";
}) {
  const centered = align === "center";
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div
        className={`mx-auto px-6 pb-24 pt-[var(--page-top)] ${maxWidth} ${
          centered ? "text-center" : ""
        }`}
      >
        {eyebrow && (
          <p className={`text-xs font-medium uppercase tracking-wide text-[var(--color-ink-muted)] ${centered ? "" : "mb-3"}`}>
            {eyebrow}
          </p>
        )}
        <h1 className="apple-display">{title}</h1>
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
