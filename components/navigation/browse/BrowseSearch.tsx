'use client'

import {SearchIcon} from "lucide-react";
import {Input} from "@/components/ui/input";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useDebouncedCallback} from 'use-debounce';

export default function ProjectSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const {replace} = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="flex flex-row w-full pb-4 mb-2 border-b border-neutral-600">
      <div className="w-full sm:w-fit relative text-muted-foreground">
        <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"/>
        <Input
          className="sm:w-96 pl-9"
          type="text"
          placeholder="Search mods..."
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get('query')?.toString()}
        />
      </div>
    </div>
  )
}
