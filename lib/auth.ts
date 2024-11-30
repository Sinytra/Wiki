import NextAuth from "next-auth";
import GitHub from "@auth/core/providers/github";
import {OAuth2Client} from "@badgateway/oauth2-client";
import {getProcessURL} from "@/lib/utils";

declare module "next-auth" {
  interface Session {
    access_token: string;
  }
}

export const {handlers, signIn, signOut, auth} = NextAuth({
  providers: [GitHub({
    authorization: {
      params: {scope: 'read:user read:org'}
    }
  })],
  callbacks: {
    authorized: async ({auth}) => {
      // Logged-in users are authenticated, otherwise redirect to login page
      return !!auth
    },
    jwt({account, profile, token}) {
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

export const modrinthCallbackURL = `${getProcessURL()}/dev`;

export const modrinthAuthScopes = ['USER_READ'];

export const modrinthOAuthClient = new OAuth2Client({
  clientId: process.env.NEXT_PUBLIC_MR_CLIENT_ID || '',

  tokenEndpoint: 'https://api.modrinth.com/_internal/oauth/token',
  authorizationEndpoint: 'https://modrinth.com/auth/authorize',

  fetch: async (...args: any) => {
    args[1].headers['Authorization'] = process.env.MR_CLIENT_SECRET;
    // @ts-ignore
    return fetch(...args);
  },

  discoveryEndpoint: '/.well-known/oauth2-authorization-server',
  authenticationMethod: 'client_secret_post'
});

export function isModrinthOAuthAvailable() {
  return process.env.NEXT_PUBLIC_MR_CLIENT_ID && process.env.MR_CLIENT_SECRET;
}
