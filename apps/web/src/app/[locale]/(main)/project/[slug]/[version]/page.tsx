import {setContextLocale} from "@/lib/locales/routing";
import service from "@/lib/service";
import {notFound} from "next/navigation";
import platforms, {PlatformProject} from "@repo/shared/platforms";
import projectInfo, {ResolvedLicense} from "@/lib/project/projectInfo";
import {ProjectCategories} from '@/lib/project/projectTypes';
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
import CurseForgeColorIcon from "@repo/ui/icons/CurseForgeColorIcon";
import ModrinthIcon from "@repo/ui/icons/ModrinthIcon";
import GitHubIcon from "@repo/ui/icons/GitHubIcon";
import {cn} from "@repo/ui/lib/utils";
import PageLink from "@/components/docs/PageLink";
import DiscordIcon from "@repo/ui/icons/DiscordIcon";
import {useTranslations} from "next-intl";
import {DEFAULT_WIKI_LICENSE} from "@repo/shared/constants";
import TooltipText from "@/components/docs/shared/util/TooltipText";
import DocsSubpageTitle from "@/components/docs/layout/DocsSubpageTitle";
import {getTranslations} from "next-intl/server";
import {Metadata, ResolvingMetadata} from "next";
import {ProjectRouteParams} from "@repo/shared/types/routes";
import DocsHomepage from "@/components/docs/DocsHomepage";

export async function generateMetadata(
  props: { params: Promise<ProjectRouteParams> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const {slug, version, locale} = await props.params;
  const ctx = {id: slug, version, locale};
  const project = await service.getProject(ctx);
  if (!project) {
    return {title: (await parent).title?.absolute};
  }

  const platformProject = await platforms.getPlatformProject(project);
  return {
    other: {
      docs_source_mod: platformProject.name,
      docs_source_icon: platformProject.icon_url
    }
  };
}

interface PageProps {
  params: Promise<ProjectRouteParams>;
}

function Section({title, icon: Icon, children, className}: {
  title: string,
  icon: any;
  children?: any;
  className?: string
}) {
  return (
    <div className="mb-2 flex flex-col gap-4">
      <h2 className="flex flex-row items-center gap-2 border-b border-secondary pb-2 text-xl">
        <Icon className="h-5 w-5"/>
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
        className={`
          flex w-fit min-w-[17rem] flex-col gap-2 rounded-sm border border-secondary-dim bg-primary-alt/50 p-3
          hover:bg-secondary/20
        `}>
        <div className="flex flex-row items-center gap-3 text-lg">
          <Icon className="h-5 w-5"/>
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
    <a href={href} target="_blank" rel="noreferrer">
      <div
        className={cn(`
          flex max-w-48 min-w-36 cursor-pointer flex-row items-center justify-center gap-2 rounded-sm border
          bg-gradient-to-b p-2 hover:to-60% sm:p-3
        `, className)}>
        <Icon className="size-4 shrink-0 sm:size-5"/>
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
          className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-alt"
        >
          {categories(tag as any)}
        </span>
      ))}
    </div>
  )
}

function LicenseBadge({name, icon: Icon, children}: { name: string; icon: any; children?: any }) {
  return (
    <div className="flex max-w-84 min-w-72 flex-col gap-2 rounded-sm border border-secondary/50 bg-primary-dim p-4">
      <div className="flex flex-row items-center gap-3 text-base font-medium">
        <Icon className="size-5 shrink-0"/>
        <span>{name}</span>
      </div>

      <hr className="mb-1"/>

      {children}
    </div>
  )
}

function ProjectLicenseBody({license}: { license: ResolvedLicense | undefined | null }) {
  const t = useTranslations('ProjectHomepage');

  // None / unknown license
  if (!license) {
    return (
      <p className="m-auto flex flex-row items-center gap-2 text-secondary">
        <HelpCircleIcon className="size-4"/>
        {t('license.unknown')}
      </p>
    );
  }

  // All Rights Reserved
  if (license.isDefaultArrLicense) {
    return (
      <div className="m-auto flex flex-row items-center gap-2">
        <CopyrightIcon className="mb-0.5 w-4"/>
        <PageLink href="https://choosealicense.com/no-permission" target="_blank">
          {t('license.arr')}
        </PageLink>
      </div>
    );
  }

  const Wrapper = license.url
    ? ({children}: any) => (
      <PageLink href={license.url!} className="text-center" target="_blank">
        {children}
      </PageLink>
    )
    : ({children}: any) => (children);

  return (
    <div className="m-auto flex flex-row items-center gap-2 text-center">
      <Wrapper>
        {license.name}
      </Wrapper>
    </div>
  )
}

