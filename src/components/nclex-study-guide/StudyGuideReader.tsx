"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useInsertionEffect,
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
  List,
  NotebookPen,
  PanelRightClose,
  PanelRightOpen,
  Printer,
  Search,
} from "lucide-react";
import {
  ChapterLoadError,
  fetchChapter,
  getCachedChapter,
  prefetchChapter,
  seedChapterCache,
} from "@/lib/nclex-study-guide/client-cache";
import { STUDY_GUIDES, type StudyGuideExam } from "@/lib/nclex-study-guide/guide-registry";
import { visibleBookSection } from "@/lib/nclex-study-guide/display-label";
import { paintStudyGuideHighlights } from "@/lib/nclex-study-guide/paint-highlights";
import type {
  SgChapterDto,
  SgHighlightColor,
  SgReaderPrefs,
  SgTocChapter,
} from "@/lib/nclex-study-guide/types";
import { SG_HIGHLIGHT_COLORS } from "@/lib/nclex-study-guide/types";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { studyGuideTrialLine } from "@/lib/marketing/study-guide-offer";
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
const PREFS_KEY = "sg-reader-prefs";
const DEFAULT_PREFS: SgReaderPrefs = {
  fontSize: "md",
  lineHeight: "relaxed",
  theme: "paper",
};

function readStoredPrefs(): SgReaderPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<SgReaderPrefs>;
    const fontSize = ["sm", "md", "lg", "xl"].includes(parsed.fontSize ?? "")
      ? parsed.fontSize!
      : DEFAULT_PREFS.fontSize;
    const lineHeight = ["snug", "normal", "relaxed"].includes(parsed.lineHeight ?? "")
      ? parsed.lineHeight!
      : DEFAULT_PREFS.lineHeight;
    const theme = ["paper", "dim", "dark"].includes(parsed.theme ?? "")
      ? parsed.theme!
      : DEFAULT_PREFS.theme;
    return { fontSize, lineHeight, theme };
  } catch {
    return DEFAULT_PREFS;
  }
}

type TextSelection = { text: string; start: number; end: number };

function readPaperSelection(root: HTMLElement | null): TextSelection | null {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || !root || !sel.anchorNode || !root.contains(sel.anchorNode)) {
    return null;
  }
  const text = sel.toString().replace(/\s+/g, " ").trim();
  if (!text) return null;
  const plain = root.innerText || "";
  const start = plain.indexOf(text);
  const end = start >= 0 ? start + text.length : text.length;
  return { text, start: Math.max(0, start), end };
}
const PROGRESS_FLUSH_MS = 2000;
/** Throttle for the synchronous localStorage progress write during scroll. */
const PROGRESS_LOCAL_MS = 1000;

/** Tailwind `lg`. Below this the drawer overlays the page instead of splitting the row. */
const DESKTOP_QUERY = "(min-width: 1024px)";

function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return isDesktop;
}

/**
 * Callback with a stable identity that always sees the latest render's values.
 *
 * Stands in for React's `useEffectEvent`, which needs React >= 19.2 while this
 * package allows ^19.0.0, and which may only be called from inside effects —
 * these callbacks also run from event handlers.
 */
function useStableCallback<A extends unknown[], R>(fn: (...args: A) => R) {
  const ref = useRef(fn);
  // Insertion effects run before layout and passive effects, so the ref is
  // already current by the time any effect calls through it.
  useInsertionEffect(() => {
    ref.current = fn;
  }, [fn]);
  return useCallback((...args: A) => ref.current(...args), []);
}

