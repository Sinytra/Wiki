'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import DocsSidebarBase from '@/components/docs/side/DocsSidebarBase';
import { DocsSidebarType } from '@/components/docs/side/DocsSidebarContext';
import { cn } from '@repo/ui/lib/utils';
import { useTranslations } from 'next-intl';
import { FileHeading } from '@repo/markdown';
import ToggleChevron from '@repo/ui/util/ToggleChevron';

export interface DocsTOCSidebarBaseProps {
  headings: FileHeading[];
  type: DocsSidebarType;
  className?: string;
  solid?: boolean;
}

interface HeadingNode {
  heading: FileHeading;
  children: HeadingNode[];
}

interface HeadingItemProps {
  node: HeadingNode;
  activeId: string;
  collapsed: Record<string, boolean>;
  setCollapsed: (id: string, value: boolean) => void;
  first?: boolean;
}

function buildHeadingTree(headings: FileHeading[]): HeadingNode[] {
  const roots: HeadingNode[] = [];
  const ancestors: HeadingNode[] = [];

  for (const heading of headings) {
    const node: HeadingNode = { heading, children: [] };

    while (ancestors.length > 0 && ancestors[ancestors.length - 1]!.heading.depth >= heading.depth) {
      ancestors.pop();
    }

    const parent = ancestors[ancestors.length - 1];
    (parent ? parent.children : roots).push(node);
    ancestors.push(node);
  }

  return roots;
}

function containsHeading(node: HeadingNode, id: string): boolean {
  return node.children.some((child) => child.heading.id === id || containsHeading(child, id));
}

function HeadingItem({ node, activeId, collapsed, setCollapsed, first }: HeadingItemProps) {
  const { heading, children } = node;
  const isOpen = !collapsed[heading.id];
  const isActive = activeId === heading.id || (!isOpen && containsHeading(node, activeId));

  const link = (
    <a
      href={`#${heading.id}`}
      className={cn(
        'block py-1 text-secondary transition-colors hover:text-primary',
        isActive && 'text-primary',
        first && 'pt-0!'
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
  );

  if (children.length === 0) {
    return (
      <li className="flex items-start gap-1">
        <span className="size-4 shrink-0" />
        {link}
      </li>
    );
  }

  return (
    <li>
      <details className="group" open={isOpen} onToggle={(e) => setCollapsed(heading.id, !e.currentTarget.open)}>
        <summary
          className="flex list-none items-start gap-1 [&::-webkit-details-marker]:hidden"
          onClick={(e) => e.preventDefault()}
        >
          <button
            type="button"
            aria-expanded={isOpen}
            aria-label={heading.value}
            className={cn('shrink-0 cursor-pointer py-1 text-secondary hover:text-primary', first && 'pt-0!')}
            onClick={() => setCollapsed(heading.id, isOpen)}
          >
            <ToggleChevron className="size-4 group-open:rotate-180" />
          </button>
          {link}
        </summary>

        <ul className="space-y-1 pl-3">
          {children.map((child) => (
            <HeadingItem
              key={child.heading.id}
              node={child}
              activeId={activeId}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
            />
          ))}
        </ul>
      </details>
    </li>
  );
}

export default function DocsTOCSidebarBase({ headings, type, className, solid }: DocsTOCSidebarBaseProps) {
  const t = useTranslations('DocsNonContentRightSidebar');

  const [activeId, setActiveId] = useState<string>('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [showTopGradient, setShowTopGradient] = useState(false);
  const [showBottomGradient, setShowBottomGradient] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const visibleHeadings = useMemo(() => headings.filter((h) => h.depth < 4), [headings]);
  const headingTree = useMemo(() => buildHeadingTree(visibleHeadings), [visibleHeadings]);

  const updateCollapsed = (id: string, value: boolean) =>
    setCollapsed((prev) => (prev[id] === value ? prev : { ...prev, [id]: value }));

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = visibleHeadings.map((heading) => document.getElementById(heading.id)).filter(Boolean);
      const activeHeading = headingElements.find((el) => {
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
  }, [visibleHeadings]);

  useEffect(() => {
    const checkOverflow = () => {
      if (listRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = listRef.current;
        setShowTopGradient(scrollTop > 0);
        setShowBottomGradient(scrollTop + clientHeight < scrollHeight);
      }
    };

    const listElement = listRef.current;
    if (listElement) {
      listElement.addEventListener('scroll', checkOverflow);
      window.addEventListener('resize', checkOverflow);
      checkOverflow();
    }

    return () => {
      if (listElement) {
        listElement.removeEventListener('scroll', checkOverflow);
      }
      window.removeEventListener('resize', checkOverflow);
    };
  }, [visibleHeadings, collapsed]);

  return (
    <DocsSidebarBase type={type} title={t('title')} className={cn('shrink-0', className)} tagName="nav" solid={solid}>
      <div className="relative">
        {showTopGradient && (
          <div
            className={`from-background pointer-events-none absolute top-0 right-0 left-0 h-12 bg-linear-to-b to-transparent`}
          />
        )}
        <div
          ref={listRef}
          className={`scrollbar-thin max-h-[80vh] scrollbar-thumb-gray-300 scrollbar-track-transparent overflow-y-auto pr-4`}
        >
          <ul className="space-y-1 text-sm">
            {headingTree.map((node, index) => (
              <HeadingItem
                key={node.heading.id}
                node={node}
                activeId={activeId}
                collapsed={collapsed}
                setCollapsed={updateCollapsed}
                first={index === 0}
              />
            ))}
          </ul>
        </div>
        {showBottomGradient && (
          <div
            className={`from-background pointer-events-none absolute right-0 bottom-0 left-0 h-12 bg-linear-to-t to-transparent`}
          />
        )}
      </div>
    </DocsSidebarBase>
  );
}
