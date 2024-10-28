import platforms, {ModPlatform, ModProject} from "@/lib/platforms";
import {Suspense, use} from "react";
import {PartialMod} from "@/lib/types/search";
import {BoxIcon, MilestoneIcon} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";
import ModrinthIcon from "@/components/ui/icons/ModrinthIcon";
import CurseForgeIcon from "@/components/ui/icons/CurseForgeIcon";
import {Button} from "@/components/ui/button";
import GitHubIcon from "@/components/ui/icons/GitHubIcon";
import LinkTextButton from "@/components/ui/link-text-button";
import {ErrorBoundary} from "react-error-boundary";
import {getLatestVersion} from "@/components/docs/mod-info/modInfo";
import {NavLink} from "@/components/navigation/link/NavLink";
import Link from "next/link";
import {useTranslations} from "next-intl";
import CommunityDocsBadge from "@/components/docs/CommunityDocsBadge";
import githubFacade from "@/lib/facade/githubFacade";

function ProjectIcon({project}: { project: Promise<ModProject> }) {
  const projectContent = use(project);
  return (
    <div className="flex-shrink-0">
      <img className="rounded-sm border border-accent" src={projectContent.icon_url} alt="icon" width={80} height={80}/>
    </div>
  )
}

function ProjectDescription({project}: { project: Promise<ModProject> }) {
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

async function GitHubProjectLink({repo}: { repo: string }) {
  const isPublic = await githubFacade.isRepositoryPublic(repo);

  return (
    <Suspense>
      {isPublic && 
          <Button variant="outline" size="icon" asChild>
              <Link href={`https://github.com/${repo}`} target="_blank">
                  <GitHubIcon width={24} height={24}/>
              </Link>
          </Button>
      }
    </Suspense>
  )
}

function ProjectMetaInfo({project}: { project: Promise<ModProject> }) {
  const projectContent = use(project);
  const t = useTranslations('DocsModInfo.latest');
  return (
    <div>
      <div className="flex flex-row items-center gap-2 text-muted-foreground">
        <MilestoneIcon className="w-5 h-5"/>
        <span className="text-base">{getLatestVersion(projectContent) || t('unknown')}</span>
      </div>
    </div>
  )
}

export default async function BrowseModProject({mod}: { mod: PartialMod }) {
  const project = platforms.getPlatformProject(mod.platform as ModPlatform, mod.slug);

  return (
    <div className="flex flex-row items-center border border-neutral-600 rounded-sm w-full p-3 gap-4">
      <ErrorBoundary fallback={<ProjectIconPlaceholder/>}>
        <Suspense fallback={<ProjectIconPlaceholder/>}>
          <ProjectIcon project={project}/>
        </Suspense>
      </ErrorBoundary>

      <div className="flex flex-col gap-1 w-full">
        <div className="w-full h-full flex flex-col gap-1.5">
          <div className="w-full inline-flex gap-2">
            <LinkTextButton href={`/mod/${mod.id}`} className="!w-fit !font-normal flex-shrink-0 text-lg sm:text-xl text-foreground">
              {mod.name}
            </LinkTextButton>

            {mod.is_community && <CommunityDocsBadge small />}
          </div>

          <ErrorBoundary fallback={<span></span>}>
            <Suspense fallback={
              <>
                <Skeleton className="w-full h-4"/>
                <Skeleton className="w-full h-4"/>
              </>
            }>
              <ProjectDescription project={project}/>
            </Suspense>
          </ErrorBoundary>
        </div>

        <div className="flex flex-shrink-0 w-full justify-between items-center mt-auto gap-2 text-muted-foreground">
          <ErrorBoundary fallback={<span></span>}>
            <Suspense>
              <ProjectMetaInfo project={project}/>
            </Suspense>
          </ErrorBoundary>

          <div className="flex flex-shrink-0 gap-2">
            <GitHubProjectLink repo={mod.source_repo}/>
            <Button asChild variant="outline" size="icon"
                    className={mod.platform === 'modrinth' ? 'hover:text-[var(--modrinth-brand)]' : 'hover:text-[var(--curseforge-brand)]'}>
              <NavLink href={platforms.getProjectURL(mod.platform as ModPlatform, mod.slug)}>
                {mod.platform === 'modrinth'
                  ? <ModrinthIcon width={24} height={24}/>
                  : <CurseForgeIcon width={24} height={24}/>
                }
              </NavLink>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}