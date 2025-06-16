import {cn} from "@/lib/utils";

export default function ConnectionIndicator({className}: {className?: string}) {
  return (
    <div className={cn('inline-flex items-center rounded-full bg-green-900 p-1 text-green-300', className)}>
      <div className="h-2 w-2 rounded-full bg-green-500"></div>
    </div>
  )
}