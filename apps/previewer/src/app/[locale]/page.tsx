import {Button} from "@repo/ui/components/button";
import {FolderOpenIcon, PackageIcon} from "lucide-react";
import {NavLink} from "@/components/navigation/link/NavLink";
import {getTranslations} from "next-intl/server";
import {setContextLocale} from "@/lib/locales/routing";
import previewer from "@repo/previewer";
import navigation from "@/lib/navigation";
import {ReactNode} from "react";

export const dynamic = 'force-dynamic';

async function ProjectLayout(props: { children: ReactNode; }) {
  const {children} = props;

  return (
    <div className="page-wrapper-base mx-4 flex min-h-screen flex-col sm:mx-2">
      <div className="page-wrapper-ext mx-1 flex w-full flex-col items-center">
        <div className="w-full max-w-5xl">
          {children}
        </div>
      </div>
    </div>
  );
}

export default async function Preview(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setContextLocale(params.locale);

  const localSources = await previewer.getLocalDocumentationSources();
  const t = await getTranslations('Preview');

  return (
    <ProjectLayout>
      <div className="flex flex-col">
        <h1 className="mb-6 text-center text-3xl">
          {t('title')}
        </h1>

        <span className="mb-12 text-center text-secondary">
        {t('desc')}
      </span>

        <span className="my-2 font-medium">
        {t('roots')}
      </span>

        <hr className="my-2 border-neutral-600"/>

        <div className="my-3 flex flex-col">
          {localSources.map((s, index) => (
            <div key={s.id} className="flex flex-row items-center gap-4">
              <span>{index + 1}.</span>
              <div className="flex w-full flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-5">
                  <div className="flex flex-row items-center gap-2">
                    <PackageIcon className="h-5 w-5"/>
                    {s.id}
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <FolderOpenIcon className="h-5 w-5"/>
                    {s.path}
                  </div>
                </div>

                <Button size="sm" asChild>
                  <NavLink href={navigation.getProjectLink(s.id)}>
                    {t('open')}
                  </NavLink>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProjectLayout>
  );
}