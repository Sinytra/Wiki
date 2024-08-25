# Sinytra Modded Minecraft Wiki

## Setup

1. Rename `.env.local.example` to `.env.local`
2. Create a new [GitHub App](https://github.com/settings/apps/new). Fill in the following information:
  - `APP_AUTH_GITHUB_ID` - App ID
  - `APP_AUTH_GITHUB_PRIVATE_KEY` - a generated [Private Key](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/managing-private-keys-for-github-apps)
  - `AUTH_GITHUB_ID` - Client ID
  - `AUTH_GITHUB_SECRET` - Client Secret
3. Configure Prisma's [database connection](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/connect-your-database-typescript-postgresql).
   See `prisma/schema.prisma` for the required environment variable names.
4. Run `npm run dev` to start the app

You can list desired local documentation sources in the `LOCAL_DOCS_ROOTS` env variable as demonstrated in the example.
