import {setContextLocale} from "@/lib/locales/routing";
import {parseAsInteger, parseAsString} from "nuqs/server";
import {getTranslations} from "next-intl/server";
import DevProjectTagsTable from "@/components/dashboard/dev/table/DevProjectTagsTable";
import DevProjectPageTitle from "@/components/dashboard/dev/project/DevProjectPageTitle";
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

export default async function DevProjectContentTagsPage(props: Properties) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  setContextLocale(params.locale);
  const t = await getTranslations('DevProjectContentTagsPage');
  const project = handleApiCall(await devProjectApi.getProject(params.project));

  const query = parseAsString.withDefault('').parseServerSide(searchParams.query);
  const version = parseAsString.parseServerSide(searchParams.version);
  const page = parseAsInteger.withDefault(1).parseServerSide(searchParams.page);

  const content = handleApiCall(await devProjectApi.getProjectContentTags(params.project, {query, page: page.toString(), version}));

  return (
    <div className="space-y-3 pt-1">
      <DevProjectPageTitle title={t('title')} desc={t('desc')} />

      <DevProjectTagsTable data={content} versions={project.versions || []} page={page}/>
    </div>
  )
}
