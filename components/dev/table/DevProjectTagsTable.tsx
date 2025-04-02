import {ProjectContentTag} from "@/lib/service/remoteServiceApi";
import * as React from "react";
import DataTable from "@/components/base/data-table/DataTable";
import {PaginatedData, ProjectVersions} from "@/lib/service";
import {Button} from "@/components/ui/button";
import {EyeIcon} from "lucide-react";
import {Link} from "@/lib/locales/routing";
import {ordinalColumn, TableColumn, TableRouteParams} from "@/components/base/data-table/dataTableTypes";

export default function DevProjectTagsTable({data, params, versions, page}: {
  data: PaginatedData<ProjectContentTag>;
  params: TableRouteParams;
  versions: ProjectVersions;
  page: number;
}) {
  const columns: TableColumn<ProjectContentTag>[] = [
    ordinalColumn,
    {
      id: 'id',
      header: 'Identifier',
      cell: item => (
        <div className="font-mono text-xs sm:text-sm">{item.id}</div>
      )
    },
    {
      id: 'items',
      header: 'Item count',
      cell: item => (
        <div className="text-xs sm:text-sm">{item.items.length}</div>
      )
    },
    {
      id: 'options',
      header: '',
      cell: (tag, i, params) => (
        <Link href={`tags/${encodeURIComponent(tag.id)}`}>
          <Button variant="ghost" className="size-7 p-0 focus-visible:ring-0">
            <EyeIcon className="w-5"/>
          </Button>
        </Link>
      ),
      className: 'w-14'
    }
  ];

  return (
    <>
      <DataTable columns={columns} data={data} params={params} versions={versions} page={page} />
    </>
  )
}