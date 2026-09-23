import { timingSafeEqual } from "node:crypto";

/**
 * True when the request presents `Authorization: Bearer <CRON_SECRET>`.
 *
 * Vercel Cron adds that header on scheduled invocations when `CRON_SECRET`
 * is set. `x-vercel-cron` is supplied by the client and is not a credential.
 */
export function isCronAuthorized(
  req: Pick<Request, "headers">,
  env: NodeJS.ProcessEnv = process.env
): boolean {
  const secret = env.CRON_SECRET?.trim();
  if (!secret) return false;

  const header = req.headers.get("authorization");
  if (!header) return false;

  const provided = Buffer.from(header);
  const expected = Buffer.from(`Bearer ${secret}`);
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(provided, expected);
}
