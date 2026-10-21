import { unstable_cache } from 'next/cache';
import { promises as fs, readdirSync } from 'fs';
import { DEFAULT_LOCALE, DOCS_METADATA_FILE_NAME } from '@repo/shared/constants';
import metadata, { ValidationError } from './localMetadata';
import { FileTree } from '@repo/shared/types/service';
import { ProjectPlatforms } from '@repo/shared/types/platform';
import localFiles from './localFiles';
import env from '@repo/shared/env';
import { buildDocsTree, localizedPath, pagePath, translationsDir, TreeIssue } from '@sinytra/wiki-wasm';
import { ProjectSchemaVersion } from '@sinytra/wiki-api-types';
import locales from '@repo/shared/locales';

export interface LocalDocumentationSource {
  id: string;
  modid: string | null;
  platforms: ProjectPlatforms;
  is_community: boolean;
  path: string;
  schema: ProjectSchemaVersion;
}

export interface LocalDocumentationFile {
  content: string;
  edit_url: string | null;
}

async function getProjectSource(slug: string): Promise<LocalDocumentationSource | null> {
  const localSources = await getLocalDocumentationSources();
  const src = localSources.find((s) => s.id === slug);
  return src || null;
}

export async function getLocalDocumentationSources(): Promise<LocalDocumentationSource[]> {
  const localPaths = process.env.LOCAL_DOCS_ROOTS || '';

  if (env.isPreview()) {
    return computeLocalDocumentationSources(localPaths);
  }

  const cache = unstable_cache(async (paths: string) => computeLocalDocumentationSources(paths), [], {
    tags: ['local_sources']
  });
  return cache(localPaths);
}

async function computeLocalDocumentationSources(paths: string): Promise<LocalDocumentationSource[]> {
  const roots = paths!.split(';');

  return Promise.all(
    roots
      .filter((p) => p.length > 0)
      .map(async (root) => {
        const file = await fs.readFile(`${root}/${DOCS_METADATA_FILE_NAME}`, 'utf8');
        const data = metadata.parseMetadataFile(file);

        return {
          schema: data.schema,
          id: data.id,
          modid: data.modid ?? null,
          platforms: {
            [data.platform as any]: data.slug, // TODO
            ...data.platforms
          },
          path: root,
          is_community: false,
          type: 'local'
        };
      })
  );
}

async function readDocsFile(
  source: LocalDocumentationSource,
  type: 'docs' | 'content',
  slug: string[],
  locale?: string,
  optional?: boolean
): Promise<LocalDocumentationFile | null> {
  try {
    const joined = slug.join('/');
    const content = await readLocalizedFile(source, pagePath(source.schema, type, joined), locale);
    if (!content) {
      throw new Error(`Documentation file at ${slug} not found`);
    }
    return content;
  } catch (e) {
    if (!optional) {
      throw e;
    }
  }

  return null;
}

async function getAvailableLocales(source: LocalDocumentationSource): Promise<string[]> {
  const cache = unstable_cache(async () => computeAvailableLocales(source), [`mod_locales:${source.id}`], {
    tags: [`mod_locales:${source.id}`]
  });
  return await cache();
}

async function computeAvailableLocales(source: LocalDocumentationSource): Promise<string[]> {
  const localeDirRegex = /^[a-z]{2}_[a-z]{2}$/;
  try {
    const translations = readdirSync(`${source.path}/${translationsDir(source.schema)}`, { withFileTypes: true });
    return translations.filter((t) => t.isDirectory() && t.name.match(localeDirRegex)).map((t) => t.name);
  } catch {
    return [];
  }
}

async function readDocsTree(source: LocalDocumentationSource, locale?: string): Promise<FileTree> {
  return readFileTree(source, 'docs', locale);
}

async function readFileTree(
  source: LocalDocumentationSource,
  type: 'docs' | 'content',
  locale?: string
): Promise<FileTree> {
  const actualLocale = await resolveTreeLocale(source, locale);
  const { tree, issues } = buildDocsTree(source.path, source.schema, type, actualLocale);
  reportTreeIssues(issues);
  return tree;
}

async function resolveTreeLocale(source: LocalDocumentationSource, locale?: string): Promise<string | undefined> {
  if (!locale || locale === DEFAULT_LOCALE) {
    return undefined;
  }
  const code = locales.resolveParam(locale);
  const availableLocales = await getAvailableLocales(source);
  return availableLocales.includes(code) ? code : undefined;
}

const reportedWarnings = new Set<string>();

function warnOnce(message: string) {
  if (!reportedWarnings.has(message)) {
    reportedWarnings.add(message);
    console.warn(message);
  }
}

function reportTreeIssues(issues: TreeIssue[]) {
  if (issues.length === 0) {
    return;
  }
  const message = issues.map((issue) => `- ${issue.path}: ${issue.message}`).join('\n');
  if (process.env.NODE_ENV !== 'production' && issues.some((issue) => issue.kind === 'folder_metadata')) {
    throw new ValidationError(`Error validating folder metadata:\n${message}`);
  }
  warnOnce(`Problems reading documentation tree:\n${message}`);
}

async function readLocalizedFile(
  source: LocalDocumentationSource,
  path: string,
  locale?: string
): Promise<LocalDocumentationFile> {
  const code = await resolveTreeLocale(source, locale);
  if (code) {
    try {
      return await localFiles.readFileContents(source, localizedPath(source.schema, path, code));
    } catch {
      // fallback to default locale
    }
  }
  return await localFiles.readFileContents(source, path);
}

export default {
  getProjectSource,
  readDocsTree,
  readDocsFile,
  getAvailableLocales,
  resolveTreeLocale,
  reportTreeIssues,
  warnOnce
};
