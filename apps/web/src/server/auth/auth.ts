import "server-only";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getAuthEnvironment } from "@/lib/env";
import { authenticateCredentials } from "../services/authentication-service";
export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  const env = getAuthEnvironment();
  return {
    secret: env.AUTH_SECRET,
    trustHost: env.AUTH_TRUST_HOST === "true" || !!process.env.VERCEL || process.env.NODE_ENV !== "production",
    session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
    pages: { signIn: "/login" },
    providers: [Credentials({ credentials: { email: { type: "email" }, password: { type: "password" } }, authorize: authenticateCredentials })],
    callbacks: {
      jwt({ token, user }) { if (user?.id) token.sub = user.id; return token; },
      session({ session, token }) { if (session.user && token.sub) session.user.id = token.sub; return session; },
    },
  };
});
