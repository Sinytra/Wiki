'use client'

import {Project, ProjectWithInfo} from "@/lib/service";
import {PlatformProject} from "@/lib/platforms";
import {Button} from "@/components/ui/button";
import {BookMarkedIcon, BoxIcon, HammerIcon, HomeIcon, LayoutGridIcon} from "lucide-react";
import {Link, usePathname} from "@/lib/locales/routing";
import {cn} from "@/lib/utils";
import {useParams} from "next/navigation";

function SubPage({title, icon: Icon, path}: { title: string; icon: any; path: string }) {
  const pathName = usePathname();
  const params = useParams();
  const parts = pathName.split("/");
  const active = parts.length == 4 && path.length == 0 || parts.length >= 5 && parts[4] == path;

  return (
    <Link href={`/project/${params.slug}/${params.version}/${path}`}>
      <Button variant="ghost" size="sm" className={cn('h-7! px-2! rounded-sm', active && 'bg-secondary')}>
        <Icon className="w-4 h-4 mr-2"/>
        <span>{title}</span>
      </Button>
    </Link>
  )
}

export default function DocsSubNavBar({project, platformProject}: {project: Project | ProjectWithInfo, platformProject: PlatformProject}) {
  return (
    <div className="fixed w-full left-0 bg-primary-dim z-50 border-y border-t-tertiary-dim border-tertiary">
      <div className="max-w-[120rem] w-full mx-auto flex flex-row items-center justify-between px-4 py-2">
        <div className="flex flex-row gap-2 items-center">
          <img src={platformProject.icon_url} alt="Logo" className="rounded-sm h-6" />
          <span className="text-base text-primary font-medium">{project.name}</span>
        </div>

        <div className="flex flex-row gap-2 items-center">
          <SubPage title="Home" icon={HomeIcon} path="" />
          <SubPage title="Documentation" icon={BookMarkedIcon} path="docs" />
          {'info' in project && project.info.contentCount > 0 &&
            <SubPage title="Content" icon={BoxIcon} path="content" />
          }
          <SubPage title="Recipes" icon={LayoutGridIcon} path="recipes" />
          <SubPage title="Developers" icon={HammerIcon} path="devs" />
        </div>
      </div>
    </div>
  )
}