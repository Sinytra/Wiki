'use client'

import ReactPaginate from "react-paginate";
import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight} from "lucide-react";
import * as React from "react";

interface Properties {
  page: number;
  pages: number;
  onPageChange?(selectedItem: { selected: number }): void;
}

export default function DataTablePagination({page, pages, onPageChange}: Properties) {
  return (
    <div className="flex flex-row items-center justify-end space-x-2 py-4">
      <ReactPaginate
        className="flex flex-row gap-1 mx-auto"
        breakLabel="..."
        previousLabel={
          <Button variant="ghost" size="sm">
            <ChevronLeft className="mr-1 h-4 w-4"/>
            <span>Previous</span>
          </Button>
        }
        nextLabel={
          <Button variant="ghost" size="sm">
            <span>Next</span>
            <ChevronRight className="ml-1 h-4 w-4"/>
          </Button>
        }
        pageLinkClassName="flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
                            [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-background hover:bg-accent
                            hover:text-accent-foreground size-9 cursor-pointer"
        activeLinkClassName="border border-secondary"
        initialPage={page - 1}
        onPageChange={onPageChange}
        pageRangeDisplayed={5}
        pageCount={pages}
        renderOnZeroPageCount={null}
      />
    </div>
  )
}