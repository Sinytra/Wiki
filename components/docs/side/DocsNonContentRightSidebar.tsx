"use client";

import { useState, useEffect, useRef } from 'react';
import DocsSidebarBase from "@/components/docs/side/DocsSidebarBase";
import { FileHeading } from "@/lib/docs/metadata";
import { cn } from "@/lib/utils";
import {RightSidebarContext} from "@/components/docs/side/RightSidebarContext";

interface ContentRightSidebarProps {
  headings: FileHeading[];
}

export default function DocsNonContentRightSidebar({ headings }: ContentRightSidebarProps) {
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
      context={RightSidebarContext}
      title="On this page"
      className={cn(
        'flex-shrink-0 sm:sticky sm:top-20 sm:h-[calc(100vh_-_8rem)]',
        'border-l transition-all duration-300 ease-in-out overflow-hidden',
        'w-64 data-[open=false]:translate-x-full data-[open=false]:w-0 data-[open=false]:lg:w-64'
      )}
      tagName="nav"
    >
      <div className="relative">
        {showTopGradient && (
          <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-background to-transparent pointer-events-none" />
        )}
        <div
          ref={listRef}
          className="max-h-[80vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        >
          <ul className="space-y-1 text-sm">
            {headings.slice(1).map((heading, index) => (
              <li key={heading.id} style={{ paddingLeft: `${(heading.depth - 1) * 0.75}rem` }}>
                <a
                  href={`#${heading.id}`}
                  className={cn(
                    "block py-1 text-muted-foreground hover:text-foreground transition-colors",
                    activeId === heading.id && "text-foreground",
                    index === 0 ? '!pt-0' : ''
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
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        )}
      </div>
    </DocsSidebarBase>
  );
}