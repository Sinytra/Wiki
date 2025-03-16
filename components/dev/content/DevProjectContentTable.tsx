'use client'

import * as React from "react"
import {useEffect} from "react"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";
import {PaginatedData, ProjectVersions} from "@/lib/service";
import ReactPaginate from "react-paginate";
import {parseAsString, useQueryState, useQueryStates} from "nuqs";
import {parseAsInteger} from "nuqs/server";
import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight, SearchIcon} from "lucide-react";
import {useDebouncedCallback} from "use-debounce";
import DevDocsVersionSelect from "@/components/docs/versions/DevDocsVersionSelect";

export interface TableRouteParams {
  locale: string;
  slug: string;
  version: string;
}

export interface TableColumn<T> {
  id: string;
  header: string;
  cell: (item: T, index: number, params: TableRouteParams) => JSX.Element | null;
  className?: string;
}

interface Properties<T> {
  columns: TableColumn<T>[];
  data: PaginatedData<T>;
  params: TableRouteParams;
  versions: ProjectVersions;
}

export default function DevProjectContentTable<T>({columns, data, params: routeParams, versions}: Properties<T>) {
  const [params, setParams] = useQueryStates(
    {
      query: parseAsString,
      page: parseAsInteger
    },
    { shallow: false }
  );
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1).withOptions({shallow: false}));

  const handleSearch = useDebouncedCallback(async (term) => {
    await setParams({query: term ? term : null, page: null});
  }, 300);
  const handlePageClick = async (event: any) => {
    await setPage(event.selected + 1);
  };
  const offset = data.size * (page - 1);

  useEffect(()=>{
    window.scrollTo({top: 0});
  },[page]);

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
        {versions.length > 0 && <DevDocsVersionSelect versions={versions} />}
      </div>
      <div className="rounded-sm border border-tertiary overflow-x-auto">
        <Table className="table table-fixed w-full mb-0!">
          <TableHeader
            className="first:rounded-t-sm first:border-t-0 first:[&_th:first-child]:rounded-tl-sm first:[&_tr]:rounded-t-sm first:[&_th:last-child]:rounded-tr-sm">
            <TableRow className="first:border-t-0">
              {columns.map(col => (
                <TableHead className={cn('first:border-l-0 border-x-0 last:border-r-0 border-t-0 overflow-auto scrollbar-none', col.className)}
                           key={col.id}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((item, i) => (
              <TableRow
                className="last:border-b-0 last:[&_td]:border-b-0 last:[&_td:first-child]:rounded-bl-sm
                           last:[&_td:last-child]:rounded-br-sm"
                key={i}
              >
                {columns.map(col => (
                  <TableCell className={cn('first:border-l-0 last:border-r-0 border-x-0', col.className)}
                             key={col.id}
                  >
                    <div className="overflow-auto scrollbar-none">
                      {col.cell(item, i + offset, routeParams)}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-row items-center justify-end space-x-2 py-4">
        <ReactPaginate
          className="flex flex-row gap-1 mx-auto"
          breakLabel="..."
          previousLabel={
            <Button variant="ghost" size="sm">
              <ChevronLeft className="mr-1 h-4 w-4" />
              <span>Previous</span>
            </Button>
          }
          nextLabel={
            <Button variant="ghost" size="sm">
              <span>Next</span>
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          }
          pageLinkClassName="flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
                            [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-background hover:bg-accent
                            hover:text-accent-foreground size-9 cursor-pointer"
          activeLinkClassName="border border-secondary"
          initialPage={page - 1}
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={data.pages}
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  )
}
