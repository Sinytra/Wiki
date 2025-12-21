import {setContextLocale} from "@/lib/locales/routing";
import DevProjectPageTitle from "@/components/dashboard/dev/project/DevProjectPageTitle";
import {Button} from "@repo/ui/components/button";
import {DoorOpenIcon, TrashIcon} from "lucide-react";
import ImageWithFallback from "@/components/util/ImageWithFallback";
import {getTranslations} from "next-intl/server";
import {handleApiCall} from "@/lib/service/serviceUtil";
import devProjectApi from "@/lib/service/api/devProjectApi";
import {DevProjectRouteParams} from "@repo/shared/types/routes";
import {ProjectMember} from "@repo/shared/types/api/devProject";
import {useTranslations} from "next-intl";
import * as React from "react";
import {getGitHubAvatarUrl} from "@repo/shared/util";
import AddProjectMemberForm from "@/components/dashboard/dev/modal/AddProjectMemberForm";
import {handleAddProjectMember, handleRemoveProjectMember} from "@/lib/forms/actions";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";
import GenericDeleteModal from "@/components/dashboard/dev/modal/GenericDeleteModal";
import navigation from "@/lib/navigation";

type Properties = {
  params: Promise<DevProjectRouteParams>;
}

function ProjectMemberWidget({projectId, canEdit, canLeave, member}: {
  projectId: string;
  canEdit: boolean;
  canLeave: boolean;
  member: ProjectMember
}) {
  const avatarUrl = getGitHubAvatarUrl(member.username);
  const t = useTranslations('DevProjectMembersPage');
  const u = useTranslations('ProjectMemberRole');
  const DeleteIcon = member.isActor ? DoorOpenIcon : TrashIcon;
  const modalLocale = member.isActor ? 'LeaveProjectModal' : 'RemoveProjectMemberModal';

  return (
    <div className="flex w-full flex-row gap-3 rounded-md border border-tertiary bg-primary-alt p-3 sm:gap-4 sm:p-4">
      <ImageWithFallback src={avatarUrl} width={64} height={64} className="rounded-sm sm:size-21" alt="avatar"/>

      <div className="flex w-full flex-col items-end justify-between">
        <div className="flex w-full flex-row justify-between gap-2">
          <span className="text-lg sm:text-xl">{member.username}</span>
          <span className="text-secondary">{u(member.role)}</span>
        </div>

        <div>
          {(member.isActor || canEdit) &&
            <ClientLocaleProvider keys={[modalLocale]}>
                <GenericDeleteModal localeNamespace={modalLocale}
                                    formAction={handleRemoveProjectMember.bind(null, projectId, { username: member.username })}
                                    redirectTo={ member.isActor ? navigation.authorDashboard() : undefined }
                                    trigger={
                                      <Button variant="destructive" size="sm" disabled={member.isActor && !canLeave}>
                                        <DeleteIcon className="mr-2 h-4 w-4"/>
                                        {t(member.isActor ? 'actions.leave' : 'actions.remove')}
                                      </Button>
                                    }/>
            </ClientLocaleProvider>
          }
        </div>
      </div>
    </div>
  )
}

export default async function DevProjectMembersPage(props: Properties) {
  const params = await props.params;
  setContextLocale(params.locale);
  const t = await getTranslations('DevProjectMembersPage');
  const data = handleApiCall(await devProjectApi.getProjectMembers(params.project));

  return (
    <div className="space-y-3 pt-1">
      <DevProjectPageTitle title={t('title')} desc={t('desc')}/>

      <div className="flex flex-col gap-4">
        {data.canEdit &&
          <div className="flex flex-row items-center justify-end">
              <ClientLocaleProvider keys={['AddProjectMemberForm', 'ProjectMemberRole', 'FormActions']}>
                  <AddProjectMemberForm formAction={handleAddProjectMember.bind(null, params.project)}/>
              </ClientLocaleProvider>
          </div>
        }

        <div className="flex flex-col gap-2">
          {data.members.map(member => (
            <ProjectMemberWidget key={member.username} projectId={params.project} canEdit={data.canEdit}
                                 canLeave={data.canLeave} member={member}/>
          ))}
        </div>
      </div>
    </div>
  )
}