/**
 * User-facing copy for the per-account device/IP limit.
 *
 * Kept in a dependency-free module so client components (e.g. the login form
 * via `auth-client.ts`) can import the strings without pulling in the
 * server-only `account-ip-limit.ts` (which uses `next/headers` and Prisma).
 */
export const ACCOUNT_IP_LIMIT_MESSAGE =
  "This account is already active on 3 devices or networks. Sign out elsewhere or contact support.";

export const IP_REQUIRED_MESSAGE =
  "We could not verify your network location. Refresh the page or try again from a standard browser connection.";
