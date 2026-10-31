"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Maximize2, RotateCcw, Tag } from "lucide-react";
import { feedOrder, REVIEW_GAP, sourceLine } from "@/lib/pance-feed/format";
import type { PanceFeedCard } from "@/lib/pance-feed/load-cards";
import { ROUTES } from "@/lib/routes";
import { STUDY_FEEDS, type StudyFeedBoard } from "@/lib/study-feed/catalog";
import { classifyFeedSwipe, feedHintStorageKey } from "@/lib/study-feed/gesture";
import "./pance-feed.css";

const RING = 100.53;

const TINT: Record<string, string> = {
  Cardiovascular: "#be123c",
  Pulmonary: "#0369a1",
  "GI/Nutrition": "#b45309",
  Musculoskeletal: "#4d7c0f",
  EENT: "#7c3aed",
  Reproductive: "#c026d3",
  Endocrine: "#0e7490",
  Genitourinary: "#4338ca",
  Renal: "#1d4ed8",
  Neurologic: "#6d28d9",
  Psychiatry: "#9333ea",
  Dermatologic: "#c2410c",
  "Infectious Diseases": "#047857",
  Hematologic: "#b91c1c",
  "Professional Practice": "#475569",
  GI: "#b45309",
  Psych: "#9333ea",
  MSK: "#4d7c0f",
  ID: "#047857",
  Derm: "#c2410c",
  Neuro: "#6d28d9",
  Heme: "#b91c1c",
  Peds: "#0369a1",
  Geriatrics: "#7c3aed",
  Professional: "#475569",
  Safety: "#b45309",
  "Legal and ethical": "#4338ca",
  "Infection control": "#047857",
  "Mental health": "#9333ea",
  Cardiac: "#be123c",
  Communication: "#0e7490",
  Respiratory: "#0369a1",
  Maternity: "#c026d3",
  "Health promotion": "#4d7c0f",
  Nutrition: "#b45309",
  "Person-Centered Assessment & Treatment Planning": "#0e7490",
  "Foundational Knowledge": "#1d4ed8",
  "Medication Use Process": "#047857",
  "Pharmacy Management & Leadership": "#475569",
};

type Slide = { key: string; id: string; again: boolean };

type ProgressBody = {
  mastered: string[];
  reviewQueue: string[];
  lastSeenCardId: string | null;
};

