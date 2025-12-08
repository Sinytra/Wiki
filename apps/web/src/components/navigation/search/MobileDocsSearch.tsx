'use client'

import {useTranslations} from "next-intl";
import {ArrowLeftIcon, FileTextIcon, LoaderCircleIcon, SearchIcon} from "lucide-react";
import {Button} from "@repo/ui/components/button";
import {useEffect, useRef, useState} from "react";
import {WikiSearchResult, WikiSearchResults} from "@/lib/service/search";
import ImageWithFallback from "@/components/util/ImageWithFallback";
import {useDebouncedCallback} from "use-debounce";
import {CSSTransition} from "react-transition-group";
import {usePathname} from "next/navigation";
import {NavLink} from "@/components/navigation/link/NavLink";

function SearchResult({result}: { result: WikiSearchResult }) {
  const icon = !result.path ? result.mod_icon : result.icon;

  return (
    <NavLink href={result.url}
          className={`
            z-50 flex cursor-pointer flex-row gap-2 rounded-xs border border-neutral-700 bg-primary-alt px-1 py-1.5
            text-primary
          `}>
      <div className="shrink-0 rounded-xs p-1">
        <ImageWithFallback src={icon} width={48} height={48} alt={result.mod} fbIcon={FileTextIcon} fixedSize/>
      </div>
      <div
        className={`
          flex w-full flex-col justify-between overflow-hidden py-0.5 text-ellipsis [&_span]:overflow-hidden
          [&_span]:text-ellipsis
        `}>
        <span>{result.title || result.mod}</span>
        {!result.path && result.mod_desc
          ?
          <span className="text-secondary">{result.mod_desc}</span>
          :
          <div className="flex flex-col gap-1">
            <span className="text-secondary">
              {result.mod}
            </span>
          </div>
        }
      </div>
    </NavLink>
  )
}

function LoadingSearchState() {
  const t = useTranslations('DocsSearchBar');

  return (
    <div className={`
      z-50 flex h-16 flex-row items-center justify-center gap-2 rounded-xs border border-neutral-700 bg-primary-alt px-1
      py-1.5 text-secondary
    `}>
      <LoaderCircleIcon className="mr-2 h-5 w-5 animate-spin"/>
      {t('loading')}
    </div>
  )
}

function NoSearchResults() {
  const t = useTranslations('DocsSearchBar');

  return (
    <div className={`
      z-50 flex h-16 flex-row items-center justify-center gap-2 rounded-xs border border-neutral-700 bg-primary-alt px-1
      py-1.5 text-secondary
    `}>
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
        className="fixed top-0 right-0 bottom-0 left-0 z-50 h-[100vh] w-full overflow-hidden bg-primary">
        <div className="innerFadeContainer flex flex-col gap-4 p-4">
          <div className="relative">
            <button onClick={() => setOpen(false)}>
              <ArrowLeftIcon className="absolute top-1/2 left-2 h-5 w-5 -translate-y-1/2 text-secondary"/>
            </button>
            <input type="text" value={searchQuery} onChange={(e) => handleSearch(e.target.value)}
                   className={`
                     w-full cursor-pointer rounded-xs border border-neutral-700 bg-primary-alt p-2 px-8 text-center
                     text-sm text-ellipsis placeholder:text-neutral-500 focus:cursor-text focus:outline-1
                     focus:outline-secondary
                   `}
                   placeholder={t('placeholder')} autoFocus
            />
          </div>
          {loading && <LoadingSearchState/>}

          {!loading && results && (
            results.hits.length > 0
              ?
              <div className="slim-scrollbar flex h-[90vh] flex-col gap-2 overflow-y-auto">
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
        <SearchIcon className="h-4 w-4 text-[var(--vp-c-text-1)]"/>
      </Button>
      <SearchScreen isOpen={isOpen} setOpen={setIsOpen} searchFunc={searchFunc}/>
    </div>
  )
}