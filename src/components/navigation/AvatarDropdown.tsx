"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  BarChart3,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { firstName } from "@/lib/client/returning-user";

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
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  if (!session?.user) return null;

  const name = session.user.name ?? undefined;
  const email = session.user.email ?? undefined;
  const display = name ? firstName(name) : email?.split("@")[0] ?? "Account";

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
      description: "Readiness, streaks, weak areas",
      icon: BarChart3,
    },
    {
      href: "/dashboard",
      label: "Settings",
      description: "Preferences & billing",
      icon: Settings,
    },
  ] as const;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="aee-avatar-trigger"
        aria-expanded={open}
        aria-haspopup="menu"
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
        <div className="aee-avatar-menu" role="menu" aria-label="Account">
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
              className="aee-avatar-signout"
              onClick={() => {
                setOpen(false);
                void signOut({ callbackUrl: "/" });
              }}
            >
              <LogOut className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
