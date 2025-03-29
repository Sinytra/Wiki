import {cn} from "@/lib/utils";

export default function ConnectionIndicator({className}: {className?: string}) {
  return (
    <div className={cn('inline-flex items-center rounded-full p-1 bg-green-900 text-green-300', className)}>
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
    </div>
  )
}