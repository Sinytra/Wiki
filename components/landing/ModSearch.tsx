'use client'

import {useDebouncedCallback} from "use-debounce";
import {useState} from "react";
import {ProjectSearchResult} from "@/lib/search";
import LoadingContent from "@/components/util/LoadingContent";
import {NavLink} from "@/components/navigation/link/NavLink";
import {useTranslations} from "next-intl";

export default function ProjectSearch({locale, placeholder, searchFunc}: {
  locale: string;
  placeholder: string;
  searchFunc: (query: string) => Promise<ProjectSearchResult[]>;
}) {
  const [results, setResults] = useState<ProjectSearchResult[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [shown, setShown] = useState<boolean>(true);
  const t = useTranslations('BrowsePage');

  const handleSearch = useDebouncedCallback(async (query) => {
    if (!query) {
      setResults(null);
      return;
    }

    let pending = true;

    setTimeout(() => {
      if (pending) {
        setLoading(true);
      }
    }, 500);

    try {
      const resp = await searchFunc(query);
      setResults(resp);
    } finally {
      pending = false;
      setLoading(false);
    }
  }, 300);

  return (
      <div className="flex flex-col gap-10 justify-center items-center w-full shadow-md">
        <div className="relative w-full">
          <input type="text"
                 className="border border-muted-foreground bg-muted text-base text-center placeholder:text-gray-500 w-full sm:w-96 p-3 rounded-sm"
                 onChange={(e) => handleSearch(e.target.value)}
                 onFocus={() => setShown(true)}
                 onBlur={() => setShown(false)}
                 placeholder={placeholder}/>
          {loading && (
              <div
                  className="absolute top-full mt-0.5 border border-neutral-700 bg-muted flex flex-col rounded-sm w-full sm:w-96 text-center">
                <div className="py-3 px-2 bg-muted w-full h-full flex justify-center rounded-sm">
                  <LoadingContent/>
                </div>
              </div>
          )}
          {results && shown && (
              <div
                  className="absolute top-full mt-0.5 border border-neutral-700 bg-muted flex flex-col rounded-sm w-full sm:w-96 text-center divide-y max-h-52 overflow-y-auto slim-scrollbar"
                  onMouseDown={(e) => e.preventDefault()}>
                {results.length === 0
                    ?
                    <div className="py-3 px-2 w-full h-full">
                <span>
                  {t('no_results')}
                </span>
                    </div>
                    :
                    results.map(r => (
                        <NavLink href={`${locale}/project/${r.id}`} key={r.id}
                                 className="first:rounded-t-sm last:rounded-b-sm py-3 px-2 bg-muted hover:bg-accent w-full h-full">
                          {r.name}
                        </NavLink>
                    ))}
              </div>
          )}
        </div>
      </div>
  )
}