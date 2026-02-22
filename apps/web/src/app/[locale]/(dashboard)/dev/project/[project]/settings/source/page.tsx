import {setContextLocale} from "@/lib/locales/routing";
import DevProjectSourceSettings from "@/components/dashboard/dev/project/DevProjectSourceSettings";
import {getTranslations} from "next-intl/server";
import DevProjectPageTitle from "@/components/dashboard/dev/project/DevProjectPageTitle";
import * as React from "react";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";
import {handleApiCall} from "@/lib/service/serviceUtil";
import devProjectApi from "@/lib/service/api/devProjectApi";
import LiveProjectDeployConnection from "@/components/dashboard/dev/project/LiveProjectDeployConnection";
import {ProjectStatus} from "@repo/shared/types/api/project";
import authSession from "@/lib/authSession";
import FormWrapper from "@/components/modal/FormWrapper";
import {DevProjectRouteParams} from "@repo/shared/types/routes";

export default async function DevProjectSourceSettingsPage(props: { params: Promise<DevProjectRouteParams> }) {
  const params = await props.params;
  setContextLocale(params.locale);

  const t = await getTranslations('DevProjectSourceSettingsPage');
  const project = handleApiCall(await devProjectApi.getProject(params.project));
  const token = (await authSession.getSession())?.token ?? null;

  return (
    <div className="flex h-full flex-col gap-y-4 pt-1 pb-4">
      <ClientLocaleProvider keys={['LiveProjectDeployConnection']}>
        <LiveProjectDeployConnection id={project.id} status={project.status || ProjectStatus.UNKNOWN} token={token}/>
      </ClientLocaleProvider>

      <DevProjectPageTitle title={t('title')} desc={t('desc')} />

      <FormWrapper keys={['ProjectRegisterForm', 'DevProjectSourceSettingsPage']}>
        <DevProjectSourceSettings project={project}/>
      </FormWrapper>
    </div>
  );
}