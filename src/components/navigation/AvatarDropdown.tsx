"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ChevronDown, Layers, LayoutGrid, LogOut, User } from "lucide-react";
import { firstName } from "@/lib/client/returning-user";
import { useUserAccess } from "@/lib/client/use-user-access";
import { useSignOutConfirm } from "@/lib/client/use-sign-out-confirm";
import { useAppPreferences } from "@/lib/client/use-app-preferences";
import { hasClinicalStudyTools } from "@/lib/edtech/exam-content-scope";
import { useClickOutside } from "@/hooks/useClickOutside";
import { STUDY_HUB_PATH, TOP_500_DRUGS_PATH } from "@/lib/study-hub/config";

function initials(name?: string | null, email?: string | null) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "AE";
}

export function AvatarDropdown() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { hasPremiumAccess } = useUserAccess();
  const { examSlug } = useAppPreferences();
  const clinical = hasClinicalStudyTools(examSlug);
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { signingOut, requestSignOut } = useSignOutConfirm({ callbackUrl: "/" });

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  useClickOutside(rootRef, close, open);

  useEffect(() => {
    close();
  }, [close, pathname]);

  useEffect(() => {
    function onCloseMenus() {
      close();
    }
    document.addEventListener("aee:close-menus", onCloseMenus);
    return () => document.removeEventListener("aee:close-menus", onCloseMenus);
  }, [close]);

  const menuItems = hasPremiumAccess
    ? [
        {
          href: STUDY_HUB_PATH,
          label: "Study Hub",
          description: clinical ? "Question banks & Top 500 drugs" : "MPJE question bank & law reference",
          icon: LayoutGrid,
        },
        ...(clinical
          ? [
              {
                href: "/question-bank?field=nursing",
                label: "NCLEX",
                description: "Nursing question bank",
                icon: BookOpen,
              },
              {
                href: TOP_500_DRUGS_PATH,
                label: "Top 500 Drugs",
                description: "Shared drug flashcards",
                icon: Layers,
              },
            ]
          : []),
      ]
    : [
        {
          href: STUDY_HUB_PATH,
          label: "Study Hub",
          description: "Your study home",
          icon: User,
        },
      ];

  const focusMenuItem = useCallback((index: number) => {
    const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
    items?.[index]?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        triggerRef.current?.focus();
        return;
      }
      if (!menuRef.current?.contains(e.target as Node) && e.key !== "Tab") return;

      const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
      if (!items?.length) return;

      const currentIndex = Array.from(items).findIndex((el) => el === document.activeElement);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        focusMenuItem(next);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        focusMenuItem(prev);
      } else if (e.key === "Home") {
        e.preventDefault();
        focusMenuItem(0);
      } else if (e.key === "End") {
        e.preventDefault();
        focusMenuItem(items.length - 1);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    requestAnimationFrame(() => focusMenuItem(0));

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close, focusMenuItem, open]);

  function handleToggle() {
    if (signingOut) return;
    setOpen((v) => !v);
  }

  function handleSignOutRequest() {
    close();
    requestSignOut();
  }

  if (!session?.user) return null;

  const name = session.user.name ?? undefined;
  const email = session.user.email ?? undefined;
  const display = name ? firstName(name) : email?.split("@")[0] ?? "Account";

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        className="aee-avatar-trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={open ? menuId : undefined}
        aria-label={`Account menu for ${display}`}
        disabled={signingOut}
        onClick={handleToggle}
      >
        <span className="aee-avatar-circle" aria-hidden>
          {initials(name, email)}
        </span>
        <span className="hidden max-w-[7rem] truncate text-xs font-medium text-[var(--color-ink)] sm:inline">
          {display}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-[var(--color-ink-muted)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id={menuId}
            className="aee-avatar-menu"
            role="menu"
            aria-label="Account"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="border-b border-black/[0.06] px-4 py-3">
              <p className="truncate text-sm font-semibold text-[var(--color-ink)]">
                {name ?? display}
              </p>
              {email && (
                <p className="mt-0.5 truncate text-xs text-[var(--color-ink-muted)]">{email}</p>
              )}
            </div>

            <ul className="py-1.5" role="none">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label} role="none">
                    <Link
                      href={item.href}
                      role="menuitem"
                      tabIndex={-1}
                      className="aee-avatar-menu-item"
                      onClick={close}
                    >
                      <span className="aee-avatar-menu-icon" aria-hidden>
                        <Icon className="h-4 w-4" strokeWidth={2} />
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-[var(--color-ink)]">
                          {item.label}
                        </span>
                        <span className="block text-[0.6875rem] text-[var(--color-ink-muted)]">
                          {item.description}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-black/[0.06] p-2">
              <button
                type="button"
                role="menuitem"
                tabIndex={-1}
                className="aee-avatar-signout"
                disabled={signingOut}
                onClick={handleSignOutRequest}
              >
                <LogOut className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
