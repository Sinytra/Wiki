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

function SubPage({title, icon: Icon, path, disabled}: { title: string; icon: any; path: string; disabled?: boolean }) {
  const pathName = usePathname();
  const params = useParams();
  const parts = pathName.split("/");
  const active = parts.length == 4 && path.length == 0 || parts.length >= 5 && parts[4] == path;

  return (
    <Link href={`/project/${params.slug}/${params.version}/${path}`} className={cn(disabled && 'pointer-events-none')}>
      <Button variant="ghost" size="sm" className={cn('h-7! px-2! rounded-sm', active && 'bg-secondary')}
              disabled={disabled}>
        <Icon className="w-4 h-4 mr-2"/>
        <span className="text-sm">{title}</span>
      </Button>
    </Link>
  )
}

export default function DocsSubNavBar({project, platformProject, locale, version}: {
  project: Project | ProjectWithInfo;
  platformProject: PlatformProject;
  locale: string;
  version: string;
}) {
  const showVersions = project.versions && project.versions.length > 0;
  const showLocales = project.locales && project.locales.length > 0;

  return (
    <div className="fixed w-full left-0 bg-primary-dim z-40 border-y border-t-tertiary-dim border-tertiary">
      <div className="max-w-[120rem] w-full mx-auto flex flex-row items-center justify-between px-4 py-1.5">
        <div className="flex flex-row gap-2 items-center">
          <img src={platformProject.icon_url} alt="Logo" className="rounded-sm h-6"/>
          <span className="text-base text-primary font-medium">{project.name}</span>
        </div>

        <div className="flex flex-row gap-2 items-center">
          <SubPage title="Home" icon={HomeIcon} path=""/>
          <SubPage title="Documentation" icon={BookMarkedIcon} path="docs"/>
          {'info' in project && project.info.contentCount > 0 &&
            <SubPage title="Content" icon={BoxIcon} path="content"/>
          }
          <SubPage title="Recipes" icon={LayoutGridIcon} path="recipes" disabled/>
          {/*<SubPage title="Developers" icon={HammerIcon} path="devs" disabled/>*/}

          {(showVersions || showLocales) &&
            <div className="verticalSeparator"/>
          }

          {showVersions &&
            <DocsVersionSelector version={version} versions={project.versions!}/>
          }
          {showLocales &&
            <LanguageSelect locale={locale} locales={project.locales!} minimal />
          }
        </div>
      </div>
    </div>
  )
}