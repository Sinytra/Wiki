export interface LocaleRouteParams {
  locale: string;
}

export interface ProjectRouteParams extends LocaleRouteParams {
  slug: string;
  version: string;
}