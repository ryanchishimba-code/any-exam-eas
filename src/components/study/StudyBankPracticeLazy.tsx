"use client";

import { useEffect, type ComponentProps } from "react";
import { StudyBankPractice } from "./StudyBankPractice";

/**
 * Thin wrapper around StudyBankPractice.
 * Static import keeps the hub in the main bundle so first paint is the real UI
 * (not an empty dynamic() chunk wait). Session player stays code-split inside.
 */
export function StudyBankPracticeLazy(
  props: ComponentProps<typeof StudyBankPractice>
) {
  useEffect(() => {
    try {
      sessionStorage.removeItem("aee:qb-error-auto-retry");
    } catch {
      /* ignore */
    }
  }, []);

  const scopeKey = `${props.preferredExamSlug ?? "open"}:${props.initialFieldId ?? "default"}`;
  return <StudyBankPractice key={scopeKey} {...props} />;
}
