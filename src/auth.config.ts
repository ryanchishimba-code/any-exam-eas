import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";
import { isPremiumPage } from "@/lib/premium-routes";
import { isInternalPath, staffLoginUrl } from "@/lib/staff-routes";
import { ADMIN_LOGIN_PATH, adminLoginUrl, isAdminPath } from "@/lib/admin/routes";
import { hasMinRole, isStaffRole } from "@/lib/permissions";

/** Edge-safe config — used by middleware only (no Prisma/bcrypt). */
export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const path = request.nextUrl.pathname;
      const isStudyHub =
        path.startsWith("/dashboard") ||
        path.startsWith("/study-hub") ||
        path.startsWith("/studygub");
      const isInternal = isInternalPath(path);
      const isAdmin = isAdminPath(path);
      const isPremium = isPremiumPage(path);
      const role = (auth?.user as { role?: string } | undefined)?.role;

      if (path === ADMIN_LOGIN_PATH) {
        return true;
      }

      if (isAdmin) {
        if (!isLoggedIn) {
          return NextResponse.redirect(
            new URL(adminLoginUrl(path), request.nextUrl)
          );
        }
        if (!hasMinRole(role, "admin")) {
          return NextResponse.redirect(
            new URL("/study?error=admin_only", request.nextUrl)
          );
        }
        return true;
      }

      if (isInternal) {
        if (!isLoggedIn) {
          return NextResponse.redirect(
            new URL(staffLoginUrl(path), request.nextUrl)
          );
        }
        if (!isStaffRole(role)) {
          return NextResponse.redirect(
            new URL("/study?error=staff_only", request.nextUrl)
          );
        }
        return true;
      }

      if (isStudyHub || isPremium) {
        return isLoggedIn;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "user";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
