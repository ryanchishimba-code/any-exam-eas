import Link from "next/link";
import { LEGAL_ENTITY } from "@/lib/legal";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/** Site-wide bottom strip — support contact and staff admin login, kept separate from main nav. */
export function SiteBottomBar({ className }: Props) {
  const mailto = `mailto:${LEGAL_ENTITY.supportEmail}?subject=${encodeURIComponent("Any Exam Easy — Contact")}`;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-black/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.08]",
        className
      )}
    >
      <p className="text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
        <Link
          href={ROUTES.about}
          className="font-medium text-[var(--color-ink)] underline decoration-black/15 underline-offset-2 transition hover:text-[var(--color-accent)] hover:decoration-[var(--color-accent)]/40"
        >
          About Us
        </Link>
        <span aria-hidden> · </span>
        Questions or account help?{" "}
        <Link
          href={ROUTES.feedback}
          className="font-medium text-[var(--color-ink)] underline decoration-black/15 underline-offset-2 transition hover:text-[var(--color-accent)] hover:decoration-[var(--color-accent)]/40"
        >
          Contact us
        </Link>
        <span aria-hidden> · </span>
        <a
          href={mailto}
          className="tabular-nums text-[var(--color-ink-muted)] transition hover:text-[var(--color-accent)]"
        >
          {LEGAL_ENTITY.supportEmail}
        </a>
      </p>
      <Link
        href={ROUTES.admin.login}
        className="text-[12px] font-medium text-[var(--color-ink-muted)] transition hover:text-[var(--color-ink)]"
      >
        Admin login
      </Link>
    </div>
  );
}
