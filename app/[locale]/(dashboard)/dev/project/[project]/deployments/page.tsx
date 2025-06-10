import DevProjectPageTitle from "@/components/dev/project/DevProjectPageTitle";
import {setContextLocale} from "@/lib/locales/routing";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import {getTranslations} from "next-intl/server";
import {redirect} from "next/navigation";
import {parseAsInteger} from "nuqs/server";
import * as React from "react";
import DevProjectDeploymentsTable from "@/components/dev/table/DevProjectDeploymentsTable";
import {HardDriveDownloadIcon} from "lucide-react";
import {Button} from "@/components/ui/button";

type Properties = {
  params: {
    locale: string;
    project: string;
  };
  searchParams: {
    page?: string | string[];
  }
}

export default async function DevProjectDeploymentsPage({params, searchParams}: Properties) {
  setContextLocale(params.locale);
  const t = await getTranslations('DevProjectDeploymentsPage');

  const project = await remoteServiceApi.getDevProject(params.project);
  if (!('id' in project)) {
    return redirect('/dev');
  }

  const page = parseAsInteger.withDefault(1).parseServerSide(searchParams.page);

  const content = await remoteServiceApi.getDevProjectDeployments(
    params.project,
    {page: page.toString()}
  );
  if ('status' in content) {
    return redirect('/dev');
  }

  return (
    <div className="space-y-3 pt-1">
      <DevProjectPageTitle title={t('title')} desc={t('desc')} />

      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-end">
          <Button size="sm">
            <HardDriveDownloadIcon className="mr-2 size-4" />
            Deploy
          </Button>
        </div>

        <DevProjectDeploymentsTable data={content} page={page}/>
      </div>
    </div>
  )
}
