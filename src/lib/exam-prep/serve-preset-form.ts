import type { ExamSlug } from "@/types/edtech";
import { listPresetFormSessions } from "@/lib/exam-sessions/service";
import {
  pickNextUnusedPresetForm,
  presetFormId,
  summarizePresetFormUses,
  usedPresetExamNumbers,
} from "@/lib/exam-prep/preset-form-progress";
import {
  listActivePresetForms,
  loadExactPresetForm,
  type ExactPresetForm,
} from "@/lib/exam-prep/stored-preset-form";

export type PresetFormServe =
  | { kind: "resume"; sessionId: string }
  | { kind: "serve"; form: ExactPresetForm };

async function inProgressSessionId(
  userId: string,
  examSlug: ExamSlug,
  formId: string
): Promise<string | null> {
  const rows = await listPresetFormSessions(userId, examSlug);
  const uses = summarizePresetFormUses(rows);
  const use = uses.get(formId);
  return use?.status === "in_progress" ? use.sessionId : null;
}

/** Serve one named form, or resume the sitting already open for it. */
export async function serveNamedPresetForm(params: {
  userId: string;
  examSlug: ExamSlug;
  fieldId: string;
  examNumber: number;
}): Promise<PresetFormServe | null> {
  const formId = presetFormId(params.examSlug, params.examNumber);
  const resumeSessionId = await inProgressSessionId(params.userId, params.examSlug, formId);
  if (resumeSessionId) return { kind: "resume", sessionId: resumeSessionId };

  const form = await loadExactPresetForm(params);
  if (!form) return null;
  return { kind: "serve", form };
}

/**
 * Next unused form whose stored length equals the simulation.
 * Boards with no matching form (NAPLEX 225 vs 85-question forms) return null.
 */
export async function serveNextUnusedPresetForm(params: {
  userId: string;
  examSlug: ExamSlug;
  fieldId: string;
  simulationLength: number;
}): Promise<ExactPresetForm | null> {
  const [forms, rows] = await Promise.all([
    listActivePresetForms(params.examSlug, params.fieldId),
    listPresetFormSessions(params.userId, params.examSlug),
  ]);
  const used = usedPresetExamNumbers(summarizePresetFormUses(rows));
  const matching = forms.filter((form) => form.questionCount === params.simulationLength);
  while (matching.length > 0) {
    const picked = pickNextUnusedPresetForm(matching, used, params.simulationLength);
    if (!picked) return null;
    const form = await loadExactPresetForm({
      examSlug: params.examSlug,
      fieldId: params.fieldId,
      examNumber: picked.examNumber,
    });
    if (form) return form;
    used.add(picked.examNumber);
  }
  return null;
}
