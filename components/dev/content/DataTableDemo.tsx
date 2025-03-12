'use client'

import * as React from "react"

import {Button} from "@/components/ui/button"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";
import {ProjectContentPage} from "@/lib/service/remoteServiceApi";

interface Column<T> {
  id: string;
  header: string;
  cell: (item: T, index: number) => JSX.Element;
  className?: string;
}

const columns: Column<ProjectContentPage>[] = [
  {
    id: 'select',
    header: 'Num.',
    cell: (_, i) => (
      <div className="text-center">{i + 1}</div>
    ),
    className: 'w-16'
  },
  {
    id: 'icon',
    header: 'Icon',
    cell: item => (
      <div className="flex shrink-0 items-center justify-center size-7">
        <img
          src={`${process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL}/api/v1/docs/mffs/asset/${item.id}`}
          alt="icon"
          className="shrink-0 size-7"
        />
      </div>
    ),
    className: 'w-14'
  },
  {
    id: 'id',
    header: 'Identifier',
    cell: item => (
      <div className="font-mono">{item.id}</div>
    )
  },
  {
    id: 'name',
    header: 'Name',
    cell: item => (
      <div>{item.name}</div>
    )
  },
  {
    id: 'path',
    header: 'Page path (internal)',
    cell: item => (
      <div className="font-medium text-ellipsis overflow-hidden">{item.path}</div>
    )
  }
  // TODO view page link
]

export default function DataTableDemo({data}: { data: ProjectContentPage[] }) {
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter items..."
          className="max-w-sm"
        />
      </div>
      <div className="rounded-sm border border-tertiary overflow-x-auto">
        <Table className="table table-fixed w-full mb-0!">
          <TableHeader
            className="first:rounded-t-sm first:border-t-0 first:[&_th:first-child]:rounded-tl-sm first:[&_tr]:rounded-t-sm first:[&_th:last-child]:rounded-tr-sm">
            <TableRow className="first:border-t-0">
              {columns.map(col => (
                <TableHead className={cn('first:border-l-0 last:border-r-0 border-t-0', col.className)} key={col.id}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, i) => (
              <TableRow
                className="last:border-b-0 last:[&_td]:border-b-0 last:[&_td:first-child]:rounded-bl-sm last:[&_td:last-child]:rounded-br-sm"
                key={i}
              >
                {columns.map(col => (
                  <TableCell className={cn('first:border-l-0 last:border-r-0', col.className)} key={col.id}>
                    {col.cell(item, i)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {/*{table.getFilteredSelectedRowModel().rows.length} of{" "}*/}
          {/*{table.getFilteredRowModel().rows.length} row(s) selected.*/}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            // onClick={() => table.previousPage()}
            // disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            // onClick={() => table.nextPage()}
            // disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
