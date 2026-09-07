"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Highlighter,
  NotebookPen,
  PanelRightClose,
  PanelRightOpen,
  Printer,
  Search,
  Type,
} from "lucide-react";
import {
  fetchChapter,
  getCachedChapter,
  prefetchChapter,
  seedChapterCache,
} from "@/lib/nclex-study-guide/client-cache";
import type {
  SgChapterDto,
  SgHighlightColor,
  SgReaderPrefs,
  SgTocChapter,
} from "@/lib/nclex-study-guide/types";
import { SG_HIGHLIGHT_COLORS } from "@/lib/nclex-study-guide/types";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import "./study-guide-reader.css";

type HighlightRow = {
  id: string;
  startOffset: number;
  endOffset: number;
  selectedText: string;
  color: string;
};

type BookmarkRow = {
  id: string;
  anchorId: string;
  label: string;
  scrollPct: number;
};

type NoteRow = {
  id: string;
  highlightId: string | null;
  body: string;
};

const COLOR_SWATCH: Record<SgHighlightColor, string> = {
  yellow: "#f5e6a3",
  teal: "#9fe8df",
  gold: "#e8c878",
  rose: "#f0c4ce",
  lavender: "#d4c8f0",
};

const DRAWER_KEY = "sg-drawer-open";
const PROGRESS_FLUSH_MS = 2000;

type Props = {
  guideId: string;
  guideTitle: string;
  chapters: SgTocChapter[];
  chapter: SgChapterDto;
};

function bindImageErrors(node: HTMLElement | null) {
  if (!node) return;
  node.querySelectorAll("img").forEach((img) => {
    if (img.dataset.sgBound) return;
    img.dataset.sgBound = "1";
    img.addEventListener("error", () => {
      const note = document.createElement("p");
      note.className = "sg-img-missing";
      note.textContent = `Figure unavailable: ${img.getAttribute("alt") || img.getAttribute("src") || "image"}`;
      img.replaceWith(note);
    });
  });
}

