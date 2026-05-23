import * as React from 'react';
import {AdminProjectInfo, PaginatedData} from '@sinytra/wiki-api-types';
import {TableColumn} from '@repo/ui/blocks/data-table/dataTableTypes';
import DataTable from '@repo/ui/blocks/data-table/DataTable';
import LocalDateTime from '@repo/ui/util/LocalDateTime';
import navigation from '@/lib/navigation';

export default function AdminProjectsTable({data, page}: {
  data: PaginatedData<AdminProjectInfo>;
  page: number;
}) {
  const columns: TableColumn<AdminProjectInfo>[] = [
    {
      id: 'id',
      header: 'ID',
      cell: item => (
        <span>{item.id}</span>
      )
    },
    {
      id: 'name',
      header: 'Name',
      cell: item => (
        <span>{item.name}</span>
      )
    },
    {
      id: 'type',
      header: 'Type',
      cell: item => (
        <span>{item.type}</span>
      )
    },
    {
      id: 'modid',
      header: 'Mod ID',
      cell: item => (
        <span className="font-mono">{item.mod_id || '-'}</span>
      )
    },
    {
      id: 'created_at',
      header: 'Created at',
      cell: item => (
        <LocalDateTime form="LLL d, yyyy" dateTime={new Date(item.created_at)}/>
      )
    },
  ];

  return (
    <DataTable columns={columns} data={data} page={page}
               linker={r => navigation.getDevProjectLink(r.id)}
    />
  );
}