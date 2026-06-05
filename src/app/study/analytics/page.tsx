import { redirect } from "next/navigation";
import { STUDYGUB_PATH } from "@/lib/studygub/config";

export default function StudyAnalyticsRedirectPage() {
  redirect(STUDYGUB_PATH);
}
