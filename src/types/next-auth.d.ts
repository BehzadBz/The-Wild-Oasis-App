import { DefaultSession, DefaultUser } from "next-auth";

// Extend NextAuth types
declare module "next-auth" {
  interface User extends DefaultUser {
    guestId?: string;
    email?: string; // Add email to the User interface
  }

  interface Session extends DefaultSession {
    user: {
      guestId?: string;
      email?: string; // Add email to the Session interface
    } & DefaultSession["user"]; // Preserve default session properties
  }
}
