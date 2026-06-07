import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";

/** Legacy onboarding path — forwards to the premium select-exam screen. */
export default function LegacyExamSelectPage() {
  redirect(ROUTES.selectExam);
}
