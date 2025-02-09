import {setContextLocale} from "@/lib/locales/routing";
import service from "@/lib/service";
import {redirect} from "next/navigation";
import platforms from "@/lib/platforms";
import {getPlatformProjectInformation} from "@/lib/docs/projectInfo";
import MarkdownContent from "@/components/docs/body/MarkdownContent";
import {BookMarkedIcon, BookOpenIcon, BoxIcon, CodeIcon, GlobeIcon, HammerIcon, LinkIcon, MapIcon} from "lucide-react";
import ExpandableDescription from "@/components/docs/layout/ExpandableDescription";
import CurseForgeColorIcon from "@/components/ui/icons/CurseForgeColorIcon";
import ModrinthIcon from "@/components/ui/icons/ModrinthIcon";
import GitHubIcon from "@/components/ui/icons/GitHubIcon";
import {cn} from "@/lib/utils";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import PageLink from "@/components/docs/PageLink";

interface PageProps {
  params: {
    slug: string;
    version: string;
    locale: string;
  };
}

function Section({title, icon: Icon, children, className}: {
  title: string,
  icon: any;
  children?: any;
  className?: string
}) {
  return (
    <div className="flex flex-col gap-4 mb-2">
      <h2 className="text-xl flex flex-row items-center gap-2 border-b border-secondary pb-2">
        <Icon className="w-5 h-5"/>
        {title}
      </h2>
      <div className={className}>
        {children}
      </div>
    </div>
  )
}

function SubpageLink({title, icon: Icon, desc, href}: { title: string; icon: any; desc: string; href: string }) {
  return (
    <a href={`latest/${href}`}>
      <div
        className="w-fit min-w-[17rem] p-3 rounded-sm border bg-primary-alt/50 border-secondary/50 hover:bg-secondary/20 flex flex-col gap-2">
        <div className="flex flex-row items-center gap-3 text-lg">
          <Icon className="w-5 h-5"/>
          {title}
        </div>
        <span className="text-sm text-secondary">
          {desc}
        </span>
      </div>
    </a>
  );
}

function ExternalLink({text, icon: Icon, href, className}: {
  text: string;
  icon: any;
  href: string;
  className?: string;
}) {
  return (
    <a href={href} target="_blank">
      <div
        className={cn('cursor-pointer w-36 p-3 flex flex-row justify-center items-center gap-2 rounded-sm border bg-gradient-to-b hover:to-60%', className)}>
        <Icon className="w-5 h-5"/>
        {text}
      </div>
    </a>
  );
}

function AvailableVersions({versions}: { versions: string[] }) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger className="underline decoration-1 decoration-neutral-500 decoration-dashed underline-offset-4">
          {versions.length} game versions
        </TooltipTrigger>
        <TooltipContent className="px-3 py-1.5 text-sm w-fit max-h-56 max-w-32 overflow-y-auto slim-scrollbar"
                        side="bottom">
          <ul>
            {...versions.reverse().slice(1).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default async function ProjectHomePage({params}: PageProps) {
  setContextLocale(params.locale);

  const projectData = await service.getBackendLayout(params.slug, params.version, params.locale);
  if (!projectData) {
    return redirect('/');
  }
  const {project} = projectData;

  const platformProject = await platforms.getPlatformProject(project);
  const info = await getPlatformProjectInformation(platformProject); // TODO Suspense?
  const pageCount = 125; // TODO
  const contentCount = 42; // TODO
  const website = 'https://example.com'; // TODO

  return (
    <div className="max-w-5xl w-full mx-auto flex flex-col gap-6 mt-1 mb-5">
      <div className="flex flex-row gap-4 border-b border-secondary pb-2">
        <div className="flex justify-center items-center">
          <img src={platformProject.icon_url} alt="Icon" className="w-14 h-14 rounded-sm flex-shrink-0"/>
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-primary text-2xl">
            {project.name}
          </h1>
          <blockquote className="text-secondary">
            {platformProject.summary}
          </blockquote>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <span className="font-medium">{project.name}</span> is a {project.type} created by {...info.authors.map(a => (
          <div key={a.name} className="inline-block">
            <PageLink href={a.url} target="_blank">
              {a.name}
            </PageLink>
          </div>
        ))}.
        </div>

        <div>
          Available for <AvailableVersions versions={platformProject.game_versions}/>. Latest version built for <span
          className="font-medium">
          {info.latest_version}</span>. First released for <span className="font-medium">{platformProject.game_versions[0]}</span>.
        </div>
      </div>

      <Section title="Description" icon={BookOpenIcon}>
        <ExpandableDescription>
          <MarkdownContent content={platformProject.description}/>
        </ExpandableDescription>
      </Section>

      <Section title="Navigation" icon={MapIcon} className="flex flex-row flex-wrap gap-4">
        <SubpageLink title="Browse documentation" icon={BookMarkedIcon} desc={`${pageCount} pages available.`}
                     href="docs"/>
        <SubpageLink title="Browse content" icon={BoxIcon} desc={`${contentCount} in-game items.`}
                     href="content"/>
        <SubpageLink title="Developer information" icon={HammerIcon} desc="Maven and in-game IDs" href="../devs"/>
      </Section>

      <Section title="Links" icon={LinkIcon} className="flex flex-row gap-2">
        {website &&
          <ExternalLink text="Website" icon={GlobeIcon}
                        href={website}
                        className="border-primary from-primary to-neutral-800"/>
        }
        {project.platforms.curseforge &&
          <ExternalLink text="CurseForge" icon={CurseForgeColorIcon}
                        href={platforms.getProjectURL('curseforge', project.platforms.curseforge)}
                        className="border-brand-curseforge/40 from-primary to-brand-curseforge/20"/>
        }
        {project.platforms.modrinth &&
          <ExternalLink text="Modrinth" icon={ModrinthIcon}
                        href={platforms.getProjectURL('modrinth', project.platforms.modrinth)}
                        className="[&>svg]:text-brand-modrinth border-brand-modrinth/40
                                   from-primary to-brand-modrinth/20"
          />
        }
        {project.is_public && project.source_repo && (project.source_repo?.startsWith("https://github.com/")
          ?
          <ExternalLink text="GitHub" icon={GitHubIcon}
                        href={project.source_repo}
                        className="border-primary from-primary to-black/20"
          />
          :
          <ExternalLink text="Source code" icon={CodeIcon}
                        href={project.source_repo}
                        className="border-primary from-primary to-primary-alt"
          />)
        }
      </Section>

      <Section title="In-game content" icon={BoxIcon}>

      </Section>

      {/* Related projects / custom sections? */}
    </div>
  )
}