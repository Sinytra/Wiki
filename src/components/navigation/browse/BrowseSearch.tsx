'use client'

import {SearchIcon} from "lucide-react";
import {Input} from "@repo/ui/components/input";
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
      <div className="text-secondary relative w-full sm:w-fit">
        <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"/>
        <Input
            className="border-secondary-dim pl-9 sm:w-96"
            type="text"
            placeholder={placeholder}
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={params.query || ''}
        />
      </div>
  )
}
