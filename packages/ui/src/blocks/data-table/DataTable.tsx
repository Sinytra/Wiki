import {TableCell, TableHead} from "@repo/ui/components/table";
import {cn} from "@repo/ui/lib/utils";
import * as React from "react";
import {ReactNode} from "react";
import {useTranslations} from "next-intl";
import {TableColumn, TableRowLinker} from "@repo/ui/blocks/data-table/dataTableTypes";
import DataTableClient from "@repo/ui/blocks/data-table/DataTableClient";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";
import {PaginatedData, ProjectVersions} from "@repo/shared/types/service";

interface Properties<T> {
  expandRows?: (row: T) => ReactNode | null;
  columns: TableColumn<T>[];
  data: PaginatedData<T>;
  versions?: ProjectVersions;
  linker?: TableRowLinker<T>;
  creator?: ReactNode;
  page: number;
  emptyState?: ReactNode;
}

function DataTableToolbar({creator}: Pick<Properties<unknown>, 'creator'>) {
  return (
    <div>
      {creator}
    </div>
  )
}

export default function DataTable<T>({
                                       columns,
                                       expandRows,
                                       data,
                                       page,
                                       versions,
                                       linker,
                                       creator,
                                       emptyState
                                     }: Properties<T>) {
  const offset = data.size * (page - 1);
  const t = useTranslations('DataTable');

  const actualHeaders = expandRows ? [...columns, {id: 'expand', className: 'w-16', header: ''}] : columns;
  const headers = actualHeaders.map(col => (
    <TableHead
      className={cn('scrollbar-none overflow-auto border-x-0 border-t-0 first:border-l-0 last:border-r-0', col.className)}
      key={col.id}
    >
      {col.header}
    </TableHead>
  ));

  const isEmpty = data.total === 0;
  const rows = isEmpty ?
    [{
      row: (
        <TableCell colSpan={actualHeaders.length} className="h-24 border-0 text-center">
          {emptyState ?? t('no_results')}
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
              {col.cell(item, i + offset)}
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

  const links = linker ? data.data.map(linker) : undefined;

  return (
    <ClientLocaleProvider keys={['DataTable', 'DocsVersionSelector']}>
      <DataTableClient cols={headers} rows={rows} data={data} versions={versions} links={links}
                       expandable={!isEmpty && expandRows !== undefined}
                       toolbar={<DataTableToolbar creator={creator}/>}
      />
    </ClientLocaleProvider>
  )
}
