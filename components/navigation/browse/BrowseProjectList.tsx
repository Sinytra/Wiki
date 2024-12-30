import BrowseProject from "@/components/navigation/browse/BrowseProject";
import TablePagination from "@/components/navigation/TablePagination";
import {getTranslations} from "next-intl/server";
import service from "@/lib/service";

export default async function BrowseProjectList({ query, page, types, sort }: { query: string; page: number; types: string | null; sort: string | null; }) {
  const results = await service.searchProjects(query, page, types, sort);

  const t = await getTranslations('BrowsePage');

  return <>
    <div className="flex flex-col gap-3 sm:gap-2">
      {...results.data.map((m) => (
        <BrowseProject key={m.id} project={m}/>
      ))}
      {results.data.length === 0 &&
          <span className="text-center my-3 text-muted-foreground">
              {t('no_results')}
          </span>
      }
    </div>

    <div className="mt-auto pt-4">
      <TablePagination current={page} total={results.pages}/>
    </div>
  </>
}