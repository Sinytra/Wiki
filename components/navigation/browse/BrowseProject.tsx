import platforms, {PlatformProject} from "@/lib/platforms";
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
import CommunityDocsBadge from "@/components/docs/CommunityDocsBadge";
import {BaseProject} from "@/lib/service";
import ModVersionRange from "@/components/docs/ModVersionRange";
import Image from "next/image";
import {getTranslations} from "next-intl/server";
import {resolveSoft, trimText} from "@/lib/utils";

function ProjectIcon({project}: { project: Promise<PlatformProject> }) {
  const projectContent = use(project);
  return (
      <div className="shrink-0">
        <Image className="rounded-sm w-16 h-16 sm:w-20 sm:h-20"
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
    <span className="text-sm text-secondary font-normal line-clamp-2 sm:line-clamp-none h-10 sm:h-auto sm:min-h-5">
      {trimText(projectContent.summary, 100)}
    </span>
  )
}

function ProjectIconPlaceholder() {
  return (
      <div className="shrink-0 flex w-16 h-16 sm:w-20 sm:h-20 border border-tertiary rounded-xs">
        <BoxIcon strokeWidth={1} className="m-auto text-secondary opacity-20" width={56} height={56}/>
      </div>
  )
}

async function GitHubProjectLink({url}: { url: string }) {
  return (
      <Button variant="ghost" size="icon" className="size-8" asChild>
        <Link href={url} target="_blank">
          <GitHubIcon className="size-5" />
        </Link>
      </Button>
  )
}

function ProjectSourceUrl({project}: { project: Promise<PlatformProject | null> }) {
  const projectContent = use(project);
  return projectContent && projectContent.source_url && <GitHubProjectLink url={projectContent.source_url}/>;
}

async function ProjectGameVersions({project}: { project: Promise<PlatformProject | null> }) {
  const projectContent = await project;
  const t = await getTranslations('DocsProjectInfo.latest');

  return !projectContent || projectContent.game_versions.length === 0
    ? <span className="text-sm">{t('unknown')}</span>
    : <ModVersionRange versions={projectContent.game_versions} />;
}

async function ProjectMetaInfo({base, project}: { base: BaseProject, project: Promise<PlatformProject> }) {
  const promise = resolveSoft(project);
  const u = await getTranslations('ProjectTypes');
  const TypeIcon = ProjectTypeIcons[base.type];

  const cfLink = base.platforms.curseforge ? await platforms.getProjectURL('curseforge', base.platforms.curseforge) : null;
  const mrLink = base.platforms.modrinth ? await platforms.getProjectURL('modrinth', base.platforms.modrinth) : null;

  return (
      <div className="flex flex-wrap sm:flex-nowrap sm:shrink-0 w-full justify-between items-center mt-auto
                      gap-2 text-secondary h-5.5 sm:h-auto"
      >
        <ErrorBoundary fallback={<span></span>}>
          <div className="flex flex-row items-center gap-3">
            <div className="flex flex-row items-center gap-2 text-secondary">
              <TypeIcon className="size-4"/>
              <span className="text-sm">{u(base.type)}</span>
            </div>
            <div className="flex flex-row items-center gap-2 text-secondary">
              <MilestoneIcon className="size-4"/>
              <Suspense>
                <ProjectGameVersions project={promise} />
              </Suspense>
            </div>
          </div>
        </ErrorBoundary>

        <div className="sm:shrink-0 gap-1 sm:gap-2 hidden sm:flex">
          <Suspense>
            <ProjectSourceUrl project={promise} />
          </Suspense>
          {cfLink &&
              <Button asChild variant="ghost" size="icon"
                      className="hover:text-brand-curseforge size-8">
                  <NavLink href={cfLink} target="_blank">
                      <CurseForgeIcon className="w-5 h-5"/>
                  </NavLink>
              </Button>
          }
          {mrLink &&
              <Button asChild variant="ghost" size="icon"
                      className="hover:text-brand-modrinth size-8">
                  <NavLink href={mrLink} target="_blank">
                      <ModrinthIcon className="w-5 h-5"/>
                  </NavLink>
              </Button>
          }
        </div>
      </div>
  )
}

export default function BrowseProject({project}: { project: BaseProject }) {
  const platformProject = platforms.getPlatformProject(project);

  return (
      <div className="flex flex-row items-center border border-tertiary bg-primary-dim rounded-sm w-full px-3 py-2 sm:py-3 gap-3 sm:gap-4">
        <ErrorBoundary fallback={<ProjectIconPlaceholder/>}>
          <Suspense fallback={<ProjectIconPlaceholder/>}>
            <ProjectIcon project={platformProject}/>
          </Suspense>
        </ErrorBoundary>

        <div className="flex flex-col gap-1 w-full">
          <div className="w-full h-full flex flex-col">
            <div className="w-full inline-flex gap-2">
              <LinkTextButton href={`/project/${project.id}`} className="[&_]:text-lg w-fit! text-base! font-normal! sm:shrink-0 text-primary">
                {project.name}
              </LinkTextButton>

              {project.is_community && <CommunityDocsBadge small/>}
            </div>

            <ErrorBoundary fallback={
              <span className="h-10 sm:h-5">
                &nbsp;
              </span>
            }>
              <Suspense fallback={
                <Skeleton className="w-full h-10 sm:h-5"/>
              }>
                <ProjectDescription project={platformProject}/>
              </Suspense>
            </ErrorBoundary>
          </div>

          <ProjectMetaInfo base={project} project={platformProject}/>
        </div>
      </div>
  )
}