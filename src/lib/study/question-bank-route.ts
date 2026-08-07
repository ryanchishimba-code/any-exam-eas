import { redirect } from "next/navigation";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import {
  fieldIdForExamSlug,
  fieldMatchesExamSlug,
  resolveCanonicalPracticeFieldId,
  resolveQuestionBankFieldId,
} from "@/lib/edtech/question-bank-scope";
import { getUserEdtechMetadata } from "@/lib/edtech/user-metadata";
import { isUsmleFieldId } from "@/lib/exam-prep/usmle/steps";
import { usmleStepDefinition } from "@/lib/exam-prep/usmle/steps";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";

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
  let usmleStepLabel: string | undefined;

  if (examSlug === "usmle" && !sp.field) {
    const meta = await getUserEdtechMetadata(userId);
    if (meta.usmleFieldId && isUsmleFieldId(meta.usmleFieldId)) {
      fieldParam = meta.usmleFieldId;
    }
  }

  if (sp.field) {
    const resolvedFieldId = resolveQuestionBankFieldId(String(sp.field));
    const canonicalFieldId = await resolveCanonicalPracticeFieldId(userId, examSlug);
    if (fieldMatchesExamSlug(resolvedFieldId, examSlug) && resolvedFieldId === canonicalFieldId) {
      fieldParam = resolvedFieldId;
    } else {
      const qs = new URLSearchParams();
      for (const [key, value] of Object.entries(sp)) {
        if (key === "field" || value == null) continue;
        qs.set(key, Array.isArray(value) ? value[0]! : value);
      }
      qs.set("field", canonicalFieldId);
      redirect(`${ROUTES.questionBank}?${qs.toString()}`);
    }
  }

  if (!sp.field) {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(sp)) {
      if (value == null) continue;
      qs.set(key, Array.isArray(value) ? value[0]! : value);
    }
    qs.set("field", fieldParam);
    if (!qs.has("mode")) qs.set("mode", "bank");
    redirect(`${ROUTES.questionBank}?${qs.toString()}`);
  }

  if (examSlug === "usmle" && isUsmleFieldId(fieldParam)) {
    usmleStepLabel = usmleStepDefinition(fieldParam)?.shortName;
  }

  return { examSlug, fieldParam, usmleStepLabel };
}
