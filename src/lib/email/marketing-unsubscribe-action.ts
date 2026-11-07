"use server";

import { redirect } from "next/navigation";
import {
  optOutOfMarketingEmail,
  readMarketingUnsubscribeToken,
} from "@/lib/email/marketing-preference";

export async function unsubscribeMarketingAction(formData: FormData): Promise<void> {
  const token = String(formData.get("token") ?? "");
  const userId = token ? readMarketingUnsubscribeToken(token) : null;
  if (!userId) redirect("/email/unsubscribe?done=0");
  await optOutOfMarketingEmail(userId);
  redirect("/email/unsubscribe?done=1");
}
