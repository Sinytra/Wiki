import {ProjectStatus} from "@/lib/types/serviceTypes";
import {getTranslations} from "next-intl/server";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import {redirect} from "next/navigation";
import {setContextLocale} from "@/lib/locales/routing";
import authSession from "@/lib/authSession";
import {useTranslations} from "next-intl";
import DevProjectLogs from "@/components/dev/project/DevProjectLogs";
import {fetchProjectLog} from "@/lib/forms/actions";
import * as React from "react";
import DevProjectPageTitle from "@/components/dev/project/DevProjectPageTitle";
import {ShieldAlertIcon, ShieldCheckIcon} from "lucide-react";
import DevProjectSectionTitle from "@/components/dev/project/DevProjectSectionTitle";
import ClientLocaleProvider from "@/components/util/ClientLocaleProvider";

function ProjectErrors() {
  const t = useTranslations('DevProjectHealthPage.errors');

  return (
    <div className={`
      flex h-80 w-full flex-col items-center justify-center gap-3 rounded-sm border border-tertiary bg-primary-dim
    `}>
      <ShieldCheckIcon className="size-8" />
      <span>{t('empty')}</span>
    </div>
  )
}

export default async function DevProjectHealthPage({params}: { params: { locale: string; project: string } }) {
  setContextLocale(params.locale);
  const t = await getTranslations('DevProjectHealthPage');

  const project = await remoteServiceApi.getDevProject(params.project);
  if (!('id' in project)) {
    return redirect('/dev');
  }

  // TODO Find alternative
  const token = authSession.getSession()?.token!;

  return (
    <div className="flex h-full flex-col gap-y-4 pt-1">
      <DevProjectPageTitle title={t('title')} desc={t('desc')} />

      <div className="flex h-full flex-col justify-between gap-4">
        <div className="space-y-4">
          <DevProjectSectionTitle title={t('errors.title')} desc={t('errors.desc')} icon={ShieldAlertIcon}/>
          <ProjectErrors />
        </div>

        {project.status !== ProjectStatus.UNKNOWN &&
          <div>
              <ClientLocaleProvider keys={['DevProjectLogs']}>
                  <DevProjectLogs id={project.id} status={project.status || ProjectStatus.UNKNOWN} token={token}
                                  callback={fetchProjectLog}/>
              </ClientLocaleProvider>
          </div>
        }
      </div>
    </div>
  )
}