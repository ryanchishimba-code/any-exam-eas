"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LogIn, LogOut, Menu, Shield, X } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { LoginModalTrigger } from "@/components/auth/LoginModalTrigger";
import { AvatarDropdown } from "@/components/navigation/AvatarDropdown";
import { AdminNavLink } from "@/components/navigation/AdminNavLink";
import { ExamsDropdown } from "@/components/navigation/ExamsDropdown";
import { GlobalExamSwitcher } from "@/components/navigation/GlobalExamSwitcher";
import { useUserAccess } from "@/lib/client/use-user-access";
import { useIsAdmin } from "@/lib/client/admin-access";
import { useSignOutConfirm } from "@/lib/client/use-sign-out-confirm";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useClickOutside } from "@/hooks/useClickOutside";
import { ROUTES, EXAM_NAV_ITEMS } from "@/lib/routes";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { formatTrialCtaLabel } from "@/lib/site";

type NavLink = { href: string; label: string };

const guestLinks: NavLink[] = [
  { href: ROUTES.about, label: "About Us" },
  { href: ROUTES.resources, label: "Resources" },
  { href: ROUTES.feedback, label: "Contact Us" },
];

const premiumLinks: NavLink[] = [
  { href: ROUTES.dashboard, label: "Dashboard" },
  { href: ROUTES.questionBank, label: "Question Bank" },
  { href: ROUTES.analytics, label: "Analytics" },
];

function navClass(active: boolean) {
  return active
    ? "font-semibold text-[var(--color-ink)] underline decoration-2 underline-offset-4 decoration-[var(--color-accent)]"
    : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:underline hover:underline-offset-4 transition-colors duration-200";
}

export function Navigation() {
  const mobileMenuId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { hasPremiumAccess, loading: accessLoading } = useUserAccess();
  const { signingOut, requestSignOut } = useSignOutConfirm({ callbackUrl: "/" });

  const isAuthenticated = status === "authenticated" && Boolean(session?.user);
  const resolvingAuthedAccess = isAuthenticated && accessLoading;
  const resolvingAuth = status === "loading" || resolvingAuthedAccess;
  const { isAdmin } = useIsAdmin();

  const links = useMemo(() => {
    return isAuthenticated && hasPremiumAccess ? premiumLinks : guestLinks;
  }, [hasPremiumAccess, isAuthenticated]);

  const closeMobile = useCallback(() => setOpen(false), []);

  useBodyScrollLock(open);
  useClickOutside(headerRef, closeMobile, open);

  function isActive(href: string) {
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

  const brandHref = isAuthenticated && hasPremiumAccess ? ROUTES.dashboard : ROUTES.home;
  const practiceActive =
    isActive(ROUTES.dashboard) ||
    pathname.startsWith("/exams") ||
    pathname.startsWith("/practice") ||
    pathname.startsWith("/study") ||
    pathname.startsWith("/question-bank") ||
    pathname.startsWith("/full-exam");

  return (
    <header ref={headerRef} className="apple-glass aee-nav fixed top-0 z-50 w-full dark:border-teal-500/10">
      <nav className="aee-nav-inner mx-auto max-w-[1140px] px-5 sm:px-6" aria-label="Main navigation">
        <BrandLogo href={brandHref} variant="nav" linkClassName="aee-nav-brand" priority />

        <ul className="aee-nav-links hidden lg:flex lg:items-center lg:gap-5" role="list">
          {isAuthenticated && hasPremiumAccess ? (
            <li>
              <ExamsDropdown />
            </li>
          ) : null}
          {links.map((l) => {
            const linkActive =
              l.href === ROUTES.dashboard ? practiceActive : isActive(l.href);
            return (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`inline-flex items-center gap-1 text-xs ${navClass(linkActive)}`}
                aria-current={linkActive ? "page" : undefined}
              >
                {l.label}
              </Link>
            </li>
            );
          })}
        </ul>

        <div className="aee-nav-actions">
          <ThemeToggle />
          {isAuthenticated && !accessLoading ? (
            <div className="hidden lg:block">
              <GlobalExamSwitcher variant="nav" />
            </div>
          ) : null}
          {resolvingAuth ? (
            <span
              className="inline-block h-9 w-28 animate-pulse rounded-full bg-black/[0.06]"
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
                className="aee-nav-login max-[380px]:px-2.5"
                aria-label="Sign in to your account"
              >
                <LogIn className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
                <span className="max-[380px]:hidden">Sign in</span>
              </LoginModalTrigger>
              <Link href={LANDING_TRIAL_HREF} className="aee-nav-cta text-[0.8125rem] max-[380px]:px-3">
                {formatTrialCtaLabel()}
              </Link>
            </div>
          )}

          <button
            type="button"
            className="aee-nav-menu-btn lg:hidden"
            onClick={toggleMobile}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls={mobileMenuId}
          >
            {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id={mobileMenuId}
            className="aee-mobile-nav border-t border-black/[0.04] bg-[color-mix(in_srgb,var(--color-surface-elevated)_98%,transparent)] px-5 backdrop-blur-xl lg:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="overflow-hidden py-4">
              {isAuthenticated && hasPremiumAccess ? (
                <>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">
                    Exams
                  </p>
                  {EXAM_NAV_ITEMS.map((exam) => (
                    <Link
                      key={exam.slug}
                      href={exam.href}
                      className={`block py-2 text-sm ${navClass(pathname === exam.href || pathname.startsWith(`${exam.href}/`))}`}
                      onClick={closeMobile}
                    >
                      {exam.label}
                      <span className="ml-1 text-xs text-[var(--color-ink-muted)]">· {exam.stat}</span>
                    </Link>
                  ))}
                  <div className="my-3 border-t border-black/[0.06]" />
                </>
              ) : null}
              {links.map((l) => {
                const linkActive =
                  l.href === ROUTES.dashboard ? practiceActive : isActive(l.href);
                return (
                <Link
                  key={l.href}
                  href={l.href}
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
                    href={LANDING_TRIAL_HREF}
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
                    className="aee-mobile-nav-item"
                    onClick={closeMobile}
                  >
                    Dashboard
                  </Link>
                  {!hasPremiumAccess && (
                    <Link href={ROUTES.pricing} className="aee-mobile-nav-item" onClick={closeMobile}>
                      Pricing
                    </Link>
                  )}
                  {isAdmin && (
                    <Link href={ROUTES.admin.root} className="aee-mobile-nav-item flex items-center gap-2" onClick={closeMobile}>
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
