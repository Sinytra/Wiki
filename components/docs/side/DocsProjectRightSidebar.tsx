import { CopyrightIcon as License, Globe, MilestoneIcon, Tags, User } from 'lucide-react'
import GitHubIcon from "@/components/ui/icons/GitHubIcon";
import { Project } from "@/lib/service";
import platforms, { PlatformProject } from "@/lib/platforms";
import ImageWithFallback from "@/components/util/ImageWithFallback";
import {
  ProjectCategories,
  ProjectDisplayInformation,
  ProjectTypeIcons
} from "@/lib/docs/projectInfo";
import LinkTextButton from "@/components/ui/link-text-button";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { DEFAULT_WIKI_LICENSE } from "@/lib/constants";
import CurseForgeIcon from "@/components/ui/icons/CurseForgeIcon";
import ModrinthIcon from "@/components/ui/icons/ModrinthIcon";
import DocsSidebarBase from "@/components/docs/side/DocsSidebarBase";
import EntryDetails from "@/components/docs/util/EntryDetails";
import DetailCategory from "@/components/docs/util/DetailCategory";
import { Button } from '@/components/ui/button';
import { SocialButton } from '@/components/ui/custom/SocialButtons';
import ModVersionRange from "@/components/docs/ModVersionRange";

interface RightSidebarProps {
  project: Project;
  platformProject: PlatformProject;
  projectInfo: ProjectDisplayInformation;
}

export default function DocsProjectRightSidebar({
  project,
  platformProject,
  projectInfo,
}: RightSidebarProps
) {
  const TypeIcon = ProjectTypeIcons[project.type];
  const t = useTranslations('DocsProjectRightSidebar');
  const types = useTranslations('ProjectTypes');
  const categories = useTranslations('ProjectCategories');

  return (
    <DocsSidebarBase title={t('title')} type="right" className={cn(
      'flex-shrink-0 right-0',
      'w-[96vw] sm:w-64 data-[open=false]:translate-x-full data-[open=false]:lg:translate-x-0',
      'border-l data-[open=false]:border-0 data-[open=false]:lg:border-l'
    )}>
      {/* Project Icon & Name */}
      <div className="flex items-center space-x-3 pb-2">
        <div className="flex-shrink-0 w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
          <ImageWithFallback src={platformProject.icon_url} width={48} height={48} fbWidth={24} fbHeight={24}
            className="rounded-sm !opacity-100 !text-secondary-foreground" alt="Logo"
            strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-base font-semibold">
            {platformProject.name}
          </h2>
          <p className="text-xs text-muted-foreground" title={platformProject.is_placeholder ? undefined : platformProject.summary}>
            {platformProject.is_placeholder
              ? t('placeholder.summary')
              : (platformProject.summary.length > 50 ? `${platformProject.summary.substring(0, 50)}...` : platformProject.summary)
            }
          </p>
        </div>
      </div>

      {/* Project Details */}
      <EntryDetails>
        {/* Project Type */}
        <DetailCategory icon={TypeIcon}>
          {types(project.type)}
        </DetailCategory>

        {/* Author */}
        <DetailCategory icon={User} innerClass="myItems flex flex-row flex-wrap justify-end">
          {platformProject.is_placeholder &&
            <span className="text-muted-foreground">{t('placeholder.author')}</span>
          }
          {projectInfo.authors.map(a => (
            <div key={a.name}>
              <LinkTextButton className="!font-normal !text-muted-foreground" href={a.url} target="_blank">
                {a.name}
              </LinkTextButton>
            </div>
          ))}
        </DetailCategory>

        {/* Latest Version */}
        <DetailCategory icon={MilestoneIcon} innerClass="flex flex-row gap-2">
          {platformProject.is_placeholder &&
            <span className="text-muted-foreground">{t('placeholder.latest_version')}</span>
          }
          <ModVersionRange versions={platformProject.game_versions} />
        </DetailCategory>

        {/* Tags */}
        <div>
          <DetailCategory icon={Tags} className="mb-2">
            {t('tags')}
          </DetailCategory>
          <div className="flex flex-wrap gap-1 ml-5">
            {platformProject.categories.filter(t => ProjectCategories[t] !== undefined).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs bg-secondary text-secondary-foreground rounded-md"
              >
                {categories(tag as any)}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
        <div>
          <DetailCategory icon={License} className="mb-2">
            {t('licenses.title')}
          </DetailCategory>
          <div className="space-y-2 text-sm ml-6">
            <div>
              <span className="text-muted-foreground">{t('licenses.project')}</span>{' '}
                <Button variant="link" className="h-auto p-0 text-muted-foreground" asChild>
                  <a href={platformProject?.license?.url ?? `https://spdx.org/licenses/${projectInfo.license.name}`} target="_blank" rel="noopener noreferrer">
                    {projectInfo.license.name}
                  </a>
                </Button>
            </div>
            <div>
              <span className="text-muted-foreground">
                {t('licenses.wiki')}
              </span>{' '}
              <Button variant="link" className="h-auto p-0 text-muted-foreground" asChild>
                <a href={DEFAULT_WIKI_LICENSE.url} target="_blank" rel="noopener noreferrer">
                  {DEFAULT_WIKI_LICENSE.name}
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div>
          <DetailCategory icon={Globe} className="mb-2">
            {t('links')}
          </DetailCategory>
          <div className="flex flex-wrap gap-2 ml-6">
            {project.platforms.curseforge && (
              <SocialButton 
                href={platforms.getProjectURL('curseforge', project.platforms.curseforge)} 
                icon={<CurseForgeIcon className="h-4 w-4 sm:h-5 sm:w-5" />} 
              />
            )}
            {project.platforms.modrinth && (
              <SocialButton 
                href={platforms.getProjectURL('modrinth', project.platforms.modrinth)} 
                icon={<ModrinthIcon className="h-4 w-4 sm:h-5 sm:w-5" />} 
              />
            )}
            {platformProject.source_url && (
              <SocialButton 
                href={platformProject.source_url} 
                icon={<GitHubIcon className="h-4 w-4 sm:h-5 sm:w-5" />} 
              />
            )}
          </div>
        </div>
      </div>
      </EntryDetails>
    </DocsSidebarBase>
  )
}

