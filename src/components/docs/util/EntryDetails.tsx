import {cn} from "@/lib/utils";

export default function EntryDetails({className, children}: {className?: string; children: any}) {
  return (
    <div className={cn(className, 'space-y-3 text-sm')}>
      {children}
    </div>
  )
}