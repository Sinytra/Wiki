import {CopyrightIcon as License, Globe, MilestoneIcon, Tags, User} from 'lucide-react'
import GitHubIcon from "@/components/ui/icons/GitHubIcon";
import {Project} from "@/lib/service";
import platforms, {PlatformProject} from "@/lib/platforms";
import ImageWithFallback from "@/components/util/ImageWithFallback";
import {ProjectDisplayInformation, ProjectTypeIcons} from "@/components/docs/project-info/projectInfo";
import LinkTextButton from "@/components/ui/link-text-button";
import {useTranslations} from "next-intl";
import {cn} from "@/lib/utils";
import {DEFAULT_WIKI_LICENSE} from "@/lib/constants";
import CurseForgeIcon from "@/components/ui/icons/CurseForgeIcon";
import ModrinthIcon from "@/components/ui/icons/ModrinthIcon";
import DocsSidebarBase from "@/components/docs/new/DocsSidebarBase";

interface RightSidebarProps {
  project: Project;
  platformProject: PlatformProject;
  projectInfo: ProjectDisplayInformation;
  isOpen: boolean;
}

function DetailCategory({icon: Icon, className, innerClass, children}: {
  icon: any;
  className?: string;
  innerClass?: string;
  children?: any
}) {
  return (
    <div className={cn("flex items-center space-x-2 text-muted-foreground", className)}>
      <Icon className="w-4 h-4"/>
      <div className={innerClass}>
        {children}
      </div>
    </div>
  );
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
    <DocsSidebarBase title="Project Information" className={`
      ${isOpen ? '' : 'translate-x-full'}
      ${isOpen ? 'w-64' : 'w-0 lg:w-64'}`}
    >
      {/* Project Icon & Name */}
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
          <ImageWithFallback src={platformProject.icon_url} width={48} height={48} fbWidth={24} fbHeight={24}
                             className="!opacity-100 !text-secondary-foreground" alt="Logo"
                             strokeWidth={2}/>
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
      <div className="space-y-3 text-sm">
        {/* Project Type */}
        <div className="flex items-center space-x-2 text-muted-foreground">
          <TypeIcon className="w-4 h-4"/>
          <span>
              {types(project.type)}
            </span>
        </div>

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

        {/* Licenses */}
        <div>
          <DetailCategory icon={License} className="mb-2">Licenses</DetailCategory>
          <div className="flex flex-col gap-2 text-muted-foreground ml-5">
            <div>Project: {platformProject?.license?.url
              ?
              <LinkTextButton className="!font-normal !text-muted-foreground"
                              href={platformProject.license.url}>
                {projectInfo.license.name}
              </LinkTextButton>
              : projectInfo.license.name
            }</div>
            <div>
              Wiki: <LinkTextButton className="!font-normal !text-muted-foreground"
                                    href={DEFAULT_WIKI_LICENSE.url}>
              {DEFAULT_WIKI_LICENSE.name}
            </LinkTextButton>
            </div>
          </div>
        </div>

        {/* Links */}
        <div>
          <DetailCategory icon={Globe} className="mb-2">Links</DetailCategory>
          <div className="flex flex-col gap-1 ml-5">
            {project.platforms.curseforge &&
              <LinkTextButton href={platforms.getProjectURL('curseforge', project.platforms.curseforge)}
                              className="!justify-start items-center gap-2 !font-normal !text-muted-foreground mb-1">
                  <CurseForgeIcon className="w-4 h-4"/>
                  <span>CurseForge</span>
              </LinkTextButton>
            }
            {project.platforms.modrinth &&
              <LinkTextButton href={platforms.getProjectURL('modrinth', project.platforms.modrinth)}
                              className="!justify-start items-center gap-2 !font-normal !text-muted-foreground mb-1">
                  <ModrinthIcon className="w-4 h-4"/>
                  <span>Modrinth</span>
              </LinkTextButton>
            }
            {platformProject.source_url &&
              <LinkTextButton href={platformProject.source_url}
                              className="!justify-start items-center gap-2 !font-normal !text-muted-foreground mb-1">
                  <GitHubIcon className="w-4 h-4"/>
                  <span>GitHub Repository</span>
              </LinkTextButton>
            }
          </div>
        </div>
      </div>
    </DocsSidebarBase>
  )
}

