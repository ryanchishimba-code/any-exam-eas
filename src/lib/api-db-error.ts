import { NextResponse } from "next/server";
import { DbUnavailableError, toUserFacingDbError } from "@/lib/db-resilience";

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
