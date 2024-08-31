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
}