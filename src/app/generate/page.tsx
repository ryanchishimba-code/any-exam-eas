import { redirect } from "next/navigation";
import { STUDY_HUB_PATH } from "@/lib/study-hub/config";

export default function GenerateRedirectPage() {
  redirect(STUDY_HUB_PATH);
}
