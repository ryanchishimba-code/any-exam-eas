import { redirect } from "next/navigation";
import { STUDYGUB_PATH } from "@/lib/studygub/config";

/** Legacy URL — StudyGub replaced Dashboard. */
export default function DashboardRedirectPage() {
  redirect(STUDYGUB_PATH);
}
