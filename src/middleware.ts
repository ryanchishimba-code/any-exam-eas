import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

/**
 * Edge middleware must not import `@/auth` (Prisma, Stripe, bcrypt).
 * Use authConfig-only NextAuth instance per NextAuth v5 guidance.
 */
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/study-hub",
    "/study-hub/:path*",
    "/studygub",
    "/studygub/:path*",
    "/internal",
    "/internal/:path*",
    "/study",
    "/study/:path*",
    "/learn",
    "/learn/:path*",
    "/generate",
    "/generate/:path*",
    "/progress",
    "/progress/:path*",
    "/engine",
    "/engine/:path*",
    "/checkout",
    "/checkout/:path*",
    "/prep",
    "/prep/:path*",
    "/exam",
    "/exam/:path*",
    "/analytics",
  ],
};
