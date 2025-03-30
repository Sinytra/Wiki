'use client'

import {ProjectContentTag} from "@/lib/service/remoteServiceApi";
import * as React from "react";
import DevProjectContentTable, {TableColumn, TableRouteParams} from "@/components/dev/content/DevProjectContentTable";
import {PaginatedData, ProjectVersions} from "@/lib/service";
import {Button} from "@/components/ui/button";
import {EyeIcon} from "lucide-react";
import {Link} from "@/lib/locales/routing";

export default function DevProjectTagsTable({data, params, versions}: {
  data: PaginatedData<ProjectContentTag>;
  params: TableRouteParams;
  versions: ProjectVersions
}) {
  const columns: TableColumn<ProjectContentTag>[] = [
    {
      id: 'select',
      header: 'Num.',
      cell: (_, i) => (
        <div className="text-center">{i + 1}</div>
      ),
      className: 'w-15'
    },
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
      <DevProjectContentTable columns={columns} data={data} params={params} versions={versions} />
    </>
  )
}