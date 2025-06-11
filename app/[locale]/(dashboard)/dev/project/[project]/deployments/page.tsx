import DevProjectPageTitle from "@/components/dev/project/DevProjectPageTitle";
import {setContextLocale} from "@/lib/locales/routing";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import {getTranslations} from "next-intl/server";
import {redirect} from "next/navigation";
import {parseAsInteger} from "nuqs/server";
import * as React from "react";
import DevProjectDeploymentsTable from "@/components/dev/table/DevProjectDeploymentsTable";
import DeployProjectModal from "@/components/dev/modal/DeployProjectModal";
import {handleRevalidateDocs} from "@/lib/forms/actions";
import ClientLocaleProvider from "@/components/util/ClientLocaleProvider";
import {ProjectStatus} from "@/lib/types/serviceTypes";
import LiveProjectDeployConnection from "@/components/dev/project/LiveProjectDeployConnection";
import authSession from "@/lib/authSession";
import DeployProjectContextProvider from "@/components/dev/modal/DeployProjectContextProvider";

type Properties = {
  params: {
    locale: string;
    project: string;
  };
  searchParams: {
    page?: string | string[];
  }
}

// TODO Mobile view
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
  const token = authSession.getSession()?.token!;

  return (
    <div className="space-y-3 pt-1">
      <ClientLocaleProvider keys={['LiveProjectDeployConnection']}>
        <LiveProjectDeployConnection id={project.id} status={project.status || ProjectStatus.UNKNOWN} token={token}/>
      </ClientLocaleProvider>

      <DevProjectPageTitle title={t('title')} desc={t('desc')}/>

      <DeployProjectContextProvider>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-end">
            <ClientLocaleProvider keys={['DeployProjectModal']}>
              <div>
                <DeployProjectModal action={handleRevalidateDocs.bind(null, project.id)}/>
              </div>
            </ClientLocaleProvider>
          </div>

          <DevProjectDeploymentsTable data={content} page={page}/>
        </div>
      </DeployProjectContextProvider>
    </div>
  )
}
