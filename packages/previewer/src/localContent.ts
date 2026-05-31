import {
  ContentFileTree, FileTree,
  ItemProperties,
  PageLinks,
  ProjectContext,
} from '@repo/shared/types/service';
import {
  ContentFileTreeEntry, ContentItemNameResponse,
  FileTreeEntry,
  Frontmatter,
  Infobox,
  InfoboxTab,
  ResolvedLink,
} from '@sinytra/wiki-api-types';
import localDocs, {LocalDocumentationSource} from './localDocsPages';
import markdown, {RawFrontmatter} from '@repo/markdown';
import localFiles from './localFiles';
import resourceLocation, {DEFAULT_NAMESPACE} from '@repo/shared/resourceLocation';
import {DEFAULT_LOCALE} from '@repo/shared/constants';

interface ExtendedContentFileTreeEntry extends ContentFileTreeEntry {
  id?: string[];
}

async function getProjectContents(ctx: ProjectContext): Promise<ContentFileTree | null> {
  const src = await localDocs.getProjectSource(ctx.id);
  if (src) {
    return getLocalSourceContentTree(src, ctx.locale);
  }
  return null;
}

async function getLocalSourceContentTree(src: LocalDocumentationSource, locale?: string | null): Promise<ContentFileTree | null> {
  const modifiedSrc = {...src, path: src.path + '/.content'};
  const tree = await localDocs.readDocsTree(modifiedSrc, locale || undefined);
  const results = await Promise.all(tree.map(e => processEntry(src, e, locale || null, {existing: []})));
  return results.filter(c => c != null);
}

async function processEntry(src: LocalDocumentationSource, entry: FileTreeEntry, locale: string | null, ctx: {
  existing: string[]
}): Promise<ExtendedContentFileTreeEntry | null> {
  if (entry.type === 'dir') {
    const children = await Promise.all(entry.children.map(c => processEntry(src, c, locale, ctx)));
    return {...entry, children: children.filter(c => c != null)};
  } else {
    const file = await localDocs.readDocsFile(src, ['.content', entry.path], locale || undefined, true);
    if (file) {
      const frontmatter = markdown.readFrontmatter(file.content) as RawFrontmatter;
      if (frontmatter.id) {
        const ids = Array.isArray(frontmatter.id) ? frontmatter.id : [frontmatter.id];
        const ref = getPageRef(ids, entry.path, ctx.existing);
        if (ref == null) return null;

        ctx.existing.push(ref);
        return {
          ref,
          id: ids,
          icon: frontmatter.icon ?? (ids.length === 1 ? ids[0] : null),
          name: entry.name,
          path: entry.path,
          type: entry.type,
          children: []
        };
      }
    }
  }
  return null;
}

async function getLocalItemProperties(src: LocalDocumentationSource): Promise<ItemProperties> {
  try {
    const props = await localFiles.readFileContents(src, '.data/properties.json');
    const parsed = JSON.parse(props.content);
    return parsed as ItemProperties;
  } catch (e: any) {
    if (e.code != 'ENOENT') {
      console.error('Error reading item properties file', e);
    }
  }
  return {};
}

function getPageRef(ids: string[], path: string, existing: string[]): string | null {
  if (ids?.[0] && ids.length === 1) {
    const resLocPath = resourceLocation.parse(ids[0]);
    if (resLocPath == null) return null;

    const primaryRef = resLocPath.path.replaceAll('/', '_');
    if (!existing.includes(primaryRef)) {
      return primaryRef;
    }
  }

  return path.replaceAll('/', '_');
}

async function constructDefaultTabs(frontmatter: Frontmatter, ctx: ProjectContext): Promise<InfoboxTab[]> {
  const idToName: { [key: string]: string } = {};

  const items = await Promise.all(frontmatter.id.map(id => getContentItemName(id, ctx)));
  items
    .filter(i => i != null)
    .forEach(i => idToName[i.id] = i.name);

  const tabs: InfoboxTab[] = frontmatter.id
    .map(id => {
      const name = idToName[id];

      return {
        name: name ?? id,
        display: [id]
      };
    });

  if (tabs?.[0] && tabs.length === 1 && frontmatter.icon) {
    tabs[0].display = [frontmatter.icon];
  }

  return tabs;
}

async function constructInfobox(frontmatter: Frontmatter, ctx: ProjectContext): Promise<Infobox> {
  const tabs = frontmatter.infobox?.tabs ?? await constructDefaultTabs(frontmatter, ctx);

  return {
    title: frontmatter.infobox?.title ?? frontmatter.title ?? null,
    tabs: tabs,
    inventory: frontmatter.infobox?.inventory ?? frontmatter.id
  };
}

