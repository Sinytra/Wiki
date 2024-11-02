# Sinytra Modded Minecraft Wiki

The Modded Minecraft Wiki is built to suit the very needs of Minecraft modders and players alike. It provides
intuitive navigation, a clean user interface, mod browser and features for authors to make writing documentation
a piece of cake.

These include versioning, localization, custom components (recipes, assets, etc.), gradle integration,
project management and more.

- 🌐 **Localization**: Translate your docs into world languages
- 🚹 **Accessible**: Intuitive and responsive user interface
- 🤝 **Open**: Let your users contribute without any programming knowledge necessary
- 💸 **Free**: Hosting docs on our website is completely free of charge!

## Authors

An example documentation setup can be found in the `example` directory of this repository.

## Development

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

## Credits

### Translations

Massive thanks to everyone who has contributed to [translation](https://crowdin.com/project/sinytra-wiki) efforts!

Special graditude goes to our most significant contributors:

- [@moritz-htk](https://github.com/moritz-htk) for German translations
- [@notlin4](https://github.com/notlin4) for Traditional Chinese translations