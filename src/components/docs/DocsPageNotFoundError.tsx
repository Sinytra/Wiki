import {useTranslations} from "next-intl";
import {FileQuestionIcon, HouseIcon} from "lucide-react";
import {Button} from "@repo/ui/components/button";
import Link from "next/link";
import GitHubIcon from "@repo/ui/icons/GitHubIcon";
import {NavLink} from "@/components/navigation/link/NavLink";

import {Project} from "@repo/shared/types/service";

export default function DocsPageNotFoundError({project}: { project?: Project }) {
  const t = useTranslations('DocsPageNotFoundError');

  return (
    <div className="m-auto flex flex-col items-center justify-center gap-4 p-4">
      <FileQuestionIcon className="h-32 w-32 sm:h-48 sm:w-48" strokeWidth={1.5}/>

      <h1 className="text-primary my-2 text-3xl sm:text-5xl">
        {t('title')}
      </h1>

      <p className="text-secondary w-3/4 text-center sm:w-full">
        {t('desc')}
      </p>
      <p className="text-secondary w-3/4 text-center sm:w-full">
        {t('suggestion')}
      </p>

      <div className="mt-4 inline-flex gap-4">
        {project?.source_repo &&
          <Button variant="secondary" asChild>
              <Link href={project.source_repo} target="_blank">
                  <GitHubIcon className="mr-2 h-4 w-4"/>
                {t('submit')}
              </Link>
          </Button>
        }
        <Button asChild>
          <NavLink href="/">
            <HouseIcon className="mr-2 h-4 w-4" strokeWidth={2.5}/>
            {t('return')}
          </NavLink>
        </Button>
      </div>
    </div>
  )
}