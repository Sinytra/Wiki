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
      <main className="flex-1 pb-6 sm:pt-2 overflow-auto min-h-[86vh] sm:min-h-[auto] sm:max-w-5xl mt-4 sm:mt-0">
        {children}
      </main>

      {/* Right Sidebar */}
      {rightSidebar}
    </div>

    {/* Footer */}
    {footer}
  </>
}