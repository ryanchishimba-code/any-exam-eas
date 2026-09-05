"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BoardScrollPicker, type BoardPickerItem } from "@/components/marketing/BoardScrollPicker";
import { LANDING_EXAMS, landingTrialHrefForExam } from "@/lib/landing/content";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";
import { analytics } from "@/lib/analytics";
import { formatTrialCtaLabel } from "@/lib/site";

const SHORT_LABEL: Record<string, string> = {
  usmle: "USMLE",
  nclex: "NCLEX",
  naplex: "NAPLEX",
  pance: "PANCE",
  "aanp-fnp": "AANP FNP",
  "npte-pt": "NPTE-PT",
};

type ChooseYourExamProps = {
  bankCounts?: LandingBankCountsDisplay;
};

export function ChooseYourExam({ bankCounts }: ChooseYourExamProps) {
  // Merge static exam metadata with live per-exam counts (keyed by stable slug).
  const exams = useMemo(() => {
    return LANDING_EXAMS.map((exam) => {
      const live = bankCounts?.exams.find((row) => row.slug === exam.id);
      const shortLabel = SHORT_LABEL[exam.id] ?? exam.label;
      return {
        id: exam.id,
        shortLabel,
        fullLabel: exam.label,
        blurb: exam.blurb,
        href: exam.href,
        color: exam.color,
        icon: exam.icon,
        countLabel: live?.countLabel ?? "—",
        questionsLabel: live?.questionsLabel ?? `${live?.countLabel ?? "—"} questions`,
      };
    });
  }, [bankCounts]);

  const [selectedId, setSelectedId] = useState(exams[0]?.id ?? "usmle");
  const selected = exams.find((e) => e.id === selectedId) ?? exams[0];

  const pickerItems: BoardPickerItem[] = exams.map((exam) => ({
    id: exam.id,
    name: exam.shortLabel,
    description: exam.blurb,
    count: exam.countLabel,
    accent: exam.color,
  }));

  const SelectedIcon = selected?.icon;

  return (
    <section
      id="choose-exam"
      className="aee-pick-board scroll-mt-24 py-[var(--landing-section-py)]"
      aria-labelledby="choose-exam-heading"
    >
      <div className="aee-flagship-inner">
        <div className="mx-auto max-w-3xl text-center">
          <p className="aee-flagship-eyebrow">Pick your board</p>
          <h2 id="choose-exam-heading" className="aee-choose-exam__headline">
            Six exams.{" "}
            <span className="aee-flagship-gradient-text">Zero extra checkout.</span>
          </h2>
          <p className="aee-flagship-subtitle mx-auto mt-4 max-w-2xl">
            Spin the wheel to explore each board — blueprint Roadmaps, timed full exams, and
            QA-gated rationales, all on one plan.
          </p>
        </div>

        <div className="aee-pick-board__layout">
          <BoardScrollPicker
            items={pickerItems}
            selectedId={selectedId}
            onSelect={setSelectedId}
            ariaLabel="Choose a board exam"
          />

          {selected ? (
            <div
              className="aee-pick-board__summary"
              style={{ ["--summary-accent" as string]: selected.color } as CSSProperties}
            >
              <span className="aee-pick-board__summary-bar" aria-hidden />
              {SelectedIcon ? (
                <span className="aee-pick-board__summary-icon">
                  <SelectedIcon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                </span>
              ) : null}

              <h3 className="aee-pick-board__summary-title">{selected.shortLabel}</h3>
              <p className="aee-pick-board__summary-desc">{selected.blurb}</p>

              <div className="aee-pick-board__summary-stats">
                <span className="aee-pick-board__stat aee-pick-board__stat--questions">
                  <span className="aee-pick-board__stat-value">{selected.countLabel}</span>
                  <span className="aee-pick-board__stat-label">serve-ready questions</span>
                </span>
                <span className="aee-pick-board__stat">
                  <span className="aee-pick-board__stat-value">QA-gated</span>
                  <span className="aee-pick-board__stat-label">no bulk filler</span>
                </span>
              </div>

              <Link
                href={landingTrialHrefForExam(selected.id)}
                className="aee-pick-board__summary-cta group"
                aria-label={`Start ${selected.shortLabel} free trial`}
                onClick={() => analytics.ctaClicked(`choose_exam_${selected.id}`, "choose_exam")}
              >
                {formatTrialCtaLabel()}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>

              <Link
                href={selected.href}
                prefetch={false}
                className="mt-3 inline-flex items-center justify-center text-sm font-semibold text-[var(--color-ink-muted)] transition hover:text-[var(--color-ink)]"
              >
                Learn more about {selected.shortLabel}
              </Link>

              <p className="aee-pick-board__summary-note">
                Switch boards anytime — all six exams included on one subscription.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
