"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { HeartMonitor } from "@/components/daily-vitals/HeartMonitor";
import {
  loadDailyVitalsStore,
  saveDailyVitalsStore,
  type DaySave,
} from "@/lib/daily-vitals/browser-store";
import { drawShareCard, shareCardSize, type ShareCardInput } from "@/lib/daily-vitals/share-card";
import {
  chooseShareAttempt,
  invokeShare,
  LINK_COPIED_NOTE,
  pngDataUrlToBlob,
  pngFileFromDataUrl,
  shareWasCancelled,
  startLinkCopy,
} from "@/lib/daily-vitals/share-action";
import { DAILY_VITALS_SHARE_URL } from "@/lib/daily-vitals/schedule";
import { dailyVitalsShareText } from "@/lib/daily-vitals/share-text";
import { nextStreak, STREAK_RULE, visibleStreak } from "@/lib/daily-vitals/streak";
import type { PublicDailyVitals, TileMark } from "@/lib/daily-vitals/types";
import { DAILY_VITALS_TRIES, monitorReading, triesLeftLabel } from "@/lib/daily-vitals/vitals";

const KEY_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"] as const;

type Phase = "start" | "play" | "end";

export function DailyVitalsPlayer({
  puzzle,
  today,
}: {
  puzzle: PublicDailyVitals;
  today: string;
}) {
  const [hydrated, setHydrated] = useState(false);
  const [phase, setPhase] = useState<Phase>("start");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [marks, setMarks] = useState<TileMark[][]>([]);
  const [draft, setDraft] = useState("");
  const [note, setNote] = useState("");
  const [shake, setShake] = useState(false);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [streak, setStreak] = useState(0);
  const [word, setWord] = useState<string | undefined>();
  const [explanation, setExplanation] = useState<string | undefined>();
  const [solved, setSolved] = useState(false);
  const [images, setImages] = useState<{ story: string; square: string } | null>(null);
  const [toast, setToast] = useState("");
  const [shareReady, setShareReady] = useState(false);
  const prepared = useRef<{ square: string; story: string; file: File | null }>({
    square: "",
    story: "",
    file: null,
  });

  useEffect(() => {
    const store = loadDailyVitalsStore();
    const saved = store.days[puzzle.date];
    setStreak(visibleStreak(store.streak, today));
    if (saved && (saved.status === "won" || saved.status === "lost")) {
      setGuesses(saved.guesses);
      setMarks(saved.marks);
      setWord(saved.word);
      setExplanation(saved.explanation);
      setSolved(saved.status === "won");
      setPhase("end");
    } else if (saved && saved.guesses.length > 0) {
      setGuesses(saved.guesses);
      setMarks(saved.marks);
      setPhase("play");
    }
    setHydrated(true);
  }, [puzzle.date, today]);

  const persist = useCallback(
    (save: DaySave, countStreak: boolean) => {
      const store = loadDailyVitalsStore();
      store.days[puzzle.date] = save;
      if (countStreak && !puzzle.archive) {
        store.streak = nextStreak(store.streak, today);
        setStreak(store.streak.streak);
      }
      saveDailyVitalsStore(store);
    },
    [puzzle.archive, puzzle.date, today],
  );

  const bump = useCallback((message: string) => {
    setNote(message);
    setShake(true);
    window.setTimeout(() => setShake(false), 360);
  }, []);

  const submit = useCallback(
    async (raw: string) => {
      if (busyRef.current || phase !== "play") return;
      busyRef.current = true;
      const guess = raw.toUpperCase();
      if (guess.length < puzzle.length) {
        busyRef.current = false;
        bump(`This case is ${puzzle.length} letters.`);
        return;
      }
      if (guesses.includes(guess)) {
        busyRef.current = false;
        bump("Already tried.");
        return;
      }
      setBusy(true);
      setNote("");
      try {
        const response = await fetch("/api/daily-vitals/guess", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ date: puzzle.date, guess, attempt: guesses.length + 1 }),
        });
        const data = (await response.json()) as {
          ok: boolean;
          message?: string;
          marks?: TileMark[];
          solved?: boolean;
          lost?: boolean;
          word?: string;
          explanation?: string;
        };
        if (!data.ok || !data.marks) {
          bump(data.message || "That is not in the word list.");
          busyRef.current = false;
          setBusy(false);
          return;
        }
        const nextGuesses = [...guesses, guess];
        const nextMarks = [...marks, data.marks];
        setGuesses(nextGuesses);
        setMarks(nextMarks);
        setDraft("");
        // A finished case counts whether it was saved or missed. An unfinished row does not.
        if (data.solved || data.lost) {
          setSolved(Boolean(data.solved));
          setWord(data.word);
          setExplanation(data.explanation);
          setPhase("end");
          persist(
            {
              guesses: nextGuesses,
              marks: nextMarks,
              status: data.solved ? "won" : "lost",
              word: data.word,
              explanation: data.explanation,
            },
            true,
          );
        } else {
          persist({ guesses: nextGuesses, marks: nextMarks, status: "playing" }, false);
        }
      } catch {
        bump("That guess did not send. Try it again.");
      } finally {
        busyRef.current = false;
        setBusy(false);
      }
    },
    [bump, guesses, marks, persist, phase, puzzle.date, puzzle.length],
  );

  useEffect(() => {
    if (phase !== "play") return;
    document.querySelector(".dv-kb")?.scrollIntoView({ block: "nearest" });
  }, [phase]);

  useEffect(() => {
    if (phase !== "play") return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "Enter") {
        event.preventDefault();
        void submit(draft);
        return;
      }
      if (event.key === "Backspace") {
        event.preventDefault();
        setDraft((current) => current.slice(0, -1));
        setNote("");
        return;
      }
      if (/^[a-zA-Z]$/.test(event.key)) {
        event.preventDefault();
        setDraft((current) => (current.length >= puzzle.length ? current : current + event.key.toUpperCase()));
        setNote("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [draft, phase, puzzle.length, submit]);

  const typeLetter = (letter: string) => {
    if (phase !== "play" || busy) return;
    setDraft((current) => (current.length >= puzzle.length ? current : current + letter));
    setNote("");
  };

  const reading = monitorReading(marks, puzzle.length, solved && phase === "end");
  const shareText = dailyVitalsShareText({
    solved,
    guessesUsed: solved ? guesses.length : DAILY_VITALS_TRIES,
    streak,
  });

  const drawCard = useCallback((format: ShareCardInput["format"]): string => {
    try {
      const fontFamily = getComputedStyle(document.body).fontFamily || "Inter, Arial, sans-serif";
      const { width, height } = shareCardSize(format);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return "";
      drawShareCard(ctx, {
        format,
        boardLabel: puzzle.boardLabel,
        dayNumber: puzzle.dayNumber,
        streak,
        solved,
        guessesUsed: solved ? guesses.length : DAILY_VITALS_TRIES,
        marks,
        clue: puzzle.clue,
        legalLines: puzzle.legalLines,
        fontFamily,
      });
      const url = canvas.toDataURL("image/png");
      return url.startsWith("data:image/png") ? url : "";
    } catch {
      return "";
    }
  }, [guesses.length, marks, puzzle, solved, streak]);

  useEffect(() => {
    if (phase !== "end") return;
    const square = drawCard("square");
    const story = drawCard("story");
    prepared.current = {
      square,
      story,
      file: square ? pngFileFromDataUrl(square, `daily-vitals-${puzzle.date}.png`) : null,
    };
  }, [drawCard, phase, puzzle.date]);

  function presentImage(dataUrl: string, filename: string) {
    if (!dataUrl) return;
    const blob = pngDataUrlToBlob(dataUrl);
    let href = dataUrl;
    if (blob && typeof URL.createObjectURL === "function") {
      try {
        href = URL.createObjectURL(blob);
      } catch {
        href = dataUrl;
      }
    }
    const link = document.createElement("a");
    link.href = href;
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (ios) {
      link.target = "_blank";
      link.rel = "noopener";
    } else {
      link.download = filename;
    }
    link.click();
    if (href !== dataUrl) window.setTimeout(() => URL.revokeObjectURL(href), 60_000);
  }

  async function onShare() {
    const ready = prepared.current;
    const attempt = chooseShareAttempt({
      file: ready.file,
      link: DAILY_VITALS_SHARE_URL,
      hasShare: typeof navigator.share === "function",
      canShare:
        typeof navigator.canShare === "function"
          ? (data) => navigator.canShare(data)
          : undefined,
    });
    // Share and the link copy both start before any await. iOS drops the sheet after a yield.
    let pending: Promise<void> | null = null;
    try {
      pending = invokeShare(attempt, navigator.share?.bind(navigator));
    } catch (error) {
      pending = Promise.reject(error);
    }
    const copyPromise = startLinkCopy(DAILY_VITALS_SHARE_URL, navigator.clipboard?.writeText?.bind(navigator.clipboard));
    if (attempt.mode === "save") presentImage(ready.square, `daily-vitals-${puzzle.date}.png`);
    let copied = false;
    if (copyPromise) {
      try {
        await copyPromise;
        copied = true;
      } catch {
        copied = false;
      }
    }
    if (pending) {
      try {
        await pending;
      } catch (error) {
        if (!shareWasCancelled(error)) presentImage(ready.square, `daily-vitals-${puzzle.date}.png`);
      }
    }
    setToast(copied ? LINK_COPIED_NOTE : "");
    let square = ready.square;
    let story = ready.story;
    if (!square && !story) {
      square = drawCard("square");
      story = drawCard("story");
      prepared.current = {
        square,
        story,
        file: square ? pngFileFromDataUrl(square, `daily-vitals-${puzzle.date}.png`) : null,
      };
    }
    if (square || story) setImages({ square, story });
    setShareReady(true);
  }

  function download(dataUrl: string, name: string) {
    presentImage(dataUrl, name);
  }

  const keyState = (letter: string): TileMark | undefined => {
    let state: TileMark | undefined;
    guesses.forEach((guess, row) => {
      [...guess].forEach((char, col) => {
        if (char !== letter) return;
        const mark = marks[row]?.[col];
        if (mark === "correct") state = "correct";
        else if (mark === "present" && state !== "correct") state = "present";
        else if (!state) state = "absent";
      });
    });
    return state;
  };

  return (
    <div className={`dv-phone ${phase === "start" ? "start" : phase === "play" ? "play" : solved ? "won" : "lost"}`}>
      {phase === "play" ? (
        <div className="dv-playhead">
          <button type="button" className="dv-icon-btn" aria-label="Back to the clue" onClick={() => setPhase("start")}>
            <svg width="10" height="16" viewBox="0 0 10 16" aria-hidden="true">
              <path d="M8.5 1.5 1.5 8l7 6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <h1>DAILY VITALS</h1>
          <div className="dv-step">{triesLeftLabel(guesses.length)}</div>
        </div>
      ) : (
        <header>
          <p className="dv-brand">
            ANYEXAM<em>EASY</em>
          </p>
          <h1 className={`dv-title ${phase === "end" ? "compact" : ""}`}>
            DAILY VITALS<i>.</i>
          </h1>
          {phase === "start" ? (
            <div className="dv-chips">
              <span className="dv-chip teal">{puzzle.boardLabel}</span>
              <span className="dv-chip">Day {puzzle.dayNumber}</span>
              {hydrated && streak > 0 ? <span className="dv-chip gold">🔥 {streak}-day streak</span> : null}
            </div>
          ) : null}
        </header>
      )}

      {phase === "end" ? (
        <div className="dv-hero">
          <div className={solved ? "dv-badge" : "dv-badge miss"}>
            <i />
            {solved ? "Patient stable" : "Still unstable"}
          </div>
          <h2>{solved ? `Saved in ${guesses.length}/6` : "Missed in 6/6"}</h2>
          {hydrated && streak > 0 ? <p className="dv-streak">🔥 {streak}-day streak</p> : null}
        </div>
      ) : null}

      <HeartMonitor reading={reading} />

      {phase === "start" ? (
        <div className="dv-clue">
          <p className="dv-kicker">Today&apos;s clue</p>
          <p>{puzzle.clue}</p>
          <p className="dv-ask">{puzzle.prompt}</p>
          <p className="dv-instruction">One word. Six tries.</p>
        </div>
      ) : phase === "play" ? (
        <p className="dv-mid-clue">{puzzle.prompt}</p>
      ) : null}

      {phase === "start" ? (
        <div className="dv-grid" style={{ ["--dv-cols" as string]: puzzle.length }}>
          <div className="dv-row" aria-hidden="true">
            {Array.from({ length: puzzle.length }, (_, index) => (
              <div key={index} className="dv-tile" />
            ))}
          </div>
        </div>
      ) : (
        <div className="dv-grid" style={{ ["--dv-cols" as string]: puzzle.length }} aria-label="Guesses">
          {guesses.map((guess, row) => (
            <div key={`${guess}-${row}`} className="dv-row">
              {[...guess].map((letter, col) => (
                <div
                  key={`${row}-${col}`}
                  className={`dv-tile ${marks[row]?.[col] ?? ""}`}
                  aria-label={`${letter}, ${marks[row]?.[col] ?? "open"}`}
                >
                  {letter}
                </div>
              ))}
            </div>
          ))}
          {phase === "play" && guesses.length < DAILY_VITALS_TRIES ? (
            <div className={`dv-row ${shake ? "shake" : ""}`}>
              {Array.from({ length: puzzle.length }, (_, col) => (
                <div key={col} className={`dv-tile ${draft[col] ? "filled" : ""}`}>
                  {draft[col] ?? ""}
                </div>
              ))}
            </div>
          ) : null}
          {phase === "play"
            ? Array.from({ length: Math.max(0, DAILY_VITALS_TRIES - guesses.length - 1) }, (_, row) => (
                <div key={`empty-${row}`} className="dv-row" aria-hidden="true">
                  {Array.from({ length: puzzle.length }, (_, col) => (
                    <div key={col} className="dv-tile" />
                  ))}
                </div>
              ))
            : null}
        </div>
      )}

      <p className="dv-note" role="status">
        {note}
      </p>

      {phase === "end" && explanation ? (
        <section className="dv-why" aria-label="Why this case">
          <h3>Why this case</h3>
          {!solved && word ? <p className="dv-answer">The word is {word}.</p> : null}
          <p>{explanation}</p>
        </section>
      ) : null}

      {phase === "play" ? (
        <div className="dv-kb" aria-label="Keyboard">
          {KEY_ROWS.slice(0, 2).map((row) => (
            <div key={row} className="dv-kb-row">
              {[...row].map((letter) => (
                <button
                  key={letter}
                  type="button"
                  className={`dv-key ${keyState(letter) ?? ""}`}
                  onClick={() => typeLetter(letter)}
                >
                  {letter}
                </button>
              ))}
            </div>
          ))}
          <div className="dv-kb-row">
            <button type="button" className="dv-key wide" onClick={() => void submit(draft)}>
              ENTER
            </button>
            {[...KEY_ROWS[2]].map((letter) => (
              <button
                key={letter}
                type="button"
                className={`dv-key ${keyState(letter) ?? ""}`}
                onClick={() => typeLetter(letter)}
              >
                {letter}
              </button>
            ))}
            <button
              type="button"
              className="dv-key wide"
              aria-label="Delete"
              onClick={() => setDraft((current) => current.slice(0, -1))}
            >
              ⌫
            </button>
          </div>
        </div>
      ) : null}

      {phase !== "play" ? (
        <div className="dv-cta">
          {phase === "start" ? (
            <>
              <button type="button" className="dv-btn" onClick={() => setPhase("play")}>
                {guesses.length ? "Resume" : "Start"}
              </button>
              <p className="dv-date-line">
                {puzzle.dateLabel} · {puzzle.archive ? "Earlier case" : "Daily case"}
              </p>
              <p className="dv-device">{STREAK_RULE}</p>
            </>
          ) : (
            <>
              <Link href={puzzle.practiceHref} className="dv-btn">
                Try a practice question on this
              </Link>
              <p className="dv-fine">
                <Link href={puzzle.trialHref}>{puzzle.trialNote}</Link>
              </p>
              <button type="button" className="dv-btn-secondary" onClick={() => void onShare()}>
                Share
              </button>
              {toast ? (
                <p className="dv-toast" role="status">
                  {toast}
                </p>
              ) : null}
              {shareReady ? (
                <div className="dv-share">
                  <div className="dv-share-actions">
                    {images?.story ? (
                      <button
                        type="button"
                        className="dv-btn-secondary"
                        onClick={() => download(images.story, `daily-vitals-${puzzle.date}-story.png`)}
                      >
                        Save story
                      </button>
                    ) : null}
                    {images?.square ? (
                      <button
                        type="button"
                        className="dv-btn-secondary"
                        onClick={() => download(images.square, `daily-vitals-${puzzle.date}-square.png`)}
                      >
                        Save square
                      </button>
                    ) : null}
                  </div>
                  <p className="dv-share-text">{shareText}</p>
                  {/* Data URLs drawn on this device. next/image does not optimize them. */}
                  {images?.square ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={images.square} alt="Square share card, 1080 by 1080. Pattern only, no answer." />
                  ) : null}
                  {images?.story ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={images.story} alt="Story share card, 1080 by 1920. Pattern only, no answer." />
                  ) : null}
                </div>
              ) : null}
              <p className="dv-device">{STREAK_RULE}</p>
            </>
          )}
        </div>
      ) : null}

      <p className="dv-legal">
        {puzzle.legalLines[0]}
        <br />
        {puzzle.legalLines[1]}
      </p>
    </div>
  );
}
