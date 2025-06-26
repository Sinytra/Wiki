'use client'

import * as React from "react"
import {useState} from "react"
import {Table, TableBody, TableCell, TableHeader, TableRow,} from "@repo/ui/components/table"
import {Input} from "@repo/ui/components/input";
import {parseAsString, useQueryStates} from "nuqs";
import {parseAsInteger} from "nuqs/server";
import {Button} from "@repo/ui/components/button";
import {SearchIcon} from "lucide-react";
import {useDebouncedCallback} from "use-debounce";
import {cn} from "@repo/ui/lib/utils";
import {useTranslations} from "next-intl";
import {useRouter as useProgressRouter} from "@bprogress/next";
import {PaginatedData, ProjectVersions} from "@repo/shared/types/service";
import useMassRef from "@repo/shared/client/useMassRef";
import ToggleChevron from "@repo/ui/util/ToggleChevron";
import DataTablePagination from "@repo/ui/blocks/data-table/DataTablePagination";
import {TableRowData} from "@repo/ui/blocks/data-table/dataTableTypes";
import DevDocsVersionSelect from "@repo/ui/blocks/data-table/DataTableVersionSelect";

interface Properties<T> {
  cols: React.JSX.Element[];
  rows: TableRowData[];
  data: PaginatedData<T>;
  versions?: ProjectVersions;
  links?: string[];
  expandable?: boolean;
}

export default function DataTableClient<T>({cols, rows, data, versions, expandable, links}: Properties<T>) {
  const [params, setParams] = useQueryStates(
    {
      query: parseAsString,
      page: parseAsInteger
    },
    {shallow: false}
  );
  const t = useTranslations('DataTable');
  const router = useProgressRouter();

  const handleSearch = useDebouncedCallback(async (term) => {
    await setParams({query: term ? term : null, page: null});
  }, 300);

  const contentRefs = useMassRef<HTMLDivElement>();
  const [visibleRows, setVisibleRows] = useState<Record<number, boolean>>({});
  const toggleRow = (group: number) => {
    setVisibleRows((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const LinkableTableRow = ({i, ...props}: any) => {
    if (links && i < links.length) {
      return <TableRow
        {...props}
        className={cn(props.className, 'hover:bg-table-hover hover:cursor-pointer')}
        onClick={() => router.push(links[i])}
      />;
    }
    return <TableRow {...props} />
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex w-full flex-row items-center justify-between gap-4">
        <div className="text-secondary relative w-full sm:w-fit">
          <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"/>
          <Input
            className="border-tertiary h-9 pl-9 focus-visible:ring-0 focus-visible:outline-neutral-600 sm:w-96"
            placeholder={t('filter')}
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={params.query || ''}
          />
        </div>
        {versions && versions.length > 0 && <DevDocsVersionSelect versions={versions}/>}
      </div>
      <div className="border-tertiary overflow-x-auto rounded-sm border">
        <Table className="mb-0! table w-full table-fixed">
          <TableHeader
            className={`
              first:rounded-t-sm first:border-t-0 first:[&_th:first-child]:rounded-tl-sm
              first:[&_th:last-child]:rounded-tr-sm first:[&_tr]:rounded-t-sm
            `}>
            <TableRow className="first:border-t-0">
              {cols}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => (
              <React.Fragment key={i}>
                <LinkableTableRow
                  i={i}
                  className={cn(`
                    last:border-b-0 last:[&_td]:border-b-0 last:[&_td:first-child]:rounded-bl-sm
                    last:[&_td:last-child]:rounded-br-sm
                  `,
                    expandable && (i % 2 != 0 ? 'bg-table-soft hover:bg-table-hover' : 'hover:bg-table-hover'),
                    expandable && 'cursor-pointer')}
                  onClick={() => expandable && toggleRow(i)}
                >
                  {row.row}
                  {row.extendedRow &&
                    <TableCell className="border-x-0 first:border-l-0 last:border-r-0">
                        <Button variant="ghost" className="size-8" size="icon" onClick={() => toggleRow(i)}>
                            <ToggleChevron className="size-5" active={visibleRows[i]} />
                        </Button>
                    </TableCell>}
                </LinkableTableRow>
                {row.extendedRow &&
                  <TableRow className={cn('bg-table-hard border-b')}>
                      <td className="no-table-bs overflow-hidden border-0" colSpan={cols.length}>
                          <div ref={contentRefs.set(i)}
                               className={cn('border-hidden transition-all duration-200 ease-in-out')}
                               style={{
                                 maxHeight: visibleRows[i]
                                   ? `50vh`
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
      <DataTablePagination pages={data.pages}/>
    </div>
  )
}
