import BrowseProjectList from "@/components/navigation/browse/BrowseProjectList";
import {Suspense, use} from "react";
import ProjectSearch from "@/components/navigation/browse/BrowseSearch";
import LoadingContent from "@/components/util/LoadingContent";
import {setContextLocale} from "@/lib/locales/routing";
import {useTranslations} from "next-intl";
import BrowseFilterPanel from "@/components/navigation/browse/BrowseFilterPanel";
import BrowseSortDropdown from "@/components/navigation/browse/BrowseSortDropdown";
import {parseAsInteger, parseAsString} from "nuqs/server";
import CollapsibleDocsTreeBase from "@/components/docs/CollapsibleDocsTreeBase";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";

type Properties = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    query?: string | string[];
    page?: string | string[];
    types?: string | string[];
    sort?: string | string[];
  }>
}

export default function BrowsePage(props: Properties) {
  const searchParams = use(props.searchParams);
  const params = use(props.params);
  setContextLocale(params.locale);
  const t = useTranslations('BrowsePage');

  const query = parseAsString.withDefault('').parseServerSide(searchParams.query);
  const types = parseAsString.parseServerSide(searchParams.types);
  const sort = parseAsString.parseServerSide(searchParams.sort);
  const page = parseAsInteger.withDefault(1).parseServerSide(searchParams.page);

  return (
    <div className="page-wrapper-ext flex w-full flex-col gap-2 sm:gap-4 md:flex-row md:justify-center">
      <aside
        className={`
          mb-2 w-full shrink-0 rounded-sm border border-tertiary bg-primary-alt px-1 md:mb-0 md:h-[calc(100vh_-_8rem)]
          md:w-64 md:p-1.5 md:pt-2
        `}
      >
        <CollapsibleDocsTreeBase title={t('sidebar.title')} defaultOpen={false}>
          <ClientLocaleProvider keys={['BrowsePage', 'SearchProjectTypes']}>
            <BrowseFilterPanel/>
          </ClientLocaleProvider>
        </CollapsibleDocsTreeBase>
      </aside>

      <div className="flex w-full flex-col gap-2 sm:max-w-[60rem]">
        <div
          className={`
            mb-2 flex w-full flex-col flex-wrap items-end justify-between gap-4 border-b border-secondary pb-4
            sm:flex-row sm:items-start
          `}>
          <ProjectSearch placeholder={t('search')}/>
          <ClientLocaleProvider keys={['BrowsePage', 'SearchProjectTypes']}>
            <BrowseSortDropdown/>
          </ClientLocaleProvider>
        </div>

        <ClientLocaleProvider keys={['ModVersionRange']}>
          <Suspense fallback={
            <div className="my-3 flex w-full justify-center">
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