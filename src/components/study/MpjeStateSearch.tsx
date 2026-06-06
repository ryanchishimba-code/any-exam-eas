"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Search, X } from "lucide-react";
import {
  searchMpjeJurisdictions,
  getMpjeState,
  MPJE_JURISDICTIONS,
  type MpjeJurisdiction,
} from "@/lib/mpje/config";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/useClickOutside";

type MpjeStateSearchProps = {
  value: string;
  onChange: (code: string) => void;
  className?: string;
  /** Limit dropdown to a subset (default: all jurisdictions). */
  jurisdictions?: MpjeJurisdiction[];
};

function jurisdictionBadge(j: MpjeJurisdiction): string | null {
  if (j.hasOwnJurisprudenceExam) return "Own exam";
  if (j.isTerritory) return "Territory";
  if (j.transitioningToUmpje) return "UMPJE 2026";
  return null;
}

function filterJurisdictions(
  pool: MpjeJurisdiction[],
  query: string,
  limit: number
): MpjeJurisdiction[] {
  const q = query.trim().toLowerCase();
  if (!q) return pool.slice(0, limit);
  const scored = pool
    .map((j) => {
      const name = j.name.toLowerCase();
      const code = j.code.toLowerCase();
      let score = 0;
      if (code === q) score += 100;
      else if (name === q) score += 90;
      else if (code.startsWith(q)) score += 80;
      else if (name.startsWith(q)) score += 70;
      else if (name.includes(q)) score += 50;
      else if (code.includes(q)) score += 40;
      return { j, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.j.name.localeCompare(b.j.name));
  return scored.slice(0, limit).map((x) => x.j);
}

export function MpjeStateSearch({
  value,
  onChange,
  className,
  jurisdictions = MPJE_JURISDICTIONS,
}: MpjeStateSearchProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = getMpjeState(value);
  const [query, setQuery] = useState(selected?.name ?? "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const deferredQuery = useDeferredValue(query);
  const results = useMemo(
    () =>
      jurisdictions === MPJE_JURISDICTIONS
        ? searchMpjeJurisdictions(deferredQuery, 12)
        : filterJurisdictions(jurisdictions, deferredQuery, 12),
    [deferredQuery, jurisdictions]
  );

  const showDropdown = open && query.trim().length > 0;

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  useClickOutside(containerRef, close, open);

  useEffect(() => {
    const match = getMpjeState(value);
    if (match && !open) setQuery(match.name);
  }, [value, open]);

  useEffect(() => {
    if (!showDropdown) setActiveIndex(-1);
    else if (results.length > 0 && activeIndex >= results.length) {
      setActiveIndex(results.length - 1);
    }
  }, [activeIndex, results.length, showDropdown]);

  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const option = listRef.current.querySelector<HTMLElement>(
      `[data-jurisdiction-option="${activeIndex}"]`
    );
    option?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const pick = useCallback(
    (j: MpjeJurisdiction) => {
      setQuery(j.name);
      onChange(j.code);
      close();
    },
    [close, onChange]
  );

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown) {
      if (event.key === "ArrowDown" && query.trim()) {
        setOpen(true);
        setActiveIndex(0);
        event.preventDefault();
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((i) => (i < results.length - 1 ? i + 1 : 0));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((i) => (i > 0 ? i - 1 : results.length - 1));
        break;
      case "Enter":
        event.preventDefault();
        if (activeIndex >= 0 && results[activeIndex]) pick(results[activeIndex]);
        break;
      case "Escape":
        event.preventDefault();
        close();
        break;
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <label htmlFor={`${listboxId}-input`} className="apple-label">
        Search state or territory
      </label>
      <div className="relative mt-2">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-muted)]"
          aria-hidden
        />
        <input
          ref={inputRef}
          id={`${listboxId}-input`}
          type="text"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          placeholder="Type state name or code (e.g. Texas, CA)…"
          className="apple-input w-full pl-9 pr-9"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
        {query && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--color-ink-muted)] hover:bg-black/[0.04] hover:text-[var(--color-ink)]"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showDropdown && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-black/[0.08] bg-white py-1 shadow-lg"
        >
          {results.length === 0 ? (
            <li className="px-3 py-2.5 text-sm text-[var(--color-ink-muted)]">
              No matching states or territories
            </li>
          ) : (
            results.map((j, i) => {
              const badge = jurisdictionBadge(j);
              const isSelected = j.code === value;
              const isActive = i === activeIndex;
              return (
                <li
                  key={j.code}
                  id={`${listboxId}-option-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  data-jurisdiction-option={i}
                  className={cn(
                    "cursor-pointer px-3 py-2.5 text-sm transition",
                    isActive && "bg-[var(--color-accent)]/8",
                    isSelected && "font-medium text-[var(--color-accent)]"
                  )}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(j)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[var(--color-ink)]">
                      {j.name}
                      <span className="ml-1.5 text-xs text-[var(--color-ink-muted)]">
                        {j.code}
                      </span>
                    </span>
                    {badge && (
                      <span className="shrink-0 rounded-md bg-black/[0.04] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
                        {badge}
                      </span>
                    )}
                  </div>
                </li>
              );
            })
          )}
        </ul>
      )}

      {selected && !showDropdown && (
        <p className="mt-1.5 text-xs text-[var(--color-ink-muted)]">
          Selected: {selected.name} ({selected.code})
        </p>
      )}
    </div>
  );
}
