import { redirect } from "next/navigation";
import { STUDY_HUB_PATH } from "@/lib/study-hub/config";

/** Legacy URL — redirects to Study Hub. */
export default function DashboardRedirectPage() {
  redirect(STUDY_HUB_PATH);
}
