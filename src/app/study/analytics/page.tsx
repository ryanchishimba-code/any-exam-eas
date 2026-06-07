import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";

/** Legacy URL — forwards to the clean analytics route. */
export default function LegacyStudyAnalyticsRedirect() {
  redirect(ROUTES.analytics);
}
