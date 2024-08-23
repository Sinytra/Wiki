# Sinytra Modded Minecraft Wiki

## Setup

1. Rename `.env.local.example` to `.env.local`
2. Create a new [GitHub OAuth App](https://github.com/settings/applications/new) and enter its Client ID and a Client
   Secret into `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` respectively.
3. Create a new [GitHub App](https://github.com/settings/apps/new) and enter its App ID and a Private Key into
   `APP_AUTH_GITHUB_ID` and `APP_AUTH_GITHUB_PRIVATE_KEY` respectively.
4. Configure Prisma's [database connection](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/connect-your-database-typescript-postgresql).
   See `prisma/schema.prisma` for the required environment variable names.
5. Run `npm run dev` to start the app

You can list desired local documentation sources in the `LOCAL_DOCS_ROOTS` env variable as demonstrated in the example.
