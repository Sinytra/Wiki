'use client'

import {DataImport, DataImports} from "@/lib/service/remoteServiceApi";
import * as React from "react";
import {TableColumn, TableRouteParams} from "@/components/base/data-table/dataTableTypes";
import DataTable from "@/components/base/data-table/DataTable";

export default function AdminDataImportsTable({data, page, params}: {
  data: DataImports;
  params: TableRouteParams;
  page: number;
}) {
  const columns: TableColumn<DataImport>[] = [
    {
      id: 'id',
      header: 'ID',
      cell: item => (
        <span>{item.id}</span>
      )
    },
    {
      id: 'game_version',
      header: 'Game Version',
      cell: item => (
        <span>{item.game_version}</span>
      )
    },
    {
      id: 'loader',
      header: 'Loader',
      cell: item => (
        <span>{item.loader}</span>
      )
    },
    {
      id: 'loader_version',
      header: 'Loader Version',
      cell: item => (
        <span>{item.loader_version}</span>
      )
    },
    {
      id: 'user_id',
      header: 'User ID',
      cell: item => (
        <span>{item.user_id || '-'}</span>
      )
    },
    {
      id: 'created_at',
      header: 'Import date',
      cell: item => (
        <span>{item.created_at}</span>
      )
    },
  ];

  return (
    <DataTable columns={columns} data={data} params={params} page={page} />
  )
}