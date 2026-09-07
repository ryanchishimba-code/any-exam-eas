"use client";

import type { StudyQuestion } from "@/lib/questions/types";
import type { ExhibitFigureRef } from "@/lib/exam-prep/exhibit-figure";
import { ExhibitTable } from "./NaplexFormats";
import { ExhibitMedia } from "./ExhibitMedia";

/** Stem exhibits for NCLEX — media and/or lab tables without requiring kind=exhibit. */
export function NclexExhibitBlock({ question }: { question: StudyQuestion }) {
  const media = (question.ngnPayload as { media?: ExhibitFigureRef[] } | undefined)?.media;
  const hasMedia = Array.isArray(media) && media.some((m) => m.reviewStatus === "approved");
  const hasTable = Boolean(
    (question.ngnPayload as { table?: { headers?: unknown[] } } | undefined)?.table?.headers
      ?.length
  );

  if (!hasMedia && !hasTable) return null;

  return (
    <div className="mb-1">
      {hasMedia ? <ExhibitMedia figures={media!} /> : null}
      {hasTable ? <ExhibitTable question={question} /> : null}
    </div>
  );
}
