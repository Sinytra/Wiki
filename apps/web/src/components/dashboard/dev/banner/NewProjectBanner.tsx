import {useTranslations} from "next-intl";
import {TrafficConeIcon} from "lucide-react";
import DismissBannerButton from "@/components/dashboard/dev/banner/DismissBannerButton";
import {ProjectFlag} from "@repo/shared/types/service";
import {handlePublishProject, handleRemoveProjectFlag} from "@/lib/forms/actions";
import FormWrapper from "@/components/modal/FormWrapper";
import PublishProjectButton from "@/components/dashboard/dev/banner/PublishProjectButton";

interface Props {
  projectId: string;
}

export default function NewProjectBanner({projectId}: Props) {
  const t = useTranslations('NewProjectBanner');

  return (
    <div className="h-full w-full space-y-2 rounded-sm border border-warning bg-warning-soft/50 p-3">
      <div className="flex flex-row items-center justify-between gap-2">
        <p className="flex flex-row items-center gap-2 font-medium text-primary">
          <TrafficConeIcon className="size-5"/>
          {t('title')}
        </p>

        <FormWrapper>
          <DismissBannerButton
            formAction={handleRemoveProjectFlag.bind(null, projectId, ProjectFlag.UNPUBLISHED)}
          />
        </FormWrapper>
      </div>

      <p className="text-sm text-secondary">
        {t('desc')}
      </p>

      <div className="flex flex-row items-center justify-end">
        <FormWrapper>
          <PublishProjectButton successMsg={t('success')}
                                formAction={handlePublishProject.bind(null, projectId)}>
            {t('submit')}
          </PublishProjectButton>
        </FormWrapper>
      </div>
    </div>
  )
}