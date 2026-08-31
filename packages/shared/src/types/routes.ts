export interface LocaleRouteParams {
  locale: string;
}

export interface ProjectRouteParams extends LocaleRouteParams {
  slug: string;
  version: string;
}

export interface ContentRouteParams extends ProjectRouteParams {
  id: string;
}

export interface DocsRouteParams extends ProjectRouteParams {
  path: string[];
}

export interface TableSearchParams {
  query?: string | string[];
  page?: string | string[];
}

export interface DevProjectRouteParams extends LocaleRouteParams {
  project: string;
}
