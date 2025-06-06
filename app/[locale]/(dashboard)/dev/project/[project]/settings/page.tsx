import {setContextLocale} from "@/lib/locales/routing";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import {redirect} from "next/navigation";
import DevProjectSettings from "@/components/dev/project/DevProjectSettings";
import {getTranslations} from "next-intl/server";
import {handleDeleteProjectForm, handleEditProjectForm} from "@/lib/forms/actions";
import DevProjectPageTitle from "@/components/dev/project/DevProjectPageTitle";
import * as React from "react";
import ClientLocaleProvider from "@/components/util/ClientLocaleProvider";

export default async function DevProjectSettingsPage({params}: { params: { locale: string; project: string } }) {
  setContextLocale(params.locale);
  const t = await getTranslations('DevProjectSettingsPage');

  const project = await remoteServiceApi.getDevProject(params.project);
  if (!('id' in project)) {
    return redirect('/dev');
  }

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