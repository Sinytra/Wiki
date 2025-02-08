'use client'

import {Project} from "@/lib/service";
import {PlatformProject} from "@/lib/platforms";
import {Button} from "@/components/ui/button";
import {BookMarkedIcon, BoxIcon, Grid3X3Icon, HammerIcon, HomeIcon, LayoutGridIcon} from "lucide-react";
import {usePathname} from "@/lib/locales/routing";
import {cn} from "@/lib/utils";

function SubPage({title, icon: Icon, path}: { title: string; icon: any; path: string }) {
  const pathName = usePathname();
  const active = pathName.endsWith('/' + path);

  return (
    <a href={`./docs/` + path}>
      <Button variant="ghost" size="sm" className={cn('h-7! px-2!', active && 'bg-secondary')}>
        <Icon className="w-4 h-4 mr-2"/>
        <span>{title}</span>
      </Button>
    </a>
  )
}

export default function DocsSubNavBar({project, platformProject}: {project: Project, platformProject: PlatformProject}) {
  return (
    <div className="w-full bg-primary-alt/60 border-b border-tertiary flex flex-row items-center justify-between p-2">
      <div className="flex flex-row gap-2 items-center">
        <img src={platformProject.icon_url} alt="Logo" className="rounded-sm h-6" />
        <span className="text-base text-primary font-medium">{project.name}</span>
      </div>

      <div className="flex flex-row gap-2 items-center">
        <SubPage title="Home" icon={HomeIcon} path="home" />
        <SubPage title="Documentation" icon={BookMarkedIcon} path="pages" />
        <SubPage title="Content" icon={BoxIcon} path="content" />
        <SubPage title="Recipes" icon={LayoutGridIcon} path="recipes" />
        <SubPage title="Developers" icon={HammerIcon} path="devs" />
      </div>
    </div>
  )
}