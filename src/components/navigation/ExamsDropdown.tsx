"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import { MARKETING_BOARD_LINKS } from "@/lib/routes";
import { cn } from "@/lib/utils";

const MENU_ID = "site-exams-menu";

function boardActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function menuItems(menu: HTMLUListElement | null) {
  return Array.from(menu?.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]') ?? []);
}

/**
 * Exams menu. Click or tap toggles it. It stays open until a click outside
 * the button and panel (including the gap between them), Escape, a menu link,
 * or a second press on the button. Hover does not open or close it.
 */
export function ExamsDropdown() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const pendingFocus = useRef<"first" | "last" | null>(null);
  // iOS sends a compatibility mouse pointerdown just after a tap. Ignore only
  // that follow-up so a real touch outside still dismisses the menu.
  const ignoreMouseOutsideUntil = useRef(0);

  const anyActive = MARKETING_BOARD_LINKS.some((board) => boardActive(pathname, board.href));

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function focusPending() {
      const which = pendingFocus.current;
      if (!which) return;
      pendingFocus.current = null;
      const items = menuItems(menuRef.current);
      const target = which === "last" ? items[items.length - 1] : items[0];
      target?.focus({ preventScroll: true });
    }

    focusPending();

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      buttonRef.current?.focus({ preventScroll: true });
    }

    function onPointerDown(event: globalThis.PointerEvent) {
      if (event.pointerType === "mouse" && performance.now() < ignoreMouseOutsideUntil.current) {
        return;
      }
      const target = event.target;
      if (target instanceof Node && rootRef.current?.contains(target)) return;
      setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [open]);

  useEffect(() => {
    function onCloseMenus() {
      setOpen(false);
    }
    document.addEventListener("aee:close-menus", onCloseMenus);
    return () => document.removeEventListener("aee:close-menus", onCloseMenus);
  }, []);

  function onButtonPointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) return;
    // One gesture, one toggle. preventDefault stops the click that follows
    // a tap from flipping the menu shut again.
    event.preventDefault();
    event.stopPropagation();
    if (event.pointerType === "touch") {
      ignoreMouseOutsideUntil.current = performance.now() + 700;
    }
    pendingFocus.current = null;
    buttonRef.current?.focus({ preventScroll: true });
    setOpen((value) => !value);
  }

  function onButtonClick(event: MouseEvent<HTMLButtonElement>) {
    // Enter and Space activate the button with detail 0 and no pointerdown.
    if (event.detail !== 0) return;
    event.preventDefault();
    pendingFocus.current = "first";
    setOpen((value) => !value);
  }

  function onButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const which = event.key === "ArrowUp" ? "last" : "first";
    pendingFocus.current = which;
    if (open) {
      const items = menuItems(menuRef.current);
      const target = which === "last" ? items[items.length - 1] : items[0];
      pendingFocus.current = null;
      target?.focus({ preventScroll: true });
      return;
    }
    setOpen(true);
  }

  function onMenuKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const items = menuItems(menuRef.current);
    if (items.length === 0) return;
    const index = items.indexOf(document.activeElement as HTMLAnchorElement);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      items[(index + 1) % items.length]?.focus({ preventScroll: true });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      items[(index - 1 + items.length) % items.length]?.focus({ preventScroll: true });
    } else if (event.key === "Home") {
      event.preventDefault();
      items[0]?.focus({ preventScroll: true });
    } else if (event.key === "End") {
      event.preventDefault();
      items[items.length - 1]?.focus({ preventScroll: true });
    }
  }

  return (
    <div ref={rootRef} className="relative flex h-full items-stretch">
      <button
        ref={buttonRef}
        type="button"
        className={cn(
          "inline-flex h-full min-h-11 items-center gap-1 px-1 text-[0.8125rem] touch-manipulation",
          anyActive
            ? "aee-nav-link aee-nav-link--active font-semibold underline decoration-2 underline-offset-4"
            : "aee-nav-link font-semibold hover:underline hover:underline-offset-4"
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={MENU_ID}
        onPointerDown={onButtonPointerDown}
        onClick={onButtonClick}
        onKeyDown={onButtonKeyDown}
      >
        Exams
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>
      {/* pt-2 is the visual gap. It stays inside this element so a press there is not "outside". */}
      <div hidden={!open} className="absolute left-0 top-full z-[60] w-56 max-w-[calc(100vw-2rem)] pt-2">
        <ul
          ref={menuRef}
          id={MENU_ID}
          role="menu"
          aria-label="Exams"
          onKeyDown={onMenuKeyDown}
          className="w-full overflow-hidden rounded-2xl border border-black/[0.08] bg-white py-1 shadow-[var(--shadow-apple-md)]"
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
                  onClick={() => setOpen(false)}
                >
                  {board.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
