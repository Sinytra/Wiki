import {setContextLocale} from "@/lib/locales/routing";
import DevProjectSettings from "@/components/dev/project/DevProjectSettings";
import {getTranslations} from "next-intl/server";
import {handleDeleteProjectForm} from "@/lib/forms/actions";
import DevProjectPageTitle from "@/components/dev/project/DevProjectPageTitle";
import * as React from "react";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";
import {handleApiCall} from "@/lib/service/serviceUtil";
import devProjectApi from "@/lib/service/api/devProjectApi";
import LiveProjectDeployConnection from "@/components/dev/project/LiveProjectDeployConnection";
import {ProjectStatus} from "@repo/shared/types/api/project";
import authSession from "@/lib/authSession";

export default async function DevProjectSettingsPage(props: { params: Promise<{ locale: string; project: string }> }) {
  const params = await props.params;
  setContextLocale(params.locale);
  const t = await getTranslations('DevProjectSettingsPage');
  const project = handleApiCall(await devProjectApi.getProject(params.project));
  const token = (await authSession.getSession())?.token ?? null;

  return (
    <div className="flex h-full flex-col gap-y-4 pt-1 pb-4">
      <ClientLocaleProvider keys={['LiveProjectDeployConnection']}>
        <LiveProjectDeployConnection id={project.id} status={project.status || ProjectStatus.UNKNOWN} token={token}/>
      </ClientLocaleProvider>

      <DevProjectPageTitle title={t('title')} desc={t('desc')} />

      <ClientLocaleProvider keys={['ProjectRegisterForm', 'ProjectSettingsForm', 'ProjectDeleteForm', 'FormActions']}>
        <DevProjectSettings
          project={project}
          deleteFunc={handleDeleteProjectForm.bind(null, project.id)}
        />
      </ClientLocaleProvider>
    </div>
  );
}