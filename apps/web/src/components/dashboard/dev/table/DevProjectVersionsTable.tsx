import * as React from 'react';
import { ordinalColumn, TableColumn } from '@repo/ui/blocks/data-table/dataTableTypes';
import DataTable from '@repo/ui/blocks/data-table/DataTable';
import { useTranslations } from 'next-intl';
import DevProjectTableEmptyState from '@/components/dashboard/dev/table/DevProjectTableEmptyState';
import { DevProjectVersions } from '@repo/shared/types/service';
import { ProjectVersionData } from '@sinytra/wiki-api-types';

function EmptyPlaceholder() {
  const t = useTranslations('DevProjectVersionsTable.empty');

  return (
    <DevProjectTableEmptyState guideLink={(args) => t.rich('desc', args)}>
      <p className="text-base">{t('title')}</p>
    </DevProjectTableEmptyState>
  );
}

export default function DevProjectVersionsTable({ data, page }: { data: DevProjectVersions; page: number }) {
  const t = useTranslations('DevProjectVersionsTable');

  const columns: TableColumn<ProjectVersionData>[] = [
    ordinalColumn,
    {
      id: 'name',
      header: t('name'),
      cell: (item) => <span>{item.name}</span>
    },
    {
      id: 'branch',
      header: t('branch'),
      cell: (item) => <span>{item.branch}</span>
    }
  ];

  return <DataTable columns={columns} data={data} page={page} emptyState={<EmptyPlaceholder />} />;
}
