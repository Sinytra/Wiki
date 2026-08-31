import { absoluteUrl, renderLanguageModelsTxt } from '@/lib/discovery/langMods';
import { plainTextResponse, RAW_PAGE_SUFFIX } from '@/lib/discovery/rawPage';
import { AVAILABLE_PROJECT_TYPES } from '@repo/shared/types/service';
import { DEFAULT_DOCS_VERSION, DEFAULT_LOCALE, DEFAULT_WIKI_LICENSE, WIKI_DOCS_URL } from '@repo/shared/constants';
import locales from '@repo/shared/locales';

const EXAMPLE_PATH = `/${DEFAULT_LOCALE}/project/{project}/${DEFAULT_DOCS_VERSION}`;

const SUMMARY = `
The Modded Minecraft Wiki (moddedmc.wiki) hosts documentation for Minecraft mods, modpacks, plugins,
data packs, resource packs and shaders. Every project gets its own wiki with versioned, localized 
documentation pages written by the project authors, plus reference pages for the in-game content 
(items, blocks, recipes) the project adds. It is built and maintained by the Sinytra Project.
`;

function formatDetails() {
  const languages = locales.getAvailableLocales();
  const prefixes = languages.map((l) => `\`${l.prefix}\` (${l.name})`).join(', ');

  return `
Every wiki page lives under \`/{locale}/project/{project}/{version}/...\`, where:

- \`{locale}\` is a language path prefix: ${prefixes}.
  Not every project is translated into every language; untranslated pages fall back to \`${DEFAULT_LOCALE}\`.
- \`{project}\` is the project ID, as it appears in the URL of the project's page on the wiki.
- \`{version}\` is a documentation version. \`${DEFAULT_DOCS_VERSION}\` always resolves to the newest one; projects may
  additionally publish game-version-specific ones such as \`1.21\`.

Append \`${RAW_PAGE_SUFFIX}\` to a documentation or content page URL to get its raw MDX source instead of the rendered
HTML page, and drop the suffix again to get back to the human-readable page:

- \`${EXAMPLE_PATH}/docs${RAW_PAGE_SUFFIX}\` is the project's documentation homepage.
- \`${EXAMPLE_PATH}/docs/{page/path}${RAW_PAGE_SUFFIX}\` is a single documentation page.
- \`${EXAMPLE_PATH}/content/{id}${RAW_PAGE_SUFFIX}\` is a single game content page.

The returned MDX may open with a YAML frontmatter block and may use wiki-specific components such as \`<Asset>\`,
\`<CraftingRecipe>\`, \`<ProjectRecipe>\`, \`<RecipeUsage>\` and \`<Callout>\`.

Every project publishes its own llms.txt indexing all of its documentation pages at \`${EXAMPLE_PATH}/llms.txt\`.
Start there when answering a question about a specific project.

Wiki text content is licensed under ${DEFAULT_WIKI_LICENSE.name} (${DEFAULT_WIKI_LICENSE.url}) unless a project states
otherwise. This is not an official Minecraft website and is not approved by or associated with Mojang or Microsoft.
`;
}

export async function GET() {
  const body = renderLanguageModelsTxt({
    title: 'Modded Minecraft Wiki',
    summary: SUMMARY,
    details: formatDetails(),
    sections: [
      {
        title: 'Finding a project',
        links: [
          {
            title: 'Browse projects',
            url: absoluteUrl(`/${DEFAULT_LOCALE}/browse`),
            desc:
              'Searchable index of every project hosted on the wiki. Accepts the query parameters `query` (free text), ' +
              `\`types\` (comma-separated, one of ${AVAILABLE_PROJECT_TYPES.join(', ')}), ` +
              '`sort` (relevance, creation_date, popularity, az, za) and `page`'
          },
          {
            title: 'Sitemap',
            url: absoluteUrl('/sitemap.xml'),
            desc: 'Machine-readable list of every project on the wiki, with the languages it is available in'
          },
          {
            title: 'Homepage',
            url: absoluteUrl(`/${DEFAULT_LOCALE}`),
            desc: 'Overview of the wiki and a list of currently popular projects'
          }
        ]
      },
      {
        title: 'Writing documentation',
        links: [
          {
            title: 'Author guide',
            url: WIKI_DOCS_URL,
            desc:
              'Complete documentation for project authors: repository layout, frontmatter, versioning, ' +
              'localization, the custom MDX components and the deployment workflow'
          },
          {
            title: 'Project dashboard',
            url: absoluteUrl('/dev'),
            desc: 'Where authors register and manage their projects. Requires signing in'
          }
        ]
      },
      {
        title: 'Optional',
        links: [
          {
            title: 'Blog',
            url: absoluteUrl('/blog'),
            desc: 'Announcements and release notes for the wiki itself'
          },
          {
            title: 'Terms of Service',
            url: absoluteUrl(`/${DEFAULT_LOCALE}/about/tos`),
            desc: 'Includes the copyright policy that applies to wiki content'
          },
          { title: 'Privacy Policy', url: absoluteUrl(`/${DEFAULT_LOCALE}/about/privacy`) },
          {
            title: 'Security Policy',
            url: absoluteUrl(`/${DEFAULT_LOCALE}/about/security`),
            desc: 'How to report a security vulnerability'
          },
          {
            title: 'Contact',
            url: absoluteUrl(`/${DEFAULT_LOCALE}/about/help`),
            desc: 'How to get in touch with the wiki maintainers'
          },
          {
            title: 'Source code',
            url: 'https://github.com/Sinytra',
            desc: 'The wiki is Free and Open Source software'
          },
          { title: 'Discord', url: 'https://discord.sinytra.org' },
          { title: 'Status page', url: 'https://status.moddedmc.org' }
        ]
      }
    ]
  });

  return plainTextResponse(body);
}
