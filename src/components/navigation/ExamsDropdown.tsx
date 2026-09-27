"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { MARKETING_BOARD_LINKS } from "@/lib/routes";
import { cn } from "@/lib/utils";

const MENU_ID = "site-exams-menu";

function boardActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Desktop exams menu. Esc closes. Arrow keys move through the boards. */
export function ExamsDropdown() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useClickOutside(rootRef, close, open);

  const anyActive = MARKETING_BOARD_LINKS.some((board) => boardActive(pathname, board.href));

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    const first = menu?.querySelector<HTMLAnchorElement>('[role="menuitem"]');
    first?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    function onCloseMenus() {
      setOpen(false);
    }
    document.addEventListener("aee:close-menus", onCloseMenus);
    return () => document.removeEventListener("aee:close-menus", onCloseMenus);
  }, []);

  function onMenuKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]') ?? []
    );
    if (items.length === 0) return;
    const index = items.indexOf(document.activeElement as HTMLAnchorElement);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      items[(index + 1) % items.length]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      items[(index - 1 + items.length) % items.length]?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      items[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      items[items.length - 1]?.focus();
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        className={cn(
          "inline-flex items-center gap-1 text-[0.8125rem]",
          anyActive
            ? "aee-nav-link aee-nav-link--active font-semibold underline decoration-2 underline-offset-4"
            : "aee-nav-link font-semibold hover:underline hover:underline-offset-4"
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={MENU_ID}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && !open) {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        Exams
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>
      {open ? (
        <ul
          ref={menuRef}
          id={MENU_ID}
          role="menu"
          aria-label="Exams"
          onKeyDown={onMenuKeyDown}
          className="absolute left-0 top-full z-[60] mt-2 w-56 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-black/[0.08] bg-white py-1 shadow-[var(--shadow-apple-md)]"
        >
          {MARKETING_BOARD_LINKS.map((board) => {
            const active = boardActive(pathname, board.href);
            return (
              <li key={board.href} role="none">
                <Link
                  href={board.href}
                  role="menuitem"
                  prefetch={false}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block min-h-11 px-3 py-2.5 text-sm text-[var(--color-ink)] hover:bg-black/[0.04]",
                    active && "font-semibold text-[var(--color-accent)]"
                  )}
                  onClick={close}
                >
                  {board.label}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
