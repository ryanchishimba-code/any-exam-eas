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
}) {
  const centered = align === "center";

  return (
    <div className="apple-page">
      <div
        className={`mx-auto px-6 pb-24 pt-[var(--page-top)] ${maxWidth} ${
          centered ? "text-center" : ""
        }`}
      >
        {eyebrow && <p className={`apple-eyebrow ${centered ? "" : "mb-2"}`}>{eyebrow}</p>}
        <h1 className="apple-title">{title}</h1>
        {description && (
          <p className={`apple-lede mt-4 ${centered ? "mx-auto" : ""}`}>{description}</p>
        )}
        {children}
      </div>
    </div>
  );
}
