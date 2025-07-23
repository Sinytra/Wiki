export interface LocaleRouteParams {
  locale: string;
}

export interface ProjectRouteParams extends LocaleRouteParams {
  slug: string;
  version: string;
}

export interface TableSearchParams {
  query?: string | string[];
  page?: string | string[];
}