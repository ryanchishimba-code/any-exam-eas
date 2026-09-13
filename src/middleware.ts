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
    // Anatomy + study guides + /study/drugs300 stay in the matcher so
    // authorized() can allow guest preview without opening /dashboard.
    "/anatomy",
    "/anatomy/:path*",
    "/full-exam",
    "/full-exam/:path*",
    "/nclex/study-guide",
    "/nclex/study-guide/:path*",
    "/naplex/study-guide",
    "/naplex/study-guide/:path*",
    "/aanp-fnp/study-guide",
    "/aanp-fnp/study-guide/:path*",
  ],
};
