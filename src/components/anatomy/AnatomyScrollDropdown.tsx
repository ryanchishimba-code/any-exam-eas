"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { anatomyUi } from "@/lib/anatomy/anatomy-ui";
import { cn } from "@/lib/utils";

export type AnatomyDropdownItem = {
  id: string;
  label: string;
  /** Structure id to focus in the 3D viewport (defaults to id). */
  focusId?: string;
};

export type AnatomyDropdownGroup = {
  id: string;
  label: string;
  items: AnatomyDropdownItem[];
};

type Placement = "up" | "down" | "auto";

type Props = {
  label: string;
  placeholder: string;
  value: string;
  groups: AnatomyDropdownGroup[];
  onChange: (id: string) => void;
  /** Live preview while hovering — drives 3D camera + highlight. */
  onPreview?: (focusStructureId: string | null) => void;
  disabled?: boolean;
  visibleRows?: number;
  placement?: Placement;
};

const ROW_HEIGHT_PX = 40;
const MENU_GAP_PX = 6;

function resolvePlacement(trigger: DOMRect, menuHeight: number, preference: Placement): "up" | "down" {
  if (preference === "up") return "up";
  if (preference === "down") return "down";
  const spaceBelow = window.innerHeight - trigger.bottom;
  const spaceAbove = trigger.top;
  if (spaceBelow < menuHeight + MENU_GAP_PX && spaceAbove > spaceBelow) return "up";
  return "down";
}

export function AnatomyScrollDropdown({
  label,
  placeholder,
  value,
  groups,
  onChange,
  onPreview,
  disabled = false,
  visibleRows = 5,
  placement = "auto",
}: Props) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [open, setOpen] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [menuStyle, setMenuStyle] = useState<{
    top: number;
    left: number;
    width: number;
    openUp: boolean;
  } | null>(null);

  const flatItems = useMemo(
    () =>
      groups.flatMap((group) =>
        group.items.map((item) => ({
          ...item,
          focusStructureId: item.focusId ?? item.id,
          groupId: group.id,
        }))
      ),
    [groups]
  );

  const selectedLabel = flatItems.find((item) => item.id === value)?.label;
  const menuHeight = visibleRows * ROW_HEIGHT_PX;

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateMenuPosition = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const openUp = resolvePlacement(rect, menuHeight, placement) === "up";
    setMenuStyle({
      left: rect.left,
      width: rect.width,
      top: openUp ? rect.top - MENU_GAP_PX : rect.bottom + MENU_GAP_PX,
      openUp,
    });
  };

  useLayoutEffect(() => {
    if (!open) {
      setMenuStyle(null);
      return;
    }
    updateMenuPosition();
    const onLayout = () => updateMenuPosition();
    window.addEventListener("resize", onLayout);
    window.addEventListener("scroll", onLayout, true);
    return () => {
      window.removeEventListener("resize", onLayout);
      window.removeEventListener("scroll", onLayout, true);
    };
  }, [open, menuHeight, placement]);

  useLayoutEffect(() => {
    if (!open || !value) return;
    const el = itemRefs.current.get(value);
    el?.scrollIntoView({ block: "nearest" });
  }, [open, value]);

  useEffect(() => {
    if (!open) {
      setHoveredItemId(null);
      onPreview?.(null);
      return;
    }
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !document.getElementById(listboxId)?.contains(target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, listboxId, onPreview]);

  const previewItem = (item: AnatomyDropdownItem) => {
    setHoveredItemId(item.id);
    const focusId = item.focusId ?? item.id;
    onPreview?.(focusId);
    const el = itemRefs.current.get(item.id);
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  const clearPreview = () => {
    setHoveredItemId(null);
    onPreview?.(null);
  };

  const pick = (item: AnatomyDropdownItem) => {
    onChange(item.id);
    clearPreview();
    setOpen(false);
  };

  const menu =
    open && menuStyle && mounted ? (
      <div
        id={listboxId}
        role="listbox"
        aria-labelledby={`${listboxId}-label`}
        onMouseLeave={clearPreview}
        style={{
          position: "fixed",
          left: menuStyle.left,
          width: menuStyle.width,
          ...(menuStyle.openUp
            ? { bottom: window.innerHeight - menuStyle.top }
            : { top: menuStyle.top }),
          zIndex: 50,
        }}
        className="overflow-hidden rounded-[14px] border border-black/[0.08] bg-white shadow-[var(--shadow-apple-md)]"
      >
        <div
          ref={listRef}
          className="overflow-y-auto overscroll-contain"
          style={{ maxHeight: menuHeight }}
        >
          {groups.map((group) => (
            <div key={group.id} role="group" aria-label={group.label}>
              <p className="sticky top-0 z-10 border-b border-black/[0.04] bg-white/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)] backdrop-blur-sm">
                {group.label}
              </p>
              <ul className="py-0.5">
                {group.items.map((item) => {
                  const selected = item.id === value;
                  const previewing = hoveredItemId === item.id && !selected;
                  return (
                    <li key={item.id} role="presentation">
                      <button
                        ref={(node) => {
                          if (node) itemRefs.current.set(item.id, node);
                          else itemRefs.current.delete(item.id);
                        }}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onMouseEnter={() => previewItem(item)}
                        onClick={() => pick(item)}
                        className={cn(
                          "flex h-10 w-full items-center gap-2 px-3 text-left text-[14px] transition",
                          selected
                            ? "bg-[var(--color-accent)]/10 font-medium text-[var(--color-accent)]"
                            : previewing
                              ? "bg-[var(--color-accent)]/5 text-[var(--color-ink)] ring-1 ring-inset ring-[var(--color-accent)]/25"
                              : "text-[var(--color-ink)] hover:bg-black/[0.03]"
                        )}
                      >
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        {selected ? <Check className="h-3.5 w-3.5 shrink-0" aria-hidden /> : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    ) : null;

  return (
    <div ref={rootRef} className="relative space-y-1.5">
      <span id={`${listboxId}-label`} className="text-[12px] font-medium text-[var(--color-ink-muted)]">
        {label}
      </span>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${listboxId}-label`}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          anatomyUi.select,
          "flex w-full items-center justify-between text-left",
          disabled && "opacity-50"
        )}
      >
        <span className={cn("truncate", !selectedLabel && "text-[var(--color-ink-muted)]")}>
          {selectedLabel ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[var(--color-ink-muted)] transition",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      {menu && mounted ? createPortal(menu, document.body) : null}
    </div>
  );
}
