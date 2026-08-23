import { useTranslations } from 'next-intl';
import { FileQuestionIcon, HouseIcon } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import GitHubIcon from '@repo/ui/icons/GitHubIcon';
import { ProjectData } from '@sinytra/wiki-api-types';
import { NavLink } from '@/components/navigation/link/NavLink';

interface Props {
  project?: ProjectData;
  returnTo?: string;
}

export default function DocsPageErrorBase({ project, returnTo }: Props) {
  const t = useTranslations('DocsPageError');

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-4 pb-[min(25vh,16rem)]">
      <FileQuestionIcon className="size-32 sm:size-44" strokeWidth={1.5} />

      <h1 className="my-2 text-3xl text-primary sm:text-5xl">{t('title')}</h1>

      <p className="w-3/4 text-center text-secondary sm:w-full">{t('desc')}</p>
      <p className="w-3/4 text-center text-secondary sm:w-full">{t('suggestion')}</p>

      <div className="mt-4 inline-flex gap-4">
        {project?.source_repo && (
          <Button variant="secondary" asChild>
            <NavLink href={project.source_repo} target="_blank">
              <GitHubIcon className="mr-2 h-4 w-4" />
              {t('submit')}
            </NavLink>
          </Button>
        )}
        <Button asChild>
          <NavLink href={returnTo ?? '/'}>
            <HouseIcon className="mr-2 h-4 w-4" strokeWidth={2.5} />
            {t('return')}
          </NavLink>
        </Button>
      </div>
    </div>
  );
}
