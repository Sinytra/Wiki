import {setContextLocale} from "@/lib/locales/routing";
import service from "@/lib/service";
import {redirect} from "next/navigation";
import platforms, {PlatformProject} from "@/lib/platforms";
import {ARRNoLicense, getPlatformProjectInformation, ProjectCategories} from "@/lib/docs/projectInfo";
import MarkdownContent from "@/components/docs/body/MarkdownContent";
import {
  BookMarkedIcon,
  BookOpenIcon,
  BookOpenTextIcon,
  BoxIcon,
  CodeIcon,
  CopyrightIcon,
  GlobeIcon,
  HelpCircleIcon,
  LinkIcon,
  MapIcon,
  PencilRulerIcon,
  ScaleIcon,
  TagIcon
} from "lucide-react";
import ExpandableDescription from "@/components/docs/layout/ExpandableDescription";
import CurseForgeColorIcon from "@/components/ui/icons/CurseForgeColorIcon";
import ModrinthIcon from "@/components/ui/icons/ModrinthIcon";
import GitHubIcon from "@/components/ui/icons/GitHubIcon";
import {cn} from "@/lib/utils";
import PageLink from "@/components/docs/PageLink";
import DiscordIcon from "@/components/ui/icons/DiscordIcon";
import {useTranslations} from "next-intl";
import {DEFAULT_WIKI_LICENSE} from "@/lib/constants";
import TooltipText from "@/components/docs/shared/util/TooltipText";

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
    <TooltipText tooltip={
      <ul>
        {...versions.reverse().slice(1).map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    }>
      {versions.length} game versions
    </TooltipText>
  )
}

function ProjectTags({project}: { project: PlatformProject }) {
  const categories = useTranslations('ProjectCategories');

  return (
    <div className="space-x-2">
      {project.categories.filter(t => ProjectCategories[t] !== undefined).map((tag) => (
        <span
          key={tag}
          className="px-2 py-1 text-xs bg-secondary text-secondary-alt rounded-md"
        >
          {categories(tag as any)}
        </span>
      ))}
    </div>
  )
}

function LicenseBadge({name, icon: Icon, children}: { name: string; icon: any; children?: any }) {
  return (
    <div className="flex flex-col border border-secondary/50 rounded-sm bg-primary-dim gap-2 p-4 min-w-72 max-w-84">
      <div className="font-medium text-base flex flex-row items-center gap-3">
        <Icon className="size-5 shrink-0"/>
        <span>{name}</span>
      </div>

      <hr className="mb-1"/>

      {children}
    </div>
  )
}

export default async function ProjectHomePage({params}: PageProps) {
  setContextLocale(params.locale);

  const project = await service.getProject(params.slug, null);
  if (!project) {
    return redirect('/');
  }

  const platformProject = await platforms.getPlatformProject(project);
  const info = await getPlatformProjectInformation(platformProject); // TODO Suspense?

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

        {/*TODO Expand*/}
        <div>
          Available for <AvailableVersions versions={platformProject.game_versions}/>. Latest version built for <span
          className="font-medium">
          {info.latest_version}</span>. First released for <span
          className="font-medium">{platformProject.game_versions[0]}</span>.
        </div>

        <div className="flex flex-row gap-2 text-secondary text-sm">
          <span>
            <TagIcon className="w-4 h-4 inline-block mr-2"/>
            Tagged:
          </span>
          <ProjectTags project={platformProject}/>
        </div>
      </div>

      <Section title="Description" icon={BookOpenIcon}>
        <ExpandableDescription>
          <MarkdownContent content={platformProject.description}/>
        </ExpandableDescription>
      </Section>

      <Section title="Navigation" icon={MapIcon} className="flex flex-row flex-wrap gap-4">
        {project.info.pageCount > 0 &&
          <SubpageLink title="Browse documentation" icon={BookMarkedIcon}
                       desc={`${project.info.pageCount} pages available.`}
                       href="docs"/>
        }
        {project.info.contentCount > 0 &&
          <SubpageLink title="Browse content" icon={BoxIcon} desc={`${project.info.contentCount} in-game items.`}
                       href="content"/>
        }
        {/*<SubpageLink title="Developer information" icon={HammerIcon} desc="Maven and in-game IDs" href="../devs"/>*/}
      </Section>

      <Section title="Links" icon={LinkIcon} className="flex flex-row gap-2">
        {project.info.website &&
          <ExternalLink text="Website" icon={GlobeIcon}
                        href={project.info.website}
                        className="border-primary from-primary to-neutral-800"/>
        }
        {project.platforms.curseforge &&
          <ExternalLink text="CurseForge" icon={CurseForgeColorIcon}
                        href={await platforms.getProjectURL('curseforge', project.platforms.curseforge)}
                        className="border-brand-curseforge/40 from-primary to-brand-curseforge/20"/>
        }
        {project.platforms.modrinth &&
          <ExternalLink text="Modrinth" icon={ModrinthIcon}
                        href={await platforms.getProjectURL('modrinth', project.platforms.modrinth)}
                        className="[&>svg]:text-brand-modrinth border-brand-modrinth/40
                                   from-primary to-brand-modrinth/20"
          />
        }
        {platformProject.discord_url &&
          <ExternalLink text="Discord" icon={DiscordIcon}
                        href={platformProject.discord_url}
                        className="[&>svg]:text-brand-discord border-brand-discord/70
                                   from-primary to-brand-discord/20"
          />
        }
        {platformProject.source_url && (platformProject.source_url.startsWith("https://github.com/")
          ?
          <ExternalLink text="GitHub" icon={GitHubIcon}
                        href={platformProject.source_url}
                        className="border-primary from-primary to-black/20"
          />
          :
          <ExternalLink text="Source code" icon={CodeIcon}
                        href={platformProject.source_url}
                        className="border-primary from-primary to-primary-alt"
          />)
        }
      </Section>

      {/*<Section title="In-game content" icon={BoxIcon}>*/}
      {/*</Section>*/}

      {/* Related projects / custom sections? */}

      <Section title="Licenses" icon={ScaleIcon} className="flex flex-row flex-wrap gap-4">
        <LicenseBadge name="Project License" icon={PencilRulerIcon}>
          {platformProject.license ? (
              platformProject.license.id == ARRNoLicense
                ?
                <div className="m-auto flex flex-row gap-2 items-center">
                  <CopyrightIcon className="w-4 mb-0.5"/>
                  <PageLink href="https://choosealicense.com/no-permission" target="_blank">
                    All Rights Reserved
                  </PageLink>
                </div>
                :
                <div className="m-auto flex flex-row gap-2 items-center">
                  <PageLink href={info.license?.url} className="text-center" target="_blank">
                    {info.license?.name}
                  </PageLink>
                </div>
            ) :
            <p className="text-secondary m-auto flex flex-row gap-2 items-center">
              <HelpCircleIcon className="size-4"/>
              Unknown
            </p>
          }
        </LicenseBadge>
        <LicenseBadge name="Wiki License" icon={BookOpenTextIcon}>
          <span className="text-base text-center">
            Wiki content <PageLink href="/about/tos#copyright-policy" className="!text-base"
                                   target="_blank">partially made available</PageLink> under the <PageLink
            className="!text-base" href={DEFAULT_WIKI_LICENSE.url} target="_blank">
            {DEFAULT_WIKI_LICENSE.name}
            </PageLink> license.
          </span>
        </LicenseBadge>
      </Section>
    </div>
  )
}