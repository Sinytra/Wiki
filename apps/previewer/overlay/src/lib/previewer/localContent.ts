import { ContentFileTree, ItemProperties, PageLinks, ProjectContext } from '@repo/shared/types/service';
import { Frontmatter, Infobox } from '@sinytra/wiki-api-types';
import localDocs, { LocalDocumentationSource } from './localDocsPages';
import { buildContentTree, buildInfobox, itemNames, itemPropertiesPath, resolveLinks } from '@sinytra/wiki-wasm';
import localFiles from './localFiles';
import { DEFAULT_LOCALE } from '@repo/shared/constants';
import locales from '@repo/shared/locales';
import { console } from 'next/dist/compiled/@edge-runtime/primitives';

async function getProjectContents(ctx: ProjectContext): Promise<ContentFileTree | null> {
  const src = await localDocs.getProjectSource(ctx.id);
  if (src) {
    return getLocalSourceContentTree(src, ctx.locale);
  }
  return null;
}

async function getLocalSourceContentTree(
  src: LocalDocumentationSource,
  locale?: string | null
): Promise<ContentFileTree | null> {
  const actualLocale = await localDocs.resolveTreeLocale(src, locale || undefined);
  const { tree, issues, page_issues } = buildContentTree(src.path, src.schema, src.modid, actualLocale);

  localDocs.reportTreeIssues(issues);
  if (!src.modid) {
    localDocs.warnOnce(`Project ${src.id} has no modid in its metadata, so its content pages won't be published`);
  }
  if (page_issues.length > 0) {
    const message = page_issues.map((issue) => `- ${issue.path}: ${issue.message}`).join('\n');
    localDocs.warnOnce(`Skipped content pages in ${src.id}:\n${message}`);
  }
  return tree;
}

async function getLocalItemProperties(src: LocalDocumentationSource): Promise<ItemProperties> {
  try {
    const propsPath = itemPropertiesPath(src.schema, src.modid ?? '');
    const props = await localFiles.readFileContents(src, propsPath);
    const parsed = JSON.parse(props.content);
    return parsed as ItemProperties;
  } catch (e: any) {
    if (e.code != 'ENOENT') {
      console.error('Error reading item properties file', e);
    }
  }
  return {};
}

async function projectView(src: LocalDocumentationSource, ctx: ProjectContext) {
  return {
    locale: await localDocs.resolveTreeLocale(src, ctx.locale || undefined),
    lang: locales.resolveParam(ctx.locale ?? DEFAULT_LOCALE)
  };
}

async function constructInfobox(
  src: LocalDocumentationSource,
  frontmatter: Frontmatter,
  ctx: ProjectContext
): Promise<Infobox> {
  const { locale, lang } = await projectView(src, ctx);
  const names = itemNames(src.path, src.schema, src.modid, locale, lang, frontmatter.id);
  return buildInfobox(
    frontmatter,
    names.map((name) => name ?? ''),
    src.schema
  );
}

async function resolveContentLinks(links: string[], ctx: ProjectContext): Promise<PageLinks> {
  const src = await localDocs.getProjectSource(ctx.id);
  if (!src) {
    return {};
  }

  const { locale, lang } = await projectView(src, ctx);
  return resolveLinks(src.path, src.schema, src.modid, locale, lang, links);
}

function findTreeEntry<T extends { type: string; children: T[] }>(pred: (e: T) => boolean, e: T): T | null {
  if (e.type === 'dir') {
    for (const child of e.children) {
      const res = findTreeEntry(pred, child);
      if (res) {
        return res;
      }
    }
    return null;
  } else {
    return pred(e) ? e : null;
  }
}

export default {
  getLocalSourceContentTree,
  getLocalItemProperties,
  constructInfobox,
  findTreeEntry,
  resolveContentLinks,
  getProjectContents
};
