'use client'

import {DevProjectVersion, DevProjectVersions} from "@/lib/service/remoteServiceApi";
import * as React from "react";
import {ordinalColumn, TableColumn, TableRouteParams} from "@/components/base/data-table/dataTableTypes";
import DataTable from "@/components/base/data-table/DataTable";

export default function DevProjectVersionsTable({data, page, params}: {
  data: DevProjectVersions;
  params: TableRouteParams;
  page: number;
}) {
  const columns: TableColumn<DevProjectVersion>[] = [
    ordinalColumn,
    {
      id: 'name',
      header: 'Name',
      cell: item => (
        <span>{item.name}</span>
      )
    },
    {
      id: 'branch',
      header: 'Branch',
      cell: item => (
        <span>{item.branch}</span>
      )
    }
  ];

  return (
    <DataTable columns={columns} data={data} params={params} page={page} />
  )
}