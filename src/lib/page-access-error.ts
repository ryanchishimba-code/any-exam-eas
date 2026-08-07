import { redirect } from "next/navigation";
import { DbUnavailableError, isTransientDbError } from "@/lib/db-resilience";
import { ensureNeonReady } from "@/lib/neon-warmup";

/** Avoid treating Neon blips as logged-out — send users to a retry page instead. */
export function redirectIfDbUnavailable(error: unknown): never {
  // Next.js navigation control flow must never be remapped to service-unavailable.
  if (
    error &&
    typeof error === "object" &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    String((error as { digest: string }).digest).startsWith("NEXT_")
  ) {
    throw error;
  }
  if (error instanceof DbUnavailableError || isTransientDbError(error)) {
    redirect("/service-unavailable");
  }
  throw error;
}

/** Run page data loading; transient Neon failures redirect to /service-unavailable. */
export async function runPageDb<T>(fn: () => Promise<T>): Promise<T> {
  try {
    // Wake Neon over HTTP before Prisma TCP (avoids P1001 storms after scale-to-zero).
    await ensureNeonReady("page");
    return await fn();
  } catch (error) {
    redirectIfDbUnavailable(error);
  }
}
