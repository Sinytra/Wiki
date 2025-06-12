'use client'

import {cn} from '@/lib/utils';
import {forwardRef, useContext} from 'react';
import {DocsSidebarContext, DocsSidebarType} from "@/components/docs/side/DocsSidebarContext";

export interface DocsSidebarBaseProps {
  title: string;
  className?: string;
  innerClassName?: string;
  tagName?: string;
  children?: any;
  solid?: boolean;
  type: DocsSidebarType;
}

const DocsSidebarBase = forwardRef<HTMLElement, DocsSidebarBaseProps>(function DocsSidebarBase({
                                                                                                 title,
                                                                                                 className,
                                                                                                 innerClassName,
                                                                                                 tagName,
                                                                                                 children,
                                                                                                 type,
                                                                                                 solid
                                                                                               }: DocsSidebarBaseProps, ref) {
  const ContentDiv = tagName || 'div' as any;

  const {open} = useContext(DocsSidebarContext)!;

  return (
    <aside data-open={open == type}
           className={cn(
             className,
             `
               fixed z-30 h-[88vh] w-full overflow-hidden border-tertiary bg-primary transition-all duration-300
               ease-in-out sm:h-[calc(100vh_-_9.5rem)] lg:top-[6rem]! lg:transition-none
             `,
             solid ? 'lg:static' : 'lg:sticky',
             type == 'left' && `
               border-r data-[open=false]:-translate-x-full data-[open=false]:border-0 lg:border-r-0
               lg:data-[open=false]:-translate-x-0
             `,
             type == 'right' && `
               border-l data-[open=false]:translate-x-full data-[open=false]:border-0 lg:border-l-0
               lg:data-[open=false]:translate-x-0
             `
           )}
    >
      <ContentDiv ref={ref}
                  className={cn(`
                    scrollbar-thumb-secondary scrollbar-track-secondary/20 scrollbar-thin h-full space-y-2
                    overflow-y-auto p-4
                  `, innerClassName)}>
        <div className="mb-4 flex items-center justify-between">
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