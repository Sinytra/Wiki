'use client'

import {Project, ProjectWithInfo} from "@/lib/service";
import {PlatformProject} from "@/lib/platforms";
import {Button} from "@/components/ui/button";
import {BookMarkedIcon, BoxIcon, HomeIcon, LayoutGridIcon} from "lucide-react";
import {Link, usePathname} from "@/lib/locales/routing";
import {cn} from "@/lib/utils";
import {useParams} from "next/navigation";
import DocsVersionSelector from "@/components/docs/versions/DocsVersionSelector";
import * as React from "react";
import LanguageSelect from "@/components/navigation/LanguageSelect";
import SubMobileNav from "@/components/navigation/header/SubMobileNav";

function SubPage({title, icon: Icon, path, disabled}: { title: string; icon: any; path: string; disabled?: boolean }) {
  const pathName = usePathname();
  const params = useParams();
  const parts = pathName.split("/");
  const active = parts.length == 4 && path.length == 0 || parts.length >= 5 && parts[4] == path;

  return (
    <Link href={`/project/${params.slug}/${params.version}/${path}`}
          className={cn('w-full sm:w-fit', disabled && 'pointer-events-none')}
    >
      <Button variant="ghost" size="sm" className={cn('w-full sm:w-fit h-8! sm:h-7! px-2! rounded-sm', active && 'bg-secondary')}
              disabled={disabled}>
        <Icon className="w-4 h-4 mr-auto sm:mr-2"/>
        <span className="text-sm mr-auto sm:mr-0">{title}</span>
      </Button>
    </Link>
  )
}

function DocsSubNavProjectTitle({project, platformProject}: {
  project: Project | ProjectWithInfo;
  platformProject: PlatformProject;
}) {
  return (
    <div className="flex flex-row gap-2 items-center overflow-hidden">
      <img src={platformProject.icon_url} alt="Logo" className="rounded-sm h-6"/>
      <span className="text-base text-primary font-medium whitespace-nowrap text-ellipsis overflow-hidden">
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
    <div className="flex flex-col gap-2 items-center overflow-hidden">
      <img src={platformProject.icon_url} alt="Logo" className="mb-2 size-12 rounded-sm"/>
      <span className="text-base text-primary font-medium whitespace-nowrap text-ellipsis overflow-hidden">
        {project.name}
      </span>
      <blockquote className="text-secondary text-sm line-clamp-2">
        {platformProject.summary}
      </blockquote>
    </div>
  )
}

function DocsSubNavBarLinks({project, locale, version}: {
  project: Project | ProjectWithInfo;
  locale: string;
  version: string;
}) {
  const showVersions = project.versions && project.versions.length > 0;
  const showLocales = project.locales && project.locales.length > 0;

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 items-center">
      <SubPage title="Home" icon={HomeIcon} path=""/>
      <SubPage title="Documentation" icon={BookMarkedIcon} path="docs"/>
      {'info' in project && project.info.contentCount > 0 &&
        <SubPage title="Content" icon={BoxIcon} path="content"/>
      }
      <SubPage title="Recipes" icon={LayoutGridIcon} path="recipes" disabled/>
      {/*<SubPage title="Developers" icon={HammerIcon} path="devs" disabled/>*/}

      {(showVersions || showLocales) &&
        <>
            <div className="hidden! sm:inline-flex! verticalSeparator"/>
            <hr className="w-full border-tertiary sm:hidden" />
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
  project: Project | ProjectWithInfo;
  platformProject: PlatformProject;
  locale: string;
  version: string;
}) {
  return (
    <div className="fixed w-full left-0 bg-primary-dim z-40 border-y border-t-tertiary-dim border-tertiary">
      <div className="max-w-[120rem] w-full mx-auto flex flex-row items-center justify-between px-4 py-2 sm:py-1.5">
        <DocsSubNavProjectTitle project={project} platformProject={platformProject} />

        <div className="hidden sm:block">
          <DocsSubNavBarLinks project={project} locale={locale} version={version}/>
        </div>

        <SubMobileNav>
          <div className="flex flex-col gap-8">
            <MobileDocsSubNavProjectTitle project={project} platformProject={platformProject} />

            <DocsSubNavBarLinks project={project} locale={locale} version={version}/>
          </div>
        </SubMobileNav>
      </div>
    </div>
  )
}