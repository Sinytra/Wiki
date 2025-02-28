import {cn} from "@/lib/utils";

export default function DocsSidebarTitle({ children, extra, offset, noSeparator }: { children?: any, extra?: any, offset?: boolean, noSeparator?: boolean }) {
  return (
    <div>
      <div className={cn("h-10 flex flex-row items-center justify-between", offset && 'm-1')}>
        <h1 className="text-primary text-lg w-full inline-flex items-center">
          {children}
        </h1>
        {extra}
      </div>
      <hr className={cn('mb-2', 'border-neutral-600', offset ? 'mt-1' : 'mt-2', noSeparator && 'hidden md:block')}/>
    </div>
  )
}