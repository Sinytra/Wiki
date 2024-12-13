import {X} from "lucide-react";
import {cn} from "@/lib/utils";

interface DocsSidebarBaseProps {
  title: string;
  className?: string;
  tagName?: string;
  children?: any;
}

export default function DocsSidebarBase({title, className, tagName, children}: DocsSidebarBaseProps) {
  const ContentDiv = tagName || 'div' as any;

  return (
    <aside className={cn(className, 'transition-all duration-300 ease-in-out overflow-hidden border-border bg-background')}>
      <ContentDiv className="h-full p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-secondary/20">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-muted-foreground">
            {title}
          </h3>
          <button className="lg:hidden text-muted-foreground">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {children}
      </ContentDiv>
    </aside>
  )
}