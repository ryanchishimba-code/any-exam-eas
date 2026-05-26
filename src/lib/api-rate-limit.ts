import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export function rateLimitedResponse(retryAfterSec: number) {
  return NextResponse.json(
    { error: "Too many requests. Please wait a moment and try again." },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    }
  );
}

export function enforceRateLimit(
  req: Request,
  key: string,
  limit: number,
  windowMs: number
): NextResponse | null {
  const ip = getClientIp(req);
  const result = checkRateLimit(`${key}:${ip}`, limit, windowMs);
  if (!result.ok) return rateLimitedResponse(result.retryAfterSec);
  return null;
}

export function enforceUserRateLimit(
  userId: string,
  key: string,
  limit: number,
  windowMs: number
): NextResponse | null {
  const result = checkRateLimit(`${key}:${userId}`, limit, windowMs);
  if (!result.ok) return rateLimitedResponse(result.retryAfterSec);
  return null;
}
