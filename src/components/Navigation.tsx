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
import { ExamsDropdown } from "@/components/navigation/ExamsDropdown";
import { GlobalExamSwitcher } from "@/components/navigation/GlobalExamSwitcher";
import { useUserAccess } from "@/lib/client/use-user-access";
import { useSignOutConfirm } from "@/lib/client/use-sign-out-confirm";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useClickOutside } from "@/hooks/useClickOutside";
import { ROUTES } from "@/lib/routes";

type NavLink = { href: string; label: string; adminOnly?: boolean };

const guestLinks: NavLink[] = [
  { href: ROUTES.dashboard, label: "Practice" },
  { href: ROUTES.pricing, label: "Pricing" },
];

const premiumLinks: NavLink[] = [
  { href: ROUTES.dashboard, label: "Dashboard" },
  { href: ROUTES.questionBank, label: "Question Bank" },
  { href: ROUTES.analytics, label: "Analytics" },
  { href: ROUTES.admin.root, label: "Admin", adminOnly: true },
];

function navClass(active: boolean) {
  return active
    ? "font-semibold text-[var(--color-ink)] underline decoration-2 underline-offset-4 decoration-[var(--color-accent)]"
    : "text-[var(--color-ink)] opacity-80 hover:opacity-100 hover:underline hover:underline-offset-4 transition-opacity duration-200";
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
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin";

  const links = useMemo(() => {
    const base = isAuthenticated && hasPremiumAccess ? premiumLinks : guestLinks;
    return base.filter((l) => !l.adminOnly || isAdmin);
  }, [hasPremiumAccess, isAuthenticated, isAdmin]);

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
    <header ref={headerRef} className="apple-glass aee-nav fixed top-0 z-50 w-full">
      <nav className="aee-nav-inner mx-auto max-w-[1140px] px-5 sm:px-6" aria-label="Main navigation">
        <BrandLogo href={brandHref} variant="nav" linkClassName="aee-nav-brand" priority />

        <ul className="aee-nav-links hidden lg:flex lg:items-center lg:gap-5" role="list">
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
                className={`inline-flex items-center gap-1 text-xs ${navClass(linkActive)}`}
                aria-current={linkActive ? "page" : undefined}
              >
                {l.adminOnly && <Shield className="h-3 w-3" aria-hidden />}
                {l.label}
              </Link>
            </li>
            );
          })}
        </ul>

        <div className="aee-nav-actions">
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
            <AvatarDropdown />
          ) : (
            <div className="aee-nav-auth-group">
              <LoginModalTrigger
                callbackUrl={ROUTES.dashboard}
                className="aee-nav-login"
                aria-label="Log in to your account"
              >
                <LogIn className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
                Log in
              </LoginModalTrigger>
              <Link href="/signup?plan=trial" className="aee-nav-cta">
                <span className="hidden min-[420px]:inline">Start free trial</span>
                <span className="min-[420px]:hidden">Start trial</span>
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
            className="aee-mobile-nav border-t border-black/[0.04] bg-[rgba(251,251,253,0.98)] px-5 backdrop-blur-xl lg:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="overflow-hidden py-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Exams
              </p>
              {["nclex", "naplex", "usmle", "mpje"].map((slug) => (
                <Link
                  key={slug}
                  href={`/exams/${slug}`}
                  className={`block py-2 text-sm uppercase ${navClass(pathname.startsWith(`/exams/${slug}`))}`}
                  onClick={closeMobile}
                >
                  {slug}
                </Link>
              ))}
              <div className="my-3 border-t border-black/[0.06]" />
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
                    Log in
                  </LoginModalTrigger>
                  <Link
                    href="/signup?plan=trial"
                    className="aee-nav-cta block py-3 text-center text-sm"
                    onClick={closeMobile}
                  >
                    Start free trial
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
                    <Link href={ROUTES.admin.root} className="aee-mobile-nav-item" onClick={closeMobile}>
                      Admin
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
