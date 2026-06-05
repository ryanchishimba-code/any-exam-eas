import { redirect } from "next/navigation";
import { studyHubProgressHref } from "@/lib/study-hub/config";

export default function AnalyticsRedirectPage() {
  redirect(studyHubProgressHref());
}
