import {setContextLocale} from "@/lib/locales/routing";
import adminApi from "@/lib/service/api/adminApi";
import {parseAsInteger, parseAsString} from "nuqs/server";
import {getTranslations} from "next-intl/server";
import DevProjectPageTitle from "@/components/dev/project/DevProjectPageTitle";
import * as React from "react";
import {handleApiCall} from "@/lib/service/serviceUtil";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";
import {LocaleRouteParams, TableSearchParams} from "@repo/shared/types/routes";
import AdminAccessKeysTable from "@/components/admin/table/AdminAccessKeysTable";

type Properties = {
  params: Promise<LocaleRouteParams>;
  searchParams: Promise<TableSearchParams>
}

export default async function AccessKeysPage(props: Properties) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  setContextLocale(params.locale);
  const t = await getTranslations('AdminAccessKeys');

  const query = parseAsString.withDefault('').parseServerSide(searchParams.query);
  const page = parseAsInteger.withDefault(1).parseServerSide(searchParams.page);

  const content = handleApiCall(await adminApi.getAccessKeys({query, page: page.toString()}));

  return (
    <div className="space-y-3 pt-1">
      <DevProjectPageTitle title={t('title')} desc={t('desc')} />

      <ClientLocaleProvider keys={['DataTable']}>
        <AdminAccessKeysTable data={content} page={page}/>
      </ClientLocaleProvider>
    </div>
  )
}
