import { redirect } from "next/navigation";
import { studyHubProgressHref } from "@/lib/study-hub/config";

export default function StudyAnalyticsRedirectPage() {
  redirect(studyHubProgressHref());
}
