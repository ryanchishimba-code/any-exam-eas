"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  canonicalizeQuestionBankQuery,
  questionBankQueriesMatch,
} from "@/lib/study/question-bank-filters";

/**
 * Replace a question-bank URL whose subject (or other board filter) does not
 * belong to the active field. `router.replace` drops the stale entry so Back
 * does not restore physiology under an AANP field.
 */
export function CanonicalQuestionBankUrl({ fieldId }: { fieldId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const current = new URLSearchParams(searchParams.toString());
    const canonical = canonicalizeQuestionBankQuery(fieldId, current);
    if (questionBankQueriesMatch(current, canonical)) return;
    const qs = canonical.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [fieldId, pathname, router, searchParams]);

  return null;
}
