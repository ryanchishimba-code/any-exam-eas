import { redirect } from "next/navigation";
import { DbUnavailableError } from "@/lib/db-resilience";

/** Avoid treating Neon blips as logged-out — send users to a retry page instead. */
export function redirectIfDbUnavailable(error: unknown): never {
  if (error instanceof DbUnavailableError) {
    redirect("/service-unavailable");
  }
  throw error;
}
