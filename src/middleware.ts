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
    "/question-bank",
    "/question-bank/:path*",
    "/study-hub",
    "/study-hub/:path*",
    "/select-exam",
    "/settings",
    "/studygub",
    "/studygub/:path*",
    "/internal",
    "/internal/:path*",
    "/admin",
    "/admin/:path*",
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
    "/exams",
    "/exams/:path*",
    "/practice",
    "/practice/:path*",
    "/mpje",
    "/mpje/:path*",
    "/analytics",
    "/library",
    "/library/:path*",
    "/anatomy",
    "/anatomy/:path*",
    "/full-exam",
    "/full-exam/:path*",
  ],
};
