import BrowseProjectList from "@/components/navigation/browse/BrowseProjectList";
import {Suspense} from "react";
import ProjectSearch from "@/components/navigation/browse/BrowseSearch";
import LoadingContent from "@/components/util/LoadingContent";
import {setContextLocale} from "@/lib/locales/routing";
import {useTranslations} from "next-intl";
import BrowseFilterPanel from "@/components/navigation/browse/BrowseFilterPanel";
import BrowseSortDropdown from "@/components/navigation/browse/BrowseSortDropdown";
import {parseAsInteger, parseAsString} from "nuqs/server";
import CollapsibleDocsTreeBase from "@/components/docs/CollapsibleDocsTreeBase";
import ClientLocaleProvider from "@/components/util/ClientLocaleProvider";

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
  const t = useTranslations('BrowsePage');

  const query = parseAsString.withDefault('').parseServerSide(searchParams.query);
  const types = parseAsString.parseServerSide(searchParams.types);
  const sort = parseAsString.parseServerSide(searchParams.sort);
  const page = parseAsInteger.withDefault(1).parseServerSide(searchParams.page);

  return (
    <div className="flex flex-col md:flex-row gap-2 sm:gap-4 w-full md:justify-center page-wrapper-ext">
      <aside
        className="px-1 md:p-1.5 md:pt-2 bg-primary-alt border border-tertiary rounded-sm w-full md:w-64 mb-2 md:mb-0 shrink-0 md:sticky md:top-[75px] md:h-[calc(100vh_-_8rem)]"
      >
        <CollapsibleDocsTreeBase title={t('sidebar.title')} defaultOpen={false}>
          <ClientLocaleProvider keys={['BrowsePage', 'SearchProjectTypes']}>
            <BrowseFilterPanel/>
          </ClientLocaleProvider>
        </CollapsibleDocsTreeBase>
      </aside>

      <div className="w-full sm:max-w-[60rem] flex flex-col gap-2">
        <div
          className="flex flex-col gap-4 sm:flex-row flex-wrap items-end sm:items-start justify-between w-full pb-4 mb-2 border-b border-secondary">
          <ProjectSearch placeholder={t('search')}/>
          <ClientLocaleProvider keys={['BrowsePage', 'SearchProjectTypes']}>
            <BrowseSortDropdown/>
          </ClientLocaleProvider>
        </div>

        <ClientLocaleProvider keys={['ModVersionRange']}>
          <Suspense fallback={
            <div className="w-full flex justify-center my-3">
              <LoadingContent/>
            </div>
          }>
            <BrowseProjectList query={query} page={page} types={types} sort={sort}/>
          </Suspense>
        </ClientLocaleProvider>
      </div>
    </div>
  )
}