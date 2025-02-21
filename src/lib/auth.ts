import Google from "next-auth/providers/google";
import NextAuth from "next-auth";

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
  },
} satisfies Parameters<typeof NextAuth>[0]; // Infer the type from NextAuth

export const {
  auth,
  handlers: { GET, POST },
} = NextAuth(authConfig);