function findTreeEntry<T extends { type: string; children: T[] }>(
  pred: (e: T) => boolean, e: T
): T | null {
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

async function resolveDocsLink(path: string, tree: FileTree): Promise<ResolvedLink | null> {
  for (const child of tree) {
    const entry = findTreeEntry(e => e.path == path, child);
    if (entry) {
      return {
        type: 'docs',
        ref: entry.path,
        title: entry.name
      };
    }
  }

  return null;
}

async function resolveContentLink(id: string, tree: ContentFileTree): Promise<ResolvedLink | null> {
  for (const child of tree) {
    const entry = findTreeEntry(
      e => e.id != null && e.id.includes(id),
      child as ExtendedContentFileTreeEntry
    );
    if (entry && entry.ref) {
      return {
        type: 'content',
        ref: entry.ref,
        title: entry.name
      };
    }
  }

  return null;
}

async function resolveRefContentLink(ref: string, tree: ContentFileTree): Promise<ResolvedLink | null> {
  for (const child of tree) {
    const entry = findTreeEntry(
      e => e.ref != null && e.ref === ref,
      child as ExtendedContentFileTreeEntry
    );
    if (entry && entry.ref) {
      return {
        type: 'content',
        ref: entry.ref,
        title: entry.name
      };
    }
  }

  return null;
}

async function resolveContentLinks(links: string[], ctx: ProjectContext): Promise<PageLinks> {
  const resolved: PageLinks = {};

  const src = await localDocs.getProjectSource(ctx.id);
  if (!src) {
    return resolved;
  }

  const docsTree = await localDocs.readDocsTree(src, ctx.locale ?? undefined);
  const contentTree = await getProjectContents(ctx);

  for (const href of links) {
    if (href.startsWith('$') && docsTree != null) {
      const path = href.substring(1);
      const link = await resolveDocsLink(path, docsTree);
      if (link) {
        resolved[href] = link;
      }
    } else if (href.startsWith('@') && contentTree != null) {
      const id = href.substring(1);
      const parsed = resourceLocation.parse(id);
      if (parsed && parsed.namespace == DEFAULT_NAMESPACE) {
        resolved[href] = {
          type: 'vanilla',
          ref: parsed.path,
          title: null
        };
        continue;
      }

      const link = await resolveContentLink(id, contentTree);
      if (link) {
        resolved[href] = link;
      }
    } else if (href.startsWith('+') && contentTree != null) {
      const ref = href.substring(1);
      const link = await resolveRefContentLink(ref, contentTree);
      if (link) {
        resolved[href] = link;
      }
    }
  }

  return resolved;
}

async function getLocalization(
  src: LocalDocumentationSource, namespace: string, locale?: string | null
): Promise<{ [key: string]: string } | null> {
  const langName = locale == null || locale == DEFAULT_LOCALE ? 'en_us' : `${locale}_${locale}`;

  try {
    const file = await localFiles.readFileContents(src, `.assets/${namespace}/lang/${langName}.json`);
    return JSON.parse(file.content) as { [key: string]: string };
  } catch (error) {
    console.error(`Error reading locale file for language ${langName}`, error);
    return null;
  }
}

async function getContentItemName(id: string, ctx: ProjectContext): Promise<ContentItemNameResponse | null> {
  const src = await localDocs.getProjectSource(ctx.id);
  if (!src) {
    return null;
  }

  const location = resourceLocation.parse(id);
  if (!location) {
    return null;
  }

  const locales = await getLocalization(src, location.namespace, ctx.locale);
  if (locales) {
    const candidates = [
      `item.${location.namespace}.${location.path}`,
      `block.${location.namespace}.${location.path}`
    ];
    for (const candidate of candidates) {
      if (locales[candidate]) {
        return {
          source: ctx.id,
          id,
          name: locales[candidate],
          path: null
        };
      }
    }
  }

  const contents = await getProjectContents(ctx);
  if (!contents) {
    return null;
  }
  const flat = flattenChildren(contents);
  for (const entry of flat) {
    if (entry.ref === id) {
      return {source: id, id, name: entry.name};
    }
  }
  return null;
}

function flattenChildren(entries: ContentFileTreeEntry[]): ContentFileTreeEntry[] {
  return [...entries, ...entries.flatMap(e => flattenChildren(e.children || []))];
}

export default {
  getLocalSourceContentTree,
  getLocalItemProperties,
  constructInfobox,
  findTreeEntry,
  resolveContentLinks,
  getProjectContents
};