import BrowseProjectList from "@/components/navigation/browse/BrowseProjectList";
import {Suspense} from "react";
import ProjectSearch from "@/components/navigation/browse/BrowseSearch";
import LoadingContent from "@/components/util/LoadingContent";
import {setContextLocale} from "@/lib/locales/routing";
import {NextIntlClientProvider, useMessages, useTranslations} from "next-intl";
import BrowseFilterPanel from "@/components/navigation/browse/BrowseFilterPanel";
import BrowseSortDropdown from "@/components/navigation/browse/BrowseSortDropdown";
import {NuqsAdapter} from 'nuqs/adapters/next/app';
import {parseAsInteger, parseAsString} from "nuqs/server";
import {pick} from "lodash";

type Properties = {
  params: { locale: string };
  searchParams: {
    query?: string | string[];
    page?: string | string[];
    types?: string | string[];
    sort?: string | string[];
  }
}

export default function Browse({params, searchParams}: Properties) {
  setContextLocale(params.locale);
  const messages = useMessages();
  const t = useTranslations('BrowsePage');

  const query = parseAsString.withDefault('').parseServerSide(searchParams.query);
  const types = parseAsString.parseServerSide(searchParams.types);
  const sort = parseAsString.parseServerSide(searchParams.sort);
  const page = parseAsInteger.withDefault(1).parseServerSide(searchParams.page);

  return (
      <NuqsAdapter>
        <div className="flex flex-row gap-4 w-full justify-center">
          <aside
              className="p-3 bg-muted rounded-md w-full md:w-64 mb-2 md:mb-0 flex-shrink-0 md:sticky md:top-20 md:h-[calc(100vh_-_8rem)]"
          >
            <div className="p-1 flex flex-row items-center gap-4 pb-2">
              <span className="text-foreground text-lg">
                {t('sidebar.title')}
              </span>
            </div>

            <hr className="border-neutral-700 mt-1 mb-4"/>

            <NextIntlClientProvider messages={pick(messages, 'BrowsePage', 'SearchProjectTypes')}>
              <BrowseFilterPanel/>
            </NextIntlClientProvider>
          </aside>

          <div className="w-full max-w-[60rem] flex flex-col gap-2">
            <div className="flex flex-row justify-between w-full pb-4 mb-2 border-b border-neutral-700">
              <ProjectSearch placeholder={t('search')}/>

              <NextIntlClientProvider messages={pick(messages, 'BrowsePage', 'SearchProjectTypes')}>
                <BrowseSortDropdown/>
              </NextIntlClientProvider>
            </div>

            <Suspense fallback={
              <div className="w-full flex justify-center my-3">
                <LoadingContent/>
              </div>
            }>
              <BrowseProjectList query={query} page={page} types={types} sort={sort}/>
            </Suspense>
          </div>
        </div>
      </NuqsAdapter>
  )
}