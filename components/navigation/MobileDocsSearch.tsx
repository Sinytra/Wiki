'use client'

import {useTranslations} from "next-intl";
import {ArrowLeftIcon, FileTextIcon, LoaderCircleIcon, SearchIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useEffect, useRef, useState} from "react";
import {WikiSearchResult, WikiSearchResults} from "@/lib/search";
import Link from "next/link";
import ImageWithFallback from "@/components/util/ImageWithFallback";
import {useDebouncedCallback} from "use-debounce";
import {CSSTransition} from "react-transition-group";
import {usePathname} from "next/navigation";

function SearchResult({result}: { result: WikiSearchResult }) {
  const icon = !result.path ? result.mod_icon : result.icon;

  return (
    <Link href={result.url}
          className="z-50 flex flex-row gap-2 bg-muted text-foreground px-1 py-1.5 cursor-pointer border border-neutral-700 rounded-sm">
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
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">
              {result.mod}
            </span>
            {result.path &&
              <span className="font-normal text-muted-foreground opacity-60">
                {result.path}
              </span>
            }
          </div>
        }
      </div>
    </Link>
  )
}

function LoadingSearchState() {
  const t = useTranslations('DocsSearchBar');

  return (
    <div className="text-muted-foreground h-16 z-50 flex flex-row justify-center items-center gap-2 bg-muted px-1 py-1.5 border border-neutral-700 rounded-sm">
      <LoaderCircleIcon className="mr-2 h-5 w-5 animate-spin"/>
      {t('loading')}
    </div>
  )
}

function NoSearchResults() {
  const t = useTranslations('DocsSearchBar');

  return (
    <div className="text-muted-foreground h-16 z-50 flex flex-row justify-center items-center gap-2 bg-muted px-1 py-1.5 border border-neutral-700 rounded-sm">
      {t('no_results')}
    </div>
  )
}

function SearchScreen({isOpen, setOpen, searchFunc}: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  searchFunc: (query: string) => Promise<WikiSearchResults>
}) {
  const t = useTranslations('DocsSearchBar');

  const nodeRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<WikiSearchResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setSearchQuery('');
    setResults(null);
    setLoading(false);
  }, [isOpen]);

  const debouncedSearch = useDebouncedCallback(async (query) => {
    let pending = true;

    setTimeout(() => {
      if (searchQuery && pending) {
        setLoading(true);
      }
    }, 500);

    const res = await searchFunc(query);
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

  return (
    <CSSTransition nodeRef={nodeRef} in={isOpen} timeout={200} classNames="fade" unmountOnExit>
      <div ref={nodeRef}
        className="z-50 fixed bg-[#1b1b1f] top-0 right-0 bottom-0 left-0 w-full h-[100vh] overflow-hidden">
        <div className="p-4 innerFadeContainer flex flex-col gap-4">
          <div className="relative">
            <button onClick={() => setOpen(false)}>
              <ArrowLeftIcon className="w-5 h-5 absolute top-1/2 -translate-y-1/2 left-2 text-muted-foreground"/>
            </button>
            <input type="text" value={searchQuery} onChange={(e) => handleSearch(e.target.value)}
                   className="px-8 text-ellipsis cursor-pointer focus:cursor-text border border-neutral-700
                          focus:outline focus:outline-1 focus:outline-muted-foreground bg-muted text-sm text-center
                          placeholder:text-neutral-500 p-2 rounded-sm w-full"
                   placeholder={t('placeholder')}
            />
          </div>
          {loading && <LoadingSearchState/>}

          {!loading && results && (
            results.hits.length > 0
              ?
              <div className="flex flex-col gap-2 overflow-y-auto slim-scrollbar h-[90vh]">
                {...results.hits.map(r => <SearchResult key={r.url} result={r}/>)}
              </div>
              :
              <NoSearchResults/>
            )
          }
        </div>
      </div>
    </CSSTransition>
  )
}

export default function MobileDocsSearch({searchFunc}: { searchFunc: (query: string) => Promise<WikiSearchResults> }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.querySelectorAll('html, body').forEach(e => e.classList.add('navScrollLock'));
    } else {
      document.querySelectorAll('html, body').forEach(e => e.classList.remove('navScrollLock'));
    }
  }, [isOpen]);

  return (
    <div className="sm:hidden">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
        <SearchIcon className="w-4 h-4 text-[var(--vp-c-text-1)]"/>
      </Button>
      <SearchScreen isOpen={isOpen} setOpen={setIsOpen} searchFunc={searchFunc}/>
    </div>
  )
}