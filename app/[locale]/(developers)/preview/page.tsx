import localPreview from "@/lib/docs/localPreview";
import {notFound} from "next/navigation";
import sources from "@/lib/docs/sources";
import {Button} from "@/components/ui/button";
import {FolderOpenIcon, PackageIcon} from "lucide-react";
import {NavLink} from "@/components/navigation/link/NavLink";
import {getTranslations} from "next-intl/server";

export default async function Preview() {
  if (!localPreview.isEnabled()) {
    return notFound();
  }

  const localSources = await sources.getLocalDocumentationSources();
  const t = await getTranslations('Preview');

  return (
    <div className="flex flex-col">
      <h1 className="text-center text-3xl mb-6">
        {t('title')}
      </h1>
      
      <span className="text-muted-foreground text-center mb-12">
        {t('desc')}
      </span>
      
      <span className="my-2 font-medium">
        {t('roots')}
      </span>

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
                <NavLink href={`/mod/${s.id}`}>
                  {t('open')}
                </NavLink>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}