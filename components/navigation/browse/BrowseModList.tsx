import {Mod} from "@prisma/client";
import BrowseModProject from "@/components/navigation/browse/BrowseModProject";
import TablePagination from "@/components/navigation/TablePagination";
import database from "@/lib/database";

export default async function BrowseModList({ query, page }: { query: string; page: string }) {
  const [mods, meta] = await database.searchProjectsPaginated(20, query as any, page);

  return <>
    <div className="flex flex-col gap-2">
      {...(mods as Mod[]).map((m, index) => (
        <BrowseModProject key={m.id + '_' + index} mod={m}/>
      ))}
      {mods.length === 0 &&
          <span className="text-center my-3 text-muted-foreground">Search query returned no results!</span>
      }
    </div>

    <div className="mt-auto pt-4">
      <TablePagination current={page} total={meta.pageCount}/>
    </div>
  </>
}