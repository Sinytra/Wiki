import {setContextLocale} from "@/lib/locales/routing";
import {parseAsInteger, parseAsString} from "nuqs/server";
import {getTranslations} from "next-intl/server";
import DevProjectVersionsTable from "@/components/dashboard/dev/table/DevProjectVersionsTable";
import DevProjectPageTitle from "@/components/dashboard/dev/project/DevProjectPageTitle";
import * as React from "react";
import {handleApiCall} from "@/lib/service/serviceUtil";
import devProjectApi from "@/lib/service/api/devProjectApi";
import {DevProjectRouteParams} from "@repo/shared/types/routes";

type Properties = {
  params: Promise<DevProjectRouteParams>;
  searchParams: Promise<{
    query?: string | string[];
    page?: string | string[];
  }>
}

export default async function DevProjectVersionsPage(props: Properties) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  setContextLocale(params.locale);
  const t = await getTranslations('DevProjectVersionsPage');

  const query = parseAsString.withDefault('').parseServerSide(searchParams.query);
  const page = parseAsInteger.withDefault(1).parseServerSide(searchParams.page);

  const content = handleApiCall(await devProjectApi.getProjectVersions(params.project, {query, page: page.toString()}));

  return (
    <div className="space-y-3 pt-1">
      <DevProjectPageTitle title={t('title')} desc={t('desc')} />

      <DevProjectVersionsTable data={content} page={page}/>
    </div>
  )
}
