import { redirect } from "next/navigation";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import {
  fieldIdForExamSlug,
  fieldMatchesExamSlug,
  resolveCanonicalPracticeFieldId,
  resolveQuestionBankFieldId,
} from "@/lib/edtech/question-bank-scope";
import { getUserEdtechMetadata } from "@/lib/edtech/user-metadata";
import { isUsmleFieldId, usmleStepDefinition } from "@/lib/exam-prep/usmle/steps";
import { ROUTES } from "@/lib/routes";
import {
  canonicalizeQuestionBankQuery,
  questionBankQueriesMatch,
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
  const defaultFieldId = fieldIdForExamSlug(examSlug);
  let fieldParam = defaultFieldId;

  const requestedField = sp.field ? resolveQuestionBankFieldId(String(sp.field)) : null;

  if (examSlug === "usmle" && !requestedField) {
    const meta = await getUserEdtechMetadata(userId);
    if (meta.usmleFieldId && isUsmleFieldId(meta.usmleFieldId)) {
      fieldParam = meta.usmleFieldId;
    }
  }

  if (requestedField) {
    const canonicalFieldId = await resolveCanonicalPracticeFieldId(userId, examSlug);
    if (fieldMatchesExamSlug(requestedField, examSlug) && requestedField === canonicalFieldId) {
      fieldParam = requestedField;
    } else {
      fieldParam = canonicalFieldId;
    }
  }

  // One redirect canonicalizes the field AND drops a subject/filter from another
  // board. Keeping subjectId=physiology while rewriting field to aanp-fnp is
  // what left history on a stale topic.
  const current = searchRecordToParams(sp);
  const canonical = canonicalizeQuestionBankQuery(fieldParam, current);
  if (!questionBankQueriesMatch(current, canonical)) {
    redirect(`${ROUTES.questionBank}?${canonical.toString()}`);
  }

  const usmleStepLabel =
    examSlug === "usmle" && isUsmleFieldId(fieldParam)
      ? usmleStepDefinition(fieldParam)?.shortName
      : undefined;

  return { examSlug, fieldParam, usmleStepLabel };
}
