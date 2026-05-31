"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  BarChart3,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { firstName } from "@/lib/client/returning-user";
import { useSignOutConfirm } from "@/lib/client/use-sign-out-confirm";
import { SignOutConfirmDialog } from "@/components/auth/SignOutConfirmDialog";

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
  const { data: session } = useSession();
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const {
    confirmOpen,
    signingOut,
    requestSignOut,
    cancelSignOut,
    confirmSignOut,
  } = useSignOutConfirm({ callbackUrl: "/" });

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const menuItems = [
    {
      href: "/dashboard",
      label: "Profile",
      description: "Account & subscription",
      icon: User,
    },
    {
      href: "/study/analytics",
      label: "Progress & Analytics",
      description: "Progress, streaks, weak areas",
      icon: BarChart3,
    },
    {
      href: "/pricing",
      label: "Settings",
      description: "Plan & billing",
      icon: Settings,
    },
  ] as const;

  const focusMenuItem = useCallback((index: number) => {
    const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
    items?.[index]?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) close();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
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

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    requestAnimationFrame(() => focusMenuItem(0));

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close, focusMenuItem, open]);

  async function handleSignOutRequest() {
    close();
    requestSignOut();
  }

  if (!session?.user) return null;

  const name = session.user.name ?? undefined;
  const email = session.user.email ?? undefined;
  const display = name ? firstName(name) : email?.split("@")[0] ?? "Account";

  return (
    <>
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        className="aee-avatar-trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-label={`Account menu for ${display}`}
        onClick={() => setOpen((v) => !v)}
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

      {open && (
        <div
          ref={menuRef}
          id={menuId}
          className="aee-avatar-menu"
          role="menu"
          aria-label="Account"
        >
          <div className="border-b border-black/[0.06] px-4 py-3 dark:border-white/10">
            <p className="truncate text-sm font-semibold text-[var(--color-ink)]">
              {name ?? display}
            </p>
            {email && (
              <p className="mt-0.5 truncate text-xs text-[var(--color-ink-muted)]">
                {email}
              </p>
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
                    onClick={() => setOpen(false)}
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

          <div className="border-t border-black/[0.06] p-2 dark:border-white/10">
            <button
              type="button"
              role="menuitem"
              tabIndex={-1}
              className="aee-avatar-signout"
              onClick={handleSignOutRequest}
            >
              <LogOut className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>

    <SignOutConfirmDialog
      open={confirmOpen}
      loading={signingOut}
      onCancel={cancelSignOut}
      onConfirm={() => void confirmSignOut()}
    />
    </>
  );
}
