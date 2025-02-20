import {useTranslations} from "next-intl";
import {FileQuestionIcon, HouseIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import GitHubIcon from "@/components/ui/icons/GitHubIcon";
import PrimaryButton from "@/components/ui/custom/PrimaryButton";
import {NavLink} from "@/components/navigation/link/NavLink";
import {Project} from "@/lib/service";

export default function DocsPageNotFoundError({project}: { project?: Project }) {
  const t = useTranslations('DocsPageNotFoundError');

  return (
    <div className="m-auto p-4 flex flex-col gap-4 justify-center items-center">
      <FileQuestionIcon className="w-32 h-32 sm:w-48 sm:h-48" strokeWidth={1.5}/>

      <h1 className="text-primary text-3xl sm:text-5xl my-2">
        {t('title')}
      </h1>

      <p className="text-secondary text-center w-3/4 sm:w-full">
        {t('desc')}
      </p>
      <p className="text-secondary text-center w-3/4 sm:w-full">
        {t('suggestion')}
      </p>

      <div className="inline-flex gap-4 mt-4">
        {project?.source_repo &&
          <Button variant="secondary" asChild>
              <Link href={project.source_repo} target="_blank">
                  <GitHubIcon className="mr-2 w-4 h-4"/>
                {t('submit')}
              </Link>
          </Button>
        }
        <PrimaryButton asChild>
          <NavLink href="/">
            <HouseIcon className="mr-2 w-4 h-4" strokeWidth={2.5}/>
            {t('return')}
          </NavLink>
        </PrimaryButton>
      </div>
    </div>
  )
}