import * as React from "react";
import {ordinalColumn, TableColumn, TableRouteParams} from "@repo/ui/blocks/data-table/dataTableTypes";
import DataTable from "@repo/ui/blocks/data-table/DataTable";
import {useTranslations} from "next-intl";
import {PaginatedData, ProjectVersions} from "@repo/shared/types/service";
import {ProjectContentTag} from "@repo/shared/types/api/devProject";

export default function DevProjectTagsTable({data, params, versions, page}: {
  data: PaginatedData<ProjectContentTag>;
  params: TableRouteParams;
  versions: ProjectVersions;
  page: number;
}) {
  const t = useTranslations('DevProjectTagsTable');

  const columns: TableColumn<ProjectContentTag>[] = [
    ordinalColumn,
    {
      id: 'id',
      header: t('id'),
      cell: item => (
        <div className="py-1 font-mono text-xs sm:text-sm">{item.id}</div>
      )
    },
    {
      id: 'items',
      header: t('items'),
      cell: item => (
        <div className="text-xs sm:text-sm">{item.items.length}</div>
      )
    }
  ];

  return (
    <DataTable columns={columns} data={data} params={params} versions={versions} page={page}
               linker={r => `tags/${encodeURIComponent(r.id)}`}
    />
  )
}