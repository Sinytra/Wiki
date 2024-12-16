import { CopyrightIcon as License, Globe, MilestoneIcon, Tags, User } from 'lucide-react'
import GitHubIcon from "@/components/ui/icons/GitHubIcon";
import { Project } from "@/lib/service";
import platforms, { PlatformProject } from "@/lib/platforms";
import ImageWithFallback from "@/components/util/ImageWithFallback";
import { ProjectDisplayInformation, ProjectTypeIcons } from "@/components/docs/project-info/projectInfo";
import LinkTextButton from "@/components/ui/link-text-button";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { DEFAULT_WIKI_LICENSE } from "@/lib/constants";
import CurseForgeIcon from "@/components/ui/icons/CurseForgeIcon";
import ModrinthIcon from "@/components/ui/icons/ModrinthIcon";
import DocsSidebarBase from "@/components/docs/new/DocsSidebarBase";
import EntryDetails from "@/components/docs/new/util/EntryDetails";
import DetailCategory from "@/components/docs/new/util/DetailCategory";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { SocialButton } from '@/components/ui/custom/SocialButtons';

interface RightSidebarProps {
  project: Project;
  platformProject: PlatformProject;
  projectInfo: ProjectDisplayInformation;
  isOpen: boolean;
}

export default function DocsProjectRightSidebar({
  project,
  platformProject,
  projectInfo,
  isOpen
}: RightSidebarProps
) {
  const TypeIcon = ProjectTypeIcons[project.type];
  const types = useTranslations('ProjectTypes');
  const categories = useTranslations('ProjectCategories');

  return (
    <DocsSidebarBase title="Project Information" className={cn(
      'flex-shrink-0 sm:sticky sm:top-20 sm:h-[calc(100vh_-_8rem)]',
      isOpen ? '' : 'translate-x-full',
      isOpen ? 'w-64' : 'w-0 lg:w-64',
      'border-l'
    )}>
      {/* Project Icon & Name */}
      <div className="flex items-center space-x-3 pb-2">
        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
          <ImageWithFallback src={platformProject.icon_url} width={48} height={48} fbWidth={24} fbHeight={24}
            className="!opacity-100 !text-secondary-foreground" alt="Logo"
            strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-lg font-bold">
            {platformProject.name}
          </h2>
          <p className="text-xs text-muted-foreground">
            {platformProject.summary}
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
          {projectInfo.authors.map(a => (
            <div key={a.name}>
              <LinkTextButton className="!font-normal !text-muted-foreground" href={a.url} target="_blank">
                {a.name}
              </LinkTextButton>
            </div>
          ))}
        </DetailCategory>

        {/* Latest Version */}
        <DetailCategory icon={MilestoneIcon}>
          {projectInfo.latest_version}
        </DetailCategory>

        {/* Tags */}
        <div>
          <DetailCategory icon={Tags} className="mb-2">Tags</DetailCategory>
          <div className="flex flex-wrap gap-1 ml-5">
            {platformProject.categories.map((tag) => (
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
            Licenses
          </DetailCategory>
          <div className="space-y-2 text-sm ml-6">
            <div>
              <span className="font-medium">Project:</span>{' '}
                <Button variant="link" className="h-auto p-0" asChild>
                  <a href={platformProject?.license?.url ?? `https://spdx.org/licenses/${projectInfo.license.name}`} target="_blank" rel="noopener noreferrer">
                    {projectInfo.license.name}
                  </a>
                </Button>
            </div>
            <div>
              <span className="font-medium">Wiki:</span>{' '}
              <Button variant="link" className="h-auto p-0" asChild>
                <a href={DEFAULT_WIKI_LICENSE.url} target="_blank" rel="noopener noreferrer">
                  {DEFAULT_WIKI_LICENSE.name}
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div>
          <DetailCategory icon={Globe} className="mb-2">
            Links
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

