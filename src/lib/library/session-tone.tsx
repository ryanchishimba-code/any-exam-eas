"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Session Tone Modes
 * ------------------
 * A single, lightweight personalization layer that changes the *language* of
 * the Library (greetings, prompts, feedback) without ever changing the layout
 * or adding UI complexity. Tone is persisted per-browser and is instantly
 * reversible.
 */
export type SessionToneId = "coach" | "professional" | "companion" | "exam";

/** All tone-adjustable copy lives here so messaging stays consistent + easy to maintain. */
export type SessionToneCopy = {
  /** Friendly greeting using the learner's first name. */
  greeting: (firstName: string) => string;
  /** Short note about the current study streak. */
  streakNote: (days: number) => string;
  /** Label for the big primary "start studying" button. */
  quickStartLabel: string;
  /** One-line supporting hint under the primary button. */
  quickStartHint: string;
  /** Heading for the recommendations row. */
  recommendedHeading: string;
  /** Personal reason shown on a recommended (weak-area) card. */
  recommendationReason: (topic: string, mastery: number) => string;
  /** Reason shown on a recommended high-yield essential card. */
  essentialReason: string;
  /** Encouraging line shown after opening / saving a card. */
  cardSaved: string;
  /** Empty state when the library filter returns nothing. */
  emptyLibrary: string;
  /** Example: feedback after a correct answer (consumed by the question UI). */
  feedbackCorrect: string;
  /** Example: feedback after an incorrect answer. */
  feedbackIncorrect: string;
  /** Example: end-of-set summary. */
  sessionComplete: (correct: number, total: number) => string;
};

export type SessionTone = {
  id: SessionToneId;
  /** Full name used in the selector tooltip / aria. */
  label: string;
  /** Compact label used on the pill. */
  short: string;
  /** One-line description of the tone. */
  description: string;
  copy: SessionToneCopy;
};

/**
 * The four supported tones. Copy intentionally stays concise in every mode —
 * "Exam Ready" is the most minimal, "Motivational Coach" the warmest — so the
 * personality supports the experience without adding noise.
 */
