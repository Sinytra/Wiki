import {setContextLocale} from "@/lib/locales/routing";
import {getTranslations} from "next-intl/server";
import DevProjectPageTitle from "@/components/dashboard/dev/project/DevProjectPageTitle";
import * as React from "react";
import DevProjectSectionTitle from "@/components/dashboard/dev/project/DevProjectSectionTitle";
import ProjectDeleteForm from "@/components/dashboard/dev/modal/ProjectDeleteForm";
import {TriangleAlertIcon} from "lucide-react";
import {handleApiCall} from "@/lib/service/serviceUtil";
import devProjectApi from "@/lib/service/api/devProjectApi";
import {DevProjectRouteParams} from "@repo/shared/types/routes";
import {handleDeleteProjectForm, handleUpdateProjectSettingsForm} from "@/lib/forms/actions";
import FormWrapper from "@/components/modal/FormWrapper";
import DevProjectGeneralSettings from "@/components/dashboard/dev/project/DevProjectGeneralSettings";

function DangerSection({deleteFunc}: { deleteFunc: any }) {
  return (
    <div className="space-y-5">
      <DevProjectSectionTitle title="Danger zone"
                              desc="These are destcructive actions. Proceed with caution."
                              icon={TriangleAlertIcon}
      />

      <hr/>

      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-1">
            <span>
              Delete project
            </span>
            <span className="text-sm text-secondary">
              Forever delete all project data. This cannot be undone.
            </span>
          </div>
          <div className="ml-auto sm:ml-0">
            <FormWrapper keys={['ProjectDeleteForm']}>
              <ProjectDeleteForm
                formAction={deleteFunc}
                redirectTo="/dev"
              />
            </FormWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function DevProjectGeneralSettingsPage(props: { params: Promise<DevProjectRouteParams> }) {
  const params = await props.params;
  setContextLocale(params.locale);

  const t = await getTranslations('DevProjectSettingsPage');
  const project = handleApiCall(await devProjectApi.getProject(params.project));

  return (
    <div className="flex h-full flex-col gap-y-4 pt-1 pb-4">
      <DevProjectPageTitle title={t('title')} desc={t('desc')}/>

      <FormWrapper keys={['DevProjectSettingsPage', 'ProjectVisibility']}>
        <DevProjectGeneralSettings
          project={project}
          formAction={handleUpdateProjectSettingsForm.bind(null, project.id)}
        />
      </FormWrapper>

      <div className="flex h-full flex-col space-y-5">
        {project.access_level == 'owner' &&
          <>
              <hr className="mt-auto border-secondary"/>

              <DangerSection deleteFunc={handleDeleteProjectForm.bind(null, project.id)}/>
          </>
        }
      </div>
    </div>
  );
}