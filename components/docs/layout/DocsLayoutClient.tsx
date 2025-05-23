"use client";

import {ReactNode} from "react";
import DocsSubNavBar from "@/components/docs/layout/DocsSubNavBar";
import {Project} from "@/lib/service";
import {PlatformProject} from "@/lib/platforms";

interface DocsLayoutClientProps {
  locale: string;
  version: string;
  project: Project;
  platformProject: PlatformProject;
  children: ReactNode;
}

export default function DocsLayoutClient({project, platformProject, locale, version, children}: DocsLayoutClientProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="h-subnav">
        <DocsSubNavBar project={project} platformProject={platformProject} locale={locale} version={version} />
      </div>

      <div className="flex flex-col items-center flex-1 bg-primary text-primary">
        {children}
      </div>
    </div>
  );
}