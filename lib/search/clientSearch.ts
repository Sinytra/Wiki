import {WikiSearchResults} from "@/lib/search";
import {searchWikiServer} from "@/lib/search/serverSearch";

async function searchWiki(query: string): Promise<WikiSearchResults> {
  try {
    return await searchWikiServer(query);
  } catch (e) {
    console.error('Error retrieving search results', e);
  }
  return { total: 0, hits: [] };
}

export default {
  searchWiki
}