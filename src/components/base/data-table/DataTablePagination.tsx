'use client'

import ReactPaginate from "react-paginate";
import {Button} from "@repo/ui/components/button";
import {ChevronLeft, ChevronRight} from "lucide-react";
import * as React from "react";
import {useTranslations} from "next-intl";
import {useQueryState} from "nuqs";
import {parseAsInteger} from "nuqs/server";
import {useEffect} from "react";
import clientUtil from "@/lib/util/clientUtil";

interface Properties {
  pages: number;
}

export default function DataTablePagination({pages}: Properties) {
  const t = useTranslations('DataTable');
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1).withOptions({shallow: false}));
  const transition = clientUtil.usePageDataReloadTransition(true);

  const handlePageClick = async (event: any) => {
    if (event.selected + 1 != page) {
      transition(() => {
        setPage(event.selected + 1)
      });
    }
  };

  useEffect(() => {
    window.scrollTo({top: 0});
  }, [page]);

  return (
    <div className="mt-auto flex flex-row items-center justify-end space-x-2 py-4">
      <ReactPaginate
        className="mx-auto flex flex-row gap-1"
        breakLabel="..."
        previousLabel={
          <Button variant="ghost" size="sm">
            <ChevronLeft className="mr-1 h-4 w-4"/>
            <span>{t('previous')}</span>
          </Button>
        }
        nextLabel={
          <Button variant="ghost" size="sm">
            <span>{t('next')}</span>
            <ChevronRight className="ml-1 h-4 w-4"/>
          </Button>
        }
        pageLinkClassName="flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
                            [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-background hover:bg-accent
                            hover:text-accent-foreground size-9 cursor-pointer"
        activeLinkClassName="border border-secondary"
        initialPage={page - 1}
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pages}
        renderOnZeroPageCount={null}
      />
    </div>
  )
}