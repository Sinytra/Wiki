import BrowseProject from "@/components/navigation/browse/BrowseProject";
import TablePagination from "@/components/navigation/TablePagination";
import {getTranslations} from "next-intl/server";
import service from "@/lib/service";

export default async function BrowseProjectList({ query, page }: { query: string; page: number }) {
  const results = await service.searchProjects(query as any, page || 1);

  const t = await getTranslations('BrowsePage');

  return <>
    <div className="flex flex-col gap-2">
      {...results.data.map((m) => (
        <BrowseProject key={m.id} mod={m}/>
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