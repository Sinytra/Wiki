"use client";

import { useState, useEffect } from 'react';
import DocsSidebarBase from "@/components/docs/new/DocsSidebarBase";
import { FileHeading } from "@/lib/docs/metadata";
import { cn } from "@/lib/utils";

interface ContentRightSidebarProps {
  isOpen: boolean;
  headings: FileHeading[];
}

export default function DocsContentRightSidebar({ isOpen, headings }: ContentRightSidebarProps) {
  const [activeId, setActiveId] = useState<string>('');

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

  return (
    <DocsSidebarBase
      title="On this page"
      className={cn(
        "transition-all duration-300 ease-in-out overflow-hidden",
        isOpen ? 'w-64' : 'w-0 lg:w-64',
        isOpen ? '' : 'translate-x-full'
      )}
    >
      {headings.length > 0 && (
        <nav className="py-4 pt-0">
          <ul className="space-y-1 text-sm">
            {headings.slice(1).map((heading, index) => (
              <li key={heading.id} style={{ paddingLeft: `${(heading.depth - 1) * 0.75}rem` }}>
                <a
                  href={`#${heading.id}`}
                  className={cn(
                    "block py-1 text-muted-foreground hover:text-foreground transition-colors",
                    activeId === heading.id && "font-medium text-foreground",
                    index === 0 ? '!pt-0' : ''
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(heading.id)?.scrollIntoView({
                      behavior: 'smooth'
                    });
                  }}
                >
                  {heading.value}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </DocsSidebarBase>
  );
}