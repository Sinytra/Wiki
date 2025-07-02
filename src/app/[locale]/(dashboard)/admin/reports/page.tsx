import {setContextLocale} from "@/lib/locales/routing";
import adminApi from "@/lib/service/api/adminApi";
import {parseAsInteger, parseAsString} from "nuqs/server";
import {getTranslations} from "next-intl/server";
import DevProjectPageTitle from "@/components/dev/project/DevProjectPageTitle";
import * as React from "react";
import AdminDataImportsTable from "@/components/admin/table/AdminDataImportsTable";
import {handleApiCall} from "@/lib/service/serviceUtil";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";
import AdminReportsTable from "@/components/admin/table/AdminReportsTable";
import moderationApi from "@/lib/service/api/moderationApi";

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

export default async function ReportsPage(props: Properties) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  setContextLocale(params.locale);
  const t = await getTranslations('AdminReports');

  const query = parseAsString.withDefault('').parseServerSide(searchParams.query);
  const page = parseAsInteger.withDefault(1).parseServerSide(searchParams.page);

  const content = handleApiCall(await moderationApi.getProjectReports({query, page: page.toString()}));

  return (
    <div className="space-y-3 pt-1">
      <DevProjectPageTitle title={t('title')} desc={t('desc')}/>

      <ClientLocaleProvider keys={['DataTable']}>
        <AdminReportsTable data={content}
                           params={{locale: params.locale, slug: '', version: ''}}
                           page={page}
        />
      </ClientLocaleProvider>
    </div>
  )
}
