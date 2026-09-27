import { RATIONALE_STUDY_NOTE } from "@/lib/marketing/legal-copy";

/** Small study-use line under a rationale or sample question. */
export function StudyUseNote({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-[var(--color-ink-muted)] ${className}`.trim()}>
      {RATIONALE_STUDY_NOTE}
    </p>
  );
}
