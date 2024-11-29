'use client'

import {SearchIcon} from "lucide-react";
import {Input} from "@/components/ui/input";
import {useDebouncedCallback} from 'use-debounce';
import {parseAsInteger, parseAsString, useQueryStates} from "nuqs";

export default function ProjectSearch({placeholder}: { placeholder: string; }) {
  const [params, setParams] = useQueryStates(
      {
        query: parseAsString,
        page: parseAsInteger
      },
      { shallow: false }
  );

  const handleSearch = useDebouncedCallback(async (term) => {
    await setParams({query: term ? term : null, page: null});
  }, 300);

  return (
      <div className="w-full sm:w-fit relative text-muted-foreground">
        <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"/>
        <Input
            className="sm:w-96 pl-9 border-neutral-600"
            type="text"
            placeholder={placeholder}
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={params.query || ''}
        />
      </div>
  )
}
