"use client";

import type { KeyboardEventHandler, ReactNode, RefObject } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { boardAccentFromHref } from "@/lib/marketing/board-accent";
import { boardPickerIcon } from "@/lib/navigation/board-picker-icons";
import { cn } from "@/lib/utils";

export type BoardPickerMenuItem = {
  href: string;
  label: string;
};

type BoardPickerMenuLinkProps = BoardPickerMenuItem & {
  active?: boolean;
  onNavigate?: () => void;
  /** When set, renders as a menu item inside the exams dropdown. */
  role?: "menuitem";
  layout?: "menu" | "mobile";
};

export function BoardPickerMenuLink({
  href,
  label,
  active = false,
  onNavigate,
  role,
  layout = "menu",
}: BoardPickerMenuLinkProps) {
  const slug = boardAccentFromHref(href);
  const Icon = boardPickerIcon(slug);

  return (
    <Link
      href={href}
      prefetch={false}
      role={role}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "board-picker-menu-link",
        active && "board-picker-menu-link--active",
        layout === "mobile" && "board-picker-menu-link--mobile"
      )}
    >
      <span className="board-picker-menu-link__icon-well" aria-hidden>
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <span className="board-picker-menu-link__label">{label}</span>
      {active ? (
        <Check className="board-picker-menu-link__check h-4 w-4" strokeWidth={2.25} aria-hidden />
      ) : null}
      {active ? <span className="sr-only"> (current page)</span> : null}
    </Link>
  );
}

type BoardPickerMenuPanelProps = {
  id: string;
  menuRef?: RefObject<HTMLUListElement | null>;
  ariaLabel?: string;
  onKeyDown?: KeyboardEventHandler<HTMLUListElement>;
  children: ReactNode;
  className?: string;
};

export function BoardPickerMenuPanel({
  id,
  menuRef,
  ariaLabel = "Exams",
  onKeyDown,
  children,
  className,
}: BoardPickerMenuPanelProps) {
  return (
    <div className={cn("board-picker-menu-panel exams-dropdown__panel", className)}>
      <ul
        ref={menuRef}
        id={id}
        role="menu"
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
        className="board-picker-menu-list w-64 max-w-[calc(100vw-2rem)] sm:w-72"
      >
        {children}
      </ul>
    </div>
  );
}

export function BoardPickerMenuListItem({ children }: { children: ReactNode }) {
  return <li role="none">{children}</li>;
}
