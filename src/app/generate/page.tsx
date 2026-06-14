import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";

/** Legacy research-exam route — question bank practice replaced this flow. */
export default function GeneratePage() {
  redirect(ROUTES.questionBank);
}
