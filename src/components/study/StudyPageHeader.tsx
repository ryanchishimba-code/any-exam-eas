import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { feUi } from "@/lib/study/full-exam-ui";
import { cn } from "@/lib/utils";

export type StudyBreadcrumb = { label: string; href: string };

type Props = {
  /** Short uppercase label shown above the title (e.g. "Library", "Question Bank"). */
  eyebrow: string;
  /** Main page title. */
  title: ReactNode;
  /** Optional one-liner below the title. */
  subtitle?: ReactNode;
  /** Optional breadcrumb trail rendered above the eyebrow. */
  breadcrumbs?: StudyBreadcrumb[];
  /** Optional action slot (e.g. a CTA button aligned to the right). */
  action?: ReactNode;
  className?: string;
};

/**
 * Shared page header for Library, Question Bank, and Full Exam —
 * ensures a consistent Apple-style eyebrow + title + subtitle layout
 * across all three study surfaces.
 */
export function StudyPageHeader({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
  action,
  className,
}: Props) {
  return (
    <header className={cn("px-0.5", className)}>
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1">
          {breadcrumbs.map((crumb, idx) => (
            <span key={crumb.href} className="flex items-center gap-1">
              {idx > 0 ? (
                <ChevronRight
                  className="h-3 w-3 text-[var(--color-ink-muted)] opacity-40"
                  aria-hidden
                />
              ) : null}
              <Link
                href={crumb.href}
                className="text-[12px] text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]"
              >
                {crumb.label}
              </Link>
            </span>
          ))}
        </nav>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className={feUi.eyebrow}>{eyebrow}</p>
          <h1 className={cn(feUi.title, "mt-1")}>{title}</h1>
          {subtitle ? (
            <p className={cn(feUi.subtitle, "mt-2 max-w-xl")}>{subtitle}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0 self-end">{action}</div> : null}
      </div>
    </header>
  );
}