export const SESSION_TONES: Record<SessionToneId, SessionTone> = {
  coach: {
    id: "coach",
    label: "Motivational Coach",
    short: "Coach",
    description: "Warm, encouraging, and celebratory.",
    copy: {
      greeting: (name) => `Let's go, ${name} — you've got this!`,
      streakNote: (days) =>
        days > 0
          ? `${days}-day streak going strong. Keep the momentum!`
          : "Today's a great day to start a new streak.",
      quickStartLabel: "Start a quick win",
      quickStartHint: "A focused 10-question set to build momentum.",
      recommendedHeading: "Picked just for you",
      recommendationReason: (topic, mastery) =>
        `A little practice here lifts your ${topic} fast — you're at ${mastery}%.`,
      essentialReason: "A high-yield essential worth locking in today.",
      cardSaved: "Saved! Great choice — we'll keep it handy for you.",
      emptyLibrary: "Nothing here yet — try another filter and keep exploring!",
      feedbackCorrect: "Great work — that's exactly right!",
      feedbackIncorrect: "Not quite, but every miss is progress. Let's review it together.",
      sessionComplete: (correct, total) =>
        `Amazing effort — ${correct}/${total}! You're doing great.`,
    },
  },
  professional: {
    id: "professional",
    label: "Focused Professional",
    short: "Focused",
    description: "Calm, concise, and respectful.",
    copy: {
      greeting: (name) => `Welcome back, ${name}.`,
      streakNote: (days) =>
        days > 0 ? `Current streak: ${days} days.` : "No active streak.",
      quickStartLabel: "Start session",
      quickStartHint: "A focused 10-question set.",
      recommendedHeading: "Recommended for you",
      recommendationReason: (topic, mastery) =>
        `${topic} is below target at ${mastery}%. Recommended focus.`,
      essentialReason: "A high-yield essential aligned to your blueprint.",
      cardSaved: "Saved to your favorites.",
      emptyLibrary: "No cards match the current filter.",
      feedbackCorrect: "Correct.",
      feedbackIncorrect: "Incorrect. Review the rationale below.",
      sessionComplete: (correct, total) => `Session complete: ${correct}/${total}.`,
    },
  },
  companion: {
    id: "companion",
    label: "Casual Companion",
    short: "Casual",
    description: "Friendly and relaxed.",
    copy: {
      greeting: (name) => `Hey ${name}, good to see you!`,
      streakNote: (days) =>
        days > 0 ? `Nice — that's ${days} days in a row.` : "Let's kick off a new streak today.",
      quickStartLabel: "Do a quick set",
      quickStartHint: "Just 10 questions to warm up.",
      recommendedHeading: "Some picks for you",
      recommendationReason: (topic, mastery) =>
        `${topic} could use a little love — you're around ${mastery}%.`,
      essentialReason: "A handy essential to keep fresh.",
      cardSaved: "Got it — saved for later!",
      emptyLibrary: "Hmm, nothing here. Try a different filter?",
      feedbackCorrect: "Nice one — that's right!",
      feedbackIncorrect: "Ah, not this time. Let's take a look.",
      sessionComplete: (correct, total) => `Done! ${correct}/${total} — solid work.`,
    },
  },
  exam: {
    id: "exam",
    label: "Exam Ready",
    short: "Exam",
    description: "Direct, minimal, test-day realistic.",
    copy: {
      greeting: (name) => `${name} — let's get to work.`,
      streakNote: (days) => (days > 0 ? `${days}-day streak.` : "No streak yet."),
      quickStartLabel: "Begin 10-question drill",
      quickStartHint: "Test-day pacing, no frills.",
      recommendedHeading: "Priority topics",
      recommendationReason: (topic, mastery) => `${topic}: ${mastery}%. Prioritize.`,
      essentialReason: "High-yield. Review.",
      cardSaved: "Saved.",
      emptyLibrary: "No matches.",
      feedbackCorrect: "Correct.",
      feedbackIncorrect: "Incorrect.",
      sessionComplete: (correct, total) => `Score: ${correct}/${total}.`,
    },
  },
};

export const SESSION_TONE_ORDER: SessionToneId[] = [
  "coach",
  "professional",
  "companion",
  "exam",
];

const DEFAULT_TONE_ID: SessionToneId = "coach";
const STORAGE_KEY = "aee-session-tone";

function isToneId(value: string | null): value is SessionToneId {
  return value === "coach" || value === "professional" || value === "companion" || value === "exam";
}

type SessionToneContextValue = {
  toneId: SessionToneId;
  tone: SessionTone;
  /** Tone-adjusted copy for the active tone (shortcut for `tone.copy`). */
  copy: SessionToneCopy;
  setTone: (id: SessionToneId) => void;
};

const SessionToneContext = createContext<SessionToneContextValue>({
  toneId: DEFAULT_TONE_ID,
  tone: SESSION_TONES[DEFAULT_TONE_ID],
  copy: SESSION_TONES[DEFAULT_TONE_ID].copy,
  setTone: () => {},
});

export function SessionToneProvider({ children }: { children: ReactNode }) {
  // Start from the default so server + first client render match (no hydration
  // mismatch). The persisted choice is applied immediately after mount.
  const [toneId, setToneId] = useState<SessionToneId>(DEFAULT_TONE_ID);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isToneId(stored)) setToneId(stored);
    } catch {
      /* ignore storage errors */
    }
  }, []);

  const setTone = useCallback((id: SessionToneId) => {
    setToneId(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* ignore storage errors */
    }
  }, []);

  const value = useMemo<SessionToneContextValue>(
    () => ({
      toneId,
      tone: SESSION_TONES[toneId],
      copy: SESSION_TONES[toneId].copy,
      setTone,
    }),
    [toneId, setTone]
  );

  return <SessionToneContext.Provider value={value}>{children}</SessionToneContext.Provider>;
}

/** Read the active session tone + its copy. Safe to call anywhere under the provider. */
export function useSessionTone(): SessionToneContextValue {
  return useContext(SessionToneContext);
}
