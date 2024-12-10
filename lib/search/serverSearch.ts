'use server'

import {WikiSearchResult, WikiSearchResults} from "@/lib/search";
import {getProcessURL} from "@/lib/utils";

export async function searchWikiServer(query: string): Promise<WikiSearchResults> {
  if (!process.env.SEARCH_ENDPOINT || !process.env.SEARCH_INDEX || !process.env.SEARCH_API_KEY) {
    return {total: 0, hits: []};
  }

  try {
    const payload = {
      query: {
        multi_match: {
          query,
          type: "bool_prefix",
          fields: [
            "all_docs_content",
            "all_docs_content._2gram",
            "all_docs_content._3gram"
          ]
        }
      },
      stored_fields: [],
      fields: ["docs_title", "docs_icon", "docs_source_mod", "docs_source_desc", "docs_source_icon", "url_path"],
      size: 8,
      _source: false
    };

    const results = await fetch(`${process.env.SEARCH_ENDPOINT}/${process.env.SEARCH_INDEX}/_search?pretty`, {
      method: 'POST',
      headers: {
        Authorization: `ApiKey ${process.env.SEARCH_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (results.ok) {
      const body = await results.json();
      if (body?.hits?.hits) {
        const hits = body.hits.hits as any[];

        const mappedHits = hits.map(hit => {
          const url_path = hit.fields.url_path[0];
          const path = url_path.split('/').slice(5).join(' > ');
          const url = getProcessURL() + url_path.replace('/en/mod/', '/en/project/');

          return {
            title: hit.fields.docs_title?.[0],
            mod: hit.fields.docs_source_mod?.[0],
            url,
            mod_icon: hit.fields.docs_source_icon[0],
            mod_desc: hit.fields.docs_source_desc ? hit.fields.docs_source_desc[0] : undefined,
            icon: hit.fields.docs_icon ? hit.fields.docs_icon[0] : undefined,
            path
          };
        }) as WikiSearchResult[];

        return {
          total: body.hits.total.value || 0,
          hits: mappedHits
        }
      }
    } else {
      throw new Error(results.status.toString());
    }
  } catch (e) {
    console.error('Error running search', e);
  }

  return {total: 0, hits: []};
}
