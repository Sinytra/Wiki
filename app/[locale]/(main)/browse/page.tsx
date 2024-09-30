import BrowseModList from "@/components/navigation/browse/BrowseModList";
import {Suspense} from "react";
import ProjectSearch from "@/components/navigation/browse/BrowseSearch";
import LoadingContent from "@/components/util/LoadingContent";
import {setContextLocale} from "@/lib/locales/routing";
import {useTranslations} from "next-intl";

export default function Browse({params, searchParams}: {
  params: { locale: string };
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  setContextLocale(params.locale);
  const t = useTranslations('BrowsePage');

  const query = searchParams?.query as string || '';
  const page = Number(searchParams?.page) || 1;

  return (
    <div className="flex flex-row gap-4 w-full justify-center">
      <div className="w-full max-w-[67rem] flex flex-col gap-2">
        <ProjectSearch placeholder={t('search.placeholder')}/>

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