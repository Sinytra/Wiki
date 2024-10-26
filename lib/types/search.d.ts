export interface ModSearchResult {
  id: string;
  name: string;
}

interface PartialMod {
  id: string;
  name: string;
  source_repo: string;
  platform: string;
  slug: string;
  is_community: boolean;
}

interface WikiSearchResults {
  total: number;
  hits: WikiSearchResult[];
}

interface WikiSearchResult {
  title: string;
  mod: string;
  url: string;
  icon?: string;
  mod_icon: string;
  mod_desc?: string;
  path?: string;
}