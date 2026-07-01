import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";

/** Legacy URL — forwards to the dashboard (static route beats /[examSlug] marketing catch-all). */
export default function PracticeHubRedirectPage() {
  redirect(ROUTES.dashboard);
}
