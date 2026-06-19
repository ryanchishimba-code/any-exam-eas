"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import type { LibraryHubStats } from "@/components/library/LibraryHubHeader";
import { LibraryWelcome } from "@/components/library/LibraryWelcome";
import { LibraryRecommended } from "@/components/library/LibraryRecommended";
import { LibraryCollection } from "@/components/library/LibraryCollection";
import { LibraryProgress } from "@/components/library/LibraryProgress";
import { SessionToneSelector } from "@/components/library/SessionToneSelector";
import { MemoryCardSheet } from "@/components/library/MemoryCardSheet";
import { StudyPageHeader } from "@/components/study/StudyPageHeader";
import { practiceTopicHref } from "@/lib/edtech/practice-links";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { applyMasteryStore, readMasteryStore } from "@/lib/library/card-mastery";
import { syncCardMasteryForExam } from "@/lib/library/card-mastery-sync";
import { rememberMemoryCard } from "@/lib/library/recent-cards";
import { SessionToneProvider } from "@/lib/library/session-tone";
import { useLibraryMotion } from "@/lib/library/use-library-motion";
import { libUi } from "@/lib/library/library-ui";
import { ROUTES } from "@/lib/routes";
import type { MemoryCard } from "@/lib/library/types";
import type { WeakTopicRow } from "@/lib/learning/student-dashboard";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: ExamSlug;
  userName?: string | null;
  cards: MemoryCard[];
  subjects: string[];
  weakTopics: WeakTopicRow[];
  hubStats: LibraryHubStats;
  initialCardId?: string;
  topicKey?: string;
};

/** Turn a topic slug deep-link into a friendly initial search query. */
function topicKeyToQuery(topicKey?: string): string {
  if (!topicKey) return "";
  return topicKey
    .replace(/^(tag|subject):/, "")
    .replace(/[-_]+/g, " ")
    .trim();
}

export function LibraryHubClient({
  examSlug,
  userName,
  cards,
  subjects,
  weakTopics,
  hubStats,
  initialCardId,
  topicKey,
}: Props) {
  const [query, setQuery] = useState(() => topicKeyToQuery(topicKey));
  const [selected, setSelected] = useState<MemoryCard | null>(null);
  const motionProps = useLibraryMotion();

  // Merge local + server card mastery once per exam.
  useEffect(() => {
    void syncCardMasteryForExam({
      examSlug,
      readLocal: readMasteryStore,
      writeLocal: (slug, store) => applyMasteryStore(slug, store),
    });
  }, [examSlug]);

  const openCard = useCallback(
    (card: MemoryCard) => {
      rememberMemoryCard(card.id, examSlug);
      setSelected(card);
    },
    [examSlug]
  );

  // Honor `?card=` deep links.
  useEffect(() => {
    if (!initialCardId) return;
    const match = cards.find((c) => c.id === initialCardId);
    if (match) openCard(match);
  }, [cards, initialCardId, openCard]);

  // Honor `?topic=` deep links by scrolling to the (pre-filtered) collection.
  useEffect(() => {
    if (!topicKey) return;
    const el = document.getElementById("library-collection");
    if (!el) return;
    const timer = window.setTimeout(
      () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
      350
    );
    return () => window.clearTimeout(timer);
  }, [topicKey]);

  // The single primary action: a quick set on the weakest topic, else a mixed set.
  const primaryHref = useMemo(() => {
    const weakestSlug = weakTopics[0]?.id.replace(/^(tag|subject):/, "");
    return practiceTopicHref(examSlug, weakestSlug ?? "mixed", 10);
  }, [examSlug, weakTopics]);

  const examName = EXAM_CATALOG[examSlug]?.shortName ?? examSlug.toUpperCase();

  return (
    <SessionToneProvider>
      <div className={cn(libUi.page, "space-y-4 sm:space-y-5")}>
        <StudyPageHeader
          eyebrow="Library"
          title={`${examName} Study Library`}
          subtitle="Memory cards, weak topics, and personalized study recommendations."
          breadcrumbs={[{ label: "Dashboard", href: ROUTES.dashboard }]}
        />

        {/* Sticky search bar + tone selector. */}
        <div className={libUi.stickyBar}>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-muted)]"
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your library…"
                aria-label="Search your library"
                className="w-full rounded-full border border-black/[0.08] bg-white py-2.5 pl-9 pr-9 text-[14px] text-[var(--color-ink)] shadow-[var(--shadow-apple-sm)] outline-none transition placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-accent)]/40 focus:shadow-[0_0_0_3px_rgba(79,70,229,0.18)]"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[var(--color-ink-muted)] hover:bg-black/[0.05] hover:text-[var(--color-ink)]"
                >
                  <X className="h-3.5 w-3.5" aria-hidden />
                </button>
              ) : null}
            </div>
            <div className="flex items-center justify-end">
              <SessionToneSelector />
            </div>
          </div>
        </div>

        {/* Sections reveal in a calm, staggered sequence on first load. */}
        <motion.div
          variants={motionProps.container.variants}
          initial={motionProps.container.initial}
          animate={motionProps.container.animate}
          className="space-y-4 sm:space-y-6"
        >
          <motion.div variants={motionProps.item.variants}>
            <LibraryWelcome
              userName={userName}
              streakDays={hubStats.studyStreakDays}
              primaryHref={primaryHref}
            />
          </motion.div>

          <motion.div variants={motionProps.item.variants}>
            <LibraryRecommended
              examSlug={examSlug}
              weakTopics={weakTopics}
              cards={cards}
              onOpenCard={openCard}
            />
          </motion.div>

          <motion.div variants={motionProps.item.variants}>
            <LibraryCollection
              examSlug={examSlug}
              cards={cards}
              subjects={subjects}
              weakTopics={weakTopics}
              query={query}
              onOpenCard={openCard}
            />
          </motion.div>

          <motion.div variants={motionProps.item.variants}>
            <LibraryProgress examSlug={examSlug} weakTopics={weakTopics} stats={hubStats} />
          </motion.div>
        </motion.div>

        <MemoryCardSheet
          card={selected}
          allCards={cards}
          examSlug={examSlug}
          open={selected !== null}
          onClose={() => setSelected(null)}
          onOpenRelated={openCard}
        />
      </div>
    </SessionToneProvider>
  );
}
