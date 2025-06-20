import {setContextLocale} from "@/lib/locales/routing";
import DevProjectSettings from "@/components/dev/project/DevProjectSettings";
import {getTranslations} from "next-intl/server";
import {handleDeleteProjectForm, handleEditProjectForm} from "@/lib/forms/actions";
import DevProjectPageTitle from "@/components/dev/project/DevProjectPageTitle";
import * as React from "react";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";
import {handleApiCall} from "@/lib/service/serviceUtil";
import devProjectApi from "@/lib/service/api/devProjectApi";

export default async function DevProjectSettingsPage({params}: { params: { locale: string; project: string } }) {
  setContextLocale(params.locale);
  const t = await getTranslations('DevProjectSettingsPage');
  const project = handleApiCall(await devProjectApi.getProject(params.project));

  return (
    <div className="flex h-full flex-col gap-y-4 pt-1 pb-4">
      <DevProjectPageTitle title={t('title')} desc={t('desc')} />

      <ClientLocaleProvider keys={['ProjectRegisterForm', 'ProjectSettingsForm', 'ProjectDeleteForm', 'FormActions']}>
        <DevProjectSettings
          project={project}
          formAction={handleEditProjectForm}
          deleteFunc={handleDeleteProjectForm.bind(null, project.id)}
        />
      </ClientLocaleProvider>
    </div>
  );
}