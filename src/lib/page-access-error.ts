import { redirect } from "next/navigation";
import { DbUnavailableError, isTransientDbError } from "@/lib/db-resilience";

/** Avoid treating Neon blips as logged-out — send users to a retry page instead. */
export function redirectIfDbUnavailable(error: unknown): never {
  if (error instanceof DbUnavailableError || isTransientDbError(error)) {
    redirect("/service-unavailable");
  }
  throw error;
}

/** Run page data loading; transient Neon failures redirect to /service-unavailable. */
export async function runPageDb<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    redirectIfDbUnavailable(error);
  }
}
