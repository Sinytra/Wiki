import {cn} from "@repo/ui/lib/utils";

export default function DocsSidebarTitle({ children, extra, offset, noSeparator }: { children?: any, extra?: any, offset?: boolean, noSeparator?: boolean }) {
  return (
    <div>
      <div className={cn("flex h-10 flex-row items-center justify-between", offset && 'm-1')}>
        <h1 className="inline-flex w-full items-center text-lg text-primary">
          {children}
        </h1>
        {extra}
      </div>
      <hr className={cn('mb-2', 'border-neutral-600', offset ? 'mt-1' : 'mt-2', noSeparator && 'hidden md:block')}/>
    </div>
  )
}