"use client";

import type { KeyboardEventHandler, ReactNode, RefObject } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { boardAccentFromHref } from "@/lib/marketing/board-accent";
import { boardPickerSubtitle } from "@/lib/navigation/board-picker-copy";
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
  const detail = boardPickerSubtitle(href);

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
      <span className="board-picker-menu-link__text">
        <span className="board-picker-menu-link__label">{label}</span>
        <span className="board-picker-menu-link__detail">{detail}</span>
      </span>
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
        className="board-picker-menu-list w-[min(100%,20rem)] sm:w-[22rem]"
      >
        {children}
      </ul>
    </div>
  );
}

export function BoardPickerMenuListItem({ children }: { children: ReactNode }) {
  return <li role="none">{children}</li>;
}
