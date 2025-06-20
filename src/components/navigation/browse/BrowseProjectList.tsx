import BrowseProject from "@/components/navigation/browse/BrowseProject";
import {getTranslations} from "next-intl/server";
import service from "@/lib/service";
import DataTablePagination from "@repo/ui/blocks/data-table/DataTablePagination";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";

export default async function BrowseProjectList({ query, page, types, sort }: { query: string; page: number; types: string | null; sort: string | null; }) {
  const results = await service.searchProjects(query, page, types, sort);

  const t = await getTranslations('BrowsePage');

  return <>
    <div className="flex flex-col gap-3 sm:gap-2">
      {!results || results.data.length === 0
        ?
          <span className="text-secondary my-3 text-center">
            {t('no_results')}
          </span>
        :
        results.data.map((m) => (
          <BrowseProject key={m.id} project={m}/>
        ))
      }
    </div>

    <div className="mt-auto pt-4">
      <ClientLocaleProvider keys={['DataTable']}>
        <DataTablePagination pages={10} pageRangeDisplayed={3} />
      </ClientLocaleProvider>
    </div>
  </>
}