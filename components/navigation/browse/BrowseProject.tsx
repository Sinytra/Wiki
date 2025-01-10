import {PlatformProject} from "@/lib/platforms";
import {Suspense, use} from "react";
import {BoxIcon, MilestoneIcon} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";
import ModrinthIcon from "@/components/ui/icons/ModrinthIcon";
import CurseForgeIcon from "@/components/ui/icons/CurseForgeIcon";
import {Button} from "@/components/ui/button";
import GitHubIcon from "@/components/ui/icons/GitHubIcon";
import LinkTextButton from "@/components/ui/link-text-button";
import {ErrorBoundary} from "react-error-boundary";
import {ProjectTypeIcons} from "@/lib/docs/projectInfo";
import {NavLink} from "@/components/navigation/link/NavLink";
import Link from "next/link";
import {useTranslations} from "next-intl";
import CommunityDocsBadge from "@/components/docs/CommunityDocsBadge";
import platforms from "@/lib/platforms";
import {BaseProject} from "@/lib/service";
import ModVersionRange from "@/components/docs/ModVersionRange";
import Image from "next/image";

function ProjectIcon({project}: { project: Promise<PlatformProject> }) {
  const projectContent = use(project);
  return (
      <div className="flex-shrink-0">
        <Image className="rounded-sm border border-accent w-16 h-16 sm:w-20 sm:h-20"
               src={projectContent.icon_url}
               alt="icon"
               width={64}
               height={64}
               unoptimized
               priority
        />
      </div>
  )
}

function ProjectDescription({project}: { project: Promise<PlatformProject> }) {
  const projectContent = use(project);
  return (
      <span className="text-sm text-muted-foreground font-normal line-clamp-2">
      {projectContent.summary}
    </span>
  )
}

function ProjectIconPlaceholder() {
  return (
      <div className="flex-shrink-0 flex w-[80px] h-[80px] border border-accent rounded-sm">
        <BoxIcon strokeWidth={1} className="m-auto text-muted-foreground opacity-20" width={56} height={56}/>
      </div>
  )
}

async function GitHubProjectLink({url}: { url: string }) {
  return (
      <Button variant="outline" size="icon" className="w-8 h-8 sm:w-10 sm:h-10" asChild>
        <Link href={url} target="_blank">
          <GitHubIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </Link>
      </Button>
  )
}

function ProjectMetaInfo({base, project}: { base: BaseProject, project: Promise<PlatformProject> }) {
  const projectContent = use(project);
  const t = useTranslations('DocsProjectInfo.latest');
  const u = useTranslations('ProjectTypes');
  const TypeIcon = ProjectTypeIcons[projectContent.type];

  return (
      <div className="flex flex-wrap sm:flex-nowrap sm:flex-shrink-0 w-full justify-between items-center mt-auto gap-2 text-muted-foreground">
        <ErrorBoundary fallback={<span></span>}>
          <div className="flex flex-row items-center gap-3">
            <div className="flex flex-row items-center gap-2 text-muted-foreground">
              <TypeIcon className="w-4 h-4 sm:w-5 sm:h-5"/>
              <span className="text-sm sm:text-base">{u(projectContent.type)}</span>
            </div>
            <div className="flex flex-row items-center gap-2 text-muted-foreground">
              <MilestoneIcon className="w-4 h-4 sm:w-5 sm:h-5"/>
              {projectContent.game_versions.length === 0
                ? <span className="text-sm sm:text-base">{t('unknown')}</span>
                : <ModVersionRange versions={projectContent.game_versions} />
              }
            </div>
          </div>
        </ErrorBoundary>

        <div className="sm:flex-shrink-0 gap-1 sm:gap-2 hidden sm:flex">
          {projectContent.source_url && <GitHubProjectLink url={projectContent.source_url}/>}
          {base.platforms.curseforge &&
              <Button asChild variant="outline" size="icon"
                      className="hover:text-[var(--curseforge-brand)] w-8 h-8 sm:w-10 sm:h-10">
                  <NavLink href={platforms.getProjectURL('curseforge', base.platforms.curseforge)} target="_blank">
                      <CurseForgeIcon className="w-5 h-5 sm:w-6 sm:h-6"/>
                  </NavLink>
              </Button>
          }
          {base.platforms.modrinth &&
              <Button asChild variant="outline" size="icon"
                      className="hover:text-[var(--modrinth-brand)] w-8 h-8 sm:w-10 sm:h-10">
                  <NavLink href={platforms.getProjectURL('modrinth', base.platforms.modrinth)} target="_blank">
                      <ModrinthIcon className="w-5 h-5 sm:w-6 sm:h-6"/>
                  </NavLink>
              </Button>
          }
        </div>
      </div>
  )
}

export default async function BrowseProject({project}: { project: BaseProject }) {
  const platformProject = platforms.getPlatformProject(project);

  return (
      <div className="flex flex-row items-center border border-neutral-600 rounded-sm w-full px-3 py-2 sm:py-3 gap-3 sm:gap-4">
        <ErrorBoundary fallback={<ProjectIconPlaceholder/>}>
          <Suspense fallback={<ProjectIconPlaceholder/>}>
            <ProjectIcon project={platformProject}/>
          </Suspense>
        </ErrorBoundary>

        <div className="flex flex-col gap-2 sm:gap-1 w-full">
          <div className="w-full h-full flex flex-col gap-1.5">
            <div className="w-full inline-flex gap-2">
              <LinkTextButton href={`/project/${project.id}`}
                              className="!w-fit !font-normal sm:flex-shrink-0 text-lg sm:text-xl text-foreground">
                {project.name}
              </LinkTextButton>

              {project.is_community && <CommunityDocsBadge small/>}
            </div>

            <ErrorBoundary fallback={<span></span>}>
              <Suspense fallback={
                <>
                  <Skeleton className="w-full h-6"/>
                </>
              }>
                <ProjectDescription project={platformProject}/>
              </Suspense>
            </ErrorBoundary>
          </div>

          <Suspense fallback={
            <div className="h-8 mt-1">
              <Skeleton className="w-full h-5"/>
            </div>
          }>
            <ProjectMetaInfo base={project} project={platformProject}/>
          </Suspense>
        </div>
      </div>
  )
}