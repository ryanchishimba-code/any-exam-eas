import { redirect } from "next/navigation";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import {
  examSlugForFieldId,
  fieldIdForExamSlug,
  resolveCanonicalPracticeFieldId,
  resolveQuestionBankFieldId,
} from "@/lib/edtech/question-bank-scope";
import { isUsmleFieldId, usmleStepDefinition } from "@/lib/exam-prep/usmle/steps";
import { ROUTES } from "@/lib/routes";
import {
  canonicalQuestionBankHref,
  questionBankPageFieldId,
} from "@/lib/study/question-bank-filters";
import type { ExamSlug } from "@/types/edtech";

function searchRecordToParams(
  sp: Record<string, string | string[] | undefined>
): URLSearchParams {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (Array.isArray(value)) {
      const first = value[0];
      if (first != null) qs.set(key, first);
    } else if (value != null) {
      qs.set(key, value);
    }
  }
  return qs;
}

export type QuestionBankRoute = {
  examSlug: ExamSlug;
  fieldParam: string;
  usmleStepLabel?: string;
};

/** Auth + search-param normalization must run outside Suspense so redirects are not swallowed. */
export async function resolveQuestionBankRoute(
  userId: string,
  sp: Record<string, string | string[] | undefined>
): Promise<QuestionBankRoute> {
  const pref = await getUserExamPreference(userId);
  if (!pref) redirect(ROUTES.selectExam);

  const examSlug = pref.examSlug;
  let savedFieldId = fieldIdForExamSlug(examSlug);
  if (examSlug === "usmle") {
    savedFieldId = await resolveCanonicalPracticeFieldId(userId, examSlug);
  }

  const requestedField = sp.field ? resolveQuestionBankFieldId(String(sp.field)) : null;
  // Explicit ?field= wins for this page. Only a missing or unknown field
  // falls back to the saved board. A subject from another board is dropped
  // against the page field — the saved board must not replace ?field=.
  const fieldParam = questionBankPageFieldId(requestedField, savedFieldId);
  const current = searchRecordToParams(sp);
  const href = canonicalQuestionBankHref(
    ROUTES.questionBank,
    current,
    savedFieldId,
    requestedField
  );
  if (href) redirect(href);

  const pageExamSlug = examSlugForFieldId(fieldParam) ?? examSlug;
  const usmleStepLabel =
    pageExamSlug === "usmle" && isUsmleFieldId(fieldParam)
      ? usmleStepDefinition(fieldParam)?.shortName
      : undefined;

  return { examSlug: pageExamSlug, fieldParam, usmleStepLabel };
}
