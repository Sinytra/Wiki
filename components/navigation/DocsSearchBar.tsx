'use client'

import {useDebouncedCallback} from "use-debounce";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {WikiSearchResult, WikiSearchResults} from "@/lib/types/search";
import clientSearch from "@/lib/search/clientSearch";
import ImageWithFallback from "@/components/util/ImageWithFallback";
import {FileTextIcon, LoaderCircleIcon, SearchIcon} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";

function SearchResult({result}: { result: WikiSearchResult }) {
  const icon = !result.path ? result.mod_icon : result.icon;

  return (
    <Link href={result.url}
          className="z-50 flex flex-row gap-2 bg-muted text-foreground px-1 py-1.5 first:rounded-t-sm last:rounded-b-sm hover:bg-neutral-800 cursor-pointer">
      <div className="rounded-sm p-1 flex-shrink-0">
        <ImageWithFallback src={icon} width={48} height={48} alt={result.mod} fallback={FileTextIcon} loading/>
      </div>
      <div
        className="flex flex-col justify-between py-0.5 w-full overflow-hidden text-ellipsis [&_span]:text-ellipsis [&_span]:overflow-hidden">
        <span>{result.title}</span>
        {!result.path && result.mod_desc
          ?
          <span className="text-muted-foreground">{result.mod_desc}</span>
          :
          <div className="flex flex-row gap-2">
            <span className="text-muted-foreground">{result.mod}</span>
            {result.path && <span className="font-light text-muted-foreground">- {result.path}</span>}
          </div>
        }
      </div>
    </Link>
  )
}

function NoSearchResults() {
  return (
    <div className="text-muted-foreground h-16 z-50 flex flex-row justify-center items-center gap-2 bg-muted font-light px-1 py-1.5 first:rounded-t-sm last:rounded-b-sm">
      No results found!
    </div>
  )
}

function LoadingSearchState() {
  return (
    <div className="text-muted-foreground h-16 z-50 flex flex-row justify-center items-center gap-2 bg-muted font-light px-1 py-1.5 first:rounded-t-sm last:rounded-b-sm">
      <LoaderCircleIcon className="mr-2 h-5 w-5 animate-spin"/>
      Finding the perfect results...
    </div>
  )
}

function SearchOverlayFooter({visible, total}: { visible: number; total: number }) {
  return (
    <div className="text-muted-foreground w-full bg-muted flex flex-row justify-between items-center p-2 rounded-b-sm">
      <div className="text-sm font-light">
        Showing <span className="font-normal">{visible}</span> of <span className="font-normal">{total}</span> results
      </div>
      <span className="text-sm">
        <kbd>ESC</kbd> to close
      </span>
    </div>
  )
}

export default function DocsSearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<WikiSearchResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const debouncedSearch = useDebouncedCallback(async (query) => {
    let pending = true;

    setTimeout(() => {
      if (searchQuery && pending) {
        setLoading(true);
      }
    }, 500);

    const res = await clientSearch.searchWiki(query);
    setResults(res);

    pending = false;
    setLoading(false);
  }, 200);
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query || query.length === 0) {
      setResults(null);
      setLoading(false);
      return;
    }

    return debouncedSearch(query);
  };

  // Reset when unfocused
  const [focused, setFocused] = useState(false);
  const onFocus = () => {
    setFocused(true);
    setResults(null);

    lockScroll();
  };
  const onBlur = () => {
    setFocused(false);
    setLoading(false);
    setSearchQuery('');

    unlockScroll();
  };

  // Close on ESC pressed
  const onKeyDown = (e: any) => {
    if (e.key === 'Escape') {
      e.target.blur();
    }
  };

  // Reset state on route change
  const inputRef = useRef<HTMLInputElement>(null);
  const dynamicRoute = usePathname();
  useEffect(() => {
    inputRef.current?.blur();
  }, [dynamicRoute]);

  // TODO Distinguish mods from docs
  // TODO mobile support

  // Prevent transition when switching tabs
  const [visible, setVisible] = useState(true);
  const onVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      setTimeout(() => setVisible(true), 500);
    } else {
      setVisible(false);
    }
  };
  useLayoutEffect(() => {
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  // Lock scroll when searching
  function lockScroll() {
    document.querySelectorAll('html, body').forEach(e => e.classList.add('scrollLock'));
  }

  function unlockScroll() {
    document.querySelectorAll('html, body').forEach(e => e.classList.remove('scrollLock'));
  }

  return (
    <div
      className={cn(
        'hidden w-full relative mx-2 ease-[cubic-bezier(.27,.17,.43,.98)] duration-200 transition-none',
        visible && 'md:focus-within:transition-[max-width] lg:transition-[max-width]',
        'md:flex md:max-w-sm md:focus-within:max-w-lg md:focus-within:fixed md:focus-within:left-1/2 md:focus-within:-translate-x-1/2 md:focus-within:shadow-lg',
        'lg:max-w-[40rem] lg:focus-within:max-w-2xl lg:focus-within:flex lg:focus-within:static lg:focus-within:translate-x-0 '
      )}>
      <div className="w-full relative">
        <SearchIcon className="w-4 h-4 absolute inset top-1/2 left-2 -translate-y-1/2 text-neutral-500"/>
        <input type="text" value={searchQuery} ref={inputRef}
               className="px-8 text-ellipsis cursor-pointer focus:shadow-md focus:cursor-text border border-neutral-700
                          focus:outline focus:outline-muted-foreground bg-muted text-sm text-center
                          placeholder:text-neutral-500 p-1.5 rounded-sm w-full"
               onChange={(e) => handleSearch(e.target.value)}
               placeholder="Search wiki contents..."
               onFocus={onFocus}
               onBlur={onBlur}
               onKeyDown={onKeyDown}
        />
      </div>
      {focused && searchQuery && (loading || (!loading && results)) &&
          <div onMouseDown={e => e.preventDefault()}
              className="absolute top-10 flex flex-col bg-muted w-full divide-y border border-neutral-700 rounded-sm shadow-lg">
            {loading && <LoadingSearchState/>}

            {!loading && results && results.hits.map(r => <SearchResult key={r.url} result={r}/>)}

            {!loading && results && results.hits.length === 0 && <NoSearchResults/>}

            {!loading && results && <SearchOverlayFooter visible={results.hits.length} total={results.total} />}
          </div>
      }
    </div>
  );
}