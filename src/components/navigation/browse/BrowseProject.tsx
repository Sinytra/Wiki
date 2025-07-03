import platforms, {PlatformProject} from "@repo/platforms";
import {Suspense, use} from "react";
import {BoxIcon, MilestoneIcon} from "lucide-react";
import {Skeleton} from "@repo/ui/components/skeleton";
import ModrinthIcon from "@repo/ui/icons/ModrinthIcon";
import CurseForgeIcon from "@repo/ui/icons/CurseForgeIcon";
import {Button} from "@repo/ui/components/button";
import GitHubIcon from "@repo/ui/icons/GitHubIcon";
import LinkTextButton from "@/components/util/LinkTextButton";
import {ErrorBoundary} from "react-error-boundary";
import {ProjectTypeIcons} from "@/lib/docs/projectInfo";
import {NavLink} from "@/components/navigation/link/NavLink";
import Link from "next/link";
import CommunityDocsBadge from "@/components/docs/CommunityDocsBadge";
import ModVersionRange from "@/components/docs/ModVersionRange";
import {getTranslations} from "next-intl/server";
import {resolveSoft, trimText} from "@/lib/utils";
import {BaseProject} from "@repo/shared/types/service";
import SafeImage from "@/components/util/SafeImage";

function ProjectIcon({project}: { project: Promise<PlatformProject> }) {
  const projectContent = use(project);
  return (
    <div className="shrink-0">
      <SafeImage
        className="h-16 w-16 rounded-sm sm:h-20 sm:w-20"
        src={projectContent.icon_url}
        alt={projectContent.name}
        width={64}
        height={64}
        fallback={<ProjectIconPlaceholder />}
      />
    </div>
  )
}

function ProjectDescription({project}: { project: Promise<PlatformProject> }) {
  const projectContent = use(project);
  return (
    <span className="line-clamp-2 h-10 text-sm font-normal text-secondary sm:line-clamp-none sm:h-auto sm:min-h-5">
      {trimText(projectContent.summary, 100)}
    </span>
  )
}

function ProjectIconPlaceholder() {
  return (
    <div className="flex h-16 w-16 shrink-0 rounded-xs border border-tertiary sm:h-20 sm:w-20">
      <BoxIcon strokeWidth={1} className="m-auto text-secondary opacity-20" width={56} height={56}/>
    </div>
  )
}

async function GitHubProjectLink({url}: { url: string }) {
  return (
    <Button variant="ghost" size="icon" className="size-8" asChild>
      <Link href={url} target="_blank">
        <GitHubIcon className="size-5"/>
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
    : <ModVersionRange versions={projectContent.game_versions}/>;
}

async function ProjectMetaInfo({base, project}: { base: BaseProject, project: Promise<PlatformProject> }) {
  const promise = resolveSoft(project);
  const u = await getTranslations('ProjectTypes');
  const TypeIcon = ProjectTypeIcons[base.type];

  const cfLink = base.platforms.curseforge ? platforms.getProjectURL('curseforge', base.platforms.curseforge, base.type) : null;
  const mrLink = base.platforms.modrinth ? platforms.getProjectURL('modrinth', base.platforms.modrinth, base.type) : null;

  return (
    <div className={`
      mt-auto flex h-5.5 w-full flex-wrap items-center justify-between gap-2 text-secondary sm:h-auto sm:shrink-0
      sm:flex-nowrap
    `}
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
              <ProjectGameVersions project={promise}/>
            </Suspense>
          </div>
        </div>
      </ErrorBoundary>

      <div className="hidden gap-1 sm:flex sm:shrink-0 sm:gap-2">
        <Suspense>
          <ProjectSourceUrl project={promise}/>
        </Suspense>
        {cfLink &&
          <Button asChild variant="ghost" size="icon"
                  className="size-8 hover:text-brand-curseforge">
              <NavLink href={cfLink} target="_blank">
                  <CurseForgeIcon className="h-5 w-5"/>
              </NavLink>
          </Button>
        }
        {mrLink &&
          <Button asChild variant="ghost" size="icon"
                  className="size-8 hover:text-brand-modrinth">
              <NavLink href={mrLink} target="_blank">
                  <ModrinthIcon className="h-5 w-5"/>
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
    <div className={`
      flex w-full flex-row items-center gap-3 rounded-sm border border-tertiary bg-primary-dim px-3 py-2 sm:gap-4
      sm:py-3
    `}>
      <ProjectIcon project={platformProject}/>

      <div className="flex w-full flex-col gap-1">
        <div className="flex h-full w-full flex-col">
          <div className="inline-flex w-full gap-2">
            <LinkTextButton href={`/project/${project.id}`} className={`
              w-fit! text-base! font-normal! text-primary sm:shrink-0 [&_]:text-lg
            `}>
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
              <Skeleton className="h-10 w-full sm:h-5"/>
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