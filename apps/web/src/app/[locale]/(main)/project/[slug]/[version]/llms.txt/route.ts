import service from '@/lib/service';
import platforms, { PlatformProject } from '@repo/shared/platforms';
import locales, { Language } from '@repo/shared/locales';
import { absoluteUrl, ModelLink, renderLanguageModelsTxt } from '@/lib/discovery/langMods';
import { plainTextError, plainTextNotFound, plainTextResponse, RAW_PAGE_SUFFIX } from '@/lib/discovery/rawPage';
import { DEFAULT_DOCS_VERSION, DEFAULT_WIKI_LICENSE } from '@repo/shared/constants';
import { FileTree } from '@repo/shared/types/service';
import { ProjectRouteParams } from '@repo/shared/types/routes';
import { ProjectData } from '@sinytra/wiki-api-types';

interface Props {
  params: Promise<ProjectRouteParams>;
}

function formatSummary(project: ProjectData, platformProject: PlatformProject | null) {
  return (
    (platformProject?.summary
      ? `${endSentence(platformProject.summary)} `
      : `Documentation for the ${project.name} ${project.type}. `) +
    `This is the ${project.name} wiki hosted on the Modded Minecraft Wiki, listing every documentation page ` +
    'written by the project authors.'
  );
}

function formatDetails(
  project: ProjectData,
  version: string,
  locale: string,
  language: Language | undefined,
  translations: string[]
) {
  const additionalVersions =
    project.versions.length > 0 ? ` (also available: ${project.versions.map((v) => `\`${v}\``).join(', ')})` : '';
  const additionalLanguages = translations.length > 0 ? `. Translated into: ${translations.join(', ')}` : '';

  return `
- Project ID: \`${project.id}\`
- Project type: \`${project.type}\`
- Documentation version: \`${version}\`${additionalVersions}. \`${DEFAULT_DOCS_VERSION}\` always resolves to the newest version.
- Language: \`${locale}\`${language ? ` (${language.name})` : ''}${additionalLanguages}
- Documentation pages: ${project.info.page_count}. Game content pages: ${project.info.content_count}.

Each link below points at the raw MDX source of a page. Remove the trailing \`${RAW_PAGE_SUFFIX}\` from any of them
to get the rendered, human-readable page instead, or replace \`/${version}/\` with another documentation version.

Wiki text content is licensed under ${DEFAULT_WIKI_LICENSE.name} (${DEFAULT_WIKI_LICENSE.url}) unless stated otherwise
on the page itself.
`;
}

export async function GET(_request: Request, props: Props) {
  const { slug, version, locale } = await props.params;
  const ctx = { id: slug, version, locale };

  let project, projectData, indexPage;
  let platformProject: PlatformProject | null = null;
  try {
    project = await service.getProject(ctx);
    if (project) {
      projectData = await service.getBackendLayout(ctx);
      platformProject = await platforms.getPlatformProjectOrNull(project);
      indexPage = await service.getDocsIndexPage(ctx);
    }
  } catch (e) {
    return plainTextError(`Failed to read the page index of project '${slug}'.`, e);
  }

  if (!project) {
    return plainTextNotFound(`No project with ID '${slug}' exists on the Modded Minecraft Wiki.`);
  }
  if (!projectData) {
    return plainTextNotFound(`Project '${slug}' has no documentation for version '${version}' in locale '${locale}'.`);
  }

  const baseUrl = absoluteUrl(`/${locale}/project/${project.id}/${version}`);

  const language = locales.getForUrlParam(locale);
  const translations = project.locales
    .map((code) => locales.getForCode(code))
    .filter((l) => l != null)
    .map((l) => `\`${l.prefix}\``);

  const body = renderLanguageModelsTxt({
    title: project.name,
    summary: formatSummary(project, platformProject),
    details: formatDetails(project, version, locale, language, translations),
    sections: [
      {
        title: 'Documentation',
        links: [
          ...(indexPage
            ? [
                {
                  title: 'Documentation homepage',
                  url: `${baseUrl}/docs${RAW_PAGE_SUFFIX}`,
                  desc: `Introduction to ${project.name}`
                }
              ]
            : []),
          ...collectDocsLinks(projectData.tree, baseUrl)
        ]
      },
      ...(project.info.content_count > 0
        ? [
            {
              title: 'Game content',
              body:
                `${project.name} adds ${plural(project.info.content_count, 'documented item, block or other piece of game content', 'documented items, blocks and other pieces of game content')}. ` +
                `The index below lists every one of them; the raw MDX source of a single entry is available at ` +
                `\`${baseUrl}/content/{id}${RAW_PAGE_SUFFIX}\`, where \`{id}\` is the last path segment of its link ` +
                'in the index.',
              links: [
                {
                  title: 'Game content index',
                  url: `${baseUrl}/content`,
                  desc: 'Rendered HTML page listing every documented item, block and other game content'
                }
              ]
            }
          ]
        : []),
      {
        title: 'Optional',
        links: [
          {
            title: 'Project overview',
            url: baseUrl,
            desc: 'Rendered HTML page with the project description, supported game versions, links and licensing'
          },
          ...(platformProject ? collectProjectLinks(project, platformProject) : [])
        ]
      }
    ]
  });

  return plainTextResponse(body);
}

function collectDocsLinks(tree: FileTree, baseUrl: string, breadcrumb: string[] = []): ModelLink[] {
  return tree.flatMap((entry) => {
    if (entry.type === 'dir') {
      return collectDocsLinks(entry.children, baseUrl, [...breadcrumb, entry.name]);
    }
    return [
      {
        title: entry.name,
        url: `${baseUrl}/docs/${entry.path}${RAW_PAGE_SUFFIX}`,
        desc: breadcrumb.length > 0 ? breadcrumb.join(' / ') : null
      }
    ];
  });
}

function endSentence(text: string): string {
  return /[.!?]$/.test(text.trim()) ? text.trim() : `${text.trim()}.`;
}

function plural(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function collectProjectLinks(project: ProjectData, platformProject: PlatformProject): ModelLink[] {
  const links: ModelLink[] = [];

  for (const [platform, slug] of Object.entries(project.platforms)) {
    links.push({
      title: platform === 'curseforge' ? 'CurseForge' : platform === 'modrinth' ? 'Modrinth' : platform,
      url: platforms.getProjectURL(platform as any, slug, project.type),
      desc: `The ${project.name} ${project.type} on ${platform}`
    });
  }

  if (platformProject.source_url) {
    links.push({ title: 'Source code', url: platformProject.source_url });
  }

  if (project.source_repo) {
    links.push({
      title: 'Documentation source',
      url: project.source_repo,
      desc: 'Repository the wiki pages are written in'
    });
  }

  if (platformProject.discord_url) {
    links.push({ title: 'Discord', url: platformProject.discord_url });
  }

  return links;
}
