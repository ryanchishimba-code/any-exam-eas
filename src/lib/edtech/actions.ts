"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isExamSlug } from "@/lib/edtech/exams";
import { setUserExamPreference } from "@/lib/edtech/exam-preference";
import type { ExamSlug } from "@/types/edtech";

export async function saveExamPreference(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/onboarding/exam-select");
  }

  const slug = formData.get("examSlug");
  if (typeof slug !== "string" || !isExamSlug(slug)) {
    throw new Error("Invalid exam selection");
  }

  await setUserExamPreference(session.user.id, slug as ExamSlug);
  revalidatePath("/study-hub");
  revalidatePath("/onboarding/exam-select");
  redirect("/study-hub");
}

export async function switchExamPreference(examSlug: string) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/study-hub");
  }
  if (!isExamSlug(examSlug)) {
    throw new Error("Invalid exam");
  }

  await setUserExamPreference(session.user.id, examSlug);
  revalidatePath("/study-hub");
  revalidatePath("/study-hub/topics");
}
