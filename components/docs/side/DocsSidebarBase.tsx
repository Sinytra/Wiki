'use client'

import {cn} from '@/lib/utils';
import {forwardRef, useContext} from 'react';
import {DocsSidebarContext, DocsSidebarType} from "@/components/docs/side/DocsSidebarContext";

interface DocsSidebarBaseProps {
  title: string;
  className?: string;
  innerClassName?: string;
  tagName?: string;
  children?: any;
  type: DocsSidebarType;
}

const DocsSidebarBase = forwardRef<HTMLElement, DocsSidebarBaseProps>(function DocsSidebarBase({title, className, innerClassName, tagName, children, type}: DocsSidebarBaseProps, ref) {
  const ContentDiv = tagName || 'div' as any;

  const {open} = useContext(DocsSidebarContext)!;

  return (
    <aside data-open={open == type} className={cn(className, 'z-30 fixed lg:sticky lg:top-[6rem]! h-[88vh] sm:h-[calc(100vh_-_9.5rem)] transition-all lg:transition-none duration-300 ease-in-out overflow-hidden border-border bg-primary')}>
      <ContentDiv ref={ref} className={cn('h-full p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-secondary/20', innerClassName)}>
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-secondary">
            {title}
          </h3>
        </div>

        {children}
      </ContentDiv>
    </aside>
  )
});

export default DocsSidebarBase;