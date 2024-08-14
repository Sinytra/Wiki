'use client'

import {useDebouncedCallback} from "use-debounce";
import {useState} from "react";
import {ModSearchResult} from "@/lib/types/search";
import Link from "next/link";

export default function ModSearch() {
  const [results, setResults] = useState<ModSearchResult[] | null>(null);

  const handleSearch = useDebouncedCallback(async (term) => {
    if (!term) {
      setResults(null);
      return;
    }

    const resp = await fetch(`/api/mods/search?query=${term}`);
    const body = await resp.json();
    setResults(body.data);
  }, 300);

  return (
    <div className="flex flex-col gap-6 justify-center items-center">
      <span className="text-foreground text-lg">Browse mod documentation</span>

      <div className="relative">
        <input type="text"
               className="bg-muted text-base text-center placeholder:text-gray-500 w-96 p-3 rounded-sm focus:outline-none"
               onChange={(e) => {
                 handleSearch(e.target.value);
               }}
               placeholder="Find your favourite mod..."/>
        {results && (
          <div className="absolute top-full bg-neutral-800 flex flex-col last:rounded-b-sm w-96 border-t border-gray-600 text-center">
            {results.length === 0
              ?
              <div className="p-2 w-full h-full">
                <span>No results</span>
              </div>
              :
              results.map(r => (
                <Link href={`/mod/${r.id}`} key={r.id} className="p-2 hover:bg-muted w-full h-full">
                  {r.name}
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}