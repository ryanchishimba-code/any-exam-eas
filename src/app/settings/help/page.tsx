import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";

/**
 * Replay tour lives on Settings, not a nested help route.
 * Prefetches of /settings/help land here instead of 404.
 */
export default function SettingsHelpPage() {
  redirect(`${ROUTES.settings}#help`);
}
