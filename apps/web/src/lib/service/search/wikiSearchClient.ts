'use client';

import { SearchResult, WikiSearchResult, WikiSearchResults } from '@/lib/service/search';
import { SearchClient as TypesenseSearchClient, DocumentSchema, SearchResponse, SearchParams } from 'typesense';
import {
  ObjectNotFound,
  RequestMalformed,
  RequestUnauthorized,
  ServerError,
  TypesenseError
} from 'typesense/lib/Typesense/Errors';
import { getDocsLink, getInternalWikiLink, getWikiProjectLink } from '@/lib/project/game/content';
import { DEFAULT_DOCS_VERSION } from '@repo/shared/constants';
import { AssetLocation } from '@repo/shared/assets';
import { ProjectContext } from '@repo/shared/types/service';
import commonService from '@/lib/service/commonService';

async function searchWiki(query: string, locale: string): Promise<WikiSearchResults> {
  try {
    const results = await searchWikiInternal(query, locale);
    if (results != null) {
      return results;
    }
  } catch (e) {
    console.error('Error running search', e);
  }

  return { total: 0, hits: [] };
}

async function searchWikiInternal(query: string, locale: string): Promise<WikiSearchResults | null> {
  const endpoint = process.env.NEXT_PUBLIC_SEARCH_ENDPOINT;
  const collectionName = process.env.NEXT_PUBLIC_SEARCH_COLLECTION;
  const apiKey = process.env.NEXT_PUBLIC_SEARCH_API_KEY;

  if (!endpoint || !collectionName || !apiKey) {
    return { total: 0, hits: [] };
  }

  const client = new TypesenseSearchClient({
    nodes: [{ url: endpoint }],
    apiKey,
    connectionTimeoutSeconds: 2,
    timeoutSeconds: 5,
    numRetries: 3,
    retryIntervalSeconds: 1,
    cacheSearchResultsForSeconds: 120
  });

  const searchParameters: SearchParams<SearchResult> = {
    q: query,
    query_by: 'title,item_ids,project_id,project_name,page_ref',
    per_page: 8,
    page: 1
  };

  const res = await searchInCollection<SearchResult>(client, collectionName, searchParameters);
  if (!res) {
    return null;
  }

  if (res.found === 0 || !res.hits?.length) {
    return null;
  }

  const hits = res.hits.map((h) => {
    const base = h.document;
    const href = getResultLink(base, locale);
    const icon = getResultIcon(base, locale);

    return {
      ...base,
      href,
      icon_asset: icon
    } satisfies WikiSearchResult;
  });

  return { total: res.found, hits };
}

async function searchInCollection<T extends DocumentSchema>(
  client: TypesenseSearchClient,
  collectionName: string,
  params: SearchParams<T>
): Promise<SearchResponse<T> | null> {
  try {
    return await client.collections<T>(collectionName).documents().search(params, {});
  } catch (err) {
    if (err instanceof RequestMalformed) {
      console.error('Bad search params:', err.httpBody);
    } else if (err instanceof RequestUnauthorized) {
      console.error('Auth failed — check apiKey');
    } else if (err instanceof ObjectNotFound) {
      console.error('Collection does not exist');
    } else if (err instanceof ServerError) {
      console.error('Typesense server error', err.httpStatus);
    } else if (err instanceof TypesenseError) {
      console.error('Typesense error', err.httpStatus, err.httpBody);
    } else {
      throw err;
    }
    return null;
  }
}

function getResultLink(result: SearchResult, locale: string): string {
  if (result.entry_type === 'project') {
    return getWikiProjectLink(locale, result.project_id);
  }
  if (result.entry_type === 'documentation') {
    return getDocsLink(result.page_ref, { id: result.project_id, locale, version: DEFAULT_DOCS_VERSION });
  }
  if (result.entry_type === 'content') {
    return getInternalWikiLink(result.page_ref, { locale, version: DEFAULT_DOCS_VERSION, id: result.project_id });
  }
  console.error('Unknown search result', result);
  return '';
}

function getResultIcon(result: SearchResult, locale: string): AssetLocation | null {
  if (result.entry_type === 'project' && result.project_icon_url != null) {
    return { src: result.project_icon_url, id: result.project_id };
  }

  if (result.icon == null) {
    return null;
  }

  const ctx: ProjectContext = {
    id: result.project_id,
    locale,
    version: DEFAULT_DOCS_VERSION
  };
  return commonService.getRemoteAsset(result.icon, ctx);
}

export default {
  searchWiki
};
