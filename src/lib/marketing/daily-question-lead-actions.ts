"use server";

import { redirect } from "next/navigation";
import {
  confirmDailyQuestionLead,
  unsubscribeDailyQuestionLead,
} from "@/lib/marketing/daily-question-lead";

export async function confirmDailyLeadAction(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const result = await confirmDailyQuestionLead(token);
  redirect(result.ok ? "/daily/confirm?done=1" : "/daily/confirm?done=0");
}

export async function unsubscribeDailyLeadAction(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const result = await unsubscribeDailyQuestionLead(token);
  redirect(result.ok ? "/daily/unsubscribe?done=1" : "/daily/unsubscribe?done=0");
}
