import {PaginatedData, ProjectVersions} from "@/lib/service";
import {TableCell, TableHead} from "@/components/ui/table";
import {cn} from "@/lib/utils";
import * as React from "react";
import {ReactNode} from "react";
import DataTableClient from "@/components/base/data-table/DataTableClient";
import {TableColumn, TableRouteParams} from "@/components/base/data-table/dataTableTypes";
import {useTranslations} from "next-intl";
import ClientLocaleProvider from "@/components/util/ClientLocaleProvider";

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
  const t = useTranslations('DataTable');

  const actualHeaders = expandRows ? [...columns, { id: 'expand', className: 'w-16', header: '' }] : columns;
  const headers = actualHeaders.map(col => (
    <TableHead
      className={cn('scrollbar-none overflow-auto border-x-0 border-t-0 first:border-l-0 last:border-r-0', col.className)}
      key={col.id}
    >
      {col.header}
    </TableHead>
  ));

  const rows = data.total === 0 ?
    [{
      row: (
        <TableCell colSpan={columns.length} className="h-24 border-0 text-center">
          {t('no_results')}
        </TableCell>
      )
    }]
    :
    data.data.map((item, i) => {
      const row = (<>
        {columns.map(col => (
          <TableCell className={cn('border-x-0 first:border-l-0 last:border-r-0', col.className)}
                     key={col.id}
          >
            <div className="scrollbar-none overflow-auto">
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
    <ClientLocaleProvider keys={['DataTable']}>
      <DataTableClient cols={headers} rows={rows} data={data} versions={versions}
                       expandable={expandRows !== undefined}/>
    </ClientLocaleProvider>
  )
}
