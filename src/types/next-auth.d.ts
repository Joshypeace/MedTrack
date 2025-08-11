// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { Role } from "@prisma/client";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: Role;
  }

  // ✅ If using Prisma Adapter (AdapterUser)
  interface AdapterUser extends User {}
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}
