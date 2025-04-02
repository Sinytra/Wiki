import {PaginatedData, ProjectVersions} from "@/lib/service";
import {TableCell, TableHead} from "@/components/ui/table";
import {cn} from "@/lib/utils";
import * as React from "react";
import {ReactNode} from "react";
import DataTableClient from "@/components/base/data-table/DataTableClient";
import {TableColumn, TableRouteParams} from "@/components/base/data-table/dataTableTypes";

interface Properties<T> {
  expandRows?: (row: T) => ReactNode | null;
  columns: TableColumn<T>[];
  data: PaginatedData<T>;
  params: TableRouteParams;
  versions?: ProjectVersions;
  page: number;
}

export default function DataTable<T>({
                                                    columns,
                                                    expandRows,
                                                    data,
                                                    params: routeParams,
                                                    page,
                                                    versions
                                                  }: Properties<T>) {
  const offset = data.size * (page - 1);

  const actualHeaders = expandRows ? [...columns, { id: 'expand', className: 'w-16', header: '' }] : columns;
  const headers = actualHeaders.map(col => (
    <TableHead
      className={cn('first:border-l-0 border-x-0 last:border-r-0 border-t-0 overflow-auto scrollbar-none', col.className)}
      key={col.id}
    >
      {col.header}
    </TableHead>
  ));

  const rows = data.total === 0 ?
    [{
      row: (
        <TableCell colSpan={columns.length} className="h-24 text-center border-0">
          No results.
        </TableCell>
      )
    }]
    :
    data.data.map((item, i) => {
      const row = (<>
        {columns.map(col => (
          <TableCell className={cn('first:border-l-0 last:border-r-0 border-x-0', col.className)}
                     key={col.id}
          >
            <div className="overflow-auto scrollbar-none">
              {col.cell(item, i + offset, routeParams)}
            </div>
          </TableCell>
        ))}
      </>);

      if (expandRows) {
        const expanded = expandRows(item);
        if (expanded) {
          const extendedRow = expanded;
          return {row, extendedRow};
        }
      }

      return {row};
    });

  return (
    <DataTableClient cols={headers} rows={rows} data={data} versions={versions}
                     expandable={expandRows !== undefined}/>
  )
}
