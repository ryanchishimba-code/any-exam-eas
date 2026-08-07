import { NextResponse } from "next/server";
import { DbUnavailableError, toUserFacingDbError } from "@/lib/db-resilience";
import { ensureNeonReady } from "@/lib/neon-warmup";

/** Map DB failures to a safe 503 JSON response for API routes. */
export function respondDbUnavailable(error?: unknown) {
  const facing =
    error instanceof DbUnavailableError
      ? {
          code: "database_unavailable" as const,
          message:
            "We couldn't reach the study database right now. Please wait a moment and try again.",
          retryable: true,
        }
      : toUserFacingDbError(error);

  if (!facing) return null;

  return NextResponse.json(facing, {
    status: 503,
    headers: { "Retry-After": "3" },
  });
}

type RouteHandler<TArgs extends unknown[]> = (
  ...args: TArgs
) => Promise<Response | NextResponse>;

/**
 * Wrap an API route handler so transient DB errors return 503 instead of 500.
 * Re-throws non-DB errors for Next.js / framework handling.
 */
export function withDbCatch<TArgs extends unknown[]>(
  handler: RouteHandler<TArgs>
): RouteHandler<TArgs> {
  return async (...args: TArgs) => {
    try {
      await ensureNeonReady("api");
      return await handler(...args);
    } catch (error) {
      const dbResponse = respondDbUnavailable(error);
      if (dbResponse) return dbResponse;
      throw error;
    }
  };
}
