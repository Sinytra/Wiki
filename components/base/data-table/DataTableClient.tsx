'use client'

import * as React from "react"
import {useEffect, useState} from "react"
import {Table, TableBody, TableCell, TableHeader, TableRow,} from "@/components/ui/table"
import {Input} from "@/components/ui/input";
import {PaginatedData, ProjectVersions} from "@/lib/service";
import {parseAsString, useQueryState, useQueryStates} from "nuqs";
import {parseAsInteger} from "nuqs/server";
import {Button} from "@/components/ui/button";
import {SearchIcon} from "lucide-react";
import {useDebouncedCallback} from "use-debounce";
import DevDocsVersionSelect from "@/components/docs/versions/DevDocsVersionSelect";
import clientUtil from "@/lib/util/clientUtil";
import {cn} from "@/lib/utils";
import {TableRowData} from "@/components/base/data-table/dataTableTypes";
import ToggleChevron from "@/components/util/ToggleChevron";
import DataTablePagination from "@/components/base/data-table/DataTablePagination";

interface Properties<T> {
  cols: React.JSX.Element[];
  rows: TableRowData[];
  data: PaginatedData<T>;
  versions?: ProjectVersions;
  expandable?: boolean;
}

export default function DataTableClient<T>({cols, rows, data, versions, expandable}: Properties<T>) {
  const [params, setParams] = useQueryStates(
    {
      query: parseAsString,
      page: parseAsInteger
    },
    {shallow: false}
  );
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1).withOptions({shallow: false}));
  const transition = clientUtil.usePageDataReloadTransition(true);

  const handleSearch = useDebouncedCallback(async (term) => {
    await setParams({query: term ? term : null, page: null});
  }, 300);
  const handlePageClick = async (event: any) => {
    if (event.selected + 1 != page) {
      transition(() => {
        setPage(event.selected + 1)
      });
    }
  };

  const contentRefs = clientUtil.useMassRef<HTMLDivElement>();
  const [visibleRows, setVisibleRows] = useState<Record<number, boolean>>({});
  const toggleRow = (group: number) => {
    setVisibleRows((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  useEffect(() => {
    window.scrollTo({top: 0});
  }, [page]);

  return (
    <div className="w-full">
      <div className="w-full flex flex-row gap-4 justify-between items-center mb-4">
        <div className="w-full sm:w-fit relative text-secondary">
          <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"/>
          <Input
            className="h-9 sm:w-96 pl-9 border-tertiary focus-visible:ring-0 focus-visible:outline-neutral-600"
            placeholder="Filter rows..."
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={params.query || ''}
          />
        </div>
        {versions && versions.length > 0 && <DevDocsVersionSelect versions={versions}/>}
      </div>
      <div className="rounded-sm border border-tertiary overflow-x-auto">
        <Table className="table table-fixed w-full mb-0!">
          <TableHeader
            className="first:rounded-t-sm first:border-t-0 first:[&_th:first-child]:rounded-tl-sm first:[&_tr]:rounded-t-sm first:[&_th:last-child]:rounded-tr-sm">
            <TableRow className="first:border-t-0">
              {cols}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => (
              <React.Fragment key={i}>
                <TableRow
                  className={cn('last:border-b-0 last:[&_td]:border-b-0 last:[&_td:first-child]:rounded-bl-sm last:[&_td:last-child]:rounded-br-sm',
                    expandable && (i % 2 != 0 ? 'bg-table-soft hover:bg-table-hover' : 'hover:bg-table-hover'), expandable && 'cursor-pointer')}
                  onClick={() => expandable && toggleRow(i)}
                >
                  {row.row}
                  {row.extendedRow &&
                    <TableCell className="first:border-l-0 last:border-r-0 border-x-0">
                        <Button variant="ghost" className="size-8" size="icon" onClick={() => toggleRow(i)}>
                            <ToggleChevron className="size-5" active={visibleRows[i]} />
                        </Button>
                    </TableCell>}
                </TableRow>
                {row.extendedRow &&
                  <TableRow className={cn('border-b bg-table-hard')}>
                      <td className="no-table-bs overflow-hidden border-0" colSpan={cols.length}>
                          <div ref={contentRefs.set(i)}
                               className={cn('border-hidden transition-[max-height] duration-200 ease-in-out')}
                               style={{
                                 maxHeight: visibleRows[i]
                                   ? `${contentRefs.get(i)?.scrollHeight}px`
                                   : "0px",
                               }}
                          >
                              <div className="py-2">
                                {row.extendedRow}
                              </div>
                          </div>
                      </td>
                  </TableRow>
                }
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination page={page} pages={data.pages} onPageChange={handlePageClick} />
    </div>
  )
}
