import * as React from "react";
import {ordinalColumn, TableColumn} from "@repo/ui/blocks/data-table/dataTableTypes";
import DataTable from "@repo/ui/blocks/data-table/DataTable";
import {useTranslations} from "next-intl";
import {ProjectVersion, ProjectVersions} from "@repo/shared/types/api/devProject";
import DevProjectTableEmptyState from "@/components/dev/table/DevProjectTableEmptyState";

function EmptyPlaceholder() {
  const t = useTranslations('DevProjectVersionsTable.empty');

  return (
    <DevProjectTableEmptyState guideLink={(args) => t.rich('desc', args)}>
      <p className="text-base">
        {t('title')}
      </p>
    </DevProjectTableEmptyState>
  )
}

export default function DevProjectVersionsTable({data, page}: {
  data: ProjectVersions;
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
    <DataTable columns={columns} data={data} page={page} emptyState={<EmptyPlaceholder/>}/>
  )
}