import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";

/** Legacy URL — forwards to the new dashboard. */
export default function StudyHubRedirectPage() {
  redirect(ROUTES.dashboard);
}
