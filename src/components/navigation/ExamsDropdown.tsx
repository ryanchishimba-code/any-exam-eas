"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import {
  examsMenuAfterClick,
  examsMenuAfterDismiss,
  examsMenuAfterHoverClose,
  examsMenuAfterPointerEnter,
} from "@/components/navigation/exams-dropdown-logic";
import { MARKETING_BOARD_LINKS } from "@/lib/routes";
import { cn } from "@/lib/utils";

const MENU_ID = "site-exams-menu";
const HOVER_CLOSE_MS = 300;

function boardActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Desktop exams menu. Hover or click opens; click pins until outside click, Esc, or a link. */
export function ExamsDropdown() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const outsideReady = useRef(false);
  const hoverCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuStateRef = useRef({ open, pinned });
  menuStateRef.current = { open, pinned };

  const dismiss = useCallback(() => {
    const next = examsMenuAfterDismiss();
    setOpen(next.open);
    setPinned(next.pinned);
  }, []);

  const close = useCallback(() => dismiss(), [dismiss]);

  const clearHoverClose = useCallback(() => {
    if (hoverCloseTimer.current) {
      clearTimeout(hoverCloseTimer.current);
      hoverCloseTimer.current = null;
    }
  }, []);

  const scheduleHoverClose = useCallback(() => {
    clearHoverClose();
    hoverCloseTimer.current = setTimeout(() => {
      hoverCloseTimer.current = null;
      const next = examsMenuAfterHoverClose(menuStateRef.current);
      if (!next) return;
      setOpen(next.open);
      setPinned(next.pinned);
    }, HOVER_CLOSE_MS);
  }, [clearHoverClose]);

  // The opening tap can emit a follow-up pointerdown. Ignore outside closes until the next frame.
  const closeFromOutside = useCallback(() => {
    if (!outsideReady.current) return;
    dismiss();
  }, [dismiss]);

  useClickOutside(rootRef, closeFromOutside, open);

  const anyActive = MARKETING_BOARD_LINKS.some((board) => boardActive(pathname, board.href));

  useEffect(() => {
    dismiss();
  }, [dismiss, pathname]);

  useEffect(() => {
    return () => clearHoverClose();
  }, [clearHoverClose]);

  useEffect(() => {
    if (!open) return;
    outsideReady.current = false;
    const frame = requestAnimationFrame(() => {
      outsideReady.current = true;
    });

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        dismiss();
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      outsideReady.current = false;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [dismiss, open]);

  useEffect(() => {
    function onCloseMenus() {
      dismiss();
    }
    document.addEventListener("aee:close-menus", onCloseMenus);
    return () => document.removeEventListener("aee:close-menus", onCloseMenus);
  }, [dismiss]);

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

  function onRootPointerEnter() {
    clearHoverClose();
    const next = examsMenuAfterPointerEnter({ open, pinned });
    setOpen(next.open);
    setPinned(next.pinned);
  }

  function onRootPointerLeave() {
    scheduleHoverClose();
  }

  return (
    <div
      ref={rootRef}
      className="relative"
      onPointerEnter={onRootPointerEnter}
      onPointerLeave={onRootPointerLeave}
    >
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
        onPointerDown={(event) => {
          // Keep the mouse click from moving focus before the toggle runs.
          if (event.pointerType === "mouse") event.preventDefault();
        }}
        onClick={(event) => {
          const fromKeyboard = event.detail === 0;
          clearHoverClose();
          const next = examsMenuAfterClick({ open, pinned });
          setOpen(next.open);
          setPinned(next.pinned);
          if (next.open && fromKeyboard) {
            requestAnimationFrame(() => {
              menuRef.current
                ?.querySelector<HTMLAnchorElement>('[role="menuitem"]')
                ?.focus({ preventScroll: true });
            });
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && !open) {
            event.preventDefault();
            clearHoverClose();
            setOpen(true);
            setPinned(true);
            requestAnimationFrame(() => {
              menuRef.current
                ?.querySelector<HTMLAnchorElement>('[role="menuitem"]')
                ?.focus({ preventScroll: true });
            });
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
        <div className="exams-dropdown__panel absolute left-0 top-full z-[60]">
          <ul
            ref={menuRef}
            id={MENU_ID}
            role="menu"
            aria-label="Exams"
            onKeyDown={onMenuKeyDown}
            className="w-56 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-black/[0.08] bg-white py-1 shadow-[var(--shadow-apple-md)]"
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
        </div>
      ) : null}
    </div>
  );
}
