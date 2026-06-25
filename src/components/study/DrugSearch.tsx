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
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { searchDrugs, type DrugSearchHit } from "@/lib/drugs300/search";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useFloatingPosition } from "@/hooks/useFloatingPosition";
import { useFdaDrugSearchIndex } from "@/hooks/useFdaDrugSearchIndex";

type DrugSearchProps = {
  onSelect?: (drug: DrugSearchHit) => void;
  linkToStudy?: boolean;
  className?: string;
  maxResults?: number;
  /** Render dropdown in a portal (recommended on landing sections with overflow clipping). */
  portaled?: boolean;
};

export function DrugSearch({
  onSelect,
  linkToStudy = false,
  className,
  maxResults = 8,
  portaled = true,
}: DrugSearchProps) {
  const router = useRouter();
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const { index: fdaIndex } = useFdaDrugSearchIndex();

  const deferredQuery = useDeferredValue(query);
  const results = useMemo(
    () => searchDrugs(deferredQuery, fdaIndex, maxResults),
    [deferredQuery, fdaIndex, maxResults]
  );

  const showDropdown = open && query.trim().length > 0;
  const floatingStyle = useFloatingPosition(containerRef, showDropdown && portaled);

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  useClickOutside(
    portaled ? [containerRef, dropdownRef] : containerRef,
    close,
    open
  );

  const pick = useCallback(
    (drug: DrugSearchHit) => {
      setQuery(drug.generic);
      close();
      onSelect?.(drug);
      if (linkToStudy) {
        router.push(`/study/drugs300?drug=${encodeURIComponent(drug.id)}`);
      }
    },
    [close, linkToStudy, onSelect, router]
  );

  const clear = useCallback(() => {
    setQuery("");
    close();
    inputRef.current?.focus();
  }, [close]);

  useEffect(() => {
    if (!showDropdown) setActiveIndex(-1);
    else if (results.length > 0 && activeIndex >= results.length) {
      setActiveIndex(results.length - 1);
    }
  }, [activeIndex, results.length, showDropdown]);

  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const option = listRef.current.querySelector<HTMLElement>(
      `[data-drug-option="${activeIndex}"]`
    );
    option?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

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
        close();
        break;
      case "Tab":
        close();
        break;
    }
  }

  const dropdownContent = (
    <AnimatePresence>
      {showDropdown && (
        <motion.div
          ref={dropdownRef}
          className={cn(
            "aee-drug-search-dropdown",
            portaled && "aee-drug-search-dropdown--portaled"
          )}
          style={portaled ? floatingStyle ?? undefined : undefined}
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.16, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {results.length === 0 ? (
            <p className="aee-drug-search-empty">No drugs match &ldquo;{query.trim()}&rdquo;</p>
          ) : (
            <ul id={listboxId} ref={listRef} role="listbox" className="aee-drug-search-list">
              {results.map((drug, index) => (
                <li key={drug.id} role="presentation">
                  <button
                    id={`${listboxId}-option-${index}`}
                    type="button"
                    role="option"
                    data-drug-option={index}
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
                        {drug.tier === "curated" && drug.rank != null ? (
                          <span className="aee-drug-search-rank">#{drug.rank}</span>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-slate-500">
                            FDA ref
                          </span>
                        )}
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
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div ref={containerRef} className={cn("aee-drug-search", className)}>
      <div className="aee-drug-search-field">
        <Search className="aee-drug-search-icon" aria-hidden />
        <input
          ref={inputRef}
          type="text"
          inputMode="search"
          enterKeyHint="search"
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

      {portaled && typeof document !== "undefined"
        ? createPortal(dropdownContent, document.body)
        : dropdownContent}
    </div>
  );
}
