import {cn} from "@/lib/utils";

export default function DocsSidebarTitle({ children, extra, offset }: { children?: any, extra?: any, offset?: boolean }) {
  return (
    <div>
      <div className={cn("h-10 flex flex-row items-center justify-between", offset && 'm-1')}>
        <h1 className={cn("text-foreground text-lg")}>
          {children}
        </h1>
        {extra}
      </div>
      <hr className={cn("mb-6 border-neutral-600", offset ? 'mt-1' : 'mt-2')}/>
    </div>
  )
}