"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LayoutGrid, LogOut, Menu, Settings, User } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { GlobalExamSwitcher } from "@/components/navigation/GlobalExamSwitcher";
import { AppMpjeStateChip } from "@/components/app/AppMpjeStateChip";
import { useAppPreferences } from "@/lib/client/use-app-preferences";
import { useSignOutConfirm } from "@/lib/client/use-sign-out-confirm";
import { shellUi } from "@/lib/layout/shell-ui";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

const APP_LINKS = [
  { href: ROUTES.fullExam, label: "Full Exam" },
  { href: ROUTES.questionBank, label: "Question Bank" },
  { href: ROUTES.analytics, label: "Analytics" },
] as const;

function navLinkClass(active: boolean) {
  return cn(
    "text-xs font-medium transition-colors",
    active
      ? "text-[var(--color-ink)] underline decoration-2 underline-offset-4 decoration-[var(--color-accent)]"
      : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
  );
}

type Props = {
  onMenuClick?: () => void;
};

export function AppTopNav({ onMenuClick }: Props) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { examSlug, mpjeStateCode } = useAppPreferences();
  const { signingOut, requestSignOut } = useSignOutConfirm({ callbackUrl: ROUTES.home });

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="apple-glass fixed top-0 z-50 w-full border-b border-black/[0.06] dark:border-teal-500/10">
      <nav
        className={cn(
          shellUi.container,
          "flex h-[var(--nav-height)] items-center gap-2 px-4 sm:gap-3 sm:px-6 xl:px-8"
        )}
        aria-label="App navigation"
      >
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--color-ink-muted)] transition hover:bg-black/[0.04] hover:text-[var(--color-ink)] lg:hidden"
          aria-label="Open study menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <BrandLogo href={ROUTES.dashboard} variant="nav" />

        <div className="hidden min-w-0 flex-1 items-center gap-3 md:flex">
          <GlobalExamSwitcher variant="nav" />
          <Link
            href={`${ROUTES.selectExam}?switch=1`}
            className="inline-flex items-center gap-1 rounded-lg border border-black/[0.06] bg-white/80 px-2 py-1 text-[10px] font-semibold text-[var(--color-ink-muted)] transition hover:border-teal-300 hover:text-teal-700"
            title="Open exam selection"
          >
            <LayoutGrid className="h-3 w-3" aria-hidden />
            Switch
          </Link>
          {examSlug === "mpje" ? <AppMpjeStateChip stateCode={mpjeStateCode} /> : null}
          <span className="mx-1 h-4 w-px bg-black/[0.08]" aria-hidden />
          {APP_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={navLinkClass(isActive(link.href))}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {examSlug === "mpje" ? (
            <AppMpjeStateChip stateCode={mpjeStateCode} className="md:hidden" />
          ) : null}
          <Link
            href={ROUTES.settings}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[var(--color-ink-muted)] transition hover:bg-black/[0.04] hover:text-[var(--color-ink)]"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => requestSignOut()}
            disabled={signingOut}
            className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[var(--color-ink-muted)] transition hover:bg-black/[0.04] hover:text-[var(--color-ink)] disabled:opacity-60"
          >
            <User className="h-3.5 w-3.5 md:hidden" aria-hidden />
            <span className="hidden max-w-[8rem] truncate md:inline">
              {session?.user?.name?.split(" ")[0] ?? "Account"}
            </span>
            <LogOut className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      </nav>
    </header>
  );
}
