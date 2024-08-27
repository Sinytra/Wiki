import localPreview from "@/lib/docs/localPreview";
import {notFound} from "next/navigation";
import sources from "@/lib/docs/sources";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {FolderOpenIcon, PackageIcon} from "lucide-react";

export default async function Preview() {
  if (!localPreview.isEnabled()) {
    return notFound();
  }

  const localSources = await sources.getLocalDocumentationSources();

  return (
    <div className="flex flex-col">
      <h1 className="text-center text-3xl mb-6">Preview mode is enabled</h1>
      
      <span className="text-muted-foreground text-center mb-12">Description comes here</span>
      
      <span className="my-2 font-medium">Available local documentation roots</span>

      <hr className="my-2 border-neutral-600"/>

      <div className="flex flex-col my-3">
        {localSources.map((s, index) => (
          <div key={s.id} className="flex flex-row items-center gap-4">
            <span>{index + 1}.</span>
            <div className="flex flex-row justify-between items-center w-full">
              <div className="flex flex-row items-center gap-5">
                <div className="flex flex-row items-center gap-2">
                  <PackageIcon className="w-5 h-5"/>
                  {s.id}
                </div>
                <div className="flex flex-row items-center gap-2">
                  <FolderOpenIcon className="w-5 h-5"/>
                  {s.path}
                </div>
              </div>

              <Button size="sm" asChild>
                <Link href={`/mod/${s.id}`}>
                  Open
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}