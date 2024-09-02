import ModDocsEntryPageLayout from "@/components/docs/layout/ModDocsEntryPageLayout";
import DocsSidebarTitle from "@/components/docs/layout/DocsSidebarTitle";
import DocsContentTitle from "@/components/docs/layout/DocsContentTitle";
import {Skeleton} from "@/components/ui/skeleton";
import MetadataGrid from "@/components/docs/mod-metadata/MetadataGrid";

export default function DocsLoadingSkeleton() {
  return (
    <ModDocsEntryPageLayout rightPanel={
      <div>
        <div className="flex flex-col mb-2">
          <DocsSidebarTitle>
            <Skeleton className="min-w-[16rem] h-8 mb-2"/>
          </DocsSidebarTitle>

          <div className="flex mb-6 m-2 rounded-sm">
            <Skeleton className="w-full !h-[162px]"/>
          </div>

          <div className="mb-4">
            <MetadataGrid>
              <div className="inline-flex items-start justify-between gap-4">
                <Skeleton className="w-full h-5 basis-40"/>
                <Skeleton className="w-full h-5"/>
              </div>

              <div className="inline-flex items-start justify-between gap-4">
                <Skeleton className="w-full h-5 basis-96"/>
                <Skeleton className="w-full h-5"/>
              </div>

              <div className="inline-flex items-start justify-between gap-4">
                <Skeleton className="w-full h-5 basis-52"/>
                <Skeleton className="w-full h-5"/>
              </div>

              <div className="inline-flex items-start justify-between gap-4">
                <Skeleton className="w-full h-5 basis-60"/>
                <Skeleton className="w-full h-5"/>
              </div>

              <div className="inline-flex items-start justify-between gap-4">
                <Skeleton className="w-full h-5 basis-60"/>
                <Skeleton className="w-full h-5 basis-24"/>
              </div>
            </MetadataGrid>
          </div>

          <hr/>
        </div>
      </div>
    }>
      <div className="flex flex-col animate-out transition-all fade-out-0">
        <DocsContentTitle titleClassName="w-full">
          <Skeleton className="w-full max-w-[50rem] h-8"/>
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
    </ModDocsEntryPageLayout>
  )
}