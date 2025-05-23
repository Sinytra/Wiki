import {ProjectStatus} from "@/lib/types/serviceTypes";
import {getMessages, getTranslations} from "next-intl/server";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import {redirect} from "next/navigation";
import {setContextLocale} from "@/lib/locales/routing";
import authSession from "@/lib/authSession";
import {NextIntlClientProvider, useTranslations} from "next-intl";
import {pick} from "lodash";
import DevProjectLogs from "@/components/dev/project/DevProjectLogs";
import {fetchProjectLog} from "@/lib/forms/actions";
import * as React from "react";
import DevProjectPageTitle from "@/components/dev/project/DevProjectPageTitle";
import {ShieldAlertIcon, ShieldCheckIcon} from "lucide-react";
import DevProjectSectionTitle from "@/components/dev/project/DevProjectSectionTitle";

function ProjectErrors() {
  const t = useTranslations('DevProjectHealthPage.errors');

  return (
    <div className="w-full h-80 gap-3 rounded-sm border border-tertiary bg-primary-dim flex flex-col justify-center items-center">
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

  const messages = await getMessages();

  // TODO Find alternative
  const token = authSession.getSession()?.token!;

  return (
    <div className="h-full flex flex-col pt-1 gap-y-4">
      <DevProjectPageTitle title={t('title')} desc={t('desc')} />

      <div className="h-full flex flex-col justify-between gap-4">
        <div className="space-y-4">
          <DevProjectSectionTitle title={t('errors.title')} desc={t('errors.desc')} icon={ShieldAlertIcon}/>
          <ProjectErrors />
        </div>

        {project.status !== ProjectStatus.UNKNOWN &&
          <div>
              <NextIntlClientProvider messages={pick(messages, 'DevProjectLogs')}>
                  <DevProjectLogs id={project.id} status={project.status || ProjectStatus.UNKNOWN} token={token}
                                  callback={fetchProjectLog}/>
              </NextIntlClientProvider>
          </div>
        }
      </div>
    </div>
  )
}