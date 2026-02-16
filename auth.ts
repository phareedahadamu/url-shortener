import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "@/generated/prisma/client";
import { findUser } from "@/lib/queries/user";
import { verifyPassword } from "@/app/actions/userAuth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        if (!credentials || !credentials.email || !credentials.password)
          return null;
        const email = credentials.email as string;
        const password = credentials.password as string;
        const response = await findUser(email);
        const user = response.user;

        if (!user) return null;
        const isValid = await verifyPassword(password, user.password);
        if (!isValid) return null;
        return {
          id: user.id,
          email: user.email,
          username: user.username,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
    updateAge: Infinity,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = { ...token.user, emailVerified: null } as User & {
          emailVerified: null;
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
