'use client';

import { useDebouncedCallback } from 'use-debounce';
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import ImageWithFallback from '@/components/util/ImageWithFallback';
import { FileTextIcon, GlobeIcon, HouseIcon, LoaderCircleIcon, SearchIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@repo/ui/lib/utils';
import { useTranslations } from 'next-intl';
import { NavLink } from '@/components/navigation/link/NavLink';
import wikiSearchClient from '@/lib/service/search/wikiSearchClient';
import { WikiSearchResult, WikiSearchResults } from '@/lib/service/search';
import { SearchContext } from '@/components/navigation/search/SearchContext';

function SearchResultWidget({ result }: { result: WikiSearchResult }) {
  const t = useTranslations('ProjectTypes');

  return (
    <NavLink
      href={result.href}
      className={cn(
        'z-50 flex cursor-pointer flex-row gap-2 bg-primary-alt px-1 py-1.5 text-primary',
        'first:rounded-t-sm last:rounded-b-sm hover:bg-tertiary'
      )}
    >
      <div className="shrink-0 rounded-xs p-1">
        <ImageWithFallback
          src={result.icon_asset?.src}
          width={48}
          height={48}
          alt={result.project_id}
          fbIcon={FileTextIcon}
          fixedSize
        />
      </div>
      <div
        className={`flex w-full flex-col justify-between overflow-hidden py-0.5 text-ellipsis [&_span]:overflow-hidden [&_span]:text-ellipsis`}
      >
        <span>{result.title}</span>
        {result.entry_type == 'project' ? (
          <span className="text-secondary">{t(result.project_type)}</span>
        ) : (
          <div className="flex flex-row gap-2">
            <span className="text-secondary">{result.project_name}</span>
          </div>
        )}
      </div>
    </NavLink>
  );
}

function NoSearchResults() {
  const t = useTranslations('DocsSearchBar');

  return (
    <div
      className={`z-50 flex h-16 flex-row items-center justify-center gap-2 bg-primary-alt px-1 py-1.5 font-light text-secondary first:rounded-t-sm last:rounded-b-sm`}
    >
      {t('no_results')}
    </div>
  );
}

function LoadingSearchState() {
  const t = useTranslations('DocsSearchBar');

  return (
    <div
      className={`z-50 flex h-16 flex-row items-center justify-center gap-2 bg-primary-alt px-1 py-1.5 font-light text-secondary first:rounded-t-sm last:rounded-b-sm`}
    >
      <LoaderCircleIcon className="mr-2 h-5 w-5 animate-spin" />
      {t('loading')}
    </div>
  );
}

function SearchOverlayFooter({
  canChangeScope,
  visible,
  total
}: {
  canChangeScope: boolean;
  visible: number;
  total: number;
}) {
  const t = useTranslations('DocsSearchBar');

  return (
    <div
      className={cn(
        'flex w-full flex-row items-center justify-between bg-primary-alt p-2 text-secondary',
        visible > 0 ? 'rounded-b-sm' : 'rounded-sm'
      )}
    >
      <div className="text-sm font-light">
        {t.rich('results', {
          highlight: (chunks: any) => <span className="font-normal">{chunks}</span>,
          count: visible,
          total
        })}
      </div>
      <div className="flex flex-row items-center gap-2">
        {canChangeScope && (
          <span className="text-sm">{t.rich('switch', { kbd: (chunks: any) => <kbd>{chunks}</kbd> })}</span>
        )}
        <span className="text-sm">{t.rich('close', { kbd: (chunks: any) => <kbd>{chunks}</kbd> })}</span>
      </div>
    </div>
  );
}

export default function DocsSearchBar({ locale }: { locale: string }) {
  const t = useTranslations('DocsSearchBar');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<WikiSearchResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { project } = useContext(SearchContext)!;
  const [local, setLocal] = useState<boolean>(project != null);

  const debouncedSearch = useDebouncedCallback(async (query) => {
    let pending = true;

    setTimeout(() => {
      if (searchQuery && pending) {
        setLoading(true);
      }
    }, 500);

    const res = await wikiSearchClient.searchWiki(query, locale, local && project ? project.id : null);
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
    if (project != null && e.key === 'Tab') {
      e.preventDefault();
      setLocal(!local);
    }

    if (e.key === 'Escape') {
      e.target.blur();
    }
  };

  useEffect(() => {
    setLocal(project != null);
  }, [project]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      debouncedSearch(searchQuery);
    }
    debouncedSearch.flush();
  }, [local]);

  // Reset state on route change
  const inputRef = useRef<HTMLInputElement>(null);
  const dynamicRoute = usePathname();
  useEffect(() => {
    inputRef.current?.blur();
  }, [dynamicRoute]);

  // TODO Distinguish mods from docs

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
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  // Lock scroll when searching
  function lockScroll() {
    document.querySelectorAll('html, body').forEach((e) => e.classList.add('scrollLock'));
  }

  function unlockScroll() {
    document.querySelectorAll('html, body').forEach((e) => e.classList.remove('scrollLock'));
  }

  const ScopeIcon = local ? HouseIcon : GlobeIcon;

  return (
    <div
      className={cn(
        'relative mx-2 hidden w-full transition-none duration-200 ease-[cubic-bezier(.27,.17,.43,.98)]',
        visible && 'md:focus-within:transition-[max-width] lg:transition-[max-width]',
        `md:flex md:max-w-sm md:focus-within:fixed md:focus-within:left-1/2 md:focus-within:max-w-lg md:focus-within:-translate-x-1/2 md:focus-within:shadow-lg`,
        `lg:max-w-[40rem] lg:focus-within:static lg:focus-within:flex lg:focus-within:max-w-2xl lg:focus-within:translate-x-0`
      )}
    >
      <div className="relative w-full">
        <SearchIcon className="inset absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-neutral-500" />

        {project && focused && (
          <div
            className={cn(
              'inset absolute top-1/2 left-8 -translate-y-1/2 rounded-sm',
              'flex flex-row items-center gap-1',
              'border border-secondary bg-secondary px-1 py-[1.5px]'
            )}
          >
            <ScopeIcon className="size-3.5 stroke-2 text-primary" />
            <span className="text-xs">{t(`scope.${local ? 'local' : 'global'}`)}</span>
          </div>
        )}

        <input
          type="text"
          value={searchQuery}
          ref={inputRef}
          className={cn(
            'w-full cursor-pointer rounded-sm border border-secondary bg-primary-alt px-8 py-[0.2rem]',
            'text-center text-sm text-ellipsis placeholder:text-neutral-500',
            'focus:cursor-text focus:border-secondary-alt focus:shadow-md focus:outline-none'
          )}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={t('placeholder')}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
      </div>
      {focused && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          className={cn(
            'absolute top-8 flex w-full flex-col divide-y divide-tertiary rounded-sm border',
            'border-secondary bg-primary-alt shadow-lg'
          )}
        >
          {loading && <LoadingSearchState />}

          {!loading && results && results.hits.map((r) => <SearchResultWidget key={r.id} result={r} />)}

          {!loading && results && results.hits.length === 0 && <NoSearchResults />}

          <SearchOverlayFooter
            canChangeScope={project != null}
            visible={results?.hits?.length ?? 0}
            total={results?.total ?? 0}
          />
        </div>
      )}
    </div>
  );
}
