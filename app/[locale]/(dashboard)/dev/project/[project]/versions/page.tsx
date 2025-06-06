import {setContextLocale} from "@/lib/locales/routing";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import {redirect} from "next/navigation";
import {parseAsInteger, parseAsString} from "nuqs/server";
import {DEFAULT_DOCS_VERSION} from "@/lib/constants";
import {getTranslations} from "next-intl/server";
import DevProjectVersionsTable from "@/components/dev/table/DevProjectVersionsTable";
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

export default async function DevProjectVersionsPage({params, searchParams}: Properties) {
  setContextLocale(params.locale);
  const t = await getTranslations('DevProjectVersionsPage');

  const project = await remoteServiceApi.getDevProject(params.project);
  if (!('id' in project)) {
    return redirect('/dev');
  }

  const query = parseAsString.withDefault('').parseServerSide(searchParams.query);
  const page = parseAsInteger.withDefault(1).parseServerSide(searchParams.page);

  const content = await remoteServiceApi.getDevProjectVersions(
    params.project,
    {query, page: page.toString()}
  );
  if ('status' in content) {
    return redirect('/dev');
  }

  return (
    <div className="pt-1 space-y-3">
      <DevProjectPageTitle title={t('title')} desc={t('desc')} />

      <ClientLocaleProvider keys={['DocsVersionSelector']}>
        <DevProjectVersionsTable data={content}
                                 params={{locale: params.locale, slug: params.project, version: DEFAULT_DOCS_VERSION}}
                                 page={page}
        />
      </ClientLocaleProvider>
    </div>
  )
}
