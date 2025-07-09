import ImageWithFallback from "@/components/util/ImageWithFallback";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@repo/ui/components/dropdown-menu";
import {Button} from "@repo/ui/components/button";
import {ExternalLinkIcon, MoreHorizontal} from "lucide-react";
import {getInternalWikiLink} from "@/lib/game/content";
import * as React from "react";
import service from "@/lib/service";
import {ordinalColumn, TableColumn, TableRouteParams} from "@repo/ui/blocks/data-table/dataTableTypes";
import DataTable from "@repo/ui/blocks/data-table/DataTable";
import {useTranslations} from "next-intl";
import {PaginatedData, ProjectVersions} from "@repo/shared/types/service";
import {ProjectContentPage} from "@repo/shared/types/api/devProject";

export default function DevProjectItemsTable({data, params, versions, page}: {
  data: PaginatedData<ProjectContentPage>;
  params: TableRouteParams;
  versions: ProjectVersions;
  page: number;
}) {
  const t = useTranslations('DevProjectItemsTable');
  const ctx = {id: params.slug, version: params.version, locale: params.locale};

  const columns: TableColumn<ProjectContentPage>[] = [
    ordinalColumn,
    {
      id: 'icon',
      header: t('icon'),
      cell: item => (
        <div className="flex size-7 shrink-0 items-center justify-center">
          <ImageWithFallback
            src={service.getAssetURL(item.id, ctx)?.src}
            alt="icon"
            className="size-7 shrink-0"
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
      header: t('id'),
      cell: item => (
        <div className="font-mono text-xs sm:text-sm">{item.id}</div>
      )
    },
    {
      id: 'name',
      header: t('name'),
      cell: item => (
        <div>{item.name}</div>
      )
    },
    {
      id: 'path',
      header: t('path'),
      cell: item => (
        <div className="font-medium">{item.path}</div>
      )
    },
    {
      id: 'link',
      header: '',
      cell: (item, _, params) => !item.path ? null : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-7 p-0 focus-visible:ring-0">
              <span className="sr-only">
                {t('actions.open')}
              </span>
              <MoreHorizontal className="w-5"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {t('actions.title')}
            </DropdownMenuLabel>
            <DropdownMenuItem>
              <a href={getInternalWikiLink(item.id, params)} target="_blank"
                 className="flex w-full flex-row justify-between" rel="noreferrer">
                {t('actions.view')}
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