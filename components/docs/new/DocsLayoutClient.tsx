"use client";

import {ReactNode, useState} from "react";
import DocsMobileHeader from "@/components/docs/new/DocsMobileHeader";
import DocsLeftSidebar from "@/components/docs/new/DocsLeftSidebar";
import DocsPageFooter from "@/components/docs/new/DocsPageFooter";
import DocsRightSidebar from "@/components/docs/new/DocsRightSidebar";
import {PlatformProject} from "@/lib/platforms";
import {FileTree, Project} from "@/lib/service";
import {ProjectDisplayInformation} from "@/components/docs/project-info/projectInfo";

interface DocsLayoutClientProps {
  project: Project;
  platformProject: PlatformProject;
  projectInfo: ProjectDisplayInformation;
  version: string;
  locale: string;
  tree: FileTree;
  children: ReactNode;
}

export default function DocsLayoutClient({
                                           project,
                                           platformProject,
                                           projectInfo,
                                           version,
                                           locale,
                                           tree,
                                           children,
                                         }: DocsLayoutClientProps) {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);

  const toggleLeftSidebar = () => setIsLeftSidebarOpen(!isLeftSidebarOpen);
  const toggleRightSidebar = () => setIsRightSidebarOpen(!isRightSidebarOpen);
  const toggleChangelog = () => setIsChangelogOpen(!isChangelogOpen);

  const changelogEntries = [
    {
      version: "1.2.0",
      date: "2023-12-01",
      changes: ["Added new feature X", "Fixed bug Y", "Improved performance of Z"]
    },
    {
      version: "1.1.0",
      date: "2023-11-15",
      changes: ["Introduced feature A", "Updated dependency B", "Removed deprecated function C"]
    },
    {version: "1.0.0", date: "2023-11-01", changes: ["Initial release"]},
  ];

  return (
    <div className="flex flex-col flex-1 bg-background text-foreground">
      {/* Header */}
      <DocsMobileHeader
        isLeftSidebarOpen={isLeftSidebarOpen}
        isRightSidebarOpen={isRightSidebarOpen}
        toggleLeftSidebar={toggleLeftSidebar}
        toggleRightSidebar={toggleRightSidebar}
      />

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <DocsLeftSidebar slug={project.id} version={version} tree={tree} isOpen={isLeftSidebarOpen}
                         toggleSidebar={toggleLeftSidebar}/>

        {/* Main Content TODO changelog */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>

        {/* Right Sidebar */}
        <DocsRightSidebar project={project} platformProject={platformProject} projectInfo={projectInfo}
                          isOpen={isRightSidebarOpen} toggleSidebar={toggleRightSidebar}/>
      </div>

      {/* Footer */}
      <DocsPageFooter isChangelogOpen={isChangelogOpen} toggleChangelog={toggleChangelog}/>
    </div>
  );
}