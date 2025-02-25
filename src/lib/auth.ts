import Google from "next-auth/providers/google";
import NextAuth from "next-auth";
import { createGuest, getGuest } from "@/src/lib/data-service";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
    async signIn({ user }) {
      if (!user.email) return false;

      const existingGuest = await getGuest(user.email);
      if (!existingGuest) {
        await createGuest({
          email: user.email,
          fullName: user.name ?? "Unknown",
        });
      }
      return true;
    },
    async session({ session }) {
      if (!session.user.email) return session;

      const guest = await getGuest(session.user.email);
      if (guest) {
        session.user.guestId = guest.id; // Now TypeScript knows guestId exists!
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies Parameters<typeof NextAuth>[0];

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
