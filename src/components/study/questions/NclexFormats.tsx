"use client";

import { figureFitsQuestion } from "@/lib/questions/student-display-text";
import type { StudyQuestion } from "@/lib/questions/types";
import type { ExhibitFigureRef } from "@/lib/exam-prep/exhibit-figure";
import { ExhibitTable } from "./NaplexFormats";
import { ExhibitMedia } from "./ExhibitMedia";

/** Stem exhibits for NCLEX — media and/or lab tables without requiring kind=exhibit. */
export function NclexExhibitBlock({ question }: { question: StudyQuestion }) {
  const media = ((question.ngnPayload as { media?: ExhibitFigureRef[] } | undefined)?.media ?? []).filter(
    (figure) =>
      figure.reviewStatus === "approved" &&
      figureFitsQuestion(`${figure.alt} ${figure.caption ?? ""}`, `${question.vignette ?? ""}\n${question.stem}`)
  );
  const hasMedia = media.length > 0;
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
