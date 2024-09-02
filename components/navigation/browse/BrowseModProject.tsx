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
import githubApp from "@/lib/github/githubApp";
import {getLatestVersion} from "@/components/docs/mod-info/modInfo";
import {NavLink} from "@/components/navigation/link/NavLink";

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

async function GitHubProjectLink({ repo }: { repo: string }) {
  const isPublic = await githubApp.isRepositoryPublic(repo);

  return (
    <Suspense>
      {isPublic && <Button variant="outline" size="icon">
        <GitHubIcon width={24} height={24}/>
      </Button>}
    </Suspense>
  )
}

function ProjectMetaInfo({project}: { project: Promise<ModProject> }) {
  const projectContent = use(project);
  return (
    <div>
      <div className="flex flex-row items-center gap-2 text-muted-foreground">
        <MilestoneIcon className="w-4 h-4" />
        <span className="text-sm">{getLatestVersion(projectContent)}</span>
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

      <div className="w-full h-full flex flex-col gap-1.5">
        <LinkTextButton href={`/mod/${mod.id}`}
                        className="!w-fit !font-normal flex-shrink-0 text-xl text-foreground">{mod.name}</LinkTextButton>

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
        
        <ErrorBoundary fallback={<span></span>}>
          <Suspense>
            <ProjectMetaInfo project={project} />
          </Suspense>
        </ErrorBoundary>
      </div>

      <div className="flex flex-shrink-0 justify-end items-end mt-auto ml-auto w-24 gap-2 text-muted-foreground">
        <GitHubProjectLink repo={mod.source_repo} />
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
  )
}