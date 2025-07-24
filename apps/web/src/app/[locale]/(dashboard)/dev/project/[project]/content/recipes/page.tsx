import {setContextLocale} from "@/lib/locales/routing";
import {parseAsInteger, parseAsString} from "nuqs/server";
import {DEFAULT_DOCS_VERSION} from "@repo/shared/constants";
import {getTranslations} from "next-intl/server";
import DevProjectRecipesTable from "@/components/dev/table/DevProjectRecipesTable";
import DevProjectPageTitle from "@/components/dev/project/DevProjectPageTitle";
import * as React from "react";
import {handleApiCall} from "@/lib/service/serviceUtil";
import devProjectApi from "@/lib/service/api/devProjectApi";

type Properties = {
  params: Promise<{
    locale: string;
    project: string;
  }>;
  searchParams: Promise<{
    query?: string | string[];
    page?: string | string[];
    version?: string;
  }>
}

export default async function DevProjectContentRecipesPage(props: Properties) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  setContextLocale(params.locale);
  const t = await getTranslations('DevProjectContentRecipesPage');
  const project = handleApiCall(await devProjectApi.getProject(params.project));

  const query = parseAsString.withDefault('').parseServerSide(searchParams.query);
  const version = parseAsString.parseServerSide(searchParams.version);
  const page = parseAsInteger.withDefault(1).parseServerSide(searchParams.page);

  const content = handleApiCall(await devProjectApi.getProjectContentRecipes(params.project, {
    query,
    page: page.toString(),
    version
  }));

  return (
    <div className="space-y-3 pt-1">
      <DevProjectPageTitle title={t('title')} desc={t('desc')}/>

      <DevProjectRecipesTable data={content}
                              versions={project.versions || []}
                              ctx={{locale: params.locale, id: params.project, version: DEFAULT_DOCS_VERSION}}
                              page={page}
      />
    </div>
  )
}
