export interface ProjectSearchResult {
  id: string;
  name: string;
}

export interface WikiSearchResults {
  total: number;
  hits: WikiSearchResult[];
}

export interface WikiSearchResult {
  title: string;
  mod: string;
  url: string;
  icon?: string;
  mod_icon: string;
  mod_desc?: string;
  path?: string;
}