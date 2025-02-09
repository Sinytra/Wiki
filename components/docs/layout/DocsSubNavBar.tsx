'use client'

import {Project} from "@/lib/service";
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
    <Link href={!active ? `/project/${params.slug}/${params.version}/${path}` : '#'}>
      <Button variant="ghost" size="sm" className={cn('h-7! px-2! rounded-sm', active && 'bg-secondary')}>
        <Icon className="w-4 h-4 mr-2"/>
        <span>{title}</span>
      </Button>
    </Link>
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
        <SubPage title="Home" icon={HomeIcon} path="" />
        <SubPage title="Documentation" icon={BookMarkedIcon} path="docs" />
        <SubPage title="Content" icon={BoxIcon} path="content" />
        <SubPage title="Recipes" icon={LayoutGridIcon} path="recipes" />
        <SubPage title="Developers" icon={HammerIcon} path="devs" />
      </div>
    </div>
  )
}