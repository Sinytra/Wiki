'use client'

import {
  Pagination,
  PaginationContent, PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import {usePathname, useSearchParams} from "next/navigation";

// https://gist.github.com/kottenator/9d936eb3e4e3c3e02598?permalink_comment_id=3413141#gistcomment-3413141
export function pagination(current: number, total: number) {
  const center = [current - 1, current, current + 1],
    filteredCenter: (number | '...')[] = center.filter((p) => p > 1 && p < total),
    includeLeftDots = current > 3,
    includeRightDots = current < total - 2;

  if (includeLeftDots) filteredCenter.unshift('...');
  if (includeRightDots) filteredCenter.push('...');

  return [1, ...filteredCenter, ...(total > 1 ? [total] : [])]
}

export default function TablePagination({current, total}: { current: number, total: number }) {
  const data = pagination(current, total);
  
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (page: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <Pagination>
      <PaginationContent>
        {current > 1 &&
            <PaginationItem>
                <PaginationPrevious href={createPageURL(current - 1)}/>
            </PaginationItem>
        }

        {...data.map((d, i) => d === '...'
          ?
          <PaginationItem key={i}>
            <PaginationEllipsis/>
          </PaginationItem>
          :
          <PaginationItem key={i}>
            <PaginationLink href={createPageURL(d)} isActive={current === d}>{d}</PaginationLink>
          </PaginationItem>
        )}

        {current < total &&
            <PaginationItem>
                <PaginationNext href={createPageURL(current + 1)}/>
            </PaginationItem>
        }
      </PaginationContent>
    </Pagination>
  )
}