import * as React from "react";
import {ordinalColumn, TableColumn, TableRouteParams} from "@repo/ui/blocks/data-table/dataTableTypes";
import DataTable from "@repo/ui/blocks/data-table/DataTable";
import {useTranslations} from "next-intl";
import {ProjectVersion, ProjectVersions} from "@repo/shared/types/api/devProject";

export default function DevProjectVersionsTable({data, page, params}: {
  data: ProjectVersions;
  params: TableRouteParams;
  page: number;
}) {
  const t = useTranslations('DevProjectVersionsTable');

  const columns: TableColumn<ProjectVersion>[] = [
    ordinalColumn,
    {
      id: 'name',
      header: t('name'),
      cell: item => (
        <span>{item.name}</span>
      )
    },
    {
      id: 'branch',
      header: t('branch'),
      cell: item => (
        <span>{item.branch}</span>
      )
    }
  ];

  return (
    <DataTable columns={columns} data={data} params={params} page={page} />
  )
}