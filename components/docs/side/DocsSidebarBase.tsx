'use client'

import {cn} from '@/lib/utils';
import {Context, useContext} from 'react';
import {LeftSidebarContext, SidebarContext} from '@/components/docs/side/LeftSidebarContext';

interface DocsSidebarBaseProps {
  title: string;
  className?: string;
  tagName?: string;
  children?: any;
  context?: Context<SidebarContext | null>;
}

// @ts-ignore
export default function DocsSidebarBase({title, className, tagName, children, context = LeftSidebarContext}: DocsSidebarBaseProps) {
  const ContentDiv = tagName || 'div' as any;

  const {open} = useContext(context)!;

  return (
    <aside data-open={open} className={cn(className, 'sm:h-[calc(100vh_-_9.5rem)] transition-all duration-300 ease-in-out overflow-hidden border-border bg-background')}>
      <ContentDiv className="h-full p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-secondary/20">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-muted-foreground">
            {title}
          </h3>
        </div>

        {children}
      </ContentDiv>
    </aside>
  )
}