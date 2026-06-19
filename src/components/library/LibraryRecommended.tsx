"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookMarked, Target } from "lucide-react";
import { practiceTopicHref } from "@/lib/edtech/practice-links";
import { getPinnedMemoryCardIds } from "@/lib/library/pinned-essentials";
import { useSessionTone } from "@/lib/library/session-tone";
import { useLibraryMotion } from "@/lib/library/use-library-motion";
import { libUi } from "@/lib/library/library-ui";
import type { WeakTopicRow } from "@/lib/learning/student-dashboard";
import type { MemoryCard } from "@/lib/library/types";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: ExamSlug;
  weakTopics: WeakTopicRow[];
  cards: MemoryCard[];
  onOpenCard: (card: MemoryCard) => void;
};

const MAX_RECOMMENDATIONS = 3;

/** A recommendation is either a weak topic (→ practice) or an essential card (→ open). */
type Recommendation =
  | { kind: "topic"; key: string; title: string; slug: string; mastery: number }
  | { kind: "card"; key: string; title: string; subject: string; card: MemoryCard };

function buildRecommendations(
  examSlug: ExamSlug,
  weakTopics: WeakTopicRow[],
  cards: MemoryCard[]
): Recommendation[] {
  const recs: Recommendation[] = [];

  // 1. Lead with weak areas — the highest-impact place to practice next.
  for (const topic of weakTopics.slice(0, MAX_RECOMMENDATIONS)) {
    const slug = topic.id.replace(/^(tag|subject):/, "");
    recs.push({
      kind: "topic",
      key: topic.id,
      title: topic.name,
      slug,
      mastery: topic.masteryScore,
    });
  }

  // 2. Backfill with pinned high-yield essentials so new learners still get picks.
  if (recs.length < MAX_RECOMMENDATIONS) {
    const byId = new Map(cards.map((c) => [c.id, c]));
    for (const id of getPinnedMemoryCardIds(examSlug)) {
      if (recs.length >= MAX_RECOMMENDATIONS) break;
      const card = byId.get(id);
      if (!card) continue;
      recs.push({ kind: "card", key: card.id, title: card.title, subject: card.subject, card });
    }
  }

  return recs.slice(0, MAX_RECOMMENDATIONS);
}

export function LibraryRecommended({ examSlug, weakTopics, cards, onOpenCard }: Props) {
  const { copy } = useSessionTone();
  const { container, item, hover, spring } = useLibraryMotion();
  const recommendations = buildRecommendations(examSlug, weakTopics, cards);

  if (recommendations.length === 0) return null;

  return (
    <section aria-labelledby="library-recommended-heading" className="space-y-3.5">
      <div className="flex items-center gap-2 px-0.5">
        <Target className="h-4 w-4 text-[var(--color-accent)]" aria-hidden />
        <h2 id="library-recommended-heading" className={libUi.sectionTitle}>
          {copy.recommendedHeading}
        </h2>
      </div>

      <motion.div
        variants={container.variants}
        initial={container.initial}
        animate={container.animate}
        className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {recommendations.map((rec) =>
          rec.kind === "topic" ? (
            <motion.article
              key={rec.key}
              variants={item.variants}
              whileHover={hover}
              transition={spring}
              className="flex flex-col rounded-[20px] border border-black/[0.05] bg-white p-5 shadow-[var(--shadow-apple-sm)] transition-shadow hover:shadow-[var(--shadow-apple-md)]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
                  Weak area
                </span>
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold tabular-nums text-amber-900">
                  {rec.mastery}%
                </span>
              </div>
              <h3 className="mt-2 text-[17px] font-semibold leading-snug tracking-tight text-[var(--color-ink)]">
                {rec.title}
              </h3>
              <p className={cn(libUi.sectionHint, "mt-1.5 flex-1 leading-relaxed")}>
                {copy.recommendationReason(rec.title, rec.mastery)}
              </p>
              <Link
                href={practiceTopicHref(examSlug, rec.slug, 10)}
                className="group mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--color-accent)] px-3.5 py-2.5 text-[13px] font-semibold text-white shadow-[var(--shadow-apple-btn)] transition-opacity hover:opacity-95"
              >
                Start 10 questions
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </motion.article>
          ) : (
            <motion.article
              key={rec.key}
              variants={item.variants}
              whileHover={hover}
              transition={spring}
              className="flex flex-col rounded-[20px] border border-black/[0.05] bg-white p-5 shadow-[var(--shadow-apple-sm)] transition-shadow hover:shadow-[var(--shadow-apple-md)]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
                  Essential
                </span>
                <span className="rounded-full bg-black/[0.04] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-ink-muted)]">
                  {rec.subject}
                </span>
              </div>
              <h3 className="mt-2 text-[17px] font-semibold leading-snug tracking-tight text-[var(--color-ink)]">
                {rec.title}
              </h3>
              <p className={cn(libUi.sectionHint, "mt-1.5 flex-1 leading-relaxed")}>
                {copy.essentialReason}
              </p>
              <button
                type="button"
                onClick={() => onOpenCard(rec.card)}
                className="group mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/[0.06] px-3.5 py-2.5 text-[13px] font-semibold text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)]/[0.1]"
              >
                <BookMarked className="h-3.5 w-3.5" aria-hidden />
                Open card
              </button>
            </motion.article>
          )
        )}
      </motion.div>
    </section>
  );
}
