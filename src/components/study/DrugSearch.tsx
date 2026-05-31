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
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { searchDrugs, type DrugSearchHit } from "@/lib/drugs300/search";
import { cn } from "@/lib/utils";

type DrugSearchProps = {
  /** Called when user picks a drug from suggestions */
  onSelect?: (drug: DrugSearchHit) => void;
  /** Navigate to study page with ?drug= when selecting (landing) */
  linkToStudy?: boolean;
  className?: string;
  maxResults?: number;
};

export function DrugSearch({
  onSelect,
  linkToStudy = false,
  className,
  maxResults = 8,
}: DrugSearchProps) {
  const router = useRouter();
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const deferredQuery = useDeferredValue(query);
  const results = useMemo(
    () => searchDrugs(deferredQuery, undefined, maxResults),
    [deferredQuery, maxResults]
  );

  const showDropdown = open && query.trim().length > 0;

  const pick = useCallback(
    (drug: DrugSearchHit) => {
      setQuery(drug.generic);
      setOpen(false);
      setActiveIndex(-1);
      onSelect?.(drug);
      if (linkToStudy) {
        router.push(`/study/drugs300?drug=${encodeURIComponent(drug.id)}`);
      }
    },
    [linkToStudy, onSelect, router]
  );

  const clear = useCallback(() => {
    setQuery("");
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!showDropdown) setActiveIndex(-1);
    else if (results.length > 0 && activeIndex >= results.length) {
      setActiveIndex(results.length - 1);
    }
  }, [activeIndex, results.length, showDropdown]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

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
        else if (results[0]) pick(results[0]);
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        setActiveIndex(-1);
        break;
    }
  }

  return (
    <div ref={containerRef} className={cn("aee-drug-search", className)}>
      <div className="aee-drug-search-field">
        <Search className="aee-drug-search-icon" aria-hidden />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          placeholder="Search drugs by generic or brand name..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={onKeyDown}
          className="aee-drug-search-input"
          autoComplete="off"
          spellCheck={false}
        />
        {query && (
          <button
            type="button"
            onClick={clear}
            className="aee-drug-search-clear"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="aee-drug-search-dropdown">
          {results.length === 0 ? (
            <p className="aee-drug-search-empty">No drugs match &ldquo;{query.trim()}&rdquo;</p>
          ) : (
            <ul id={listboxId} role="listbox" className="aee-drug-search-list">
              {results.map((drug, index) => (
                <li key={drug.id} role="presentation">
                  <button
                    id={`${listboxId}-option-${index}`}
                    type="button"
                    role="option"
                    aria-selected={index === activeIndex}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => pick(drug)}
                    className={cn(
                      "aee-drug-search-option",
                      index === activeIndex && "aee-drug-search-option--active"
                    )}
                  >
                    <div className="min-w-0 flex-1 text-left">
                      <div className="flex items-baseline gap-2">
                        <span className="aee-drug-search-generic">{drug.generic}</span>
                        <span className="aee-drug-search-rank">#{drug.rank}</span>
                      </div>
                      <p className="aee-drug-search-brand">{drug.brand}</p>
                    </div>
                    <span className="aee-drug-search-class">
                      <span
                        className="aee-drug-search-class-dot"
                        style={{ backgroundColor: drug.drugClassColor }}
                        aria-hidden
                      />
                      {drug.drugClassLabel}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
