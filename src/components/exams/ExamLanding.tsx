"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Clock,
  Pill,
  Scale,
  Stethoscope,
  Zap,
} from "lucide-react";
import { ExamCard } from "@/components/exams/ExamCard";
import { MpjeStateSelect } from "@/components/study/MpjeStateSelect";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/Button";
import { getExamHub } from "@/lib/exams/catalog";
import { mpjePracticeExamHref, mpjePracticeHref } from "@/lib/study-hub/config";
import { practiceHref, ROUTES, type ExamRouteSlug } from "@/lib/routes";
import { cn } from "@/lib/utils";

const ICONS = {
  nclex: Activity,
  usmle: Stethoscope,
  naplex: Pill,
  mpje: Scale,
} as const;

type Props = { slug: ExamRouteSlug };

export function ExamLanding({ slug }: Props) {
  const hub = getExamHub(slug);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mpjeState, setMpjeState] = useState("");

  const syncMpjeState = useCallback(
    (code: string) => {
      setMpjeState(code);
      const qs = new URLSearchParams(searchParams.toString());
      if (code) {
        qs.set("state", code);
      } else {
        qs.delete("state");
      }
      const q = qs.toString();
      router.replace(q ? `/exams/mpje?${q}` : "/exams/mpje", { scroll: false });
    },
    [router, searchParams]
  );

  useEffect(() => {
    if (slug !== "mpje") return;
    const s = searchParams.get("state");
    setMpjeState(s && s.length === 2 ? s.toUpperCase() : "");
  }, [searchParams, slug]);

  if (!hub) return null;

  const Icon = ICONS[slug];

  return (
    <div className="mx-auto max-w-5xl px-5 pb-20 pt-[var(--page-top)] sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link
          href={ROUTES.practiceHub}
          className="text-sm font-medium text-[var(--color-ink-muted)] transition hover:text-[var(--color-accent)]"
        >
          ← Practice Hub
        </Link>

        <div className="mt-6 flex flex-wrap items-start gap-4">
          <span
            className={cn(
              "inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-sm ring-1 ring-black/[0.04]",
              hub.accentClass
            )}
          >
            <Icon className="h-7 w-7 text-[var(--color-ink)]" strokeWidth={1.5} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Exam prep
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl">
              {hub.title}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-ink-muted)]">
              {hub.subtitle}
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--color-ink-muted)]">{hub.questionBankLabel}</p>
          </div>
        </div>
      </motion.div>

      {slug === "mpje" && (
        <section className="mt-10 aee-card p-6" aria-labelledby="mpje-state">
          <h2 id="mpje-state" className="text-lg font-semibold text-[var(--color-ink)]">
            State jurisdiction
          </h2>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            Select your board state for state-specific pharmacy law, or leave blank for federal-only
            questions.
          </p>
          <div className="mt-5 max-w-md">
            <MpjeStateSelect value={mpjeState} onChange={syncMpjeState} />
          </div>
          {!mpjeState && (
            <div className="mt-6">
              <EmptyState
                variant="info"
                icon={Scale}
                title="Federal pharmacy law mode"
                description="No state selected — practice questions use DEA, FDA, HIPAA, and uniform MPJE content only."
              />
            </div>
          )}
        </section>
      )}

      <section className="mt-10" aria-labelledby="practice-modes">
        <h2 id="practice-modes" className="text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          Start practicing
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ModeTile
            icon={Zap}
            title="Adaptive practice"
            description="Personalized question mix based on your weak areas."
            href={
              slug === "mpje"
                ? mpjePracticeHref({ mode: "bank", stateCode: mpjeState || undefined })
                : practiceHref(slug, { mode: "bank" })
            }
          />
          <ModeTile
            icon={Clock}
            title="Timed simulation"
            description="Board-length session with per-question timer."
            href={
              slug === "mpje"
                ? mpjePracticeHref({ mode: "timed", stateCode: mpjeState || undefined })
                : practiceHref(slug, { mode: "timed" })
            }
          />
          {slug === "mpje" && (
            <ModeTile
              icon={BookOpen}
              title="Full practice exam"
              description="120 questions · 2.5 hours · flag & review."
              href={mpjePracticeExamHref(mpjeState || undefined)}
              accent
            />
          )}
        </div>
      </section>

      <section className="mt-12 border-t border-[var(--color-border)] pt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          Other exams
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {(["nclex", "naplex", "usmle", "mpje"] as ExamRouteSlug[])
            .filter((s) => s !== slug)
            .slice(0, 3)
            .map((s) => {
              const h = getExamHub(s)!;
              const OtherIcon = ICONS[s];
              return (
                <ExamCard
                  key={s}
                  href={`/exams/${s}`}
                  title={h.title}
                  description={h.subtitle}
                  stat={h.questionBankLabel}
                  icon={OtherIcon}
                  accentClass={h.accentClass}
                />
              );
            })}
        </div>
      </section>
    </div>
  );
}

function ModeTile({
  icon: Icon,
  title,
  description,
  href,
  accent,
}: {
  icon: typeof Zap;
  title: string;
  description: string;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "aee-card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-md",
        accent && "border-indigo-200/80 bg-gradient-to-br from-indigo-50/50 to-white"
      )}
    >
      <Icon
        className={cn("h-5 w-5", accent ? "text-indigo-600" : "text-[var(--color-ink-muted)]")}
        strokeWidth={1.75}
        aria-hidden
      />
      <p className="mt-3 font-semibold text-[var(--color-ink)]">{title}</p>
      <p className="mt-1 flex-1 text-sm text-[var(--color-ink-muted)]">{description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent)]">
        Launch
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}
