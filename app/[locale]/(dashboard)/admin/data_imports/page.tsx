import {setContextLocale} from "@/lib/locales/routing";
import adminApi from "@/lib/service/remote/adminApi";
import {redirect} from "next/navigation";
import {NuqsAdapter} from "nuqs/adapters/next/app";
import {parseAsInteger, parseAsString} from "nuqs/server";
import {NextIntlClientProvider} from "next-intl";
import {getMessages, getTranslations} from "next-intl/server";
import DevProjectPageTitle from "@/components/dev/project/DevProjectPageTitle";
import * as React from "react";
import AdminDataImportsTable from "@/components/admin/table/AdminDataImportsTable";

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

  const content = await adminApi.getDataImports({query, page: page.toString()});
  if ('status' in content) {
    return redirect('/admin');
  }

  const messages = await getMessages();

  return (
    <div className="pt-1 space-y-3">
      <DevProjectPageTitle title={t('title')} desc={t('desc')} />

      <NuqsAdapter>
        <NextIntlClientProvider messages={messages}>
          <AdminDataImportsTable data={content}
                                 params={{locale: params.locale, slug: '', version: ''}}
                                 page={page}
          />
        </NextIntlClientProvider>
      </NuqsAdapter>
    </div>
  )
}
