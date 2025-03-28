'use client'

import {DevProjectVersion, DevProjectVersions} from "@/lib/service/remoteServiceApi";
import * as React from "react";
import DevProjectContentTable, {TableColumn, TableRouteParams} from "@/components/dev/content/DevProjectContentTable";

export default function DevProjectVersionsTable({data, params}: {
  data: DevProjectVersions;
  params: TableRouteParams;
}) {
  const columns: TableColumn<DevProjectVersion>[] = [
    {
      id: 'select',
      header: 'Num.',
      cell: (_, i) => (
        <div className="text-center">{i + 1}</div>
      ),
      className: 'w-15'
    },
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
    <DevProjectContentTable columns={columns} data={data} params={params} />
  )
}