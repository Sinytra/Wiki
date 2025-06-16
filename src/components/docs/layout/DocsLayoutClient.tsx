"use client";

import {ReactNode} from "react";
import DocsSubNavBar from "@/components/docs/layout/DocsSubNavBar";
import {PlatformProject} from "@repo/platforms";
import {Project} from "@repo/shared/types/service";

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

      <div className="flex flex-1 flex-col items-center bg-primary text-primary">
        {children}
      </div>
    </div>
  );
}