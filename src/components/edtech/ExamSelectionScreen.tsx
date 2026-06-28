"use client";

import { useState, useTransition, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  Activity,
  CheckCircle2,
  HelpCircle,
  Pill,
  Scale,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { ExamCard } from "@/components/edtech/ExamCard";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { persistExamPreference } from "@/lib/edtech/actions";
import { fireExamSelectionConfetti } from "@/lib/edtech/confetti";
import { navigateHard } from "@/lib/client/navigate-hard";
import { EXAM_SLUGS, EXAM_CATALOG } from "@/lib/edtech/exams";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type ExamSelectionScreenProps = {
  /** True when user already has a preference and is switching exams */
  switchMode?: boolean;
  currentExam?: ExamSlug | null;
};

const FLOATING_ICONS = [
  { Icon: Stethoscope, className: "left-[8%] top-[18%] text-teal-400/20" },
  { Icon: Activity, className: "right-[12%] top-[22%] text-sky-400/15" },
  { Icon: Pill, className: "left-[15%] bottom-[25%] text-amber-400/15" },
  { Icon: Scale, className: "right-[10%] bottom-[20%] text-violet-400/15" },
  { Icon: Sparkles, className: "left-[45%] top-[12%] text-teal-300/10" },
];

function FloatingBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(20,184,166,0.12),transparent_55%)] dark:bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(45,212,191,0.08),transparent_55%)]" />
      {FLOATING_ICONS.map(({ Icon, className }, i) => (
        <motion.div
          key={i}
          className={cn("absolute", className)}
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, -12, 0],
                  opacity: [0.4, 0.7, 0.4],
                }
          }
          transition={{
            duration: 6 + i * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Icon className="h-10 w-10 sm:h-14 sm:w-14" strokeWidth={1.25} />
        </motion.div>
      ))}
    </div>
  );
}

export function ExamSelectionScreen({
  switchMode = false,
  currentExam = null,
}: ExamSelectionScreenProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState<ExamSlug | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const persistGenerationRef = useRef(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handle = window.setTimeout(() => setDebouncedQuery(searchQuery.trim().toLowerCase()), 250);
    return () => window.clearTimeout(handle);
  }, [searchQuery]);

  const visibleSlugs = useMemo(() => {
    if (!debouncedQuery) return EXAM_SLUGS;
    return EXAM_SLUGS.filter((slug) => {
      const exam = EXAM_CATALOG[slug];
      const haystack = `${exam.name} ${exam.shortName} ${exam.description} ${slug}`.toLowerCase();
      return haystack.includes(debouncedQuery);
    });
  }, [debouncedQuery]);

  function handleSelect(slug: ExamSlug) {
    setError(null);

    // USMLE fans out into Step 1 / Step 2 CK / Step 3 — let the learner pick a
    // step (with live per-step counts) before we lock in their bank.
    if (slug === "usmle") {
      setSelected(slug);
      router.push(ROUTES.selectExamUsmle);
      return;
    }

    setSelected(slug);
    const generation = ++persistGenerationRef.current;
    startTransition(async () => {
      const result = await persistExamPreference(slug);
      if (generation !== persistGenerationRef.current) return;
      if (!result.ok) {
        setError(result.error);
        setSelected(null);
        return;
      }

      try {
        if (!switchMode) {
          await fireExamSelectionConfetti();
        }
        setSuccess(true);
        window.setTimeout(() => {
          navigateHard(ROUTES.dashboard);
        }, switchMode ? 400 : 900);
      } catch {
        setError("Saved your exam, but navigation failed. Opening dashboard…");
        navigateHard(ROUTES.dashboard);
      }
    });
  }

  return (
    <div className="relative min-h-[calc(100vh-var(--page-top))] overflow-hidden bg-[var(--color-bg)]">
      <FloatingBackground />

      <AnimatePresence>
        {success ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/20 backdrop-blur-sm"
            role="status"
            aria-live="polite"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-3xl border border-white/20 bg-white px-10 py-8 text-center shadow-2xl dark:bg-slate-900"
            >
              <CheckCircle2 className="mx-auto h-12 w-12 text-teal-500" aria-hidden />
              <p className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                {switchMode ? "Exam updated!" : "You're all set!"}
              </p>
              <p className="mt-2 text-sm text-slate-500">Opening your Study Hub…</p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-[var(--page-top)] sm:px-8 sm:pb-28">
        {!switchMode ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 flex items-center gap-2"
          >
            <div className="flex gap-1.5">
              {[1, 2, 3].map((step) => (
                <span
                  key={step}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    step === 1 ? "w-8 bg-teal-500" : "w-4 bg-slate-200 dark:bg-slate-700"
                  )}
                />
              ))}
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Step 1 of 3 · Choose your exam
            </span>
          </motion.div>
        ) : (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <Link
              href={ROUTES.practiceHub}
              className="text-sm font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400"
            >
              ← Back to Study Hub
            </Link>
          </motion.div>
        )}

        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">
            Any Exam Easy
          </p>
          <h1 className="mt-4 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-800 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent dark:from-white dark:via-slate-100 dark:to-teal-300 sm:text-5xl md:text-6xl">
            Choose Your Exam
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600 dark:text-slate-400 sm:text-xl">
            {switchMode
              ? "Switch your primary exam — Study Hub, topics, and analytics will update instantly."
              : "Professional, adaptive prep for the exams that matter most."}
          </p>
          {switchMode && currentExam ? (
            <p className="mt-2 text-sm text-slate-500">
              Currently preparing for{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {currentExam.toUpperCase()}
              </span>
            </p>
          ) : null}
        </motion.header>

        {error ? (
          <div className="mx-auto mt-8 max-w-lg">
            <StatusMessage variant="error">{error}</StatusMessage>
          </div>
        ) : null}

        <div className="mx-auto mt-10 max-w-md">
          <label htmlFor="exam-search" className="sr-only">
            Search exams
          </label>
          <input
            id="exam-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exams (e.g. NCLEX, FNP, NAPLEX)…"
            className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none ring-teal-500/30 placeholder:text-slate-400 focus:border-teal-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-900/80 dark:text-white"
            autoComplete="off"
          />
          {debouncedQuery && visibleSlugs.length === 0 ? (
            <p className="mt-3 text-center text-sm text-slate-500">No exams match your search.</p>
          ) : null}
        </div>

        <div
          className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 sm:gap-6 lg:gap-7"
          role="list"
          aria-label="Available exams"
        >
          {visibleSlugs.map((slug, index) => (
            <div key={slug} role="listitem" className="h-full">
              <ExamCard
                slug={slug}
                index={index}
                disabled={pending}
                selected={selected === slug}
                onSelect={handleSelect}
              />
            </div>
          ))}
        </div>

        <motion.footer
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mx-auto mt-12 flex max-w-lg flex-col items-center gap-3 text-center"
        >
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-teal-600 dark:hover:text-teal-400"
          >
            <HelpCircle className="h-4 w-4" aria-hidden />
            Not sure which exam? Compare plans &amp; features
          </Link>
          <p className="text-xs text-slate-400">
            You can switch exams anytime from the header or Study Hub.
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