export function StudyGuideReader({
  guideId,
  guideTitle,
  chapters,
  chapter: initialChapter,
}: Props) {
  const reduceMotion = useReducedMotion();
  const paperRef = useRef<HTMLElement>(null);
  const tocActiveRef = useRef<HTMLButtonElement | null>(null);
  const scrollPctRef = useRef(0);
  const navLockRef = useRef(false);
  const chapterRef = useRef(initialChapter);

  const [chapter, setChapter] = useState(initialChapter);
  chapterRef.current = chapter;
  const [navPending, setNavPending] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<"highlights" | "bookmarks" | "notes">("highlights");
  const [prefs, setPrefs] = useState<SgReaderPrefs>({
    fontSize: "md",
    lineHeight: "relaxed",
    theme: "paper",
  });
  const [search, setSearch] = useState("");
  const [highlights, setHighlights] = useState<HighlightRow[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkRow[]>([]);
  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [pendingColor, setPendingColor] = useState<SgHighlightColor>("yellow");
  const [selectionInfo, setSelectionInfo] = useState<{
    text: string;
    start: number;
    end: number;
  } | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [authHint, setAuthHint] = useState<string | null>(null);
  const [scrollPct, setScrollPct] = useState(0);

  // Drawer collapsed by default; remember preference. Prefer closed on smaller screens.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAWER_KEY);
      if (raw === "1") setDrawerOpen(true);
      else setDrawerOpen(false);
    } catch {
      setDrawerOpen(false);
    }
  }, []);

  // Sync if the server page remounts with a different slug (rare).
  useEffect(() => {
    seedChapterCache(initialChapter);
    if (initialChapter.slug !== chapterRef.current.slug) {
      setChapter(initialChapter);
      setSearch("");
      setSelectionInfo(null);
      setScrollPct(0);
      scrollPctRef.current = 0;
    }
  }, [initialChapter]);
  const persistDrawer = useEffectEvent((open: boolean) => {
    try {
      localStorage.setItem(DRAWER_KEY, open ? "1" : "0");
    } catch {
      /* ignore */
    }
  });

  const toggleDrawer = useCallback((open: boolean) => {
    setDrawerOpen(open);
    persistDrawer(open);
  }, [persistDrawer]);

  const loadAnnotations = useCallback(async (chapterId: string) => {
    const qs = `chapterId=${encodeURIComponent(chapterId)}`;
    const [h, b, n] = await Promise.all([
      fetch(`/api/nclex-study-guide/highlights?${qs}`).then((r) => r.json()),
      fetch(`/api/nclex-study-guide/bookmarks?${qs}`).then((r) => r.json()),
      fetch(`/api/nclex-study-guide/notes?${qs}`).then((r) => r.json()),
    ]);
    setHighlights(h.highlights ?? []);
    setBookmarks(b.bookmarks ?? []);
    setNotes(n.notes ?? []);
  }, []);

  useEffect(() => {
    void loadAnnotations(chapter.id);
  }, [chapter.id, loadAnnotations]);

  const restoreScroll = useEffectEvent(async (ch: SgChapterDto) => {
    const applyPct = (pct: number) => {
      const el = paperRef.current;
      if (!el) return;
      const max = el.scrollHeight - el.clientHeight;
      if (max > 0 && pct > 0) {
        el.scrollTop = (pct / 100) * max;
        scrollPctRef.current = pct;
        setScrollPct(pct);
      } else {
        el.scrollTop = 0;
        scrollPctRef.current = 0;
        setScrollPct(0);
      }
    };

    // Wait for content paint before measuring scroll height.
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });

    const localKey = `sg-progress:${guideId}:${ch.id}`;
    try {
      const res = await fetch(
        `/api/nclex-study-guide/progress?guideId=${encodeURIComponent(guideId)}`
      );
      const data = await res.json();
      if (data?.progress?.chapterId === ch.id && typeof data.progress.scrollPct === "number") {
        applyPct(data.progress.scrollPct);
        return;
      }
    } catch {
      /* fall through */
    }
    try {
      const raw = localStorage.getItem(localKey);
      applyPct(raw ? Number(raw) || 0 : 0);
    } catch {
      applyPct(0);
    }
  });

  useEffect(() => {
    void restoreScroll(chapter);
  }, [chapter.id, restoreScroll]);

  const flushProgress = useEffectEvent(() => {
    const pct = scrollPctRef.current;
    const chapterId = chapterRef.current.id;
    try {
      localStorage.setItem(`sg-progress:${guideId}:${chapterId}`, String(pct));
    } catch {
      /* ignore */
    }
    void fetch("/api/nclex-study-guide/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guideId,
        chapterId,
        scrollPct: pct,
      }),
    }).then((res) => {
      if (res.status === 401) {
        /* anonymous — local only */
      }
    });
  });
  useEffect(() => {
    const el = paperRef.current;
    if (!el) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const max = el.scrollHeight - el.clientHeight;
        const pct = max > 0 ? (el.scrollTop / max) * 100 : 0;
        scrollPctRef.current = pct;
        setScrollPct(pct);
        try {
          localStorage.setItem(`sg-progress:${guideId}:${chapter.id}`, String(pct));
        } catch {
          /* ignore */
        }
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [chapter.id, guideId]);

  useEffect(() => {
    const t = window.setTimeout(() => flushProgress(), PROGRESS_FLUSH_MS);
    return () => window.clearTimeout(t);
  }, [scrollPct, chapter.id, flushProgress]);

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") flushProgress();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", flushProgress);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", flushProgress);
    };
  }, [flushProgress]);

  // Prefetch neighbors whenever chapter changes.
  useEffect(() => {
    prefetchChapter(chapter.prevSlug);
    prefetchChapter(chapter.nextSlug);
  }, [chapter.nextSlug, chapter.prevSlug]);

  useEffect(() => {
    tocActiveRef.current?.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
  }, [chapter.slug, reduceMotion]);

  const goToSlug = useCallback(
    async (slug: string, { historyMode = "push" }: { historyMode?: "push" | "replace" | "none" } = {}) => {
      if (!slug || slug === chapterRef.current.slug || navLockRef.current) return;
      navLockRef.current = true;
      setNavPending(true);
      flushProgress();
      try {
        const next = getCachedChapter(slug) ?? (await fetchChapter(slug));
        startTransition(() => {
          setChapter(next);
          setSearch("");
          setSelectionInfo(null);
          setNoteDraft("");
          setScrollPct(0);
          scrollPctRef.current = 0;
        });
        const url = `${ROUTES.nclexStudyGuide}/${slug}`;
        if (historyMode === "push") {
          window.history.pushState({ sgChapter: slug }, "", url);
        } else if (historyMode === "replace") {
          window.history.replaceState({ sgChapter: slug }, "", url);
        }
        document.title = `${next.title} — NCLEX Study Guide`;
        prefetchChapter(next.prevSlug);
        prefetchChapter(next.nextSlug);
      } catch {
        setAuthHint("Could not load that chapter. Try again.");
      } finally {
        navLockRef.current = false;
        setNavPending(false);
      }
    },
    [flushProgress]
  );

  // Browser back/forward within the reader shell.
  useEffect(() => {
    const onPop = () => {
      const parts = window.location.pathname.split("/").filter(Boolean);
      const slug = parts[parts.length - 1];
      if (!slug || slug === "study-guide") return;
      void goToSlug(slug, { historyMode: "none" });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [goToSlug]);

  const filteredHtml = useMemo(() => {
    if (!search.trim()) return chapter.bodyHtml;
    const q = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    try {
      return chapter.bodyHtml.replace(
        new RegExp(`(${q})`, "gi"),
        '<mark class="sg-search-hit">$1</mark>'
      );
    } catch {
      return chapter.bodyHtml;
    }
  }, [chapter.bodyHtml, search]);

  // Re-bind broken-image fallbacks after chapter HTML swaps.
  useEffect(() => {
    bindImageErrors(paperRef.current);
  }, [chapter.id, filteredHtml]);

  const captureSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !paperRef.current) {
      setSelectionInfo(null);
      return;
    }
    const text = sel.toString().trim();
    if (!text) {
      setSelectionInfo(null);
      return;
    }
    const plain = paperRef.current.innerText || "";
    const start = plain.indexOf(text);
    const end = start >= 0 ? start + text.length : text.length;
    setSelectionInfo({ text, start: Math.max(0, start), end });
  }, []);

  const saveHighlight = useCallback(
    async (color: SgHighlightColor = pendingColor) => {
      if (!selectionInfo) return;
      const res = await fetch("/api/nclex-study-guide/highlights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterId: chapter.id,
          startOffset: selectionInfo.start,
          endOffset: selectionInfo.end,
          selectedText: selectionInfo.text,
          color,
        }),
      });
      if (res.status === 401) {
        setAuthHint("Sign in to save highlights.");
        return;
      }
      if (res.ok) {
        setSelectionInfo(null);
        window.getSelection()?.removeAllRanges();
        await loadAnnotations(chapter.id);
        setDrawerTab("highlights");
        toggleDrawer(true);
      }
    },
    [chapter.id, loadAnnotations, pendingColor, selectionInfo, toggleDrawer]
  );

  const saveBookmark = useCallback(async () => {
    const heading =
      paperRef.current?.querySelector("h1[id], h2[id], h3[id], h4[id]")?.id ||
      `scroll-${Math.round(scrollPctRef.current)}`;
    const label =
      paperRef.current?.querySelector("h1, h2, h3, h4")?.textContent?.trim() ||
      chapter.title;
    const res = await fetch("/api/nclex-study-guide/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chapterId: chapter.id,
        anchorId: heading,
        label,
        scrollPct: scrollPctRef.current,
      }),
    });
    if (res.status === 401) {
      setAuthHint("Sign in to save bookmarks.");
      return;
    }
    if (res.ok) {
      await loadAnnotations(chapter.id);
      setDrawerTab("bookmarks");
      toggleDrawer(true);
    }
  }, [chapter.id, chapter.title, loadAnnotations, toggleDrawer]);

  const saveNote = useCallback(async () => {
    if (!noteDraft.trim()) return;
    const res = await fetch("/api/nclex-study-guide/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chapterId: chapter.id,
        highlightId: null,
        body: noteDraft.trim(),
      }),
    });
    if (res.status === 401) {
      setAuthHint("Sign in to save notes.");
      return;
    }
    if (res.ok) {
      setNoteDraft("");
      await loadAnnotations(chapter.id);
      setDrawerTab("notes");
      toggleDrawer(true);
    }
  }, [chapter.id, loadAnnotations, noteDraft, toggleDrawer]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const ch = chapterRef.current;
      if (e.key === "j" && ch.nextSlug) {
        e.preventDefault();
        void goToSlug(ch.nextSlug);
      }
      if (e.key === "k" && ch.prevSlug) {
        e.preventDefault();
        void goToSlug(ch.prevSlug);
      }
      if (e.key === "b") void saveBookmark();
      if (e.key === "h") {
        captureSelection();
        void saveHighlight();
      }
      if (e.key === "]" || e.key === "\\") {
        toggleDrawer(!drawerOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    captureSelection,
    drawerOpen,
    goToSlug,
    saveBookmark,
    saveHighlight,
    toggleDrawer,
  ]);

  const seekToPct = useCallback((pct: number) => {
    const el = paperRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    const clamped = Math.max(0, Math.min(100, pct));
    el.scrollTo({
      top: max > 0 ? (clamped / 100) * max : 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [reduceMotion]);

  const paperTheme =
    prefs.theme === "paper"
      ? "bg-[#f4efe6] text-[#1a2330]"
      : prefs.theme === "dim"
        ? "bg-[#1a2a3a] text-[#e8eef4]"
        : "bg-[#0a121a] text-[#dce6f0]";

  const fontClass =
    prefs.fontSize === "sm"
      ? "text-[15px]"
      : prefs.fontSize === "lg"
        ? "text-[19px]"
        : prefs.fontSize === "xl"
          ? "text-[21px]"
          : "text-[17px]";

  const leadingClass =
    prefs.lineHeight === "snug"
      ? "leading-snug"
      : prefs.lineHeight === "normal"
        ? "leading-normal"
        : "leading-relaxed";

  const chapterMotion = reduceMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
      };

  return (
    <div
      className="sg-reader flex h-[100dvh] flex-col"
      style={{ background: "#0b1c2c", color: "#e8eef4" }}
    >
      <header className="flex shrink-0 items-center gap-3 border-b border-white/10 px-3 py-2 sm:px-4">
        <Link
          href={ROUTES.nclexHub}
          className="text-xs font-semibold text-[#2ec4b6] hover:underline"
        >
          NCLEX hub
        </Link>
        <span className="text-white/30">/</span>
        <p className="min-w-0 flex-1 truncate text-sm font-semibold tracking-tight">
          {guideTitle}
          {navPending ? <span className="ml-2 text-[10px] font-normal text-white/40">…</span> : null}
        </p>
        <div className="hidden items-center gap-1 sm:flex">
          <label className="sr-only" htmlFor="sg-font">
            Font size
          </label>
          <Type className="h-3.5 w-3.5 text-white/50" aria-hidden />
          <select
            id="sg-font"
            className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-xs"
            value={prefs.fontSize}
            onChange={(e) =>
              setPrefs((p) => ({
                ...p,
                fontSize: e.target.value as SgReaderPrefs["fontSize"],
              }))
            }
          >
            <option value="sm">A−</option>
            <option value="md">A</option>
            <option value="lg">A+</option>
            <option value="xl">A++</option>
          </select>
          <select
            className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-xs"
            value={prefs.lineHeight}
            onChange={(e) =>
              setPrefs((p) => ({
                ...p,
                lineHeight: e.target.value as SgReaderPrefs["lineHeight"],
              }))
            }
            aria-label="Line height"
          >
            <option value="snug">Tight</option>
            <option value="normal">Normal</option>
            <option value="relaxed">Relaxed</option>
          </select>
          <select
            className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-xs"
            value={prefs.theme}
            onChange={(e) =>
              setPrefs((p) => ({
                ...p,
                theme: e.target.value as SgReaderPrefs["theme"],
              }))
            }
            aria-label="Reading theme"
          >
            <option value="paper">Paper</option>
            <option value="dim">Dim</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <button
          type="button"
          className="rounded-md border border-white/15 px-2 py-1 text-xs hover:bg-white/5"
          onClick={() => window.print()}
          title="Print / Export PDF of this chapter"
        >
          <Printer className="h-3.5 w-3.5" aria-hidden />
        </button>
        <button
          type="button"
          className="rounded-md border border-white/15 px-2 py-1 text-xs hover:bg-white/5"
          onClick={() => toggleDrawer(!drawerOpen)}
          aria-pressed={drawerOpen}
          aria-label={drawerOpen ? "Close drawer" : "Open drawer"}
        >
          {drawerOpen ? (
            <PanelRightClose className="h-3.5 w-3.5" />
          ) : (
            <PanelRightOpen className="h-3.5 w-3.5" />
          )}
        </button>
      </header>

      <div
        className="h-0.5 w-full bg-white/10"
        role="progressbar"
        aria-valuenow={Math.round(scrollPct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      >
        <div
          className="sg-progress-fill h-full bg-[#2ec4b6]"
          style={{ width: `${scrollPct}%` }}
        />
      </div>

      <div className="flex min-h-0 flex-1">
        {/* LEFT TOC */}
        <aside className="sg-toc hidden w-56 shrink-0 overflow-y-auto border-r border-white/10 p-3 lg:block xl:w-64">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
            Contents
          </p>
          <nav aria-label="Chapter list">
            <ul className="space-y-1">
              {chapters.map((c) => {
                const active = c.slug === chapter.slug;
                const tickPct = active ? scrollPct : 0;
                const bookmarked = active && bookmarks.length > 0;
                return (
                  <li key={c.id}>
                    {c.sectionLabel ? (
                      <p className="mb-0.5 mt-2 text-[10px] font-semibold uppercase tracking-wide text-[#2ec4b6]">
                        {c.sectionLabel}
                      </p>
                    ) : null}
                    <button
                      type="button"
                      ref={active ? tocActiveRef : undefined}
                      onMouseEnter={() => prefetchChapter(c.slug)}
                      onFocus={() => prefetchChapter(c.slug)}
                      onClick={() => void goToSlug(c.slug)}
                      className={cn(
                        "flex w-full items-start gap-1.5 rounded-lg px-2 py-1.5 text-left text-[12px] leading-snug transition-colors duration-150",
                        active
                          ? "bg-[#2ec4b6]/15 font-semibold text-[#2ec4b6]"
                          : "text-white/75 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-200"
                        style={{
                          background:
                            tickPct > 90
                              ? "#2ec4b6"
                              : tickPct > 0
                                ? "rgba(46,196,182,0.45)"
                                : "rgba(255,255,255,0.25)",
                        }}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1">{c.title}</span>
                      {bookmarked ? (
                        <Bookmark className="mt-0.5 h-3 w-3 shrink-0 text-[#2ec4b6]" aria-hidden />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* CENTER paper */}
        <main className="relative flex min-w-0 flex-1 flex-col">
          {/* Edge prev/next */}
          {chapter.prevSlug ? (
            <button
              type="button"
              className="sg-edge-nav sg-edge-nav--prev"
              aria-label="Previous chapter"
              title="Previous (k)"
              onMouseEnter={() => prefetchChapter(chapter.prevSlug)}
              onClick={() => void goToSlug(chapter.prevSlug!)}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          ) : null}
          {chapter.nextSlug ? (
            <button
              type="button"
              className="sg-edge-nav sg-edge-nav--next"
              aria-label="Next chapter"
              title="Next (j)"
              onMouseEnter={() => prefetchChapter(chapter.nextSlug)}
              onClick={() => void goToSlug(chapter.nextSlug!)}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          ) : null}

          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2 sm:px-4">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search this chapter…"
                className="w-full rounded-lg border border-white/15 bg-white/5 py-1.5 pl-8 pr-3 text-xs outline-none placeholder:text-white/35 focus:border-[#2ec4b6]/50"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                captureSelection();
                void saveHighlight();
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-2 py-1.5 text-xs transition-colors hover:bg-white/5"
              title="Highlight selection (h)"
            >
              <Highlighter className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Highlight</span>
            </button>
            <button
              type="button"
              onClick={() => void saveBookmark()}
              className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-2 py-1.5 text-xs transition-colors hover:bg-white/5"
              title="Bookmark (b)"
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Bookmark</span>
            </button>
          </div>

          {selectionInfo ? (
            <div className="flex flex-wrap items-center gap-2 border-b border-white/10 bg-black/20 px-3 py-2 text-xs">
              <span className="text-white/60">Highlight color:</span>
              {SG_HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={cn(
                    "h-5 w-5 rounded-full border-2 transition-transform",
                    pendingColor === c ? "scale-110 border-white" : "border-transparent"
                  )}
                  style={{ background: COLOR_SWATCH[c] }}
                  aria-label={c}
                  onClick={() => {
                    setPendingColor(c);
                    void saveHighlight(c);
                  }}
                />
              ))}
              <span className="truncate text-white/50">“{selectionInfo.text.slice(0, 48)}”</span>
            </div>
          ) : null}

          {authHint ? (
            <p className="border-b border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs text-amber-100">
              {authHint}{" "}
              <Link href={ROUTES.auth.login} className="underline">
                Sign in
              </Link>
            </p>
          ) : null}

          <div className="relative mx-auto min-h-0 w-full max-w-3xl flex-1 sm:my-4">
            <article
              ref={paperRef}
              onMouseUp={captureSelection}
              className={cn(
                "sg-paper h-full overflow-y-auto px-5 py-8 shadow-2xl sm:rounded-2xl sm:px-10",
                paperTheme,
                fontClass,
                leadingClass
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={chapter.id}
                  {...chapterMotion}
                  transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] opacity-60">
                    {chapter.sectionLabel || "Chapter"}
                  </p>
                  <div
                    className="sg-prose"
                    dangerouslySetInnerHTML={{ __html: filteredHtml }}
                  />
                </motion.div>
              </AnimatePresence>
            </article>

            {/* Edge scrubber */}
            <div className="sg-scrubber" aria-hidden={false}>
              <input
                type="range"
                min={0}
                max={100}
                step={0.5}
                value={scrollPct}
                aria-label="Seek in chapter"
                onChange={(e) => seekToPct(Number(e.target.value))}
              />
            </div>
          </div>

          <nav
            className="flex shrink-0 items-center justify-between gap-3 border-t border-white/10 px-3 py-3 sm:px-4"
            aria-label="Chapter navigation"
          >
            {chapter.prevSlug ? (
              <button
                type="button"
                onMouseEnter={() => prefetchChapter(chapter.prevSlug)}
                onClick={() => void goToSlug(chapter.prevSlug!)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2ec4b6] transition-opacity hover:opacity-80"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
            ) : (
              <span />
            )}
            <span className="text-[11px] text-white/40">j / k · b bookmark · h highlight</span>
            {chapter.nextSlug ? (
              <button
                type="button"
                onMouseEnter={() => prefetchChapter(chapter.nextSlug)}
                onClick={() => void goToSlug(chapter.nextSlug!)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2ec4b6] transition-opacity hover:opacity-80"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <span />
            )}
          </nav>
        </main>

        {/* RIGHT drawer */}
        <AnimatePresence initial={false}>
          {drawerOpen ? (
            <motion.aside
              key="drawer"
              initial={reduceMotion ? false : { width: 0, opacity: 0 }}
              animate={{ width: 288, opacity: 1 }}
              exit={reduceMotion ? undefined : { width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 36, mass: 0.8 }}
              className="flex shrink-0 flex-col overflow-hidden border-l border-white/10 bg-[#091620]"
            >
              <div className="flex w-72 flex-1 flex-col">
                <div className="flex border-b border-white/10 text-xs">
                  {(
                    [
                      ["highlights", "Highlights", Highlighter],
                      ["bookmarks", "Bookmarks", Bookmark],
                      ["notes", "Notes", NotebookPen],
                    ] as const
                  ).map(([id, label, Icon]) => (
                    <button
                      key={id}
                      type="button"
                      className={cn(
                        "flex flex-1 items-center justify-center gap-1 px-2 py-2.5 transition-colors",
                        drawerTab === id
                          ? "border-b-2 border-[#2ec4b6] text-[#2ec4b6]"
                          : "text-white/55 hover:text-white"
                      )}
                      onClick={() => setDrawerTab(id)}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span className="hidden xl:inline">{label}</span>
                    </button>
                  ))}
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-3 text-xs">
                  {drawerTab === "highlights" ? (
                    <ul className="space-y-2">
                      {highlights.length === 0 ? (
                        <li className="text-white/45">No highlights yet. Select text in the chapter.</li>
                      ) : (
                        highlights.map((h) => (
                          <li
                            key={h.id}
                            className="rounded-lg border border-white/10 bg-white/5 p-2"
                            style={{
                              borderLeftColor:
                                COLOR_SWATCH[(h.color as SgHighlightColor) || "yellow"] ||
                                COLOR_SWATCH.yellow,
                              borderLeftWidth: 3,
                            }}
                          >
                            {h.selectedText}
                          </li>
                        ))
                      )}
                    </ul>
                  ) : null}
                  {drawerTab === "bookmarks" ? (
                    <ul className="space-y-2">
                      {bookmarks.length === 0 ? (
                        <li className="text-white/45">No bookmarks yet. Press b to pin.</li>
                      ) : (
                        bookmarks.map((b) => (
                          <li key={b.id}>
                            <button
                              type="button"
                              className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-left transition-colors hover:bg-white/10"
                              onClick={() => {
                                const root = paperRef.current;
                                const target = root?.querySelector(`#${CSS.escape(b.anchorId)}`);
                                if (target) {
                                  target.scrollIntoView({
                                    behavior: reduceMotion ? "auto" : "smooth",
                                    block: "start",
                                  });
                                  return;
                                }
                                seekToPct(b.scrollPct);
                              }}
                            >
                              <p className="font-semibold">{b.label || b.anchorId}</p>
                              <p className="text-white/40">{Math.round(b.scrollPct)}%</p>
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                  ) : null}
                  {drawerTab === "notes" ? (
                    <div className="space-y-3">
                      <textarea
                        value={noteDraft}
                        onChange={(e) => setNoteDraft(e.target.value)}
                        placeholder="Add a note for this chapter…"
                        className="min-h-[80px] w-full rounded-lg border border-white/15 bg-white/5 p-2 text-xs outline-none focus:border-[#2ec4b6]/50"
                      />
                      <button
                        type="button"
                        onClick={() => void saveNote()}
                        className="w-full rounded-lg bg-[#2ec4b6] px-3 py-2 text-xs font-bold text-[#0b1c2c]"
                      >
                        Save note
                      </button>
                      <ul className="space-y-2">
                        {notes.map((n) => (
                          <li
                            key={n.id}
                            className="rounded-lg border border-white/10 bg-white/5 p-2 whitespace-pre-wrap"
                          >
                            {n.body}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
                <p className="border-t border-white/10 px-3 py-2 text-[10px] text-white/35">
                  Full-book PDF export — stubbed. Chapter print uses the browser print dialog.
                </p>
              </div>
            </motion.aside>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
