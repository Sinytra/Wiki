import {CopyrightIcon, ExternalLinkIcon, MilestoneIcon, TagIcon, UserIcon} from "lucide-react";
import {
  getPlatformProjectInformation,
  ProjectCategories,
  ProjectTypeIcons
} from "@/components/docs/project-info/projectInfo";
import LinkTextButton from "@/components/ui/link-text-button";
import MetadataGrid from "@/components/docs/project-metadata/MetadataGrid";
import MetadataRowKey, {IconRow} from "@/components/docs/project-metadata/MetadataRowKey";
import DocsSidebarTitle from "@/components/docs/layout/DocsSidebarTitle";
import platforms, {PlatformProject} from "@/lib/platforms";
import {getTranslations} from "next-intl/server";
import {useTranslations} from "next-intl";
import ImageWithFallback from "@/components/util/ImageWithFallback";
import {Project} from "@/lib/service";
import CurseForgeIcon from "@/components/ui/icons/CurseForgeIcon";
import ModrinthIcon from "@/components/ui/icons/ModrinthIcon";
import GitHubIcon from "@/components/ui/icons/GitHubIcon";

interface Props {
  project: Project;
  platformProj: PlatformProject;
}

function ProjectTags({tags}: { tags: string[] }) {
  const t = useTranslations('ProjectCategories');

  return (
      <div className="flex flex-row items-center justify-end gap-2">
        {tags.filter(t => ProjectCategories[t] !== undefined).map(tag => {
          const Component = ProjectCategories[tag];
          return (
              <div title={t(tag as any)} key={tag}>
                <Component className="w-4 h-4"/>
              </div>
          );
        })}
      </div>
  );
}

function MetadataLinkRowKey({title, icon, href}: { title: string; icon?: any; href: string; }) {
  return (
      <LinkTextButton href={href} target="_blank"
                      className="!pb-0.5 hover:no-underline hover:border-b border-foreground rounded-b-none hover:mb-[-1px]">
        <div className="w-full inline-flex items-start justify-between">
          <IconRow icon={icon}>{title}</IconRow>

          <div className="font-light text-end">
            <ExternalLinkIcon className="w-4 h-4 ml-2"/>
          </div>
        </div>
      </LinkTextButton>
  )
}

export default async function ProjectInfo({project, platformProj}: Props) {
  const info = await getPlatformProjectInformation(platformProj);
  const t = await getTranslations('DocsProjectInfo');
  const u = await getTranslations('ProjectDocsPlaceholder');
  const v = await getTranslations('ProjectTypes');
  const summary = platformProj.is_placeholder ? u('summary') : platformProj.summary;

  return (
      <div className="flex flex-col">
        <DocsSidebarTitle>
          {t('title')}
        </DocsSidebarTitle>

        <div className="mb-6 border border-accent m-2 rounded-sm">
          <ImageWithFallback src={platformProj.icon_url} width={128} height={128} className="m-4 mx-auto rounded-sm"
                             alt="Logo"/>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-center font-medium text-lg">{platformProj.name}</span>
          <span className="docsSourceDesc text-sm text-muted-foreground text-center">{summary}</span>
        </div>

        <div className="mx-1 mt-6">
          <MetadataGrid>
            <MetadataRowKey icon={ProjectTypeIcons[project.type]} title={t('type')}>
              {v(project.type)}
            </MetadataRowKey>
            <MetadataRowKey icon={UserIcon} title={t('author')}>
              <div className="myItems flex flex-row flex-wrap justify-end">
                {info.authors.map(a => (
                    <div key={a.name}>
                      <LinkTextButton href={a.url} target="_blank">{a.name}</LinkTextButton>
                    </div>
                ))}
              </div>
            </MetadataRowKey>
            <MetadataRowKey icon={TagIcon} title={t('tags')}>
              <ProjectTags tags={platformProj.categories}/>
            </MetadataRowKey>
            <MetadataRowKey icon={MilestoneIcon} title={t('latest.title')}>
              {info.latest_version}
            </MetadataRowKey>
            <MetadataRowKey icon={CopyrightIcon} title={t('license.title')}>
              {platformProj?.license?.url
                  ?
                  <LinkTextButton href={platformProj.license.url}>{info.license.name}</LinkTextButton>
                  :
                  <>{info.license.name}</>
              }
            </MetadataRowKey>

            <hr className="my-1"/>

            {project.platforms.curseforge &&
                <MetadataLinkRowKey title="CurseForge" icon={CurseForgeIcon}
                                    href={platforms.getProjectURL('curseforge', project.platforms.curseforge)}/>
            }
            {project.platforms.modrinth &&
                <MetadataLinkRowKey title="Modrinth" icon={ModrinthIcon}
                                    href={platforms.getProjectURL('modrinth', project.platforms.modrinth)}/>
            }
            {platformProj.source_url &&
                <MetadataLinkRowKey title="GitHub" icon={GitHubIcon} href={platformProj.source_url}/>
            }

          </MetadataGrid>
        </div>
      </div>
  )
}