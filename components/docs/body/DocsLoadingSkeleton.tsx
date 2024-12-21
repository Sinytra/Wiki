import DocsContentTitle from "@/components/docs/layout/DocsContentTitle";
import {Skeleton} from "@/components/ui/skeleton";

export default function DocsLoadingSkeleton() {
  return (
    <div className="flex flex-col animate-out transition-all fade-out-0">
      <DocsContentTitle titleClassName="w-full">
        <Skeleton className="w-full h-8"/>
      </DocsContentTitle>

      <div>
        <Skeleton className="w-full h-8"/>

        <div className="flex flex-col gap-4">
          <Skeleton className="w-full h-10"/>
          <Skeleton className="w-full h-8"/>
          <Skeleton className="w-full h-8"/>

          <div className="flex flex-row w-full gap-6">
            <Skeleton className="w-72 h-72 flex-shrink-0"/>

            <div className="flex flex-col justify-between gap-4 w-full">
              <Skeleton className="w-full h-8"/>
              <Skeleton className="w-full h-8"/>
              <Skeleton className="w-full h-7"/>
              <Skeleton className="w-full h-7"/>
              <Skeleton className="w-full h-24"/>
            </div>
          </div>

          <Skeleton className="w-full h-12 mt-3"/>

          <Skeleton className="w-full h-10"/>
          <Skeleton className="w-full h-6"/>
          <Skeleton className="w-full h-6"/>
          <Skeleton className="w-full h-24"/>
        </div>
      </div>
    </div>
  )
}