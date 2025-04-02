import {ProjectContentPage} from "@/lib/service/remoteServiceApi";
import ImageWithFallback from "@/components/util/ImageWithFallback";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {ExternalLinkIcon, MoreHorizontal} from "lucide-react";
import {getInternalWikiLink} from "@/lib/game/content";
import * as React from "react";
import DataTable from "@/components/base/data-table/DataTable";
import service, {PaginatedData, ProjectVersions} from "@/lib/service";
import {ordinalColumn, TableColumn, TableRouteParams} from "@/components/base/data-table/dataTableTypes";

export default function DevProjectItemsTable({data, params, versions, page}: {
  data: PaginatedData<ProjectContentPage>;
  params: TableRouteParams;
  versions: ProjectVersions;
  page: number;
}) {
  const columns: TableColumn<ProjectContentPage>[] = [
    ordinalColumn,
    {
      id: 'icon',
      header: 'Icon',
      cell: item => (
        <div className="flex shrink-0 items-center justify-center size-7">
          <ImageWithFallback
            src={service.getAssetURL(params.slug, item.id, params.version)?.src}
            alt="icon"
            className="shrink-0 size-7"
            width={28}
            height={28}
            key={item.id}
          />
        </div>
      ),
      className: 'w-14'
    },
    {
      id: 'id',
      header: 'Identifier',
      cell: item => (
        <div className="font-mono text-xs sm:text-sm">{item.id}</div>
      )
    },
    {
      id: 'name',
      header: 'Name',
      cell: item => (
        <div>{item.name}</div>
      )
    },
    {
      id: 'path',
      header: 'Page path (internal)',
      cell: item => (
        <div className="font-medium">{item.path}</div>
      )
    },
    {
      id: 'link',
      header: '',
      cell: (item, i, params) => !item.path ? null : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-7 p-0 focus-visible:ring-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="w-5"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              Actions
            </DropdownMenuLabel>
            <DropdownMenuItem>
              <a href={getInternalWikiLink(item.id, params)} target="_blank"
                 className="w-full flex flex-row justify-between">
                View
                <ExternalLinkIcon className="w-5"/>
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: 'w-14'
    }
  ];

  return (
    <DataTable columns={columns} data={data} params={params} versions={versions} page={page} />
  )
}