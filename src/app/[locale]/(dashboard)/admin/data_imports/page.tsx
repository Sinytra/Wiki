import {setContextLocale} from "@/lib/locales/routing";
import adminApi from "@/lib/service/api/adminApi";
import {parseAsInteger, parseAsString} from "nuqs/server";
import {getTranslations} from "next-intl/server";
import DevProjectPageTitle from "@/components/dev/project/DevProjectPageTitle";
import * as React from "react";
import AdminDataImportsTable from "@/components/admin/table/AdminDataImportsTable";
import ClientLocaleProvider from "@/components/util/ClientLocaleProvider";
import {handleApiCall} from "@/lib/service/serviceUtil";

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

export default async function DataImportsPage({params, searchParams}: Properties) {
  setContextLocale(params.locale);
  const t = await getTranslations('AdminDataImports');

  const query = parseAsString.withDefault('').parseServerSide(searchParams.query);
  const page = parseAsInteger.withDefault(1).parseServerSide(searchParams.page);

  const content = handleApiCall(await adminApi.getDataImports({query, page: page.toString()}));

  return (
    <div className="space-y-3 pt-1">
      <DevProjectPageTitle title={t('title')} desc={t('desc')} />

      <ClientLocaleProvider keys={['DataTable']}>
        <AdminDataImportsTable data={content}
                               params={{locale: params.locale, slug: '', version: ''}}
                               page={page}
        />
      </ClientLocaleProvider>
    </div>
  )
}
