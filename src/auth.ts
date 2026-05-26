import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { verifyUserPassword, recordUserLogin } from "@/lib/user-auth";
import { loginSchema } from "@/lib/validators/auth";

export { registerUser } from "@/lib/user-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await verifyUserPassword(
          parsed.data.email,
          parsed.data.password
        );
        if (!user) return null;

        await recordUserLogin(user.id);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
});
