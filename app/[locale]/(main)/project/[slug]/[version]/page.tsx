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
import DocsSubpageTitle from "@/components/docs/layout/DocsSubpageTitle";
import {getTranslations} from "next-intl/server";

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
        className="w-fit min-w-[17rem] p-3 rounded-sm border bg-primary-alt/50 border-secondary-dim hover:bg-secondary/20 flex flex-col gap-2">
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
        className={cn('cursor-pointer w-36 p-2 sm:p-3 flex flex-row justify-center items-center gap-2 rounded-sm border bg-gradient-to-b hover:to-60%', className)}>
        <Icon className="size-4 sm:size-5 shrink-0"/>
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

export default async function ProjectHomepage({params}: PageProps) {
  setContextLocale(params.locale);
  const t = await getTranslations('ProjectHomepage');

  const project = await service.getProject(params.slug, null);
  if (!project) {
    return redirect('/');
  }

  const platformProject = await platforms.getPlatformProject(project);
  const info = await getPlatformProjectInformation(platformProject); // TODO Suspense?

  return (
    <div className="max-w-5xl w-full mx-auto flex flex-col gap-6 mt-1 mb-5">
      <DocsSubpageTitle
        title={project.name}
        description={platformProject.summary}
        icon_url={platformProject.icon_url}
      />

      <div className="flex flex-col gap-4">
        <div>
          {t.rich('overview.intro', {
            project: () => <span className="font-medium">{project.name}</span>,
            type: project.type,
            authors: () => info.authors.map(a => (
              <div key={a.name} className="inline-block">
                <PageLink href={a.url} target="_blank">
                  {a.name}
                </PageLink>
              </div>
            ))
          })}
        </div>

        {/*TODO Expand*/}
        <div>
          {t.rich('overview.availability', {
            versions: () => <AvailableVersions versions={platformProject.game_versions}/>,
            latest: () => <span className="font-medium">{info.latest_version}</span>,
            first: () => <span className="font-medium">{platformProject.game_versions[0]}</span>
          })}
        </div>

        <div className="flex flex-row gap-2 text-secondary text-sm">
          <span>
            <TagIcon className="w-4 h-4 inline-block mr-2"/>
            {t('overview.tags')}
          </span>
          <ProjectTags project={platformProject}/>
        </div>
      </div>

      <Section title={t('description.title')} icon={BookOpenIcon}>
        <ExpandableDescription>
          <MarkdownContent content={platformProject.description}/>
        </ExpandableDescription>
      </Section>

      <Section title={t('navigation.title')} icon={MapIcon} className="flex flex-row flex-wrap gap-4">
        {project.info.pageCount > 0 &&
          <SubpageLink title={t('navigation.docs.title')} icon={BookMarkedIcon}
                       desc={t('navigation.docs.desc', {pages: project.info.pageCount})}
                       href="docs"/>
        }
        {project.info.contentCount > 0 &&
          <SubpageLink title={t('navigation.content.title')} icon={BoxIcon}
                       desc={t('navigation.content.desc', {items: project.info.contentCount})}
                       href="content"/>
        }
        {/*<SubpageLink title="Developer information" icon={HammerIcon} desc="Maven and in-game IDs" href="../devs"/>*/}
      </Section>

      <Section title={t('links.title')} icon={LinkIcon} className="flex flex-row flex-wrap gap-2">
        {project.info.website &&
          <ExternalLink text={t('links.website')} icon={GlobeIcon}
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
          <ExternalLink text={t('links.source_code')} icon={CodeIcon}
                        href={platformProject.source_url}
                        className="border-primary from-primary to-primary-alt"
          />)
        }
      </Section>

      {/*<Section title="In-game content" icon={BoxIcon}>*/}
      {/*</Section>*/}

      {/* Related projects / custom sections? */}

      <Section title={t('license.title')} icon={ScaleIcon} className="flex flex-row flex-wrap gap-4">
        <LicenseBadge name={t('license.project')} icon={PencilRulerIcon}>
          {platformProject.license ? (
              platformProject.license.id == ARRNoLicense
                ?
                <div className="m-auto flex flex-row gap-2 items-center">
                  <CopyrightIcon className="w-4 mb-0.5"/>
                  <PageLink href="https://choosealicense.com/no-permission" target="_blank">
                    {t('license.arr')}
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
              {t('license.unknown')}
            </p>
          }
        </LicenseBadge>
        <LicenseBadge name={t('license.wiki')} icon={BookOpenTextIcon}>
          <span className="text-base text-center">
            {t.rich('license.default', {
              link: (chunks) => <PageLink href="/about/tos#copyright-policy" className="!text-base" target="_blank">{chunks}</PageLink>,
              license: () => <PageLink className="!text-base" href={DEFAULT_WIKI_LICENSE.url} target="_blank">{DEFAULT_WIKI_LICENSE.name}</PageLink>
            })}
          </span>
        </LicenseBadge>
      </Section>
    </div>
  )
}