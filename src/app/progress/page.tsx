import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";

export default function ProgressRedirectPage() {
  redirect(ROUTES.analytics);
}
