"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LogIn, LogOut, Menu, Shield, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { LoginModalTrigger } from "@/components/auth/LoginModalTrigger";
import { AdminNavLink } from "@/components/navigation/AdminNavLink";
import { ExamsDropdown } from "@/components/navigation/ExamsDropdown";
import { GlobalExamSwitcher } from "@/components/navigation/GlobalExamSwitcher";
import { useUserAccess } from "@/lib/client/use-user-access";
import { useIsAdmin } from "@/lib/client/admin-access";
import { useSignOutConfirm } from "@/lib/client/use-sign-out-confirm";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useClickOutside } from "@/hooks/useClickOutside";
import { ROUTES, MARKETING_BOARD_LINKS } from "@/lib/routes";
import { LANDING_TRIAL_HREF, landingTrialHrefForExam } from "@/lib/landing/trial-href";
import { formatTrialCtaLabel } from "@/lib/site";
import { marketingExamKeyFromPath } from "@/lib/marketing/board-paths";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

// Only signed-in visitors ever see this, and it needs framer-motion for its
// menu. Logged-out marketing pages render Sign in in the first HTML instead.
const AvatarDropdown = dynamic(
  () => import("@/components/navigation/AvatarDropdown").then((m) => m.AvatarDropdown),
  { ssr: false }
);

type NavLink = { href: string; label: string };

const guestLinks: NavLink[] = [
  { href: ROUTES.pricing, label: "Pricing" },
  { href: ROUTES.faq, label: "FAQ" },
  { href: ROUTES.howQuestionsAreReviewed, label: "How we review" },
  { href: ROUTES.about, label: "About" },
];

const premiumLinks: NavLink[] = [
  { href: ROUTES.dashboard, label: "Dashboard" },
  { href: ROUTES.questionBank, label: "Question Bank" },
  { href: ROUTES.analytics, label: "Analytics" },
];

function navClass(active: boolean) {
  return active
    ? "aee-nav-link aee-nav-link--active font-semibold underline decoration-2 underline-offset-4"
    : "aee-nav-link font-semibold hover:underline hover:underline-offset-4 transition-colors duration-200";
}

/** Stable id. useId() shifted between server and client and mismatched aria-controls. */
const MOBILE_MENU_ID = "site-menu";

