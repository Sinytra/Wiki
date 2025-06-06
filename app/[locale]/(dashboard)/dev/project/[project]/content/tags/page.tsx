import {setContextLocale} from "@/lib/locales/routing";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import {redirect} from "next/navigation";
import {parseAsInteger, parseAsString} from "nuqs/server";
import {DEFAULT_DOCS_VERSION} from "@/lib/constants";
import {getTranslations} from "next-intl/server";
import DevProjectTagsTable from "@/components/dev/table/DevProjectTagsTable";
import DevProjectPageTitle from "@/components/dev/project/DevProjectPageTitle";
import * as React from "react";
import ClientLocaleProvider from "@/components/util/ClientLocaleProvider";

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

export default async function DevProjectContentTagsPage({params, searchParams}: Properties) {
  setContextLocale(params.locale);
  const t = await getTranslations('DevProjectContentTagsPage');

  const project = await remoteServiceApi.getDevProject(params.project);
  if (!('id' in project)) {
    return redirect('/dev');
  }

  const query = parseAsString.withDefault('').parseServerSide(searchParams.query);
  const version = parseAsString.parseServerSide(searchParams.version);
  const page = parseAsInteger.withDefault(1).parseServerSide(searchParams.page);

  const content = await remoteServiceApi.getDevProjectContentTags(
    params.project,
    {query, page: page.toString(), version}
  );
  if ('status' in content) {
    return redirect('/dev');
  }

  return (
    <div className="space-y-3 pt-1">
      <DevProjectPageTitle title={t('title')} desc={t('desc')} />

      <ClientLocaleProvider keys={['DocsVersionSelector']}>
        <DevProjectTagsTable data={content}
                             versions={project.versions || []}
                             params={{locale: params.locale, slug: params.project, version: DEFAULT_DOCS_VERSION}}
                             page={page}
        />
      </ClientLocaleProvider>
    </div>
  )
}
