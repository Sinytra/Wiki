'use client';

import { useState, useEffect, useRef } from 'react';
import DocsSidebarBase from "@/components/docs/side/DocsSidebarBase";
import { FileHeading } from "@repo/shared/types/metadata";
import {cn} from "@repo/ui/lib/utils";;
import {useTranslations} from "next-intl";

interface ContentRightSidebarProps {
  headings: FileHeading[];
}

export default function DocsGuideNonContentRightSidebarClient({ headings }: ContentRightSidebarProps) {
  const t = useTranslations('DocsNonContentRightSidebar');

  const [activeId, setActiveId] = useState<string>('');
  const [showTopGradient, setShowTopGradient] = useState(false);
  const [showBottomGradient, setShowBottomGradient] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map(heading => document.getElementById(heading.id)).filter(Boolean);
      const activeHeading = headingElements.find(el => {
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top >= 0 && rect.top <= window.innerHeight / 2;
        }
        return false;
      });
      if (activeHeading) {
        setActiveId(activeHeading.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  useEffect(() => {
    const checkOverflow = () => {
      if (listRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = listRef.current;
        setShowTopGradient(scrollTop > 0);
        setShowBottomGradient(scrollTop + clientHeight < scrollHeight);
      }
    }

    const listElement = listRef.current;
    if (listElement) {
      listElement.addEventListener('scroll', checkOverflow);
      window.addEventListener('resize', checkOverflow);
      checkOverflow(); // Initial check
    }

    return () => {
      if (listElement) {
        listElement.removeEventListener('scroll', checkOverflow);
      }
      window.removeEventListener('resize', checkOverflow);
    }
  }, [headings]);

  return (
    <DocsSidebarBase
      type="right"
      title={t('title')}
      className={cn(
        'right-0 shrink-0',
        'w-[96vw] sm:w-64'
      )}
      tagName="nav"
    >
      <div className="relative">
        {showTopGradient && (
          <div className={`
            from-background pointer-events-none absolute top-0 right-0 left-0 h-12 bg-linear-to-b to-transparent
          `} />
        )}
        <div
          ref={listRef}
          className={`
            scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent max-h-[80vh] overflow-y-auto pr-4
          `}
        >
          <ul className="space-y-1 text-sm">
            {headings.map((heading, index) => (
              <li key={heading.id} style={{ paddingLeft: `${(heading.depth - 1) * 0.75}rem` }}>
                <a
                  href={`#${heading.id}`}
                  className={cn(
                    "text-secondary block py-1 transition-colors hover:text-primary",
                    activeId === heading.id && "text-primary",
                    index === 0 ? 'pt-0!' : ''
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(heading.id)?.scrollIntoView({
                      behavior: 'smooth'
                    })
                  }}
                >
                  {heading.value}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {showBottomGradient && (
          <div className={`
            from-background pointer-events-none absolute right-0 bottom-0 left-0 h-12 bg-linear-to-t to-transparent
          `} />
        )}
      </div>
    </DocsSidebarBase>
  );
}