import BrowseModList from "@/components/navigation/browse/BrowseModList";
import {Suspense} from "react";
import ProjectSearch from "@/components/navigation/browse/BrowseSearch";
import LoadingContent from "@/components/util/LoadingContent";

export default async function Browse({searchParams}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const query = searchParams?.query || '';
  const page = Number(searchParams?.page) || 1;

  return (
    <div className="flex flex-row gap-4 w-full justify-center">
      <div className="w-full max-w-[67rem] flex flex-col gap-2">
        <ProjectSearch/>

        <Suspense fallback={
          <div className="w-full flex justify-center my-3">
            <LoadingContent/>
          </div>
        }>
          <BrowseModList query={query} page={page}/>
        </Suspense>
      </div>
    </div>
  )
}