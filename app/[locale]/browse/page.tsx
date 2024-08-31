import database from "@/lib/database";
import {Input} from "@/components/ui/input";
import {SearchIcon} from "lucide-react";
import BrowseModProject from "@/components/navigation/browse/BrowseModProject";
import TablePagination from "@/components/navigation/TablePagination";
import {Mod} from "@prisma/client";

function ProjectSearch() {
  return (
    <div className="flex flex-row w-full pb-4 mb-2 border-b border-neutral-600">
      <div className="relative text-muted-foreground">
        <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"/>
        <Input className="w-96 pl-9" type="text" placeholder="Search mods..."/>
      </div>
    </div>
  )
}

export default async function Browse({searchParams}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const query = searchParams ? searchParams.query as string | null : null;
  const page = searchParams?.page ? +searchParams.page : 1;
  const [mods, meta] = await database.searchProjectsPaginated(20, query as any, page);

  return (
    <div className="flex flex-row gap-4 w-full justify-center">
      <aside className="w-64 flex-shrink-0 bg-muted rounded-md px-2 pb-2">
        Navigation
      </aside>
      <div className="w-full max-w-[67rem] flex flex-col gap-2">
        <ProjectSearch/>

        <div className="flex flex-col gap-2">
          {...(mods as Mod[]).map((m, index) => (
            <BrowseModProject key={m.id + '_' + index} mod={m}/>
          ))}
        </div>

        <div className="mt-auto pt-4">
          <TablePagination current={page} total={meta.pageCount} />
        </div>
      </div>
    </div>
  )
}