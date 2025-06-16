import DocsContentTitle from "@/components/docs/layout/DocsContentTitle";
import {Skeleton} from "@/components/ui/skeleton";

export default function DocsLoadingSkeleton() {
  return (
    <div className="flex animate-out flex-col transition-all fade-out-0">
      <DocsContentTitle titleClassName="w-full">
        <Skeleton className="h-8 w-full"/>
      </DocsContentTitle>

      <div>
        <Skeleton className="h-8 w-full"/>

        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-full"/>
          <Skeleton className="h-8 w-full"/>
          <Skeleton className="h-8 w-full"/>

          <div className="flex w-full flex-row gap-6">
            <Skeleton className="h-72 w-72 shrink-0"/>

            <div className="flex w-full flex-col justify-between gap-4">
              <Skeleton className="h-8 w-full"/>
              <Skeleton className="h-8 w-full"/>
              <Skeleton className="h-7 w-full"/>
              <Skeleton className="h-7 w-full"/>
              <Skeleton className="h-24 w-full"/>
            </div>
          </div>

          <Skeleton className="mt-3 h-12 w-full"/>

          <Skeleton className="h-10 w-full"/>
          <Skeleton className="h-6 w-full"/>
          <Skeleton className="h-6 w-full"/>
          <Skeleton className="h-24 w-full"/>
        </div>
      </div>
    </div>
  )
}