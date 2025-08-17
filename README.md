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

**📘 Read the complete author guide [here](https://docs.moddedmc.wiki).**

An example documentation setup can be found in the `example` directory of this repository.

## Development

Ensure you have the latest version of [Node.js](https://nodejs.org) and [pnpm](https://pnpm.io/) installed. 

1. Install dependecies by running `pnpm install`
2. Rename `.env.local.example` to `.env.local`
3. Run `pnpm run dev` to start the app

To open the example project, enable local preview mode by setting `ENABLE_LOCAL_PREVIEW=true` or manually navigate
to `/project/examplemod`.

You can list desired local documentation sources in the `LOCAL_DOCS_ROOTS` env variable as demonstrated in the example.

## Credits

- [Minecraft typeface](https://github.com/Mojang/web-theme-bootstrap/tree/92d9913110cf79db5813e6335f97c6dc689854ee/assets/fonts) by Mojang

### Translations

Massive thanks to everyone who has contributed to [translation](https://crowdin.com/project/sinytra-wiki) efforts!

Special graditude goes to our most significant contributors:

- [@moritz-htk](https://github.com/moritz-htk) for German translations
- [@notlin4](https://github.com/notlin4) for Traditional Chinese translations
- [@kikipunk](https://github.com/kikipunk) for French translations
