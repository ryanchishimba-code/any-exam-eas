"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  BarChart3,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LoginModalTrigger } from "@/components/auth/LoginModalTrigger";
import { AvatarDropdown } from "@/components/navigation/AvatarDropdown";
import { useUserAccess } from "@/lib/client/use-user-access";
import { useSignOutConfirm } from "@/lib/client/use-sign-out-confirm";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useClickOutside } from "@/hooks/useClickOutside";

type NavLink = { href: string; label: string };

const guestLinks: NavLink[] = [
  { href: "/study", label: "Study" },
  { href: "/generate", label: "Exams" },
  { href: "/study/drugs300", label: "Top 500 Drugs" },
  { href: "/pricing", label: "Pricing" },
];

const premiumLinks: NavLink[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/study", label: "Study" },
  { href: "/generate", label: "Exams" },
  { href: "/study/drugs300", label: "Top 500 Drugs" },
  { href: "/study/analytics", label: "Analytics" },
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
  const authReady = status !== "loading" && !accessLoading;

  const links = useMemo(
    () => (isAuthenticated && hasPremiumAccess ? premiumLinks : guestLinks),
    [hasPremiumAccess, isAuthenticated]
  );

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

  const brandHref = isAuthenticated && hasPremiumAccess ? "/dashboard" : "/";

  return (
    <header
      ref={headerRef}
      className="apple-glass aee-nav fixed top-0 z-50 w-full"
    >
      <nav
        className="aee-nav-inner mx-auto max-w-[1140px] px-5 sm:px-6"
        aria-label="Main navigation"
      >
        <Link href={brandHref} className="aee-nav-brand">
          Any Exam Easy
        </Link>

        <ul className="aee-nav-links hidden lg:flex" role="list">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`text-xs ${navClass(isActive(l.href))}`}
                aria-current={isActive(l.href) ? "page" : undefined}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="aee-nav-actions">
          {!authReady ? (
            <span
              className="inline-block h-9 w-28 animate-pulse rounded-full bg-black/[0.06]"
              aria-hidden
            />
          ) : isAuthenticated ? (
            <AvatarDropdown />
          ) : (
            <div className="aee-nav-auth-group">
              <LoginModalTrigger
                callbackUrl="/dashboard"
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
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`block py-2.5 text-sm ${navClass(isActive(l.href))}`}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  onClick={closeMobile}
                >
                  {l.label}
                </Link>
              ))}
              {authReady && !isAuthenticated && (
                <div className="mt-3 space-y-2 border-t border-black/[0.06] pt-3">
                  <LoginModalTrigger
                    callbackUrl="/dashboard"
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
              {authReady && isAuthenticated && (
                <div className="mt-3 space-y-1 border-t border-black/[0.06] pt-3">
                  <Link href="/dashboard" className="aee-mobile-nav-item" onClick={closeMobile}>
                    <LayoutDashboard className="h-4 w-4" aria-hidden /> Dashboard
                  </Link>
                  <Link
                    href="/study/analytics"
                    className="aee-mobile-nav-item"
                    onClick={closeMobile}
                  >
                    <BarChart3 className="h-4 w-4" aria-hidden /> Progress &amp; Analytics
                  </Link>
                  {!hasPremiumAccess && (
                    <Link href="/pricing" className="aee-mobile-nav-item" onClick={closeMobile}>
                      Pricing
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
