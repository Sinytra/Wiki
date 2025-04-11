import DocsGuideFileTreeSidebar from "@/components/docs/side/guide/DocsGuideFileTreeSidebar";
import {FileTree, Project} from "@/lib/service";
import ProjectDocsMobileHeader from "@/components/docs/ProjectDocsMobileHeader";

interface Props {
  title: string;
  project: Project;
  version: string;
  locale: string;
  tree: FileTree;
  showRightSidebar?: boolean;
  children: any;

  rightSidebar?: any;
  footer: any;
}

export default function DocsInnerLayoutClient({title, project, version, rightSidebar, footer, tree, showRightSidebar, children}: Props) {
  return <>
    <ProjectDocsMobileHeader showRightSidebar={showRightSidebar}>
      {title}
    </ProjectDocsMobileHeader>

    {/* Main Content Area */}
    <div className="flex flex-row flex-1 justify-between gap-4 w-full max-w-[1632px]">
      {/* Left Sidebar */}
      <DocsGuideFileTreeSidebar slug={project.id} version={version} tree={tree}/>

      {/* Main Content */}
      <main className="flex-1 overflow-auto
                       mt-4 sm:mt-0
                       pb-6 sm:pt-4 lg:pt-2 px-2 lg:px-0
                       min-h-[86vh] sm:min-h-[auto] sm:max-w-5xl">
        {children}
      </main>

      {/* Right Sidebar */}
      {rightSidebar}
    </div>

    {/* Footer */}
    {footer}
  </>
}