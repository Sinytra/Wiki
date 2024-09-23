import NextAuth from "next-auth";
import GitHub from "@auth/core/providers/github";

declare module "next-auth" {
  interface Session {
    access_token: string;
  }
}

export const {handlers, signIn, signOut, auth} = NextAuth({
  providers: [GitHub({
    authorization: {
      params: { scope: 'read:user read:org' }
    }
  })],
  callbacks: {
    authorized: async ({auth}) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
    jwt({ account, profile, token }) {
      if (account) {
        token.access_token = account.access_token;
      }
      return token;
    },
    session({session, token, user}) {
      return {
        ...session,
        access_token: token.access_token
      }
    },
  },
  pages: {
    signIn: '/auth/login'
  }
});