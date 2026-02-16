import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "@/generated/prisma/client";
import { findUser } from "@/lib/queries/user";
import { verifyPassword } from "@/app/actions/password-encrypt";
import type { NextAuthOptions } from "next-auth";

export const configOptions = {
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

        if (!user) throw new Error("User not found");
        const isValid = await verifyPassword(password, user.password);
        if (!isValid) throw new Error("Invalid email or password");
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
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      console.log("JWT callback:", token);
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = { ...token.user, emailVerified: null } as User & {
          emailVerified: null;
        };
      }
      console.log("Session callback:", session);
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthOptions;

export const handler = NextAuth(configOptions);
