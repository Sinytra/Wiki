import {setContextLocale} from "@/lib/locales/routing";
import {parseAsInteger, parseAsString} from "nuqs/server";
import {DEFAULT_DOCS_VERSION} from "@repo/shared/constants";
import {getTranslations} from "next-intl/server";
import DevProjectVersionsTable from "@/components/dev/table/DevProjectVersionsTable";
import DevProjectPageTitle from "@/components/dev/project/DevProjectPageTitle";
import * as React from "react";
import {handleApiCall} from "@/lib/service/serviceUtil";
import devProjectApi from "@/lib/service/api/devProjectApi";

type Properties = {
  params: {
    locale: string;
    project: string;
  };
  searchParams: {
    query?: string | string[];
    page?: string | string[];
    version?: string;
  }
}

export default async function DevProjectVersionsPage({params, searchParams}: Properties) {
  setContextLocale(params.locale);
  const t = await getTranslations('DevProjectVersionsPage');
  const project = handleApiCall(await devProjectApi.getProject(params.project));

  const query = parseAsString.withDefault('').parseServerSide(searchParams.query);
  const page = parseAsInteger.withDefault(1).parseServerSide(searchParams.page);

  const content = handleApiCall(await devProjectApi.getProjectVersions(params.project, {query, page: page.toString()}));

  return (
    <div className="space-y-3 pt-1">
      <DevProjectPageTitle title={t('title')} desc={t('desc')} />

      <DevProjectVersionsTable data={content}
                               params={{locale: params.locale, slug: params.project, version: DEFAULT_DOCS_VERSION}}
                               page={page}
      />
    </div>
  )
}