export function Navigation() {
  const headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { hasPremiumAccess, hasAppAccess, hasStudyAccess, loading: accessLoading } = useUserAccess();
  const { signingOut, requestSignOut } = useSignOutConfirm({ callbackUrl: "/" });

  const isAuthenticated = status === "authenticated" && Boolean(session?.user);
  const resolvingAuthedAccess = isAuthenticated && accessLoading;
  // Session starts as "loading" for everyone. Treat that as logged out so the
  // Sign in and trial buttons are in the first HTML, not a grey placeholder.
  const resolvingAuth = resolvingAuthedAccess;
  const { isAdmin } = useIsAdmin();

  const links = useMemo(() => {
    if (!isAuthenticated) return guestLinks;
    if (hasPremiumAccess) return premiumLinks;
    if (hasAppAccess) {
      // Post-trial: dashboard only in marketing chrome; study links stay behind checkout.
      return hasStudyAccess
        ? [
            { href: ROUTES.dashboard, label: "Dashboard" },
            { href: ROUTES.questionBank, label: "Question Bank" },
          ]
        : [{ href: ROUTES.dashboard, label: "Dashboard" }];
    }
    return guestLinks;
  }, [hasPremiumAccess, hasAppAccess, hasStudyAccess, isAuthenticated]);

  const closeMobile = useCallback(() => setOpen(false), []);

  useBodyScrollLock(open);
  useClickOutside(headerRef, closeMobile, open);

  function isActive(href: string) {
    if (href.includes("#")) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  useEffect(() => {
    closeMobile();
  }, [closeMobile, pathname]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeMobile();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeMobile, open]);

  function toggleMobile() {
    setOpen((v) => {
      const next = !v;
      if (next) document.dispatchEvent(new CustomEvent("aee:close-menus"));
      return next;
    });
  }

  function handleMobileSignOutRequest() {
    closeMobile();
    requestSignOut();
  }

  const brandHref = isAuthenticated && hasAppAccess ? ROUTES.dashboard : ROUTES.home;
  const practiceActive =
    isActive(ROUTES.dashboard) ||
    pathname.startsWith("/exams") ||
    pathname.startsWith("/practice") ||
    pathname.startsWith("/study") ||
    pathname.startsWith("/question-bank") ||
    pathname.startsWith("/full-exam");

  const examFromPath = marketingExamKeyFromPath(pathname);
  const guestTrialHref = examFromPath
    ? landingTrialHrefForExam(examFromPath)
    : LANDING_TRIAL_HREF;

  return (
    <header ref={headerRef} className="aee-nav apple-glass fixed top-0 z-50 w-full">
      <nav className="aee-nav-inner mx-auto max-w-[1140px] px-5 sm:px-6" aria-label="Main navigation">
        <BrandLogo
          href={brandHref}
          variant="nav"
          linkClassName="aee-nav-brand"
          /* Never compete with homepage hero LCP for preload bandwidth. */
          priority={pathname !== "/"}
        />

        <ul className="aee-nav-links hidden lg:flex lg:items-center lg:gap-4" role="list">
          <li>
            <ExamsDropdown />
          </li>
          {links.map((l) => {
            const linkActive =
              l.href === ROUTES.dashboard ? practiceActive : isActive(l.href);
            return (
            <li key={l.href}>
              <Link
                href={l.href}
                prefetch={false}
                className={`inline-flex items-center gap-1 text-[0.8125rem] ${navClass(linkActive)}`}
                aria-current={linkActive ? "page" : undefined}
              >
                {l.label}
              </Link>
            </li>
            );
          })}
        </ul>

        <div className="aee-nav-actions">
          <ThemeToggle className="hidden sm:inline-flex" />
          {isAuthenticated && !accessLoading ? (
            <div className="hidden lg:block">
              <GlobalExamSwitcher variant="nav" />
            </div>
          ) : null}
          {resolvingAuth ? (
            <span
              className="aee-nav-auth-skeleton inline-block h-11 w-28 animate-pulse rounded-full"
              aria-hidden
            />
          ) : isAuthenticated ? (
            <>
              <AdminNavLink className="hidden lg:inline-flex" />
              <AvatarDropdown />
            </>
          ) : (
            <div className="aee-nav-auth-group">
              <LoginModalTrigger
                callbackUrl={ROUTES.dashboard}
                className="aee-nav-login"
                aria-label="Sign in to your account"
              >
                <LogIn className="aee-nav-login__icon h-4 w-4" strokeWidth={2.25} aria-hidden />
                <span>Sign in</span>
              </LoginModalTrigger>
              <Link
                href={guestTrialHref}
                className="aee-nav-cta"
                aria-label={formatTrialCtaLabel()}
              >
                <span className="md:hidden">Free trial</span>
                <span className="hidden md:inline">{formatTrialCtaLabel()}</span>
              </Link>
            </div>
          )}

          <button
            type="button"
            className="aee-nav-menu-btn lg:hidden"
            onClick={toggleMobile}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls={MOBILE_MENU_ID}
          >
            {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {open ? (
          <div
            id={MOBILE_MENU_ID}
            className="aee-mobile-nav-panel aee-mobile-nav max-w-full overflow-x-hidden border-t border-black/[0.04] bg-[color-mix(in_srgb,var(--color-surface-elevated)_98%,transparent)] px-4 backdrop-blur-xl lg:hidden"
          >
            <div className="max-w-full overflow-x-hidden py-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
                Exams
              </p>
              <nav aria-label="Exams">
                {MARKETING_BOARD_LINKS.map((exam) => (
                  <Link
                    key={exam.href}
                    href={exam.href}
                    prefetch={false}
                    className={`block max-w-full py-2 text-sm ${navClass(pathname === exam.href || pathname.startsWith(`${exam.href}/`))}`}
                    onClick={closeMobile}
                  >
                    {exam.label}
                  </Link>
                ))}
              </nav>
              <div className="my-3 border-t border-black/[0.06]" />
              {links.map((l) => {
                const linkActive =
                  l.href === ROUTES.dashboard ? practiceActive : isActive(l.href);
                return (
                <Link
                  key={l.href}
                  href={l.href}
                  prefetch={false}
                  className={`block py-2.5 text-sm ${navClass(linkActive)}`}
                  aria-current={linkActive ? "page" : undefined}
                  onClick={closeMobile}
                >
                  {l.label}
                </Link>
                );
              })}
              {!resolvingAuth && !isAuthenticated && (
                <div className="mt-3 space-y-2 border-t border-black/[0.06] pt-3">
                  <LoginModalTrigger
                    callbackUrl={ROUTES.dashboard}
                    className="aee-nav-login aee-nav-login-mobile w-full"
                    onClick={closeMobile}
                  >
                    <LogIn className="h-4 w-4" strokeWidth={2.25} aria-hidden />
                    Sign in
                  </LoginModalTrigger>
                  <Link
                    href={guestTrialHref}
                    className="aee-nav-cta block py-3 text-center text-sm"
                    onClick={closeMobile}
                  >
                    {formatTrialCtaLabel()}
                  </Link>
                </div>
              )}
              {!resolvingAuth && isAuthenticated && (
                <div className="mt-3 space-y-1 border-t border-black/[0.06] pt-3">
                  <div className="mb-3">
                    <GlobalExamSwitcher variant="mobile" onNavigate={closeMobile} />
                  </div>
                  <Link
                    href={ROUTES.dashboard}
                    prefetch={false}
                    className="aee-mobile-nav-item"
                    onClick={closeMobile}
                  >
                    Dashboard
                  </Link>
                  {!hasPremiumAccess && (
                    <Link href={ROUTES.pricing} prefetch={false} className="aee-mobile-nav-item" onClick={closeMobile}>
                      Pricing
                    </Link>
                  )}
                  {isAdmin && (
                    <Link href={ROUTES.admin.root} prefetch={false} className="aee-mobile-nav-item flex items-center gap-2" onClick={closeMobile}>
                      <Shield className="h-4 w-4" aria-hidden />
                      Admin dashboard
                    </Link>
                  )}
                  <button
                    type="button"
                    className="aee-mobile-nav-signout"
                    disabled={signingOut}
                    onClick={handleMobileSignOutRequest}
                  >
                    <LogOut className="h-4 w-4" aria-hidden />
                    {signingOut ? "Signing out…" : "Sign out"}
                  </button>
                </div>
              )}
            </div>
          </div>
      ) : null}
    </header>
  );
}
