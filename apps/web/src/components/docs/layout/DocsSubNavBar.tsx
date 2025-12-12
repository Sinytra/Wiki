'use client'

import {PlatformProject} from "@repo/shared/platforms";
import {Button} from "@repo/ui/components/button";
import {BookMarkedIcon, BoxIcon, HomeIcon} from "lucide-react";
import {LocaleLink, usePathname} from "@/lib/locales/routing";
import {cn} from "@repo/ui/lib/utils";
import {useParams} from "next/navigation";
import DocsVersionSelector from "@/components/docs/versions/DocsVersionSelector";
import * as React from "react";
import LanguageSelect from "@/components/navigation/LanguageSelect";
import SubMobileNav from "@/components/navigation/header/SubMobileNav";
import {Project, ProjectWithInfo} from "@repo/shared/types/service";
import ImageWithFallback from "@/components/util/ImageWithFallback";

function SubPage({title, icon: Icon, path, disabled}: { title: string; icon: any; path: string; disabled?: boolean }) {
  const pathName = usePathname();
  const params = useParams();
  const parts = pathName.split("/");
  const active = parts.length == 4 && path.length == 0 || parts.length >= 5 && parts[4] == path;

  return (
    <LocaleLink href={`/project/${params.slug}/${params.version}/${path}`}
                className={cn('w-full sm:w-fit', disabled && 'pointer-events-none')}
    >
      <Button variant="ghost" size="sm" className={cn('h-8! w-full rounded-sm px-2! sm:h-7! sm:w-fit', active && `
        bg-secondary
      `)}
              disabled={disabled}>
        <Icon className="mr-auto h-4 w-4 sm:mr-2"/>
        <span className="mr-auto text-sm sm:mr-0">{title}</span>
      </Button>
    </LocaleLink>
  )
}

function DocsSubNavProjectTitle({project, platformProject}: {
  project: Project | ProjectWithInfo;
  platformProject: PlatformProject;
}) {
  return (
    <div className="flex flex-row items-center gap-2 overflow-hidden">
      <ImageWithFallback src={platformProject.icon_url} alt="Logo" className="h-6 rounded-sm"
                         width={24} height={24}/>
      <span className="overflow-hidden text-base font-medium text-ellipsis whitespace-nowrap text-primary">
        {project.name}
      </span>
    </div>
  )
}

function MobileDocsSubNavProjectTitle({project, platformProject}: {
  project: Project | ProjectWithInfo;
  platformProject: PlatformProject;
}) {
  return (
    <div className="flex flex-col items-center gap-2 overflow-hidden">
      <img src={platformProject.icon_url} alt="Logo" className="mb-2 size-12 rounded-sm"/>
      <span className="overflow-hidden text-base font-medium text-ellipsis whitespace-nowrap text-primary">
        {project.name}
      </span>
      <blockquote className="line-clamp-2 text-sm text-secondary">
        {platformProject.summary}
      </blockquote>
    </div>
  )
}

function DocsSubNavBarLinks({project, locale, version}: {
  project: ProjectWithInfo;
  locale: string;
  version: string;
}) {
  const showVersions = project.versions && project.versions.length > 0;
  const showLocales = project.locales && project.locales.length > 0;

  // TODO Localization
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-2">
      <SubPage title="Home" icon={HomeIcon} path=""/>
      <SubPage title="Documentation" icon={BookMarkedIcon} path="docs"/>
      {project.info.contentCount > 0 &&
        <SubPage title="Content" icon={BoxIcon} path="content"/>
      }
      {/*<SubPage title="Recipes" icon={AnvilIcon} path="recipes" disabled/>*/}
      {/*<SubPage title="Developers" icon={HammerIcon} path="devs" disabled/>*/}

      {(showVersions || showLocales) &&
        <>
            <div className="verticalSeparator hidden! sm:inline-flex!"/>
            <hr className="w-full border-tertiary sm:hidden"/>
        </>
      }

      {showVersions &&
        <DocsVersionSelector version={version} versions={project.versions!}/>
      }
      {showLocales &&
        <LanguageSelect locale={locale} locales={project.locales!} minimal/>
      }
    </div>
  )
}

export default function DocsSubNavBar({project, platformProject, locale, version}: {
  project: ProjectWithInfo;
  platformProject: PlatformProject;
  locale: string;
  version: string;
}) {
  return (
    <div className="fixed left-0 z-40 w-full border-y border-tertiary border-t-tertiary-dim bg-primary-dim">
      <div className="mx-auto flex w-full max-w-[120rem] flex-row items-center justify-between px-4 py-2 sm:py-1.5">
        <DocsSubNavProjectTitle project={project} platformProject={platformProject}/>

        <div className="hidden sm:block">
          <DocsSubNavBarLinks project={project} locale={locale} version={version}/>
        </div>

        <SubMobileNav>
          <div className="flex flex-col gap-8">
            <MobileDocsSubNavProjectTitle project={project} platformProject={platformProject}/>

            <DocsSubNavBarLinks project={project} locale={locale} version={version}/>
          </div>
        </SubMobileNav>
      </div>
    </div>
  )
}