type Props = {
  exam: StudyGuideExam;
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

function ReaderSeg({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("sg-seg", className)} role="group" aria-label={label}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          aria-pressed={value === opt.value}
          className={cn("sg-seg__btn", value === opt.value && "is-on")}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function StudyGuideReader({
  exam,
  guideId,
  guideTitle,
  chapters,
  chapter: initialChapter,
}: Props) {
  const config = STUDY_GUIDES[exam];
  const reduceMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  const paperRef = useRef<HTMLElement>(null);
  /** Vertical scrollport for the chapter column — not the paper card. */
  const scrollRef = useRef<HTMLDivElement>(null);
  const appearanceRef = useRef<HTMLDivElement>(null);
  const tocActiveRef = useRef<HTMLButtonElement | null>(null);
  const scrollPctRef = useRef(0);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const scrubberRef = useRef<HTMLInputElement>(null);
  const scrubbingRef = useRef(false);
  const localWriteAtRef = useRef(0);
  const flushTimerRef = useRef<number | null>(null);
  const navLockRef = useRef(false);
  const chapterRef = useRef(initialChapter);

  const [chapter, setChapter] = useState(initialChapter);
  chapterRef.current = chapter;
  const [navPending, setNavPending] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<"highlights" | "bookmarks" | "notes">("highlights");
  const [prefs, setPrefs] = useState<SgReaderPrefs>(DEFAULT_PREFS);
  const [prefsReady, setPrefsReady] = useState(false);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [authAction, setAuthAction] = useState<"gate" | null>(null);
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
  // The reading position is painted straight to the DOM (see `paintProgress`).
  // React only tracks the coarse tier the TOC dot needs, so scrolling no longer
  // re-renders the chapter, the 17-item TOC, and the drawer on every frame.
  const [progressTier, setProgressTier] = useState(0);

  // Drawer collapsed by default; remember preference. The saved preference is
  // desktop-only — restoring it under `lg` would leave a phone showing a 288px
  // panel beside a sliver of text.
  useEffect(() => {
    setPrefs(readStoredPrefs());
    setPrefsReady(true);
  }, []);

  useEffect(() => {
    if (!appearanceOpen) return;
    const onPointer = (event: PointerEvent) => {
      if (!appearanceRef.current?.contains(event.target as Node)) setAppearanceOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAppearanceOpen(false);
    };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [appearanceOpen]);

  useEffect(() => {
    if (!prefsReady) return;
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {
      /* ignore */
    }
  }, [prefs, prefsReady]);

  useEffect(() => {
    if (!isDesktop) {
      setDrawerOpen(false);
      return;
    }
    try {
      setDrawerOpen(localStorage.getItem(DRAWER_KEY) === "1");
    } catch {
      setDrawerOpen(false);
    }
  }, [isDesktop]);

  /**
   * Write the reading position to the DOM directly, bypassing React.
   *
   * Must stay declared above its first use: the effects below name it in their
   * dependency arrays, which are evaluated during render, so a later `const`
   * would be in the temporal dead zone and throw on every render.
   */
  const paintProgress = useStableCallback((pct: number) => {
    scrollPctRef.current = pct;
    if (progressFillRef.current) progressFillRef.current.style.width = `${pct}%`;
    progressBarRef.current?.setAttribute("aria-valuenow", String(Math.round(pct)));
    // Don't overwrite the scrubber while the user is dragging it.
    if (scrubberRef.current && !scrubbingRef.current) {
      scrubberRef.current.value = String(pct);
    }
    const tier = pct > 90 ? 2 : pct > 0 ? 1 : 0;
    // Returning the same value makes React bail out without re-rendering.
    setProgressTier((prev) => (prev === tier ? prev : tier));
  });

  // Sync if the server page remounts with a different slug (rare).
  useEffect(() => {
    seedChapterCache(exam, initialChapter);
    if (initialChapter.slug !== chapterRef.current.slug) {
      setChapter(initialChapter);
      setSearch("");
      setSelectionInfo(null);
      paintProgress(0);
    }
  }, [initialChapter, paintProgress]);
  const persistDrawer = useStableCallback((open: boolean) => {
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
    const [hRes, bRes, nRes] = await Promise.all([
      fetch(`/api/nclex-study-guide/highlights?${qs}`),
      fetch(`/api/nclex-study-guide/bookmarks?${qs}`),
      fetch(`/api/nclex-study-guide/notes?${qs}`),
    ]);
    // Keep the marks already on screen if a refresh fails. Entitled readers
    // should not flash an empty drawer or a sign-in error for a blip.
    if (hRes.ok) {
      const h = (await hRes.json()) as { highlights?: HighlightRow[] };
      setHighlights(h.highlights ?? []);
    }
    if (bRes.ok) {
      const b = (await bRes.json()) as { bookmarks?: BookmarkRow[] };
      setBookmarks(b.bookmarks ?? []);
    }
    if (nRes.ok) {
      const n = (await nRes.json()) as { notes?: NoteRow[] };
      setNotes(n.notes ?? []);
    }
  }, []);

  useEffect(() => {
    void loadAnnotations(chapter.id);
  }, [chapter.id, loadAnnotations]);

  const restoreScroll = useStableCallback(async (ch: SgChapterDto) => {
    const applyPct = (pct: number) => {
      const el = scrollRef.current;
      if (!el) return;
      const max = el.scrollHeight - el.clientHeight;
      if (max > 0 && pct > 0) {
        el.scrollTop = (pct / 100) * max;
        paintProgress(pct);
      } else {
        el.scrollTop = 0;
        paintProgress(0);
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

  const flushProgress = useStableCallback(() => {
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
    const el = scrollRef.current;
    if (!el) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const max = el.scrollHeight - el.clientHeight;
        const pct = max > 0 ? (el.scrollTop / max) * 100 : 0;
        paintProgress(pct);

        // localStorage.setItem is synchronous — running it on every frame
        // stalls the main thread and shows up as scroll stutter.
        const now = Date.now();
        if (now - localWriteAtRef.current < PROGRESS_LOCAL_MS) return;
        localWriteAtRef.current = now;
        try {
          localStorage.setItem(`sg-progress:${guideId}:${chapter.id}`, String(pct));
        } catch {
          /* ignore */
        }
        if (flushTimerRef.current != null) window.clearTimeout(flushTimerRef.current);
        flushTimerRef.current = window.setTimeout(() => {
          flushTimerRef.current = null;
          flushProgress();
        }, PROGRESS_FLUSH_MS);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [chapter.id, guideId, paintProgress, flushProgress]);

  useEffect(
    () => () => {
      if (flushTimerRef.current != null) window.clearTimeout(flushTimerRef.current);
    },
    []
  );

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
    prefetchChapter(exam, chapter.prevSlug);
    prefetchChapter(exam, chapter.nextSlug);
  }, [chapter.nextSlug, chapter.prevSlug]);

  useEffect(() => {
    tocActiveRef.current?.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
  }, [chapter.slug, reduceMotion]);

  const goToSlug = useCallback(
    async (slug: string, { historyMode = "push" }: { historyMode?: "push" | "replace" | "none" } = {}) => {
      if (!slug || slug === chapterRef.current.slug || navLockRef.current) return;
      navLockRef.current = true;
      setNavPending(true);
      setAuthHint(null);
      setAuthAction(null);
      flushProgress();
      try {
        const next = getCachedChapter(exam, slug) ?? (await fetchChapter(exam, slug));
        startTransition(() => {
          setChapter(next);
          setSearch("");
          setSelectionInfo(null);
          setNoteDraft("");
          paintProgress(0);
        });
        const url = `${config.routeBase}/${slug}`;
        if (historyMode === "push") {
          window.history.pushState({ sgChapter: slug }, "", url);
        } else if (historyMode === "replace") {
          window.history.replaceState({ sgChapter: slug }, "", url);
        }
        document.title = `${next.title} — ${guideTitle}`;
        prefetchChapter(exam, next.prevSlug);
        prefetchChapter(exam, next.nextSlug);
      } catch (err) {
        const status = err instanceof ChapterLoadError ? err.status : 0;
        if (status === 401 || status === 403) {
          setAuthAction("gate");
          setAuthHint(
            `This reference book is included with the trial or Pro plan. ${studyGuideTrialLine()}`
          );
        } else {
          setAuthAction(null);
          setAuthHint("Could not load that chapter. Try again.");
        }
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

  useEffect(() => {
    const root = paperRef.current;
    if (!root) return;
    paintStudyGuideHighlights(root, highlights);
  }, [chapter.id, filteredHtml, highlights]);

  const captureSelection = useCallback(() => {
    const info = readPaperSelection(paperRef.current);
    setSelectionInfo(info);
    return info;
  }, []);

  const noteSaveFailure = useCallback((res: Response, noun: string) => {
    if (res.status === 401 || res.status === 403) {
      setAuthAction("gate");
      setAuthHint(
        `${studyGuideTrialLine()} Saving ${noun}s needs a trial or Pro plan.`
      );
      return;
    }
    setAuthAction(null);
    setAuthHint(`Could not save that ${noun}. Try again.`);
  }, []);

  const saveHighlight = useCallback(
    async (color: SgHighlightColor = pendingColor, info?: TextSelection | null) => {
      const target = info ?? selectionInfo;
      if (!target) {
        setAuthAction(null);
        setAuthHint("Select a passage in the chapter, then highlight it.");
        return;
      }
      const res = await fetch("/api/nclex-study-guide/highlights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterId: chapter.id,
          startOffset: target.start,
          endOffset: target.end,
          selectedText: target.text,
          color,
        }),
      });
      if (!res.ok) {
        noteSaveFailure(res, "highlight");
        return;
      }
      setAuthHint(null);
      setAuthAction(null);
      setSelectionInfo(null);
      window.getSelection()?.removeAllRanges();
      await loadAnnotations(chapter.id);
      setDrawerTab("highlights");
      toggleDrawer(true);
    },
    [chapter.id, loadAnnotations, noteSaveFailure, pendingColor, selectionInfo, toggleDrawer]
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
    if (!res.ok) {
      noteSaveFailure(res, "bookmark");
      return;
    }
    setAuthHint(null);
    setAuthAction(null);
    await loadAnnotations(chapter.id);
    setDrawerTab("bookmarks");
    toggleDrawer(true);
  }, [chapter.id, chapter.title, loadAnnotations, noteSaveFailure, toggleDrawer]);

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
    if (!res.ok) {
      noteSaveFailure(res, "note");
      return;
    }
    setAuthHint(null);
    setAuthAction(null);
    setNoteDraft("");
    await loadAnnotations(chapter.id);
    setDrawerTab("notes");
    toggleDrawer(true);
  }, [chapter.id, loadAnnotations, noteDraft, noteSaveFailure, toggleDrawer]);

  const removeAnnotation = useCallback(
    async (kind: "highlights" | "bookmarks" | "notes", id: string) => {
      const res = await fetch(
        `/api/nclex-study-guide/${kind}?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        noteSaveFailure(res, kind === "highlights" ? "highlight" : kind === "bookmarks" ? "bookmark" : "note");
        return;
      }
      await loadAnnotations(chapter.id);
    },
    [chapter.id, loadAnnotations, noteSaveFailure]
  );

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
        const info = captureSelection();
        void saveHighlight(pendingColor, info);
      }
      if (e.key === "]" || e.key === "\\") {
        toggleDrawer(!drawerOpen);
      }
      if (e.key === "Escape") {
        setTocOpen(false);
        if (drawerOpen) toggleDrawer(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    captureSelection,
    drawerOpen,
    goToSlug,
    pendingColor,
    saveBookmark,
    saveHighlight,
    toggleDrawer,
  ]);

  const seekToPct = useCallback((pct: number) => {
    const el = scrollRef.current;
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
      ? "text-[17px]"
      : prefs.fontSize === "lg"
        ? "text-[22px]"
        : prefs.fontSize === "xl"
          ? "text-[25px]"
          : "text-[20px]";

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

  let lastSection = "";
  const tocContent = (
    <>
      <p className="mb-4 text-[12px] font-semibold tracking-[-0.01em] text-white/45">
        Contents
      </p>
      <nav aria-label="Chapter list">
        <ul className="space-y-1">
          {chapters.map((c) => {
            const active = c.slug === chapter.slug;
            const tier = active ? progressTier : 0;
            const bookmarked = active && bookmarks.length > 0;
            const section = visibleBookSection(c.sectionLabel);
            const showSection = Boolean(section) && section !== lastSection;
            lastSection = section ?? "";
            return (
              <li key={c.id}>
                {showSection ? (
                  <p className="mb-1 mt-5 px-3 text-[12px] font-medium tracking-[-0.01em] text-white/40 first:mt-0">
                    {section}
                  </p>
                ) : null}
                <button
                  type="button"
                  ref={active ? tocActiveRef : undefined}
                  aria-current={active ? "page" : undefined}
                  onMouseEnter={() => prefetchChapter(exam, c.slug)}
                  onFocus={() => prefetchChapter(exam, c.slug)}
                  onClick={() => {
                    setTocOpen(false);
                    void goToSlug(c.slug);
                  }}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-2xl px-3 py-3.5 text-left text-[16px] leading-snug tracking-[-0.015em] transition-colors duration-150 lg:py-2.5 lg:text-[14.5px]",
                    active
                      ? "bg-[#2ec4b6]/15 font-semibold text-[#2ec4b6]"
                      : "text-white/75 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-200"
                    style={{
                      background:
                        tier === 2
                          ? "#2ec4b6"
                          : tier === 1
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
    </>
  );

  return (
    <div
      className="sg-reader flex h-[calc(100dvh-var(--nav-height))] flex-col"
      style={{ background: "#0b1c2c", color: "#e8eef4" }}
    >
      <header className="flex shrink-0 items-center gap-2 border-b border-white/10 px-3 py-2 sm:gap-3 sm:px-4">
        <button
          type="button"
          onClick={() => setTocOpen(true)}
          aria-label="Open contents"
          aria-expanded={tocOpen}
          className="sg-icon-btn lg:hidden"
        >
          <List className="h-3.5 w-3.5" aria-hidden />
          {/* Icon-only on the narrowest phones so the header can't overflow. */}
          <span className="hidden min-[400px]:inline">Contents</span>
        </button>
        {/* The reader collapses the app sidebar, so the way out goes to the dashboard
            rather than the NCLEX hub — that's where study nav is fully available. */}
        <Link
          href={ROUTES.dashboard}
          aria-label="Back to dashboard"
          className="sg-icon-btn text-[#2ec4b6]"
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
          <span className="hidden min-[400px]:inline">Dashboard</span>
        </Link>
        {/* The book title truncates to noise on a phone; the chapter heading carries context there. */}
        <p className="hidden min-w-0 flex-1 truncate text-[15px] font-semibold tracking-[-0.02em] sm:block">
          {guideTitle}
          {navPending ? (
            <span className="ml-2 text-[11px] font-normal text-white/40">Loading</span>
          ) : null}
        </p>
        <div className="flex-1 sm:hidden" aria-hidden />
        {navPending ? (
          <span className="text-[11px] text-white/40 sm:hidden">Loading</span>
        ) : null}
        <div className="relative" ref={appearanceRef}>
          <button
            type="button"
            className={cn("sg-icon-btn", appearanceOpen && "is-on")}
            aria-expanded={appearanceOpen}
            aria-haspopup="dialog"
            aria-label="Reading settings"
            onClick={() => setAppearanceOpen((open) => !open)}
          >
            Aa
          </button>
          {appearanceOpen ? (
            <div className="sg-appearance" role="dialog" aria-label="Reading settings">
              <p>Size</p>
              <ReaderSeg
                label="Font size"
                value={prefs.fontSize}
                onChange={(fontSize) =>
                  setPrefs((p) => ({ ...p, fontSize: fontSize as SgReaderPrefs["fontSize"] }))
                }
                options={[
                  { value: "sm", label: "A−" },
                  { value: "md", label: "A" },
                  { value: "lg", label: "A+" },
                  { value: "xl", label: "A++" },
                ]}
              />
              <p>Spacing</p>
              <ReaderSeg
                label="Line height"
                value={prefs.lineHeight}
                onChange={(lineHeight) =>
                  setPrefs((p) => ({
                    ...p,
                    lineHeight: lineHeight as SgReaderPrefs["lineHeight"],
                  }))
                }
                options={[
                  { value: "snug", label: "Tight" },
                  { value: "normal", label: "Even" },
                  { value: "relaxed", label: "Airy" },
                ]}
              />
              <p>Paper</p>
              <ReaderSeg
                label="Reading theme"
                value={prefs.theme}
                onChange={(theme) =>
                  setPrefs((p) => ({ ...p, theme: theme as SgReaderPrefs["theme"] }))
                }
                options={[
                  { value: "paper", label: "Paper" },
                  { value: "dim", label: "Dim" },
                  { value: "dark", label: "Dark" },
                ]}
              />
            </div>
          ) : null}
        </div>
        <button
          type="button"
          className="sg-icon-btn hidden sm:inline-flex"
          onClick={() => window.print()}
          aria-label="Print this chapter"
          title="Print this chapter"
        >
          <Printer className="h-3.5 w-3.5" aria-hidden />
        </button>
        <button
          type="button"
          className="sg-icon-btn"
          onClick={() => toggleDrawer(!drawerOpen)}
          aria-pressed={drawerOpen}
          aria-label={drawerOpen ? "Close notes" : "Open notes"}
        >
          {drawerOpen ? (
            <PanelRightClose className="h-3.5 w-3.5" />
          ) : (
            <PanelRightOpen className="h-3.5 w-3.5" />
          )}
        </button>
      </header>

      <div
        ref={progressBarRef}
        className="h-[3px] w-full bg-white/10"
        role="progressbar"
        aria-valuenow={0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      >
        <div ref={progressFillRef} className="sg-progress-fill h-full bg-[#2ec4b6]" />
      </div>

      <div className="relative flex min-h-0 flex-1">
        {/* LEFT TOC — a fixed rail on desktop, a slide-over sheet on touch. Visibility is
            CSS-driven so the server markup already matches the viewport (no hydration flash). */}
        <aside className="sg-toc hidden w-64 shrink-0 overflow-y-auto border-r border-white/10 px-4 py-6 lg:block xl:w-80">
          {tocContent}
        </aside>
        <AnimatePresence initial={false}>
          {tocOpen ? (
            <>
              <motion.button
                key="toc-scrim"
                type="button"
                aria-label="Close contents"
                onClick={() => setTocOpen(false)}
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                className="absolute inset-0 z-20 bg-black/60 lg:hidden"
              />
              <motion.aside
                key="toc"
                initial={reduceMotion ? false : { x: "-100%" }}
                animate={{ x: 0 }}
                exit={reduceMotion ? undefined : { x: "-100%" }}
                transition={{ type: "spring", stiffness: 380, damping: 36, mass: 0.8 }}
                className="sg-toc absolute inset-y-0 left-0 z-30 w-[min(92vw,22.5rem)] overflow-y-auto border-r border-white/10 bg-[#0b1c2c] px-5 py-6 shadow-2xl lg:hidden"
              >
                {tocContent}
              </motion.aside>
            </>
          ) : null}
        </AnimatePresence>

        {/* CENTER paper */}
        <main className="relative flex min-h-0 min-w-0 flex-1 flex-col">
          {/* Edge prev/next */}
          {chapter.prevSlug ? (
            <button
              type="button"
              className="sg-edge-nav sg-edge-nav--prev"
              aria-label="Previous chapter"
              title="Previous (k)"
              onMouseEnter={() => prefetchChapter(exam, chapter.prevSlug)}
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
              onMouseEnter={() => prefetchChapter(exam, chapter.nextSlug)}
              onClick={() => void goToSlug(chapter.nextSlug!)}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          ) : null}

          <div className="flex items-center gap-2 px-3 py-2.5 sm:px-5">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search this chapter…"
                className="w-full rounded-full border border-white/15 bg-white/5 py-2 pl-9 pr-3 text-[13px] outline-none placeholder:text-white/35 focus:border-[#2ec4b6]/50"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                const info = captureSelection();
                void saveHighlight(pendingColor, info);
              }}
              className="sg-icon-btn"
              title="Highlight selection (h)"
            >
              <Highlighter className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Highlight</span>
            </button>
            <button
              type="button"
              onClick={() => void saveBookmark()}
              className="sg-icon-btn"
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
            <p className="border-b border-amber-400/30 bg-amber-400/10 px-4 py-2 text-[13px] leading-relaxed text-amber-50">
              {authHint}{" "}
              {authAction === "gate" ? (
                <>
                  <Link href={ROUTES.auth.login} className="font-semibold underline">
                    Sign in
                  </Link>
                  {" · "}
                  <Link href={LANDING_TRIAL_HREF} className="font-semibold underline">
                    Start trial
                  </Link>
                </>
              ) : null}
            </p>
          ) : null}

          <div className="relative min-h-0 min-w-0 flex-1">
            <div ref={scrollRef} className="sg-chapter-scroll h-full min-h-0 min-w-0">
              <div className="mx-auto flex min-h-full w-full max-w-[42rem] flex-col px-3 py-3 sm:px-8 sm:py-8">
                <article
                  ref={paperRef}
                  onMouseUp={captureSelection}
                  data-theme={prefs.theme}
                  className={cn(
                    "sg-paper flex-1 shadow-2xl sm:rounded-[1.25rem]",
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
                      {visibleBookSection(chapter.sectionLabel) ? (
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] opacity-60">
                          {visibleBookSection(chapter.sectionLabel)}
                        </p>
                      ) : null}
                      <div
                        className="sg-prose"
                        dangerouslySetInnerHTML={{ __html: filteredHtml }}
                      />
                      {chapter.relatedTopics.length > 0 ? (
                        <section className="sg-deeper" aria-labelledby="sg-deeper-heading">
                          <h2 id="sg-deeper-heading" className="sg-deeper__title">
                            Go deeper on this chapter
                          </h2>
                          <p className="sg-deeper__intro">
                            Related topics with a full review, Library cards, or anatomy to explore.
                          </p>
                          <ul className="sg-deeper__list">
                            {chapter.relatedTopics.map((t) => (
                              <li key={t.slug} className="sg-deeper__item">
                                <p className="sg-deeper__topic">{t.title}</p>
                                {t.summary ? <p className="sg-deeper__summary">{t.summary}</p> : null}
                                <div className="sg-deeper__links">
                                  {t.deepDiveHref ? (
                                    <Link className="sg-deeper__link" href={t.deepDiveHref}>
                                      Deep dive
                                    </Link>
                                  ) : null}
                                  {t.libraryHref ? (
                                    <Link className="sg-deeper__link" href={t.libraryHref}>
                                      Library
                                      {t.libraryCardCount > 0 ? ` (${t.libraryCardCount})` : ""}
                                    </Link>
                                  ) : null}
                                  {t.anatomyHref ? (
                                    <Link className="sg-deeper__link" href={t.anatomyHref}>
                                      Anatomy{t.anatomyLabel ? `: ${t.anatomyLabel}` : ""}
                                    </Link>
                                  ) : null}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </section>
                      ) : null}
                    </motion.div>
                  </AnimatePresence>
                </article>
              </div>
            </div>

            {/* Scrubber stays pinned to the visible column. It is outside the
                scrollport so its rotated track can't widen the chapter. */}
            <div className="pointer-events-none absolute inset-0 flex justify-center">
              <div className="pointer-events-none relative h-full w-full max-w-[42rem]">
                <div className="sg-scrubber" aria-hidden={false}>
                  {/* Uncontrolled: the scroll handler writes `value` on the node so a
                      60Hz position update doesn't re-render the reader. */}
                  <input
                    ref={scrubberRef}
                    type="range"
                    min={0}
                    max={100}
                    step={0.5}
                    defaultValue={0}
                    aria-label="Seek in chapter"
                    onPointerDown={() => {
                      scrubbingRef.current = true;
                    }}
                    onPointerUp={() => {
                      scrubbingRef.current = false;
                    }}
                    onPointerCancel={() => {
                      scrubbingRef.current = false;
                    }}
                    onChange={(e) => seekToPct(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>

          <nav
            className="flex shrink-0 items-center justify-between gap-3 border-t border-white/10 px-3 py-3 sm:px-4"
            aria-label="Chapter navigation"
          >
            {chapter.prevSlug ? (
              <button
                type="button"
                onMouseEnter={() => prefetchChapter(exam, chapter.prevSlug)}
                onClick={() => void goToSlug(chapter.prevSlug!)}
                className="sg-chapter-jump"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
            ) : (
              <span />
            )}
            <span className="hidden text-[12px] tracking-[-0.01em] text-white/40 md:inline">
              {chapter.title}
            </span>
            {chapter.nextSlug ? (
              <button
                type="button"
                onMouseEnter={() => prefetchChapter(exam, chapter.nextSlug)}
                onClick={() => void goToSlug(chapter.nextSlug!)}
                className="sg-chapter-jump"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <span />
            )}
          </nav>

          {/* The global site footer is suppressed on reader routes, so the
              study-aid disclaimer and legal links live here instead. */}
          <div className="shrink-0 border-t border-white/10 px-3 py-2.5 text-[10px] leading-relaxed text-white/40 sm:px-4">
            <p>
              Study aid only — not medical advice or a substitute for your{" "}
              {config.legal.programNoun}, facility policy, or official board documents.
              Portions are AI-generated; verify against authoritative sources before
              clinical use. {config.legal.examName}® is a registered trademark of{" "}
              {config.legal.owner}. Not affiliated with or endorsed by{" "}
              {config.legal.owner}.{" "}
              <Link href="/legal/disclaimer" className="underline hover:text-white/70">
                Disclaimers
              </Link>
              {" · "}
              <Link href="/legal/terms" className="underline hover:text-white/70">
                Terms
              </Link>
              {" · "}
              <Link href="/legal/privacy" className="underline hover:text-white/70">
                Privacy
              </Link>
            </p>
          </div>
        </main>

        {/* RIGHT drawer */}
        <AnimatePresence initial={false}>
          {drawerOpen ? (
            <>
              {isDesktop ? null : (
                <motion.button
                  key="drawer-scrim"
                  type="button"
                  aria-label="Close drawer"
                  onClick={() => toggleDrawer(false)}
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                  className="absolute inset-0 z-20 bg-black/60"
                />
              )}
            <motion.aside
              key="drawer"
              initial={reduceMotion ? false : isDesktop ? { width: 0, opacity: 0 } : { x: "100%" }}
              animate={isDesktop ? { width: 288, opacity: 1 } : { x: 0 }}
              exit={reduceMotion ? undefined : isDesktop ? { width: 0, opacity: 0 } : { x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36, mass: 0.8 }}
              className={cn(
                "flex flex-col overflow-hidden border-l border-white/10 bg-[#091620]",
                isDesktop
                  ? "shrink-0"
                  : "absolute inset-y-0 right-0 z-30 w-[min(85vw,320px)] shadow-2xl"
              )}
            >
              <div className={cn("flex flex-1 flex-col", isDesktop ? "w-72" : "w-full")}>
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
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-3 text-xs">
                  {drawerTab === "highlights" ? (
                    <ul className="space-y-2">
                      {highlights.length === 0 ? (
                        <li className="sg-empty">
                          Select a passage, then choose Highlight. Marks stay on this chapter.
                        </li>
                      ) : (
                        highlights.map((h) => (
                          <li key={h.id} className="sg-anno">
                            <button
                              type="button"
                              className="min-w-0 flex-1 text-left"
                              onClick={() => {
                                const root = paperRef.current;
                                const target = root?.querySelector(
                                  `mark.sg-hl[data-highlight-id="${CSS.escape(h.id)}"]`
                                );
                                target?.scrollIntoView({
                                  behavior: reduceMotion ? "auto" : "smooth",
                                  block: "center",
                                });
                              }}
                            >
                              <span
                                className="mb-1 inline-block h-1.5 w-6 rounded-full"
                                style={{
                                  background:
                                    COLOR_SWATCH[(h.color as SgHighlightColor) || "yellow"] ||
                                    COLOR_SWATCH.yellow,
                                }}
                                aria-hidden
                              />
                              <p className="leading-relaxed">{h.selectedText}</p>
                            </button>
                            <button
                              type="button"
                              className="sg-anno__remove"
                              aria-label="Remove highlight"
                              onClick={() => void removeAnnotation("highlights", h.id)}
                            >
                              Remove
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                  ) : null}
                  {drawerTab === "bookmarks" ? (
                    <ul className="space-y-2">
                      {bookmarks.length === 0 ? (
                        <li className="sg-empty">
                          Bookmark this spot to jump back later. Press b, or use Bookmark above.
                        </li>
                      ) : (
                        bookmarks.map((b) => (
                          <li key={b.id} className="sg-anno">
                            <button
                              type="button"
                              className="min-w-0 flex-1 text-left"
                              onClick={() => {
                                const root = paperRef.current;
                                const target = root?.querySelector(`#${CSS.escape(b.anchorId)}`);
                                if (target) {
                                  target.scrollIntoView({
                                    behavior: reduceMotion ? "auto" : "smooth",
                                    block: "start",
                                  });
                                  if (!isDesktop) toggleDrawer(false);
                                  return;
                                }
                                seekToPct(b.scrollPct);
                                if (!isDesktop) toggleDrawer(false);
                              }}
                            >
                              <p className="font-semibold tracking-[-0.01em]">
                                {b.label || b.anchorId}
                              </p>
                              <p className="mt-0.5 text-white/40">{Math.round(b.scrollPct)}% through</p>
                            </button>
                            <button
                              type="button"
                              className="sg-anno__remove"
                              aria-label="Remove bookmark"
                              onClick={() => void removeAnnotation("bookmarks", b.id)}
                            >
                              Remove
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
                        className="min-h-[96px] w-full rounded-xl border border-white/15 bg-white/5 p-3 text-[13px] leading-relaxed outline-none focus:border-[#2ec4b6]/50"
                      />
                      <button
                        type="button"
                        onClick={() => void saveNote()}
                        className="w-full rounded-full bg-[#2ec4b6] px-3 py-2.5 text-[13px] font-semibold tracking-[-0.01em] text-[#0b1c2c]"
                      >
                        Save note
                      </button>
                      {notes.length === 0 ? (
                        <p className="sg-empty">Notes stay with this chapter.</p>
                      ) : (
                        <ul className="space-y-2">
                          {notes.map((n) => (
                            <li key={n.id} className="sg-anno">
                              <p className="min-w-0 flex-1 whitespace-pre-wrap leading-relaxed">{n.body}</p>
                              <button
                                type="button"
                                className="sg-anno__remove"
                                aria-label="Remove note"
                                onClick={() => void removeAnnotation("notes", n.id)}
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : null}
                </div>
                <p className="border-t border-white/10 px-3 py-3 text-[11px] leading-relaxed text-white/35">
                  Print this chapter from your browser. Bookmarks, highlights, and notes stay on
                  your account.
                </p>
              </div>
            </motion.aside>
            </>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