export default async function ProjectHomepage(props: PageProps) {
  const {slug, version, locale} = await props.params;
  const ctx = {id: slug, version, locale};
  setContextLocale(locale);
  const t = await getTranslations('ProjectHomepage');

  const project = await service.getProject(ctx);
  if (!project) {
    return notFound();
  }

  const platformProject = await platforms.getPlatformProject(project);
  const info = await projectInfo.getPlatformProjectInformation(project, platformProject);

  const descriptionPlaceholder = (
    <div className="min-h-16 text-secondary">
      {t('description.placeholder')}
    </div>
  );

  return (
    <div className="mx-auto mt-1 mb-5 flex w-full max-w-5xl flex-col gap-6">
      <DocsSubpageTitle
        title={project.name}
        description={platformProject.summary}
        icon_url={platformProject.icon_url}
        local={project.local}
      />

      <div className="flex flex-col gap-4">
        <div>
          {t.rich('overview.intro', {
            project: () => <span className="font-medium">{project.name}</span>,
            type: project.type,
            authors: () => (
              <div className="inline-block">
                {info.authors.map((a, idx) => (
                  <div key={a.name} className="inline-block">
                    <PageLink href={a.url} target="_blank">
                      {a.name}
                    </PageLink>
                    {idx != info.authors.length - 1 &&
                      <span>,&nbsp;</span>}
                  </div>
                ))}
              </div>
            )
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

        <div className="flex flex-row gap-2 text-sm text-secondary">
          <span>
            <TagIcon className="mr-2 inline-block h-4 w-4"/>
            {t('overview.tags')}
          </span>
          <ProjectTags project={platformProject}/>
        </div>
      </div>

      {platformProject.description.length > 0 &&
        <Section title={t('description.title')} icon={BookOpenIcon}>
            <DocsHomepage project={project} platformProject={platformProject} ctx={ctx}
                          placeholder={descriptionPlaceholder}
                          errorPlaceholder={descriptionPlaceholder}
                          wrapper={content => (
                            <ExpandableDescription>
                              {content}
                            </ExpandableDescription>
                          )}
            />
        </Section>
      }

      <Section title={t('navigation.title')} icon={MapIcon} className="flex flex-row flex-wrap gap-4">
        <SubpageLink title={t('navigation.docs.title')} icon={BookMarkedIcon}
                     desc={t('navigation.docs.desc', {pages: project.info.pageCount})}
                     href="docs"/>
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
                        href={platforms.getProjectURL('curseforge', project.platforms.curseforge, project.type)}
                        className="border-brand-curseforge/40 from-primary to-brand-curseforge/20"/>
        }
        {project.platforms.modrinth &&
          <ExternalLink text="Modrinth" icon={ModrinthIcon}
                        href={platforms.getProjectURL('modrinth', project.platforms.modrinth, project.type)}
                        className={`
                          border-brand-modrinth/40 from-primary to-brand-modrinth/20 [&>svg]:text-brand-modrinth
                        `}
          />
        }
        {platformProject.discord_url &&
          <ExternalLink text="Discord" icon={DiscordIcon}
                        href={platformProject.discord_url}
                        className="border-brand-discord/70 from-primary to-brand-discord/20 [&>svg]:text-brand-discord"
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

      <Section title={t('license.title')} icon={ScaleIcon} className="flex flex-row flex-wrap gap-4">
        <LicenseBadge name={t('license.project')} icon={PencilRulerIcon}>
          <ProjectLicenseBody license={info.licenses?.project} />
        </LicenseBadge>
        <LicenseBadge name={t('license.wiki')} icon={BookOpenTextIcon}>
          <span className="text-center text-base">
            {t.rich('license.default', {
              link: (chunks: any) => <PageLink href="/about/tos#copyright-policy" className="!text-base"
                                               target="_blank">{chunks}</PageLink>,
              license: () => <PageLink className="!text-base" href={DEFAULT_WIKI_LICENSE.url}
                                       target="_blank">{DEFAULT_WIKI_LICENSE.name}</PageLink>
            })}
          </span>
        </LicenseBadge>
      </Section>
    </div>
  )
}