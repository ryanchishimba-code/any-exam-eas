"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isExamSlug } from "@/lib/edtech/exams";
import { setUserExamPreference } from "@/lib/edtech/exam-preference";
import { setUserEdtechMetadata } from "@/lib/edtech/user-metadata";
import type { ExamSlug } from "@/types/edtech";
import type { MpjeVariant } from "@/lib/mpje/config";
import { isMpjeUsJurisdiction } from "@/lib/mpje/us-jurisdictions";

export type PersistExamPreferenceResult =
  | { ok: true; examSlug: ExamSlug }
  | { ok: false; error: string };

function revalidateExamPreferencePaths() {
  revalidatePath("/dashboard", "layout");
  revalidatePath("/question-bank", "layout");
  revalidatePath("/analytics", "layout");
  revalidatePath("/library", "layout");
  revalidatePath("/settings", "layout");
  revalidatePath("/dashboard");
  revalidatePath("/question-bank");
  revalidatePath("/library");
  revalidatePath("/select-exam");
}

/** Persist exam without redirect — client handles confetti + navigation. */
export async function persistExamPreference(
  examSlug: string
): Promise<PersistExamPreferenceResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { ok: false, error: "Please log in again to save your exam choice." };
    }
    if (!isExamSlug(examSlug)) {
      return { ok: false, error: "That exam is not available. Try another card." };
    }

    await setUserExamPreference(session.user.id, examSlug);
    revalidateExamPreferencePaths();
    return { ok: true, examSlug };
  } catch (err) {
    console.error("[persistExamPreference]", err);
    return {
      ok: false,
      error: "We couldn't save your exam choice. Check your connection and try again.",
    };
  }
}

/** Persist USMLE exam + the specific step bank (Step 1 / 2 CK / 3). */
export async function persistUsmleStepPreference(
  usmleFieldId: string
): Promise<PersistExamPreferenceResult> {
  const USMLE_FIELDS = new Set(["usmle-step-1", "usmle-step-2", "usmle-step-3"]);
  if (!USMLE_FIELDS.has(usmleFieldId)) {
    return { ok: false, error: "Invalid USMLE step." };
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { ok: false, error: "Please log in again to save your exam choice." };
    }

    await setUserExamPreference(session.user.id, "usmle");
    await setUserEdtechMetadata(session.user.id, { usmleFieldId });
    revalidateExamPreferencePaths();
    revalidatePath("/select-exam/usmle");
    return { ok: true, examSlug: "usmle" };
  } catch (err) {
    console.error("[persistUsmleStepPreference]", err);
    return {
      ok: false,
      error: "We couldn't save your USMLE step. Check your connection and try again.",
    };
  }
}

export async function saveExamPreference(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/auth/login?callbackUrl=${encodeURIComponent("/select-exam")}`);
  }

  const slug = formData.get("examSlug");
  if (typeof slug !== "string" || !isExamSlug(slug)) {
    throw new Error("Invalid exam selection");
  }

  await setUserExamPreference(session.user.id, slug as ExamSlug);
  revalidatePath("/dashboard");
  revalidatePath("/study-hub");
  revalidatePath("/select-exam");
  revalidatePath("/onboarding/exam-select");
  redirect("/dashboard");
}

export async function saveMpjePreferences(input: {
  stateCode?: string;
  variant?: MpjeVariant;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const patch: { mpjeStateCode?: string; mpjeVariant?: MpjeVariant } = {};
  if (input.variant) patch.mpjeVariant = input.variant;
  if (input.stateCode && isMpjeUsJurisdiction(input.stateCode)) {
    patch.mpjeStateCode = input.stateCode.toUpperCase();
  }

  await setUserEdtechMetadata(session.user.id, patch);
  revalidatePath("/dashboard");
  revalidatePath("/study-hub");
  revalidatePath("/settings");
  return { ok: true as const };
}

export async function switchExamPreference(
  examSlug: string
): Promise<PersistExamPreferenceResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { ok: false, error: "Please log in again to save your exam choice." };
    }
    if (!isExamSlug(examSlug)) {
      return { ok: false, error: "That exam is not available." };
    }

    await setUserExamPreference(session.user.id, examSlug);
    revalidateExamPreferencePaths();
    revalidatePath("/dashboard/topics");
    return { ok: true, examSlug };
  } catch (err) {
    console.error("[switchExamPreference]", err);
    return {
      ok: false,
      error: "We couldn't save your exam choice. Check your connection and try again.",
    };
  }
}
