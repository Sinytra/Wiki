import NextAuth from "next-auth";
import type {Provider} from "@auth/core/providers";
import modrinth from "@/lib/modrinth";

declare module "next-auth" {
  interface Session {
    access_token: string;
  }
}

const Modrinth: Provider = {
  id: 'modrinth',
  name: 'Modrinth',
  type: 'oauth',
  token: {
    url: 'https://api.modrinth.com/_internal/oauth/token',
    async request(...args: any) {
      args[1].headers['Authorization'] = process.env.MODRINTH_CLIENT_SECRET;
      // @ts-ignore
      return fetch(...args);
    }
  },
  client: {token_endpoint_auth_method: "client_secret_post"},
  authorization: {
    url: 'https://modrinth.com/auth/authorize/',
    params: {
      scope: 'PROJECT_READ+VERSION_READ+USER_READ' // TODO Remove USER_READ
    }
  },
  userinfo: {
    url: 'https://api.modrinth.com/v2/user',
    request(context: any) {
      return modrinth.getUserProfile(context.tokens.access_token);
    }
  },
  clientId: process.env.MODRINTH_CLIENT_ID,
  clientSecret: process.env.MODRINTH_CLIENT_SECRET
};

export const {handlers, signIn, signOut, auth} = NextAuth({
  providers: [Modrinth],
  callbacks: {
    authorized: async ({auth}) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
    jwt({ account, profile, token }) {
      if (account) {
        token.access_token = account.access_token;
      }
      if (profile) {
        token.name = (profile as any).username;
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
    signIn: '/auth/login',
  }
});