function scopeSvg(svg: string, scope: string, labels: boolean): string {
  const prefix = scope.replace(/[^A-Za-z0-9_-]/g, "") || "s";
  const scoped = svg
    .replace(/\bid=(["'])([^"']+)\1/g, (_, q, id) => `id=${q}${prefix}${id}${q}`)
    .replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${prefix}${id})`)
    .replace(/href=(["'])#([^"']+)\1/g, (_, q, id) => `href=${q}#${prefix}${id}${q}`);
  return scoped.replace(/<svg\b([^>]*)>/, (_, attrs: string) => {
    const cleaned = attrs.replace(/\sclass="[^"]*"/, "");
    return `<svg class="v3${labels ? "" : " recall"}"${cleaned}>`;
  });
}

function SvgFrame({
  svg,
  labels,
  scope,
}: {
  svg: string | undefined;
  labels: boolean;
  scope: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = svg ? scopeSvg(svg, scope, labels) : "";
  }, [svg, labels, scope]);
  return <div className="pf-dia" ref={ref} />;
}

export function PanceFeed({ board = STUDY_FEEDS.pance }: { board?: StudyFeedBoard }) {
  const feedRef = useRef<HTMLElement>(null);
  const [cards, setCards] = useState<PanceFeedCard[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [mastered, setMastered] = useState<string[]>([]);
  const [lastSeen, setLastSeen] = useState<string | null>(null);
  const [labels, setLabels] = useState(true);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [svgs, setSvgs] = useState<Record<string, string>>({});
  const [streak, setStreak] = useState(0);
  const [hint, setHint] = useState(false);
  const [toast, setToast] = useState("");
  const [status, setStatus] = useState("Loading cards…");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const progressRef = useRef<ProgressBody>({ mastered: [], reviewQueue: [], lastSeenCardId: null });
  const saveTimer = useRef<number | null>(null);
  const saveAbort = useRef<AbortController | null>(null);
  const svgRef = useRef<Record<string, string>>({});
  const inflight = useRef(new Set<string>());
  const restored = useRef(false);
  const reducedMotion = useRef(false);
  const gesture = useRef<{ x: number; y: number; pointerId: number; interactive: boolean } | null>(
    null
  );
  const ignoreClick = useRef(false);

  const byId = useMemo(() => new Map(cards.map((card) => [card.id, card])), [cards]);
  const total = cards.length;
  const masteredCount = mastered.length;

  const publish = useCallback((next: ProgressBody) => {
    progressRef.current = next;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      saveAbort.current?.abort();
      const ctrl = new AbortController();
      saveAbort.current = ctrl;
      void fetch(`${board.apiBase}/progress`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(progressRef.current),
        keepalive: true,
        signal: ctrl.signal,
      }).catch(() => undefined);
    }, 250);
  }, [board.apiBase]);

  const ensureSvg = useCallback(async (id: string) => {
    if (Object.prototype.hasOwnProperty.call(svgRef.current, id) || inflight.current.has(id)) return;
    inflight.current.add(id);
    try {
      const res = await fetch(`${board.apiBase}/cards/${id}`);
      if (!res.ok) return;
      const data = (await res.json()) as { svg?: string | null };
      const svg = typeof data.svg === "string" && data.svg.includes("<svg") ? data.svg : "";
      svgRef.current = { ...svgRef.current, [id]: svg };
      setSvgs(svgRef.current);
    } catch {
      /* the back face stays text-only until a retry */
    } finally {
      inflight.current.delete(id);
    }
  }, [board.apiBase]);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let cancel = false;
    void (async () => {
      try {
        const [cardRes, progRes] = await Promise.all([
          fetch(`${board.apiBase}/cards`),
          fetch(`${board.apiBase}/progress`),
        ]);
        if (cancel) return;
        if (cardRes.status === 401) {
          window.location.assign(`/login?callbackUrl=${encodeURIComponent(board.href)}`);
          return;
        }
        if (!cardRes.ok || !progRes.ok) {
          setStatus(cardRes.status === 403 ? "A paid plan is required." : "The feed could not load.");
          return;
        }
        const cardJson = (await cardRes.json()) as { cards: PanceFeedCard[] };
        const prog = (await progRes.json()) as ProgressBody & { lastSeenAt?: string | null };
        if (cancel) return;
        const list = cardJson.cards ?? [];
        const ids = list.map((card) => card.id);
        const nextMastered = prog.mastered ?? [];
        const nextQueue = prog.reviewQueue ?? [];
        const order = feedOrder(ids, nextMastered, nextQueue);
        setCards(list);
        setMastered(nextMastered);
        setLastSeen(prog.lastSeenCardId);
        setSlides(order.map((id) => ({ key: id, id, again: nextQueue.includes(id) })));
        progressRef.current = {
          mastered: nextMastered,
          reviewQueue: nextQueue,
          lastSeenCardId: prog.lastSeenCardId,
        };
        try {
          setHint(window.localStorage.getItem(feedHintStorageKey(board.exam)) !== "1");
        } catch {
          setHint(true);
        }
        setStatus("");
        setReady(true);
      } catch {
        if (!cancel) setStatus("The feed could not load.");
      }
    })();
    return () => {
      cancel = true;
      document.body.style.overflow = prev;
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [board.apiBase, board.exam, board.href]);

  useEffect(() => {
    if (!ready || restored.current) return;
    restored.current = true;
    const feed = feedRef.current;
    if (!feed || !lastSeen) return;
    const el = feed.querySelector<HTMLElement>(`[data-id="${lastSeen}"]`);
    if (el) feed.scrollTop = el.offsetTop;
  }, [ready, lastSeen, slides.length]);

  useEffect(() => {
    const feed = feedRef.current;
    if (!feed || !ready) return;
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const slide = entry.target as HTMLElement;
          const id = slide.dataset.id;
          if (!id) continue;
          if (entry.isIntersecting) {
            void ensureSvg(id);
            if (!seen.has(id)) {
              seen.add(id);
              setLastSeen(id);
              publish({ ...progressRef.current, lastSeenCardId: id });
            }
          } else {
            const key = slide.dataset.key;
            if (key) setFlipped((current) => (current[key] ? { ...current, [key]: false } : current));
          }
        }
      },
      { root: feed, threshold: 0.6 }
    );
    feed.querySelectorAll(".pf-slide[data-id]").forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, [ready, slides, ensureSvg, publish]);

  function dismissHint() {
    setHint(false);
    try {
      window.localStorage.setItem(feedHintStorageKey(board.exam), "1");
    } catch {
      /* private mode still hides the hint for this visit */
    }
  }

  function visibleSlide(): Slide | null {
    const feed = feedRef.current;
    if (!feed) return null;
    const nodes = [...feed.querySelectorAll<HTMLElement>(".pf-slide[data-key]")];
    const height = feed.clientHeight || 1;
    const current = nodes[Math.round(feed.scrollTop / height)];
    if (!current?.dataset.key) return null;
    return slides.find((item) => item.key === current.dataset.key) ?? null;
  }

  function onPointerDown(event: React.PointerEvent<HTMLElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const target = event.target as Element;
    gesture.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
      interactive: Boolean(target.closest("button, a, [data-a]")),
    };
  }

  function onPointerUp(event: React.PointerEvent<HTMLElement>) {
    const start = gesture.current;
    gesture.current = null;
    if (!start || start.pointerId !== event.pointerId || start.interactive) return;
    const action = classifyFeedSwipe(event.clientX - start.x, event.clientY - start.y);
    if (!action) return;
    dismissHint();
    if (action === "next" || action === "prev") return;
    ignoreClick.current = true;
    const slide = visibleSlide();
    if (slide) act(action === "got" ? "got" : "again", slide);
  }

  function showToast(text: string) {
    setToast(text);
    window.setTimeout(() => setToast(""), 1600);
  }

  function scrollToSlide(fromKey: string, delta: number) {
    const feed = feedRef.current;
    if (!feed) return;
    const nodes = [...feed.querySelectorAll<HTMLElement>(".pf-slide")];
    const index = nodes.findIndex((node) => node.dataset.key === fromKey);
    const target = nodes[index + delta];
    if (!target) return;
    feed.scrollTo({ top: target.offsetTop, behavior: reducedMotion.current ? "auto" : "smooth" });
  }

  function onGotIt(slide: Slide) {
    const nextMastered = progressRef.current.mastered.includes(slide.id)
      ? progressRef.current.mastered
      : [...progressRef.current.mastered, slide.id];
    const nextQueue = progressRef.current.reviewQueue.filter((id) => id !== slide.id);
    const nextStreak = streak + 1;
    setMastered(nextMastered);
    setStreak(nextStreak);
    publish({ mastered: nextMastered, reviewQueue: nextQueue, lastSeenCardId: slide.id });
    window.setTimeout(() => scrollToSlide(slide.key, 1), reducedMotion.current ? 200 : 500);
  }

  function onAgain(slide: Slide) {
    const nextMastered = progressRef.current.mastered.filter((id) => id !== slide.id);
    const nextQueue = [...progressRef.current.reviewQueue.filter((id) => id !== slide.id), slide.id];
    setMastered(nextMastered);
    setStreak(0);
    publish({ mastered: nextMastered, reviewQueue: nextQueue, lastSeenCardId: slide.id });
    setSlides((current) => {
      const index = current.findIndex((item) => item.key === slide.key);
      if (index < 0) return current;
      const copy = current.slice();
      const refIndex = Math.min(index + REVIEW_GAP, copy.length);
      const again = { key: `${slide.id}-r${Date.now()}`, id: slide.id, again: true };
      if (refIndex >= copy.length) copy.push(again);
      else copy.splice(refIndex, 0, again);
      return copy;
    });
    showToast(`Back in ${REVIEW_GAP} cards`);
    window.setTimeout(() => scrollToSlide(slide.key, 1), 350);
  }

  function onLabels(slide: Slide) {
    setLabels((current) => !current);
    setFlipped((current) => ({ ...current, [slide.key]: true }));
    void ensureSvg(slide.id);
    showToast(labels ? "Labels hidden" : "Labels shown");
  }

  function onZoom(slide: Slide) {
    const svg = svgs[slide.id];
    if (!svg) {
      if (svg === "") {
        showToast("This card is text only");
        return;
      }
      void ensureSvg(slide.id);
      showToast("Graphic still loading");
      return;
    }
    setLightbox(scopeSvg(svg, `lb${slide.key}`, labels));
  }

  function restart() {
    const ids = cards.map((card) => card.id);
    setMastered([]);
    setStreak(0);
    setFlipped({});
    setSlides(ids.map((id) => ({ key: id, id, again: false })));
    publish({ mastered: [], reviewQueue: [], lastSeenCardId: ids[0] ?? null });
    feedRef.current?.scrollTo({ top: 0 });
  }

  function act(name: string, slide: Slide) {
    dismissHint();
    if (name === "got") onGotIt(slide);
    else if (name === "again") onAgain(slide);
    else if (name === "labels") onLabels(slide);
    else if (name === "zoom") onZoom(slide);
    else if (name === "restart") restart();
  }

  const onKeyRef = useRef<(event: KeyboardEvent) => void>(() => {});
  onKeyRef.current = (event) => {
    if (lightbox) {
      if (event.key === "Escape") setLightbox(null);
      return;
    }
    const feed = feedRef.current;
    if (!feed) return;
    const nodes = [...feed.querySelectorAll<HTMLElement>(".pf-slide")];
    const height = feed.clientHeight || 1;
    const current = nodes[Math.round(feed.scrollTop / height)];
    if (!current?.dataset.id || !current.dataset.key) {
      if ((event.key === "Enter" || event.key === " ") && current?.querySelector("[data-a=restart]")) {
        event.preventDefault();
        restart();
      }
      return;
    }
    const slide = slides.find((item) => item.key === current.dataset.key);
    if (!slide) return;
    const key = event.key.toLowerCase();
    if (key === "f") {
      dismissHint();
      setFlipped((state) => ({ ...state, [slide.key]: !state[slide.key] }));
    } else if (event.key === "2") act("got", slide);
    else if (event.key === "1") act("again", slide);
    else if (key === "l") act("labels", slide);
    else if (key === "z") act("zoom", slide);
    else if (event.key === "ArrowDown" || key === "j") {
      event.preventDefault();
      dismissHint();
      scrollToSlide(slide.key, 1);
    } else if (event.key === "ArrowUp" || key === "k") {
      event.preventDefault();
      dismissHint();
      scrollToSlide(slide.key, -1);
    }
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => onKeyRef.current(event);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function onClick(event: React.MouseEvent<HTMLElement>) {
    if (ignoreClick.current) {
      ignoreClick.current = false;
      event.preventDefault();
      return;
    }
    const target = event.target as Element;
    if (target.closest(".pf-lb-x") || target.classList.contains("pf-lb")) {
      setLightbox(null);
      return;
    }
    const lb = target.closest(".lb");
    if (lb && lb.closest("svg")?.classList.contains("recall")) {
      lb.classList.toggle("on");
      return;
    }
    const slideEl = target.closest<HTMLElement>(".pf-slide");
    if (!slideEl) return;
    const action = target.closest<HTMLElement>("[data-a]");
    const slide = slides.find((item) => item.key === slideEl.dataset.key);
    if (action) {
      event.preventDefault();
      if (action.dataset.a === "restart") restart();
      else if (slide && action.dataset.a) act(action.dataset.a, slide);
      return;
    }
    if (!slide || !target.closest(".pf-card")) return;
    setFlipped((state) => ({ ...state, [slide.key]: !state[slide.key] }));
    void ensureSvg(slide.id);
    dismissHint();
  }

  return (
    <div className="pance-feed" data-testid={board.testId} onClick={onClick}>
      <header className="pf-top">
        <Link className="pf-back-link" href={ROUTES.dashboard} aria-label="Back to dashboard">
          ←
        </Link>
        <div className="pf-ring" aria-label="Mastery progress">
          <svg width="38" height="38" aria-hidden>
            <circle className="track" cx="19" cy="19" r="16" />
            <circle
              className="progress"
              cx="19"
              cy="19"
              r="16"
              strokeDasharray={RING}
              strokeDashoffset={RING * (1 - (total ? masteredCount / total : 0))}
            />
          </svg>
          <span>{masteredCount}</span>
        </div>
        <div className="pf-ttl">
          <b>{board.label}</b>
          <small>
            {masteredCount} of {total} mastered
          </small>
        </div>
        <div className="pf-streak" title="Got-it streak" aria-live="polite">
          <span aria-hidden>🔥</span> <span>{streak}</span>
        </div>
      </header>
      {status ? <p className="pf-status">{status}</p> : null}
      <main
        ref={feedRef}
        className="pf-feed"
        aria-label="Flashcard feed. Swipe up for the next card, down for the previous card. Swipe right for Got it, left for Review again. Tap a card to flip it."
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          gesture.current = null;
        }}
      >
        {slides.map((slide, index) => {
          const card = byId.get(slide.id);
          if (!card) return null;
          const n = cards.findIndex((item) => item.id === slide.id) + 1;
          const done = mastered.includes(slide.id);
          return (
            <article
              key={slide.key}
              className={`pf-slide${flipped[slide.key] ? " flipped" : ""}${done ? " done" : ""}`}
              data-id={slide.id}
              data-key={slide.key}
              data-testid={`${board.testId}-card`}
              style={{ ["--tint" as string]: TINT[card.system] ?? "#0f766e" }}
            >
              <div className="pf-bg" />
              <div className="pf-orb pf-orb-a" />
              <div className="pf-orb pf-orb-b" />
              <div className="pf-stage">
                <div
                  className="pf-card"
                  role="button"
                  tabIndex={0}
                  aria-label={`Flashcard ${n} of ${total}. Tap to flip.`}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setFlipped((state) => ({ ...state, [slide.key]: !state[slide.key] }));
                      void ensureSvg(slide.id);
                      dismissHint();
                    }
                  }}
                >
                  <section className="pf-face pf-front">
                    <span className="pf-num">
                      {n} / {total}
                    </span>
                    <span className={`pf-chip${slide.again ? " pf-chip-again" : ""}`}>
                      {slide.again ? "Review again · " : ""}
                      {card.system}
                      {card.ageBand ? ` · ${card.ageBand}` : ""}
                    </span>
                    <h2 className="pf-q">{card.front}</h2>
                    <div className="pf-hint">Tap to reveal the answer</div>
                  </section>
                  <section className="pf-face pf-back" aria-label="Answer">
                    <div className="pf-bl">{card.bottom}</div>
                    <ul className="pf-bul">
                      <li className="c">
                        <b>Key clue</b>
                        {card.bullets.clue}
                      </li>
                      <li className="t">
                        <b>First-line</b>
                        {card.bullets.treat}
                      </li>
                      <li className="x">
                        <b>Exam trap</b>
                        {card.bullets.trap}
                      </li>
                    </ul>
                    <SvgFrame svg={svgs[slide.id]} labels={labels} scope={slide.key} />
                    <p className="pf-src">Source: {sourceLine(card.source)}</p>
                  </section>
                </div>
              </div>
              <nav className="pf-rail" aria-label="Card actions">
                <button className="pf-rb got" data-a="got" type="button">
                  <i>
                    <Check aria-hidden />
                  </i>
                  <span>Got it</span>
                </button>
                <button className="pf-rb again" data-a="again" type="button">
                  <i>
                    <RotateCcw aria-hidden />
                  </i>
                  <span>
                    Review
                    <br />
                    again
                  </span>
                </button>
                <button className="pf-rb" data-a="labels" type="button" aria-pressed={labels}>
                  <i>
                    <Tag aria-hidden />
                  </i>
                  <span>Labels</span>
                </button>
                <button className="pf-rb" data-a="zoom" type="button">
                  <i>
                    <Maximize2 aria-hidden />
                  </i>
                  <span>Enlarge</span>
                </button>
              </nav>
              <span className="sr-only">Card {index + 1}</span>
            </article>
          );
        })}
        {ready ? (
          <article className="pf-slide pf-end" style={{ ["--tint" as string]: "#0f766e" }}>
            <div className="pf-bg" />
            <div className="pf-stage" style={{ right: 12 }}>
              <div className="pf-face pf-front pf-endbox">
                <h2>Feed complete</h2>
                <p>
                  {masteredCount} of {total} mastered
                </p>
                <button className="pf-pill" type="button" data-a="restart">
                  Start again
                </button>
              </div>
            </div>
          </article>
        ) : null}
      </main>
      {hint ? (
        <div
          className="pf-gesture-hint"
          role="region"
          aria-label="How to move through cards"
          data-testid="feed-gesture-hint"
        >
          <p>Swipe up for the next card. Swipe down for the previous card.</p>
          <p>Swipe right for Got it. Swipe left for Review again.</p>
          <p>Tap the card to flip it. The buttons on the right do the same as the side swipes.</p>
          <button type="button" onClick={dismissHint}>
            Dismiss
          </button>
        </div>
      ) : null}
      <div
        className={`pf-lb${lightbox ? " on" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Enlarged study graphic"
        aria-hidden={lightbox ? undefined : true}
      >
        <button className="pf-lb-x" type="button">
          Close
        </button>
        <div className="pf-lb-in" dangerouslySetInnerHTML={{ __html: lightbox ?? "" }} />
      </div>
      <div className={`pf-toast${toast ? " on" : ""}`} role="status">
        {toast}
      </div>
    </div>
  );
}
