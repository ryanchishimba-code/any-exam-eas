import { redirect } from "next/navigation";
import { STUDY_HUB_PATH } from "@/lib/study-hub/config";

export default function EngineTestRedirectPage() {
  redirect(STUDY_HUB_PATH);
}
