import NextAuth, { type DefaultSession } from "next-auth";
import { type Adapter } from "next-auth/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/prisma";
import bcrypt from "bcryptjs";
import { signInSchema } from "@/lib/zod";
import { Role } from "@prisma/client";
import { cache } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    username: string;
    role: keyof typeof Role;
    isPremium: boolean;
  }
  interface Session {
    user: {
      id: string;
      username: string;
      role: keyof typeof Role;
      isPremium: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: keyof typeof Role;
    isPremium: boolean;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { username, password } = await signInSchema.parseAsync(
            credentials
          );

          const user = await prisma.user.findUnique({
            where: { username: username },
          });

          if (!user) {
            // Sign-up process
            const hashedPassword = await bcrypt.hash(password, 10);
            const role =
              process.env.OWNER_USERNAME === username &&
              process.env.OWNER_PASSWORD === password
                ? "OWNER"
                : "USER";
            const newUser = await prisma.user.create({
              data: {
                username,
                password: hashedPassword,
                role,
              },
            });
            return newUser;
          }

          // Sign-in process
          if (user.password && (await bcrypt.compare(password, user.password)))
            return user;

          throw new Error("Invalid credentials.");
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.username = user.username;
        token.role = user.role;
        token.isPremium = user.isPremium;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.role = token.role;
      session.user.isPremium = token.isPremium;
      return session;
    },
  },
});

export type authenticatedUserType = Awaited<
  ReturnType<typeof getAuthenticatedUser>
>;
export const getAuthenticatedUser = cache(async () => {
  return (await auth())?.user;
});
