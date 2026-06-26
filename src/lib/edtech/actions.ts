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
  | { ok: true }
  | { ok: false; error: string };

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
    revalidatePath("/dashboard");
    revalidatePath("/study-hub");
    revalidatePath("/select-exam");
    revalidatePath("/question-bank");
    return { ok: true };
  } catch (err) {
    console.error("[persistExamPreference]", err);
    return {
      ok: false,
      error: "We couldn't save your exam choice. Check your connection and try again.",
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

export async function switchExamPreference(examSlug: string) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/dashboard");
  }
  if (!isExamSlug(examSlug)) {
    throw new Error("Invalid exam");
  }

  await setUserExamPreference(session.user.id, examSlug);
  revalidatePath("/dashboard");
  revalidatePath("/study-hub");
  revalidatePath("/dashboard/topics");
  revalidatePath("/select-exam");
}
