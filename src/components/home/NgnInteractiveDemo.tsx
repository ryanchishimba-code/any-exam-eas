"use client";

import "@/styles/landing-page.css";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { formatTrialCtaLabel } from "@/lib/site";
import { analytics } from "@/lib/analytics";
import { NGN_DEMO_QUESTIONS } from "@/lib/demo/ngn-samples";
import { examQuestionToStudy, isAnswerCorrect } from "@/lib/questions/prepare";
import type { StudyQuestion } from "@/lib/questions/types";
import { bowTieSelectionValid, parseBowTieLayout, parseMatrixKey } from "@/lib/questions/ngn-structures";
import {
  ExplanationPanel,
  QuestionRenderer,
} from "@/components/study/questions/QuestionRenderer";
import { AnswerFeedbackLabel } from "@/components/ui/StatusMessage";

const DEMO_QUESTIONS: StudyQuestion[] = NGN_DEMO_QUESTIONS.map((q, i) =>
  examQuestionToStudy(q, i)
);

const tabs = [
  { id: 0, label: "Bow-tie" },
  { id: 1, label: "Matrix" },
  { id: 2, label: "Unfolding case" },
];

type NgnInteractiveDemoProps = {
  /** Hide page chrome when nested in LandingSamplePractice. */
  embedded?: boolean;
  trialHref?: string;
};

export function NgnInteractiveDemo({
  embedded = false,
  trialHref = "/signup?plan=trial&interval=yearly&tier=pro&exam=nclex",
}: NgnInteractiveDemoProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);

  const question = useMemo(() => DEMO_QUESTIONS[activeTab], [activeTab]);

  function switchTab(id: number) {
    setActiveTab(id);
    setSelected([]);
    setRevealed(false);
  }

  function toggleSelect(option: string) {
    if (revealed) return;
    if (option === "__clear__") {
      setSelected([]);
      return;
    }
    if (question.type === "select_all" || question.type === "highlight") {
      setSelected((prev) =>
        prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
      );
      return;
    }
    if (question.type === "matrix") {
      setSelected((prev) => {
        if (prev.includes(option)) return prev.filter((o) => o !== option);
        const { row } = parseMatrixKey(option);
        return [...prev.filter((o) => parseMatrixKey(o).row !== row), option];
      });
      return;
    }
    if (question.type === "bow_tie") {
      const layout = parseBowTieLayout(question);
      setSelected((prev) => {
        if (prev.includes(option)) return prev.filter((o) => o !== option);
        if (layout.actions.includes(option)) {
          return [...prev.filter((o) => !layout.actions.includes(o)), option];
        }
        if (layout.monitors.includes(option)) {
          const monitors = prev.filter((o) => layout.monitors.includes(o));
          const base =
            monitors.length >= layout.monitorPickCount
              ? prev.filter((o) => o !== monitors[0])
              : prev;
          return [...base.filter((o) => !layout.monitors.includes(o)), option];
        }
        return [...prev, option];
      });
      return;
    }
    setSelected([option]);
  }

  const canCheck =
    selected.length > 0 &&
    (question.type !== "bow_tie" ||
      bowTieSelectionValid(selected, parseBowTieLayout(question))) &&
    (question.type !== "matrix" || selected.length === question.correctAnswers.length);

  const correct = revealed ? isAnswerCorrect(question, selected) : null;

  const player = (
        <div className={embedded ? undefined : "mx-auto mt-5 max-w-3xl"}>
          <div
            className="flex flex-wrap justify-center gap-2"
            role="tablist"
            aria-label="NGN format examples"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => switchTab(tab.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-[var(--color-accent)] text-white shadow-sm"
                    : "border border-black/[0.08] bg-[var(--color-surface-elevated)] text-[var(--color-ink-muted)] hover:border-[var(--color-accent)]/30"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-5 rounded-2xl border border-black/[0.08] bg-[var(--color-surface-elevated)] p-5 shadow-lg shadow-teal-900/[0.04] sm:p-6"
              role="tabpanel"
            >
              <QuestionRenderer
                question={question}
                selected={selected}
                revealed={revealed}
                onToggle={toggleSelect}
              />

              {!revealed ? (
                <button
                  type="button"
                  disabled={!canCheck}
                  onClick={() => {
                    setRevealed(true);
                    analytics.ctaClicked("sample_check_answer_nclex", "hero_practice");
                  }}
                  className="mt-8 w-full rounded-full bg-[var(--color-accent)] py-3.5 text-sm font-semibold text-white disabled:opacity-40 sm:w-auto sm:px-10"
                >
                  Check answer
                </button>
              ) : (
                <div className="mt-6 space-y-4">
                  <AnswerFeedbackLabel correct={correct === true} />
                  <ExplanationPanel question={question} />
                  <button
                    type="button"
                    onClick={() => {
                      setSelected([]);
                      setRevealed(false);
                    }}
                    className="text-sm font-medium text-[var(--color-accent)] hover:underline"
                  >
                    Try again
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {!embedded ? (
            <>
              <p className="mt-6 text-center text-[0.6875rem] leading-relaxed text-[var(--color-ink-muted)]">
                Sample items for demonstration. Full question bank includes OER-backed rationales and
                timed exam and flexible question bank modes.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/full-exam/nclex"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--color-surface-elevated)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-surface)]"
                >
                  Start NCLEX timed exam
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href={trialHref}
                  className="text-sm font-semibold text-[var(--color-accent)] hover:underline"
                >
                  {formatTrialCtaLabel()}
                </Link>
              </div>
            </>
          ) : null}
        </div>
  );

  if (embedded) return player;

  return (
    <section
      id="ngn-demo"
      className="aee-section aee-section-alt scroll-mt-24 py-6 sm:py-7"
      aria-labelledby="ngn-demo-heading"
    >
      <div className="mx-auto max-w-[1080px] px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="aee-badge mx-auto w-fit">
            <Sparkles className="mr-1.5 inline h-3.5 w-3.5" aria-hidden />
            Try it — no signup
          </p>
          <h2 id="ngn-demo-heading" className="aee-display-md mt-3">
            Try real NCLEX question formats —{" "}
            <span className="aee-display-accent">no signup required.</span>
          </h2>
          <p className="aee-lede mx-auto mt-2.5">
            This is the same interactive player used in the app — bow-tie, matrix, and unfolding
            case items like you will see on the NCLEX.
          </p>
        </div>

        {player}
      </div>
    </section>
  );
}
